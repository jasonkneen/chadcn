import { Checkbox } from '@chadcn/upstream-shadcn/checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@chadcn/upstream-shadcn/table';
import { Label } from '@chadcn/upstream-shadcn/label';
import { Input } from '@chadcn/upstream-shadcn/input';
import { Button } from '@chadcn/upstream-shadcn/button';
import { useEffect, useState } from 'react';
import type { Demo } from './demos/manifest';
import Dropdown from './Dropdown';
import './component-reference.css';
export type PreviewProps={component:'badge'|'button';variant:string;label:string;disabled:boolean};
type Reference={code:string;types:string;variants:Record<string,string[]>;url:string;path:string};
export default function ComponentReference({demo,family,onConfigure}:{demo:Demo;family:string;onConfigure:(props:PreviewProps|null)=>void}){
 const [reference,setReference]=useState<Reference|null>(null);const [failed,setFailed]=useState(false);const [tab,setTab]=useState('Source code');const [copied,setCopied]=useState(false);
 const [label,setLabel]=useState('Preview');const [variant,setVariant]=useState('default');const [disabled,setDisabled]=useState(false);const [custom,setCustom]=useState(false);
 const configurable=demo.source==='shadcn'&&['badge','button'].includes(family);
 const [api,setApi]=useState<Reference|null>(null);
 useEffect(()=>{const controller=new AbortController();setReference(null);setApi(null);setFailed(false);setCopied(false);setCustom(false);onConfigure(null);
 fetch(`/demo-reference/${encodeURIComponent(demo.referencePath??demo.importPath)}.json`,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(setReference).catch(e=>{if(e.name!=='AbortError')setFailed(true)});
 fetch(`/demo-reference/${encodeURIComponent(`@chadcn/upstream-${demo.source}/${family}`)}.json`,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(setApi).catch(e=>{if(e.name!=='AbortError')setApi(null)});
 return()=>controller.abort();},[demo.id,family]);
 const options=api?.variants.variant??[];
 const sample=custom?`import { ${family==='badge'?'Badge':'Button'} } from "@chadcn/upstream-shadcn/${family}";\n\n<${family==='badge'?'Badge':'Button'} variant=${JSON.stringify(variant)}${family==='button'&&disabled?' disabled':''}>\n  {${JSON.stringify(label)}}\n</${family==='badge'?'Badge':'Button'}>`:reference?.code??'';
 const code=tab==='API reference'?(api?.types??reference?.types??''):sample;
 function configure(next:{label?:string;variant?:string;disabled?:boolean}){const value={component:family as 'badge'|'button',label:next.label??label,variant:next.variant??variant,disabled:next.disabled??disabled};setCustom(true);setLabel(value.label);setVariant(value.variant);setDisabled(value.disabled);onConfigure(value)}
 return <section className="component-reference"><h3>Usage and properties</h3><p>{demo.description}</p>{configurable&&<ul className="reference-features">{family==='badge'?<><li>Six visual variants, including outline, destructive, and link styling.</li><li>Accepts text and icon children; supports element composition with asChild.</li></>:<><li>Visual variants and size options, including icon buttons.</li><li>Disabled state, native button events, and element composition with asChild.</li></>}</ul>}
 {configurable&&options.length>0&&<div className="reference-controls"><Label>Label<Input value={label} onChange={e=>configure({label:e.target.value})}/></Label><Label>Variant<Dropdown label="Component variant" value={variant} onChange={variant=>configure({variant})} options={options.map(value=>({value,label:value}))}/></Label>{family==='button'&&<Label><Checkbox checked={disabled} onCheckedChange={checked=>configure({disabled:checked===true})}/>Disabled</Label>}{custom&&<Button variant="ghost" onClick={()=>{setCustom(false);onConfigure(null)}}>Restore example</Button>}</div>}
 {api&&Object.keys(api.variants).length>0&&<div className="reference-props"><Table><TableHeader><TableRow><TableHead>Property</TableHead><TableHead>Supported values</TableHead></TableRow></TableHeader><TableBody>{Object.entries(api.variants).map(([key,values])=><TableRow key={key}><TableCell><code>{key}</code></TableCell><TableCell>{values.join(' · ')}</TableCell></TableRow>)}</TableBody></Table></div>}
 <div className="reference-toolbar"><div role="tablist" aria-label="Component reference">{['Source code','API reference'].map(value=><Button variant="ghost" role="tab" aria-selected={tab===value} key={value} onClick={()=>{setTab(value);setCopied(false)}}>{value}</Button>)}</div><Button variant="ghost" disabled={!code} onClick={async()=>{try{await navigator.clipboard.writeText(code);setCopied(true)}catch{setCopied(false)}}}>{copied?'Copied':'Copy code'}</Button></div>
 <div role="tabpanel">{code?<pre><code>{code}</code></pre>:<p>{tab==='API reference'&&reference?'No separate type declaration is available for this example.':failed?'Source is not yet indexed for this local composition.': 'Loading source…'}</p>}</div>
 <p className="reference-origin">Registry: {demo.source} · <code>{demo.importPath}</code>{reference?.url&&<> · <a href={reference.url} target="_blank" rel="noreferrer">Original source</a></>}</p>
 <p className="reference-origin">API types and variant values come from the selected registry’s local implementation. Source samples retain upstream import paths; the workspace import is shown above.</p>
 </section>
}
