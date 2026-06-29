import fs from "node:fs/promises";
import path from "node:path";
import { root, readJson } from "./lib/curriculum-model.mjs";

function pad(value) {
  return String(value).padStart(3, "0");
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function grammar(surface, reading, explain) {
  return { surface, reading, explain };
}

const g = {
  desu: () => grammar("です", "です", "polite identity marker"),
  ka: () => grammar("か", "か", "question marker"),
  q: () => grammar("？", "？", "question mark"),
  wa: () => grammar("は", "わ", "topic marker"),
  to: () => grammar("と", "と", "and"),
  no: () => grammar("の", "の", "possession or description marker"),
  mo: () => grammar("も", "も", "also; too"),
  deshita: () => grammar("でした", "でした", "was; were; polite past identity"),
  dewaArimasen: () => grammar("ではありません", "でわありません", "is not; polite negative identity"),
  jaArimasen: () => grammar("じゃありません", "じゃありません", "is not; contracted polite negative identity"),
  dewaArimasenDeshita: () => grammar("ではありませんでした", "でわありませんでした", "was not; polite past negative identity"),
};

const properIds = new Set(["nihon", "amerika"]);
const pronounIds = new Set(["watashi", "sakura", "yuki", "tanaka"]);
const pluralMeanings = new Map([
  ["neko", "cats"],
  ["inu", "dogs"],
  ["doubutsu", "animals"],
  ["hito", "people"],
]);

function bareMeaning(word) {
  return word.meaning.split(";")[0];
}

function indefinite(word) {
  const meaning = bareMeaning(word);
  if (pronounIds.has(word.id)) return meaning;
  if (properIds.has(word.id)) return meaning;
  return /^[aeiou]/i.test(meaning) ? `an ${meaning}` : `a ${meaning}`;
}

function identityComplement(word) {
  if (word.id === "watashi") return "me";
  if (word.id === "sakura") return "you";
  if (word.id === "yuki") return "him";
  if (word.id === "tanaka") return "her";
  return indefinite(word);
}

function subject(word) {
  const meaning = bareMeaning(word);
  if (word.id === "watashi") return "I";
  if (word.id === "sakura") return "you";
  if (word.id === "yuki") return "he";
  if (word.id === "tanaka") return "she";
  if (properIds.has(word.id)) return meaning;
  return `the ${meaning}`;
}

function sentenceStart(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function presentClause(word, complement) {
  if (word.id === "sakura") return `You are ${complement}`;
  return word.id === "watashi" ? `I am ${complement}` : `${sentenceStart(subject(word))} is ${complement}`;
}

function presentQuestion(word, complement) {
  if (word.id === "sakura") return `Are you ${complement}?`;
  return word.id === "watashi" ? `Am I ${complement}?` : `Is ${subject(word)} ${complement}?`;
}

function negativeClause(word, complement) {
  if (word.id === "sakura") return `You are not ${complement}`;
  return word.id === "watashi" ? `I am not ${complement}` : `${sentenceStart(subject(word))} is not ${complement}`;
}

function pastClause(word, complement) {
  if (word.id === "sakura") return `You were ${complement}`;
  return word.id === "watashi" ? `I was ${complement}` : `${sentenceStart(subject(word))} was ${complement}`;
}

function pastNegativeClause(word, complement) {
  if (word.id === "sakura") return `You were not ${complement}`;
  return word.id === "watashi" ? `I was not ${complement}` : `${sentenceStart(subject(word))} was not ${complement}`;
}

function plural(word) {
  return pluralMeanings.get(word.id) ?? `${bareMeaning(word)}s`;
}

function possessive(owner) {
  if (owner.id === "watashi") return "my";
  if (owner.id === "sakura") return "your";
  if (owner.id === "yuki") return "his";
  if (owner.id === "tanaka") return "her";
  return `the ${bareMeaning(owner)}'s`;
}

function token(word) {
  return {
    surface: word.surface,
    reading: word.reading,
    explain: word.meaning,
    wordId: word.id,
  };
}

function makeCard(unitId, index, parts, english, fact, grammarTags) {
  return {
    id: `u${pad(unitId)}-c${pad(index)}`,
    line: parts.map((part) => part.surface),
    tts: parts.map((part) => part.reading),
    explain: parts.map((part) => part.explain),
    tokens: parts,
    english: english.replace(/\.+$/, ""),
    fact,
    grammarTags,
  };
}

function cycle(items, count) {
  return Array.from({ length: count }, (_, index) => items[index % items.length]);
}

function byId(words) {
  return new Map(words.map((word) => [word.id, word]));
}

function w(words, id) {
  const word = words.get(id);
  if (!word) throw new Error(`Missing word ${id}`);
  return word;
}

function add(cards, unitId, parts, english, fact, grammarTags) {
  cards.push(makeCard(unitId, cards.length + 1, parts, english, fact, grammarTags));
}

function vocabIntro(cards, unitId, word) {
  add(cards, unitId, [token(word)], bareMeaning(word), "New vocabulary appears by itself before sentence context.", ["vocabulary introduction"]);
}

function grammarIntro(cards, unitId, part, english, fact) {
  add(cards, unitId, [part], english, fact, ["grammar introduction"]);
}

function identity(cards, unitId, word, fact = "New vocabulary lands first in a familiar identity sentence.") {
  add(cards, unitId, [token(word), g.desu()], `It's ${identityComplement(word)}`, fact, ["Aです"]);
}

function identityQuestion(cards, unitId, word, fact = "`か` turns the identity sentence into a question.") {
  add(cards, unitId, [token(word), g.desu(), g.ka(), g.q()], `Is it ${identityComplement(word)}?`, fact, ["Aです", "か"]);
}

function topic(cards, unitId, left, right, fact, tags = ["AはBです"]) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.desu()], presentClause(left, identityComplement(right)), fact, tags);
}

