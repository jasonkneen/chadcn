"use client";
import { Brackets, Asterisk, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@chadcn/upstream-shadcn/select";
import { GlassButton } from "../glass-button";
import { fieldTypes, type FieldType, type SchemaField } from "./schema";
export function SchemaFieldRow({ field, enumValue = false, onUpdate, onAdd, onRemove }: {
    field: SchemaField;
    enumValue?: boolean;
    onUpdate: (id: string, patch: Partial<SchemaField>) => void;
    onAdd: (parent: string) => void;
    onRemove: (field: SchemaField) => void;
}) {
    return <div className="studio-field"><div className="studio-field-row"><div className="studio-field-input"><input aria-label={enumValue ? "Enum value" : "Property name"} placeholder={enumValue ? "Value" : "Property name"} value={field.name} spellCheck={false} onChange={e => onUpdate(field.id, { name: e.target.value })}/>{!enumValue && <Select value={field.type} onValueChange={type => onUpdate(field.id, { type: type as FieldType })}><SelectTrigger className="studio-type" aria-label={`Type of ${field.name || "property"}`}><SelectValue /></SelectTrigger><SelectContent className="studio-popover">{Object.entries(fieldTypes).map(([type, label]) => <SelectItem value={type} key={type}>{label}<small className="studio-type-hint">{type}</small></SelectItem>)}</SelectContent></Select>}</div>
 {!enumValue && <><GlassButton label="Array" aria-pressed={field.isArray} data-active={field.isArray} onClick={() => onUpdate(field.id, { isArray: !field.isArray })}><Brackets size={16}/></GlassButton><GlassButton label="Required" aria-pressed={field.required} data-active={field.required} onClick={() => onUpdate(field.id, { required: !field.required })}><Asterisk size={16}/></GlassButton></>}
 <GlassButton label={enumValue ? "Delete value" : "Delete property"} className="studio-delete" onClick={() => onRemove(field)}><Trash2 size={16}/></GlassButton></div>
 {(field.type === "object" || field.type === "enum") && !enumValue && <div className="studio-nested">{field.children.map(child => <SchemaFieldRow key={child.id} field={child} enumValue={field.type === "enum"} onUpdate={onUpdate} onAdd={onAdd} onRemove={onRemove}/>)}<button className="studio-add" onClick={() => onAdd(field.id)}><Plus size={16}/>{field.type === "enum" ? "Add value" : "Add property"}</button></div>}</div>;
}
