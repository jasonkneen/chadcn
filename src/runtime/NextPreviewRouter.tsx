import { ImageConfigContext } from 'next/dist/shared/lib/image-config-context.shared-runtime';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppRouterContext, type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext, SearchParamsContext, PathParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';

// Keep upstream demo navigation inside its preview, without requiring a Next server.
export default function NextPreviewRouter({children}:{children:ReactNode}) {
 const readRoute=()=>new URLSearchParams(location.search).get('route')??'/';
 const [route,setRoute]=useState(readRoute);
 useEffect(()=>{const restore=()=>setRoute(readRoute());window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[]);
 const router=useMemo<AppRouterInstance>(()=>{
  const navigate=(href:string,replace=false)=>{
   const target=new URL(href,location.origin);
   if(target.origin!==location.origin){location.assign(target.href);return}
   const url=new URL(location.href);url.searchParams.set('route',target.pathname+target.search+target.hash);
   if(replace)history.replaceState(null,'',url);else history.pushState(null,'',url);
   setRoute(target.pathname+target.search+target.hash);
  };
  return {bfcacheId:'preview',push:href=>navigate(href),replace:href=>navigate(href,true),back:()=>history.back(),forward:()=>history.forward(),refresh:()=>setRoute(readRoute()),prefetch:()=>{}};
 },[]);
 const url=new URL(route,location.origin);
 return <ImageConfigContext.Provider value={{...imageConfigDefault,unoptimized:true}}><AppRouterContext.Provider value={router}><PathParamsContext.Provider value={{}}><PathnameContext.Provider value={url.pathname}><SearchParamsContext.Provider value={url.searchParams}>{children}</SearchParamsContext.Provider></PathnameContext.Provider></PathParamsContext.Provider></AppRouterContext.Provider></ImageConfigContext.Provider>;
}
