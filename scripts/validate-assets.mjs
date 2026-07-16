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

function speechTextForToken(token) {
  return token.audioText ?? token.reading ?? token.surface;
}

function tokenAudioKey(token) {
  return `${token.surface}|${token.reading ?? token.surface}|${speechTextForToken(token)}`;
}

const failures = [];
const index = await readJson("data/jp/curriculum/unit_index.json");
const tokenAudioRefsByKey = new Map();

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

    for (const token of card.tokens ?? []) {
      if (!token.audioRef) continue;
      if (!(await exists(publicPathFromRef(token.audioRef)))) {
        failures.push(`${unitSlug} ${card.id}: token audioRef does not exist: ${token.audioRef}`);
      }

      const key = tokenAudioKey(token);
      const existingRef = tokenAudioRefsByKey.get(key);
      if (existingRef && existingRef !== token.audioRef) {
        failures.push(`${unitSlug} ${card.id}: token audio key ${key} uses both ${existingRef} and ${token.audioRef}`);
      } else {
        tokenAudioRefsByKey.set(key, token.audioRef);
      }
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("Asset validation passed.");
