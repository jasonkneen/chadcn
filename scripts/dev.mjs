import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { config, root } from './lib.mjs';

const settings=await config();
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1'],{cwd:root,stdio:'inherit'});
let timer,running,pending=false,stopping=false;
const watchers=[];
function sync(){
 if(stopping)return;
 if(running){pending=true;return;}
 console.log('Upstream changed; rebuilding dependency adapters…');
 running=spawn(process.execPath,['scripts/sync.mjs'],{cwd:root,stdio:'inherit'});
 running.on('exit',code=>{running=null;if(code===75){pending=false;clearTimeout(timer);timer=setTimeout(sync,1500);return;}if(code!==0)console.error('Upstream sync failed. Previous generated packages remain available.');if(pending){pending=false;sync()}});
}
const paths=new Set(settings.sources.filter(s=>!['directory','npm'].includes(s.kind)).map(s=>path.resolve(s.path,s.root)));
for(const directory of paths){
 if(!fs.existsSync(directory))continue;
 watchers.push(fs.watch(directory,{recursive:true},(_event,file)=>{
  if(!file||/(^|\/)(node_modules|\.git|\.next|dist)(\/|$)/.test(String(file)))return;
  if(!/\.(tsx?|jsx?|json|css|vue)$/.test(String(file)))return;
  clearTimeout(timer);timer=setTimeout(sync,1200);
 }));
}
function stop(){if(stopping)return;stopping=true;clearTimeout(timer);for(const watcher of watchers)watcher.close();running?.kill('SIGTERM');server.kill('SIGTERM')}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
server.on('exit',code=>{stop();process.exitCode=code??1});
