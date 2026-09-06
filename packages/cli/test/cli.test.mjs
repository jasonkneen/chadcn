import { test } from 'node:test';
import assert from 'node:assert/strict';
import { realpathSync, mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const cli = new URL('../bin/chadcn-ux.mjs', import.meta.url);
test('help and version work without installing dependencies', () => {
  const help = spawnSync(process.execPath, [cli.pathname, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Workspace-only/);
  const version = spawnSync(process.execPath, [cli.pathname, '--version'], { encoding: 'utf8' });
  assert.equal(version.status, 0);
  assert.equal(version.stdout.trim(), '0.1.0');
});

test('unknown commands fail before running an installer', () => {
  const result = spawnSync(process.execPath, [cli.pathname, 'invented'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown command/);
});

test('passes arguments literally, preserves cwd, and propagates installer failures', () => {
  const directory = mkdtempSync(join(tmpdir(), 'chadcn-cli-test-'));
  try {
    const module = join(directory, 'node_modules/shadcn');
    mkdirSync(module, { recursive: true });
    copyFileSync(cli, join(directory, 'cli.mjs'));
    writeFileSync(join(module, 'package.json'), JSON.stringify({ name: 'shadcn', main: 'index.cjs' }));
    writeFileSync(join(module, 'index.cjs'), 'console.log(JSON.stringify({args:process.argv.slice(2),cwd:process.cwd()}));process.exit(7)');
    const args = ['add', 'https://example.com/r/button.json', '--cwd', 'project with spaces', '$(touch SHOULD_NOT_EXIST)'];
    const result = spawnSync(process.execPath, [join(directory, 'cli.mjs'), ...args], { cwd: directory, encoding: 'utf8' });
    assert.equal(result.status, 7);
    assert.deepEqual(JSON.parse(result.stdout), { args, cwd: realpathSync(directory) });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
