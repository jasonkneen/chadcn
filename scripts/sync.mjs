import fs from 'node:fs/promises';
import path from 'node:path';
import { config, root, readJSON, writeJSON, exists, walk, git, digest, parseAwesome } from './lib.mjs';
import { buildSourcePackage } from './package-source.mjs';
import { identifyVariants } from './variants.mjs';
import { readRegistryTree } from './read-registry.mjs';
import { commitGeneration } from './commit-generation.mjs';
import { enterWorkspaceLock } from './workspace-lock.mjs';

enterWorkspaceLock();
const settings = await config();
const stage = path.join(root,'.generated',`sync-${process.pid}`);
await fs.mkdir(stage,{recursive:true});
const catalog = [];
const lock = {schemaVersion:1,sources:[]};
try {
  for (const source of settings.sources) {
    const state = {id:source.id,repository:source.repository,kind:source.kind};
    lock.sources.push(state);
    if (!(await exists(source.path))) { state.status='missing-checkout'; continue; }
    try { state.commit = git(source.path,'rev-parse','HEAD'); state.dirty = !!git(source.path,'status','--porcelain'); } catch { state.commit = null; }
    if (['directory','npm'].includes(source.kind)) {
      state.status = source.kind === 'npm' ? 'npm-available' : 'discovered';
      catalog.push({id:source.id,name:source.id,source:source.id,homepage:source.homepage,repository:source.repository,framework:source.framework??'react',status:state.status,package:source.package,type:'library'});
      continue;
    }
    let items = [];
    if (source.kind === 'registry') {
      const registry = await readJSON(path.join(source.path,source.registry));
      items = registry.items.map(item=>({...item,files:(item.files??[]).map(({path,type})=>({path,type}))}));
    } else if (source.kind === 'registry-tree') {
      items = await readRegistryTree(source);
    } else if (source.kind === 'packages') {
      for (const entry of await fs.readdir(path.join(source.path,source.root))) {
        const pkg = await readJSON(path.join(source.path,source.root,entry,'package.json')).catch(()=>null);
        if (!pkg || !(await exists(path.join(source.path,source.root,entry,'index.tsx')))) continue;
        items.push({name:entry,description:pkg.description,type:'registry:component',files:[{path:`${entry}/index.tsx`}]});
      }
    } else if (source.kind === 'tree') {
      for (const file of await walk(path.join(source.path,source.root,source.entryRoot))) {
        if (!/\.tsx$/.test(file)) continue;
        items.push({name:path.basename(file,'.tsx'),type:'registry:component',files:[{path:path.relative(path.join(source.path,source.root),file)}]});
      }
    }
    items = identifyVariants(items,source);
    const result = await buildSourcePackage(source,items,path.join(stage,'packages',`upstream-${source.id}`));
    state.status=result.problems.length || result.items.some(i=>i.errors.length) ? 'partial' : 'packaged';
    state.items=items.length; state.modules=result.modules; state.problems=result.problems;
    state.contentHash=digest(JSON.stringify(await readJSON(path.join(stage,'packages',`upstream-${source.id}`,'provenance.json'))));
    catalog.push(...result.items);
    console.log(`${source.id}: ${items.length} items, ${result.modules} source modules, ${result.problems.length} adapter issues`);
  }
  const shadcn = settings.sources.find(s=>s.id==='shadcn');
  const directory = await readJSON(path.join(shadcn.path,'apps/v4/registry/directory.json'));
  for (const entry of directory) catalog.push({id:`directory:${entry.name}`,name:entry.name,source:'shadcn-directory',description:entry.description,homepage:entry.homepage,registry:entry.url,type:'library',status:'discovered',framework:'unknown'});
  const awesomePath = path.join(root,settings.discovery.cache);
  if (await exists(awesomePath)) {
    const markdown=await fs.readFile(awesomePath,'utf8');
    catalog.push(...parseAwesome(markdown));
    lock.discovery={...settings.discovery,sha256:digest(markdown)};
  } else lock.discovery={status:'missing',...settings.discovery};
  const ids = new Set();
  for (const item of catalog) { if (ids.has(item.id)) throw new Error(`Duplicate catalog id ${item.id}`); ids.add(item.id); }
  lock.generation=digest(JSON.stringify({sources:lock.sources,discovery:lock.discovery,catalog}));
  await writeJSON(path.join(stage,'data/catalog.json'),{schemaVersion:1,generation:lock.generation,items:catalog});
  await writeJSON(path.join(stage,'sources.lock.json'),lock);
  const packageNames=(await fs.readdir(path.join(stage,'packages'))).map(name=>`packages/${name}`);
  await commitGeneration(stage,root,[...packageNames,'data/catalog.json','sources.lock.json']);
  console.log(`Catalog: ${catalog.length} items; ${catalog.filter(i=>i.status==='packaged').length} packaged exports.`);
} finally { await fs.rm(stage,{recursive:true,force:true}); }
