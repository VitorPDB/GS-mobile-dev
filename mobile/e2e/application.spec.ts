import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'node:child_process';
import { mkdirSync, mkdtempSync, createWriteStream } from 'node:fs';
import { resolve } from 'node:path';

let backend:ChildProcess;
const evidence=resolve('../docs/images');
const java=process.env.TEST_JAVA || 'java';
const jar=resolve('../backend/target/urban-risk-1.0.0.jar');
let databaseUrl:string;
async function startBackend() {
  backend=spawn(java,['-jar',jar],{cwd:resolve('..'),env:{...process.env,PORT:'8082',DB_URL:databaseUrl,DEMO_ENABLED:'true'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  const log=createWriteStream(resolve('../data/e2e-backend.log'),{flags:'a'});
  backend.stdout?.pipe(log);backend.stderr?.pipe(log);
  await expect.poll(async()=>{try{return (await fetch('http://localhost:8082/actuator/health')).status;}catch{return 0;}},{timeout:30000}).toBe(200);
}
async function stopBackend() {
  if(!backend || backend.exitCode!==null) return;
  await new Promise<void>(resolve=>{backend.once('exit',()=>resolve());backend.kill();});
}
test.beforeAll(async()=>{
  mkdirSync(evidence,{recursive:true});mkdirSync(resolve('../data'),{recursive:true});
  const directory=mkdtempSync(resolve('../data/e2e-'));
  databaseUrl=`jdbc:h2:file:${directory.replaceAll('\\','/')}/monitoring;DB_CLOSE_ON_EXIT=FALSE`;
  await startBackend();
});
test.afterAll(async()=>{await stopBackend();});

test('API real, filtros, detalhes, cache após queda e reconexão',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await page.getByRole('tab',{name:'Conexão',exact:true}).click();
  await page.getByRole('textbox',{name:'Endereço da API'}).fill('http://localhost:8082');
  await page.getByRole('button',{name:'Salvar e conectar'}).click();
  await expect(page.getByText('Conectado',{exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'Painel',exact:true}).click();
  await expect(page.getByText('9 locais e riscos',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Calor extremo',exact:true}).click();
  await expect(page.getByRole('button',{name:/^Calor extremo, /})).toHaveCount(3);
  await page.getByRole('button',{name:/^Calor extremo, Jardim das Flores,/}).click();
  await expect(page.getByText(/Por que este alerta tem prioridade/)).toBeVisible();
  await expect(page.getByText(/Origem: Base pública simulada/)).toBeVisible();
  await page.getByRole('button',{name:'Todos',exact:true}).click();
  await page.screenshot({path:resolve(evidence,'desktop-online.png'),fullPage:true});

  // Change a moderate risk to critical and check the in-app notification.
  await fetch('http://localhost:8082/api/readings',{method:'POST',headers:{'Content-Type':'application/json','X-Ingest-Token':'local-demo-only'},body:JSON.stringify({type:'HEAT',source:'PUBLIC_DATA',district:'Vila Esperança',value:42})});
  await page.getByRole('button',{name:'Atualizar',exact:true}).click();
  await expect(page.getByText(/alerta\(s\) novo\(s\)/)).toBeVisible();
  await page.getByRole('button',{name:'Entendi',exact:true}).click();
  const beforeRestart=await (await fetch('http://localhost:8082/api/dashboard')).json();
  expect(beforeRestart.storedReadings).toBeGreaterThan(9);
  const survivingId=beforeRestart.readings[0].id;
  await stopBackend();
  await expect(page.getByText('Sem conexão',{exact:true})).toBeVisible({timeout:15000});
  await expect(page.getByText('9 locais e riscos',{exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByText('Sem conexão',{exact:true})).toBeVisible({timeout:15000});
  await expect(page.getByText('9 locais e riscos',{exact:true})).toBeVisible();
  await page.screenshot({path:resolve(evidence,'desktop-offline.png'),fullPage:true});
  await startBackend();
  await expect(page.getByText('Conectado',{exact:true})).toBeVisible({timeout:20000});
  const afterRestart=await (await fetch('http://localhost:8082/api/dashboard')).json();
  expect(afterRestart.storedReadings).toBeGreaterThanOrEqual(beforeRestart.storedReadings);
  expect(afterRestart.readings.some((r:{id:number})=>r.id===survivingId)).toBe(true);
  await expect(page.getByText('Servidor indisponível',{exact:true})).toHaveCount(0);
  await page.getByRole('tab',{name:'Atividade',exact:true}).click();
  await expect(page.getByText('Histórico recebido',{exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});

test('largura compacta, tema escuro e primeiro acesso sem cache',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/');
  await page.getByRole('tab',{name:'Conexão',exact:true}).click();
  await page.getByRole('textbox',{name:'Endereço da API'}).fill('http://localhost:8082');
  await page.getByRole('button',{name:'Salvar e conectar'}).click();
  await expect(page.getByText('Conectado',{exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'Painel',exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:resolve(evidence,'compact-dark-web.png'),fullPage:true});
  await page.getByRole('tab',{name:'Conexão',exact:true}).click();
  await page.getByRole('textbox',{name:'Endereço da API'}).fill('http://localhost:18999');
  await page.getByRole('button',{name:'Salvar e conectar'}).click();
  await expect(page.getByText('Sem conexão',{exact:true})).toBeVisible({timeout:15000});
  await expect(page.getByText(/Ainda não há dados salvos deste servidor/)).toBeVisible();
  await page.screenshot({path:resolve(evidence,'compact-first-offline-web.png'),fullPage:true});
});
