import fs from "node:fs/promises";
import path from "node:path";
import { root, readJson, reviewVocabularyUnitIds } from "./lib/curriculum-model.mjs";

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
  deshita: () => grammar("でした", "でした", "was; were; polite past identity"),
  jaArimasen: () => grammar("じゃありません", "じゃありません", "is not; contracted polite negative identity"),
  wa: () => grammar("は", "わ", "topic marker"),
  ga: () => grammar("が", "が", "subject marker"),
  wo: () => grammar("を", "を", "direct object marker"),
  ni: () => grammar("に", "に", "destination or time marker"),
  de: () => grammar("で", "で", "action location marker"),
  to: () => grammar("と", "と", "and; with"),
  no: () => grammar("の", "の", "possession or description marker"),
  mo: () => grammar("も", "も", "also; too"),
  ka: () => grammar("か", "か", "question marker"),
  q: () => grammar("？", "？", "question mark"),
};

const properIds = new Set(["nihon", "amerika"]);
const pronounIds = new Set(["watashi", "sakura", "yuki", "tanaka"]);
const noArticleIds = new Set(["mizu", "ocha", "tabemono", "nomimono", "kinou", "sengetsu", "kyonen", "asa", "yoru", "yasumi", "shigoto"]);
const bareSubjectIds = new Set(["kinou", "sengetsu", "kyonen", "asa", "yoru"]);

const verbForms = new Map([
  ["taberu", ["食べます", "たべます", "eat", "eats"]],
  ["nomu", ["飲みます", "のみます", "drink", "drinks"]],
  ["yomu", ["読みます", "よみます", "read", "reads"]],
  ["kaku", ["書きます", "かきます", "write", "writes"]],
  ["miru", ["見ます", "みます", "look at", "looks at"]],
  ["kiku", ["聞きます", "ききます", "listen", "listens"]],
  ["iku", ["行きます", "いきます", "go", "goes"]],
  ["kuru", ["来ます", "きます", "come", "comes"]],
  ["hataraku", ["働きます", "はたらきます", "work", "works"]],
  ["benkyou_suru", ["勉強します", "べんきょうします", "study", "studies"]],
  ["kau", ["買います", "かいます", "buy", "buys"]],
  ["tsukau", ["使います", "つかいます", "use", "uses"]],
  ["hanasu", ["話します", "はなします", "speak", "speaks"]],
  ["matsu", ["待ちます", "まちます", "wait", "waits"]],
]);

function bareMeaning(word) {
  return word.meaning.split(";")[0];
}

function isVerb(word) {
  return word.function === "verb";
}

function sentenceStart(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
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

function presentClause(left, right) {
  if (left.id === "watashi") return `I am ${identityComplement(right)}`;
  if (left.id === "sakura") return `You are ${identityComplement(right)}`;
  return `${sentenceStart(subject(left))} is ${identityComplement(right)}`;
}

function presentQuestion(left, right) {
  if (left.id === "watashi") return `Am I ${identityComplement(right)}?`;
  if (left.id === "sakura") return `Are you ${identityComplement(right)}?`;
  return `Is ${subject(left)} ${identityComplement(right)}?`;
}

function negativeClause(left, right) {
  if (left.id === "watashi") return `I am not ${identityComplement(right)}`;
  if (left.id === "sakura") return `You are not ${identityComplement(right)}`;
  return `${sentenceStart(subject(left))} is not ${identityComplement(right)}`;
}

function pastClause(left, right) {
  if (left.id === "watashi") return `I was ${identityComplement(right)}`;
  if (left.id === "sakura") return `You were ${identityComplement(right)}`;
  return `${sentenceStart(subject(left))} was ${identityComplement(right)}`;
}

function possessive(owner) {
  if (owner.id === "watashi") return "my";
  if (owner.id === "sakura") return "your";
  if (owner.id === "yuki") return "his";
  if (owner.id === "tanaka") return "her";
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

function verbToken(word) {
  const form = verbForms.get(word.id);
  if (!form) throw new Error(`Missing verb form ${word.id}`);
  return {
    surface: form[0],
    reading: form[1],
    explain: form[2],
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

function add(cards, unitId, parts, english, fact, grammarTags) {
  cards.push(makeCard(unitId, cards.length + 1, parts, english, fact, grammarTags));
}

function cycle(items, index) {
  return items[index % items.length];
}

function byId(words) {
  return new Map(words.map((word) => [word.id, word]));
}

function w(words, id) {
  const word = words.get(id);
  if (!word) throw new Error(`Missing word ${id}`);
  return word;
}

function vocabIntro(cards, unitId, word) {
  add(cards, unitId, [token(word)], bareMeaning(word), "New vocabulary appears by itself before sentence context.", ["vocabulary introduction"]);
}

function grammarIntro(cards, unitId, part, english, fact) {
  add(cards, unitId, [part], english, fact, ["grammar introduction"]);
}

function identity(cards, unitId, word) {
  add(cards, unitId, [token(word), g.desu()], `It's ${identityComplement(word)}`, "A new word lands in a familiar identity sentence.", ["Aです"]);
}

function topic(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.desu()], presentClause(left, right), "One slot changes while the sentence frame stays fixed.", ["AはBです"]);
}

function topicQuestion(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.desu(), g.ka(), g.q()], presentQuestion(left, right), "`です` and `か` stay separate so the question marker is visible.", ["AはBです", "か"]);
}

