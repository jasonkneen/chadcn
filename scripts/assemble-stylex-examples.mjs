import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const base='packages/upstream-shadcn-base',stylex='packages/upstream-shadcn-cssinjs';
if(!fs.existsSync(`${base}/package.json`)||!fs.existsSync(`${stylex}/package.json`)){
 console.warn('[assemble:stylex] skip: generated StyleX packages are not present');
 process.exit(0);
}
const basePkg=JSON.parse(fs.readFileSync(`${base}/package.json`)),stylexPkg=JSON.parse(fs.readFileSync(`${stylex}/package.json`));
const baseSource=JSON.parse(fs.readFileSync('sources.json')).sources.find(source=>source.id==='shadcn-base');
try{const local=JSON.parse(fs.readFileSync('sources.local.json','utf8'));baseSource.path=local[baseSource.id]??baseSource.path}catch{}
const exportsOf=file=>{const ast=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),names=new Set();for(const node of ast.statements){if(ts.isExportDeclaration(node)&&node.exportClause&&ts.isNamedExports(node.exportClause))for(const e of node.exportClause.elements)names.add(e.name.text);if(node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)){if(node.name)names.add(node.name.text);if(ts.isVariableStatement(node))for(const d of node.declarationList.declarations)if(ts.isIdentifier(d.name))names.add(d.name.text)}}return names};
const out='.generated/stylex-examples';fs.mkdirSync(out,{recursive:true});
const entries=[],skipped=[];
for(const [key,target] of Object.entries(basePkg.exports)){
 if(!target.includes('/examples/')||!key.endsWith('-example'))continue;
 const family=key.slice(2,-8);if(!stylexPkg.exports[`./${family}`])continue;
 if(family==='combobox'){skipped.push({family,reason:'Base composition supplies input children unsupported by StyleX; uses dedicated controlled composition instead.'});continue}
 let code=fs.readFileSync(path.join(base,target),'utf8');const ast=ts.createSourceFile(target,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),changes=[];let error;
 for(const node of ast.statements){if(!ts.isImportDeclaration(node))continue;const name=node.moduleSpecifier.text;if(!name.startsWith('.'))continue;
 const resolved=path.resolve(base,path.dirname(target),name);let replacement;
 if(name.startsWith('../ui/')){const component=path.basename(name,'.js'),exportPath=stylexPkg.exports[`./${component}`];if(!exportPath){error=`No StyleX ${component} export`;break}const names=exportsOf(path.join(stylex,exportPath));const bindings=node.importClause?.namedBindings;if(bindings&&ts.isNamedImports(bindings)){for(const binding of bindings.elements){const requested=(binding.propertyName??binding.name).text;if(!names.has(requested)){error=`StyleX ${component} has no ${requested}`;break}}}replacement=`@chadcn/upstream-shadcn-cssinjs/${component}`;
 }else{const matched=Object.entries(basePkg.exports).find(([,p])=>path.resolve(base,p)===resolved);replacement=matched?`@chadcn/upstream-shadcn-base/${matched[0].slice(2)}`:path.relative(path.resolve(out),resolved);if(!matched&&!replacement.startsWith('.'))replacement='./'+replacement}
 if(error)break;changes.push([node.moduleSpecifier.getStart(ast),node.moduleSpecifier.getEnd(),JSON.stringify(replacement)]);
 }
 if(error){skipped.push({family,reason:error});continue}
 for(const [start,end,replacement] of changes.reverse())code=code.slice(0,start)+replacement+code.slice(end);
 const file=family+'.js';fs.writeFileSync(path.join(out,file),'// Adapted composition from the Base UI example; controls retain their StyleX implementations.\n'+code);fs.writeFileSync(path.join(out,family+'.d.ts'),"import type { ComponentType } from 'react';\ndeclare const Example:ComponentType;\nexport default Example;\n");
 const metadata={id:`shadcn-cssinjs:${family}-examples`,family,title:`${family.replaceAll('-',' ')} examples`,source:'shadcn-cssinjs',referencePath:`chadcn:stylex-example:${family}`,kind:'Example',description:'Upstream Base UI example composition using the matching StyleX component implementations.',importPath:`@chadcn/upstream-shadcn-cssinjs/${family}`};
 entries.push('{'+JSON.stringify(metadata).slice(1,-1)+`,load:()=>import('../../${out}/${file}')},`);
 const sourcePath=target.replace(/^\.\/src\//,'').replace(/\.js$/,'.tsx');
 const originalPath=path.resolve(baseSource.path,baseSource.root??'',sourcePath);
 if(!fs.existsSync(originalPath)){skipped.push({family,reason:`Original source missing at ${originalPath}`});continue}
 const referenceCode=fs.readFileSync(originalPath,'utf8').replace(/(["'])@\/registry\/bases\/base\/ui\/([^"']+)\1/g,(_match,quote,name)=>`${quote}@chadcn/upstream-shadcn-cssinjs/${name}${quote}`);
 fs.writeFileSync(`public/demo-reference/${encodeURIComponent(`chadcn:stylex-example:${family}`)}.json`,JSON.stringify({code:referenceCode,types:'',variants:{},path:sourcePath,url:`${baseSource.repository}/blob/HEAD/${baseSource.root}/${sourcePath}`}));
}
fs.writeFileSync('src/demos/StylexAdaptedEntries.ts',"import type { Demo } from './manifest';\nexport const stylexAdaptedEntries:Demo[]=[\n"+entries.join('\n')+'\n];\n');
fs.writeFileSync(`${out}/provenance.json`,JSON.stringify({compositionPackage:basePkg.name,componentPackage:stylexPkg.name,entries:entries.length,skipped},null,2));console.log(JSON.stringify({entries:entries.length,skipped},null,2));
