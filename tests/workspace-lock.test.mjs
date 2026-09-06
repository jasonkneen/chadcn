import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('OS lock rejects concurrent writers and releases after the owner is killed', {timeout:10000}, async()=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'chadcn-lock-'));
  const wrapper=path.resolve('scripts/workspace-lock.py');
  const lock=path.join(directory,'workspace.lock');
  const owner=spawn('python3',[wrapper,lock,process.execPath,'-e','console.log("locked"); setInterval(()=>{},1000)']);
  try {
    await once(owner.stdout,'data');
    const contender=spawnSync('python3',[wrapper,lock,process.execPath,'-e','console.log("unexpected")'],{encoding:'utf8'});
    assert.equal(contender.status,75);
    assert.doesNotMatch(contender.stdout,/unexpected/);
    const closed=once(owner,'close');owner.kill('SIGKILL');await closed;
    const replacement=spawnSync('python3',[wrapper,lock,process.execPath,'-e','console.log("acquired")'],{encoding:'utf8'});
    assert.equal(replacement.status,0);assert.match(replacement.stdout,/acquired/);
  } finally {owner.kill('SIGKILL');await fs.rm(directory,{recursive:true,force:true});}
});
