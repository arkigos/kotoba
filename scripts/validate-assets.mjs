import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function publicPathFromRef(ref) {
  return ref.replace(/^\//, "public/");
}

const failures = [];
const index = await readJson("data/jp/curriculum/unit_index.json");

for (const entry of index.units) {
  const unitSlug = `unit_${String(entry.id).padStart(3, "0")}`;
  const unit = await readJson(`data/jp/curriculum/units/${unitSlug}.json`);
  const manifestPath = `data/jp/media/manifests/${unitSlug}.assets.json`;
  if (!(await exists(manifestPath))) {
    failures.push(`${unitSlug}: missing asset manifest`);
    continue;
  }

  const manifest = await readJson(manifestPath);
  const audioByCard = new Map(manifest.audio.map((asset) => [asset.cardId, asset]));

  for (const card of unit.cards) {
    const audio = audioByCard.get(card.id);
    if (!audio) {
      failures.push(`${unitSlug} ${card.id}: missing audio manifest entry`);
    } else if (!audio.text || !audio.path || !["queued", "complete"].includes(audio.status)) {
      failures.push(`${unitSlug} ${card.id}: invalid audio manifest entry`);
    }

    if (card.audioRef && !(await exists(publicPathFromRef(card.audioRef)))) {
      failures.push(`${unitSlug} ${card.id}: audioRef does not exist: ${card.audioRef}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("Asset validation passed.");
