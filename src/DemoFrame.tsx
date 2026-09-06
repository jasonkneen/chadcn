import type { PreviewProps } from './ComponentReference';
import { useEffect, useRef, useState } from 'react';
export default function DemoFrame({id,title,width,viewport=false,previewProps=null}:{id:string;title:string;width:string;viewport?:boolean;previewProps?:PreviewProps|null}) {
  const frame=useRef<HTMLIFrameElement>(null);
  const currentProps=useRef(previewProps);currentProps.current=previewProps;
  const [height,setHeight]=useState(360);
  const sendAppearance=()=>frame.current?.contentWindow?.postMessage({channel:'chadcn:appearance',theme:document.documentElement.dataset.theme??'base',mode:document.documentElement.dataset.mode??'light'},location.origin);
  useEffect(()=>{
    const observer=new MutationObserver(sendAppearance);
    observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-mode']});
    const resized=(event:MessageEvent)=>{
      if(event.origin!==location.origin||event.source!==frame.current?.contentWindow)return;
      if(event.data?.channel==='chadcn:preview-ready'){frame.current?.contentWindow?.postMessage({channel:'chadcn:preview-props',props:currentProps.current},location.origin);return;}
      if(event.data?.channel!=='chadcn:demo-height')return;
      if(!viewport&&typeof event.data.height==='number'&&Number.isFinite(event.data.height))setHeight(Math.min(5000,Math.max(260,event.data.height)));
    };
    window.addEventListener('message',resized);
    return()=>{observer.disconnect();window.removeEventListener('message',resized)};
  },[viewport]);
  useEffect(()=>{frame.current?.contentWindow?.postMessage({channel:'chadcn:preview-props',props:previewProps},location.origin)},[previewProps]);
  const [src]=useState(()=>`/demo.html?${new URLSearchParams({id,theme:document.documentElement.dataset.theme??'base',mode:document.documentElement.dataset.mode??'light'})}`);
  return <iframe ref={frame} title={`${title} live demo`} src={src} onLoad={sendAppearance} className="demo-frame" style={{width:width==='full'?'100%':`${Number(width)+2}px`,height:viewport?'clamp(360px, calc(100dvh - 300px), 640px)':height}}/>;
}