function negativeTopic(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.jaArimasen()], negativeClause(left, right), "`じゃありません` is a compact polite negative identity phrase.", ["AはBじゃありません"]);
}

function pastTopic(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.deshita()], pastClause(left, right), "`でした` is the polite past identity form.", ["AはBでした"]);
}

function possession(cards, unitId, owner, item) {
  add(cards, unitId, [token(owner), g.no(), token(item), g.desu()], `It's ${possessive(owner)} ${bareMeaning(item)}`, "`の` links a possessor or descriptor to a noun.", ["AのB"]);
}

function also(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.mo(), token(right), g.desu()], `${sentenceStart(subject(left))} is also ${identityComplement(right)}`, "`も` marks that the same comment also applies.", ["AもBです"]);
}

function actionEnglish(actor, verb) {
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  return `${sentenceStart(subject(actor))} ${action}`;
}

function subjectAction(cards, unitId, actor, verb) {
  add(cards, unitId, [token(actor), g.wa(), verbToken(verb)], actionEnglish(actor, verb), "A current verb gets real sentence practice with a familiar subject.", ["early Vます action"]);
}

function objectAction(cards, unitId, object, verb) {
  const action = verbForms.get(verb.id)[2];
  add(cards, unitId, [token(object), g.wo(), verbToken(verb)], `I ${action} ${indefinite(object)}`, "A familiar object cushions the current verb.", ["early Vます action", "NをVます"]);
}

function placeAction(cards, unitId, place, verb, particle = g.ni()) {
  const action = verbForms.get(verb.id)[2];
  const prep = particle.surface === "で" ? "at" : "to";
  add(cards, unitId, [token(place), particle, verbToken(verb)], `I ${action} ${prep} ${indefinite(place)}`, "A familiar place cushions the current verb.", ["early Vます action"]);
}

function compound(cards, unitId, first, second, category, englishCategory) {
  add(cards, unitId, [token(first), g.to(), token(second), g.wa(), token(category), g.desu()], `${sentenceStart(subject(first))} and ${subject(second)} are ${englishCategory}`, "`と` joins two concrete nouns before the topic marker.", ["AとBはCです"]);
}

