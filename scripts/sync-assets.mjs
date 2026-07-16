import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function readJsonOrNull(relativePath) {
  try {
    return await readJson(relativePath);
  } catch {
    return null;
  }
}

async function writeJson(relativePath, value) {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function speechTextForCard(card) {
  return card.audioText ?? (card.tts?.length ? card.tts : card.line).join("");
}

function speechTextForToken(token) {
  return token.audioText ?? token.reading ?? token.surface;
}

function tokenAudioKey(token) {
  return `${token.surface}|${token.reading ?? token.surface}|${speechTextForToken(token)}`;
}

async function syncAssets() {
  const index = await readJson("data/jp/curriculum/unit_index.json");
  for (const entry of index.units) {
    const unitPath = `data/jp/curriculum/units/unit_${String(entry.id).padStart(3, "0")}.json`;
    const unit = await readJson(unitPath);
    const unitSlug = `unit_${String(unit.id).padStart(3, "0")}`;
    const manifestPath = `data/jp/media/manifests/${unitSlug}.assets.json`;
    const existingManifest = await readJsonOrNull(manifestPath);
    const manifest = {
      unitId: unit.id,
      unitSlug,
      generatedAt: existingManifest?.generatedAt ?? new Date().toISOString(),
      audioPolicy: "production audio is generated for cards with audioRef; app uses browser speech fallback otherwise",
      audio: [],
      tokenAudio: [],
    };
    const tokenAudioByKey = new Map();

    for (const card of unit.cards) {
      for (const staleField of ["image" + "Prompt", "image" + "Ref"]) {
        delete card[staleField];
      }
      manifest.audio.push({
        cardId: card.id,
        status: card.audioRef ? "complete" : "queued",
        path: card.audioRef ?? `/media/jp/audio/${unitSlug}/${card.id}.mp3`,
        text: card.line.join(""),
        speechText: speechTextForCard(card),
        provider: card.audioRef ? "elevenlabs" : undefined,
      });
      for (const token of card.tokens ?? []) {
        if (!token.audioRef) continue;
        const key = tokenAudioKey(token);
        tokenAudioByKey.set(key, {
          key,
          status: "complete",
          path: token.audioRef,
          text: token.surface,
          speechText: speechTextForToken(token),
          provider: "elevenlabs",
        });
      }
    }

    manifest.tokenAudio = [...tokenAudioByKey.values()];

    await writeJson(unitPath, unit);
    await writeJson(manifestPath, manifest);
  }
}

await syncAssets();
console.log("Audio manifests synced.");
