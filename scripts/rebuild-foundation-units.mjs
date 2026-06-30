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
  ga: () => grammar("が", "が", "subject marker"),
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
const noArticleIds = new Set(["mizu", "ocha", "tenki", "ame", "yuki_snow", "kaze", "tabemono", "nomimono", "kinou", "sengetsu", "kyonen", "asa", "yoru", "shigoto"]);
const bareSubjectIds = new Set(["kinou", "sengetsu", "kyonen", "asa", "yoru"]);
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
  if (noArticleIds.has(word.id)) return meaning;
  return /^[aeiou]/i.test(meaning) ? `an ${meaning}` : `a ${meaning}`;
}

function identityComplement(word) {
  if (word.id === "watashi") return "me";
  if (word.id === "sakura") return "you";
  if (word.id === "yuki") return "him";
  if (word.id === "tanaka") return "her";
  if (word.id === "haha") return "my mother";
  if (word.id === "chichi") return "my father";
  if (word.id === "ane") return "my older sister";
  if (word.id === "otouto") return "my younger brother";
  return indefinite(word);
}

function subject(word) {
  const meaning = bareMeaning(word);
  if (word.id === "watashi") return "I";
  if (word.id === "sakura") return "you";
  if (word.id === "yuki") return "he";
  if (word.id === "tanaka") return "she";
  if (word.id === "haha") return "my mother";
  if (word.id === "chichi") return "my father";
  if (word.id === "ane") return "my older sister";
  if (word.id === "otouto") return "my younger brother";
  if (bareSubjectIds.has(word.id)) return meaning;
  if (properIds.has(word.id)) return meaning;
  return `the ${meaning}`;
}

