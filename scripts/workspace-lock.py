#!/usr/bin/env python3
"""Hold an OS lock across exec; a stopped process cannot leave a stale lock."""
import fcntl
import json
import os
import sys

lock_path, *command = sys.argv[1:]
if not command:
    raise SystemExit("A command is required")
os.makedirs(os.path.dirname(lock_path), exist_ok=True)
lock_file = open(lock_path, "a+")
try:
    fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
except BlockingIOError:
    lock_file.seek(0)
    owner = lock_file.read().strip()
    print(f"Another workspace operation holds the lock: {owner}", file=sys.stderr)
    raise SystemExit(75)

lock_file.seek(0)
lock_file.truncate()
json.dump({"pid": os.getpid(), "command": command}, lock_file)
lock_file.flush()
fd = lock_file.fileno()
os.set_inheritable(fd, True)
os.environ["CHADCN_LOCK_FD"] = str(fd)
os.execvp(command[0], command)