function topicQuestion(cards, unitId, left, right, fact, tags = ["AはBです", "か"]) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.desu(), g.ka(), g.q()], presentQuestion(left, identityComplement(right)), fact, tags);
}

function choice(cards, unitId, first, second, fact, tags = ["AかBですか"]) {
  add(cards, unitId, [token(first), g.ka(), token(second), g.desu(), g.ka(), g.q()], `Is it ${identityComplement(first)} or ${identityComplement(second)}?`, fact, tags);
}

function topicChoice(cards, unitId, left, first, second, fact, tags = ["AはBかCですか"]) {
  add(cards, unitId, [token(left), g.wa(), token(first), g.ka(), token(second), g.desu(), g.ka(), g.q()], presentQuestion(left, `${identityComplement(first)} or ${identityComplement(second)}`), fact, tags);
}

function compound(cards, unitId, first, second, category, englishCategory, fact, tags = ["AとBはCです"]) {
  add(cards, unitId, [token(first), g.to(), token(second), g.wa(), token(category), g.desu()], `${sentenceStart(subject(first))} and ${subject(second)} are ${englishCategory}`, fact, tags);
}

function negativeIdentity(cards, unitId, word, casual = false) {
  add(
    cards,
    unitId,
    [token(word), casual ? g.jaArimasen() : g.dewaArimasen()],
    `It's not ${identityComplement(word)}`,
    casual ? "`じゃありません` is a contracted polite negative identity phrase." : "`ではありません` works as a polite negative identity phrase here.",
    [casual ? "Aじゃありません" : "Aではありません"],
  );
}

function topicNegative(cards, unitId, left, right, casual = false) {
  add(
    cards,
    unitId,
    [token(left), g.wa(), token(right), casual ? g.jaArimasen() : g.dewaArimasen()],
    negativeClause(left, identityComplement(right)),
    casual ? "`じゃありません` is a shorter polite negative." : "`ではありません` is kept as one early set phrase: polite negative identity.",
    [casual ? "AはBじゃありません" : "AはBではありません"],
  );
}

function pastIdentity(cards, unitId, word) {
  add(cards, unitId, [token(word), g.deshita()], `It was ${identityComplement(word)}`, "`でした` is the polite past form of identity.", ["Aでした"]);
}

function topicPast(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.deshita()], pastClause(left, identityComplement(right)), "A topic can be described in the polite past with `でした`.", ["AはBでした"]);
}

function topicPastNegative(cards, unitId, left, right) {
  add(
    cards,
    unitId,
    [token(left), g.wa(), token(right), g.dewaArimasenDeshita()],
    pastNegativeClause(left, identityComplement(right)),
    "`ではありませんでした` is kept as one early set phrase: polite past negative identity.",
    ["AはBではありませんでした"],
  );
}

