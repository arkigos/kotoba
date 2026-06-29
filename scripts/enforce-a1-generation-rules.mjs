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

const introTag = "a1 current vocabulary intro";
const reviewTag = "a1 review vocabulary intro";
const generatedTags = new Set([introTag, reviewTag, "review vocabulary"]);

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

const g = {
  desu: () => grammar("です", "です", "polite identity marker"),
  deshita: () => grammar("でした", "でした", "polite past identity marker"),
  arimasu: () => grammar("あります", "あります", "exists; there is"),
  imasu: () => grammar("います", "います", "exists for living things; there is"),
  ka: () => grammar("か", "か", "question marker"),
};

function splitQuestionPart(part) {
  if (part.surface === "ですか") return [g.desu(), g.ka()];
  if (part.surface === "でしたか") return [g.deshita(), g.ka()];
  if (part.surface === "ありますか") return [g.arimasu(), g.ka()];
  if (part.surface === "いますか") return [g.imasu(), g.ka()];
  return [part];
}

function normalizeCard(card) {
  const parts = (card.tokens?.length ? card.tokens : card.line.map((surface, index) => ({
    surface,
    reading: card.tts[index],
    explain: card.explain[index],
  }))).flatMap(splitQuestionPart);

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
    .replace(/\bThat one near you are\b/g, "That one near you is")
    .replace(/\bThat near you are\b/g, "That near you is")
    .replace(/\bThat ([^,.?!]+?) near you are\b/g, "That $1 near you is")
    .replace(/\bThat ([^,.?!]+?) near you were\b/g, "That $1 near you was")
    .replace(/\bWhose friend is you\?/g, "Whose friend are you?")
    .replace(/^there near you\b/, "There near you");
}

function vocabularyCard(unitId, index, word, tag) {
  const part = token(word);
  return {
    id: `u${padUnit(unitId)}-c${String(index).padStart(3, "0")}`,
    line: [part.surface],
    tts: [part.reading],
    explain: [part.explain],
    tokens: [part],
    english: vocabularyEnglish(word),
    fact: tag === introTag
      ? "A quick vocabulary landing card before the sentence frame starts."
      : "A quick review card keeps older vocabulary active before mixed practice.",
    grammarTags: [tag],
  };
}

function vocabularyEnglish(word) {
  const meaning = word.meaning.split(";")[0];
  if (word.function === "quantity") return meaning.replace(/\s+things?$/i, "");
  return meaning;
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

function firstGrammarTagPositions(cards) {
  const positions = new Map();
  for (const [cardIndex, card] of cards.entries()) {
    for (const tag of card.grammarTags ?? []) {
      if (!positions.has(tag)) positions.set(tag, cardIndex + 1);
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

const source = await readUnitSpecs();
const unitSpecs = unitSpecById(source);
const index = await readUnitIndex();
const pacing = await readPacingRules();
const previewTag = "early masu action preview";

let changed = 0;

for (const entry of index.units.filter((unit) => unit.id >= 6 && unit.id <= 20)) {
  const spec = unitSpecs.get(entry.id);
  if (!spec) continue;

  const unit = JSON.parse(await fs.readFile(path.join(root, entry.path), "utf8"));
  const baseCards = unit.cards
    .filter((card) => !(card.grammarTags ?? []).some((tag) => generatedTags.has(tag)))
    .map(normalizeCard);

  const currentIntroCards = spec.newWords.map((word, index) => vocabularyCard(entry.id, index + 1, word, introTag));
  let cards = [...currentIntroCards, ...baseCards];

  const dueWords = wordsForUnits(source, reviewVocabularyUnitIds(entry.id));
  const dueIntroCards = dueWords
    .map((word, index) => vocabularyCard(entry.id, index + 1, word, reviewTag));

  if (dueIntroCards.length > 0) {
    const insertAt = Math.min(10, cards.length);
    cards = [...cards.slice(0, insertAt), ...dueIntroCards, ...cards.slice(insertAt)];
  }

  const previewCards = cards.filter((card) => (card.grammarTags ?? []).includes(previewTag));
  if (previewCards.length > 0) {
    cards = cards.filter((card) => !(card.grammarTags ?? []).includes(previewTag));
    const insertAt = Math.min(10 + dueIntroCards.length, cards.length);
    cards = [...cards.slice(0, insertAt), ...previewCards, ...cards.slice(insertAt)];
  }

  const firstTags = firstGrammarTagPositions(cards);
  const coveredLateTags = new Set();
  const grammarIntroCards = [];
  for (const card of cards) {
    const lateTags = (card.grammarTags ?? []).filter((tag) => {
      if (tag === previewTag) return false;
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
    const insertAt = Math.min(10 + dueIntroCards.length, cards.length);
    cards = [...cards.slice(0, insertAt), ...grammarIntroCards, ...cards.slice(insertAt)];
  }

  cards = reindex(entry.id, cards);
  if (cards.length > 150) {
    throw new Error(`Unit ${entry.id} has ${cards.length} cards after A1 rule enforcement`);
  }

  await writeJson(entry.path, { ...unit, cards });
  changed += 1;
}

console.log(`Enforced A1 generation rules on ${changed} units.`);
