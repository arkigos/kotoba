import {
  readAuthoredUnit,
  readUnitSpecs,
  vocabularyPoolsForUnit,
  wordAppearanceCounts,
} from "./lib/curriculum-model.mjs";

const unitArg = process.argv.find((arg) => arg.startsWith("--units="));
const unitsToAudit = unitArg ? parseUnitRange(unitArg.slice("--units=".length)) : [1, 2, 3, 4, 5, 6, 7];
const maxExamples = process.argv.includes("--verbose") ? Number.POSITIVE_INFINITY : 8;

const source = await readUnitSpecs();
const wordById = new Map(source.units.flatMap((unit) => unit.newWords.map((word) => [word.id, { ...word, unitId: unit.id }])));

const semanticCategoryByWordId = new Map([
  ["gakusei", "person"],
  ["sensei", "person"],
  ["namae", "person"],
  ["sakura", "person"],
  ["yuki", "person"],
  ["tanaka", "person"],
  ["tomodachi", "person"],
  ["isha", "person"],
  ["kazoku", "person"],
  ["haha", "person"],
  ["chichi", "person"],
  ["ane", "person"],
  ["otouto", "person"],
  ["kodomo", "person"],
  ["otona", "person"],
  ["otokonohito", "person"],
  ["onnanohito", "person"],
  ["neko", "animal"],
  ["inu", "animal"],
  ["doubutsu", "animal"],
  ["ie", "place"],
  ["gakkou", "place"],
  ["basho", "place"],
  ["mise", "place"],
  ["byouin", "place"],
  ["eki", "place"],
  ["kaisha", "place"],
  ["heya", "place"],
  ["hon", "object"],
  ["shashin", "object"],
  ["kaban", "object"],
  ["isu", "object"],
  ["tsukue", "object"],
]);

const broadCategoryWordIds = new Map([
  ["namae", "person"],
  ["doubutsu", "animal"],
  ["basho", "place"],
]);

const problems = [];

for (const unitId of unitsToAudit) {
  const unit = await readAuthoredUnit(unitId);
  const pools = vocabularyPoolsForUnit(source, unitId);
  const wordCounts = wordAppearanceCounts(unit);
  const unitProblems = [];

  checkDistribution(unit, pools, wordCounts, unitProblems);
  checkDuplicates(unit, unitProblems);
  checkCardShapes(unit, unitProblems);
  checkSemanticSmellCards(unit, pools, unitProblems);

  if (unitProblems.length > 0) {
    problems.push({ unit, unitProblems });
  }
}

if (problems.length === 0) {
  console.log("Foundation semantic audit passed.");
} else {
  for (const { unit, unitProblems } of problems) {
    console.warn(`FAIL unit ${unit.id}: ${unit.title}`);
    for (const problem of unitProblems.slice(0, maxExamples)) {
      console.warn(`  - ${problem}`);
    }
    if (unitProblems.length > maxExamples) {
      console.warn(`  - ${unitProblems.length - maxExamples} more problems hidden; rerun with --verbose.`);
    }
  }
  console.warn(`${problems.reduce((sum, entry) => sum + entry.unitProblems.length, 0)} foundation semantic problem(s).`);
  process.exit(1);
}

