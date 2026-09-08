"use client";
import "../studio.css";
import { useState } from "react";
import { Check, Copy, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@chadcn/upstream-shadcn/tabs";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@chadcn/upstream-shadcn/alert-dialog";
import { GlassButton } from "../glass-button";
import { SchemaFieldRow } from "./SchemaFieldRow";
import { createField, initialFields, toJSONSchema, fromJSONSchema, updateField, removeField, type SchemaField, type JSONSchema } from "./schema";
export interface SchemaBuilderProps {
    defaultFields?: SchemaField[];
    onChange?: (schema: JSONSchema) => void;
    className?: string;
}
export function SchemaBuilder({ defaultFields = initialFields, onChange, className = "" }: SchemaBuilderProps) {
    const [fields, setFields] = useState(defaultFields);
    const [code, setCode] = useState(() => JSON.stringify(toJSONSchema(defaultFields), null, 2));
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState<SchemaField | null>(null);
    const commit = (next: SchemaField[]) => { setFields(next); const schema = toJSONSchema(next); setCode(JSON.stringify(schema, null, 2)); setError(""); onChange?.(schema); };
    const update = (id: string, patch: Partial<SchemaField>) => commit(updateField(fields, id, field => ({ ...field, ...patch, children: patch.type && ["object", "enum"].includes(patch.type) && !field.children.length ? [createField()] : field.children })));
    const add = (parent?: string) => { const field = createField(); commit(parent ? updateField(fields, parent, item => ({ ...item, children: [...item.children, field] })) : [...fields, field]); };
    const remove = (field: SchemaField) => { if (field.children.length && (field.type === "object" || field.type === "enum")) {
        setDeleting(field);
        return;
    } commit(removeField(fields, field.id)); };
    const edit = (value: string) => { setCode(value); setCopied(false); try {
        const schema: unknown = JSON.parse(value);
        const next = fromJSONSchema(schema);
        setFields(next);
        setError("");
        onChange?.(toJSONSchema(next));
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Invalid schema");
    } };
    const copy = async () => { try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
    }
    catch {
        setError("Clipboard unavailable. Select the JSON and copy it manually.");
    } };
    return <section className={`studio-kit studio-schema ${className}`} aria-label="Schema"><h2>Schema</h2><Tabs defaultValue="visual"><TabsList className="studio-tabs" aria-label="Schema editor mode"><TabsTrigger value="visual">Visual editor</TabsTrigger><TabsTrigger value="code">Code editor</TabsTrigger></TabsList>
 <TabsContent value="visual"><div className="studio-fields">{fields.map(field => <SchemaFieldRow key={field.id} field={field} onUpdate={update} onAdd={add} onRemove={remove}/>)}{!fields.length && <p className="studio-empty">No properties yet.</p>}<button className="studio-add" onClick={() => add()}><Plus size={16}/>Add property</button></div>{error && <p className="studio-error">The code contains an error. Showing the last valid schema.</p>}</TabsContent>
 <TabsContent value="code"><div className="studio-code"><div className="studio-code-editor"><pre className="studio-line-numbers" aria-hidden="true">{code.split("\n").map((_, index) => index + 1).join("\n")}</pre><textarea aria-label="Schema JSON" spellCheck={false} value={code} onChange={e => edit(e.target.value)} style={{ height: `${Math.max(180, Math.min(390, code.split("\n").length * 21))}px` }} onKeyDown={e => { if (e.key === "Tab") {
        e.preventDefault();
        const start = e.currentTarget.selectionStart, end = e.currentTarget.selectionEnd;
        edit(code.slice(0, start) + "  " + code.slice(end));
        requestAnimationFrame(() => e.target instanceof HTMLTextAreaElement && e.target.setSelectionRange(start + 2, start + 2));
    } }}/></div><div className="studio-code-actions"><button disabled={!!error} onClick={() => setCode(JSON.stringify(JSON.parse(code), null, 2))}>Format</button><GlassButton label={copied ? "Copied" : "Copy schema"} onClick={() => void copy()}>{copied ? <Check size={16}/> : <Copy size={16}/>}</GlassButton></div></div>{error && <p className="studio-error" role="alert">{error}</p>}</TabsContent></Tabs>
 <AlertDialog open={!!deleting} onOpenChange={open => !open && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove this property?</AlertDialogTitle><AlertDialogDescription>This removes {deleting?.name || "this property"} and all its nested values.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleting)
        commit(removeField(fields, deleting.id)); setDeleting(null); }}>Remove property</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
 </section>;
}