function possession(cards, unitId, owner, item) {
  add(cards, unitId, [token(owner), g.no(), token(item), g.desu()], `It's ${possessive(owner)} ${bareMeaning(item)}`, "`の` links a possessor or descriptor to a noun.", ["AのB"]);
}

function also(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.mo(), token(right), g.desu()], presentClause(left, `also ${indefinite(right)}`), "`も` marks that the same comment also applies.", ["AもBです"]);
}

function buildUnit1(spec) {
  const words = byId(spec.newWords);
  const cards = [];
  const vocab = spec.newWords.map((word) => w(words, word.id));

  vocab.forEach((word) => vocabIntro(cards, 1, word));
  grammarIntro(cards, 1, g.desu(), "am; is; are", "`です` is the polite identity marker.");
  grammarIntro(cards, 1, g.wa(), "topic marker", "`は` marks what the sentence is about.");
  grammarIntro(cards, 1, g.ka(), "question marker", "`か` turns the sentence into a question.");

  const subjects = ["watashi", "sakura", "yuki", "tanaka"];
  const roles = ["gakusei", "sensei", "tomodachi"];
  for (const role of roles) {
    for (const subjectId of subjects) {
      topic(cards, 1, w(words, subjectId), w(words, role), "One slot changes while the sentence frame stays fixed.", ["early AはB", "AはBです"]);
    }
  }
  for (const role of roles) {
    for (const subjectId of subjects) {
      topicQuestion(cards, 1, w(words, subjectId), w(words, role), "`です` and `か` stay separate so the question marker is visible.", ["early AはB", "AはBです", "か"]);
    }
  }
  vocab.forEach((word) => identityQuestion(cards, 1, word));

  const topics = [
    ["watashi", "gakusei"],
    ["sakura", "gakusei"],
    ["yuki", "gakusei"],
    ["tanaka", "gakusei"],
    ["watashi", "sensei"],
    ["sakura", "sensei"],
    ["yuki", "sensei"],
    ["tanaka", "sensei"],
    ["watashi", "tomodachi"],
    ["sakura", "tomodachi"],
    ["tanaka", "tomodachi"],
    ["yuki", "tomodachi"],
  ];
  for (const [a, b] of cycle(topics, 33)) topic(cards, 1, w(words, a), w(words, b), "`は` marks the topic for a simple identity comment.", ["early AはB", "AはBです"]);

  return cards;
}

function buildUnit2(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => identity(cards, 2, w(words, word.id)));
  const statements = [
    ["neko", "doubutsu"],
    ["inu", "doubutsu"],
    ["hon", "mono"],
    ["ie", "basho"],
    ["gakkou", "basho"],
    ["isha", "hito"],
    ["sensei", "hito"],
    ["gakusei", "hito"],
    ["nihon", "basho"],
    ["amerika", "basho"],
  ];
  for (const [a, b] of statements) topic(cards, 2, w(words, a), w(words, b), "`は` marks the topic and `です` gives the identity comment.");
  for (const [a, b] of statements) topicQuestion(cards, 2, w(words, a), w(words, b), "`か` is split out as the question marker.");

  const compounds = [
    ["neko", "inu", "doubutsu", "animals"],
    ["sensei", "gakusei", "hito", "people"],
    ["isha", "tomodachi", "hito", "people"],
    ["ie", "gakkou", "basho", "places"],
    ["nihon", "amerika", "basho", "places"],
    ["isha", "sensei", "hito", "people"],
    ["gakusei", "tomodachi", "hito", "people"],
    ["sensei", "tomodachi", "hito", "people"],
    ["gakusei", "isha", "hito", "people"],
    ["gakkou", "ie", "basho", "places"],
  ];
  for (const [a, b, c, en] of compounds) compound(cards, 2, w(words, a), w(words, b), w(words, c), en, "`と` joins two concrete nouns before the topic marker.");

  const choices = [
    ["doubutsu", "neko", "inu"],
    ["basho", "nihon", "amerika"],
    ["hito", "sensei", "isha"],
    ["sakura", "gakusei", "sensei"],
    ["yuki", "gakusei", "tomodachi"],
    ["tanaka", "sensei", "isha"],
    ["tomodachi", "gakusei", "sensei"],
    ["basho", "ie", "gakkou"],
    ["isha", "sensei", "gakusei"],
    ["doubutsu", "inu", "neko"],
  ];
  for (const [a, b, c] of choices) topicChoice(cards, 2, w(words, a), w(words, b), w(words, c), "`か` links the choices; the final `か` asks the question.");

  for (const [a, b, c, en] of cycle(compounds, 20)) {
    compound(cards, 2, w(words, a), w(words, b), w(words, c), en, "`と` joins two nouns before the sentence gives one shared comment.");
  }
  for (const [a, b] of statements) {
    topicQuestion(cards, 2, w(words, a), w(words, b), "`です` gives the comment, and the final `か` makes it a question.", ["AはBです", "か"]);
  }

  return cards;
}

