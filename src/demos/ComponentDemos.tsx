import Dropdown from '../Dropdown';
import { Label } from '@chadcn/upstream-shadcn/label';
import { useState } from 'react';
import { Input } from '@chadcn/upstream-shadcn/input';
import { Textarea } from '@chadcn/upstream-shadcn/textarea';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@chadcn/upstream-shadcn/table';
import { Spinner, type SpinnerProps } from '@chadcn/upstream-kibo/spinner';

export function InputDemo() {
  const [name, setName] = useState('New collection');
  return <div className="demo-form"><Label htmlFor="demo-name">Collection name</Label><Input id="demo-name" value={name} onChange={e => setName(e.target.value)} /><p aria-live="polite">Your collection: <strong>{name || 'Untitled'}</strong></p><Label htmlFor="demo-disabled">Disabled state</Label><Input id="demo-disabled" disabled placeholder="This field is disabled" /></div>;
}
export function TextareaDemo() {
  const [value, setValue] = useState('A place for the things we are building together.');
  return <div className="demo-form"><Label htmlFor="demo-notes">Collection notes</Label><Textarea id="demo-notes" value={value} maxLength={280} onChange={e => setValue(e.target.value)} /><p aria-live="polite">{value.length} / 280 characters</p></div>;
}
export function TableDemo() {
  const [query, setQuery] = useState('');
  const rows = [['Interface foundations','Design system','Ready'],['Workspace dashboard','Application','In review'],['Account settings','Form','Ready'],['Team directory','Application','Draft']];
  return <div className="demo-form"><Label htmlFor="demo-filter">Filter projects</Label><Input id="demo-filter" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…"/><Table><TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{rows.filter(row => row.join(' ').toLowerCase().includes(query.toLowerCase())).map(row => <TableRow key={row[0]}>{row.map(cell => <TableCell key={cell}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table></div>;
}
export function SpinnerDemo() {
  const [variant, setVariant] = useState<NonNullable<SpinnerProps['variant']>>('ellipsis');
  return <div className="demo-form"><Label htmlFor="demo-spinner">Spinner variant</Label><Dropdown label="Spinner variant" value={variant} onChange={value=>setVariant(value as NonNullable<SpinnerProps['variant']>)} options={['default','throbber','pinwheel','circle-filled','ellipsis','ring','bars','infinite'].map(value=>({value,label:value}))}/><div className="spinner-stage"><Spinner variant={variant} aria-label="Loading preview" /></div></div>;
}
