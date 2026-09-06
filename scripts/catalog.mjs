import { readJSON, root } from './lib.mjs';
const catalog = await readJSON(`${root}/data/catalog.json`);
const query = process.argv.slice(2).join(' ').toLowerCase();
for (const item of catalog.items.filter(i=>JSON.stringify([i.name,i.description,i.source,i.category]).toLowerCase().includes(query))) console.log(`${item.id}\t${item.status}\t${item.entries?.[0]?.import ?? item.package ?? item.homepage}`);
