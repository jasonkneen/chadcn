import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const runtime=path.join(root,'.generated/runtime/node_modules');
for(const entry of fs.readdirSync(runtime,{withFileTypes:true})){
 if(entry.name.startsWith('.'))continue;
 const names=entry.name.startsWith('@')?fs.readdirSync(path.join(runtime,entry.name)).map(n=>`${entry.name}/${n}`):[entry.name];
 for(const name of names){
  const target=path.join(root,'node_modules',name);
  try{fs.lstatSync(target);continue}catch(error){if(error.code!=='ENOENT')throw error}
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.symlinkSync(path.relative(path.dirname(target),path.join(runtime,name)),target);
 }
}
