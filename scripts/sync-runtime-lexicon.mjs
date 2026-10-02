import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const bindings = await readJson("data/jp/dictionary/course_bindings.json");
const { entries } = await readJson("data/jp/dictionary/course_entries.json");
const words = [];

for (const [id, word] of Object.entries(bindings.words)) {
  // Grammar entries have no introducing unit and remain in their dedicated
  // compatibility files. This artifact keeps its original 825 course IDs.
  if (typeof word.introducedInUnit !== "number") continue;
  if (!entries[word.entryId]) throw new Error(`Missing dictionary entry for ${id}: ${word.entryId}`);
  words.push({
    id,
    surface: word.surface,
    reading: word.reading,
    meaning: word.meaning,
    function: word.function,
    introducedInUnit: word.introducedInUnit,
    level: word.level,
    dictionaryEntryId: word.entryId,
    ...(word.audioText ? { audioText: word.audioText } : {}),
  });
}

words.sort((a, b) => a.id.localeCompare(b.id));

await writeJson("data/jp/curriculum/runtime_lexicon.json", {
  language: "jp",
  generatedFrom: "data/jp/dictionary/course_bindings.json",
  dictionaryEntries: "data/jp/dictionary/course_entries.json",
  placementFramework: "Kotoba curriculum placement, JF/CEFR-inspired; not official word-level certification",
  words,
});

console.log(`Synced runtime lexicon with ${words.length} words.`);
