import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function unitSlug(id) {
  return `unit_${String(id).padStart(3, "0")}`;
}

function publicPathFromRef(ref) {
  return path.join(root, ref.replace(/^\//, "public/"));
}

function exists(ref) {
  return fs.existsSync(publicPathFromRef(ref));
}

function tokenText(token) {
  return token.audioText ?? token.reading ?? token.surface;
}

function tokenKey(token) {
  return `${token.surface}|${token.reading ?? token.surface}|${tokenText(token)}`;
}

function tokenRef(token) {
  const hash = crypto.createHash("sha1").update(tokenKey(token)).digest("hex").slice(0, 12);
  return `/media/jp/audio/tokens/${hash}.mp3`;
}

function shouldGenerateTokenAudio(token) {
  return Boolean(token.surface && !/^[\s、。！？!?]+$/.test(token.surface));
}

for (const id of process.argv.slice(2).map(Number)) {
  const slug = unitSlug(id);
  const unit = JSON.parse(fs.readFileSync(path.join(root, `data/jp/curriculum/units/${slug}.json`), "utf8"));
  let cardWith = 0;
  let cardMissing = 0;
  const tokenUnique = new Set();
  const tokenExisting = new Set();
  const tokenMissing = new Set();

  for (const card of unit.cards) {
    const ref = card.audioRef ?? `/media/jp/audio/${slug}/${card.id}.mp3`;
    if (exists(ref)) cardWith += 1;
    else cardMissing += 1;

    for (const token of card.tokens ?? []) {
      if (!shouldGenerateTokenAudio(token)) continue;
      const key = tokenKey(token);
      const ref = token.audioRef ?? tokenRef(token);
      tokenUnique.add(key);
      if (exists(ref)) tokenExisting.add(key);
      else tokenMissing.add(key);
    }
  }

  console.log(
    `${slug} cards=${unit.cards.length} cardAudio=${cardWith}/${unit.cards.length} missingCards=${cardMissing} uniqueTokens=${tokenUnique.size} tokenExisting=${tokenExisting.size} tokenMissing=${tokenMissing.size}`,
  );
}
