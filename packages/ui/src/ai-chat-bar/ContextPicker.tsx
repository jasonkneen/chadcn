"use client";
import { useState } from "react";
import { ArrowLeft, Box, ChevronRight, GitBranch, Puzzle, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@chadcn/upstream-shadcn/popover";
import { apps, flows, blocks, appActions } from "./data";
export interface ContextItem {
    kind: "Flow" | "Block" | "App";
    label: string;
}
export function ContextPicker({ open, onOpenChange, installed, onInstall, onSelect }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    installed: string[];
    onInstall: (app: string) => void;
    onSelect: (item: ContextItem) => void;
}) {
    const [category, setCategory] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const items = category === "Flow" ? flows : category === "Block" ? blocks : category === "App" ? installed : category ? appActions[category] ?? [] : [];
    return <Popover open={open} onOpenChange={value => { onOpenChange(value); if (!value) {
        setCategory(null);
        setQuery("");
    } }}><PopoverTrigger asChild><button className="studio-context-trigger" aria-label="Add context">@</button></PopoverTrigger>
 <PopoverContent side="top" align="start" className="studio-popover studio-context">{category ? <><button className="studio-back" onClick={() => { setCategory(apps.includes(category) ? "App" : null); setQuery(""); }}><ArrowLeft size={14}/>{category}</button><label className="studio-search"><Search size={14}/><input placeholder={`Search ${category.toLowerCase()}`} aria-label="Search context" value={query} onChange={e => setQuery(e.target.value)}/></label><div className="studio-menu-scroll">{items.filter(item => item.toLowerCase().includes(query.toLowerCase())).map(item => <button className="studio-menu-row" key={item} onClick={() => { if (category === "App") {
        setCategory(item);
        setQuery("");
    }
    else {
        onSelect({ kind: category === "Flow" ? "Flow" : category === "Block" ? "Block" : "App", label: item });
        onOpenChange(false);
    } }}><span>{item}</span>{category === "App" && <ChevronRight size={14}/>}</button>)}{!items.some(item => item.toLowerCase().includes(query.toLowerCase())) && <p className="studio-empty">No matches</p>}</div></> : <>{(["Flow", "Block", "App"] as const).map((kind, index) => { const Icon = [GitBranch, Box, Puzzle][index]; return <button key={kind} className="studio-menu-row" onClick={() => setCategory(kind)}><Icon size={16}/><span>{kind}</span><ChevronRight size={14}/></button>; })}{apps.some(app => !installed.includes(app)) && <p className="studio-menu-label">Available apps</p>}{apps.filter(app => !installed.includes(app)).map(app => <button className="studio-menu-row" key={app} onClick={() => onInstall(app)}><Puzzle size={16}/><span>{app}</span><small>Install</small></button>)}</>}</PopoverContent></Popover>;
}
