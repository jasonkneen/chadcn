import { useState } from 'react';
import { AvatarStack } from '@chadcn/upstream-kibo/avatar-stack';
import { CodeBlock, CodeBlockBody, CodeBlockContent, CodeBlockItem } from '@chadcn/upstream-kibo/code-block';
import { ColorPicker, ColorPickerAlpha, ColorPickerFormat, ColorPickerHue, ColorPickerOutput, ColorPickerSelection } from '@chadcn/upstream-kibo/color-picker';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@chadcn/upstream-kibo/combobox';
import { DialogStack, DialogStackBody, DialogStackContent, DialogStackDescription, DialogStackFooter, DialogStackHeader, DialogStackNext, DialogStackPrevious, DialogStackTitle, DialogStackTrigger } from '@chadcn/upstream-kibo/dialog-stack';
import { Dropzone, DropzoneEmptyState } from '@chadcn/upstream-kibo/dropzone';
import { MiniCalendar, MiniCalendarDay, MiniCalendarDays, MiniCalendarNavigation } from '@chadcn/upstream-kibo/mini-calendar';
import { Tags, TagsContent, TagsEmpty, TagsGroup, TagsInput, TagsItem, TagsList, TagsTrigger, TagsValue } from '@chadcn/upstream-kibo/tags';

export function AvatarStackDemo() {
  return <AvatarStack animate size={36}>{['AL', 'MK', 'JR'].map(initials => <div key={initials} className="flex size-full items-center justify-center bg-secondary text-xs font-medium">{initials}</div>)}</AvatarStack>;
}

export function CodeBlockDemo() {
  const data = [{ language: 'tsx', filename: 'Greeting.tsx', code: 'export function Greeting() {\n  return <p>Hello from Kibo.</p>\n}' }];
  return <CodeBlock data={data} defaultValue="Greeting.tsx"><CodeBlockBody>{item => <CodeBlockItem key={item.filename} value={item.filename}><CodeBlockContent language="tsx">{item.code}</CodeBlockContent></CodeBlockItem>}</CodeBlockBody></CodeBlock>;
}

export function ColorPickerDemo() {
  const [color, setColor] = useState('');
  return <div className="demo-form"><ColorPicker defaultValue="#7c3aed" onChange={value => setColor(String(value))}><ColorPickerSelection className="h-32" /><ColorPickerHue /><ColorPickerAlpha /><div className="flex gap-2"><ColorPickerFormat /><ColorPickerOutput /></div></ColorPicker><p aria-live="polite">{color || 'Choose a color'}</p></div>;
}

export function DialogStackDemo() {
  return <DialogStack defaultOpen={false}><DialogStackTrigger>Open stacked dialog</DialogStackTrigger><DialogStackBody><DialogStackContent><DialogStackHeader><DialogStackTitle>First panel</DialogStackTitle><DialogStackDescription>A layered dialog can move between related panels.</DialogStackDescription></DialogStackHeader><DialogStackFooter><DialogStackNext>Next</DialogStackNext></DialogStackFooter></DialogStackContent><DialogStackContent><DialogStackHeader><DialogStackTitle>Second panel</DialogStackTitle><DialogStackDescription>This is the next panel in the stack.</DialogStackDescription></DialogStackHeader><DialogStackFooter><DialogStackPrevious>Back</DialogStackPrevious></DialogStackFooter></DialogStackContent></DialogStackBody></DialogStack>;
}

export function DropzoneDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return <div className="demo-form"><Dropzone maxFiles={2} accept={{ 'image/*': [] }} src={files.length ? files : undefined} onDrop={accepted => setFiles(accepted)}><DropzoneEmptyState /></Dropzone><p aria-live="polite">{files.length ? `${files.length} file${files.length === 1 ? '' : 's'} selected` : 'No files selected'}</p></div>;
}

export function MiniCalendarDemo() {
  const [selected, setSelected] = useState<Date>();
  return <div className="demo-form"><MiniCalendar days={5} value={selected} onValueChange={setSelected}><MiniCalendarNavigation direction="prev" /><MiniCalendarDays>{date => <MiniCalendarDay key={date.toISOString()} date={date} />}</MiniCalendarDays><MiniCalendarNavigation direction="next" /></MiniCalendar><p aria-live="polite">{selected ? `Selected ${selected.toLocaleDateString()}` : 'Select a date'}</p></div>;
}

export function ComboboxDemo() {
  const [value, setValue] = useState('');
  const data = [{ label: 'Design', value: 'design' }, { label: 'Engineering', value: 'engineering' }, { label: 'Research', value: 'research' }];
  return <div className="demo-form"><Combobox data={data} type="team" value={value} onValueChange={setValue}><ComboboxTrigger aria-label="Choose team" /><ComboboxContent><ComboboxInput /><ComboboxList><ComboboxEmpty /><ComboboxGroup>{data.map(item => <ComboboxItem key={item.value} value={item.value}>{item.label}</ComboboxItem>)}</ComboboxGroup></ComboboxList></ComboboxContent></Combobox><p aria-live="polite">{value ? `Team: ${data.find(item => item.value === value)?.label}` : 'Choose a team'}</p></div>;
}

export function TagsDemo() {
  const [value, setValue] = useState('');
  const tags = ['Frontend', 'Design', 'Research'];
  return <div className="demo-form"><Tags value={value} setValue={setValue}><TagsTrigger aria-label="Choose tag">{value && <TagsValue onRemove={() => setValue('')}>{value}</TagsValue>}</TagsTrigger><TagsContent><TagsInput placeholder="Search tags" /><TagsList><TagsEmpty /><TagsGroup>{tags.map(tag => <TagsItem key={tag} onSelect={() => setValue(tag)}>{tag}</TagsItem>)}</TagsGroup></TagsList></TagsContent></Tags><p aria-live="polite">{value ? `Tag: ${value}` : 'Choose a tag'}</p></div>;
}