function drillVerb(cards, unitId, words, verb, count = 7) {
  const people = ["watashi", "sakura", "yuki", "tanaka", "sensei", "gakusei", "tomodachi", "isha", "haha", "chichi"].filter((id) => words.has(id));
  const objects = ["hon", "mizu", "ocha", "shashin", "kaban", "tabemono", "nomimono"].filter((id) => words.has(id));
  const places = ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya"].filter((id) => words.has(id));
  for (let index = 0; index < count; index += 1) {
    if (["yomu", "kaku", "miru", "kiku", "taberu", "nomu", "kau", "tsukau"].includes(verb.id) && objects.length > 0 && index % 2 === 0) {
      objectAction(cards, unitId, w(words, cycle(objects, index)), verb);
    } else if (["iku", "kuru", "hataraku", "benkyou_suru", "matsu"].includes(verb.id) && places.length > 0 && index % 2 === 0) {
      placeAction(cards, unitId, w(words, cycle(places, index)), verb, ["hataraku", "benkyou_suru", "matsu"].includes(verb.id) ? g.de() : g.ni());
    } else {
      subjectAction(cards, unitId, w(words, cycle(people, index)), verb);
    }
  }
}

function currentNonVerbs(spec) {
  return spec.newWords.filter((word) => !isVerb(word));
}

function currentVerbs(spec) {
  return spec.newWords.filter(isVerb);
}

function addReview(cards, unitId, words, reviewWords) {
  const anchors = ["watashi", "sakura", "yuki", "tanaka", "sensei", "gakusei", "tomodachi", "isha", "haha", "chichi"].filter((id) => words.has(id));
  const repeats = reviewWords.length > 15 ? 2 : 3;
  for (const [index, reviewWord] of reviewWords.entries()) {
    for (let repeat = 0; repeat < repeats; repeat += 1) {
      const anchor = w(words, cycle(anchors, index + repeat));
      if (isVerb(reviewWord)) subjectAction(cards, unitId, anchor, reviewWord);
      else if (reviewWord.function === "place") placeAction(cards, unitId, reviewWord, w(words, "iku"), g.ni());
      else topic(cards, unitId, anchor, reviewWord);
    }
  }
}

function buildUnit1(spec) {
  const words = byId(spec.newWords);
  const cards = [];
  spec.newWords.forEach((word) => vocabIntro(cards, 1, word));
  grammarIntro(cards, 1, g.desu(), "am; is; are", "`です` is the polite identity marker.");
  grammarIntro(cards, 1, g.wa(), "topic marker", "`は` marks what the sentence is about.");
  grammarIntro(cards, 1, g.ka(), "question marker", "`か` turns the sentence into a question.");

  const subjects = ["watashi", "sakura", "yuki", "tanaka"];
  const roles = ["gakusei", "sensei", "tomodachi"];
  for (const role of roles) for (const subjectId of subjects) topic(cards, 1, w(words, subjectId), w(words, role));
  for (const role of roles) for (const subjectId of subjects) topicQuestion(cards, 1, w(words, subjectId), w(words, role));
  currentNonVerbs(spec).forEach((word) => identity(cards, 1, w(words, word.id)));
  currentVerbs(spec).forEach((word) => drillVerb(cards, 1, words, w(words, word.id), 12));
  for (let index = 0; cards.length < 80; index += 1) topic(cards, 1, w(words, cycle(subjects, index)), w(words, cycle(roles, index)));
  return cards;
}

function buildUnit2(spec, previousWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => vocabIntro(cards, 2, w(words, word.id)));
  currentNonVerbs(spec).forEach((word) => identity(cards, 2, w(words, word.id)));
  const statements = [
    ["neko", "doubutsu"],
    ["inu", "doubutsu"],
    ["ie", "basho"],
    ["gakkou", "basho"],
    ["basho", "gakkou"],
    ["isha", "sensei"],
    ["sensei", "gakusei"],
    ["tomodachi", "gakusei"],
  ];
  for (const [a, b] of statements) topic(cards, 2, w(words, a), w(words, b));
  for (const [a, b] of statements) topicQuestion(cards, 2, w(words, a), w(words, b));
  compound(cards, 2, w(words, "neko"), w(words, "inu"), w(words, "doubutsu"), "animals");
  compound(cards, 2, w(words, "ie"), w(words, "gakkou"), w(words, "basho"), "places");
  currentVerbs(spec).forEach((word) => drillVerb(cards, 2, words, w(words, word.id), 16));
  const fillerRows = [
    ["neko", "doubutsu"],
    ["inu", "doubutsu"],
    ["ie", "basho"],
    ["gakkou", "basho"],
    ["basho", "ie"],
    ["basho", "gakkou"],
    ["sensei", "gakusei"],
    ["gakusei", "tomodachi"],
    ["isha", "sensei"],
    ["tomodachi", "gakusei"],
  ];
  for (let index = 0; cards.length < 80; index += 1) {
    const [left, right] = cycle(fillerRows, index);
    topic(cards, 2, w(words, left), w(words, right));
  }
  return cards;
}

