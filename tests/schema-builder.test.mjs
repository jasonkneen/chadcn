import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

const source = readFileSync(new URL('../packages/ui/src/schema-builder/schema.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { fromJSONSchema, toJSONSchema } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const normalize = value => JSON.parse(JSON.stringify(value));

test('nested objects, arrays, choice values and required flags round trip', () => {
 const schema = { type:'object',properties:{people:{type:'array',items:{type:'object',properties:{name:{type:'string'},age:{type:'integer'},active:{type:'boolean'},role:{type:'string',enum:['owner','editor']}},required:['name']}},count:{type:'number'}},required:['people']};
 assert.deepEqual(normalize(toJSONSchema(fromJSONSchema(schema))), schema);
});

test('prototype-like property names survive safely', () => {
 const schema = JSON.parse('{"type":"object","properties":{"__proto__":{"type":"string"},"constructor":{"type":"number"}}}');
 assert.deepEqual(normalize(toJSONSchema(fromJSONSchema(schema))), schema);
});

test('malformed and unsupported schemas fail without silent data loss', () => {
 for(const value of [null,[],{type:'array'}, {type:'object',properties:{x:{type:'string',minLength:2}}}, {type:'object',properties:{x:{type:'null'}}}, {type:'object',properties:{},required:['missing']}]) assert.throws(()=>fromJSONSchema(value));
});

test('authored studio sources stay self-contained', () => {
 const root = new URL('../packages/ui/src', import.meta.url);
 const files = [];
 const walk = (dir) => {
  for (const name of readdirSync(dir)) {
   const path = join(dir, name);
   if (statSync(path).isDirectory()) walk(path);
   else files.push(path);
  }
 };
 walk(root.pathname);
 assert.ok(files.some(path => path.endsWith('ai-chat-bar/AIChatBar.tsx')));
 assert.ok(files.some(path => path.endsWith('ai-todo-list/AITodoList.tsx')));
 assert.ok(files.some(path => path.endsWith('schema-builder/SchemaBuilder.tsx')));
 for (const extra of ['src/demos/StudioExamples.tsx', 'src/demos/studio-lab.css', 'src/HomePage.tsx']) {
  files.push(new URL(`../${extra}`, import.meta.url).pathname);
 }
 for (const path of files) {
  const text = readFileSync(path, 'utf8');
  assert.doesNotMatch(text, new RegExp(['out', 'glow'].join(''), 'i'), path);
 }
});

test('workspace registry items have matching package exports and demos', () => {
 const registry = JSON.parse(readFileSync(new URL('../registry.json', import.meta.url), 'utf8'));
 const pkg = JSON.parse(readFileSync(new URL('../packages/ui/package.json', import.meta.url), 'utf8'));
 const manifest = readFileSync(new URL('../src/demos/manifest.ts', import.meta.url), 'utf8');
 for (const item of registry.items) {
  assert.equal(item.meta.distribution, 'workspace-only');
  assert.ok(pkg.exports[item.meta.import.replace('@chadcn/ui', '.')], item.name);
  assert.match(manifest, new RegExp(`id:'chadcn:${item.name}'`));
 }
});
