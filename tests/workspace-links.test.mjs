import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

test('workspace links resolve when node_modules points at the deployment install', async () => {
 const root = await fs.mkdtemp(path.join(os.tmpdir(), 'chadcn-links-'));
 try {
  await fs.mkdir(path.join(root, 'scripts'));
  for (const name of ['link.mjs', 'lib.mjs']) await fs.copyFile(new URL(`../scripts/${name}`, import.meta.url), path.join(root, 'scripts', name));
  await fs.mkdir(path.join(root, 'deploy/node_modules'), { recursive: true });
  await fs.mkdir(path.join(root, 'packages/example'), { recursive: true });
  await fs.writeFile(path.join(root, 'packages/example/package.json'), JSON.stringify({name:'@chadcn/example'}));
  await fs.symlink(path.join(root, 'deploy/node_modules'), path.join(root, 'node_modules'));
  for (let i = 0; i < 2; i++) execFileSync(process.execPath, [path.join(root, 'scripts/link.mjs')]);
  assert.equal(await fs.realpath(path.join(root, 'node_modules/@chadcn/example')), await fs.realpath(path.join(root, 'packages/example')));
 } finally { await fs.rm(root, { recursive: true, force: true }); }
});
