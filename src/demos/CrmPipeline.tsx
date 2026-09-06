import { Label } from '@chadcn/upstream-shadcn/label';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@chadcn/upstream-shadcn/button';
import { Input } from '@chadcn/upstream-shadcn/input';
import { Textarea } from '@chadcn/upstream-shadcn/textarea';
import Dropdown from '../Dropdown';
import './crm-pipeline.css';

const stages = ['Discovery', 'Proposal', 'Won'] as const;
type Stage = typeof stages[number];
type Deal = { id: string; name: string; person: string; email: string; value: number; stage: Stage; notes: string };
const initial: Deal[] = [
  { id: 'northstar', name: 'Northstar', person: 'Alex Chen', email: '', value: 24000, stage: 'Discovery', notes: '' },
  { id: 'orbit', name: 'Orbit Labs', person: 'Maya Patel', email: '', value: 42000, stage: 'Proposal', notes: '' },
  { id: 'forma', name: 'Forma', person: 'Sam Reed', email: '', value: 18000, stage: 'Won', notes: '' },
  { id: 'fieldwork', name: 'Fieldwork', person: 'Jordan Lee', email: '', value: 32000, stage: 'Proposal', notes: '' },
];
const storageKey = 'chadcn:crm:deals:v1';
const blank = (): Deal => ({ id: crypto.randomUUID(), name: '', person: '', email: '', value: 0, stage: 'Discovery', notes: '' });
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
function readDeals(): Deal[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (Array.isArray(data) && data.every(d => d && typeof d.id === 'string' && typeof d.name === 'string' && typeof d.person === 'string' && typeof d.email === 'string' && typeof d.notes === 'string' && Number.isFinite(d.value) && d.value >= 0 && stages.includes(d.stage))) return data;
  } catch { /* Start with examples if saved data is unavailable. */ }
  return initial;
}
export default function CrmPipeline({ search, contacts }: { search: string; contacts: boolean }) {
  const [deals, setDeals] = useState(readDeals);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<Deal | null>(null);
  const [notice, setNotice] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [dragged, setDragged] = useState<string | null>(null);
  const [over, setOver] = useState<Stage | null>(null);
  const [deleted, setDeleted] = useState<Deal | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const touch = useRef<{ id: string; x: number; y: number; active: boolean } | null>(null);
  const deal = deals.find(d => d.id === selected);
  const matching = deals.filter(d => `${d.name} ${d.person} ${d.email}`.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(deals)); setStorageError(false); } catch { setStorageError(true); } }, [deals]);
  useEffect(() => { if (draft) { form.current?.scrollIntoView({ block: 'nearest' }); form.current?.querySelector('input')?.focus(); } }, [draft?.id]);
  function move(id: string, stage: Stage) {
    const target = deals.find(d => d.id === id);
    if (!target || target.stage === stage) return;
    setDeals(items => items.map(d => d.id === id ? { ...d, stage } : d));
    setNotice(`${target.name} moved to ${stage}`);
  }
  function finishDrag() { setDragged(null); setOver(null); touch.current = null; }
  const stageAt = (x: number, y: number) => document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-crm-stage]')?.dataset.crmStage as Stage | undefined;
  return <section className="crm-workspace">
    <div className="wa-page-heading"><div><h1>{contacts ? 'Contacts' : 'Your next great partnership'}</h1><p>{deals.length} opportunities · {money(deals.reduce((sum, d) => sum + d.value, 0))} pipeline value</p></div><Button onClick={() => { setSelected(null); setDraft(blank()); }}>Add deal</Button></div>
    <p className="crm-help">{storageError ? 'Browser storage is unavailable. Keep this page open to retain changes.' : 'Saved in this browser.'} {!contacts && 'Drag cards between stages, or open a deal to change its stage.'}</p>
    <div className="crm-announcement" role="status" aria-live="polite">{notice}{deleted && <Button variant="outline" onClick={() => { setDeals(items => [...items, deleted]); setNotice(`${deleted.name} restored`); setDeleted(null); }}>Undo delete</Button>}</div>
    {draft && <form ref={form} className="crm-editor" aria-label="Deal editor" onSubmit={event => {
      event.preventDefault(); if (!draft.name.trim()) return;
      const saved = { ...draft, name: draft.name.trim(), person: draft.person.trim() };
      const existing = deals.some(d => d.id === saved.id);
      setDeals(items => existing ? items.map(d => d.id === saved.id ? saved : d) : [...items, saved]);
      setNotice(`${saved.name} ${existing ? 'updated' : 'created'}`); setSelected(saved.id); setDraft(null);
    }}>
      <h2>{deals.some(d => d.id === draft.id) ? 'Edit deal' : 'New deal'}</h2>
      <div className="crm-fields">
        <Label>Company<Input required maxLength={120} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}/></Label>
        <Label>Contact name<Input maxLength={120} value={draft.person} onChange={e => setDraft({ ...draft, person: e.target.value })}/></Label>
        <Label>Email<Input type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })}/></Label>
        <Label>Value (USD)<Input type="number" required min="0" step="0.01" value={draft.value} onChange={e => setDraft({ ...draft, value: Number(e.target.value) })}/></Label>
        <Label>Stage<Dropdown label="New deal stage" value={draft.stage} onChange={stage => setDraft({ ...draft, stage: stage as Stage })} options={stages.map(value => ({ value, label: value }))}/></Label>
        <Label className="crm-notes">Notes<Textarea value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })}/></Label>
      </div>
      <div className="crm-actions"><Button type="submit" disabled={!draft.name.trim()}>{deals.some(d => d.id === draft.id) ? 'Save deal' : 'Create deal'}</Button><Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button></div>
    </form>}
    <div className="crm-layout">
      {contacts ? <div className="crm-contacts">{matching.map(d => <Button variant="ghost" key={d.id} onClick={() => setSelected(d.id)}><strong>{d.person || 'No contact assigned'}</strong><span>{d.name}</span><span>{d.email}</span></Button>)}{!matching.length && <p>No matching contacts.</p>}</div> : <div className="wa-pipeline crm-board">{stages.map(stage => <section key={stage} data-crm-stage={stage} aria-label={`${stage} deals`} className={over === stage ? 'crm-drop-target' : ''} onDragOver={e => { if (dragged) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(stage); } }} onDrop={e => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); if (id === dragged) move(id, stage); finishDrag(); }}>
        <h2>{stage}<span>{matching.filter(d => d.stage === stage).length}</span></h2>
        {matching.filter(d => d.stage === stage).map(d => <Button variant="ghost" key={d.id} className={`crm-deal ${dragged === d.id ? 'crm-dragging' : ''}`} draggable aria-label={`${d.name}, ${money(d.value)}, ${stage}`} aria-describedby="crm-keyboard-help" onDragStart={e => { e.dataTransfer.setData('text/plain', d.id); e.dataTransfer.effectAllowed = 'move'; setDragged(d.id); }} onDragEnd={finishDrag} onClick={() => { if (!touch.current?.active) setSelected(d.id); }} onKeyDown={e => { if (e.altKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const next = stages[stages.indexOf(d.stage) + (e.key === 'ArrowRight' ? 1 : -1)]; if (next) move(d.id, next); } }} onPointerDown={e => { if (e.pointerType === 'touch') { touch.current = { id: d.id, x: e.clientX, y: e.clientY, active: false }; e.currentTarget.setPointerCapture(e.pointerId); } }} onPointerMove={e => { const current = touch.current; if (!current || current.id !== d.id) return; if (Math.hypot(e.clientX - current.x, e.clientY - current.y) > 8) current.active = true; if (current.active) { setDragged(d.id); setOver(stageAt(e.clientX, e.clientY) ?? null); } }} onPointerUp={e => { if (touch.current?.active) { const stage = stageAt(e.clientX, e.clientY); if (stage) move(d.id, stage); } finishDrag(); }} onPointerCancel={finishDrag}>
          <strong>{d.name}</strong><p>{d.person || 'No contact assigned'}</p><b>{money(d.value)}</b>
        </Button>)}
        {!matching.some(d => d.stage === stage) && <p className="crm-empty">{dragged ? 'Drop deal here' : 'No deals in this stage'}</p>}
        <Button variant="ghost" onClick={() => { setSelected(null); setDraft({ ...blank(), stage }); }}>Add to {stage}</Button>
      </section>)}</div>}
      {deal && <aside className="crm-details" aria-label="Selected deal"><div className="crm-actions"><h2>{deal.name}</h2><Button variant="ghost" aria-label="Close deal details" onClick={() => setSelected(null)}>Close</Button></div><p>{deal.person || 'No contact assigned'}</p>{deal.email && <a href={`mailto:${deal.email}`}>{deal.email}</a>}<strong>{money(deal.value)}</strong><Label>Stage<Dropdown label="Deal stage" value={deal.stage} onChange={stage => move(deal.id, stage as Stage)} options={stages.map(value => ({ value, label: value }))}/></Label><p className="crm-deal-notes">{deal.notes || 'No notes yet.'}</p><div className="crm-actions"><Button onClick={() => setDraft({ ...deal })}>Edit deal</Button><Button variant="outline" onClick={() => { setDeleted(deal); setDeals(items => items.filter(d => d.id !== deal.id)); setNotice(`${deal.name} deleted`); setSelected(null); setDraft(null); }}>Delete deal</Button></div></aside>}
    </div>
    <p id="crm-keyboard-help" className="crm-help">Keyboard: focus a card and use Alt + Left or Right to move it between stages. Enter opens its details.</p>
  </section>;
}
