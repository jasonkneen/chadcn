import { Button } from '@chadcn/upstream-shadcn/button';
import { useState } from 'react';
import { CollectionCard } from '@chadcn/ui/collection-card';

export default function CompositionPreview(){
 const [loading,setLoading]=useState(false);
 return <div className="composition-preview">
  <CollectionCard title="Your next interface" description="shadcn Card + Kibo Spinner" loading={loading} footer={<Button onClick={()=>setLoading(!loading)}>{loading?'Show content':'Show loading state'}</Button>}>
   <p>One custom composition. Two upstream dependencies.</p>
  </CollectionCard>
  <code>import {'{ CollectionCard }'} from '@chadcn/ui/collection-card'</code>
 </div>;
}
