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

async function writeFile(relativePath, contents) {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, "utf8");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function imageSvg(unit, card) {
  const sentence = card.line.join("");
  const prompt = card.imagePrompt ?? card.english;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#f7f3ec"/>
  <rect x="70" y="70" width="1060" height="660" rx="24" fill="#fffdfa" stroke="#26665d" stroke-width="8"/>
  <circle cx="170" cy="160" r="42" fill="#8d4a3f"/>
  <circle cx="1030" cy="640" r="56" fill="#26665d"/>
  <text x="600" y="320" font-family="Yu Gothic, Meiryo, sans-serif" font-size="76" font-weight="800" text-anchor="middle" fill="#17211f">${escapeXml(sentence)}</text>
  <text x="600" y="410" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle" fill="#8d4a3f">Unit ${String(unit.id).padStart(3, "0")} · ${escapeXml(card.id)}</text>
  <foreignObject x="180" y="470" width="840" height="160">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; font-size: 30px; line-height: 1.25; color: #56635f; text-align: center;">${escapeXml(prompt)}</div>
  </foreignObject>
</svg>`;
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
      imagePolicy: "reusable scene images are preserved; placeholder SVGs are written only for card-level missing art",
      audioPolicy: "audio is queued; app uses browser speech fallback until production audio exists",
      images: [],
      audio: [],
    };

    for (const card of unit.cards) {
      const imageRef = card.imageRef ?? `/media/jp/images/${unitSlug}/${card.id}.svg`;
      card.imageRef = imageRef;
      const publicImagePath = imageRef.replace(/^\//, "public/");
      const isScene = imageRef.includes("/scenes/");
      const isPlaceholder = imageRef.endsWith(".svg") && !isScene;
      if (isPlaceholder) {
        await writeFile(publicImagePath, imageSvg(unit, card));
      }
      manifest.images.push({
        cardId: card.id,
        status: isPlaceholder ? "placeholder" : "generated",
        path: imageRef,
        prompt: card.imagePrompt ?? "",
      });
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
console.log("Asset manifests and placeholder images synced.");
