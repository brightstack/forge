import { dlopen, FFIType } from "bun:ffi";
import { closeSync, lstatSync, mkdirSync, openSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { ForgeError } from "./errors.ts";

const libc = dlopen(process.platform === "darwin" ? "/usr/lib/libSystem.B.dylib" : "libc.so.6", {
  flock: { args: [FFIType.i32, FFIType.i32], returns: FFIType.i32 },
});
const owned = new Set<string>();

export function withMutationLock<T>(repo: string, mutate: () => T): T {
  const root = realpathSync(repo);
  if (owned.has(root)) return mutate();
  const directory = join(root, ".forge");
  const path = join(directory, "mutation.lock");
  for (const candidate of [directory, path]) {
    if (lstatSync(candidate, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new ForgeError(`symlink is not allowed: ${candidate}`);
    }
  }
  mkdirSync(directory, { recursive: true });
  const fd = openSync(path, "a");
  try {
    // ponytail: one POSIX advisory lock; raw editors can bypass this local CLI boundary.
    if (libc.symbols.flock(fd, 2) !== 0) throw new ForgeError("cannot acquire mutation lock");
    owned.add(root);
    try {
      return mutate();
    } finally {
      owned.delete(root);
      libc.symbols.flock(fd, 8);
    }
  } finally {
    closeSync(fd);
  }
}
