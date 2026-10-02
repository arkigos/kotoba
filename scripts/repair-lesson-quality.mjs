import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { repairStarterContent, starterTeachingCorrections } from "./lib/starter-content-quality.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = async name => JSON.parse(await fs.readFile(path.join(root, name), "utf8"));
const write = async (name, value) => fs.writeFile(path.join(root, name), JSON.stringify(value, null, 2) + "\n");
const teaching = await read("data/jp/dictionary/teaching_words.json");
const source = await read("data/jp/curriculum/source/unit_specs.json");
const correctWord = word => ({ ...word, ...starterTeachingCorrections[word.id] });
for (const [id, word] of Object.entries(teaching.words)) teaching.words[id] = correctWord(word);
source.units.forEach(unit => { unit.newWords = unit.newWords.map(correctWord); });
const available = [];
let changed = 0;
for (const specification of source.units.filter(unit => unit.id < 100).sort((a, b) => a.id - b.id)) {
  const name = `data/jp/curriculum/units/unit_${String(specification.id).padStart(3, "0")}.json`;
  const before = await read(name);
  const unit = { ...before, newWords: before.newWords.map(correctWord) };
  available.push(...unit.newWords);
  const repaired = repairStarterContent(unit, available);
  changed += repaired.cards.filter((card, index) => JSON.stringify(card) !== JSON.stringify(before.cards[index])).length;
  if (JSON.stringify(before) !== JSON.stringify(repaired)) await write(name, repaired);
}
await write("data/jp/dictionary/teaching_words.json", teaching);
await write("data/jp/curriculum/source/unit_specs.json", source);
console.log(`Repaired ${changed} cards; preserved IDs and positions. Run dictionary:bind, curriculum:sync-runtime-lexicon, and assets:sync.`);
