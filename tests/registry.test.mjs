import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { identifyVariants } from '../scripts/variants.mjs';
import { parseAwesome, readJSON } from '../scripts/lib.mjs';
import { buildSourcePackage } from '../scripts/package-source.mjs';

test('same-name upstream variants survive reordering with stable identities',()=>{
 const source={id:'blocks',homepage:'https://blocks.so'};
 const first={name:'upload',files:[{path:'upload/index.tsx'}]};
 const second={name:'upload',files:[{path:'upload.tsx'}]};
 const a=identifyVariants([first,second],source);
 const b=identifyVariants([second,first],source);
 assert.equal(new Set(a.map(i=>i.id)).size,2);
 assert.equal(a[0].id,b[1].id);
 assert.equal(a[0].family,a[1].family);
 assert.equal(a[0].variant.registry,'blocks');
 assert.equal(a[0].upstreamName,'upload');
});
test('awesome discovery preserves categories and duplicate names from different URLs',()=>{
 const text='## Templates\n| Name | Description | Link | Date |\n| hello | One | [Link](https://a.example) | 2026 |\n| hello | Two | [Link](https://b.example) | 2026 |';
 const items=parseAwesome(text);
 assert.equal(items.length,2);assert.notEqual(items[0].id,items[1].id);assert.equal(items[0].category,'Templates');assert.equal(items[0].status,'discovered');
});
test('dependency packaging follows upstream updates without modifying compositions',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'chadcn-test-'));
 try {
  await fs.mkdir(path.join(dir,'upstream/lib'),{recursive:true});
  await fs.writeFile(path.join(dir,'upstream/package.json'),JSON.stringify({dependencies:{react:'^19.2.0'}}));
  await fs.writeFile(path.join(dir,'upstream/index.ts'),'export { label } from "@/lib/value";');
  await fs.writeFile(path.join(dir,'upstream/lib/value.ts'),'export const label: string = "before";');
  await fs.writeFile(path.join(dir,'composition.ts'),'export { label as customLabel } from "@chadcn/upstream-fixture/item";');
  const source={id:'fixture',path:path.join(dir,'upstream'),root:'',aliases:{'@/':''},repository:'https://example.com/fixture'};
  const getItems=()=>[{name:'item',files:[{path:'index.ts'}]}];
  const first=await buildSourcePackage(source,getItems(),path.join(dir,'first'));
  assert.equal(first.items[0].status,'packaged');
  assert.equal((await import(path.join(dir,'first/src/index.js'))).label,'before');
  await fs.writeFile(path.join(dir,'upstream/lib/value.ts'),'export const label: string = "after";');
  await buildSourcePackage(source,getItems(),path.join(dir,'second'));
  assert.equal((await import(path.join(dir,'second/src/index.js'))).label,'after');
  assert.match(await fs.readFile(path.join(dir,'composition.ts'),'utf8'),/customLabel/);
  const a=await readJSON(path.join(dir,'first/provenance.json'));const b=await readJSON(path.join(dir,'second/provenance.json'));
  assert.notDeepEqual(a.modules,b.modules);
 } finally {await fs.rm(dir,{recursive:true,force:true})}
});
test('unresolved imports propagate to dependent entries and never count as packaged',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'chadcn-missing-'));
 try {
  await fs.writeFile(path.join(dir,'index.ts'),'export { x } from "./missing";');
  const result=await buildSourcePackage({id:'broken',path:dir,root:'',aliases:{}},[{name:'broken',files:[{path:'index.ts'}]}],path.join(dir,'out'));
  assert.equal(result.items[0].status,'needs-adapter');assert.match(result.items[0].errors[0],/Unresolved/);
 } finally {await fs.rm(dir,{recursive:true,force:true})}
});

test('upstream style assets are exported, hashed, and confined to the checkout',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'chadcn-assets-'));
 try {
  await fs.mkdir(path.join(dir,'upstream/app'),{recursive:true});
  await fs.writeFile(path.join(dir,'upstream/theme.css'),'.theme { color: red }');
  const source={id:'fixture',path:path.join(dir,'upstream'),root:'app',assets:{'theme.css':'theme.css'}};
  const output=path.join(dir,'output');
  await buildSourcePackage(source,[],output);
  assert.equal((await readJSON(path.join(output,'package.json'))).exports['./theme.css'],'./assets/theme.css');
  assert.equal(await fs.readFile(path.join(output,'assets/theme.css'),'utf8'),'.theme { color: red }');
  assert.equal((await readJSON(path.join(output,'provenance.json'))).modules[0].path,'../theme.css');
  await assert.rejects(buildSourcePackage({...source,assets:{'theme.css':'../../outside.css'}},[],output),/escapes its checkout/);
  await assert.rejects(buildSourcePackage({...source,assets:{'../../escape.css':'theme.css'}},[],output),/Invalid asset export/);
 } finally {await fs.rm(dir,{recursive:true,force:true});}
});
