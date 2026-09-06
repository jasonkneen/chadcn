import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { config, root, git, exists } from './lib.mjs';
import { enterWorkspaceLock, workspaceStdio } from './workspace-lock.mjs';
enterWorkspaceLock();
const settings = await config();
if (process.argv.includes('--pull')) {
  for (const source of settings.sources) {
    if (!(await exists(source.path))) continue;
    if (git(source.path,'status','--porcelain')) throw new Error(`${source.id} has local edits. Commit or stash them before pulling.`);
    git(source.path,'pull','--ff-only');
  }
}
if (process.argv.includes('--discovery')) {
  const response = await fetch(settings.discovery.url,{signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(`Discovery refresh failed: HTTP ${response.status}`);
  const markdown = await response.text();
  if (!markdown.includes('## Libs and Components')) throw new Error('Unexpected awesome-shadcn-ui document');
  await fs.writeFile(`${root}/${settings.discovery.cache}`,markdown);
}
const result = spawnSync(process.execPath,['scripts/install.mjs',...process.argv.includes('--offline')?['--offline']:[]],{cwd:root,stdio:workspaceStdio()});
process.exit(result.status??1);
