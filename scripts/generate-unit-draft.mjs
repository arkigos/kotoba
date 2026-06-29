import fs from "node:fs/promises";
import path from "node:path";
import { generateCardCandidate } from "./lib/curriculum-card-generator.mjs";
import { readPacingRules, readUnitSpecs, root } from "./lib/curriculum-model.mjs";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

const unitId = Number(option("--unit", "2"));
const cardCount = Number(option("--cards", "80"));
const outPath = option("--out", "");

if (!Number.isInteger(unitId) || !Number.isInteger(cardCount)) {
  throw new Error("Usage: node scripts/generate-unit-draft.mjs --unit 2 --cards 80 [--out tmp/unit_002.draft.json]");
}

const source = await readUnitSpecs();
const pacing = await readPacingRules();
const spec = source.units.find((unit) => unit.id === unitId);
if (!spec) throw new Error(`Unknown unit ${unitId}`);

const cards = Array.from({ length: cardCount }, (_, index) => {
  const candidate = generateCardCandidate({
    source,
    pacing,
    unitId,
    cardNumber: index + 1,
    variant: index,
  });
  const { meta: _meta, ...card } = candidate;
  return {
    ...card,
    id: `u${String(unitId).padStart(3, "0")}-c${String(index + 1).padStart(3, "0")}`,
  };
});

const unit = {
  id: spec.id,
  slug: spec.slug,
  title: spec.title,
  grammarFocus: spec.grammarFocus,
  newWords: spec.newWords,
  cards,
};

const json = `${JSON.stringify(unit, null, 2)}\n`;

if (outPath) {
  const absolutePath = path.resolve(root, outPath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, json, "utf8");
  console.log(`Wrote draft unit ${unitId} to ${path.relative(root, absolutePath)}`);
} else {
  process.stdout.write(json);
}
