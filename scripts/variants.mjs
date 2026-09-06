import { digest } from './lib.mjs';

export function identifyVariants(items, source) {
  const counts = new Map();
  for (const item of items) counts.set(item.name,(counts.get(item.name)??0)+1);
  return items.map(item => {
    const variantKey=digest(JSON.stringify((item.files??[]).map(f=>f.path).sort())).slice(0,8);
    const name=counts.get(item.name)>1 ? `${item.name}--${variantKey}` : item.name;
    return {...item,upstreamName:item.name,name,id:`${source.id}:${name}`,family:item.name.toLowerCase(),variant:{key:variantKey,label:source.variant??source.id,registry:source.id,paths:(item.files??[]).map(f=>f.path),duplicate:counts.get(item.name)>1},source:source.id,homepage:source.homepage,repository:source.repository,framework:source.framework??'react'};
  });
}
