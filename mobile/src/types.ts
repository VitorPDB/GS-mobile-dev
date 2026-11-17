export type RiskType = 'FLOOD' | 'HEAT' | 'OUTAGE';
export type Severity = 'Crítico' | 'Alto' | 'Moderado' | 'Baixo';
export type Vote = 'LIKE' | 'DISLIKE' | 'NONE';
export interface RiskAlert {
  id: string; readingId: number; type: RiskType; title: string; district: string;
  value: number; unit: string; source: string; sourceLabel: string; confidence: number;
  baseConfidence:number; likes:number; dislikes:number; myVote:Vote; confidenceExplanation:string;
  score: number; severity: Severity; trend: string; explanation: string;
  recommendation: string; observedAt: string; stale: boolean; simulated: boolean;
}
export interface Reading { id: number; type: RiskType; source: string; district: string; value: number; observedAt: string; }
export interface Dashboard { serverTime: string; simulated: boolean; alerts: RiskAlert[]; readings: Reading[]; storedReadings: number; }
export interface Snapshot { data: Dashboard; savedAt: string; }
export const labels: Record<RiskType,string> = { FLOOD:'Alagamento', HEAT:'Calor extremo', OUTAGE:'Energia' };
