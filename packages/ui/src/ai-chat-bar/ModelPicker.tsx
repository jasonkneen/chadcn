"use client";
import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@chadcn/upstream-shadcn/popover";
import { Switch } from "@chadcn/upstream-shadcn/switch";
import { models } from "./data";
export interface ModelSelection {
    id: string;
    effort: string;
    auto: boolean;
}
export function ModelPicker({ value, onChange }: {
    value: ModelSelection;
    onChange: (value: ModelSelection) => void;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const current = models.find(model => model.id === value.id) ?? models[5];
    return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><button className="studio-model-trigger" aria-label="Choose model">{value.auto ? "Auto" : <>{current.name} <span>{value.effort}</span></>}<ChevronDown size={14}/></button></PopoverTrigger>
 <PopoverContent side="top" className="studio-popover studio-models"><label className="studio-search"><Search size={16}/><input aria-label="Search models" placeholder="Search models" value={query} onChange={e => setQuery(e.target.value)}/></label>
 <div className="studio-menu-row"><span>Auto</span><Switch aria-label="Auto model" checked={value.auto} onCheckedChange={auto => onChange({ ...value, auto })}/></div>
 {models.filter(model => model.name.toLowerCase().includes(query.toLowerCase())).map(model => <div className="studio-model-row" key={model.id}><button onClick={() => { onChange({ id: model.id, effort: model.effort, auto: false }); setOpen(false); }}><span className="studio-model-mark">{model.mark}</span>{model.name}{!value.auto && model.id === value.id && <Check size={14}/>}</button><div className="studio-efforts" aria-label={`${model.name} reasoning effort`}>{model.efforts.map(effort => <button key={effort} title={`${model.name}: ${effort}`} data-active={value.id === model.id && value.effort === effort && !value.auto} onClick={() => { onChange({ id: model.id, effort, auto: false }); setOpen(false); }}>{effort}</button>)}</div></div>)}
 {!models.some(model => model.name.toLowerCase().includes(query.toLowerCase())) && <p className="studio-empty">No matching models</p>}
 </PopoverContent></Popover>;
}
