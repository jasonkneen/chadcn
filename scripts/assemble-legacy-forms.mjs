import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = [
  path.resolve(root, 'upstreams/ui/apps/v4/public/r/styles/new-york'),
  path.resolve(root, '../ui/apps/v4/public/r/styles/new-york'),
].find(candidate => fs.existsSync(candidate));
if (!sourceRoot) {
  console.warn('[assemble:forms] skip: registry JSON not found');
  process.exit(0);
}
const outputRoot = path.join(root, '.generated/legacy-forms');
const names = ['checkbox-form-multiple', 'checkbox-form-single', 'combobox-form', 'date-picker-form', 'input-form', 'input-otp-form', 'radio-group-form', 'select-form', 'switch-form', 'textarea-form'];
fs.mkdirSync(outputRoot, { recursive: true });
const records = new Map();
const visit = name => {
  if (records.has(name)) return;
  const file = path.join(sourceRoot, `${name}.json`);
  if (!fs.existsSync(file)) throw new Error(`Missing registry dependency ${name}`);
  const record = JSON.parse(fs.readFileSync(file, 'utf8'));
  records.set(name, record);
  for (const dependency of record.registryDependencies ?? []) visit(dependency);
};
names.forEach(visit);
visit('toast');
for (const [name, record] of records) {
  for (const file of record.files ?? []) {
    const output = path.join(outputRoot, file.path);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    let content = file.content.replace(/from (["'])zod\1/g, 'from "zod/v3"');
    content = content.replace(/(["'])@\/registry\/new-york\/([^"']+)\1/g, (_match, quote, target) => {
      let relative = path.relative(path.dirname(output), path.join(outputRoot, target)).replaceAll('\\', '/');
      if (!relative.startsWith('.')) relative = './' + relative;
      return quote + relative + quote;
    }).replace(/(["'])@\/lib\/utils\1/g, '"cn"');
    fs.writeFileSync(output, content);
  }
}
console.log(`assembled ${names.length} legacy form examples in ${path.relative(root, outputRoot)}`);
console.log(`resolved ${records.size} registry records and ${[...records.values()].reduce((n, r) => n + (r.files?.length ?? 0), 0)} source files`);

fs.mkdirSync(path.join(outputRoot,'previews'),{recursive:true});
for(const name of names){
 fs.writeFileSync(path.join(outputRoot,'previews',name+'.tsx'),`import Example from '../examples/${name}';\nimport { Toaster } from '../ui/toaster';\nexport default function Preview(){return <><Example/><Toaster/></>}\n`);
 const record=records.get(name);const example=record.files.find(file=>file.path.startsWith('examples/'));
 fs.writeFileSync(path.join(root,'public/demo-reference',encodeURIComponent('chadcn:legacy-form:'+name)+'.json'),JSON.stringify({code:example.content,types:'',variants:{},path:example.path,url:'https://github.com/shadcn-ui/ui/blob/HEAD/apps/v4/public/r/styles/new-york/'+name+'.json'}));
}
fs.writeFileSync(path.join(outputRoot,'provenance.json'),JSON.stringify({source:sourceRoot,records:[...records.keys()]},null,2));