function parseUnitRange(value) {
  if (/^\d+-\d+$/.test(value)) {
    const [start, end] = value.split("-").map(Number);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
  return value.split(",").map(Number).filter((unitId) => Number.isInteger(unitId) && unitId > 0);
}

function checkDistribution(unit, pools, wordCounts, unitProblems) {
  for (const word of pools.current) {
    const count = wordCounts.get(word.id) ?? 0;
    if (count < 8 || count > 12) {
      unitProblems.push(`current word ${word.id} appears ${count} times; expected 8-12`);
    }
  }

  for (const word of pools.reviewDue) {
    const count = wordCounts.get(word.id) ?? 0;
    if (count < 5 || count > 8) {
      unitProblems.push(`review-due word ${word.id} appears ${count} times; expected 5-8`);
    }
  }
}

function checkDuplicates(unit, unitProblems) {
  const byJapanese = repeatedBy(unit.cards, (card) => card.line.join(""));
  const byEnglish = repeatedBy(unit.cards, (card) => card.english);
  const bySignature = repeatedBy(unit.cards, cardSignature);

  for (const [text, positions] of byJapanese) {
    unitProblems.push(`duplicate Japanese cards at ${positions.join(", ")}: ${text}`);
  }
  for (const [text, positions] of byEnglish) {
    unitProblems.push(`duplicate English cards at ${positions.join(", ")}: ${text}`);
  }
  for (const [text, positions] of bySignature) {
    unitProblems.push(`duplicate exact token signatures at ${positions.join(", ")}: ${text}`);
  }
}

function checkCardShapes(unit, unitProblems) {
  const shapeCounts = repeatedBy(unit.cards, cardShape).filter(([, positions]) => positions.length >= 12);
  for (const [shape, positions] of shapeCounts) {
    unitProblems.push(`overused card shape ${positions.length} times: ${shape}`);
  }

  for (const run of consecutiveRuns(unit.cards, (card) => (card.grammarTags ?? []).join("+"))) {
    if (run.length >= 6) {
      unitProblems.push(`clustered grammar run cards ${run.start}-${run.end}: ${run.key}`);
    }
  }
}

function checkSemanticSmellCards(unit, pools, unitProblems) {
  const currentWordIds = new Set(pools.current.map((word) => word.id));
  const seenCurrentWordIds = new Set();

  for (const [cardIndex, card] of unit.cards.entries()) {
    const cardNumber = cardIndex + 1;
    const ids = cardWordIds(card);
    const firstTimeCurrent = [...new Set(ids.filter((id) => currentWordIds.has(id) && !seenCurrentWordIds.has(id)))];

    if (firstTimeCurrent.length > 1 && cardNumber <= 40) {
      unitProblems.push(formatCard(cardNumber, card, `early card introduces multiple current words: ${firstTimeCurrent.join(", ")}`));
    }

    for (const id of ids) {
      if (currentWordIds.has(id)) seenCurrentWordIds.add(id);
    }

    const broadCategoryMatch = /^(.*) is (not )?a (person|place|thing|object|animal)$/i.exec(card.english ?? "");
    if (broadCategoryMatch) {
      unitProblems.push(formatCard(cardNumber, card, "broad category sentence needs human review"));
    }

    if (/\b(person|place|thing|object|animal) or\b/i.test(card.english ?? "") || /\bor (a |an |the )?(person|place|thing|object|animal)\??$/i.test(card.english ?? "")) {
      unitProblems.push(formatCard(cardNumber, card, "broad category choice needs human review"));
    }

    if (/\bnot\b/i.test(card.english ?? "")) {
      const broadWordId = ids.find((id) => broadCategoryWordIds.has(id));
      const otherWordId = ids.find((id) => id !== broadWordId && semanticCategoryByWordId.get(id) === broadCategoryWordIds.get(broadWordId));
      if (broadWordId && otherWordId) {
        unitProblems.push(formatCard(cardNumber, card, `possible false negative category: ${otherWordId} is a ${broadCategoryWordIds.get(broadWordId)}`));
      }
    }
  }
}

function repeatedBy(cards, toKey) {
  const byKey = new Map();
  for (const [index, card] of cards.entries()) {
    const key = toKey(card);
    byKey.set(key, [...(byKey.get(key) ?? []), index + 1]);
  }
  return [...byKey.entries()].filter(([, positions]) => positions.length > 1);
}

function consecutiveRuns(cards, toKey) {
  const runs = [];
  let key = null;
  let start = 0;
  let length = 0;

  for (const [index, card] of cards.entries()) {
    const nextKey = toKey(card);
    if (nextKey === key) {
      length += 1;
    } else {
      if (key !== null) runs.push({ key, start: start + 1, end: index, length });
      key = nextKey;
      start = index;
      length = 1;
    }
  }

  if (key !== null) runs.push({ key, start: start + 1, end: cards.length, length });
  return runs;
}

function cardSignature(card) {
  return (card.tokens ?? []).map((token) => token.wordId ? `$${token.wordId}` : token.surface).join("|");
}

function cardShape(card) {
  return (card.tokens ?? []).map((token) => {
    if (!token.wordId) return token.surface;
    return `$${wordById.get(token.wordId)?.function ?? "word"}`;
  }).join("|");
}

function cardWordIds(card) {
  return (card.tokens ?? []).map((token) => token.wordId).filter(Boolean);
}

function formatCard(cardNumber, card, message) {
  return `card ${cardNumber} ${card.id}: ${message}: ${card.line.join("")} => ${card.english}`;
}
