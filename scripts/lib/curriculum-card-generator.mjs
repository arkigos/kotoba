import { cardBandForPosition, vocabularyPoolsForUnit } from "./curriculum-model.mjs";

const grammar = {
  desu: { surface: "です", reading: "です", explain: "polite identity marker" },
  wa: { surface: "は", reading: "わ", explain: "topic marker" },
  ka: { surface: "か", reading: "か", explain: "or; question marker" },
  to: { surface: "と", reading: "と", explain: "and" },
  question: { surface: "？", reading: "？", explain: "question mark" },
};

function token(word) {
  return {
    surface: word.surface,
    reading: word.reading,
    explain: word.meaning,
    wordId: word.id,
  };
}

function card(id, parts, english, grammarTags, meta) {
  return {
    id,
    line: parts.map((part) => part.surface),
    tts: parts.map((part) => part.reading),
    explain: parts.map((part) => part.explain),
    tokens: parts,
    english,
    fact: meta.fact,
    grammarTags,
    meta,
  };
}

function choose(items, seed) {
  if (items.length === 0) throw new Error("Cannot choose from an empty list");
  return items[Math.abs(seed) % items.length];
}

function nounish(words) {
  return words.filter((word) => ["noun", "person", "place", "time", "demonstrative", "determiner", "question"].includes(word.function));
}

function meaning(word) {
  return word.meaning.split(";")[0];
}

function wordById(words, id) {
  return words.find((word) => word.id === id);
}

function existingWords(words, ids) {
  return ids.map((id) => wordById(words, id)).filter(Boolean);
}

function indefinite(value) {
  if (/^(I|me|you|he|him|she|her|Japan|America)$/i.test(value)) return value;
  return /^[aeiou]/i.test(value) ? `an ${value}` : `a ${value}`;
}

function complementLabel(word) {
  if (word.id === "watashi") return "me";
  if (word.id === "sakura") return "you";
  if (word.id === "yuki") return "him";
  if (word.id === "tanaka") return "her";
  return indefinite(meaning(word));
}

function subjectLabel(word) {
  if (word.id === "watashi") return "I";
  if (word.id === "sakura") return "you";
  if (word.id === "yuki") return "he";
  if (word.id === "tanaka") return "she";
  if (/^(Japan|America)$/i.test(meaning(word))) return meaning(word);
  return `the ${meaning(word)}`;
}

function presentQuestion(subject, complement) {
  if (subject.id === "watashi") return `Am I ${complement}?`;
  if (subject.id === "sakura") return `Are you ${complement}?`;
  return `Is ${subjectLabel(subject)} ${complement}?`;
}

function presentClause(subject, complement) {
  if (subject.id === "watashi") return `I am ${complement}`;
  if (subject.id === "sakura") return `You are ${complement}`;
  return `${subjectLabel(subject).replace(/^./, (letter) => letter.toUpperCase())} is ${complement}`;
}

function optionLabel(word) {
  return complementLabel(word);
}

function unit2ChoiceFrames(words) {
  const frames = [
    ["doubutsu", ["neko", "inu"]],
    ["basho", ["nihon", "amerika"]],
    ["hito", ["sensei", "isha"]],
    ["sakura", ["gakusei", "sensei"]],
    ["yuki", ["gakusei", "tomodachi"]],
    ["tanaka", ["sensei", "isha"]],
    ["tomodachi", ["gakusei", "sensei"]],
    ["basho", ["ie", "gakkou"]],
    ["isha", ["sensei", "gakusei"]],
    ["doubutsu", ["inu", "neko"]],
  ];

  return frames
    .map(([subjectId, optionIds]) => ({
      subject: wordById(words, subjectId),
      options: existingWords(words, optionIds),
    }))
    .filter((frame) => frame.subject && frame.options.length >= 2);
}

function compatibleChoiceFrame(words, seed) {
  const unit2Frames = unit2ChoiceFrames(words);
  if (unit2Frames.length > 0) return choose(unit2Frames, seed);

  const byFunction = new Map();
  for (const word of words) {
    const key = word.function;
    byFunction.set(key, [...(byFunction.get(key) ?? []), word]);
  }

  const usableGroups = [...byFunction.values()].filter((group) => group.length >= 3);
  if (usableGroups.length === 0) {
    const fallback = nounish(words);
    return { subject: choose(fallback, seed), options: [choose(fallback, seed + 1), choose(fallback, seed + 2)] };
  }

  const group = choose(usableGroups, seed);
  const subject = choose(group, seed + 3);
  const options = group.filter((word) => word.id !== subject.id);
  return { subject, options: [choose(options, seed + 5), choose(options, seed + 7)] };
}