function buildUnit3(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => vocabIntro(cards, 3, w(words, word.id)));
  currentNonVerbs(spec).forEach((word) => identity(cards, 3, w(words, word.id)));
  currentNonVerbs(spec).forEach((word, index) => {
    const current = w(words, word.id);
    for (let repeat = 0; repeat < 4; repeat += 1) possession(cards, 3, w(words, cycle(["watashi", "sakura", "yuki", "tanaka"], index + repeat)), current);
    for (let repeat = 0; repeat < 3; repeat += 1) also(cards, 3, current, w(words, cycle(["gakusei", "sensei", "isha", "tomodachi"], index + repeat)));
  });
  currentVerbs(spec).forEach((word) => drillVerb(cards, 3, words, w(words, word.id), 10));
  addReview(cards, 3, words, reviewWords);
  return cards;
}

function buildUnit4(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => vocabIntro(cards, 4, w(words, word.id)));
  currentNonVerbs(spec).forEach((word) => identity(cards, 4, w(words, word.id)));
  currentNonVerbs(spec).forEach((word, index) => {
    const current = w(words, word.id);
    for (let repeat = 0; repeat < 7; repeat += 1) negativeTopic(cards, 4, current, w(words, cycle(["gakkou", "ie", "basho", "isha", "gakusei", "sensei", "hon", "doubutsu"], index + repeat)));
  });
  currentVerbs(spec).forEach((word) => drillVerb(cards, 4, words, w(words, word.id), 16));
  addReview(cards, 4, words, reviewWords);
  return cards;
}

function buildUnit5(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => vocabIntro(cards, 5, w(words, word.id)));
  currentNonVerbs(spec).forEach((word) => identity(cards, 5, w(words, word.id)));
  currentNonVerbs(spec).forEach((word, index) => {
    const current = w(words, word.id);
    for (let repeat = 0; repeat < 7; repeat += 1) pastTopic(cards, 5, current, w(words, cycle(["yasumi", "ryokou", "shigoto", "gakusei", "sensei", "tomodachi"], index + repeat)));
  });
  currentVerbs(spec).forEach((word) => drillVerb(cards, 5, words, w(words, word.id), 16));
  addReview(cards, 5, words, reviewWords);
  return cards;
}

function demonstrativeTopic(cards, unitId, demonstrative, noun) {
  const english = demonstrative.id === "kore" || demonstrative.id === "kono" ? "this" : demonstrative.id === "sore" || demonstrative.id === "sono" ? "that near you" : "that over there";
  add(cards, unitId, [token(demonstrative), g.wa(), token(noun), g.desu()], `${sentenceStart(english)} is ${indefinite(noun)}`, "A demonstrative points at one familiar noun.", ["kore/sore/are", "AはBです"]);
}

function determinerIdentity(cards, unitId, determiner, noun) {
  const english = determiner.id === "kono" ? "this" : determiner.id === "sono" ? "that near you" : "that over there";
  add(cards, unitId, [token(determiner), token(noun), g.desu()], `It is ${english} ${bareMeaning(noun)}`, "A determiner sits directly before the noun it points to.", ["kono/sono/ano N"]);
}

