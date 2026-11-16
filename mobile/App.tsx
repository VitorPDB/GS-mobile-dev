import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import { useMonitoring } from './src/useMonitoring';
import { dark, light, Theme } from './src/theme';
import { RiskType, labels } from './src/types';
import { AlertRow } from './src/AlertRow';

type Tab='Painel'|'Atividade'|'Conexão';
function Button({label,onPress,theme:t,disabled=false}:{label:string;onPress:()=>void;theme:Theme;disabled?:boolean}) {
  return <Pressable accessibilityRole="button" accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[s.button,{backgroundColor:t.primary,opacity:disabled ? 0.55 : pressed ? 0.8 : 1}]}><Text style={{color:t.onPrimary,fontWeight:'700',fontSize:15}}>{label}</Text></Pressable>;
}
function Screen() {
  const t=useColorScheme()==='dark'?dark:light;
  const wide=useWindowDimensions().width>=900;
  const [tab,setTab]=useState<Tab>('Painel');
  const [filter,setFilter]=useState<RiskType|'ALL'>('ALL');
  const [draft,setDraft]=useState('');
  const [error,setError]=useState('');
  const [now,setNow]=useState(Date.now());
  const m=useMonitoring();
  useEffect(()=>{setDraft(m.url);},[m.url]);
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),5000);return()=>clearInterval(timer);},[]);
  const data=m.snapshot?.data;
  const alerts=data?.alerts.filter(a=>filter==='ALL'||a.type===filter)||[];
  const online=m.status==='online';
  const navigation=<View style={[wide?s.rail:s.nav,{backgroundColor:t.surface,borderColor:t.line}]}>
    {wide&&<View style={s.railBrand}><MaterialCommunityIcons accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" name="radar" color={t.primary} size={32}/><Text style={[s.brand,{color:t.text}]}>Vigia Urbana</Text><Text style={[s.body,{color:t.muted}]}>Seu bairro, acompanhado.</Text></View>}
    {(['Painel','Atividade','Conexão'] as Tab[]).map(item=><Pressable key={item} accessibilityLabel={item} accessibilityRole="tab" accessibilityState={{selected:tab===item}} onPress={()=>setTab(item)} style={[s.navItem,wide&&s.railItem,tab===item&&{backgroundColor:t.subtle}]}>
      <MaterialCommunityIcons accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" name={item==='Painel'?'view-dashboard-outline':item==='Atividade'?'history':'lan-connect'} size={23} color={tab===item?t.primary:t.muted}/><Text style={{color:tab===item?t.primary:t.muted,fontSize:13,fontWeight:'600'}}>{item}</Text>
    </Pressable>)}
    {wide&&<Text style={[s.railFoot,{color:t.muted}]}>Projeto acadêmico{ '\n' }Dados de demonstração</Text>}
  </View>;
  return <SafeAreaView style={[s.safe,{backgroundColor:t.bg}]}><StatusBar style={t===dark?'light':'dark'}/><View style={[s.shell,wide&&{flexDirection:'row'}]}>
    {wide&&navigation}
    <View style={s.workspace}>
      <View style={[s.top,{backgroundColor:t.surface,borderColor:t.line}]}>
        <View><Text style={[wide?s.topLabel:s.brand,{color:t.text}]}>{wide?'Monitoramento urbano':'Vigia Urbana'}</Text><Text style={[s.small,{color:t.muted}]}>Alagamento, calor e energia</Text></View>
        <View style={s.connection}><View style={[s.dot,{backgroundColor:online?t.primary:m.status==='loading'?t.moderate:t.high}]}/><Text accessibilityLiveRegion="polite" style={[s.small,{color:t.text}]}>{online?'Conectado':m.status==='loading'?'Conectando':'Sem conexão'}</Text></View>
      </View>
      <ScrollView contentContainerStyle={[s.content,wide&&s.contentWide]} keyboardShouldPersistTaps="handled">
        <View style={s.heading}><View style={{flex:1}}><Text accessibilityRole="header" style={[s.h1,{color:t.text}]}>{tab==='Painel'?'O que acontece no bairro':tab==='Atividade'?'Últimas leituras':'Sua conexão'}</Text><Text style={[s.body,{color:t.muted,marginTop:8}]}>{tab==='Painel'?'Acompanhe os riscos e entenda cada alerta.':tab==='Atividade'?'Dados recebidos, com horário e origem.':'Configure o servidor e acompanhe a sincronização.'}</Text></View></View>
        <View style={[s.demo,{backgroundColor:t.subtle}]}><MaterialCommunityIcons accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" name="flask-outline" size={21} color={t.primary}/><Text style={[s.small,{color:t.text,flex:1}]}>Modo demonstração · bairros, leituras e limites simulados. Não são alertas oficiais.</Text></View>
        {m.status==='offline'&&<View accessibilityRole="alert" style={[s.message,{backgroundColor:t.highBg}]}><Text style={[s.detailTitle,{color:t.high}]}>Servidor indisponível</Text><Text style={[s.body,{color:t.text}]}>{data?'Você está vendo os últimos dados salvos. Os alertas podem ter mudado.':'Ainda não há dados salvos deste servidor. Confira o endereço em Conexão e inicie o backend.'} Nova tentativa automática a cada 5 segundos.</Text><Button label="Tentar agora" onPress={()=>void m.refresh()} theme={t} disabled={m.busy}/></View>}
        {!!m.storageWarning&&<Text accessibilityRole="alert" style={[s.body,{color:t.high}]}>{m.storageWarning}</Text>}
        {!!m.notice&&<View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={[s.message,{backgroundColor:t.highBg}]}><Text style={[s.body,{color:t.text}]}>{m.notice}</Text><Button label="Entendi" onPress={m.dismissNotice} theme={t}/></View>}
        {tab==='Painel'&&<>
          <View style={[s.overview,{backgroundColor:t.surface,borderColor:t.line}]}>
            <Text style={[s.h2,{color:t.text}]}>Visão geral</Text>
            <View style={s.riskSummary}>{(['FLOOD','HEAT','OUTAGE'] as RiskType[]).map(type=>{
              const items=data?.alerts.filter(a=>a.type===type)||[]; const critical=items.filter(a=>a.score>=60).length;
              return <View key={type} style={s.summaryItem}><Text style={[s.body,{color:t.muted}]}>{labels[type]}</Text><Text style={[s.summaryValue,{color:t.text}]}>{data?`${critical} de ${items.length}`:'—'}</Text><Text style={[s.small,{color:t.muted}]}>em nível alto ou crítico</Text></View>;
            })}</View>
          </View>
          <View style={[s.list,{backgroundColor:t.surface}]}>
            <View style={s.listHeading}><Text accessibilityRole="header" style={[s.h2,{color:t.text}]}>Alertas por prioridade</Text><Text style={[s.small,{color:t.muted}]}>{data?`${data.alerts.length} locais e riscos`:'Aguardando dados'}</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>{(['ALL','FLOOD','HEAT','OUTAGE'] as const).map(item=><Pressable key={item} accessibilityRole="button" accessibilityState={{selected:filter===item}} onPress={()=>setFilter(item)} style={[s.chip,{backgroundColor:filter===item?t.primary:t.bg}]}><Text style={{color:filter===item?t.onPrimary:t.muted,fontSize:14,fontWeight:'600'}}>{item==='ALL'?'Todos':labels[item]}</Text></Pressable>)}</ScrollView>
            {m.status==='loading'&&!data?<View style={s.empty}><ActivityIndicator color={t.primary}/><Text style={[s.body,{color:t.muted}]}>Buscando dados do servidor…</Text></View>:!alerts.length?<View style={s.empty}><Text style={[s.body,{color:t.muted}]}>{data?'Nenhuma ocorrência para este filtro.':'Os alertas aparecerão aqui quando a API estiver disponível.'}</Text></View>:alerts.map(a=><AlertRow key={a.id} alert={a} theme={t} serverTime={data!.serverTime} savedAt={m.snapshot!.savedAt} now={now}/>)}
          </View>
        </>}
        {tab==='Atividade'&&<View style={[s.list,{backgroundColor:t.surface}]}><Text style={[s.h2,{color:t.text}]}>Histórico recebido</Text><Text style={[s.body,{color:t.muted,marginVertical:12}]}>Até 30 leituras recentes. {data?.storedReadings??0} registros persistidos no servidor.</Text>
          {!data?.readings.length&&<Text style={[s.body,{color:t.muted}]}>Nenhuma leitura disponível.</Text>}
          {data?.readings.map(r=><View key={r.id} style={[s.historyRow,{borderColor:t.line}]}><View style={{flex:1}}><Text style={[s.detailTitle,{color:t.text}]}>{labels[r.type]} · {r.district}</Text><Text style={[s.small,{color:t.muted}]}>{r.source==='SENSOR'?'Sensor simulado':r.source==='PUBLIC_DATA'?'Base pública simulada':'Comunidade simulada'} · {new Date(r.observedAt).toLocaleString('pt-BR')}</Text></View><Text style={[s.body,{color:t.text}]}>{r.value.toLocaleString('pt-BR',{maximumFractionDigits:1})} {r.type==='HEAT'?'°C':r.type==='FLOOD'?'mm/h':'min'}</Text></View>)}
        </View>}
        {tab==='Conexão'&&<View style={[s.list,{backgroundColor:t.surface,gap:16}]}>
          <Text style={[s.h2,{color:t.text}]}>Endereço da API</Text><Text style={[s.body,{color:t.muted}]}>No celular Android, use o IP do computador na mesma rede Wi-Fi. No emulador Android, use http://10.0.2.2:8080. No navegador deste computador, use http://localhost:8080.</Text>
          <Text accessibilityRole="text" style={[s.detailTitle,{color:t.text}]}>Servidor (HTTP ou HTTPS)</Text><TextInput accessibilityLabel="Endereço da API" value={draft} onChangeText={setDraft} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="http://192.168.0.10:8080" placeholderTextColor={t.muted} style={[s.input,{borderColor:t.line,color:t.text,backgroundColor:t.bg}]}/>
          {!!error&&<Text accessibilityRole="alert" style={[s.body,{color:t.critical}]}>{error}</Text>}
          <Button label="Salvar e conectar" theme={t} onPress={()=>{setError('');void m.changeUrl(draft).catch(()=>setError('Endereço inválido. Use http://IP:8080, sem caminhos ou parâmetros.'));}}/>
          <Text style={[s.body,{color:t.muted}]}>Consulta automática: 5 s · tempo limite: 5 s{ '\n' }Última resposta: {m.latency===null?'—':`${m.latency} ms`}{ '\n' }As notificações aparecem dentro do app, enquanto ele está aberto. Não há push em segundo plano.</Text>
          <Text style={[s.body,{color:t.muted}]}>Não coletamos nome, localização do aparelho ou identificadores pessoais. O endereço do servidor e os últimos dados ficam armazenados neste dispositivo.</Text>
        </View>}
        <View style={s.footer}><Text style={[s.small,{color:t.muted}]}>Última sincronização: {m.snapshot?new Date(m.snapshot.savedAt).toLocaleString('pt-BR'):'nenhuma'}{ '\n' }Abra um alerta para consultar a origem e a análise.</Text><Pressable accessibilityRole="button" accessibilityLabel="Atualizar" disabled={m.busy} onPress={()=>void m.refresh()} style={s.refresh}><MaterialCommunityIcons accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" name="refresh" size={20} color={t.primary}/><Text style={{color:t.primary,fontWeight:'600'}}>{m.busy?'Atualizando…':'Atualizar'}</Text></Pressable></View>
      </ScrollView>
      {!wide&&navigation}
    </View>
  </View></SafeAreaView>;
}
export default function App(){return <SafeAreaProvider><Screen/></SafeAreaProvider>;}
const s=StyleSheet.create({safe:{flex:1},shell:{flex:1},workspace:{flex:1,minWidth:0},top:{minHeight:84,paddingHorizontal:24,paddingVertical:16,borderBottomWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},topLabel:{fontSize:16,fontWeight:'600'},brand:{fontSize:22,fontWeight:'700',letterSpacing:-.4},connection:{flexDirection:'row',alignItems:'center',gap:7},dot:{width:8,height:8,borderRadius:4},small:{fontSize:12,lineHeight:19},body:{fontSize:15,lineHeight:24},content:{padding:20,gap:20,paddingBottom:36},contentWide:{padding:40,maxWidth:1200,width:'100%',alignSelf:'center'},heading:{flexDirection:'row',gap:16},h1:{fontSize:30,lineHeight:38,fontWeight:'700',letterSpacing:-.7},h2:{fontSize:20,fontWeight:'600',lineHeight:28},detailTitle:{fontSize:15,fontWeight:'600',lineHeight:23},demo:{flexDirection:'row',alignItems:'center',gap:10,padding:14,borderRadius:12},overview:{padding:22,borderRadius:14,borderWidth:1,gap:20},riskSummary:{flexDirection:'row',flexWrap:'wrap',gap:24},summaryItem:{minWidth:130,flex:1,gap:5},summaryValue:{fontSize:25,fontWeight:'600'},list:{paddingHorizontal:20,paddingVertical:22,borderRadius:14},listHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'},filters:{gap:8,paddingVertical:16},chip:{minHeight:48,paddingHorizontal:18,justifyContent:'center',borderRadius:24},empty:{paddingVertical:36,alignItems:'center',gap:12},nav:{flexDirection:'row',borderTopWidth:1,padding:8,gap:8},navItem:{flex:1,minHeight:56,alignItems:'center',justifyContent:'center',gap:4,borderRadius:14},rail:{width:236,borderRightWidth:1,padding:20,gap:12},railBrand:{gap:12,paddingVertical:22,marginBottom:22},railItem:{flex:0,flexDirection:'row',justifyContent:'flex-start',paddingHorizontal:18,gap:14},railFoot:{marginTop:'auto',fontSize:12,lineHeight:21,paddingVertical:14},message:{padding:18,gap:12,borderRadius:12},button:{minHeight:48,paddingHorizontal:18,paddingVertical:12,alignItems:'center',justifyContent:'center',borderRadius:10,alignSelf:'flex-start'},footer:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:16},refresh:{minHeight:48,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:8},historyRow:{flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,paddingVertical:18},input:{minHeight:52,borderWidth:1,borderRadius:10,padding:14,fontSize:16}});
