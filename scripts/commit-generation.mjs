import fs from 'node:fs/promises';
import path from 'node:path';

export async function commitGeneration(stage, destination, names, beforeInstall = async()=>{}) {
 const backup=path.join(stage,'.backup');
 await fs.mkdir(backup,{recursive:true});
 const installed=[];
 const saved=[];
 try{
  for(const name of names){
   const target=path.join(destination,name), previous=path.join(backup,name), incoming=path.join(stage,name);
   await fs.mkdir(path.dirname(target),{recursive:true});
   await fs.mkdir(path.dirname(previous),{recursive:true});
   const existing=await fs.stat(target).catch(()=>null);
   if(existing){await fs.rename(target,previous);saved.push(name)}
   const modules=path.join(previous,'node_modules');
   if(existing?.isDirectory() && await fs.stat(modules).catch(()=>null)) await fs.rename(modules,path.join(incoming,'node_modules'));
   await beforeInstall(name);
   await fs.rename(incoming,target);installed.push(name);
  }
 }catch(error){
  for(const name of [...names].reverse()){
   const target=path.join(destination,name),previous=path.join(backup,name),incoming=path.join(stage,name);
   const active=installed.includes(name)?target:incoming;
   if(saved.includes(name)){
    const modules=path.join(active,'node_modules');
    if(await fs.stat(modules).catch(()=>null))await fs.rename(modules,path.join(previous,'node_modules'));
   }
   if(installed.includes(name))await fs.rm(target,{recursive:true,force:true});
   if(saved.includes(name))await fs.rename(previous,target);
  }
  throw error;
 }
}
