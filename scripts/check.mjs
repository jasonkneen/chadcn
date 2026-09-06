import fs from 'node:fs/promises';
import path from 'node:path';
import { config, readJSON, root, digest, exists } from './lib.mjs';
import { enterWorkspaceLock } from './workspace-lock.mjs';
enterWorkspaceLock();
const settings = await config();
const lock = await readJSON(`${root}/sources.lock.json`);
const catalog = await readJSON(`${root}/data/catalog.json`);
const problems=[];
if (!lock.generation || lock.generation!==catalog.generation) problems.push('Catalog and source lock have different generations; run npm run sync.');
for (const source of settings.sources) {
  const state=lock.sources.find(s=>s.id===source.id);
  if (!state?.contentHash) continue;
  const pkgRoot=`${root}/packages/upstream-${source.id}`;
  const provenance=await readJSON(`${pkgRoot}/provenance.json`);
  if(digest(JSON.stringify(provenance))!==state.contentHash) problems.push(`${source.id}: package provenance changed`);
  for (const file of provenance.modules) {
    const current=await fs.readFile(path.resolve(source.path,source.root,file.path)).catch(()=>null);
    if (!current || digest(current)!==file.hash) problems.push(`${source.id}: upstream changed: ${file.path}; run npm run install:upstreams`);
  }
  const pkg=await readJSON(`${pkgRoot}/package.json`);
  for (const [name,target] of Object.entries(pkg.exports)) if (!(await exists(path.resolve(pkgRoot,target)))) problems.push(`${source.id}: missing export ${name}`);
}
const counts=Object.fromEntries([...new Set(catalog.items.map(i=>i.status))].map(s=>[s,catalog.items.filter(i=>i.status===s).length]));
console.log(counts);
if (problems.length) {console.error(problems.join('\n')); process.exitCode=1;}
else console.log('Package exports and upstream content hashes match. This does not verify runtime compatibility or installation.');
