import fs from 'node:fs/promises';
import path from 'node:path';
import { root, readJSON } from './lib.mjs';

// Link local workspace packages without claiming their external dependencies are installed.
for(const name of await fs.readdir(`${root}/packages`)){
 const target=path.join(root,'packages',name);
 const pkg=await readJSON(path.join(target,'package.json')).catch(()=>null);
 if(!pkg)continue;
 const link=path.join(root,'node_modules',pkg.name);
 await fs.mkdir(path.dirname(link),{recursive:true});
 const existing=await fs.lstat(link).catch(()=>null);
 if(existing){
  if(existing.isSymbolicLink() && path.resolve(path.dirname(link),await fs.readlink(link))===target)continue;
  throw new Error(`Refusing to replace an existing package: ${link}`);
 }
 await fs.symlink(path.relative(path.dirname(link),target),link,'dir');
 console.log(`Linked ${pkg.name}`);
}
