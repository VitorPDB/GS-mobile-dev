import { test, expect } from '@playwright/test';
import type { ChildProcess } from 'node:child_process';
import { startOwnedBackend, stopOwnedBackend } from './backend-process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

let backend:ChildProcess;
const evidence=resolve('../docs/images');
const java=process.env.TEST_JAVA || 'java';
const jar=resolve('../backend/target/urban-risk-1.0.0.jar');
let databaseUrl:string;
async function startBackend(){
  backend=await startOwnedBackend({java,jar,cwd:resolve('..'),databaseUrl,log:resolve('../data/e2e-backend.log')});
}
async function stopBackend(){await stopOwnedBackend(backend);}
test.beforeAll(async()=>{
  mkdirSync(evidence,{recursive:true});mkdirSync(resolve('../data'),{recursive:true});
  const directory=mkdtempSync(resolve('../data/e2e-'));
  databaseUrl=`jdbc:h2:file:${directory.replaceAll('\\','/')}/monitoring;DB_CLOSE_ON_EXIT=FALSE;WRITE_DELAY=0`;
  await startBackend();
});
test.afterAll(async()=>{await stopBackend();});
test.beforeEach(async({page})=>{
  // Real API in an isolated process; only its host is redirected. No mocked JSON.
  await page.route('**/api/**',route=>route.continue({url:'http://127.0.0.1:8082'+new URL(route.request().url()).pathname}));
});
test('feed, análise, aviso e preservação dos dados após queda real',async({page,browser})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  // A removed legacy address must not override the environment configuration.
  await page.addInitScript(()=>localStorage.setItem('vigia:api:v1','http://localhost:18999'));
  await page.goto('/');
  await expect(page.getByText('Conectado',{exact:true})).toBeVisible();
  await expect(page.getByText('9 ocorrências · por prioridade',{exact:true})).toBeVisible();
  await expect(page.getByRole('tab',{name:'Conexão',exact:true})).toHaveCount(0);
  await expect(page.getByRole('textbox')).toHaveCount(0);
  await expect(page.getByText('URIP',{exact:true})).toBeVisible();
  await expect(page.getByText('Urban Risk Intelligence Platform',{exact:true}).first()).toBeVisible();
  await page.getByRole('button',{name:'Calor extremo',exact:true}).click();
  await expect(page.getByRole('button',{name:/^Calor extremo, /})).toHaveCount(3);
  await page.getByRole('button',{name:/^Calor extremo, Jardim das Flores,/}).click();
  await expect(page.getByText(/Por que este alerta tem prioridade/)).toBeVisible();
  await expect(page.getByText(/Origem: Base pública simulada/)).toBeVisible();
  await page.screenshot({path:resolve(evidence,'urip-desktop-analysis.png')});
  await page.getByRole('button',{name:'Todos',exact:true}).click();
  await page.getByRole('heading',{name:'Seu radar urbano.'}).scrollIntoViewIfNeeded();
  await page.screenshot({path:resolve(evidence,'urip-desktop-feed.png')});
  const like=page.getByRole('button',{name:'Like em Alagamento, Vila Esperança',exact:true});
  const dislike=page.getByRole('button',{name:'Dislike em Alagamento, Vila Esperança',exact:true});
  await like.click();
  await expect(like).toHaveAttribute('aria-pressed','true');
  await expect(like).toContainText('1');
  await expect(page.getByText('Confiança 92%',{exact:true})).toBeVisible();
  await page.screenshot({path:resolve(evidence,'urip-reactions-like.png')});
  await page.reload();
  await expect(like).toHaveAttribute('aria-pressed','true');
  await expect(like).toContainText('1');
  await dislike.click();
  await expect(dislike).toHaveAttribute('aria-pressed','true');
  await expect(like).toContainText('0');
  await expect(dislike).toContainText('1');
  await expect(page.getByText('Confiança 72%',{exact:true})).toBeVisible();
  await dislike.click();
  await expect(dislike).toHaveAttribute('aria-pressed','false');
  await expect(dislike).toContainText('0');
  await like.click();
  await expect(like).toHaveAttribute('aria-pressed','true');
  // A second browser profile represents another installation. Counters are shared in the DB.
  const otherContext=await browser.newContext();
  try {
    const other=await otherContext.newPage();
    await other.route('**/api/**',route=>route.continue({url:'http://127.0.0.1:8082'+new URL(route.request().url()).pathname}));
    await other.goto('http://127.0.0.1:8091/');
    await expect(other.getByText('Conectado',{exact:true})).toBeVisible();
    const otherLike=other.getByRole('button',{name:'Like em Alagamento, Vila Esperança',exact:true});
    await otherLike.click();
    await expect(otherLike).toContainText('2');
    await expect(other.getByText('Confiança 93%',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Atualizar',exact:true}).click();
    await expect(like).toContainText('2');
    await otherLike.click();
    await expect(otherLike).toHaveAttribute('aria-pressed','false');
    await page.getByRole('button',{name:'Atualizar',exact:true}).click();
    await expect(like).toContainText('1');
  } finally {await otherContext.close();}
  const initialRefresh=await(await fetch('http://127.0.0.1:8082/api/dashboard')).json();
  let nextObservedAt=initialRefresh.readings[0].observedAt;
  await expect.poll(async()=>{
    const snapshot=await(await fetch('http://127.0.0.1:8082/api/dashboard',{signal:AbortSignal.timeout(1000)})).json();
    nextObservedAt=snapshot.readings[0].observedAt;
    return nextObservedAt;
  },{timeout:16000,intervals:[1000]}).not.toBe(initialRefresh.readings[0].observedAt);
  const timing={previous:initialRefresh.readings[0].observedAt,current:nextObservedAt,intervalMs:Date.parse(nextObservedAt)-Date.parse(initialRefresh.readings[0].observedAt)};
  mkdirSync(resolve('../docs/evidence'),{recursive:true});
  writeFileSync(resolve('../docs/evidence/automatic-update-timing.json'),JSON.stringify(timing,null,2));
  await test.info().attach('automatic-update-timing',{body:JSON.stringify(timing),contentType:'application/json'});
  await fetch('http://127.0.0.1:8082/api/readings',{method:'POST',headers:{'Content-Type':'application/json','X-Ingest-Token':'local-demo-only'},body:JSON.stringify({type:'HEAT',source:'PUBLIC_DATA',district:'Vila Esperança',value:42})});
  await page.getByRole('button',{name:'Atualizar',exact:true}).click();
  await expect(page.getByText(/alerta\(s\) novo\(s\)/)).toBeVisible();
  await page.getByRole('button',{name:'Entendi',exact:true}).click();
  const before=await(await fetch('http://127.0.0.1:8082/api/dashboard')).json();
  const survivingId=before.readings[0].id;
  expect(before.storedReadings).toBeGreaterThan(9);
  await stopBackend();
  await expect(page.getByText('Sem conexão',{exact:true})).toBeVisible({timeout:15000});
  await page.reload();
  await expect(page.getByText('Sem conexão',{exact:true})).toBeVisible({timeout:15000});
  await expect(page.getByText('9 ocorrências · por prioridade',{exact:true})).toBeVisible();
  await expect(like).toBeDisabled();
  await page.screenshot({path:resolve(evidence,'urip-desktop-offline.png')});
  await startBackend();
  await expect(page.getByText('Conectado',{exact:true})).toBeVisible({timeout:20000});
  const after=await(await fetch('http://127.0.0.1:8082/api/dashboard')).json();
  expect(after.storedReadings).toBeGreaterThanOrEqual(before.storedReadings);
  const feedback=after.alerts.find((a:{id:string})=>a.id==='FLOOD:Vila Esperança');
  expect(feedback.likes).toBe(1);
  expect(feedback.dislikes).toBe(0);
  await expect(like).toHaveAttribute('aria-pressed','true');
  expect(after.readings.some((r:{id:number})=>r.id===survivingId)).toBe(true);
  await expect(page.getByText('Atualizações pausadas',{exact:true})).toHaveCount(0);
  await page.getByRole('tab',{name:'Atividade',exact:true}).click();
  await expect(page.getByText('Histórico recebido',{exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});
test('feed compacto, preferência escura, primeiro acesso offline e teclado',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/');
  await expect(page.getByText('Conectado',{exact:true})).toBeVisible();
  await expect(page.getByRole('tab',{name:'Conexão',exact:true})).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:resolve(evidence,'urip-compact-feed.png')});
  await page.getByRole('button',{name:'Panorama',exact:true}).click();
  await expect(page.getByText('Níveis altos ou críticos, por risco.',{exact:true})).toBeVisible();
  await page.screenshot({path:resolve(evidence,'urip-compact-panorama.png')});
  await page.getByRole('button',{name:'Panorama',exact:true}).click();
  await page.getByRole('tab',{name:'Atividade',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Histórico recebido',{exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'Feed',exact:true}).click();
  await page.setViewportSize({width:320,height:740});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:resolve(evidence,'urip-small-feed.png')});
  const compactLike=page.getByRole('button',{name:'Like em Alagamento, Vila Esperança',exact:true});
  await page.getByRole('button',{name:/^Alagamento, Vila Esperança,/}).click();
  await compactLike.scrollIntoViewIfNeeded();
  await page.screenshot({path:resolve(evidence,'urip-reactions-320.png')});
  await page.setViewportSize({width:390,height:844});
  await compactLike.scrollIntoViewIfNeeded();
  await page.screenshot({path:resolve(evidence,'urip-reactions-390.png')});

  // Simulate first access without cached data while the service is unreachable.
  await page.route('**/api/dashboard',route=>route.abort('connectionfailed'));
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  await expect(page.getByText('Sem conexão',{exact:true})).toBeVisible({timeout:15000});
  await expect(page.getByText(/Ainda não há dados salvos/)).toBeVisible();
  await page.screenshot({path:resolve(evidence,'urip-compact-empty.png')});
});
