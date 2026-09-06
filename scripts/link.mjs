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
 const physicalParent=await fs.realpath(path.dirname(link));
 const existing=await fs.lstat(link).catch(()=>null);
 if(existing){
  if(existing.isSymbolicLink() && path.resolve(physicalParent,await fs.readlink(link))===target)continue;
  throw new Error(`Refusing to replace an existing package: ${link}`);
 }
 await fs.symlink(path.relative(physicalParent,target),link,'dir');
 console.log(`Linked ${pkg.name}`);
}
