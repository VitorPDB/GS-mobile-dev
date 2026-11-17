import test from 'node:test';
import assert from 'node:assert/strict';
import { installationId, INSTALLATION_KEY } from '../src/identity';
import { sendReaction } from '../src/sync';

const uuid='2c27554c-f00d-4b7e-88c8-035ab14b0f15';
test('identificador de instalação é salvo e reutilizado, inclusive após recarga',async()=>{
  const values=new Map<string,string>();let generated=0;
  const storage={getItem:async(k:string)=>values.get(k)||null,setItem:async(k:string,v:string)=>{values.set(k,v);}};
  const create=()=>{generated++;return uuid;};
  assert.equal(await installationId(storage,create),uuid);
  assert.equal(await installationId(storage,create),uuid);
  assert.equal(generated,1);
  values.set(INSTALLATION_KEY,'corrompido');
  assert.equal(await installationId(storage,create),uuid);
  assert.equal(generated,2);
});
test('falha de armazenamento não permite criar votos com identidades descartáveis',async()=>{
  await assert.rejects(installationId({getItem:async()=>null,setItem:async()=>{throw Error('indisponível');}},()=>uuid));
});
test('voto usa PUT idempotente e falha HTTP não é apresentada como sucesso',async()=>{
  const original=globalThis.fetch;
  const requests:RequestInit[]=[];
  try {
    globalThis.fetch=async(_url,init)=>{requests.push(init!);return new Response(null,{status:204});};
    await sendReaction('http://localhost:8080',1,uuid,'LIKE');
    assert.equal(requests[0].method,'PUT');
    assert.deepEqual(JSON.parse(requests[0].body as string),{clientId:uuid,vote:'LIKE'});
    globalThis.fetch=async()=>new Response(null,{status:409});
    await assert.rejects(sendReaction('http://localhost:8080',1,uuid,'DISLIKE'),/HTTP 409/);
    globalThis.fetch=async()=>{throw Error('offline');};
    await assert.rejects(sendReaction('http://localhost:8080',1,uuid,'NONE'),/confirmar seu voto/);
  } finally {globalThis.fetch=original;}
});
