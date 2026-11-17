export const INSTALLATION_KEY='urip:installation:v1';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
interface Storage {getItem:(key:string)=>Promise<string|null>;setItem:(key:string,value:string)=>Promise<void>;}
export async function installationId(storage:Storage,generate:()=>string):Promise<string> {
  const existing=await storage.getItem(INSTALLATION_KEY);
  if(existing&&uuid.test(existing))return existing;
  const id=generate();
  if(!uuid.test(id))throw new Error('Identificador inválido');
  await storage.setItem(INSTALLATION_KEY,id);
  return id;
}
