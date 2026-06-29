import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

async function syncAssets() {
  const index = await readJson("data/jp/curriculum/unit_index.json");
  for (const entry of index.units) {
    const unitPath = `data/jp/curriculum/units/unit_${String(entry.id).padStart(3, "0")}.json`;
    const unit = await readJson(unitPath);
    const unitSlug = `unit_${String(unit.id).padStart(3, "0")}`;
    const manifest = {
      unitId: unit.id,
      unitSlug,
      generatedAt: new Date().toISOString(),
      audioPolicy: "audio is queued; app uses browser speech fallback until production audio exists",
      audio: [],
    };

    for (const card of unit.cards) {
      for (const staleField of ["image" + "Prompt", "image" + "Ref"]) {
        delete card[staleField];
      }
      manifest.audio.push({
        cardId: card.id,
        status: card.audioRef ? "complete" : "queued",
        path: card.audioRef ?? `/media/jp/audio/${unitSlug}/${card.id}.mp3`,
        text: card.line.join(""),
      });
    }

    await writeJson(unitPath, unit);
    await writeJson(`data/jp/media/manifests/${unitSlug}.assets.json`, manifest);
  }
}

await syncAssets();
console.log("Audio manifests synced.");
