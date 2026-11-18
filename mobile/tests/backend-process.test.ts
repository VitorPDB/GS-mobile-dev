import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertPortAvailable, startOwnedBackend } from '../e2e/backend-process';

test('porta ocupada é recusada sem enviar requisições ao serviço existente',async()=>{
  let requests=0;
  const server=createServer((_request,response)=>{requests++;response.end('serviço alheio');});
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const address=server.address();assert.ok(address&&typeof address!=='string');
  try {
    await assert.rejects(assertPortAvailable(address.port),/ocupada/);
    assert.equal(requests,0);
    assert.equal(await(await fetch(`http://127.0.0.1:${address.port}`)).text(),'serviço alheio');
  } finally {await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
test('falha do processo filho encerra startup sem aceitar saúde de terceiros',async()=>{
  mkdirSync(resolve('test-results'),{recursive:true});
  await assert.rejects(startOwnedBackend({java:process.execPath,jar:'not-a-java-jar',cwd:process.cwd(),databaseUrl:'unused',log:resolve('test-results/child-startup.log')}),/encerrou durante o início/);
});
