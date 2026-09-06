import inventory from '../data/first-party-registry.json';
import { Button } from '@chadcn/upstream-shadcn/button';
import { Badge } from '@chadcn/upstream-shadcn/badge';
import { demos } from './demos/manifest';

export default function FirstPartyLibrary({onBrowse}:{onBrowse:()=>void}) {
 const available=demos.filter(d=>d.source.split(' + ').includes('chadcn'));
 return <article className="first-party-library">
  <p className="eyebrow">OUR REGISTRY</p><h1>{inventory.name}</h1><p>{inventory.description}</p>
  <Button onClick={onBrowse}>Browse {available.length} available examples</Button>
  <h2>Available now</h2><p>Complete workspace examples and compositions already running in this library.</p>
  <ul>{available.map(d=><li key={d.id}><strong>{d.title}</strong><Badge variant="outline">{d.kind}</Badge><p>{d.description}</p></li>)}</ul>
  <h2>From our projects</h2><p>Source-verified candidates, audited {inventory.auditedAt}. These entries describe the extraction work; they are not installed previews yet.</p>
  <div className="first-party-candidates">{inventory.candidates.map(item=><section key={item.name}><div><h3>{item.name}</h3><Badge variant="secondary">{item.kind}</Badge></div><p>{item.project} · {item.status}</p><p>{item.work}</p><code>{item.source}</code></section>)}</div>
  <p className="library-note">These are our project compositions, with upstream primitives and engines attributed separately. Agent Farm currently carries AGPL v3; distribution provenance is tracked in the source audit.</p>
 </article>;
}
