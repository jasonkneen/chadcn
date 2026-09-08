export type FieldType = "string" | "number" | "boolean" | "integer" | "object" | "enum";
export interface SchemaField {
    id: string;
    name: string;
    type: FieldType;
    isArray: boolean;
    required: boolean;
    children: SchemaField[];
}
export interface JSONSchema {
    type: string;
    properties?: Record<string, JSONSchema>;
    required?: string[];
    items?: JSONSchema;
    enum?: string[];
}
export const fieldTypes: Record<FieldType, string> = { string: "Text", number: "Number", boolean: "Yes / no", integer: "Whole number", object: "Group", enum: "Choice" };
export function createField(overrides: Partial<SchemaField> = {}): SchemaField { return { id: crypto.randomUUID(), name: "", type: "string", isArray: false, required: false, children: [], ...overrides }; }
export const initialFields: SchemaField[] = [{ id: "initial", name: "", type: "string", isArray: false, required: false, children: [] }];
export function toJSONSchema(fields: SchemaField[]): JSONSchema {
    const properties: Record<string, JSONSchema> = Object.create(null);
    const required: string[] = [];
    fields.forEach(field => {
        const name = field.name.trim();
        if (!name)
            return;
        let value: JSONSchema = field.type === "object" ? toJSONSchema(field.children) : field.type === "enum" ? { type: "string", enum: field.children.map(child => child.name.trim()).filter(Boolean) } : { type: field.type };
        if (field.isArray)
            value = { type: "array", items: value };
        properties[name] = value;
        if (field.required)
            required.push(name);
    });
    return { type: "object", properties, ...(required.length ? { required } : {}) };
}
function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
/** Strictly validate the supported subset: unsupported keywords never disappear silently. */
export function fromJSONSchema(value: unknown, depth = 0): SchemaField[] {
    if (depth > 24)
        throw new Error("Maximum nesting depth is 24.");
    if (!record(value) || value.type !== "object" || !record(value.properties))
        throw new Error("Use an object schema with type: object and a properties object.");
    const allowed = ["type", "properties", "required"];
    if (Object.keys(value).some(key => !allowed.includes(key)))
        throw new Error("Root supports type, properties and required only.");
    if (value.required !== undefined && (!Array.isArray(value.required) || value.required.some(x => typeof x !== "string" || !(x in (value.properties as object)))))
        throw new Error("Required must list existing property names.");
    return Object.entries(value.properties).map(([name, raw]) => {
        if (!record(raw))
            throw new Error(`Invalid schema for ${name}.`);
        let entry = raw;
        const isArray = entry.type === "array";
        if (isArray) {
            if (Object.keys(entry).some(key => !["type", "items"].includes(key)) || !record(entry.items))
                throw new Error(`Array ${name} requires one items schema.`);
            entry = entry.items;
        }
        let type: FieldType;
        if (entry.enum !== undefined) {
            if (entry.type !== "string" || !Array.isArray(entry.enum) || entry.enum.some(item => typeof item !== "string"))
                throw new Error(`Choice ${name} must contain string values.`);
            type = "enum";
        }
        else if (typeof entry.type === "string" && Object.prototype.hasOwnProperty.call(fieldTypes, entry.type) && entry.type !== "enum")
            type = entry.type as FieldType;
        else
            throw new Error(`Unsupported type for ${name}.`);
        const keys = type === "object" ? ["type", "properties", "required"] : type === "enum" ? ["type", "enum"] : ["type"];
        if (Object.keys(entry).some(key => !keys.includes(key)))
            throw new Error(`Unsupported schema keyword in ${name}.`);
        return createField({ name, type, isArray, required: Array.isArray(value.required) && value.required.includes(name), children: type === "object" ? fromJSONSchema(entry, depth + 1) : type === "enum" ? (entry.enum as string[]).map(name => createField({ name })) : [] });
    });
}
export function updateField(fields: SchemaField[], id: string, change: (field: SchemaField) => SchemaField): SchemaField[] { return fields.map(field => field.id === id ? change(field) : { ...field, children: updateField(field.children, id, change) }); }
export function removeField(fields: SchemaField[], id: string): SchemaField[] { return fields.filter(field => field.id !== id).map(field => ({ ...field, children: removeField(field.children, id) })); }