function questionSubject(word) {
  if (word.id === "watashi") return "I";
  if (word.id === "sakura") return "you";
  return subject(word);
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

function whoQuestion(word) {
  if (word.id === "watashi") return "Who am I?";
  if (word.id === "sakura") return "Who are you?";
  return `Who is ${questionSubject(word)}?`;
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
  if (owner.id === "nihon") return "Japan's";
  if (owner.id === "amerika") return "America's";
  if (owner.id === "haha") return "my mother's";
  if (owner.id === "chichi") return "my father's";
  if (owner.id === "ane") return "my older sister's";
  if (owner.id === "otouto") return "my younger brother's";
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
  spec.newWords.forEach((word) => identity(cards, 3, w(words, word.id), "One new word lands in an old identity frame before it has to do harder work."));

  const firstReviewReturn = [
    ["watashi", "kazoku"],
    ["gakusei", "shashin"],
    ["sensei", "kaban"],
    ["nihon", "kuruma"],
    ["amerika", "heya"],
    ["kazoku", "namae"],
    ["sakura", "heya"],
    ["yuki", "kagi"],
    ["tanaka", "kuruma"],
    ["tomodachi", "shashin"],
  ];
  for (const [a, b] of firstReviewReturn) possession(cards, 3, w(words, a), w(words, b));

  const oneNewCushionRows = [
    ["hito", "kazoku", "possession"],
    ["haha", "hito"],
    ["chichi", "hito"],
    ["ane", "hito"],
    ["otouto", "hito"],
    ["shashin", "mono"],
    ["kaban", "mono"],
    ["kuruma", "mono"],
    ["heya", "basho"],
    ["kagi", "mono"],
  ];
  for (const [a, b, mode] of oneNewCushionRows) {
    if (mode === "possession") possession(cards, 3, w(words, a), w(words, b));
    else also(cards, 3, w(words, a), w(words, b));
  }

  const oneNewQuestions = [
    ["kazoku", "namae", "possession"],
    ["haha", "hito"],
    ["chichi", "hito"],
    ["ane", "hito"],
    ["otouto", "hito"],
    ["shashin", "mono"],
    ["kaban", "mono"],
    ["kuruma", "mono"],
    ["heya", "basho"],
    ["kagi", "mono"],
  ];
  for (const [a, b, mode] of oneNewQuestions) {
    if (mode === "possession") {
      add(cards, 3, [token(w(words, a)), g.no(), token(w(words, b)), g.desu(), g.ka(), g.q()], `Is it ${possessive(w(words, a))} ${bareMeaning(w(words, b))}?`, "`ã®` stays visible while the final `ã‹` asks the question.", ["Aã®B", "ã‹"]);
    } else {
      topicQuestion(cards, 3, w(words, a), w(words, b), "`ã§ã™` and `ã‹` stay separate in questions.", ["Aã¯Bã§ã™", "ã‹"]);
    }
  }

  const topUpRows = [
    ["gakusei", "kazoku"],
    ["sensei", "kazoku"],
    ["tomodachi", "kazoku"],
    ["watashi", "haha"],
    ["sakura", "haha"],
    ["yuki", "haha"],
    ["haha", "namae"],
    ["isha", "haha"],
    ["watashi", "chichi"],
    ["sakura", "chichi"],
    ["tanaka", "chichi"],
    ["chichi", "namae"],
    ["isha", "chichi"],
    ["watashi", "ane"],
    ["yuki", "ane"],
    ["tanaka", "ane"],
    ["hito", "ane"],
    ["isha", "ane"],
    ["sakura", "otouto"],
    ["yuki", "otouto"],
    ["tanaka", "otouto"],
    ["hito", "otouto"],
    ["isha", "otouto"],
    ["nihon", "shashin"],
    ["amerika", "shashin"],
    ["tomodachi", "shashin"],
    ["gakusei", "kaban"],
    ["sensei", "kaban"],
    ["nihon", "kaban"],
    ["hito", "kaban"],
    ["amerika", "kuruma"],
    ["nihon", "kuruma"],
    ["sensei", "kuruma"],
    ["gakusei", "heya"],
    ["tomodachi", "heya"],
    ["amerika", "heya"],
    ["hito", "kagi"],
    ["isha", "kagi"],
    ["gakkou", "kagi"],
    ["ie", "kagi"],
  ];
  for (const [a, b] of topUpRows) possession(cards, 3, w(words, a), w(words, b));

  return cards;
}


function buildUnit4(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const currentIds = spec.newWords.map((word) => word.id);
  currentIds.forEach((id) => identity(cards, 4, w(words, id)));
  currentIds.forEach((id) => negativeIdentity(cards, 4, w(words, id), true));

  const rowsBySubject = new Map([
    ["mise", ["gakkou", "ie", "basho", "byouin", "eki", "kaisha"]],
    ["byouin", ["gakkou", "ie", "basho", "mise", "eki", "kaisha"]],
    ["eki", ["gakkou", "ie", "basho", "mise", "byouin", "kaisha"]],
    ["kaisha", ["gakkou", "ie", "basho", "mise", "byouin", "eki"]],
    ["kaishain", ["isha", "hito", "gakusei", "sensei", "tomodachi", "kodomo"]],
    ["kodomo", ["isha", "hito", "gakusei", "sensei", "tomodachi", "otona"]],
    ["otona", ["isha", "hito", "gakusei", "sensei", "tomodachi", "kodomo"]],
    ["isu", ["hon", "mono", "neko", "inu", "doubutsu", "tsukue"]],
    ["tsukue", ["hon", "mono", "neko", "inu", "doubutsu", "isu"]],
    ["jitensha", ["hon", "mono", "neko", "inu", "doubutsu", "kuruma"]],
  ]);
  for (const subjectId of currentIds) {
    for (const complementId of rowsBySubject.get(subjectId)) {
      topicNegative(cards, 4, w(words, subjectId), w(words, complementId), true);
    }
  }
  return cards;
}

function buildUnit5(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const currentIds = spec.newWords.map((word) => word.id);
  currentIds.forEach((id) => identity(cards, 5, w(words, id)));
  currentIds.forEach((id) => pastIdentity(cards, 5, w(words, id)));

  const rowsBySubject = new Map([
    ["kinou", ["yasumi", "tesuto", "shigoto", "ryokou", "tanjoubi", "gakusei"]],
    ["sengetsu", ["ryokou", "yasumi", "shigoto", "tesuto", "tanjoubi", "sensei"]],
    ["kyonen", ["shigoto", "ryokou", "yasumi", "tesuto", "tanjoubi", "tomodachi"]],
    ["asa", ["tesuto", "shigoto", "yasumi", "ryokou", "tanjoubi", "haha"]],
    ["yoru", ["tanjoubi", "tesuto", "shigoto", "yasumi", "ryokou", "chichi"]],
    ["tanjoubi", ["yasumi", "ryokou", "shigoto", "tesuto", "kazoku"]],
    ["yasumi", ["ryokou", "tesuto", "shigoto", "tanjoubi", "shashin"]],
    ["ryokou", ["shigoto", "yasumi", "tesuto", "tanjoubi", "kuruma"]],
    ["shigoto", ["tesuto", "tanjoubi", "yasumi", "ryokou", "kagi"]],
    ["tesuto", ["tanjoubi"]],
  ]);
  for (const subjectId of currentIds) {
    const complements = rowsBySubject.get(subjectId);
    complements.slice(0, 4).forEach((complementId) => topicPast(cards, 5, w(words, subjectId), w(words, complementId)));
    complements.slice(4).forEach((complementId) => topicPastNegative(cards, 5, w(words, subjectId), w(words, complementId)));
  }

  const possessivePastRows = [
    ["watashi", "tanjoubi"],
    ["sakura", "yasumi"],
    ["yuki", "ryokou"],
    ["tanaka", "shigoto"],
    ["nihon", "tesuto"],
    ["amerika", "ryokou"],
    ["ane", "namae"],
    ["otouto", "kaban"],
    ["watashi", "heya"],
  ];
  for (const [ownerId, itemId] of possessivePastRows) {
    add(cards, 5, [token(w(words, ownerId)), g.no(), token(w(words, itemId)), g.deshita()], "It was " + possessive(w(words, ownerId)) + " " + bareMeaning(w(words, itemId)), "Possession review returns inside the Unit 5 past frame.", ["AのB", "Aでした"]);
  }
  return cards;
}

function demonstrativeEnglish(id) {
  if (id === "kore" || id === "kono") return "this";
  if (id === "sore" || id === "sono") return "that near you";
  return "that over there";
}

function demonstrativeTopic(cards, unitId, demonstrative, noun) {
  add(cards, unitId, [token(demonstrative), g.wa(), token(noun), g.desu()], sentenceStart(demonstrativeEnglish(demonstrative.id)) + " is " + indefinite(noun), "A demonstrative points at one familiar noun.", ["kore/sore/are", "A wa B desu"]);
}

function determinerIdentity(cards, unitId, determiner, noun) {
  add(cards, unitId, [token(determiner), token(noun), g.desu()], "It is " + demonstrativeEnglish(determiner.id) + " " + bareMeaning(noun), "A determiner sits directly before the noun it points to.", ["kono/sono/ano N"]);
}

function buildUnit6(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const currentIds = spec.newWords.map((word) => word.id);
  currentIds.forEach((id) => vocabIntro(cards, 6, w(words, id)));

  const rowsByWord = new Map([
    ["kore", ["mise", "byouin", "eki", "kaisha", "kaishain", "kodomo", "otona"]],
    ["sore", ["isu", "tsukue", "jitensha", "neko", "inu", "doubutsu", "hon"]],
    ["are", ["ie", "gakkou", "basho", "isha", "hito", "mono", "kaban"]],
    ["kono", ["mise", "byouin", "eki", "kaisha", "mizu", "ocha", "enpitsu"]],
    ["sono", ["isu", "tsukue", "jitensha", "hon", "mizu", "ocha", "tokei"]],
    ["ano", ["ie", "gakkou", "basho", "kaban", "kuruma", "shashin", "tokei"]],
    ["mizu", ["kore", "sore", "are", "kono", "sono", "ano", "kore"]],
    ["ocha", ["kore", "sore", "are", "kono", "sono", "ano", "sore"]],
    ["enpitsu", ["kore", "sore", "are", "kono", "sono", "ano", "are"]],
    ["tokei", ["kore", "sore", "are", "kono", "sono", "ano", "kore"]],
  ]);

  for (const currentId of currentIds) {
    for (const partnerId of rowsByWord.get(currentId)) {
      const current = w(words, currentId);
      const partner = w(words, partnerId);
      if (["kore", "sore", "are"].includes(currentId)) demonstrativeTopic(cards, 6, current, partner);
      else if (["kono", "sono", "ano"].includes(currentId)) determinerIdentity(cards, 6, current, partner);
      else if (["kore", "sore", "are"].includes(partnerId)) demonstrativeTopic(cards, 6, partner, current);
      else determinerIdentity(cards, 6, partner, current);
    }
  }

  return cards;
}

function questionWordCard(cards, unitId, words, questionId, contextId) {
  const context = w(words, contextId);
  const question = w(words, questionId);
  if (questionId === "nan") {
    add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], "What is " + questionSubject(context) + "?", "What asks for the identity of the topic.", ["nan", "A wa B desu ka"]);
  } else if (questionId === "dare") {
    add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], whoQuestion(context), "Who asks for the person behind the topic.", ["dare", "A wa B desu ka"]);
  } else if (questionId === "dore") {
    add(cards, unitId, [token(question), g.ga(), token(context), g.desu(), g.ka(), g.q()], "Which one is " + indefinite(context) + "?", "Which-one questions can point to a concrete known noun.", ["dore", "ka"]);
  }
}

