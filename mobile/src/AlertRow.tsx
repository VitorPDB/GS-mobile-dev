import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { RiskAlert, Vote } from './types';
import { theme as t } from './theme';
import { isStale } from './sync';
import { Icon } from './Icon';

const presentation = {
  FLOOD:{icon:'weather-pouring',label:'Intensidade da chuva',background:t.stone},
  HEAT:{icon:'thermometer-high',label:'Temperatura do ar',background:t.canvas},
  OUTAGE:{icon:'flash-off',label:'Tempo sem energia',background:t.inset},
} as const;

export function AlertRow({alert:a,serverTime,savedAt,now,onReact,voteDisabled,voting}:{alert:RiskAlert;serverTime:string;savedAt:string;now:number;onReact:(alert:RiskAlert,vote:Vote)=>Promise<void>;voteDisabled:boolean;voting:boolean}) {
  const [expanded,setExpanded]=useState(false);
  const [voteError,setVoteError]=useState('');
  useEffect(()=>setVoteError(''),[a.likes,a.dislikes,a.myVote]);
  const stale=isStale(a,serverTime,savedAt,now);
  const visual=presentation[a.type];
  const strong=a.severity==='Crítico'||a.severity==='Alto';
  const badgeBackground=a.severity==='Crítico'?t.critical:a.severity==='Alto'?t.high:a.severity==='Moderado'?t.moderate:t.low;
  return <View style={s.post}>
    <View style={s.header}>
      <View style={s.avatar}><Icon name={visual.icon} size={22}/></View>
      <View style={s.identity}>
        <Text style={s.district}>{a.district}</Text>
        <Text style={s.meta}>{a.title} · {new Date(a.observedAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</Text>
      </View>
      <Text style={[s.severity,{backgroundColor:badgeBackground,color:strong?t.paper:t.ink}]}>{a.severity}</Text>
    </View>
    <View style={[s.reading,{backgroundColor:visual.background}]}>
      <Text style={s.measureLabel}>{visual.label}</Text>
      <View style={s.valueLine}><Text style={s.value}>{a.value.toLocaleString('pt-BR',{maximumFractionDigits:1})}</Text><Text style={s.unit}>{a.unit}</Text></View>
      <View style={s.readingFoot}>
        <View style={s.trend}><Icon name={a.trend==='Em elevação'?'trending-up':a.trend==='Em queda'?'trending-down':'minus'} size={19}/><Text style={s.trendLabel}>{a.trend}</Text></View>
        <Text style={s.score}>Prioridade {a.score}/100</Text>
      </View>
    </View>
    <View style={s.reactions}>
      {(['LIKE','DISLIKE'] as const).map(kind=><Pressable key={kind} accessibilityRole="button"
        accessibilityLabel={`${kind==='LIKE'?'Like':'Dislike'} em ${a.title}, ${a.district}`}
        accessibilityValue={{text:`${kind==='LIKE'?a.likes:a.dislikes} votos`}}
        accessibilityState={{selected:a.myVote===kind,disabled:voteDisabled||stale}}
        aria-pressed={a.myVote===kind} disabled={voteDisabled||stale}
        onPress={()=>{setVoteError('');void onReact(a,a.myVote===kind?'NONE':kind).catch(error=>setVoteError(error instanceof Error?error.message:'Não foi possível confirmar o voto.'));}}
        style={({pressed})=>[s.reactionButton,a.myVote===kind&&{backgroundColor:t.stone},(pressed||voteDisabled||stale)&&{opacity:.5}]}>
        <Icon name={kind==='LIKE'?(a.myVote==='LIKE'?'heart':'heart-outline'):(a.myVote==='DISLIKE'?'thumb-down':'thumb-down-outline')} size={23}/>
        <Text style={s.reactionCount}>{kind==='LIKE'?a.likes:a.dislikes}</Text>
      </Pressable>)}
      {voting&&<ActivityIndicator color={t.ink} size="small" accessibilityLabel="Enviando voto"/>}
      <Text style={s.votingWindow}>Votos · 24 h</Text>
    </View>
    {!!voteError&&<Text accessibilityRole="alert" style={s.voteError}>{voteError}</Text>}
    <View style={s.caption}>
      <View style={s.sourceLine}><Icon name="database-outline" size={17}/><Text style={s.source}>{a.sourceLabel}</Text><Text style={s.confidence}>Confiança {Math.round(a.confidence*100)}%</Text></View>
      <Text style={s.advice}>{a.recommendation}</Text>
      {stale&&<Text accessibilityRole="alert" style={s.stale}>Leitura antiga. Confirme a situação atual antes de agir.</Text>}
      <Pressable onPress={()=>setExpanded(!expanded)} accessibilityRole="button" accessibilityState={{expanded}}
        accessibilityLabel={`${a.title}, ${a.district}, ${a.severity}. ${expanded?'Fechar':'Ver'} detalhes`}
        style={({pressed})=>[s.expand,pressed&&{backgroundColor:t.canvas}]}>
        <Icon name={expanded?'minus-circle-outline':'plus-circle-outline'} size={20}/>
        <Text style={s.expandLabel}>{expanded?'Fechar análise':'Entender este alerta'}</Text>
        <Icon name={expanded?'chevron-up':'chevron-down'} size={19}/>
      </Pressable>
      {expanded&&<View style={s.details}>
        <Text accessibilityRole="header" style={s.detailTitle}>Por que este alerta tem prioridade {a.score}/100?</Text>
        <Text style={s.body}>{a.explanation}</Text>
        <Text style={s.body}>Origem: {a.sourceLabel}. Base da fonte: {Math.round(a.baseConfidence*100)}%. Confiança combinada: {Math.round(a.confidence*100)}%, considerando os votos das últimas 24 horas. Não representa probabilidade de ocorrência.</Text>
        <Text style={s.body}>{a.confidenceExplanation}</Text>
        <Text style={s.disclaimer}>Cenário e limites simulados para fins acadêmicos. Não substitui alertas oficiais.</Text>
      </View>}
    </View>
  </View>;
}
const s=StyleSheet.create({
  post:{backgroundColor:t.paper,borderBottomWidth:1,borderColor:t.line,paddingBottom:24,marginBottom:28},
  header:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:16},
  avatar:{width:44,height:44,borderRadius:22,backgroundColor:t.canvas,alignItems:'center',justifyContent:'center'},
  identity:{flex:1,minWidth:0,gap:4},district:{color:t.ink,fontSize:15,fontWeight:'700'},
  meta:{color:t.secondary,fontSize:12,lineHeight:18},severity:{fontSize:11,fontWeight:'700',paddingHorizontal:10,paddingVertical:7,borderRadius:4},
  reading:{padding:24,minHeight:210,justifyContent:'space-between'},measureLabel:{color:t.secondary,fontSize:14,lineHeight:21},
  valueLine:{flexDirection:'row',alignItems:'baseline',gap:12,flexWrap:'wrap',paddingVertical:8},value:{fontSize:68,lineHeight:78,fontWeight:'500',color:t.ink,letterSpacing:-2.4},unit:{fontSize:24,color:t.secondary,fontWeight:'400'},
  readingFoot:{flexDirection:'row',justifyContent:'space-between',gap:10,flexWrap:'wrap',alignItems:'center',paddingTop:12,borderTopWidth:1,borderColor:t.outline},
  trend:{flexDirection:'row',alignItems:'center',gap:6},trendLabel:{fontSize:12,color:t.ink,lineHeight:18},score:{color:t.secondary,fontSize:12,lineHeight:18},
  reactions:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:12,paddingTop:8},reactionButton:{minHeight:48,minWidth:64,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8,paddingHorizontal:8,borderRadius:6},reactionCount:{fontSize:14,color:t.ink,fontWeight:'600'},votingWindow:{marginLeft:'auto',fontSize:11,color:t.secondary},voteError:{fontSize:12,lineHeight:19,color:t.ink,paddingVertical:8},
  caption:{paddingTop:8,gap:12},sourceLine:{flexDirection:'row',alignItems:'center',gap:6,flexWrap:'wrap'},source:{fontSize:12,fontWeight:'600',color:t.ink,lineHeight:19},confidence:{fontSize:12,color:t.secondary,lineHeight:19,marginLeft:'auto'},
  advice:{fontSize:15,lineHeight:23,color:t.ink},stale:{fontSize:13,fontWeight:'600',lineHeight:20,color:t.ink},
  expand:{minHeight:48,alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:4},expandLabel:{fontSize:13,fontWeight:'600',color:t.ink},
  details:{borderTopWidth:1,borderColor:t.line,paddingTop:18,gap:12},detailTitle:{fontSize:15,fontWeight:'700',lineHeight:22,color:t.ink},body:{fontSize:14,lineHeight:23,color:t.secondary},disclaimer:{fontSize:12,lineHeight:19,color:t.secondary},
});
