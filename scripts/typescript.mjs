import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require=createRequire(import.meta.url);
let typescript;
try{typescript=require('typescript')}catch(error){
 if(error.code!=='MODULE_NOT_FOUND')throw error;
 // npm exec exposes its requested toolchain through PATH, not ESM resolution.
 for(const directory of (process.env.PATH??'').split(path.delimiter)){
  try{
   const binary=fs.realpathSync(path.join(directory,'tsserver'));
   typescript=createRequire(binary)('typescript');
   break;
  }catch{}
 }
 if(!typescript)throw new Error('TypeScript is required. Run npm run bootstrap to install the toolchain and generate upstream packages.');
}
export default typescript;
