import fs from "node:fs/promises";
import path from "node:path";
import {
  padUnit,
  readPacingRules,
  readUnitIndex,
  readUnitSpecs,
  reviewVocabularyUnitIds,
  root,
  unitSpecById,
  wordsForUnits,
} from "./lib/curriculum-model.mjs";

const introTag = "a2 current vocabulary intro";
const reviewIntroTag = "a2 review vocabulary intro";
const generatedTags = new Set([introTag, reviewIntroTag]);

const jp = {
  ka: "\u304b",
  desu: "\u3067\u3059",
  deshita: "\u3067\u3057\u305f",
  arimasu: "\u3042\u308a\u307e\u3059",
  imasu: "\u3044\u307e\u3059",
  question: "\uff1f",
};

const questionSuffixSplits = [
  ["\u3042\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u304b", "\u3042\u308a\u307e\u305b\u3093\u3067\u3057\u305f"],
  ["\u3042\u308a\u307e\u305b\u3093\u304b", "\u3042\u308a\u307e\u305b\u3093"],
  ["\u3042\u308a\u307e\u3059\u304b", jp.arimasu],
  ["\u3044\u307e\u305b\u3093\u3067\u3057\u305f\u304b", "\u3044\u307e\u305b\u3093\u3067\u3057\u305f"],
  ["\u3044\u307e\u305b\u3093\u304b", "\u3044\u307e\u305b\u3093"],
  ["\u3044\u307e\u3059\u304b", jp.imasu],
  ["\u307e\u305b\u3093\u3067\u3057\u305f\u304b", "\u307e\u305b\u3093\u3067\u3057\u305f"],
  ["\u307e\u3057\u305f\u304b", "\u307e\u3057\u305f"],
  ["\u307e\u305b\u3093\u304b", "\u307e\u305b\u3093"],
  ["\u307e\u3057\u3087\u3046\u304b", "\u307e\u3057\u3087\u3046"],
  ["\u307e\u3059\u304b", "\u307e\u3059"],
  ["\u3067\u3057\u305f\u304b", jp.deshita],
  ["\u3067\u3059\u304b", jp.desu],
];

function token(word) {
  return {
    surface: word.surface,
    reading: word.reading,
    explain: word.meaning,
    wordId: word.id,
  };
}

function grammar(surface, reading, explain) {
  return { surface, reading, explain };
}

function kaToken() {
  return grammar(jp.ka, jp.ka, "question marker");
}

function partFromCard(card, index) {
  return {
    surface: card.line[index],
    reading: card.tts[index],
    explain: card.explain[index],
  };
}

function splitQuestionPart(part) {
  if (part.surface === jp.question || part.surface === jp.ka) return [part];

  for (const [suffix, base] of questionSuffixSplits) {
    if (!part.surface?.endsWith(suffix) || !part.reading?.endsWith(suffix)) continue;

    const surfaceStem = part.surface.slice(0, part.surface.length - suffix.length);
    const readingStem = part.reading.slice(0, part.reading.length - suffix.length);
    return [
      {
        ...part,
        surface: `${surfaceStem}${base}`,
        reading: `${readingStem}${base}`,
      },
      kaToken(),
    ];
  }

  return [part];
}

function normalizeCard(card) {
  const sourceParts = card.tokens?.length
    ? card.tokens
    : card.line.map((_surface, index) => partFromCard(card, index));
  const parts = sourceParts.flatMap(splitQuestionPart);

  return {
    ...card,
    english: cleanEnglish(card.english),
    line: parts.map((part) => part.surface),
    tts: parts.map((part) => part.reading),
    explain: parts.map((part) => part.explain),
    tokens: parts,
  };
}

function cleanEnglish(value) {
  return value
    .replace(/\bI return tomorrow at night\b/g, "I return tomorrow night")
    .replace(/\bthe Japanese language\b/g, "Japanese");
}

function vocabularyEnglish(word) {
  const meaning = word.meaning.split(";")[0];
  if (word.function === "quantity") return meaning.replace(/\s+things?$/i, "");
  return meaning;
}

