import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generatedAt = "2026-06-29T00:00:00.000Z";

const steps = [
  ["node", ["scripts/author-a2-unit21.mjs"]],
  ["node", ["scripts/author-a2-units.mjs"]],
  ["node", ["scripts/enforce-a2-generation-rules.mjs"]],
];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function syncA2Manifests() {
  const index = await readJson("data/jp/curriculum/unit_index.json");
  const a2Entries = index.units.filter((entry) => entry.id >= 21 && entry.id <= 44);

  for (const entry of a2Entries) {
    const unit = await readJson(entry.path);
    const unitSlug = `unit_${String(unit.id).padStart(3, "0")}`;
    const manifest = {
      unitId: unit.id,
      unitSlug,
      generatedAt,
      audioPolicy: "audio is queued; app uses browser speech fallback until production audio exists",
      audio: unit.cards.map((card) => ({
        cardId: card.id,
        status: card.audioRef ? "complete" : "queued",
        path: card.audioRef ?? `/media/jp/audio/${unitSlug}/${card.id}.mp3`,
        text: card.line.join(""),
      })),
    };

    await writeJson(`data/jp/media/manifests/${unitSlug}.assets.json`, manifest);
  }
}

for (const [command, args] of steps) run(command, args);
await syncA2Manifests();

console.log("Rebuilt A2 units 21-44 and synced A2 audio manifests.");
