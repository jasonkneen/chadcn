import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: 'inherit' });
const sources = JSON.parse(fs.readFileSync(path.join(root, 'sources.json'))).sources;
const lock = JSON.parse(fs.readFileSync(path.join(root, 'sources.lock.json')));
const seen = new Map();
for (const source of sources) {
  const pinned = lock.sources.find(item => item.id === source.id)?.commit;
  if (!pinned || !/^[a-f0-9]{40}$/.test(pinned)) throw new Error(`Missing pinned commit: ${source.id}`);
  const directory = path.resolve(root, source.path);
  if (seen.has(directory)) {
    if (seen.get(directory) !== pinned) throw new Error(`Conflicting pins: ${source.id}`);
    continue;
  }
  seen.set(directory, pinned);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    run('git', ['init', '--quiet'], directory);
    run('git', ['remote', 'add', 'origin', source.repository], directory);
    run('git', ['fetch', '--depth=1', 'origin', pinned], directory);
    run('git', ['checkout', '--detach', 'FETCH_HEAD'], directory);
  }
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
  if (revision !== pinned) throw new Error(`Checkout differs from pinned commit: ${source.id}`);
}
const modules = path.join(root, 'node_modules');
if (!fs.existsSync(modules)) fs.symlinkSync(path.join(root, 'deploy/node_modules'), modules, 'dir');
run(process.execPath, ['scripts/sync.mjs']);
run(process.execPath, ['scripts/link.mjs']);
run('npm', ['run', 'build']);
