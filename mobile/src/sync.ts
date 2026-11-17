import type { Dashboard, Snapshot, RiskAlert, Reading, Vote } from './types';

export function validateUrl(raw: string): string {
  const url = new URL(raw.trim());
  if(!['http:','https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== ''))
    throw new Error('Use um endereço HTTP ou HTTPS sem caminho, senha ou parâmetros.');
  return url.origin;
}
const record = (v:unknown):v is Record<string,unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const finite = (v:unknown):v is number => typeof v === 'number' && Number.isFinite(v);
const text = (v:unknown):v is string => typeof v === 'string' && v.trim().length > 0;
const timestamp = (v:unknown):v is string => typeof v === 'string' && Number.isFinite(Date.parse(v));
const type = (v:unknown) => typeof v === 'string' && ['FLOOD','HEAT','OUTAGE'].includes(v);
const source = (v:unknown) => typeof v === 'string' && ['SENSOR','PUBLIC_DATA','COMMUNITY'].includes(v);
function validReading(r:unknown):r is Reading {
  return record(r) && Number.isSafeInteger(r.id) && (r.id as number)>0 && type(r.type) && source(r.source)
    && text(r.district) && finite(r.value) && r.value>=0 && timestamp(r.observedAt);
}
function validAlert(a:unknown):a is RiskAlert {
  return record(a) && text(a.id) && Number.isSafeInteger(a.readingId) && (a.readingId as number)>0
    && type(a.type) && source(a.source) && text(a.title) && text(a.district) && finite(a.value) && a.value>=0
    && text(a.unit) && text(a.sourceLabel) && finite(a.confidence) && a.confidence>=0 && a.confidence<=1
    && finite(a.baseConfidence) && a.baseConfidence>=0 && a.baseConfidence<=1
    && Number.isSafeInteger(a.likes) && (a.likes as number)>=0 && Number.isSafeInteger(a.dislikes) && (a.dislikes as number)>=0
    && typeof a.myVote==='string' && ['LIKE','DISLIKE','NONE'].includes(a.myVote) && text(a.confidenceExplanation)
    && Number.isSafeInteger(a.score) && (a.score as number)>=0 && (a.score as number)<=100
    && typeof a.severity==='string' && ['Crítico','Alto','Moderado','Baixo'].includes(a.severity)
    && text(a.trend) && text(a.explanation) && text(a.recommendation) && timestamp(a.observedAt)
    && typeof a.stale==='boolean' && a.simulated===true;
}
export function validDashboard(d: unknown): d is Dashboard {
  return record(d) && timestamp(d.serverTime) && d.simulated===true && Number.isSafeInteger(d.storedReadings)
    && (d.storedReadings as number)>=0 && Array.isArray(d.readings) && d.readings.every(validReading)
    && Array.isArray(d.alerts) && d.alerts.every(validAlert);
}
export function parseSnapshot(raw: string | null): Snapshot | null {
  try { const v = JSON.parse(raw || 'null'); return v && validDashboard(v.data) && Number.isFinite(Date.parse(v.savedAt)) ? v : null; }
  catch { return null; }
}
export async function fetchDashboard(base: string, signal?: AbortSignal,clientId?:string|null): Promise<Dashboard> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if(signal?.aborted) controller.abort();
  signal?.addEventListener('abort',abort);
  const timeout = setTimeout(abort,5000);
  try {
    const response = await fetch(`${validateUrl(base)}/api/dashboard`,{signal:controller.signal,headers:clientId?{'X-Client-Id':clientId}:{}});
    if(!response.ok) throw new Error(`API retornou HTTP ${response.status}`);
    const result:unknown = await response.json();
    if(!validDashboard(result)) throw new Error('Resposta inválida da API');
    return result;
  } finally { clearTimeout(timeout); signal?.removeEventListener('abort',abort); }
}
export async function sendReaction(base:string,readingId:number,clientId:string,vote:Vote):Promise<void> {
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),5000);
  try {
    const response=await fetch(`${validateUrl(base)}/api/readings/${readingId}/reaction`,{
      method:'PUT',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId,vote}),
    });
    if(!response.ok)throw new Error(`Não foi possível confirmar seu voto (HTTP ${response.status}). Atualize e tente novamente.`);
  } catch(error) {
    if(error instanceof Error&&error.message.startsWith('Não foi possível'))throw error;
    throw new Error('Não foi possível confirmar seu voto. Confira a conexão e tente novamente.');
  } finally {clearTimeout(timeout);}
}
export function changedCritical(previous: Dashboard | null, next: Dashboard): RiskAlert[] {
  if(!previous) return [];
  return next.alerts.filter(a => {
    const old = previous.alerts.find(p => p.id === a.id);
    return a.score >= 60 && !a.stale && (!old || old.severity !== a.severity);
  });
}
export function isStale(a: RiskAlert, serverTime: string, fetchedAt: string, now = Date.now()): boolean {
  const atFetch = Math.max(0,Date.parse(serverTime)-Date.parse(a.observedAt));
  return a.stale || atFetch + Math.max(0,now-Date.parse(fetchedAt)) > 90000;
}