function compatibleCompoundFrame(words, seed) {
  const groups = [
    { ids: ["neko", "inu"], categoryId: "doubutsu", english: "animals" },
    { ids: ["sensei", "gakusei", "isha", "hito", "tomodachi"], categoryId: "hito", english: "people" },
    { ids: ["ie", "gakkou"], categoryId: "basho", english: "places" },
    { ids: ["nihon", "amerika"], categoryId: "basho", english: "places" },
    { ids: ["hon", "mono"], categoryId: "mono", english: "things" },
  ]
    .map((group) => ({
      words: existingWords(words, group.ids),
      category: wordById(words, group.categoryId),
      english: group.english,
    }))
    .filter((group) => group.words.length >= 2 && group.category);

  if (groups.length > 0) {
    const group = choose(groups, seed);
    const first = choose(group.words, seed + 1);
    const second = choose(group.words.filter((word) => word.id !== first.id), seed + 2);
    return { first, second, category: group.category, categoryEnglish: group.english };
  }

  const fallback = nounish(words);
  const first = choose(fallback, seed);
  const second = choose(fallback.filter((word) => word.id !== first.id), seed + 1);
  const category = choose(fallback.filter((word) => word.id !== first.id && word.id !== second.id), seed + 2);
  return { first, second, category, categoryEnglish: meaning(category) };
}

export function generateCardCandidate({ source, pacing, unitId, cardNumber, variant = 0 }) {
  const unit = source.units.find((entry) => entry.id === unitId);
  if (!unit) throw new Error(`Unknown unit ${unitId}`);

  const band = cardBandForPosition(pacing, cardNumber);
  if (!band) throw new Error(`Card ${cardNumber} is outside configured pacing bands`);

  const pools = vocabularyPoolsForUnit(source, unitId);
  const current = nounish(pools.current);
  const helpers = nounish(pools.helpers);
  const due = nounish(pools.reviewDue);
  const seed = unitId * 997 + cardNumber * 37 + variant * 101;

  if (band.id === "new-vocab-introduction") {
    const word = choose(current, seed);
    return card(
      `u${String(unitId).padStart(3, "0")}-c${String(cardNumber).padStart(3, "0")}-v${variant}`,
      [token(word)],
      meaning(word),
      ["generated", "vocabulary introduction"],
      { band: band.id, introducedWordIds: [word.id], fact: "Current-unit vocabulary is introduced before the unit leans on heavier mixing." },
    );
  }

  if (band.id === "new-vocab-drill") {
    const subject = choose(current, seed);
    const comment = choose(current.filter((word) => word.id !== subject.id), seed + 11);
    return card(
      `u${String(unitId).padStart(3, "0")}-c${String(cardNumber).padStart(3, "0")}-v${variant}`,
      [token(subject), grammar.wa, token(comment), grammar.desu],
      presentClause(subject, complementLabel(comment)),
      ["generated", "current vocabulary drill"],
      { band: band.id, introducedWordIds: [], fact: "`は` marks what the sentence is about, and `です` gives the comment." },
    );
  }

  if (band.id === "new-grammar-drill") {
    const frame = compatibleChoiceFrame([...helpers, ...current], seed);
    const subject = frame.subject;
    const [optionA, optionB] = frame.options;
    return card(
      `u${String(unitId).padStart(3, "0")}-c${String(cardNumber).padStart(3, "0")}-v${variant}`,
      [token(subject), grammar.wa, token(optionA), grammar.ka, token(optionB), grammar.desu, grammar.ka, grammar.question],
      presentQuestion(subject, `${optionLabel(optionA)} or ${optionLabel(optionB)}`),
      ["generated", unit.grammarFocus],
      { band: band.id, introducedWordIds: [], fact: "The unit grammar focus appears after the vocabulary landing zone and before the cutoff." },
    );
  }

  const reviewPool = due.length > 0 ? due : helpers;
  const frame = compatibleCompoundFrame([...reviewPool, ...current, ...helpers], seed);
  return card(
    `u${String(unitId).padStart(3, "0")}-c${String(cardNumber).padStart(3, "0")}-v${variant}`,
    [token(frame.first), grammar.to, token(frame.second), grammar.wa, token(frame.category), grammar.desu],
    `${subjectLabel(frame.first)} and ${subjectLabel(frame.second)} are ${frame.categoryEnglish}`,
    ["generated", "review and mix"],
    { band: band.id, introducedWordIds: [], fact: "`と` joins two nouns before the sentence gives one shared comment." },
  );
}
