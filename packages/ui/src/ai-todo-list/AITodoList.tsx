"use client";
import "../studio.css";
import { useEffect, useState } from "react";
import { Check, ChevronDown, LoaderCircle, Hash } from "lucide-react";
import { UsagePopover } from "./UsagePopover";
export interface TodoTask {
    id: string;
    parts: {
        kind: "text" | "chip";
        value: string;
    }[];
}
export const defaultTasks: TodoTask[] = [
    { id: "install", parts: [{ kind: "text", value: "Install" }, { kind: "chip", value: "Slack" }, { kind: "text", value: "app" }] },
    { id: "channel", parts: [{ kind: "chip", value: "Create channel" }, { kind: "text", value: "design-team" }] },
    { id: "invite", parts: [{ kind: "chip", value: "Invite users to channel" }, { kind: "text", value: "Pat Wasik" }] },
];
export interface AITodoListProps {
    tasks?: TodoTask[];
    autoPlay?: boolean;
    onComplete?: () => void;
    className?: string;
}
export function AITodoList({ tasks = defaultTasks, autoPlay = true, onComplete, className = "" }: AITodoListProps) {
    const [visible, setVisible] = useState(autoPlay ? 0 : tasks.length);
    const [done, setDone] = useState(0);
    const [folded, setFolded] = useState(false);
    const [seconds, setSeconds] = useState(0);
    useEffect(() => { if (!autoPlay)
        return; setVisible(0); setDone(0); setFolded(false); setSeconds(0); const timers: ReturnType<typeof setTimeout>[] = []; tasks.forEach((_, i) => { timers.push(setTimeout(() => setVisible(i + 1), 600 + i * 1100)); timers.push(setTimeout(() => setDone(i + 1), 4400 + i * 2800)); }); timers.push(setTimeout(() => { setFolded(true); onComplete?.(); }, tasks.length ? 4400 + (tasks.length - 1) * 2800 + 1200 : 0)); return () => timers.forEach(clearTimeout); }, [autoPlay, tasks, onComplete]);
    useEffect(() => { if (!autoPlay || !visible || done === tasks.length)
        return; const timer = setInterval(() => setSeconds(value => value + 1), 1000); return () => clearInterval(timer); }, [autoPlay, visible, done, tasks.length]);
    const complete = done === tasks.length;
    return <section className={`studio-kit studio-todo ${className}`} aria-label="Tasks" data-folded={folded}><div className="studio-todo-head"><button className="studio-todo-toggle" aria-expanded={!folded} onClick={() => setFolded(!folded)}><ChevronDown size={15} className={folded ? "studio-rotated" : ""}/>Tasks</button><UsagePopover seconds={seconds} tokens={Math.min(1100, Math.round(seconds * 122))}/>{complete ? <span className="studio-completed">Completed</span> : <span className="studio-count" aria-live="polite">{done}/{visible}</span>}</div>
 <div className="studio-todo-reveal" data-open={!folded}><div><ul>{tasks.slice(0, visible).map((task, index) => <li className="studio-task" data-done={index < done} key={task.id}><span className="studio-task-icon">{index < done ? <Check size={12}/> : <LoaderCircle size={17}/>}</span><span className="studio-task-parts">{task.parts.map((part, i) => part.kind === "chip" ? <span className="studio-task-chip" title={part.value} key={i}><Hash size={14}/><span>{part.value}</span></span> : <span key={i}>{part.value}</span>)}</span></li>)}</ul></div></div></section>;
}
