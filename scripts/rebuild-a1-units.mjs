import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const steps = [
  ["node", ["scripts/rebuild-foundation-units.mjs"]],
  ["node", ["scripts/author-a1-units.mjs"]],
  ["node", ["scripts/add-a1-action-previews.mjs"]],
  ["node", ["scripts/enforce-a1-generation-rules.mjs"]],
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

console.log("Rebuilt A1 units 1-20 and synced asset manifests.");
