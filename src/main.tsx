import { Label } from '@chadcn/upstream-shadcn/label';
import { Button } from '@chadcn/upstream-shadcn/button';
import { Input } from '@chadcn/upstream-shadcn/input';
import { RotateCcw, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import catalogUrl from '../data/catalog.json?url';
import Appearance from './Appearance';
import HomePage from './HomePage';
import Dropdown from './Dropdown';
import LibraryPages from './LibraryPages';
import DemoFrame from './DemoFrame';
import ComponentReference, { type PreviewProps } from './ComponentReference';
import { demos, type Demo } from './demos/manifest';
import './style.css';
import './readability.css';
import './demo-utilities.css';
import './demos.css';
import './browser.css';
import './skins.css';

type Item = {id:string;name:string;upstreamName?:string;family?:string;source:string;type?:string;category?:string;description?:string;homepage?:string;repository?:string;variant?:{label:string};entries?:{import:string}[]};
type Section = 'home'|'components'|'blocks'|'apps'|'documentation';
const sections: [Section,string][] = [['components','Components'],['blocks','Blocks'],['apps','Apps'],['documentation','Documentation']];
const sectionFor = (demo:Demo):Section => demo.kind==='App'?'apps':demo.kind==='Block'?'blocks':'components';
function App({items}:{items:Item[]}) {
 const validPath=location.pathname==='/';
 const initial=validPath?demos.find(d=>d.id===new URLSearchParams(location.search).get('demo')):undefined;
 const [section,setSection]=useState<Section>(!validPath?'home':initial?sectionFor(initial):(['components','blocks','apps','documentation'].includes(new URLSearchParams(location.search).get('view')??'')?new URLSearchParams(location.search).get('view') as Section:'home'));
 const [source,setSource]=useState('all');
 const [library,setLibrary]=useState<string|null>(new URLSearchParams(location.search).get('library'));
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState(initial?.id??'');
 const [width,setWidth]=useState('full');
 const [revision,setRevision]=useState(0);
 const [previewProps,setPreviewProps]=useState<PreviewProps|null>(null);
 const sources=[...new Set(['chadcn',...items.map(i=>i.source),...demos.flatMap(d=>d.source.split(' + '))])];
 const families=useMemo(()=>{
  const names=[...new Set(items.filter(i=>i.type==='registry:ui'||i.type==='registry:component').map(i=>i.upstreamName??i.name))].sort((a,b)=>b.length-a.length);
  const groups=new Map<string,{key:string;name:string;section:Section;demos:Demo[];versions:Item[]}>();
  for(const demo of demos){
   const kind=sectionFor(demo),name=demo.family??demo.id.split(':')[1];
   const family=kind==='components'?(names.find(n=>name===n||name.startsWith(n+'-'))??name):name;
   const key=kind+':'+family;
   if(!groups.has(key))groups.set(key,{key,name:kind==='apps'?demo.title:family,section:kind,demos:[],versions:items.filter(i=>(i.family??i.upstreamName??i.name)===family)});
   groups.get(key)!.demos.push(demo);
  }
  const providerOrder=['shadcn','chadcn','shadcn-base','shadcn-radix','shadcn-aria','shadcn-cssinjs'];
  const rank=(d:Demo)=>{const index=providerOrder.indexOf(d.source);return index<0?providerOrder.length:index};
  for(const group of groups.values())group.demos.sort((a,b)=>rank(a)-rank(b)||Number(!a.defaultExample)-Number(!b.defaultExample)||Number(!a.id.endsWith('-demo'))-Number(!b.id.endsWith('-demo'))||a.title.localeCompare(b.title));
  return [...groups.values()].sort((a,b)=>a.name.localeCompare(b.name));
 },[items]);
 const visible=families.filter(g=>g.section===section&&(source==='all'||g.demos.some(d=>d.source.split(' + ').includes(source)))&&`${g.name} ${g.demos.map(d=>d.title+' '+d.source).join(' ')}`.toLowerCase().replaceAll('-',' ').includes(query.toLowerCase().replaceAll('-',' ')));
 const compactList=families.filter(g=>g.section===section&&(source==='all'||g.demos.some(d=>d.source.split(' + ').includes(source)))).length<=6;
 const group=visible.find(g=>g.demos.some(d=>d.id===selected))??visible[0];
 const demo=group?.demos.find(d=>d.id===selected)??group?.demos.find(d=>source==='all'||d.source.split(' + ').includes(source));
 useEffect(()=>{if(demo&&demo.id!==selected)setSelected(demo.id)},[demo?.id,selected]);
 useEffect(()=>{const url=new URL(location.href);url.pathname='/';if(section!=='home'&&section!=='documentation'&&demo)url.searchParams.set('demo',demo.id);else url.searchParams.delete('demo');if(section==='home')url.searchParams.delete('view');else url.searchParams.set('view',section);if(section==='documentation'&&library)url.searchParams.set('library',library);else url.searchParams.delete('library');history.replaceState(null,'',url)},[demo?.id,section,library]);
 const providers=group?[...new Set([...group.demos.map(d=>d.source),...group.versions.map(v=>v.source)])]:[];
 const examples=group?.demos.filter(d=>d.source===demo?.source)??[];

 function navigate(value:Section){const url=new URL('/',location.origin);if(value!=='home')url.searchParams.set('view',value);history.pushState(null,'',url);setSection(value);setSource('all');setQuery('');setSelected('');setLibrary(null)}
 useEffect(()=>{const restore=()=>{const params=new URLSearchParams(location.search);const next=demos.find(d=>d.id===params.get('demo'));const view=params.get('view');setSection(next?sectionFor(next):sections.some(([key])=>key===view)?view as Section:'home');setSelected(next?.id??'');setLibrary(params.get('library'));setSource('all');setQuery('')};window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[]);
 const navigationItems=(<aside className="browser-items"><Input className="browser-search" aria-label="Search items" placeholder={`Search ${section}…`} value={query} onChange={e=>setQuery(e.target.value)}/>{visible.map(g=><Button variant="ghost" key={g.key} aria-pressed={g===group} onClick={()=>{setSelected((g.demos.find(d=>source==='all'||d.source===source)??g.demos[0]).id);setRevision(0)}}><strong>{g.name.replaceAll('-',' ')}</strong></Button>)}</aside>);
 if(section==='home')return <HomePage navigate={navigate}/>;
 return <div className="shell"><aside className="sidebar"><a className="wordmark" href="/">chadcn<span className="brand-square"/></a><p className="eyebrow">THE INTERFACE LIBRARY</p>
 <nav aria-label="Browse">{sections.map(([value,label])=><div key={value}><Button variant="ghost" className={`nav-item ${section===value?'active':''}`} onClick={()=>navigate(value)}>{label}</Button>{section===value&&value!=='documentation'&&<div className="nested-category-items">{navigationItems}</div>}</div>)}</nav>
 <nav aria-label="Registries"><p className="nav-label">REGISTRIES</p><Dropdown label="Filter registry" value={source} onChange={value=>{setSource(value);setSelected('')}} options={[{value:'all',label:'All registries'},...sources.map(value=>({value,label:value}))]}/></nav></aside>
 <main><header className="topbar"><span>{sections.find(([value])=>value===section)?.[1]}</span><Appearance/></header>
 <div className="mobile-filters"><Dropdown label="Browse" value={section} onChange={value=>navigate(value as Section)} options={sections.map(([value,label])=>({value,label}))}/><Dropdown label="Registry" value={source} onChange={setSource} options={[{value:'all',label:'All registries'},...sources.map(s=>({value:s,label:s}))]}/></div>
 <section className="component-browser"><div className="browser-heading" hidden={section==='documentation'&&!!library}><h1>{sections.find(([value])=>value===section)?.[1]}</h1><p>{section==='documentation'?'Guides and references from the source registries.':'Choose an item to try it. Switch registries and examples in the preview.'}</p></div>
 {section==='documentation'?<>{!library&&<Input className="browser-search" aria-label="Search documentation" placeholder="Search libraries…" value={query} onChange={e=>setQuery(e.target.value)}/>}<LibraryPages id={library} source={source} query={query} onOpen={id=>{const url=new URL('/',location.origin);url.searchParams.set('view','documentation');if(id)url.searchParams.set('library',id);history.pushState(null,'',url);setLibrary(id)}} onBrowse={id=>{const first=demos.find(d=>d.source.split(' + ').includes(id));navigate(first?sectionFor(first):'components');setSource(id);setSelected(first?.id??'')}}/></>:<div className={`browser-layout ${compactList?'browser-layout-compact':''}`}><div className="mobile-category-items">{navigationItems}</div>
 {demo&&group?<div className="demo-workbench"><div className="browser-preview-heading"><h2>{group.name.replaceAll('-',' ')}</h2><div className="browser-selectors"><Label>Registry<Dropdown label="Preview registry" value={demo.source} onChange={value=>{setSelected(group.demos.find(d=>d.source===value)!.id);setRevision(0)}} options={providers.map(provider=>({value:provider,label:provider+(group.demos.some(d=>d.source===provider)?'':' — preview unavailable'),disabled:!group.demos.some(d=>d.source===provider)}))}/></Label>{examples.length>1&&<Label>Example<Dropdown label="Preview example" value={demo.id} onChange={value=>{setSelected(value);setRevision(0)}} options={examples.map(d=>({value:d.id,label:d.variantLabel??d.title}))}/></Label>}</div><div className="preview-actions"><Label>Width<Dropdown label="Demo viewport" value={width} onChange={setWidth} options={[{value:'full',label:'Full width'},{value:'768',label:'Tablet'},{value:'375',label:'Mobile'}]}/></Label><Button variant="ghost" onClick={()=>setRevision(revision+1)} title="Reset preview" aria-label="Reset preview"><RotateCcw size={17}/></Button><Button variant="ghost" size="icon" asChild><a title="Open preview in new tab" aria-label="Open preview in new tab" href={`/demo.html?${new URLSearchParams({id:demo.id,theme:document.documentElement.dataset.theme??'base',mode:document.documentElement.dataset.mode??'light'})}`} target="_blank" rel="noreferrer"><ExternalLink size={17}/></a></Button></div></div>

 <div className="workbench-content"><div className="demo-canvas"><DemoFrame key={`${demo.id}:${revision}`} id={demo.id} title={group.name} width={width} previewProps={previewProps} viewport={demo.kind==='Block'||demo.kind==='App'}/></div>
 <ComponentReference demo={demo} family={group.name} onConfigure={setPreviewProps}/></div></div>:<div className="browser-empty"><h2>No previews available here yet.</h2><p>Choose another registry or clear your search.</p><Button variant="ghost" onClick={()=>{setSource('all');setQuery('')}}>Show available items</Button></div>}
 </div>}
 </section></main></div>;
}
const root=createRoot(document.getElementById('root')!);
root.render(<p className="boot-message" role="status">Loading components…</p>);
fetch(catalogUrl).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()}).then(data=>root.render(<App items={data.items}/>)).catch(()=>root.render(<p role="alert">Could not load components. Please refresh.</p>));