function buildUnit3(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => identity(cards, 3, w(words, word.id)));

  const possessives = [
    ["watashi", "namae"],
    ["watashi", "shashin"],
    ["sakura", "kaban"],
    ["yuki", "kagi"],
    ["tanaka", "kuruma"],
    ["haha", "kaban"],
    ["chichi", "kuruma"],
    ["ane", "heya"],
    ["otouto", "hon"],
    ["sensei", "namae"],
    ["gakusei", "kagi"],
    ["tomodachi", "shashin"],
    ["kazoku", "shashin"],
    ["sakura", "hon"],
    ["yuki", "kaban"],
  ];
  for (const [a, b] of possessives) possession(cards, 3, w(words, a), w(words, b));

  const alsoRows = [
    ["haha", "kazoku"],
    ["chichi", "kazoku"],
    ["ane", "kazoku"],
    ["otouto", "kazoku"],
    ["sakura", "tomodachi"],
    ["yuki", "tomodachi"],
    ["tanaka", "sensei"],
    ["watashi", "gakusei"],
    ["sensei", "hito"],
    ["gakusei", "hito"],
    ["nihon", "basho"],
    ["amerika", "basho"],
    ["neko", "doubutsu"],
    ["inu", "doubutsu"],
    ["hon", "mono"],
  ];
  for (const [a, b] of alsoRows) also(cards, 3, w(words, a), w(words, b));

  const reviewQuestions = [
    ["watashi", "gakusei"],
    ["sakura", "tomodachi"],
    ["yuki", "gakusei"],
    ["tanaka", "sensei"],
    ["nihon", "basho"],
    ["amerika", "basho"],
    ["namae", "sakura"],
    ["tomodachi", "hito"],
    ["sensei", "hito"],
    ["gakusei", "hito"],
  ];
  for (const [a, b] of reviewQuestions) topicQuestion(cards, 3, w(words, a), w(words, b), "`です` and `か` stay separate in questions.", ["SRS review", "AはBです", "か"]);

  for (const [a, b] of cycle(possessives, 30)) possession(cards, 3, w(words, a), w(words, b));
  return cards;
}

function buildUnit4(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => identity(cards, 4, w(words, word.id)));

  const negatives = [
    "mise", "byouin", "eki", "kaisha", "kaishain", "kodomo", "otona", "isu", "tsukue", "jitensha",
  ];
  negatives.forEach((id, index) => negativeIdentity(cards, 4, w(words, id), index % 4 === 3));

  const topicNegatives = [
    ["neko", "inu"],
    ["inu", "neko"],
    ["hon", "doubutsu"],
    ["ie", "gakkou"],
    ["gakkou", "ie"],
    ["isha", "gakusei"],
    ["hito", "mono"],
    ["mono", "hito"],
    ["doubutsu", "hon"],
    ["basho", "hito"],
    ["mise", "byouin"],
    ["byouin", "eki"],
    ["eki", "kaisha"],
    ["kaishain", "kodomo"],
    ["kodomo", "otona"],
    ["isu", "tsukue"],
    ["jitensha", "kuruma"],
    ["sensei", "gakusei"],
    ["sakura", "isha"],
    ["tanaka", "kodomo"],
  ];
  for (const [a, b] of topicNegatives) topicNegative(cards, 4, w(words, a), w(words, b));

  const review = [
    ["neko", "doubutsu"],
    ["inu", "doubutsu"],
    ["hon", "mono"],
    ["ie", "basho"],
    ["gakkou", "basho"],
    ["isha", "hito"],
    ["sensei", "hito"],
    ["gakusei", "hito"],
    ["nihon", "basho"],
    ["amerika", "basho"],
  ];
  for (const [a, b] of review) topic(cards, 4, w(words, a), w(words, b), "`は` keeps the topic clear before the identity comment.", ["SRS review", "AはBです"]);

  for (const [a, b] of cycle(topicNegatives, 30)) topicNegative(cards, 4, w(words, a), w(words, b), true);
  return cards;
}

