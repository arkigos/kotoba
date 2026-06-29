import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

const fatalPatterns = [
  [/a (water|tea|weather|rain|snow|wind|paper|food)(\b|[.,!?])/i, "uses an article with an uncountable noun"],
  [/\ba (important|old|easy|early|expensive|interesting|open|ordinary)\b/i, "uses `a` before a vowel sound"],
  [/\b(an useful|an university)\b/i, "uses `an` before a consonant sound"],
  [/\bat (here|there near you|over there)\b/i, "uses `at` before here/there"],
  [/\b(right|left|front|nearby) the\b/i, "has an incomplete location phrase"],
  [/\bone thing\b/i, "leaks counter gloss into English"],
  [/\bkeies\b/i, "has a bad plural form"],
  [/\bI is\b/i, "uses incorrect first-person be-verb agreement"],
  [/\blistens? (music|a song|the song)\b/i, "uses listen without `to`"],
  [/\bat (often|sometimes|always|usually|rarely|already|still|rather)\b/i, "uses `at` before a frequency/degree adverb"],
  [/\b(I|you|he|she|teacher|student|friend|man|woman|clerk) (every day|every morning|every night) (eat|eats|drink|drinks|go|goes|watch|watches|listen|listens|read|reads|study|studies)\b/i, "places every-day frequency before the English verb"],
  [/\b(almost never|rarely) (do|does) not\b/i, "double-negates an English frequency sentence"],
  [/\bWhere is the (Japan|America)\?/i, "adds `the` to a country name"],
  [/(ありますですか|いますですか)/, "has a malformed existence question"],
  [/(大きい|小さい|楽しい|難しい|暑い|寒い|新しい|古い)ではありません/, "uses na-adjective negative morphology on an i-adjective"],
  [/\bor (a |an |the )?(person|thing|place|animal|object)\b/i, "uses a broad category as a choice option"],
  [/\b(person|thing|place|animal|object) or\b/i, "uses a broad category as a choice option"],
  [/\b(cat|dog)s? and (a |the )?books? are things\b/i, "mixes living beings and objects under a weak category"],
  [/\bbooks? and (a |the )?(schools?|houses?) are things\b/i, "mixes objects and places under a weak category"],
  [/\b(house|school) and (Japan|America) are places\b/i, "mixes local places and countries in a weak place-category pair"],
  [/\b(Japan|America) and (the )?(house|school) are places\b/i, "mixes countries and local places in a weak place-category pair"],
  [/\bWhich place is (healthy|kind|simple|important)\?/i, "asks a place-only question for a non-place description"],
  [/\b(company|school)'s person\b/i, "uses unnatural `company/school's person` English"],
  [/\bWhose thing\b/i, "uses vague `thing` where a concrete noun is available"],
  [/\b(yesterday's thing|last month's thing|last year's place)\b/i, "uses vague time-linked thing/place English"],
];

const warningPatterns = [
  [/^This is (weather|rain|snow|wind), isn't it\?$/i, "weather sentence may be too deictic"],
  [/^That (near you|over there) is (weather|rain|snow|wind), you know\.$/i, "weather sentence may be too deictic"],
];

const failures = [];
const warnings = [];
const index = await readJson("data/jp/curriculum/unit_index.json");

for (const entry of index.units) {
  const unit = await readJson(`data/jp/curriculum/units/unit_${String(entry.id).padStart(3, "0")}.json`);
  for (const card of unit.cards) {
    const text = `${card.line?.join("") ?? ""} ${card.english ?? ""}`;
    for (const [pattern, message] of fatalPatterns) {
      if (pattern.test(text)) {
        failures.push(`unit ${unit.id} ${card.id}: ${message}: ${card.line.join("")} => ${card.english}`);
      }
    }
    for (const [pattern, message] of warningPatterns) {
      if (pattern.test(card.english ?? "")) {
        warnings.push(`unit ${unit.id} ${card.id}: ${message}: ${card.english}`);
      }
    }
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("Unit quality audit passed.");
