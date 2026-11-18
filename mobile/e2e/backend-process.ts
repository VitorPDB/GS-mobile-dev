import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { createWriteStream } from 'node:fs';

export const TEST_API='http://127.0.0.1:8082';
export async function assertPortAvailable(port:number):Promise<void> {
  await new Promise<void>((resolve,reject)=>{
    const probe=createServer();
    probe.once('error',()=>reject(new Error(`Porta ${port} ocupada: o teste não iniciará nem enviará dados a outro serviço.`)));
    probe.listen(port,'127.0.0.1',()=>probe.close(error=>error?reject(error):resolve()));
  });
}
function waitForExit(child:ChildProcess,milliseconds:number):Promise<boolean> {
  if(child.exitCode!==null||child.signalCode!==null||!child.pid)return Promise.resolve(true);
  return new Promise(resolve=>{
    const exit=()=>{clearTimeout(timer);resolve(true);};
    const timer=setTimeout(()=>{child.removeListener('exit',exit);resolve(false);},milliseconds);
    child.once('exit',exit);
  });
}
export async function stopOwnedBackend(child?:ChildProcess):Promise<void> {
  if(!child||child.exitCode!==null||child.signalCode!==null||!child.pid)return;
  const stopped=waitForExit(child,8000);child.kill();
  if(await stopped)return;
  const forced=waitForExit(child,3000);child.kill('SIGKILL');
  if(!await forced)throw new Error('A API criada pelo teste não encerrou no prazo.');
}
export async function startOwnedBackend(options:{java:string;jar:string;cwd:string;databaseUrl:string;log:string}):Promise<ChildProcess> {
  await assertPortAvailable(8082);
  const output=createWriteStream(options.log,{flags:'a'});
  const child=spawn(options.java,['-jar',options.jar],{
    cwd:options.cwd,windowsHide:true,stdio:['ignore','pipe','pipe'],
    env:{...process.env,PORT:'8082',SERVER_ADDRESS:'127.0.0.1',CORS_ORIGINS:'http://127.0.0.1:8091',DB_URL:options.databaseUrl,DEMO_ENABLED:'true'},
  });
  let startupError:Error|undefined;
  let log='';
  child.on('error',error=>{startupError=error;});
  child.stdout?.on('data',chunk=>{log=(log+chunk.toString()).slice(-64000);});
  child.stdout?.pipe(output,{end:false});child.stderr?.pipe(output,{end:false});
  child.once('close',()=>output.end());
  try {
    const deadline=Date.now()+30000;
    while(Date.now()<deadline){
      if(startupError)throw startupError;
      if(child.exitCode!==null||child.signalCode!==null)throw new Error(`A API criada pelo teste encerrou durante o início (código ${child.exitCode}).`);
      // Health alone is insufficient: first require this exact child to finish startup.
      if(log.includes('Started UrbanRiskApplication')) {
        try {
          const response=await fetch(`${TEST_API}/actuator/health`,{signal:AbortSignal.timeout(1000)});
          if(response.ok&&child.exitCode===null&&child.signalCode===null&&(await response.json()).status==='UP')return child;
        } catch { /* Retry only while our child is still running. */ }
      }
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw new Error('A API própria não ficou disponível em 30 segundos.');
  } catch(error) {await stopOwnedBackend(child);throw error;}
}