function buildUnit6(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => vocabIntro(cards, 6, w(words, word.id)));
  const nounIds = ["hon", "ie", "gakkou", "mise", "byouin", "eki", "mizu", "ocha", "shashin", "kaban"].filter((id) => words.has(id));
  for (const id of ["kore", "sore", "are"]) for (let index = 0; index < 7; index += 1) demonstrativeTopic(cards, 6, w(words, id), w(words, cycle(nounIds, index)));
  for (const id of ["kono", "sono", "ano"]) for (let index = 0; index < 7; index += 1) determinerIdentity(cards, 6, w(words, id), w(words, cycle(nounIds, index)));
  for (const id of ["mizu", "ocha"]) for (let index = 0; index < 7; index += 1) demonstrativeTopic(cards, 6, w(words, cycle(["kore", "sore", "are"], index)), w(words, id));
  currentVerbs(spec).forEach((word) => drillVerb(cards, 6, words, w(words, word.id), 16));
  addReview(cards, 6, words, reviewWords);
  return cards;
}

function questionWordCard(cards, unitId, words, questionId, contextId) {
  const context = w(words, contextId);
  const question = w(words, questionId);
  if (questionId === "nan") add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], `What is ${subject(context)}?`, "What asks for the identity of the topic.", ["nan", "AはBですか"]);
  else if (questionId === "dare") add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], `Who is ${subject(context)}?`, "Who asks for the person behind the topic.", ["dare", "AはBですか"]);
  else if (questionId === "dore") add(cards, unitId, [token(question), g.ga(), token(context), g.desu(), g.ka(), g.q()], `Which one is ${indefinite(context)}?`, "Which-one questions can point to a concrete known noun.", ["dore", "か"]);
}

function whichNounCard(cards, unitId, words, determinerId, nounId) {
  add(cards, unitId, [token(w(words, determinerId)), token(w(words, nounId)), g.desu(), g.ka(), g.q()], `Which ${bareMeaning(w(words, nounId))} is it?`, "Which sits before the noun being asked about.", ["dono N", "か"]);
}

function buildUnit7(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  spec.newWords.forEach((word) => vocabIntro(cards, 7, w(words, word.id)));
  const contexts = ["watashi", "sakura", "yuki", "tanaka", "haha", "chichi", "sensei", "gakusei"];
  const nouns = ["hon", "shashin", "kaban", "mizu", "ocha", "tabemono", "nomimono"].filter((id) => words.has(id));
  for (let index = 0; index < 7; index += 1) questionWordCard(cards, 7, words, "nan", cycle(contexts, index));
  for (let index = 0; index < 7; index += 1) questionWordCard(cards, 7, words, "dare", cycle(contexts, index + 2));
  for (let index = 0; index < 7; index += 1) questionWordCard(cards, 7, words, "dore", cycle(nouns, index));
  for (let index = 0; index < 7; index += 1) whichNounCard(cards, 7, words, "dono", cycle(nouns, index));
  for (const id of ["otokonohito", "onnanohito", "tabemono", "nomimono"]) {
    for (let index = 0; index < 7; index += 1) topicQuestion(cards, 7, w(words, id), w(words, cycle(["gakusei", "sensei", "tomodachi", "mizu", "ocha", "hon"], index)));
  }
  currentVerbs(spec).forEach((word) => drillVerb(cards, 7, words, w(words, word.id), 16));
  addReview(cards, 7, words, reviewWords);
  return cards;
}

function reviewWordsFor(source, unitId) {
  const byUnit = new Map(source.units.map((unit) => [unit.id, unit.newWords]));
  return reviewVocabularyUnitIds(unitId).flatMap((id) => byUnit.get(id) ?? []);
}

function assertUnit(unit) {
  if (unit.cards.length < 80 || unit.cards.length > 150) throw new Error(`unit ${unit.id}: expected 80-150 cards, got ${unit.cards.length}`);
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
  const cards = builders.get(unitId)(spec, previousWords, reviewWordsFor(source, unitId));
  const unit = { ...existing, ...spec, cards };
  assertUnit(unit);
  await writeJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`, unit);
  previousWords.push(...spec.newWords);
}

console.log("Rebuilt foundation units 1-7 with real verb vocabulary lanes.");