function buildUnit5(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => identity(cards, 5, w(words, word.id)));

  const pastRows = [
    ["kinou", "yasumi"],
    ["sengetsu", "ryokou"],
    ["kyonen", "shigoto"],
    ["asa", "tesuto"],
    ["yoru", "tanjoubi"],
    ["tanjoubi", "yasumi"],
    ["yasumi", "ryokou"],
    ["ryokou", "shigoto"],
    ["shigoto", "tesuto"],
    ["tesuto", "tanjoubi"],
  ];
  pastRows.forEach(([a, b]) => topicPast(cards, 5, w(words, a), w(words, b)));

  const reviewPossession = [
    ["watashi", "namae"],
    ["watashi", "shashin"],
    ["sakura", "kaban"],
    ["yuki", "kagi"],
    ["tanaka", "kuruma"],
    ["haha", "kaban"],
    ["chichi", "kuruma"],
    ["ane", "heya"],
    ["otouto", "hon"],
    ["sensei", "namae"],
    ["gakusei", "kagi"],
    ["tomodachi", "shashin"],
    ["kazoku", "shashin"],
    ["sakura", "hon"],
    ["yuki", "kaban"],
  ];
  reviewPossession.forEach(([a, b]) => possession(cards, 5, w(words, a), w(words, b)));

  const unit1Review = [
    ["watashi", "gakusei"],
    ["sakura", "tomodachi"],
    ["yuki", "gakusei"],
    ["tanaka", "sensei"],
    ["nihon", "basho"],
    ["amerika", "basho"],
    ["namae", "sakura"],
    ["tomodachi", "hito"],
    ["sensei", "hito"],
    ["gakusei", "hito"],
  ];
  unit1Review.forEach(([a, b]) => topic(cards, 5, w(words, a), w(words, b), "`は` keeps the topic clear before the identity comment.", ["SRS review", "AはBです"]));

  const pastNegatives = [
    ["kinou", "tesuto"],
    ["sengetsu", "yasumi"],
    ["kyonen", "ryokou"],
    ["asa", "shigoto"],
    ["yoru", "tesuto"],
    ["tanjoubi", "shigoto"],
    ["yasumi", "tesuto"],
    ["ryokou", "yasumi"],
    ["shigoto", "tanjoubi"],
    ["tesuto", "ryokou"],
  ];
  pastNegatives.forEach(([a, b]) => topicPastNegative(cards, 5, w(words, a), w(words, b)));

  for (const id of ["kinou", "sengetsu", "kyonen", "asa", "yoru"]) pastIdentity(cards, 5, w(words, id));
  for (const [a, b] of cycle([...pastRows, ...pastNegatives], 20)) topicPast(cards, 5, w(words, a), w(words, b));
  return cards;
}

function assertUnit(unit, expectedCards = 80) {
  if (unit.cards.length !== expectedCards) throw new Error(`unit ${unit.id}: expected ${expectedCards} cards, got ${unit.cards.length}`);
  for (const [index, card] of unit.cards.entries()) {
    if (card.id !== `u${pad(unit.id)}-c${pad(index + 1)}`) throw new Error(`unit ${unit.id}: bad card id ${card.id}`);
    if (card.line.length !== card.tts.length || card.line.length !== card.explain.length || card.line.length !== card.tokens.length) {
      throw new Error(`unit ${unit.id} ${card.id}: alignment mismatch`);
    }
  }
}

const source = await readJson("data/jp/curriculum/source/unit_specs.json");
const specs = new Map(source.units.map((unit) => [unit.id, unit]));
const previousWords = [];

for (let unitId = 1; unitId <= 5; unitId += 1) {
  const existing = await readJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`);
  const spec = specs.get(unitId);
  if (!spec) throw new Error(`Missing source spec for unit ${unitId}`);

  const builders = new Map([
    [1, buildUnit1],
    [2, buildUnit2],
    [3, buildUnit3],
    [4, buildUnit4],
    [5, buildUnit5],
  ]);
  const cards = builders.get(unitId)(spec, previousWords);
  const unit = { ...existing, ...spec, cards };
  assertUnit(unit);
  await writeJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`, unit);
  previousWords.push(...spec.newWords);
}

console.log("Rebuilt foundation units 1-5.");
