import { Label } from '@chadcn/upstream-shadcn/label';
import { useState } from 'react';
import { Button } from '@chadcn/upstream-shadcn-radix/button';
import { Input } from '@chadcn/upstream-shadcn-radix/input';
import { Textarea } from '@chadcn/upstream-shadcn-radix/textarea';
import { Checkbox } from '@chadcn/upstream-shadcn-radix/checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@chadcn/upstream-shadcn-radix/accordion';

export function ButtonDemo() {
  const [count, setCount] = useState(0);
  return <div className="demo-form"><div className="demo-button-row">{(['default','secondary','outline','ghost','destructive','link'] as const).map(variant => <Button key={variant} variant={variant} onClick={() => setCount(value => value + 1)}>{variant}</Button>)}</div><Button disabled>Disabled button</Button><p aria-live="polite">Button presses: {count}</p></div>;
}
export function InputDemo() {
  const [value, setValue] = useState('New collection');
  return <div className="demo-form"><Label htmlFor="variant-input">Collection name</Label><Input id="variant-input" value={value} onChange={event => setValue(event.target.value)}/><p aria-live="polite">Your collection: {value || 'Untitled'}</p><Label htmlFor="disabled-input">Disabled state</Label><Input id="disabled-input" disabled value="Read only preview"/></div>;
}
export function TextareaDemo() {
  const [value, setValue] = useState('A place for the things we are building together.');
  return <div className="demo-form"><Label htmlFor="variant-notes">Collection notes</Label><Textarea id="variant-notes" value={value} maxLength={280} onChange={event => setValue(event.target.value)}/><p aria-live="polite">{value.length} / 280 characters</p></div>;
}
export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return <div className="demo-form"><div className="demo-check-row"><Checkbox id="variant-check" checked={checked} onCheckedChange={value => setChecked(value === true)} aria-label="Email updates"/><Label htmlFor="variant-check">Email updates</Label></div><p aria-live="polite">Updates are {checked ? 'enabled' : 'disabled'}.</p></div>;
}
export function AccordionDemo() {
  return <Accordion type="multiple">{[['variants','Are registry variants preserved?','Yes. Each version keeps its own registry identity and implementation.'],['themes','Can I change the skin?','Choose a theme above. The same component updates without replacing its implementation.']].map(([id,title,content]) => <AccordionItem key={id} value={id}><AccordionTrigger>{title}</AccordionTrigger><AccordionContent>{content}</AccordionContent></AccordionItem>)}</Accordion>;
}
