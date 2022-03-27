import {walk, WalkEntry} from "https://deno.land/std@0.132.0/fs/mod.ts";

const files:WalkEntry[] = []
for await (const entry of walk(".")) {
    if (entry.path.startsWith(".git")) continue;
  files.push(entry)
}

console.table(files)