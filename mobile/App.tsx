import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useMonitoring } from './src/useMonitoring';
import { theme as t } from './src/theme';
import { RiskType, labels } from './src/types';
import { AlertRow } from './src/AlertRow';
import { Icon } from './src/Icon';
import { FeedFilters, Filter } from './src/FeedFilters';

type Tab='Feed'|'Atividade';
function Screen() {
  const width=useWindowDimensions().width;
  const wide=width>=900;
  const showAside=width>=1200;
  const [tab,setTab]=useState<Tab>('Feed');
  const [filter,setFilter]=useState<Filter>('ALL');
  const [now,setNow]=useState(Date.now());
  const [about,setAbout]=useState(false);
  const [overview,setOverview]=useState(false);
  const m=useMonitoring();
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),5000);return()=>clearInterval(timer);},[]);
  const data=m.snapshot?.data;
  const alerts=data?.alerts.filter(a=>filter==='ALL'||a.type===filter)||[];
  const lastSync=m.snapshot?new Date(m.snapshot.savedAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'aguardando';
  const status=<View style={s.status}><View style={[s.statusDot,m.status==='offline'&&s.offlineDot]}/><Text accessibilityLiveRegion="polite" style={s.small}>{m.status==='online'?'Conectado':m.status==='loading'?'Conectando':'Sem conexão'}</Text></View>;
  const refresh=<Pressable accessibilityRole="button" accessibilityLabel="Atualizar" accessibilityState={{disabled:m.busy||m.votingId!==null}} disabled={m.busy||m.votingId!==null}
    onPress={()=>void m.refresh()} style={({pressed})=>[s.refresh,pressed&&{backgroundColor:t.stone},m.busy&&{opacity:.5}]}><Icon name="refresh" size={23}/></Pressable>;
  const tabs=(rail:boolean)=><View accessibilityRole="tablist" style={rail?s.railTabs:s.mobileTabs}>
    {(['Feed','Atividade'] as Tab[]).map(item=><Pressable key={item} accessibilityRole="tab" accessibilityLabel={item}
      accessibilityState={{selected:tab===item}} onPress={()=>setTab(item)}
      style={({pressed})=>[rail?s.railTab:s.mobileTab,!rail&&tab===item&&s.selectedTab,pressed&&{backgroundColor:t.canvas}]}>
      <Icon name={item==='Feed'?(tab===item?'home':'home-outline'):'history'} size={24}/>
      <Text style={[s.tabText,tab===item&&{fontWeight:'700',color:t.ink}]}>{item}</Text>
    </Pressable>)}
  </View>;
  const panorama=<View style={s.panorama}><Text accessibilityRole="header" style={s.asideTitle}>Panorama</Text><Text style={s.asideBody}>Níveis altos ou críticos, por risco.</Text>
              {(['FLOOD','HEAT','OUTAGE'] as RiskType[]).map(type=>{const items=data?.alerts.filter(a=>a.type===type)||[];return <View key={type} style={s.panoramaRow}><Text style={s.panoramaLabel}>{labels[type]}</Text><Text style={s.panoramaValue}>{data?`${items.filter(a=>a.score>=60).length} / ${items.length}`:'—'}</Text></View>;})}
              <Text style={s.footnote}>Com base nas últimas leituras salvas.{ '\n' }Leituras com mais de 90 s são sinalizadas.</Text>
            </View>;
  const provenance=<View style={s.provenance}>
    <Text style={s.asideTitle}>Informação com contexto.</Text>
    <Text style={s.asideBody}>Leituras de sensores, bases públicas e comunidade — todas simuladas nesta demonstração.</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Sobre a análise" accessibilityState={{expanded:about}} onPress={()=>setAbout(!about)} style={s.aboutButton}><Text style={s.link}>Sobre a análise</Text><Icon name={about?'chevron-up':'arrow-top-right'} size={17}/></Pressable>
    {about&&<Text style={s.asideBody}>A prioridade considera intensidade e tendência. A confiança combina a base da fonte com likes e dislikes das últimas 24 horas. Não representa probabilidade de ocorrência. Abra uma publicação para ver a conta completa. Os avisos aparecem com o app aberto.</Text>}
    <Text style={s.footnote}>Sem nome ou localização do aparelho. Um identificador aleatório fica salvo neste dispositivo para registrar seus votos.</Text>
    <Text style={s.footnote}>Sincronizado às {lastSync}{m.latency!==null?` · ${m.latency} ms`:''}{'\n'}Urban Risk Intelligence Platform</Text>
  </View>;

  return <SafeAreaView style={s.safe}><StatusBar style="dark"/><View style={s.shell}>
    {wide&&<View style={s.rail}>
      <View style={s.brandBlock}><Text style={s.brand}>URIP</Text><Text style={s.fullName}>Urban Risk{ '\n' }Intelligence Platform</Text></View>
      {tabs(true)}
      <View style={s.railFooter}><Text style={s.footnote}>Monitoramento urbano{ '\n' }Projeto acadêmico</Text></View>
    </View>}
    <View style={s.workspace}>
      <View style={s.topbar}>
        {wide?<View style={s.topIdentity}><Text style={s.topTitle}>{tab==='Feed'?'Ocorrências':'Atividade'}</Text><Text style={s.topDescription}>Urban Risk Intelligence Platform</Text></View>:<View style={s.topIdentity}><Text style={s.mobileBrand}>URIP</Text><Text style={s.mobileFullName}>Urban Risk Intelligence Platform</Text></View>}
        <View style={s.topActions}>{wide&&status}{refresh}</View>
      </View>
      {!wide&&tabs(false)}
      <ScrollView contentContainerStyle={[s.scrollContent,wide&&s.scrollWide]}>
        <View style={[s.columns,showAside&&{gap:64}]}>
          <View style={s.feed}>
            <View style={s.feedIntro}><Text accessibilityRole="header" style={s.heading}>{tab==='Feed'?'Seu radar urbano.':'Cada leitura conta.'}</Text><View style={s.introMeta}><Text style={s.introText}>{tab==='Feed'?(data?`${data.alerts.length} ocorrências · por prioridade`:'Aguardando as primeiras leituras'):'Histórico com horário e origem.'}</Text>{!wide&&status}</View></View>
            <View style={s.simulation}><Icon name="flask-outline" size={17}/><Text style={s.simulationText}>Dados simulados. Não são alertas oficiais.</Text></View>
            {!showAside&&<View style={s.compactOverview}><Pressable accessibilityRole="button" accessibilityLabel="Panorama" accessibilityState={{expanded:overview}} onPress={()=>setOverview(!overview)} style={s.overviewToggle}><Text style={s.sectionLabel}>Panorama</Text><Text style={s.overviewCount}>{data?`${data.alerts.filter(a=>a.score>=60).length} em atenção`:'Aguardando dados'}</Text><Icon name={overview?'chevron-up':'chevron-down'} size={20}/></Pressable>{overview&&panorama}</View>}
            {m.status==='offline'&&<View accessibilityRole="alert" style={s.notice}>
              <Text style={s.noticeTitle}>Atualizações pausadas</Text><Text style={s.body}>{data?'Você está vendo os últimos dados salvos. A situação pode ter mudado.':'Ainda não há dados salvos. As ocorrências aparecerão quando o serviço estiver disponível.'} Tentaremos novamente a cada 5 segundos. Conecte-se para votar.</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Tentar agora" disabled={m.busy||m.votingId!==null} accessibilityState={{disabled:m.busy||m.votingId!==null}} onPress={()=>void m.refresh()} style={s.noticeAction}><Text style={s.link}>Tentar agora</Text><Icon name="arrow-right" size={18}/></Pressable>
            </View>}
            {!!m.storageWarning&&<Text accessibilityRole="alert" style={s.warning}>{m.storageWarning}</Text>}
            {!!m.notice&&<View accessibilityRole="alert" accessibilityLiveRegion="assertive" style={s.notice}><Text style={s.body}>{m.notice}</Text><Pressable accessibilityRole="button" accessibilityLabel="Entendi" onPress={m.dismissNotice} style={s.noticeAction}><Text style={s.link}>Entendi</Text><Icon name="check" size={18}/></Pressable></View>}
            {tab==='Feed'?<>
              <FeedFilters selected={filter} onSelect={setFilter}/>
              <View style={s.feedDivider}><Text style={s.sectionLabel}>Acompanhe de perto</Text><Text style={s.footnote}>{filter==='ALL'?'Todos os riscos':labels[filter]}</Text></View>
              {m.status==='loading'&&!data?<View style={s.empty}><ActivityIndicator color={t.ink}/><Text style={s.body}>Buscando as últimas leituras…</Text></View>:!alerts.length?<View style={s.empty}><Icon name="inbox-outline" size={30}/><Text style={s.body}>{data?'Nenhuma ocorrência para este filtro.':'Seu feed será preenchido quando os dados chegarem.'}</Text></View>:alerts.map(a=><AlertRow key={a.id} alert={a} serverTime={data!.serverTime} savedAt={m.snapshot!.savedAt} now={now} onReact={m.reactTo} voteDisabled={!m.canVote||m.votingId!==null} voting={m.votingId===a.id}/>)}
            </>:<View style={s.history}>
              <Text accessibilityRole="header" style={s.sectionLabel}>Histórico recebido</Text><Text style={s.historyInfo}>Até 30 leituras recentes · {data?.storedReadings??0} registros no servidor</Text>
              {!data?.readings.length&&<Text style={s.body}>Nenhuma leitura disponível.</Text>}
              {data?.readings.map(r=><View key={r.id} style={s.historyRow}><View style={s.historyIdentity}><Text style={s.historyTitle}>{r.district}</Text><Text style={s.historyMeta}>{labels[r.type]} · {r.source==='SENSOR'?'Sensor simulado':r.source==='PUBLIC_DATA'?'Base pública simulada':'Comunidade simulada'}</Text><Text style={s.footnote}>{new Date(r.observedAt).toLocaleString('pt-BR')}</Text></View><Text style={s.historyValue}>{r.value.toLocaleString('pt-BR',{maximumFractionDigits:1})}<Text style={s.historyUnit}> {r.type==='HEAT'?'°C':r.type==='FLOOD'?'mm/h':'min'}</Text></Text></View>)}
            </View>}
            {!showAside&&<View style={s.mobileProvenance}>{provenance}</View>}
          </View>
          {showAside&&<View style={s.aside}>
            {panorama}
            {provenance}
          </View>}
        </View>
      </ScrollView>
    </View>
  </View></SafeAreaView>;
}
export default function App(){return <SafeAreaProvider><Screen/></SafeAreaProvider>;}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:t.paper},shell:{flex:1,flexDirection:'row'},workspace:{flex:1,minWidth:0},
  rail:{width:224,borderRightWidth:1,borderColor:t.line,paddingHorizontal:24,paddingTop:40,backgroundColor:t.paper},brandBlock:{gap:12,marginBottom:54},brand:{fontSize:46,lineHeight:54,fontWeight:'800',letterSpacing:-1.7,color:t.ink},fullName:{fontSize:13,lineHeight:20,color:t.secondary},
  railTabs:{gap:12},railTab:{minHeight:54,flexDirection:'row',alignItems:'center',gap:16,paddingHorizontal:10,borderRadius:6},tabText:{fontSize:15,color:t.secondary},railFooter:{marginTop:'auto',gap:20,paddingVertical:28},
  topbar:{minHeight:88,paddingHorizontal:32,paddingVertical:14,borderBottomWidth:1,borderColor:t.line,backgroundColor:t.paper,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},topIdentity:{flex:1,minWidth:0,gap:4},topTitle:{fontSize:17,fontWeight:'600',color:t.ink},topDescription:{fontSize:12,color:t.secondary},mobileBrand:{fontSize:32,lineHeight:36,fontWeight:'800',letterSpacing:-1.1,color:t.ink},mobileFullName:{fontSize:11,lineHeight:16,color:t.secondary},topActions:{flexDirection:'row',alignItems:'center',gap:20},refresh:{minWidth:48,minHeight:48,justifyContent:'center',alignItems:'center',borderRadius:24},
  status:{flexDirection:'row',alignItems:'center',gap:7},statusDot:{width:6,height:6,borderRadius:3,backgroundColor:t.ink},offlineDot:{backgroundColor:t.paper,borderWidth:1,borderColor:t.ink,width:7,height:7,borderRadius:4},small:{fontSize:11,color:t.secondary,lineHeight:18},
  mobileTabs:{flexDirection:'row',borderBottomWidth:1,borderColor:t.line},mobileTab:{flex:1,minHeight:52,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:9,borderBottomWidth:2,borderColor:'transparent'},selectedTab:{borderColor:t.ink},
  scrollContent:{paddingHorizontal:20,paddingTop:28,paddingBottom:40},scrollWide:{paddingHorizontal:48,paddingTop:42},columns:{flexDirection:'row',justifyContent:'center',alignItems:'flex-start',width:'100%',maxWidth:1000,alignSelf:'center'},feed:{flex:1,maxWidth:600,minWidth:0},feedIntro:{gap:12,marginBottom:20},heading:{fontSize:28,lineHeight:36,fontWeight:'600',letterSpacing:-.7,color:t.ink},introMeta:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8},introText:{fontSize:12,lineHeight:19,color:t.secondary},simulation:{flexDirection:'row',alignItems:'center',gap:8,paddingVertical:12,paddingHorizontal:12,backgroundColor:t.canvas},simulationText:{fontSize:11,lineHeight:18,color:t.secondary,flex:1},
  feedDivider:{borderTopWidth:1,borderBottomWidth:1,borderColor:t.line,paddingVertical:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10,flexWrap:'wrap'},sectionLabel:{fontSize:14,lineHeight:21,fontWeight:'600',color:t.ink},footnote:{fontSize:11,lineHeight:18,color:t.secondary},
  notice:{backgroundColor:t.stone,padding:18,marginTop:16,gap:10},noticeTitle:{fontSize:15,fontWeight:'700',color:t.ink},body:{fontSize:14,lineHeight:23,color:t.ink},noticeAction:{minHeight:48,flexDirection:'row',alignItems:'center',alignSelf:'flex-start',gap:10},link:{fontSize:13,lineHeight:20,color:t.ink,fontWeight:'600'},warning:{fontSize:13,lineHeight:20,color:t.ink,paddingVertical:16},empty:{paddingVertical:56,alignItems:'center',gap:18},
  aside:{width:246,gap:36},panorama:{gap:12,paddingBottom:24,borderBottomWidth:1,borderColor:t.line},asideTitle:{fontSize:15,fontWeight:'600',lineHeight:23,color:t.ink},asideBody:{fontSize:13,lineHeight:22,color:t.secondary},panoramaRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:12,minHeight:40},panoramaLabel:{fontSize:13,color:t.ink},panoramaValue:{fontSize:13,color:t.secondary},provenance:{gap:14},aboutButton:{minHeight:48,flexDirection:'row',alignItems:'center',alignSelf:'flex-start',gap:8},mobileProvenance:{borderTopWidth:1,borderColor:t.line,paddingTop:28,marginTop:8},
  compactOverview:{marginTop:12,gap:8},overviewToggle:{minHeight:48,flexDirection:'row',alignItems:'center',gap:12,paddingVertical:8},overviewCount:{flex:1,textAlign:'right',fontSize:12,lineHeight:19,color:t.secondary},
  history:{paddingTop:28},historyInfo:{fontSize:12,lineHeight:20,color:t.secondary,marginTop:8,marginBottom:12},historyRow:{flexDirection:'row',alignItems:'center',gap:16,borderBottomWidth:1,borderColor:t.line,paddingVertical:22},historyIdentity:{flex:1,minWidth:0,gap:6},historyTitle:{fontSize:15,fontWeight:'600',color:t.ink},historyMeta:{fontSize:12,lineHeight:19,color:t.secondary},historyValue:{fontSize:22,color:t.ink},historyUnit:{fontSize:12,color:t.secondary},
});
