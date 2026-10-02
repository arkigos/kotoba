import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const steps = [
  ["node", ["scripts/rebuild-marugoto-starter-a1.mjs"]],
  ["node", ["scripts/sync-runtime-lexicon.mjs"]],
  ["node", ["scripts/sync-curriculum-word-pools.mjs"]],
  ["node", ["scripts/sync-assets.mjs"]],
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("Rebuilt the current Marugoto Starter A1 units and synced asset manifests.");
