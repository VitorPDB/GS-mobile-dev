import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { changedCritical, fetchDashboard, parseSnapshot, sendReaction, validateUrl } from './sync';
import { installationId } from './identity';
import type { Dashboard, Snapshot, RiskAlert, Vote } from './types';

const cacheKey=(url:string,client:string|null)=>`urip:snapshot:v2:${url}:${client||'public'}`;
export function useMonitoring() {
  const defaultUrl=Platform.OS==='android'?'http://10.0.2.2:8080':'http://localhost:8080';
  const configured=process.env.EXPO_PUBLIC_API_URL || defaultUrl;
  let resolved:string;
  let configurationWarning='';
  try {resolved=validateUrl(configured);}
  catch {resolved=defaultUrl;configurationWarning='A configuração do serviço é inválida. Usando o endereço local padrão.';}
  const url=resolved;
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
  const [clientId,setClientId]=useState<string|null>(null);
  const [status,setStatus]=useState<'loading'|'online'|'offline'>('loading');
  const [ready,setReady]=useState(false);
  const [busy,setBusy]=useState(false);
  const [votingId,setVotingId]=useState<string|null>(null);
  const [latency,setLatency]=useState<number|null>(null);
  const [notice,setNotice]=useState('');
  const [storageWarning,setStorageWarning]=useState('');
  const dataRef=useRef<Dashboard|null>(null);
  const generation=useRef(0);
  const controller=useRef<AbortController|null>(null);
  const inFlight=useRef(false);
  const mutating=useRef(false);
  useEffect(()=>{
    let alive=true;
    (async()=>{
      let identity:string|null=null;
      try {identity=await installationId(AsyncStorage,randomUUID);}
      catch {if(alive)setStorageWarning('Votação indisponível: não foi possível salvar o identificador deste dispositivo.');}
      try {
        const cached=parseSnapshot(await AsyncStorage.getItem(cacheKey(url,identity)));
        if(alive){setClientId(identity);setSnapshot(cached);dataRef.current=cached?.data||null;}
      } catch {if(alive){setClientId(identity);setStorageWarning('Não foi possível acessar os dados salvos neste dispositivo.');}}
      finally {if(alive)setReady(true);}
    })();
    return()=>{alive=false;};
  },[url]);
  const refresh=useCallback(async()=>{
    if(!ready||inFlight.current||mutating.current)return;
    const currentGeneration=generation.current;
    inFlight.current=true;setBusy(true);
    const request=new AbortController();controller.current=request;
    const started=Date.now();
    try {
      const data=await fetchDashboard(url,request.signal,clientId);
      if(currentGeneration!==generation.current||request.signal.aborted)return;
      const changed=changedCritical(dataRef.current,data);
      const next={data,savedAt:new Date().toISOString()};
      dataRef.current=data;setSnapshot(next);setStatus('online');setLatency(Date.now()-started);
      if(changed.length)setNotice(`${changed.length} alerta(s) novo(s) ou com mudança de gravidade: ${changed.map(a=>a.title+' em '+a.district).join('; ')}.`);
      try {await AsyncStorage.setItem(cacheKey(url,clientId),JSON.stringify(next));}
      catch {setStorageWarning('Não foi possível salvar os dados para consulta após fechar o app.');}
    } catch {
      if(currentGeneration===generation.current&&!request.signal.aborted)setStatus('offline');
    } finally {
      if(currentGeneration===generation.current){inFlight.current=false;setBusy(false);}
    }
  },[url,ready,clientId]);
  useEffect(()=>{
    if(!ready)return;
    void refresh();
    const interval=setInterval(()=>{if(AppState.currentState!=='background')void refresh();},5000);
    const subscription=AppState.addEventListener('change',state=>{if(state==='active')void refresh();});
    return()=>{clearInterval(interval);subscription.remove();generation.current++;controller.current?.abort();inFlight.current=false;};
  },[refresh,ready]);
  const reactTo=useCallback(async(alert:RiskAlert,vote:Vote)=>{
    if(mutating.current)return;
    if(!clientId||status!=='online')throw new Error('Conecte-se para votar. Os dados salvos continuam disponíveis.');
    mutating.current=true;generation.current++;controller.current?.abort();inFlight.current=false;setBusy(false);setVotingId(alert.id);
    try {
      await sendReaction(url,alert.readingId,clientId,vote);
      mutating.current=false;
      await refresh();
    } finally {mutating.current=false;setVotingId(null);}
  },[url,clientId,status,refresh]);
  return {snapshot,status,busy,votingId,canVote:!!clientId&&status==='online',latency,notice,
    storageWarning:configurationWarning||storageWarning,refresh,reactTo,dismissNotice:()=>setNotice('')};
}
