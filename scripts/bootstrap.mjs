import {spawnSync} from 'node:child_process';
import {root} from './lib.mjs';
import {enterWorkspaceLock,workspaceStdio} from './workspace-lock.mjs';
enterWorkspaceLock();

const offline=process.argv.includes('--offline');
const sync=spawnSync('npm',['exec','--yes','--package=typescript@5.9.3',...(offline?['--offline']:[]),'--','node','scripts/sync.mjs'],{cwd:root,stdio:workspaceStdio()});
if(sync.status!==0)process.exit(sync.status??1);
const install=spawnSync('npm',['install','--ignore-scripts','--no-audit','--no-fund',...(offline?['--offline']:[])],{cwd:root,stdio:workspaceStdio()});
process.exit(install.status??1);
