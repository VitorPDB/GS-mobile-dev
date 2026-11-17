import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme as t } from './theme';
import { Icon, IconName } from './Icon';
import type { RiskType } from './types';
export type Filter = RiskType|'ALL';
const filters:{id:Filter;label:string;short:string;icon:IconName}[]=[
  {id:'ALL',label:'Todos',short:'Todos',icon:'compass-outline'},
  {id:'FLOOD',label:'Alagamento',short:'Chuva',icon:'weather-pouring'},
  {id:'HEAT',label:'Calor extremo',short:'Calor',icon:'white-balance-sunny'},
  {id:'OUTAGE',label:'Energia',short:'Energia',icon:'flash-outline'},
];
export function FeedFilters({selected,onSelect}:{selected:Filter;onSelect:(filter:Filter)=>void}) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
    {filters.map(f=><Pressable key={f.id} accessibilityRole="button" accessibilityLabel={f.label}
      accessibilityState={{selected:selected===f.id}} onPress={()=>onSelect(f.id)} style={({pressed})=>[s.filter,pressed&&{opacity:.65}]}>
      <View style={[s.ring,{borderColor:selected===f.id?t.ink:t.line}]}><View style={[s.circle,{backgroundColor:selected===f.id?t.stone:t.canvas}]}><Icon name={f.icon} size={26}/></View></View>
      <Text style={[s.label,selected===f.id&&{fontWeight:'700',color:t.ink}]}>{f.short}</Text>
    </Pressable>)}
  </ScrollView>;
}
const s=StyleSheet.create({filters:{gap:20,paddingVertical:20},filter:{alignItems:'center',gap:9,minWidth:60},ring:{width:62,height:62,borderRadius:31,borderWidth:1.5,padding:4},circle:{flex:1,borderRadius:28,justifyContent:'center',alignItems:'center'},label:{fontSize:12,lineHeight:18,color:t.secondary}});
