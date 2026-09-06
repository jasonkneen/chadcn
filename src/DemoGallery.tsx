import { useEffect, useState } from 'react';
import DemoFrame from './DemoFrame';
import { demos } from './demos/manifest';
export default function DemoGallery({ initialId, sourceFilter='all' }: { initialId?:string; sourceFilter?:string }) {
  const [id,setId]=useState(initialId??demos[0].id);
  const [query,setQuery]=useState('');
  const [viewport,setViewport]=useState('full');
  const [tab,setTab]=useState('preview');
  const [revision,setRevision]=useState(0);
  useEffect(()=>{const url=new URL(location.href);url.searchParams.set('demo',id);history.replaceState(null,'',url)},[id]);
  const available=demos.filter(d=>sourceFilter==='all'||d.source.split(' + ').includes(sourceFilter));
  const demo=available.find(d=>d.id===id)??available[0];
  useEffect(()=>{if(demo&&demo.id!==id)setId(demo.id)},[demo?.id,id]);
  if(!demo)return <section className="demo-gallery"><h2>{sourceFilter}</h2><p>No live demos are connected to this registry yet. Choose another source to browse available demos.</p></section>;
  const variants=available.filter(d=>(d.family??d.id.split(':').slice(1).join(':'))===(demo.family??demo.id.split(':').slice(1).join(':')));
  const matches=available.filter(d=>`${d.title} ${d.source} ${d.kind}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="demo-gallery" aria-label="Live demos">
    <div className="demo-heading"><div><p className="eyebrow">EXPLORE / PLAY / MAKE IT YOURS</p><h2>See it. Try it. Skin it.</h2><p>Real components and blocks. Change the theme above to see the same demo in a different skin.</p></div><span>{available.length} live demos</span></div>
    <div className="demo-layout"><aside className="demo-list"><label htmlFor="demo-search">Find a demo</label><input id="demo-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search demos…"/>{matches.map(d=><button key={d.id} aria-pressed={demo.id===d.id} onClick={()=>{setId(d.id);setTab('preview');setRevision(0)}}><strong>{d.title}</strong><span>{d.source} · {d.kind}</span></button>)}{matches.length===0&&<p role="status">No demos match this search.</p>}</aside>
    <div className="demo-workbench"><div className="demo-toolbar"><div role="group" aria-label="Demo view"><button aria-pressed={tab==='preview'} onClick={()=>setTab('preview')}>Preview</button><button aria-pressed={tab==='usage'} onClick={()=>setTab('usage')}>Usage</button></div><label>Width <select aria-label="Demo viewport" value={viewport} onChange={e=>setViewport(e.target.value)}><option value="full">Full width</option><option value="768">Tablet</option><option value="375">Mobile</option></select></label><button onClick={()=>setRevision(revision+1)}>Reset demo</button><button onClick={()=>window.open(`/demo.html?${new URLSearchParams({id:demo.id,theme:document.documentElement.dataset.theme??'base',mode:document.documentElement.dataset.mode??'light'})}`,'_blank','noopener')}>Open full demo</button></div>
      <div className="demo-title"><h3>{demo.title}</h3><span>{demo.source}</span><p>{demo.description}</p>{variants.length>1&&<label className="demo-variant-select">Registry version<select aria-label="Registry version" value={demo.id} onChange={event=>{setId(event.target.value);setRevision(0)}}>{variants.map(variant=><option key={variant.id} value={variant.id}>{variant.source}{variant.variantLabel ? ` / ${variant.variantLabel}` : ''}</option>)}</select></label>}</div>
      {tab==='preview'?<div className="demo-canvas"><DemoFrame key={`${demo.id}:${revision}`} id={demo.id} title={demo.title} width={viewport} viewport={demo.kind==='Block'||demo.kind==='Example'}/></div>:<div className="demo-usage"><p>This demo imports its components from:</p><code>{demo.importPath}</code><p>Upstream: <strong>{demo.source}</strong></p><p>Choose a skin or light/dark mode without changing the component implementation.</p></div>}
    </div></div>
  </section>;
}
