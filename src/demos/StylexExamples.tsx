import { Label } from '@chadcn/upstream-shadcn/label';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@chadcn/upstream-shadcn-cssinjs/accordion';
import { Button } from '@chadcn/upstream-shadcn-cssinjs/button';
import { Checkbox } from '@chadcn/upstream-shadcn-cssinjs/checkbox';
import { Input } from '@chadcn/upstream-shadcn-cssinjs/input';

export function StylexButtonDemo() {
  const [count, setCount] = useState(0);
  return <div className="demo-form"><div className="demo-button-row">{(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map(variant => <Button key={variant} variant={variant} onClick={() => setCount(value => value + 1)}>{variant}</Button>)}</div><Button disabled>Disabled button</Button><p aria-live="polite">Button presses: {count}</p></div>;
}

export function StylexInputDemo() {
  const [value, setValue] = useState('New collection');
  return <div className="demo-form"><Label htmlFor="stylex-input">Collection name</Label><Input id="stylex-input" value={value} onChange={event => setValue(event.target.value)} /><p aria-live="polite">Your collection: {value || 'Untitled'}</p><Label htmlFor="stylex-disabled-input">Disabled state</Label><Input id="stylex-disabled-input" disabled value="Read only preview" /></div>;
}

export function StylexCheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return <div className="demo-form"><div className="demo-check-row"><Checkbox id="stylex-checkbox" checked={checked} onCheckedChange={value => setChecked(value === true)} /><Label htmlFor="stylex-checkbox">Email updates</Label></div><p aria-live="polite">Updates are {checked ? 'enabled' : 'disabled'}.</p></div>;
}

export function StylexAccordionDemo() {
  return <Accordion className="demo-form"><AccordionItem><AccordionTrigger>Are registry variants preserved?</AccordionTrigger><AccordionContent>Yes. Each version keeps its own registry identity and implementation.</AccordionContent></AccordionItem><AccordionItem><AccordionTrigger>Can I change the skin?</AccordionTrigger><AccordionContent>Choose a theme above. The same component updates without replacing its implementation.</AccordionContent></AccordionItem></Accordion>;
}
