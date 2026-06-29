import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

const failures = [];
const warnings = [];
const index = await readJson("data/jp/curriculum/unit_index.json");

const weakEnglishPatterns = [
  /^(me|student|teacher|japan|america|name|ken|yuki|tanaka|friend|cat|dog|animal|book|house|school|place|doctor|person|thing)\.$/i,
  /^yes, it is (name|thing|place|animal)\.$/i,
  /^no, (cat|dog|house|school) is (animal|place|thing)\.$/i,
];

const nonsensePatterns = [
  /An animal a thing/i,
  /Dogs and people are animals/i,
  /Cats and people are animals/i,
  /Doctors and people are animals/i,
  /No, /i,
  /Books and places/i,
  /Doctors and schools/i,
  /things here/i,
  /Japan and America are friends/i,
  /No, cat is animal\./i,
  /No, dog is animal\./i,
  /No, house is place\./i,
  /No, school is place\./i,
  /Is it name\?/i,
  /Is it student\?/i,
  /name\. Ken\./i,
  /friend\. Tanaka\./i,
];

const sterileCategoryPattern = /\b(is|are|was|were) (not )?(an? |the )?(object|thing|person|place)\b/i;
const englishQuestionWithExtraSentencePattern = /\?\s+\S/;

for (const entry of index.units) {
  const unit = await readJson(`data/jp/curriculum/units/unit_${String(entry.id).padStart(3, "0")}.json`);
  const seenEnglish = new Map();
  let sterileCategoryCount = 0;
  let bareIdentityIntroCount = 0;

  for (const card of unit.cards) {
    const japaneseLine = Array.isArray(card.line) ? card.line.join("") : "";
    if (sterileCategoryPattern.test(card.english)) sterileCategoryCount += 1;
    if (unit.id > 5 && Array.isArray(card.line) && card.line.length === 3 && card.line[1] === "です") {
      bareIdentityIntroCount += 1;
    }

    if (japaneseLine.includes("？") && englishQuestionWithExtraSentencePattern.test(card.english)) {
      failures.push(`unit ${unit.id} ${card.id}: English translation adds content after a Japanese question: ${card.english}`);
    }

    for (const pattern of weakEnglishPatterns) {
      if (pattern.test(card.english)) {
        warnings.push(`unit ${unit.id} ${card.id}: weak bare-fragment English: ${card.english}`);
      }
    }
    for (const pattern of nonsensePatterns) {
      if (pattern.test(card.english)) {
        failures.push(`unit ${unit.id} ${card.id}: likely nonsense/contradictory card: ${card.english}`);
      }
    }
    const count = seenEnglish.get(card.english) ?? 0;
    seenEnglish.set(card.english, count + 1);
  }
  for (const [english, count] of seenEnglish) {
    if (count > 2) warnings.push(`unit ${unit.id}: repeated English ${count} times: ${english}`);
  }

  if (sterileCategoryCount > 18) {
    failures.push(`unit ${unit.id}: too many sterile category cards (${sterileCategoryCount}); make more cards practical, social, possessive, temporal, or contrastive`);
  }

  if (bareIdentityIntroCount > 6) {
    failures.push(`unit ${unit.id}: too many bare Xです introductions (${bareIdentityIntroCount}); introduce vocabulary through cumulative grammar instead`);
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("Unit content lint passed.");
