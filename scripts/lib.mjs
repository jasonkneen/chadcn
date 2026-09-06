import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const root = path.resolve(import.meta.dirname, '..');
export const readJSON = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));
export const writeJSON = async (p, value) => { await fs.mkdir(path.dirname(p), { recursive: true }); await fs.writeFile(p, JSON.stringify(value, null, 2) + '\n'); };
export const exists = async (p) => !!(await fs.stat(p).catch(() => null));
export const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
export async function config() {
  const base = await readJSON(path.join(root, 'sources.json'));
  const local = await readJSON(path.join(root, 'sources.local.json')).catch(() => ({}));
  base.sources = base.sources.map(s => ({ ...s, path: path.resolve(root, local[s.id] ?? s.path) }));
  return base;
}
export function git(dir, ...args) { return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
export function inside(base, file) { const relative = path.relative(base, file); return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative)); }
export async function walk(dir) {
  const result = [];
  for (const entry of (await fs.readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
    if (['node_modules','.git','.next','dist','__tests__'].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(p));
    else if (entry.isFile()) result.push(p);
  }
  return result;
}
export function parseAwesome(markdown) {
  let category = '';
  const entries = [];
  for (const line of markdown.split('\n')) {
    if (line.startsWith('## ')) category = line.slice(3).trim();
    if (!line.startsWith('|')) continue;
    const cells = line.split(/(?<!\\)\|/).slice(1,-1).map(s => s.trim());
    const url = cells[2]?.match(/\[Link\]\((https?:\/\/[^)]+)\)/)?.[1];
    if (url) entries.push({ id: `awesome:${digest(url + cells[0]).slice(0,16)}`, name: cells[0], description: cells[1], homepage: url, category, source: 'awesome-shadcn-ui', status: 'discovered', framework: 'unknown' });
  }
  return entries;
}