function vocabularyCard(unitId, index, words, tag) {
  const parts = words.map(token);
  return {
    id: `u${padUnit(unitId)}-c${String(index).padStart(3, "0")}`,
    line: parts.map((part) => part.surface),
    tts: parts.map((part) => part.reading),
    explain: parts.map((part) => part.explain),
    tokens: parts,
    english: words.map(vocabularyEnglish).join(" / "),
    fact: "A quick vocabulary landing card before the sentence frame starts.",
    grammarTags: [tag],
  };
}

function firstGrammarTagPositions(cards) {
  const positions = new Map();
  for (const [cardIndex, card] of cards.entries()) {
    for (const tag of card.grammarTags ?? []) {
      if (!positions.has(tag)) positions.set(tag, cardIndex + 1);
    }
  }
  return positions;
}

function firstWordPositions(cards) {
  const positions = new Map();
  for (const [cardIndex, card] of cards.entries()) {
    for (const part of card.tokens ?? []) {
      if (part.wordId && !positions.has(part.wordId)) positions.set(part.wordId, cardIndex + 1);
    }
  }
  return positions;
}

function reindex(unitId, cards) {
  return cards.map((card, index) => ({
    ...card,
    id: `u${padUnit(unitId)}-c${String(index + 1).padStart(3, "0")}`,
  }));
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function assertPacing(unitId, cards, currentWords, dueWords, pacing) {
  const firstWords = firstWordPositions(cards);
  for (const word of currentWords) {
    const firstSeen = firstWords.get(word.id);
    if (!firstSeen || firstSeen > pacing.cutoffs.currentWordFirstSeenBy) {
      throw new Error(`Unit ${unitId}: current word ${word.id} first appears at ${firstSeen ?? "never"}`);
    }
  }

  for (const word of dueWords) {
    const firstSeen = firstWords.get(word.id);
    if (!firstSeen) {
      throw new Error(`Unit ${unitId}: review word ${word.id} first appears at ${firstSeen ?? "never"}`);
    }
  }
}

const source = await readUnitSpecs();
const unitSpecs = unitSpecById(source);
const index = await readUnitIndex();
const pacing = await readPacingRules();

let changed = 0;

for (const entry of index.units.filter((unit) => unit.id >= 21 && unit.id <= 44)) {
  const spec = unitSpecs.get(entry.id);
  if (!spec) continue;

  const unit = JSON.parse(await fs.readFile(path.join(root, entry.path), "utf8"));
  const baseCards = unit.cards
    .filter((card) => !(card.grammarTags ?? []).some((tag) => generatedTags.has(tag)))
    .map(normalizeCard);

  const currentIntroCards = spec.newWords.map((word, index) => vocabularyCard(entry.id, index + 1, [word], introTag));
  const dueWords = wordsForUnits(source, reviewVocabularyUnitIds(entry.id));
  let cards = [...currentIntroCards, ...baseCards];

  const firstTags = firstGrammarTagPositions(cards);
  const coveredLateTags = new Set();
  const grammarIntroCards = [];
  for (const card of cards) {
    const lateTags = (card.grammarTags ?? []).filter((tag) => {
      const firstSeen = firstTags.get(tag);
      return firstSeen && firstSeen > pacing.cutoffs.grammarFocusFirstSeenBy && !coveredLateTags.has(tag);
    });
    if (lateTags.length === 0) continue;

    grammarIntroCards.push({
      ...card,
      fact: `${card.fact} This card is previewed early so the unit's grammar focus appears before mixed practice.`,
    });
    for (const tag of card.grammarTags ?? []) coveredLateTags.add(tag);
  }

  if (grammarIntroCards.length > 0) {
    const insertAt = Math.min(currentIntroCards.length, cards.length);
    cards = [...cards.slice(0, insertAt), ...grammarIntroCards, ...cards.slice(insertAt)];
  }

  cards = reindex(entry.id, cards).map(normalizeCard);
  if (cards.length > 150) {
    throw new Error(`Unit ${entry.id} has ${cards.length} cards after A2 rule enforcement`);
  }

  assertPacing(entry.id, cards, spec.newWords, dueWords, pacing);
  await writeJson(entry.path, { ...unit, cards });
  changed += 1;
}

console.log(`Enforced A2 generation rules on ${changed} units.`);
