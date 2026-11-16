import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changedCritical, fetchDashboard, parseSnapshot, validateUrl } from './sync';
import type { Dashboard, Snapshot } from './types';

const SETTINGS = 'vigia:api:v1';
const key = (url:string) => `vigia:snapshot:v1:${url}`;
export function useMonitoring() {
  const fallback = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');
  const [url,setUrl] = useState(fallback);
  const [snapshot,setSnapshot] = useState<Snapshot|null>(null);
  const [status,setStatus] = useState<'loading'|'online'|'offline'>('loading');
  const [ready,setReady] = useState(false);
  const [busy,setBusy] = useState(false);
  const [latency,setLatency] = useState<number|null>(null);
  const [notice,setNotice] = useState('');
  const [storageWarning,setStorageWarning] = useState('');
  const dataRef = useRef<Dashboard|null>(null);
  const generation = useRef(0);
  const controller = useRef<AbortController|null>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    let alive=true;
    (async()=>{
      let current=fallback;
      try {
        const saved=await AsyncStorage.getItem(SETTINGS);
        if(saved) { try { current=validateUrl(saved); } catch { /* ignore invalid setting */ } }
        const cached=parseSnapshot(await AsyncStorage.getItem(key(current)));
        if(alive) { setUrl(current); setSnapshot(cached); dataRef.current=cached?.data||null; }
      } catch { if(alive) setStorageWarning('Armazenamento indisponível. Os dados podem não persistir ao fechar o app.'); }
      finally { if(alive) setReady(true); }
    })();
    return ()=>{alive=false;};
  },[]);
  const refresh = useCallback(async()=>{
    if(!ready || inFlight.current) return;
    const currentGeneration=generation.current;
    inFlight.current=true; setBusy(true);
    const request=new AbortController(); controller.current=request;
    const started=Date.now();
    try {
      const data=await fetchDashboard(url,request.signal);
      if(currentGeneration!==generation.current || request.signal.aborted) return;
      const changed=changedCritical(dataRef.current,data);
      const next={data,savedAt:new Date().toISOString()};
      dataRef.current=data; setSnapshot(next); setStatus('online'); setLatency(Date.now()-started);
      if(changed.length) setNotice(`${changed.length} alerta(s) novo(s) ou com mudança de gravidade: ${changed.map(a=>a.title+' em '+a.district).join('; ')}.`);
      try { await AsyncStorage.setItem(key(url),JSON.stringify(next)); }
      catch { setStorageWarning('Não foi possível salvar os dados para consulta após fechar o app.'); }
    } catch {
      if(currentGeneration===generation.current && !request.signal.aborted) setStatus('offline');
      // A timeout aborts the internal fetch controller, so it also reaches this branch.
    } finally {
      if(currentGeneration===generation.current) { inFlight.current=false; setBusy(false); }
    }
  },[url,ready]);
  useEffect(()=>{
    if(!ready) return;
    void refresh();
    const interval=setInterval(()=>{if(AppState.currentState!=='background') void refresh();},5000);
    const subscription=AppState.addEventListener('change',state=>{if(state==='active') void refresh();});
    return ()=>{clearInterval(interval);subscription.remove();generation.current++;controller.current?.abort();inFlight.current=false;};
  },[refresh,ready]);
  const changeUrl=async(raw:string)=>{
    const next=validateUrl(raw);
    generation.current++; controller.current?.abort(); inFlight.current=false;
    setStatus('loading'); setBusy(false); setLatency(null); setNotice(''); setSnapshot(null); dataRef.current=null;
    try {
      await AsyncStorage.setItem(SETTINGS,next);
      const cached=parseSnapshot(await AsyncStorage.getItem(key(next)));
      setSnapshot(cached); dataRef.current=cached?.data||null;
    } catch { setStorageWarning('Endereço alterado nesta sessão; não foi possível salvar a configuração.'); }
    if(next===url) { setUrl(next); /* trigger through readiness below */ setReady(false); setTimeout(()=>setReady(true),0); }
    else setUrl(next);
  };
  return {url,snapshot,status,busy,latency,notice,storageWarning,refresh,changeUrl,dismissNotice:()=>setNotice('')};
}
