import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist');
const port=Number(process.env.WEB_PORT||8081);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('WEB_PORT inválida');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.ttf':'font/ttf','.png':'image/png','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+sep)) {res.writeHead(403);res.end();return;}
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  } catch {res.writeHead(404);res.end('Arquivo não encontrado. Execute npm run build:web.');}
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://localhost:${port}`));