function whichNounCard(cards, unitId, words, determinerId, nounId) {
  add(cards, unitId, [token(w(words, determinerId)), token(w(words, nounId)), g.desu(), g.ka(), g.q()], "Which " + bareMeaning(w(words, nounId)) + " is it?", "Which sits before the noun being asked about.", ["dono N", "ka"]);
}

function buildUnit7(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const currentIds = spec.newWords.map((word) => word.id);
  currentIds.forEach((id) => vocabIntro(cards, 7, w(words, id)));

  const rowsByWord = new Map([
    ["nan", ["kinou", "sengetsu", "kyonen", "asa", "yoru", "tanjoubi", "yasumi"]],
    ["dare", ["watashi", "sakura", "yuki", "tanaka", "haha", "chichi", "ane"]],
    ["dore", ["shashin", "kaban", "kuruma", "heya", "kagi", "hon", "tesuto"]],
    ["dono", ["ryokou", "shigoto", "tesuto", "shashin", "kaban", "kuruma", "heya"]],
    ["otokonohito", ["kazoku", "haha", "chichi", "ane", "otouto", "gakusei", "sensei"]],
    ["onnanohito", ["kazoku", "haha", "chichi", "ane", "otouto", "tomodachi", "isha"]],
    ["tenin", ["mise", "kaisha", "gakkou", "byouin", "eki", "shigoto", "hito"]],
    ["ekiin", ["eki", "kaisha", "gakkou", "mise", "byouin", "shigoto", "hito"]],
    ["tabemono", ["kore", "sore", "are", "hon", "mono", "mizu", "ocha"]],
    ["nomimono", ["kore", "sore", "are", "hon", "mono", "mizu", "ocha"]],
  ]);

  for (const currentId of currentIds) {
    for (const partnerId of rowsByWord.get(currentId)) {
      if (["nan", "dare", "dore"].includes(currentId)) questionWordCard(cards, 7, words, currentId, partnerId);
      else if (currentId === "dono") whichNounCard(cards, 7, words, currentId, partnerId);
      else if (["otokonohito", "onnanohito", "tenin", "ekiin"].includes(currentId)) topic(cards, 7, w(words, currentId), w(words, partnerId), "A new person word stays in the topic slot while the comment changes.", ["A wa B desu"]);
      else topicQuestion(cards, 7, w(words, currentId), w(words, partnerId), "A new noun stays in the topic slot while the comment changes.", ["A wa B desu", "ka"]);
    }
  }

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

for (let unitId = 1; unitId <= 7; unitId += 1) {
  const existing = await readJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`);
  const spec = specs.get(unitId);
  if (!spec) throw new Error(`Missing source spec for unit ${unitId}`);

  const builders = new Map([
    [1, buildUnit1],
    [2, buildUnit2],
    [3, buildUnit3],
    [4, buildUnit4],
    [5, buildUnit5],
    [6, buildUnit6],
    [7, buildUnit7],
  ]);
  const cards = builders.get(unitId)(spec, previousWords);
  const unit = { ...existing, ...spec, cards };
  assertUnit(unit);
  await writeJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`, unit);
  previousWords.push(...spec.newWords);
}

console.log("Rebuilt foundation units 1-7.");
