import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { RiskAlert } from './types';
import type { Theme } from './theme';
import { isStale } from './sync';

export function AlertRow({alert:a,theme:t,serverTime,savedAt,now}:{alert:RiskAlert;theme:Theme;serverTime:string;savedAt:string;now:number}) {
  const [expanded,setExpanded]=useState(false);
  const stale=isStale(a,serverTime,savedAt,now);
  const color=a.severity==='Crítico'?t.critical:a.severity==='Alto'?t.high:a.severity==='Moderado'?t.moderate:t.low;
  const backgroundColor=a.severity==='Crítico'?t.criticalBg:a.severity==='Alto'?t.highBg:a.severity==='Moderado'?t.moderateBg:t.lowBg;
  return <View style={[s.row,{borderColor:t.line}]}>
    <Pressable onPress={()=>setExpanded(!expanded)} accessibilityRole="button" accessibilityState={{expanded}} accessibilityLabel={`${a.title}, ${a.district}, ${a.severity}. ${expanded?'Fechar':'Ver'} detalhes`} style={s.action}>
      <View style={[s.symbol,{backgroundColor:t.bg}]}><MaterialCommunityIcons accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" name={a.type==='FLOOD'?'weather-pouring':a.type==='HEAT'?'thermometer-high':'flash-off'} size={24} color={t.text}/></View>
      <View style={s.main}>
        <Text style={[s.title,{color:t.text}]}>{a.title}</Text>
        <Text style={[s.body,{color:t.muted}]}>{a.district} · {a.value.toLocaleString('pt-BR',{maximumFractionDigits:1})} {a.unit}</Text>
        <Text style={[s.small,{color:t.muted}]}>{stale?'Leitura antiga · ':''}{new Date(a.observedAt).toLocaleTimeString('pt-BR')} · Confiança {Math.round(a.confidence*100)}%</Text>
      </View>
      <View style={s.tail}><Text style={[s.badge,{color,backgroundColor}]}>{a.severity}</Text><MaterialCommunityIcons accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" name={expanded?'chevron-up':'chevron-down'} size={22} color={t.muted}/></View>
    </Pressable>
    {expanded && <View style={[s.details,{backgroundColor:t.bg}]}>
      <Text style={[s.detailTitle,{color:t.text}]}>Por que este alerta tem prioridade {a.score}/100?</Text>
      <Text style={[s.body,{color:t.text}]}>{a.explanation}</Text>
      <Text style={[s.body,{color:t.muted}]}>Origem: {a.sourceLabel}. Confiança de {Math.round(a.confidence*100)}% atribuída à categoria da fonte; não representa probabilidade de ocorrência.</Text>
      <Text style={[s.detailTitle,{color:t.text}]}>Como se cuidar</Text>
      <Text style={[s.body,{color:t.text}]}>{a.recommendation}</Text>
      <Text style={[s.small,{color:t.muted}]}>Cenário e limites simulados para fins acadêmicos. Não substitui alertas oficiais.</Text>
    </View>}
  </View>;
}
const s=StyleSheet.create({row:{borderBottomWidth:1},action:{minHeight:104,paddingVertical:16,flexDirection:'row',alignItems:'center',gap:12},symbol:{padding:10,borderRadius:12},main:{flex:1,gap:5},title:{fontSize:17,fontWeight:'600'},body:{fontSize:15,lineHeight:23},small:{fontSize:12,lineHeight:18},tail:{alignItems:'flex-end',gap:8},badge:{fontSize:12,fontWeight:'700',paddingHorizontal:10,paddingVertical:6,borderRadius:6},details:{padding:18,marginBottom:16,borderRadius:12,gap:10},detailTitle:{fontSize:15,fontWeight:'700'}});
