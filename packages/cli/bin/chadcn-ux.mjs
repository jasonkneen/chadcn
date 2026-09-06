#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const command = args[0];
if (!command || command === '--help' || command === '-h') {
  console.log(`chadcn-ux — the chadcn component installer

Usage:
  chadcn-ux init [options]                 Set up a project
  chadcn-ux add [components...] [options]  Install components or registry URLs
  chadcn-ux view [items...]                Inspect registry items
  chadcn-ux search [registries...]         Search registries

Examples:
  npx chadcn-ux init
  npx chadcn-ux add button card
  npx chadcn-ux add button --dry-run

Installation uses shadcn. Unqualified names select its default registry.
Pass a registry URL or a configured @namespace/item for other providers.
Workspace-only chadcn compositions are not distributed by this release.
Run a command with --help for its options. https://chadcn.dev`);
} else if (command === '--version' || command === '-v') {
  console.log(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version);
} else if (!['init', 'add', 'view', 'search'].includes(command)) {
  console.error(`Unknown command: ${command}. Run chadcn-ux --help.`);
  process.exitCode = 1;
} else {
  const require = createRequire(import.meta.url);
  const child = spawn(process.execPath, [require.resolve('shadcn'), ...args], {
    stdio: 'inherit', shell: false,
  });
  const interrupt = (signal) => child.kill(signal);
  const onInt = () => interrupt('SIGINT');
  const onTerm = () => interrupt('SIGTERM');
  process.on('SIGINT', onInt);
  process.on('SIGTERM', onTerm);
  child.on('error', (error) => {
    console.error(`Unable to start installer: ${error.message}`);
    process.exitCode = 1;
  });
  child.on('close', (code, signal) => {
    process.removeListener('SIGINT', onInt);
    process.removeListener('SIGTERM', onTerm);
    process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
  });
}
