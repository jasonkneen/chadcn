import fs from 'node:fs';
import { demos } from '../src/demos/manifest';
const catalog=JSON.parse(fs.readFileSync('data/catalog.json','utf8')).items;
const ids=new Set<string>();
for(const demo of demos){if(ids.has(demo.id))throw new Error(`Duplicate demo ID: ${demo.id}`);ids.add(demo.id)}
const primitiveNames=new Map<string,string[]>();
for(const item of catalog){if(['registry:ui','registry:component'].includes(item.type)){const names=primitiveNames.get(item.source)??[];names.push(item.upstreamName??item.name);primitiveNames.set(item.source,names)}}
const renderable=new Set(['registry:ui','registry:component','registry:example','registry:block']);
const items=catalog.filter((item:any)=>renderable.has(item.type)).map((item:any)=>{
 const entries=new Set((item.entries??[]).map((entry:any)=>entry.import));
 const exact=demos.filter(d=>d.id===item.id||entries.has(d.importPath));
 const family=(item.family??item.upstreamName??item.name);
 const examples=['registry:ui','registry:component'].includes(item.type)?demos.filter(d=>{
  if(d.source!==item.source)return false;
  const name=d.family??d.id.split(':')[1];
  const parent=[...(primitiveNames.get(d.source)??[])].sort((a,b)=>b.length-a.length).find(n=>name===n||name.startsWith(n+'-'));
  return parent===family;
 }):[];
 return {id:item.id,source:item.source,type:item.type,status:item.status,demos:[...new Set([...exact,...examples].map(d=>d.id))]};
});
const sources=[...new Set(items.map((i:any)=>i.source))].map(source=>({source,items:items.filter((i:any)=>i.source===source).length,covered:items.filter((i:any)=>i.source===source&&i.demos.length).length,missing:items.filter((i:any)=>i.source===source&&!i.demos.length).map((i:any)=>i.id)}));
fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/demo-coverage.json',JSON.stringify({generatedAt:new Date().toISOString(),demoCount:demos.length,note:'Manifest coverage only; browser evidence is tracked separately.',sources,items},null,2)+'\n');
console.log(JSON.stringify({demoCount:demos.length,sources},null,2));
