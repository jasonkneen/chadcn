import { spawnSync } from 'node:child_process';
import { root } from './lib.mjs';

export function workspaceStdio() {
  if (process.env.CHADCN_LOCK_ROOT !== root) return 'inherit';
  const fd = Number(process.env.CHADCN_LOCK_FD);
  if (!Number.isInteger(fd) || fd < 3) throw new Error('Invalid workspace lock descriptor');
  // Preserve the descriptor if the supervising process is terminated mid-operation.
  return ['inherit', 'inherit', 'inherit', ...Array(fd - 3).fill('ignore'), fd];
}

export function enterWorkspaceLock() {
  if (process.env.CHADCN_LOCK_ROOT === root) return;
  const result = spawnSync('python3', [
    `${root}/scripts/workspace-lock.py`, `${root}/.generated/workspace.lock`,
    process.execPath, ...process.argv.slice(1),
  ], { cwd: root, stdio: 'inherit', env: { ...process.env, CHADCN_LOCK_ROOT: root } });
  if (result.error) console.error(`Could not acquire workspace lock: ${result.error.message}`);
  process.exit(result.status ?? 1);
}
