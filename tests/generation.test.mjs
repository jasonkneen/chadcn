import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {commitGeneration} from '../scripts/commit-generation.mjs';

test('metadata replacement failure rolls packages, catalog, and source lock back together',async()=>{
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'chadcn-metadata-'));
 const entries=['packages/upstream-demo','data/catalog.json','sources.lock.json'];
 try{
  for(const base of ['old','stage']){
   await fs.mkdir(`${directory}/${base}/packages/upstream-demo`,{recursive:true});
   await fs.mkdir(`${directory}/${base}/data`,{recursive:true});
   await fs.writeFile(`${directory}/${base}/packages/upstream-demo/version`,base);
   await fs.writeFile(`${directory}/${base}/data/catalog.json`,JSON.stringify({generation:base}));
   await fs.writeFile(`${directory}/${base}/sources.lock.json`,JSON.stringify({generation:base}));
  }
  await assert.rejects(commitGeneration(`${directory}/stage`,`${directory}/old`,entries,async name=>{if(name==='sources.lock.json')throw new Error('metadata failure')}),/metadata failure/);
  assert.equal(await fs.readFile(`${directory}/old/packages/upstream-demo/version`,'utf8'),'old');
  for(const name of entries.slice(1))assert.equal(JSON.parse(await fs.readFile(`${directory}/old/${name}`)).generation,'old');
 }finally{await fs.rm(directory,{recursive:true,force:true})}
});

test('failed generation replacement restores every previous package and installed dependencies',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'chadcn-generation-'));
 try{
  for(const name of ['a','b']){
   await fs.mkdir(`${root}/old/${name}/node_modules`,{recursive:true});await fs.mkdir(`${root}/stage/${name}`,{recursive:true});
   await fs.writeFile(`${root}/old/${name}/version`,'old');await fs.writeFile(`${root}/stage/${name}/version`,'new');await fs.writeFile(`${root}/old/${name}/node_modules/installed`,'keep');
  }
  await assert.rejects(commitGeneration(`${root}/stage`,`${root}/old`,['a','b'],async name=>{if(name==='b')throw new Error('disk failure')}),/disk failure/);
  for(const name of ['a','b']){assert.equal(await fs.readFile(`${root}/old/${name}/version`,'utf8'),'old');assert.equal(await fs.readFile(`${root}/old/${name}/node_modules/installed`,'utf8'),'keep')}
 }finally{await fs.rm(root,{recursive:true,force:true})}
});
test('successful regeneration keeps installed nested dependencies',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'chadcn-generation-'));
 try{
  await fs.mkdir(`${root}/old/a/node_modules`,{recursive:true});await fs.mkdir(`${root}/stage/a`,{recursive:true});
  await fs.writeFile(`${root}/old/a/node_modules/installed`,'keep');await fs.writeFile(`${root}/stage/a/version`,'new');
  await commitGeneration(`${root}/stage`,`${root}/old`,['a']);
  assert.equal(await fs.readFile(`${root}/old/a/node_modules/installed`,'utf8'),'keep');assert.equal(await fs.readFile(`${root}/old/a/version`,'utf8'),'new');
 }finally{await fs.rm(root,{recursive:true,force:true})}
});
