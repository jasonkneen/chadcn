import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const sources=JSON.parse(fs.readFileSync('sources.json','utf8')).sources;
const references={};
for(const source of sources){
 const dir=`packages/upstream-${source.id}`;
 if(!fs.existsSync(`${dir}/package.json`))continue;
 const pkg=JSON.parse(fs.readFileSync(`${dir}/package.json`,'utf8'));
 for(const [name,target] of Object.entries(pkg.exports??{})){
  if(typeof target!=='string'||!target.endsWith('.js'))continue;
  const relative=target.replace(/^\.\/src\//,'').replace(/\.js$/,'.tsx');
  let original=path.resolve(source.path,source.root??'',relative);
  if(!fs.existsSync(original))original=original.replace(/\.tsx$/,'.ts');
  if(!fs.existsSync(original))continue;
  const code=fs.readFileSync(original,'utf8');
  const typesPath=path.join(dir,target.replace(/\.js$/,'.d.ts'));
  const types=fs.existsSync(typesPath)?fs.readFileSync(typesPath,'utf8'):'';
  const variants={};
  const ast=ts.createSourceFile(original,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const key=n=>n&&('text' in n?n.text:undefined);
  function visit(node){
   if(ts.isCallExpression(node)&&node.expression.getText(ast)==='cva'){
    const config=node.arguments[1];
    if(config&&ts.isObjectLiteralExpression(config)){
     const property=config.properties.find(p=>ts.isPropertyAssignment(p)&&key(p.name)==='variants');
     if(property&&ts.isPropertyAssignment(property)&&ts.isObjectLiteralExpression(property.initializer))for(const prop of property.initializer.properties){
      if(ts.isPropertyAssignment(prop)&&ts.isObjectLiteralExpression(prop.initializer))variants[key(prop.name)]=prop.initializer.properties.map(p=>key(p.name)).filter(Boolean);
     }
    }
   }
   ts.forEachChild(node,visit);
  }
  visit(ast);
  references[`${pkg.name}/${name.slice(2)}`]={code,types,variants,repository:source.repository,path:path.relative(path.resolve(source.path),original),url:`${source.repository}/blob/HEAD/${path.relative(path.resolve(source.path),original)}`};
 }
}
fs.mkdirSync('public/demo-reference',{recursive:true});
for(const [key,value] of Object.entries(references))fs.writeFileSync(`public/demo-reference/${encodeURIComponent(key)}.json`,JSON.stringify(value));
console.log(`Generated ${Object.keys(references).length} source and API references`);

for(const file of ['WorkspaceApps','CrmPipeline']){const code=fs.readFileSync(`src/demos/${file}.tsx`,'utf8');fs.writeFileSync(`public/demo-reference/${encodeURIComponent(`src/demos/${file}`)}.json`,JSON.stringify({code,types:'',variants:{},path:`src/demos/${file}.tsx`}));}

const extraReferences = [
 {key:'@assistant-ui/react',file:'src/demos/AssistantExamples.tsx',url:'https://github.com/assistant-ui/assistant-ui'},
 ...['loader','shimmer'].map(name=>({key:`@repo/elements/${name}`,file:`../ai-elements-vue/packages/elements/src/${name}/${name[0].toUpperCase()+name.slice(1)}.vue`,url:`https://github.com/vuepont/ai-elements-vue/blob/HEAD/packages/elements/src/${name}/${name[0].toUpperCase()+name.slice(1)}.vue`})),
];
for(const {key,file,url} of extraReferences){
 if(!fs.existsSync(file))continue;
 fs.writeFileSync(`public/demo-reference/${encodeURIComponent(key)}.json`,JSON.stringify({code:fs.readFileSync(file,'utf8'),types:'',variants:{},path:file,url}));
}
