import { dlopen, FFIType } from "bun:ffi";
import { closeSync, lstatSync, mkdirSync, openSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { resolve_configuration } from "./roots.ts";
import { ForgeError } from "./errors.ts";

const libc = dlopen(process.platform === "darwin" ? "/usr/lib/libSystem.B.dylib" : "libc.so.6", {
  flock: { args: [FFIType.i32, FFIType.i32], returns: FFIType.i32 },
});
const owned = new Set<string>();

/** Always acquire target first, then shared loop parents; nested calls are reentrant. */
export function withMutationLock<T>(repo: string, mutate: () => T, loopParents: string[] = []): T {
  resolve_configuration(repo);
  const target = join(realpathSync(repo), ".forge");
  const directories = [...new Set(loopParents)].sort();
  const acquire = (index: number): T => index === directories.length
    ? mutate()
    : withFileLock(directories[index]!, ".mutation.lock", () => acquire(index + 1));
  return withFileLock(target, "mutation.lock", () => acquire(0));
}

function withFileLock<T>(directory: string, filename: string, mutate: () => T): T {
  const path = join(directory, filename);
  for (const candidate of [directory, path]) {
    if (lstatSync(candidate, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new ForgeError(`symlink is not allowed: ${candidate}`);
    }
  }
  mkdirSync(directory, { recursive: true });
  const key = join(realpathSync(directory), filename);
  if (owned.has(key)) return mutate();
  const fd = openSync(path, "a");
  try {
    // ponytail: one POSIX advisory lock; raw editors can bypass this local CLI boundary.
    if (libc.symbols.flock(fd, 2) !== 0) throw new ForgeError("cannot acquire mutation lock");
    owned.add(key);
    try {
      return mutate();
    } finally {
      owned.delete(key);
      libc.symbols.flock(fd, 8);
    }
  } finally {
    closeSync(fd);
  }
}
