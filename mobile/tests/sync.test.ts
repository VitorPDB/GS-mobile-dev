import test from 'node:test';
import assert from 'node:assert/strict';
import { changedCritical, fetchDashboard, isStale, parseSnapshot, validateUrl, validDashboard } from '../src/sync';
import type { Dashboard, RiskAlert } from '../src/types';
const alert:RiskAlert={id:'HEAT:Centro',readingId:1,type:'HEAT',title:'Calor extremo',district:'Centro',value:41,unit:'°C',source:'SENSOR',sourceLabel:'Sensor simulado',confidence:.9,baseConfidence:.9,likes:0,dislikes:0,myVote:'NONE',confidenceExplanation:'Fonte e votos das últimas 24 h',score:90,severity:'Crítico',trend:'Estável',explanation:'Temperatura',recommendation:'Sombra',observedAt:'2026-11-16T12:00:00Z',stale:false,simulated:true};
const data:Dashboard={serverTime:alert.observedAt,simulated:true,alerts:[alert],readings:[],storedReadings:1};
test('cache inválido é ignorado, cache íntegro é restaurado',()=>{
  assert.equal(parseSnapshot('{broken'),null); assert.equal(parseSnapshot('{"data":{}}'),null);
  assert.deepEqual(parseSnapshot(JSON.stringify({data,savedAt:data.serverTime}))?.data,data);
});
test('leituras e alertas corrompidos são rejeitados antes da renderização',async()=>{
  const reading={id:1,type:'HEAT',source:'SENSOR',district:'Centro',value:41,observedAt:data.serverTime};
  assert.equal(validDashboard({...data,readings:[reading]}),true);
  for(const invalid of [null,{...reading,value:null},{...reading,id:0},{...reading,type:'UNKNOWN'},{...reading,source:null},{...reading,observedAt:'invalid'}]) {
    const bad={...data,readings:[invalid]};
    assert.equal(validDashboard(bad),false);
    assert.equal(parseSnapshot(JSON.stringify({data:bad,savedAt:data.serverTime})),null);
  }
  for(const invalid of [null,{...alert,unit:null},{...alert,confidence:2},{...alert,score:-1},{...alert,stale:null},{...alert,likes:-1},{...alert,dislikes:null},{...alert,myVote:'UP'},{...alert,baseConfidence:2}])
    assert.equal(validDashboard({...data,alerts:[invalid]}),false);
  const original=globalThis.fetch;
  try {
    globalThis.fetch=async()=>new Response(JSON.stringify({...data,readings:[null]}));
    await assert.rejects(fetchDashboard('http://localhost:8080'),/Resposta inválida/);
  } finally {globalThis.fetch=original;}
});
test('URLs impedem credenciais e protocolos executáveis',()=>{
  assert.equal(validateUrl(' http://localhost:8080/ '),'http://localhost:8080');
  for(const url of ['javascript:alert(1)','http://user:pass@host','http://host/api','http://host?token=x']) assert.throws(()=>validateUrl(url));
});
test('avisos só para novas ocorrências ou mudança de gravidade, sem duplicar polling',()=>{
  assert.equal(changedCritical(null,data).length,0); assert.equal(changedCritical(data,data).length,0);
  assert.equal(changedCritical({...data,alerts:[]},data).length,1);
  assert.equal(changedCritical({...data,alerts:[{...alert,severity:'Alto'}]},data).length,1);
});
test('leitura envelhece mesmo sem novas respostas do servidor',()=>{
  const fetched='2026-11-16T12:00:00Z';
  assert.equal(isStale(alert,data.serverTime,fetched,Date.parse(fetched)+91000),true);
  assert.equal(isStale(alert,data.serverTime,fetched,Date.parse(fetched)+1000),false);
});
test('resposta inválida não substitui snapshot e reconexão recupera dados',async()=>{
  const original=globalThis.fetch;
  try {
    globalThis.fetch=async()=>{throw new Error('offline');};
    await assert.rejects(fetchDashboard('http://localhost:8080'));
    globalThis.fetch=async()=>new Response('{"alerts":[]}');
    await assert.rejects(fetchDashboard('http://localhost:8080'));
    globalThis.fetch=async()=>new Response(JSON.stringify(data));
    assert.deepEqual(await fetchDashboard('http://localhost:8080'),data);
  } finally {globalThis.fetch=original;}
});
