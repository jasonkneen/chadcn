"use client";
import "../studio.css";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, LoaderCircle, Mic, Pencil, Plus, Square, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@chadcn/upstream-shadcn/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@chadcn/upstream-shadcn/dialog";
import { GlassButton } from "../glass-button";
import { ModelPicker, type ModelSelection } from "./ModelPicker";
import { ContextPicker, type ContextItem } from "./ContextPicker";
export interface ChatMessage {
    text: string;
    mode: string;
    model: ModelSelection;
    context: ContextItem[];
    files: File[];
}
export interface AIChatBarProps {
    className?: string;
    onSend?: (message: ChatMessage) => void | Promise<void>;
    onUpgrade?: () => void;
    showUpgrade?: boolean;
}
export function AIChatBar({ className = "", onSend, onUpgrade, showUpgrade = true }: AIChatBarProps) {
    const [text, setText] = useState("");
    const [mode, setMode] = useState("Build");
    const [model, setModel] = useState<ModelSelection>({ id: "fable-5", effort: "High", auto: false });
    const [context, setContext] = useState<ContextItem[]>([]);
    const [installed, setInstalled] = useState(["Anthropic", "Spacelift", "GitHub"]);
    const [picker, setPicker] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [busy, setBusy] = useState(false);
    const [queue, setQueue] = useState<ChatMessage[]>([]);
    const [folded, setFolded] = useState(false);
    const [banner, setBanner] = useState(showUpgrade);
    const [upgrade, setUpgrade] = useState(false);
    const [error, setError] = useState("");
    const [recording, setRecording] = useState(false);
    const input = useRef<HTMLTextAreaElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const recordingRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const run = useRef(0);
    useEffect(() => () => { run.current++; recordingRef.current?.stop(); streamRef.current?.getTracks().forEach(track => track.stop()); }, []);
    useEffect(() => { const el = input.current; if (el) {
        el.style.height = "auto";
        el.style.height = `${Math.min(160, Math.max(40, el.scrollHeight))}px`;
    } }, [text]);
    const process = async (message: ChatMessage) => { const token = ++run.current; setBusy(true); setError(""); try {
        if (onSend)
            await onSend(message);
        else
            await new Promise(resolve => setTimeout(resolve, 6500));
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Unable to send message");
    }
    finally {
        if (token === run.current)
            setBusy(false);
    } };
    useEffect(() => { if (!busy && queue.length) {
        const [next, ...rest] = queue;
        setQueue(rest);
        void process(next);
    } }, [busy, queue]); // Queue preserves each prompt's model and context.
    const send = () => { if (!text.trim() && !context.length && !files.length)
        return; const message = { text: text.trim(), mode, model, context, files }; if (busy)
        setQueue(items => [...items, message]);
    else
        void process(message); setText(""); setContext([]); setFiles([]); setPicker(false); };
    const record = async () => { if (recording) {
        recordingRef.current?.stop();
        setRecording(false);
        return;
    } try {
        if (!navigator.mediaDevices?.getUserMedia)
            throw new Error("Audio recording is unavailable in this browser.");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => { setFiles(items => [...items, new File(chunks, "voice-note.webm", { type: recorder.mimeType })]); stream.getTracks().forEach(track => track.stop()); };
        recordingRef.current = recorder;
        recorder.start();
        setRecording(true);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Microphone unavailable");
    } };
    return <div className={`studio-kit studio-chat ${className}`}>
 {queue.length > 0 && <div className="studio-queued"><button className="studio-queue-heading" onClick={() => setFolded(!folded)} aria-expanded={!folded}><ChevronDown size={14} className={folded ? "studio-rotated" : ""}/>Queued <span>{queue.length}/{queue.length}</span></button>{!folded && queue.map((message, index) => <div className="studio-queue-row" key={index}><LoaderCircle size={14}/><span>{message.text || "Attachment"}</span><GlassButton label="Edit queued message" onClick={() => { setText(message.text); setContext(message.context); setFiles(message.files); setQueue(items => items.filter((_, i) => i !== index)); input.current?.focus(); }}><Pencil size={14}/></GlassButton><GlassButton label="Remove queued message" onClick={() => setQueue(items => items.filter((_, i) => i !== index))}><X size={14}/></GlassButton></div>)}</div>}
 <section className="studio-composer" aria-label="Chat with AI">
 {(context.length > 0 || files.length > 0) && <div className="studio-attachments">{context.map((item, index) => <span className="studio-chip" key={`${item.label}-${index}`}>@ {item.label}<button aria-label={`Remove ${item.label}`} onClick={() => setContext(items => items.filter((_, i) => i !== index))}><X size={12}/></button></span>)}{files.map((file, index) => <span className="studio-chip" key={index}>{file.name}<button aria-label={`Remove ${file.name}`} onClick={() => setFiles(items => items.filter((_, i) => i !== index))}><X size={12}/></button></span>)}</div>}
 <textarea ref={input} value={text} aria-label="Message" placeholder={busy ? "Add a follow-up" : "Plan, Build, Automate / @ for context"} onChange={e => { setText(e.target.value); if (e.target.value.endsWith("@"))
        setPicker(true); }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        send();
    } }}/>
 <div className="studio-toolbar"><input hidden multiple type="file" ref={fileInput} onChange={e => { setFiles(items => [...items, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }}/><GlassButton label="Add files" onClick={() => fileInput.current?.click()}><Plus size={16}/></GlassButton>
 <Select value={mode} onValueChange={setMode}><SelectTrigger className="studio-mode" aria-label="Chat mode"><SelectValue /></SelectTrigger><SelectContent className="studio-popover">{["Plan", "Ask", "Build"].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
 <ModelPicker value={model} onChange={setModel}/><ContextPicker open={picker} onOpenChange={setPicker} installed={installed} onInstall={app => { setInstalled(items => [...items, app]); setText(`Install ${app} app`); setPicker(false); }} onSelect={item => { setContext(items => items.some(x => x.label === item.label) ? items : [...items, item]); setText(value => value.replace(/@$/, "")); input.current?.focus(); }}/>
 <GlassButton label={recording ? "Stop recording" : "Record audio"} className={recording ? "studio-recording" : ""} onClick={() => void record()}>{recording ? <Square size={13}/> : <Mic size={16}/>}</GlassButton>
 {busy && !text.trim() && !context.length && !files.length ? <GlassButton label="Stop generation" onClick={() => { run.current++; setQueue([]); setBusy(false); }}><Square size={14}/></GlassButton> : <GlassButton label={busy ? "Queue message" : "Send message"} className="studio-send" disabled={!text.trim() && !context.length && !files.length} onClick={send}><ArrowUp size={18}/></GlassButton>}
 </div></section>
 {banner && <aside className="studio-upgrade"><span>Upgrade to Pro. <button onClick={() => setUpgrade(true)}>See Pro benefits</button></span><button className="studio-upgrade-button" onClick={() => onUpgrade ? onUpgrade() : setUpgrade(true)}>Upgrade</button><button aria-label="Dismiss upgrade" onClick={() => setBanner(false)}><X size={15}/></button></aside>}
 {error && <p role="alert" className="studio-error">{error}</p>}
 <Dialog open={upgrade} onOpenChange={setUpgrade}><DialogContent><DialogHeader><DialogTitle>Pro preview</DialogTitle><DialogDescription>This is the showcase upgrade panel. Connect the onUpgrade callback to your own plans or checkout.</DialogDescription></DialogHeader></DialogContent></Dialog>
 </div>;
}
