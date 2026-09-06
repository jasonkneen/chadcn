import { NuqsAdapter } from 'nuqs/adapters/react';
import NextPreviewRouter from './runtime/NextPreviewRouter';
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { demos } from './demos/manifest';
import { themes } from './themes';
import { TooltipProvider } from '@chadcn/upstream-shadcn/tooltip';
import './demo-preview.css';
import { Badge } from '@chadcn/upstream-shadcn/badge';
import { Button } from '@chadcn/upstream-shadcn/button';
import type { PreviewProps } from './ComponentReference';

function applyAppearance(theme: string, mode: string) {
  if (!themes.some(t => t.id === theme) || !['dark','light'].includes(mode)) return;
  document.documentElement.classList.add("style-nova");
  document.documentElement.dataset.theme=theme;
  document.documentElement.dataset.mode=mode;
  document.documentElement.classList.toggle('dark',mode==='dark');
  document.documentElement.style.colorScheme=mode;
}
const params=new URLSearchParams(location.search);
applyAppearance(params.get('theme')??'base',params.get('mode')??'light');
window.addEventListener('message',event=>{
  if(event.origin!==location.origin || event.source!==parent || event.data?.channel!=='chadcn:appearance')return;
  applyAppearance(event.data.theme,event.data.mode);
});
class Boundary extends Component<{children:ReactNode},{error:boolean}>{
  state={error:false};static getDerivedStateFromError(){return {error:true};}
  render(){return this.state.error?<p role="alert" data-demo-error>This demo could not load.</p>:this.props.children;}
}
function ConfigurablePreview({children}:{children:ReactNode}){
 const [props,setProps]=useState<PreviewProps|null>(null);
 useEffect(()=>{const listener=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===parent&&e.data?.channel==='chadcn:preview-props')setProps(e.data.props)};window.addEventListener('message',listener);parent.postMessage({channel:'chadcn:preview-ready'},location.origin);return()=>window.removeEventListener('message',listener)},[]);
 if(!props)return children;
 return <div className="configured-preview">{props.component==='badge'?<Badge variant={props.variant as 'default'}>{props.label}</Badge>:<Button variant={props.variant as 'default'} disabled={props.disabled}>{props.label}</Button>}</div>;
}
const demo=demos.find(d=>d.id===params.get('id'));
const root=document.getElementById('root')!;
if(demo){
  const Preview=lazy(demo.load);
  document.title=`${demo.title} — chadcn demo`;
  createRoot(root).render(<div className="demo-surface" data-demo={demo.id}><Boundary><Suspense fallback={<p role="status">Loading demo…</p>}><NuqsAdapter><NextPreviewRouter><TooltipProvider><ConfigurablePreview><Preview/></ConfigurablePreview></TooltipProvider></NextPreviewRouter></NuqsAdapter><span hidden data-demo-ready="true"/></Suspense></Boundary></div>);
}else createRoot(root).render(<p role="alert" data-demo-error>This demo is not available.</p>);
const resize=new ResizeObserver(()=>parent.postMessage({channel:'chadcn:demo-height',height:Math.ceil(root.getBoundingClientRect().height)},location.origin));
resize.observe(root);
