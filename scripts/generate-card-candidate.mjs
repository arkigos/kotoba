import { generateCardCandidate } from "./lib/curriculum-card-generator.mjs";
import { readPacingRules, readUnitSpecs } from "./lib/curriculum-model.mjs";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

const unitId = Number(option("--unit", "2"));
const cardNumber = Number(option("--card", "50"));
const count = Number(option("--count", "1"));

if (!Number.isInteger(unitId) || !Number.isInteger(cardNumber) || !Number.isInteger(count)) {
  throw new Error("Usage: node scripts/generate-card-candidate.mjs --unit 2 --card 50 --count 20");
}

const source = await readUnitSpecs();
const pacing = await readPacingRules();

for (let variant = 0; variant < count; variant += 1) {
  const card = generateCardCandidate({ source, pacing, unitId, cardNumber, variant });
  console.log(JSON.stringify(card, null, 2));
}
