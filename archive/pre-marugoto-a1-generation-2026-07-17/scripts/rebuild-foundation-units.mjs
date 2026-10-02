import fs from "node:fs/promises";
import path from "node:path";
import { authoredUnitIds, lexiconVocabularyUnitIds, root, readJson, reviewVocabularyUnitIds, wordsForUnits } from "./lib/curriculum-model.mjs";
import { assertUnitVariety, tautologicalIdentityFindings } from "./lib/unit-variety-guardrails.mjs";

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
  dewaArimasen: () => grammar("ではありません", "でわありません", "is not; formal polite negative"),
  dewaArimasenDeshita: () => grammar("ではありませんでした", "でわありませんでした", "was not; formal polite past negative"),
  arimasu: () => ({ ...grammar("あります", "あります", "exists; there is"), wordId: "aru" }),
  arimasen: () => ({ ...grammar("ありません", "ありません", "does not exist; there is not"), wordId: "aru" }),
  imasu: () => ({ ...grammar("います", "います", "exists for living things; there is"), wordId: "iru" }),
  imasen: () => ({ ...grammar("いません", "いません", "does not exist for living things; there is not"), wordId: "iru" }),
  wa: () => grammar("は", "わ", "topic marker"),
  ga: () => grammar("が", "が", "subject marker"),
  wo: () => grammar("を", "を", "direct object marker"),
  ni: () => grammar("に", "に", "destination or time marker"),
  de: () => grammar("で", "で", "action location marker"),
  to: () => grammar("と", "と", "and; with"),
  no: () => grammar("の", "の", "possession or description marker"),
  mo: () => grammar("も", "も", "also; too"),
  ka: () => grammar("か", "か", "question marker"),
  ne: () => grammar("ね", "ね", "shared-feeling sentence ending"),
  yo: () => grammar("よ", "よ", "new-information sentence ending"),
  q: () => grammar("？", "？", "question mark"),
};

const properIds = new Set(["nihon", "amerika"]);
const pronounIds = new Set(["watashi", "sakura", "yuki", "tanaka"]);
const noArticleIds = new Set(["mizu", "ocha", "tabemono", "kinou", "sengetsu", "kyonen", "asa", "yoru", "yasumi", "shigoto"]);
const bareSubjectIds = new Set(["kinou", "sengetsu", "kyonen", "asa", "yoru"]);
const livingExistenceWordIds = new Set(["neko", "inu"]);

const weatherAdjectives = new Map([
  ["tenki", "weather"],
  ["ame", "rainy"],
  ["yuki_snow", "snowy"],
  ["kaze", "windy"],
  ["sora", "sky"],
]);

const locativeSubjectPhrases = new Map([
  ["koko", "here"],
  ["soko", "there near you"],
  ["asoko", "over there"],
]);

const verbForms = new Map([
  ["taberu", ["食べます", "たべます", "eat", "eats"]],
  ["nomu", ["飲みます", "のみます", "drink", "drinks"]],
  ["yomu", ["読みます", "よみます", "read", "reads"]],
  ["kaku", ["書きます", "かきます", "write", "writes"]],
  ["miru", ["見ます", "みます", "look", "looks"]],
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
  if (meaning === "paper") return "paper";
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
  if (word.id === "yasumi") return "a day off";
  if (word.id === "nomimono") return "a drink";
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
  if (word.id === "kore") return "this";
  if (word.id === "sore") return "that near you";
  if (word.id === "are") return "that over there";
  if (word.id === "koko") return "here";
  if (word.id === "soko") return "there near you";
  if (word.id === "asoko") return "over there";
  if (word.id === "kyou") return "today";
  if (word.id === "ashita") return "tomorrow";
  if (word.id === "ima") return "now";
  if (word.id === "haha") return "my mother";
  if (word.id === "chichi") return "my father";
  if (word.id === "ane") return "my older sister";
  if (word.id === "otouto") return "my younger brother";
  if (bareSubjectIds.has(word.id)) return meaning;
  if (properIds.has(word.id)) return meaning;
  return `the ${meaning}`;
}

function presentBeClause(noun, complement) {
  if (locativeSubjectPhrases.has(noun.id)) return `It is ${complement} ${locativeSubjectPhrases.get(noun.id)}`;
  if (noun.id === "watashi") return `I am ${complement}`;
  if (noun.id === "sakura") return `You are ${complement}`;
  if (noun.id === "yuki") return `He is ${complement}`;
  if (noun.id === "tanaka") return `She is ${complement}`;
  return `${sentenceStart(subject(noun))} is ${complement}`;
}

function negativeBeClause(noun, complement) {
  if (locativeSubjectPhrases.has(noun.id)) return `It is not ${complement} ${locativeSubjectPhrases.get(noun.id)}`;
  if (noun.id === "watashi") return `I am not ${complement}`;
  if (noun.id === "sakura") return `You are not ${complement}`;
  if (noun.id === "yuki") return `He is not ${complement}`;
  if (noun.id === "tanaka") return `She is not ${complement}`;
  return `${sentenceStart(subject(noun))} is not ${complement}`;
}

function pastBeClause(noun, complement) {
  if (locativeSubjectPhrases.has(noun.id)) return `It was ${complement} ${locativeSubjectPhrases.get(noun.id)}`;
  if (noun.id === "watashi") return `I was ${complement}`;
  if (noun.id === "sakura") return `You were ${complement}`;
  if (noun.id === "yuki") return `He was ${complement}`;
  if (noun.id === "tanaka") return `She was ${complement}`;
  return `${sentenceStart(subject(noun))} was ${complement}`;
}

function pastNegativeBeClause(noun, complement) {
  if (locativeSubjectPhrases.has(noun.id)) return `It was not ${complement} ${locativeSubjectPhrases.get(noun.id)}`;
  if (noun.id === "watashi") return `I was not ${complement}`;
  if (noun.id === "sakura") return `You were not ${complement}`;
  if (noun.id === "yuki") return `He was not ${complement}`;
  if (noun.id === "tanaka") return `She was not ${complement}`;
  return `${sentenceStart(subject(noun))} was not ${complement}`;
}

function questionBeClause(noun, complement) {
  if (locativeSubjectPhrases.has(noun.id)) return `Is it ${complement} ${locativeSubjectPhrases.get(noun.id)}?`;
  return `Is ${subject(noun)} ${complement}?`;
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

function pastQuestion(left, right) {
  if (left.id === "watashi") return `Was I ${identityComplement(right)}?`;
  if (left.id === "sakura") return `Were you ${identityComplement(right)}?`;
  return `Was ${subject(left)} ${identityComplement(right)}?`;
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

function makeCard(unitId, index, parts, english, grammarTags) {
  return {
    id: `u${pad(unitId)}-c${pad(index)}`,
    line: parts.map((part) => part.surface),
    tts: parts.map((part) => part.reading),
    explain: parts.map((part) => part.explain),
    tokens: parts,
    english: english.replace(/\.+$/, ""),
    grammarTags,
  };
}

function add(cards, unitId, parts, english, grammarTags) {
  cards.push(makeCard(unitId, cards.length + 1, parts, english, grammarTags));
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

function grammarIntro(cards, unitId, part, english) {
  add(cards, unitId, [part], english, ["grammar introduction"]);
}

function warmReview(cards, unitId, words) {
  const rows = [
    () => words.has("watashi") && words.has("gakusei") && topic(cards, unitId, w(words, "watashi"), w(words, "gakusei")),
    () => words.has("sakura") && words.has("sensei") && topicQuestion(cards, unitId, w(words, "sakura"), w(words, "sensei")),
    () => words.has("neko") && words.has("doubutsu") && topic(cards, unitId, w(words, "neko"), w(words, "doubutsu")),
    () => words.has("ie") && words.has("basho") && topic(cards, unitId, w(words, "ie"), w(words, "basho")),
    () => words.has("hon") && words.has("yomu") && objectAction(cards, unitId, w(words, "hon"), w(words, "yomu")),
    () => words.has("watashi") && words.has("taberu") && subjectAction(cards, unitId, w(words, "watashi"), w(words, "taberu")),
    () => words.has("gakkou") && words.has("basho") && topicQuestion(cards, unitId, w(words, "gakkou"), w(words, "basho")),
    () => words.has("shashin") && words.has("miru") && objectAction(cards, unitId, w(words, "shashin"), w(words, "miru")),
  ];
  for (const row of rows) row();
}

function identity(cards, unitId, word) {
  add(cards, unitId, [token(word), g.desu()], `It's ${identityComplement(word)}`, ["Aです"]);
}

function identityQuestion(cards, unitId, word) {
  add(cards, unitId, [token(word), g.desu(), g.ka(), g.q()], `Is it ${identityComplement(word)}?`, ["Aです", "か"]);
}

function topic(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.desu()], presentClause(left, right), ["AはBです"]);
}

function topicQuestion(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.desu(), g.ka(), g.q()], presentQuestion(left, right), ["AはBです", "か"]);
}

function negativeTopic(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.jaArimasen()], negativeClause(left, right), ["AはBじゃありません"]);
}

function pastTopic(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.deshita()], pastClause(left, right), ["AはBでした"]);
}

function pastTopicQuestion(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.wa(), token(right), g.deshita(), g.ka(), g.q()], pastQuestion(left, right), ["AはBでした", "か"]);
}

function pastIdentity(cards, unitId, word) {
  add(cards, unitId, [token(word), g.deshita()], `It was ${identityComplement(word)}`, ["Aでした"]);
}

function possession(cards, unitId, owner, item) {
  add(cards, unitId, [token(owner), g.no(), token(item), g.desu()], `It's ${possessive(owner)} ${bareMeaning(item)}`, ["AのB"]);
}

function also(cards, unitId, left, right) {
  add(cards, unitId, [token(left), g.mo(), token(right), g.desu()], `${sentenceStart(subject(left))} is also ${identityComplement(right)}`, ["AもBです"]);
}

function actionEnglish(actor, verb) {
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  return `${sentenceStart(subject(actor))} ${action}`;
}

function subjectAction(cards, unitId, actor, verb) {
  add(cards, unitId, [token(actor), g.wa(), verbToken(verb)], actionEnglish(actor, verb), ["early Vます action"]);
}

function questionSubject(word) {
  if (word.id === "watashi") return "I";
  if (word.id === "sakura") return "you";
  return subject(word);
}

function subjectActionQuestion(cards, unitId, actor, verb) {
  const action = verbForms.get(verb.id)[2];
  const question = actor.id === "watashi" || actor.id === "sakura" ? "Do" : "Does";
  add(cards, unitId, [token(actor), g.wa(), verbToken(verb), g.ka(), g.q()], `${question} ${questionSubject(actor)} ${action}?`, ["early Vます action", "か"]);
}

function objectAction(cards, unitId, object, verb) {
  const action = verb.id === "miru" ? "look at" : verb.id === "kiku" ? "listen to" : verbForms.get(verb.id)[2];
  add(cards, unitId, [token(object), g.wo(), verbToken(verb)], `I ${action} ${indefinite(object)}`, ["early Vます action", "NをVます"]);
}

function subjectObjectAction(cards, unitId, actor, object, verb) {
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  const actionText = verb.id === "miru" ? `${action} at` : verb.id === "kiku" ? `${action} to` : action;
  add(cards, unitId, [token(actor), g.wa(), token(object), g.wo(), verbToken(verb)], `${sentenceStart(subject(actor))} ${actionText} ${indefinite(object)}`, ["early Vます action", "NをVます"]);
}

function determinerObjectAction(cards, unitId, actor, determiner, object, verb) {
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  const actionText = verb.id === "miru" ? `${action} at` : verb.id === "kiku" ? `${action} to` : action;
  const determinerText = determiner.id === "kono" ? "this" : determiner.id === "sono" ? "that" : "that";
  add(cards, unitId, [token(actor), g.wa(), token(determiner), token(object), g.wo(), verbToken(verb)], `${sentenceStart(subject(actor))} ${actionText} ${determinerText} ${bareMeaning(object)}`, [
    "kono/sono/ano N",
    "NをVます",
  ]);
}

function subjectObjectActionQuestion(cards, unitId, actor, object, verb) {
  const action = verbForms.get(verb.id)[2];
  const actionText = verb.id === "miru" ? `${action} at` : verb.id === "kiku" ? `${action} to` : action;
  const question = actor.id === "watashi" || actor.id === "sakura" ? "Do" : "Does";
  add(cards, unitId, [token(actor), g.wa(), token(object), g.wo(), verbToken(verb), g.ka(), g.q()], `${question} ${questionSubject(actor)} ${actionText} ${indefinite(object)}?`, ["early Vます action", "NをVます", "か"]);
}

function placePhrase(place, prep) {
  if (place.id === "ie" && prep === "to") return "home";
  if (place.id === "ie" && prep === "at") return "at home";
  if (place.id === "heya" && prep === "at") return "in a room";
  if (place.id === "koko") return "here";
  if (place.id === "soko") return "there near you";
  if (place.id === "asoko") return "over there";
  return `${prep} ${indefinite(place)}`;
}

function timePhrase(time) {
  if (time.id === "kyou") return "today";
  if (time.id === "ashita") return "tomorrow";
  if (time.id === "ima") return "now";
  if (time.id === "asa") return "in the morning";
  if (time.id === "yoru") return "at night";
  return bareMeaning(time);
}

function placeAction(cards, unitId, place, verb, particle = g.ni()) {
  const action = verbForms.get(verb.id)[2];
  const prep = particle.surface === "で" ? "at" : "to";
  add(cards, unitId, [token(place), particle, verbToken(verb)], `I ${action} ${placePhrase(place, prep)}`, ["early Vます action"]);
}

function isLivingExistenceWord(word) {
  return word.function === "person" || word.function === "animal" || livingExistenceWordIds.has(word.id);
}

function existenceClause(word, negative = false) {
  if (!negative) return `There is ${indefinite(word)}`;
  return `There is no ${bareMeaning(word)}`;
}

function existence(cards, unitId, word, negative = false) {
  const ending = isLivingExistenceWord(word) ? (negative ? g.imasen() : g.imasu()) : negative ? g.arimasen() : g.arimasu();
  add(cards, unitId, [token(word), g.ga(), ending], existenceClause(word, negative), [
    isLivingExistenceWord(word) ? "Nがいます" : "Nがあります",
    negative ? "negative existence" : "basic existence",
  ]);
}

function locatedExistence(cards, unitId, place, item, negative = false) {
  const ending = isLivingExistenceWord(item) ? (negative ? g.imasen() : g.imasu()) : negative ? g.arimasen() : g.arimasu();
  const placeText = placePhrase(place, "at");
  const english = negative ? `There is no ${bareMeaning(item)} ${placeText}` : `There is ${indefinite(item)} ${placeText}`;
  add(cards, unitId, [token(place), g.ni(), token(item), g.ga(), ending], english, [
    isLivingExistenceWord(item) ? "located living existence" : "located object existence",
    negative ? "negative existence" : "basic existence",
  ]);
}

function subjectPlaceAction(cards, unitId, actor, place, verb, particle = g.ni()) {
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  const prep = particle.explain === "action location marker" ? "at" : "to";
  add(
    cards,
    unitId,
    [token(actor), g.wa(), token(place), particle, verbToken(verb)],
    `${sentenceStart(subject(actor))} ${action} ${placePhrase(place, prep)}`,
    ["early V\u307e\u3059 action"],
  );
}

function subjectTimeAction(cards, unitId, actor, time, verb) {
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  const when = timePhrase(time);
  add(cards, unitId, [token(actor), g.wa(), token(time), g.ni(), verbToken(verb)], `${sentenceStart(subject(actor))} ${action} ${when}`, [
    "early Vます action",
    "time に",
  ]);
}

function subjectTimeAdverbAction(cards, unitId, actor, time, verb) {
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  add(cards, unitId, [token(actor), g.wa(), token(time), verbToken(verb)], `${sentenceStart(subject(actor))} ${action} ${timePhrase(time)}`, [
    "early Vます action",
    "time adverb",
  ]);
}

function compound(cards, unitId, first, second, category, englishCategory) {
  add(cards, unitId, [token(first), g.to(), token(second), g.wa(), token(category), g.desu()], `${sentenceStart(subject(first))} and ${subject(second)} are ${englishCategory}`, ["AとBはCです"]);
}

function drillVerb(cards, unitId, words, verb, count = 7) {
  const people = ["watashi", "sakura", "yuki", "tanaka", "sensei", "gakusei", "tomodachi", "isha", "haha", "chichi"].filter((id) => words.has(id));
  const objectIdsByVerb = new Map([
    ["yomu", ["hon"]],
    ["kaku", ["hon"]],
    ["miru", ["shashin", "hon", "kaban"]],
    ["taberu", ["tabemono"]],
    ["nomu", ["mizu", "ocha", "nomimono"]],
    ["kau", ["hon", "mizu", "ocha", "shashin", "kaban", "tabemono", "nomimono"]],
    ["tsukau", ["hon", "kaban", "mizu"]],
  ]);
  const placeIdsByVerb = new Map([
    ["iku", ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya"]],
    ["kuru", ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya"]],
    ["hataraku", ["kaisha", "mise", "byouin"]],
    ["benkyou_suru", ["gakkou", "heya", "ie"]],
    ["matsu", ["eki", "ie", "gakkou", "mise", "byouin", "kaisha"]],
  ]);
  const objects = (objectIdsByVerb.get(verb.id) ?? ["hon", "mizu", "ocha", "shashin", "kaban", "tabemono", "nomimono"]).filter((id) =>
    words.has(id),
  );
  const places = (placeIdsByVerb.get(verb.id) ?? ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya"]).filter((id) =>
    words.has(id),
  );
  for (let index = 0; index < count; index += 1) {
    if (["yomu", "kaku", "miru", "taberu", "nomu", "kau", "tsukau"].includes(verb.id) && objects.length > 0 && index % 2 === 0) {
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

function addReviewWord(cards, unitId, words, reviewWord, index) {
  const anchors = ["watashi", "sakura", "yuki", "tanaka", "sensei", "gakusei", "tomodachi", "isha", "haha", "chichi"].filter((id) => words.has(id));
  const anchor = w(words, cycle(anchors, index));

  if (isVerb(reviewWord)) {
    if (["yomu", "kaku"].includes(reviewWord.id) && words.has("hon")) objectAction(cards, unitId, w(words, "hon"), reviewWord);
    else if (reviewWord.id === "miru" && words.has("shashin")) objectAction(cards, unitId, w(words, "shashin"), reviewWord);
    else if (reviewWord.id === "hataraku" && words.has("kaisha")) placeAction(cards, unitId, w(words, "kaisha"), reviewWord, g.de());
    else if (reviewWord.id === "benkyou_suru" && words.has("gakkou")) placeAction(cards, unitId, w(words, "gakkou"), reviewWord, g.de());
    else subjectAction(cards, unitId, anchor, reviewWord);
    return;
  }

  if (reviewWord.function === "place") {
    if (words.has("basho")) topic(cards, unitId, reviewWord, w(words, "basho"));
    else if (words.has("iku")) placeAction(cards, unitId, reviewWord, w(words, "iku"), g.ni());
    else identity(cards, unitId, reviewWord);
    return;
  }

  if (["neko", "inu"].includes(reviewWord.id) && words.has("doubutsu")) {
    topic(cards, unitId, reviewWord, w(words, "doubutsu"));
    return;
  }

  if (reviewWord.id === "doubutsu" && words.has("neko")) {
    topicQuestion(cards, unitId, w(words, "neko"), reviewWord);
    return;
  }

  if (reviewWord.id === "hon" && words.has("yomu")) {
    objectAction(cards, unitId, reviewWord, w(words, "yomu"));
    return;
  }

  if (reviewWord.id === "isha" && words.has("sensei")) {
    topic(cards, unitId, reviewWord, w(words, "sensei"));
    return;
  }

  if (reviewWord.id === "kazoku" && words.has("tomodachi")) {
    topic(cards, unitId, w(words, "tomodachi"), reviewWord);
    return;
  }

  if (["haha", "chichi", "ane", "otouto"].includes(reviewWord.id)) {
    identity(cards, unitId, reviewWord);
    return;
  }

  if (["shashin", "kaban", "isu", "tsukue"].includes(reviewWord.id)) {
    identity(cards, unitId, reviewWord);
    return;
  }

  if (["kinou", "sengetsu", "kyonen", "asa", "yoru", "yasumi", "ryokou", "shigoto"].includes(reviewWord.id)) {
    identity(cards, unitId, reviewWord);
    return;
  }

  if (pronounIds.has(reviewWord.id) && words.has("gakusei")) {
    topic(cards, unitId, reviewWord, w(words, "gakusei"));
    return;
  }

  identity(cards, unitId, reviewWord);
}

function addReview(cards, unitId, words, reviewWords, repeatsOverride) {
  const repeats = repeatsOverride ?? (reviewWords.length > 15 ? 2 : 3);
  for (let repeat = 0; repeat < repeats; repeat += 1) {
    for (const [index, reviewWord] of reviewWords.entries()) {
      addReviewWord(cards, unitId, words, reviewWord, index + repeat);
    }
  }
}

function buildUnit1(spec) {
  const words = byId(spec.newWords);
  const cards = [];

  for (const id of ["watashi", "yuki", "sakura", "tanaka"]) identity(cards, 1, w(words, id));
  for (const id of ["tanaka", "sakura", "yuki"]) identityQuestion(cards, 1, w(words, id));

  const subjects = ["watashi", "yuki", "sakura", "tanaka", "namae", "sensei", "gakusei", "tomodachi"];
  const complements = ["gakusei", "tomodachi", "sensei"];
  const topicPairs = [];
  for (const subjectId of subjects) {
    for (const complementId of complements) {
      if (subjectId !== complementId) topicPairs.push([subjectId, complementId]);
    }
  }

  const topicRows = topicPairs.slice(0, 21);
  const questionRows = [...topicPairs.slice(7), ...topicPairs.slice(0, 7)].slice(0, 20);
  const actionRows = [];
  const actionSubjects = ["watashi", "tanaka", "sensei", "sakura", "namae", "gakusei", "yuki", "tomodachi"];
  const actionCombos = [
    ["subjectAction", "taberu"],
    ["subjectActionQuestion", "nomu"],
    ["subjectAction", "nomu"],
    ["subjectActionQuestion", "taberu"],
  ];
  for (let round = 0; round < actionCombos.length; round += 1) {
    for (const [subjectIndex, subjectId] of actionSubjects.entries()) {
      const [type, verbId] = actionCombos[(round + subjectIndex) % actionCombos.length];
      actionRows.push([type, subjectId, verbId]);
    }
  }

  for (let index = 0; index < 32; index += 1) {
    if (index < topicRows.length) addFoundationRow(cards, 1, words, ["topic", ...topicRows[index]]);
    if (index < actionRows.length) addFoundationRow(cards, 1, words, actionRows[index]);
    if (index < questionRows.length) addFoundationRow(cards, 1, words, ["topicQuestion", ...questionRows[index]]);
  }
  return cards;
}

function buildUnit2(spec, previousWords) {
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];

  const rows = [
    ["subjectAction", "neko", "taberu"],
    ["topic", "neko", "doubutsu"],
    ["subjectAction", "inu", "nomu"],
    ["topic", "inu", "doubutsu"],
    ["possession", "watashi", "hon"],
    ["object", "watashi", "hon", "yomu"],
    ["possession", "watashi", "ie"],
    ["possession", "yuki", "ie"],
    ["possession", "sensei", "gakkou"],
    ["possession", "tanaka", "gakkou"],
    ["subjectAction", "isha", "taberu"],
    ["topic", "isha", "sensei"],
    ["topicQuestion", "ie", "basho"],
    ["object", "sakura", "hon", "kaku"],
    ["subjectAction", "sensei", "yomu"],
    ["topicQuestion", "neko", "doubutsu"],
    ["subjectAction", "yuki", "kaku"],
    ["topicQuestion", "inu", "doubutsu"],
    ["subjectActionQuestion", "neko", "taberu"],
    ["subjectAction", "tomodachi", "yomu"],
    ["topicQuestion", "doubutsu", "namae"],
    ["subjectAction", "sensei", "nomu"],
    ["subjectActionQuestion", "inu", "nomu"],
    ["possession", "sakura", "hon"],
    ["subjectAction", "gakusei", "kaku"],
    ["topic", "doubutsu", "neko"],
    ["possession", "sakura", "ie"],
    ["subjectAction", "yuki", "taberu"],
    ["topicQuestion", "ie", "gakkou"],
    ["possession", "gakusei", "gakkou"],
    ["subjectAction", "tanaka", "yomu"],
    ["topic", "doubutsu", "inu"],
    ["topicQuestion", "basho", "gakkou"],
    ["subjectAction", "tomodachi", "nomu"],
    ["topicQuestion", "gakkou", "basho"],
    ["topicQuestion", "isha", "sensei"],
    ["subjectAction", "isha", "kaku"],
    ["topic", "basho", "ie"],
    ["object", "gakusei", "hon", "yomu"],
    ["compound", "neko", "inu", "doubutsu", "animals"],
    ["subjectAction", "watashi", "kaku"],
    ["topic", "basho", "gakkou"],
    ["subjectAction", "tanaka", "taberu"],
    ["compound", "ie", "gakkou", "basho", "places"],
    ["subjectAction", "sakura", "yomu"],
    ["topicQuestion", "doubutsu", "neko"],
    ["subjectAction", "isha", "nomu"],
    ["compound", "inu", "neko", "doubutsu", "animals"],
    ["subjectActionQuestion", "sensei", "yomu"],
    ["topicQuestion", "doubutsu", "inu"],
    ["subjectAction", "watashi", "taberu"],
    ["compound", "gakkou", "ie", "basho", "places"],
    ["subjectActionQuestion", "yuki", "kaku"],
    ["topicQuestion", "basho", "ie"],
    ["subjectAction", "sakura", "nomu"],
    ["topic", "isha", "tomodachi"],
    ["subjectActionQuestion", "tomodachi", "yomu"],
    ["topicQuestion", "basho", "namae"],
    ["subjectActionQuestion", "sensei", "nomu"],
    ["topicQuestion", "isha", "namae"],
    ["subjectActionQuestion", "gakusei", "kaku"],
    ["topicQuestion", "neko", "inu"],
    ["objectQuestion", "yuki", "hon", "yomu"],
    ["topicQuestion", "inu", "neko"],
    ["subjectActionQuestion", "tanaka", "yomu"],
    ["topicQuestion", "ie", "namae"],
    ["objectQuestion", "tomodachi", "hon", "kaku"],
    ["topicQuestion", "gakkou", "ie"],
    ["subjectActionQuestion", "isha", "kaku"],
    ["topicQuestion", "doubutsu", "basho"],
    ["objectQuestion", "gakusei", "hon", "yomu"],
    ["topicQuestion", "isha", "tomodachi"],
    ["subjectActionQuestion", "watashi", "yomu"],
    ["topicQuestion", "neko", "namae"],
    ["objectQuestion", "tanaka", "hon", "kaku"],
    ["topicQuestion", "inu", "namae"],
    ["subjectActionQuestion", "sakura", "kaku"],
    ["topic", "isha", "gakusei"],
    ["subjectActionQuestion", "watashi", "kaku"],
    ["topicQuestion", "gakkou", "tomodachi"],
  ];

  for (const row of rows) {
    const [type, ...args] = row;
    if (type === "identity") identity(cards, 2, w(words, args[0]));
    else if (type === "identityQuestion") identityQuestion(cards, 2, w(words, args[0]));
    else if (type === "topic") topic(cards, 2, w(words, args[0]), w(words, args[1]));
    else if (type === "topicQuestion") topicQuestion(cards, 2, w(words, args[0]), w(words, args[1]));
    else if (type === "possession") possession(cards, 2, w(words, args[0]), w(words, args[1]));
    else if (type === "compound") compound(cards, 2, w(words, args[0]), w(words, args[1]), w(words, args[2]), args[3]);
    else if (type === "subjectAction") subjectAction(cards, 2, w(words, args[0]), w(words, args[1]));
    else if (type === "subjectActionQuestion") subjectActionQuestion(cards, 2, w(words, args[0]), w(words, args[1]));
    else if (type === "object") subjectObjectAction(cards, 2, w(words, args[0]), w(words, args[1]), w(words, args[2]));
    else if (type === "objectQuestion") subjectObjectActionQuestion(cards, 2, w(words, args[0]), w(words, args[1]), w(words, args[2]));
    else throw new Error(`Unknown Unit 2 row type ${type}`);
  }
  return cards;
}

function buildUnit3(spec, previousWords, reviewWords) {
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];

  const rows = [
    ["possession", "watashi", "kazoku"],
    ["topicQuestion", "namae", "haha"],
    ["topicQuestion", "namae", "chichi"],
    ["possession", "watashi", "shashin"],
    ["possession", "sakura", "kaban"],
    ["topicQuestion", "basho", "heya"],
    ["object", "shashin", "miru"],
    ["subjectAction", "sensei", "kiku"],
    ["topicQuestion", "namae", "ane"],
    ["topicQuestion", "namae", "otouto"],
    ["also", "haha", "sensei"],
    ["subjectAction", "chichi", "taberu"],
    ["possession", "yuki", "shashin"],
    ["possession", "watashi", "heya"],
    ["subjectAction", "ane", "nomu"],
    ["possession", "tanaka", "kaban"],
    ["subjectAction", "otouto", "kiku"],
    ["possession", "sakura", "kazoku"],
    ["object", "kaban", "miru"],
    ["possession", "sakura", "heya"],
    ["topicQuestion", "haha", "tomodachi"],
    ["subjectAction", "watashi", "kiku"],
    ["possession", "kazoku", "shashin"],
    ["also", "chichi", "sensei"],
    ["subjectAction", "sakura", "miru"],
    ["possession", "tomodachi", "kaban"],
    ["topicQuestion", "heya", "basho"],
    ["also", "ane", "gakusei"],
    ["subjectAction", "yuki", "kiku"],
    ["possession", "yuki", "kazoku"],
    ["subjectAction", "haha", "nomu"],
    ["possession", "sensei", "shashin"],
    ["topicQuestion", "otouto", "tomodachi"],
    ["subjectAction", "chichi", "kiku"],
    ["possession", "watashi", "kaban"],
    ["also", "heya", "basho"],
    ["subjectAction", "tanaka", "miru"],
    ["topicQuestion", "otouto", "namae"],
    ["possession", "gakusei", "heya"],
    ["subjectActionQuestion", "ane", "taberu"],
    ["topicQuestion", "shashin", "hon"],
    ["subjectAction", "otouto", "nomu"],
    ["possession", "yuki", "kaban"],
    ["topicQuestion", "haha", "sensei"],
    ["subjectActionQuestion", "watashi", "miru"],
    ["possession", "tomodachi", "heya"],
    ["subjectAction", "chichi", "nomu"],
    ["subjectActionQuestion", "sakura", "kiku"],
    ["possession", "tanaka", "shashin"],
    ["also", "kaban", "hon"],
    ["subjectActionQuestion", "kazoku", "taberu"],
    ["topic", "ane", "tomodachi"],
    ["object", "heya", "miru"],
    ["subjectActionQuestion", "sensei", "kiku"],
    ["possession", "kazoku", "kaban"],
    ["also", "otouto", "gakusei"],
    ["subjectActionQuestion", "chichi", "nomu"],
    ["possession", "sensei", "heya"],
    ["topicQuestion", "kaban", "hon"],
    ["subjectActionQuestion", "haha", "kiku"],
    ["topic", "shashin", "hon"],
    ["subjectActionQuestion", "ane", "miru"],
    ["topicQuestion", "heya", "gakkou"],
    ["subjectActionQuestion", "otouto", "kiku"],
    ["possession", "gakusei", "shashin"],
    ["subjectAction", "kazoku", "nomu"],
    ["topicQuestion", "ane", "namae"],
    ["subjectActionQuestion", "tanaka", "miru"],
    ["possession", "tomodachi", "shashin"],
    ["subjectActionQuestion", "chichi", "kiku"],
    ["topicQuestion", "chichi", "namae"],
    ["subjectActionQuestion", "sakura", "miru"],
    ["possession", "yuki", "heya"],
    ["subjectActionQuestion", "haha", "nomu"],
    ["topicQuestion", "otouto", "gakusei"],
    ["subjectActionQuestion", "watashi", "kiku"],
    ["topicQuestion", "shashin", "kaban"],
    ["subjectActionQuestion", "kazoku", "nomu"],
    ["topicQuestion", "kaban", "shashin"],
    ["subjectActionQuestion", "sensei", "miru"],
    ["topicQuestion", "haha", "namae"],
    ["topicQuestion", "chichi", "tomodachi"],
    ["subjectAction", "ane", "taberu"],
    ["subjectAction", "otouto", "taberu"],
    ["topicQuestion", "yuki", "tomodachi"],
    ["possession", "tanaka", "heya"],
  ];

  for (const row of rows) {
    const [type, ...args] = row;
    if (type === "identity") identity(cards, 3, w(words, args[0]));
    else if (type === "identityQuestion") identityQuestion(cards, 3, w(words, args[0]));
    else if (type === "topic") topic(cards, 3, w(words, args[0]), w(words, args[1]));
    else if (type === "topicQuestion") topicQuestion(cards, 3, w(words, args[0]), w(words, args[1]));
    else if (type === "possession") possession(cards, 3, w(words, args[0]), w(words, args[1]));
    else if (type === "also") also(cards, 3, w(words, args[0]), w(words, args[1]));
    else if (type === "object") objectAction(cards, 3, w(words, args[0]), w(words, args[1]));
    else if (type === "subjectAction") subjectAction(cards, 3, w(words, args[0]), w(words, args[1]));
    else if (type === "subjectActionQuestion") subjectActionQuestion(cards, 3, w(words, args[0]), w(words, args[1]));
    else throw new Error(`Unknown Unit 3 row type ${type}`);
  }
  return cards;
}

function buildUnit4(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const currentRows = [];

  const currentNouns = ["mise", "byouin", "eki", "kaisha", "kodomo", "otona", "isu", "tsukue"];
  const currentPlaces = ["mise", "byouin", "eki", "kaisha"];
  const peopleObjects = ["kodomo", "otona", "isu", "tsukue"];
  const actionRows = [
    ["subjectPlace", "yuki", "mise", "iku", "ni"],
    ["subjectPlace", "tanaka", "byouin", "kuru", "ni"],
    ["subjectPlace", "watashi", "eki", "iku", "ni"],
    ["subjectPlace", "sakura", "kaisha", "kuru", "ni"],
    ["subjectPlace", "sensei", "mise", "kuru", "ni"],
    ["subjectPlace", "gakusei", "byouin", "iku", "ni"],
    ["subjectPlace", "tomodachi", "eki", "kuru", "ni"],
    ["subjectPlace", "isha", "kaisha", "iku", "ni"],
    ["subjectPlace", "watashi", "mise", "iku", "ni"],
    ["subjectPlace", "sakura", "byouin", "kuru", "ni"],
    ["subjectPlace", "yuki", "eki", "iku", "ni"],
    ["subjectPlace", "tanaka", "kaisha", "kuru", "ni"],
    ["subjectPlace", "sensei", "eki", "kuru", "ni"],
    ["subjectPlace", "gakusei", "kaisha", "iku", "ni"],
    ["subjectPlace", "tomodachi", "mise", "kuru", "ni"],
    ["subjectPlace", "isha", "byouin", "iku", "ni"],
  ];

  const skippedLocationCards = new Set([
    "mise:kodomo:false",
    "mise:otona:true",
    "byouin:otona:false",
    "byouin:isu:true",
    "eki:isu:false",
    "eki:tsukue:true",
    "kaisha:tsukue:false",
    "kaisha:kodomo:true",
  ]);
  const positiveLocationRows = [];
  const negativeLocationRows = [];
  for (const placeId of currentPlaces) {
    for (const itemId of peopleObjects) {
      for (const negative of [false, true]) {
        if (!skippedLocationCards.has(`${placeId}:${itemId}:${negative}`)) {
          const row = [negative ? "locatedAbsent" : "located", placeId, itemId];
          if (negative) negativeLocationRows.push(row);
          else positiveLocationRows.push(row);
        }
      }
    }
  }

  for (const id of currentNouns) currentRows.push(["exist", id]);
  currentRows.push(...actionRows.slice(0, 6));
  currentRows.push(...positiveLocationRows.slice(0, 6));
  currentRows.push(...actionRows.slice(6, 12));
  currentRows.push(...negativeLocationRows.slice(0, 6));
  currentRows.push(...positiveLocationRows.slice(6));
  currentRows.push(...actionRows.slice(12));
  currentRows.push(...negativeLocationRows.slice(6));
  for (const id of peopleObjects) currentRows.push(["absent", id]);

  const reviewRows = [
    ["exist", "neko"],
    ["exist", "inu"],
    ["absent", "neko"],
    ["absent", "inu"],
    ["possession", "watashi", "neko"],
    ["possession", "sakura", "inu"],
    ["topic", "neko", "doubutsu"],
    ["topic", "inu", "doubutsu"],
    ["topicQuestion", "neko", "doubutsu"],
    ["topicQuestion", "inu", "doubutsu"],
    ["identity", "doubutsu"],

    ["exist", "ie"],
    ["exist", "gakkou"],
    ["absent", "ie"],
    ["absent", "gakkou"],
    ["possession", "watashi", "ie"],
    ["possession", "sensei", "gakkou"],
    ["subjectPlace", "watashi", "ie", "iku", "ni"],
    ["subjectPlace", "sakura", "gakkou", "kuru", "ni"],
    ["topicQuestion", "ie", "basho"],
    ["topicQuestion", "gakkou", "basho"],
    ["identity", "basho"],
    ["identityQuestion", "basho"],
    ["possession", "watashi", "basho"],

    ["object", "hon", "yomu"],
    ["object", "hon", "kaku"],
    ["subjectObject", "isha", "hon", "yomu"],
    ["subjectObject", "isha", "hon", "kaku"],
    ["subjectObject", "sensei", "hon", "yomu"],
    ["subjectObject", "gakusei", "hon", "kaku"],
    ["subjectAction", "isha", "yomu"],
    ["subjectAction", "isha", "kaku"],
    ["subjectObjectQuestion", "isha", "hon", "yomu"],
    ["subjectObjectQuestion", "isha", "hon", "kaku"],
  ];

  for (const row of [...currentRows.slice(0, 40), ...reviewRows, ...currentRows.slice(40)]) addFoundationRow(cards, 4, words, row);

  return cards;
}

function interleaveRows(primaryRows, supportRows, primaryChunkSize = 2) {
  const rows = [];
  let primaryIndex = 0;
  let supportIndex = 0;
  while (primaryIndex < primaryRows.length || supportIndex < supportRows.length) {
    for (let index = 0; index < primaryChunkSize && primaryIndex < primaryRows.length; index += 1) {
      rows.push(primaryRows[primaryIndex]);
      primaryIndex += 1;
    }
    if (supportIndex < supportRows.length) {
      rows.push(supportRows[supportIndex]);
      supportIndex += 1;
    }
  }
  return rows;
}

function particleById(id) {
  if (id === "de") return g.de();
  if (id === "ni") return g.ni();
  throw new Error(`Unknown particle ${id}`);
}

function addFoundationRow(cards, unitId, words, row) {
  const [type, ...args] = row;
  if (type === "identity") identity(cards, unitId, w(words, args[0]));
  else if (type === "identityQuestion") identityQuestion(cards, unitId, w(words, args[0]));
  else if (type === "topic") topic(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "topicQuestion") topicQuestion(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "negative") negativeTopic(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "exist") existence(cards, unitId, w(words, args[0]));
  else if (type === "absent") existence(cards, unitId, w(words, args[0]), true);
  else if (type === "located") locatedExistence(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "locatedAbsent") locatedExistence(cards, unitId, w(words, args[0]), w(words, args[1]), true);
  else if (type === "past") pastTopic(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "pastQuestion") pastTopicQuestion(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "pastIdentity") pastIdentity(cards, unitId, w(words, args[0]));
  else if (type === "possession") possession(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "also") also(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "object") objectAction(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "subjectAction") subjectAction(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "subjectActionQuestion") subjectActionQuestion(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "subjectObject") subjectObjectAction(cards, unitId, w(words, args[0]), w(words, args[1]), w(words, args[2]));
  else if (type === "determinerObject") determinerObjectAction(cards, unitId, w(words, args[0]), w(words, args[1]), w(words, args[2]), w(words, args[3]));
  else if (type === "subjectObjectQuestion") subjectObjectActionQuestion(cards, unitId, w(words, args[0]), w(words, args[1]), w(words, args[2]));
  else if (type === "subjectPlace") subjectPlaceAction(cards, unitId, w(words, args[0]), w(words, args[1]), w(words, args[2]), particleById(args[3]));
  else if (type === "subjectTime") subjectTimeAction(cards, unitId, w(words, args[0]), w(words, args[1]), w(words, args[2]));
  else if (type === "demonstrative") demonstrativeTopic(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "determiner") determinerIdentity(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "questionWord") questionWordCard(cards, unitId, words, args[0], args[1]);
  else if (type === "whichNoun") whichNounCard(cards, unitId, words, args[0], args[1]);
  else throw new Error(`Unknown foundation row type ${type}`);
}

function buildUnit5(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];

  const rows = [
    // Pairing notes: dates fit events/jobs/rest; morning/night fit repeated actions.
    // Family and Unit 1 people are the SRS cushion, not a detached review block.
    ["pastIdentity", "kinou"],
    ["subjectAction", "watashi", "taberu"],
    ["pastIdentity", "sengetsu"],
    ["subjectAction", "watashi", "benkyou_suru"],
    ["pastIdentity", "kyonen"],
    ["subjectActionQuestion", "sakura", "nomu"],
    ["pastIdentity", "asa"],
    ["subjectAction", "sakura", "hataraku"],
    ["pastIdentity", "yoru"],
    ["possession", "haha", "shashin"],
    ["pastIdentity", "yasumi"],
    ["subjectTime", "yuki", "asa", "hataraku"],
    ["pastIdentity", "ryokou"],
    ["possession", "chichi", "kaban"],
    ["pastIdentity", "shigoto"],
    ["subjectTime", "tanaka", "yoru", "benkyou_suru"],
    ["past", "sengetsu", "shigoto"],
    ["subjectActionQuestion", "sensei", "kiku"],
    ["past", "kyonen", "ryokou"],
    ["subjectAction", "tomodachi", "miru"],
    ["past", "ryokou", "kinou"],
    ["possession", "ane", "heya"],
    ["subjectTime", "haha", "asa", "hataraku"],
    ["subjectAction", "otouto", "taberu"],
    ["past", "shigoto", "sengetsu"],
    ["possession", "watashi", "kazoku"],
    ["subjectTime", "chichi", "yoru", "benkyou_suru"],
    ["subjectActionQuestion", "namae", "nomu"],
    ["past", "yasumi", "kyonen"],
    ["possession", "sakura", "shashin"],
    ["subjectTime", "ane", "asa", "benkyou_suru"],
    ["object", "kaban", "miru"],
    ["pastQuestion", "ryokou", "kinou"],
    ["possession", "yuki", "heya"],
    ["subjectTime", "otouto", "yoru", "hataraku"],
    ["subjectActionQuestion", "tanaka", "kiku"],
    ["pastQuestion", "shigoto", "sengetsu"],
    ["possession", "tomodachi", "kaban"],
    ["subjectTime", "gakusei", "asa", "benkyou_suru"],
    ["object", "shashin", "miru"],
    ["pastQuestion", "yasumi", "kyonen"],
    ["possession", "kazoku", "shashin"],
    ["pastQuestion", "kinou", "yasumi"],
    ["subjectAction", "sensei", "nomu"],
    ["past", "ryokou", "sengetsu"],
    ["possession", "tanaka", "heya"],
    ["subjectTime", "sakura", "asa", "benkyou_suru"],
    ["subjectActionQuestion", "haha", "kiku"],
    ["past", "shigoto", "kyonen"],
    ["possession", "namae", "kaban"],
    ["pastQuestion", "kyonen", "shigoto"],
    ["subjectAction", "chichi", "miru"],
    ["past", "yasumi", "kinou"],
    ["possession", "otouto", "shashin"],
    ["pastQuestion", "kyonen", "ryokou"],
    ["subjectActionQuestion", "ane", "nomu"],
    ["pastQuestion", "ryokou", "sengetsu"],
    ["possession", "gakusei", "heya"],
    ["subjectTime", "tomodachi", "yoru", "hataraku"],
    ["subjectAction", "sensei", "taberu"],
    ["pastQuestion", "shigoto", "kyonen"],
    ["possession", "kazoku", "kaban"],
    ["possession", "namae", "heya"],
    ["subjectActionQuestion", "otouto", "miru"],
    ["pastQuestion", "yasumi", "kinou"],
    ["possession", "watashi", "heya"],
    ["subjectPlace", "chichi", "kaisha", "hataraku", "de"],
    ["subjectAction", "sakura", "taberu"],
    ["past", "ryokou", "kyonen"],
    ["possession", "sakura", "kazoku"],
    ["subjectPlace", "ane", "gakkou", "benkyou_suru", "de"],
    ["subjectActionQuestion", "yuki", "kiku"],
    ["past", "shigoto", "kinou"],
    ["possession", "tanaka", "shashin"],
    ["subjectPlace", "otouto", "heya", "benkyou_suru", "de"],
    ["subjectAction", "tomodachi", "nomu"],
    ["past", "yasumi", "sengetsu"],
    ["possession", "yuki", "kaban"],
    ["subjectPlace", "watashi", "ie", "hataraku", "de"],
    ["subjectActionQuestion", "gakusei", "taberu"],
    ["pastQuestion", "ryokou", "kyonen"],
    ["subjectPlace", "sakura", "mise", "hataraku", "de"],
    ["subjectTime", "sensei", "yoru", "benkyou_suru"],
    ["subjectAction", "chichi", "kiku"],
    ["pastQuestion", "shigoto", "kinou"],
    ["subjectPlace", "yuki", "kaisha", "hataraku", "de"],
    ["subjectTime", "tomodachi", "asa", "benkyou_suru"],
    ["possession", "namae", "kazoku"],
    ["pastQuestion", "yasumi", "sengetsu"],
    ["subjectPlace", "tanaka", "gakkou", "benkyou_suru", "de"],
    ["subjectTime", "kazoku", "yoru", "hataraku"],
    ["subjectTime", "namae", "yoru", "nomu"],
    ["subjectAction", "haha", "taberu"],
    ["pastQuestion", "sengetsu", "ryokou"],
    ["subjectPlace", "gakusei", "ie", "benkyou_suru", "de"],
    ["subjectTime", "otouto", "asa", "hataraku"],
    ["subjectActionQuestion", "yuki", "nomu"],
  ];

  for (const row of rows) addFoundationRow(cards, 5, words, row);
  return cards;
}

function demonstrativeTopic(cards, unitId, demonstrative, noun) {
  const english = demonstrative.id === "kore" || demonstrative.id === "kono" ? "this" : demonstrative.id === "sore" || demonstrative.id === "sono" ? "that near you" : "that over there";
  add(cards, unitId, [token(demonstrative), g.wa(), token(noun), g.desu()], `${sentenceStart(english)} is ${indefinite(noun)}`, ["kore/sore/are", "AはBです"]);
}

function determinerIdentity(cards, unitId, determiner, noun) {
  const nounText = bareMeaning(noun);
  const english =
    determiner.id === "kono" ? `this ${nounText}` : determiner.id === "sono" ? `that ${nounText} near you` : `that ${nounText} over there`;
  add(cards, unitId, [token(determiner), token(noun), g.desu()], `It is ${english}`, ["kono/sono/ano N"]);
}

function buildUnit6(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];

  const rows = [
    // Pairing notes: buy drinkable/portable things; use tools/objects/water.
    // Demonstratives and determiners stay anchored to visible nouns and places.
    ["demonstrative", "kore", "hon"],
    ["identity", "mizu"],
    ["demonstrative", "sore", "kaban"],
    ["identity", "ocha"],
    ["demonstrative", "are", "gakkou"],
    ["object", "hon", "kau"],
    ["determiner", "kono", "hon"],
    ["object", "tsukue", "tsukau"],
    ["determiner", "sono", "gakkou"],
    ["determiner", "ano", "ie"],
    ["topic", "neko", "doubutsu"],
    ["demonstrative", "kore", "mizu"],
    ["exist", "mise"],
    ["determiner", "kono", "ocha"],
    ["topicQuestion", "inu", "doubutsu"],
    ["subjectObject", "sakura", "mizu", "kau"],
    ["exist", "kodomo"],
    ["demonstrative", "sore", "ocha"],
    ["subjectPlace", "sakura", "byouin", "kuru", "ni"],
    ["determiner", "sono", "mizu"],
    ["exist", "ie"],
    ["demonstrative", "kore", "neko"],
    ["absent", "otona"],
    ["demonstrative", "are", "mizu"],
    ["subjectObject", "tanaka", "kaban", "tsukau"],
    ["determiner", "ano", "ocha"],
    ["topic", "basho", "ie"],
    ["determiner", "sono", "neko"],
    ["subjectPlace", "yuki", "eki", "iku", "ni"],
    ["demonstrative", "kore", "ocha"],
    ["subjectObject", "gakusei", "tsukue", "kau"],
    ["determiner", "kono", "mizu"],
    ["topicQuestion", "gakkou", "basho"],
    ["determiner", "ano", "basho"],
    ["subjectPlace", "tanaka", "kaisha", "kuru", "ni"],
    ["demonstrative", "sore", "tsukue"],
    ["subjectObject", "isha", "tsukue", "tsukau"],
    ["determiner", "sono", "ocha"],
    ["determiner", "ano", "kodomo"],
    ["demonstrative", "kore", "isha"],
    ["absent", "kodomo"],
    ["demonstrative", "are", "ocha"],
    ["subjectObjectQuestion", "sakura", "kaban", "tsukau"],
    ["determiner", "ano", "mizu"],
    ["subjectAction", "otona", "kaku"],
    ["subjectPlace", "yuki", "mise", "iku", "ni"],
    ["subjectPlace", "otona", "eki", "kuru", "ni"],
    ["demonstrative", "kore", "mise"],
    ["exist", "isu"],
    ["determiner", "kono", "kaban"],
    ["subjectObject", "sensei", "hon", "kaku"],
    ["subjectObjectQuestion", "gakusei", "ocha", "kau"],
    ["demonstrative", "sore", "gakkou"],
    ["demonstrative", "sore", "byouin"],
    ["subjectObjectQuestion", "tomodachi", "isu", "tsukau"],
    ["determiner", "sono", "mise"],
    ["subjectPlace", "isha", "kaisha", "iku", "ni"],
    ["subjectAction", "isha", "yomu"],
    ["demonstrative", "are", "eki"],
    ["subjectObjectQuestion", "watashi", "ocha", "kau"],
    ["determiner", "ano", "tsukue"],
    ["subjectObjectQuestion", "watashi", "mizu", "tsukau"],
    ["located", "gakkou", "neko"],
    ["subjectAction", "kodomo", "yomu"],
    ["demonstrative", "kore", "tsukue"],
    ["subjectActionQuestion", "kodomo", "yomu"],
    ["determiner", "kono", "isu"],
    ["determiner", "kono", "kaisha"],
    ["exist", "tsukue"],
    ["determiner", "sono", "otona"],
    ["demonstrative", "sore", "isu"],
    ["subjectObject", "sensei", "mizu", "kau"],
    ["determiner", "sono", "byouin"],
    ["subjectPlace", "kodomo", "eki", "iku", "ni"],
    ["subjectObjectQuestion", "gakusei", "kaban", "tsukau"],
    ["topic", "inu", "doubutsu"],
    ["demonstrative", "are", "tsukue"],
    ["demonstrative", "are", "neko"],
    ["determiner", "ano", "eki"],
    ["subjectPlace", "otona", "mise", "kuru", "ni"],
    ["subjectObject", "watashi", "mizu", "tsukau"],
    ["topicQuestion", "neko", "doubutsu"],
    ["demonstrative", "kore", "byouin"],
    ["subjectObject", "sakura", "ocha", "kau"],
    ["determiner", "kono", "mise"],
    ["subjectActionQuestion", "yuki", "yomu"],
    ["subjectActionQuestion", "tanaka", "kaku"],
    ["demonstrative", "are", "inu"],
    ["demonstrative", "sore", "kaisha"],
    ["determiner", "kono", "basho"],
    ["determiner", "sono", "kaisha"],
    ["demonstrative", "sore", "inu"],
    ["subjectObject", "gakusei", "isu", "tsukau"],
    ["subjectActionQuestion", "kodomo", "kaku"],
    ["demonstrative", "are", "ie"],
    ["subjectObject", "tomodachi", "ocha", "kau"],
    ["determiner", "ano", "byouin"],
  ];

  for (const row of rows) addFoundationRow(cards, 6, words, row);
  return cards;
}

function questionWordCard(cards, unitId, words, questionId, contextId) {
  const context = w(words, contextId);
  const question = w(words, questionId);
  const questionSubject =
    context.id === "watashi" ? "am I" : context.id === "sakura" ? "are you" : `is ${subject(context)}`;
  if (questionId === "nan") add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], `What ${questionSubject}?`, ["nan", "A\u306fB\u3067\u3059\u304b"]);
  else if (questionId === "dare") add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], `Who ${questionSubject}?`, ["dare", "A\u306fB\u3067\u3059\u304b"]);
  else if (questionId === "dore") add(cards, unitId, [token(question), g.ga(), token(context), g.desu(), g.ka(), g.q()], `Which one is ${indefinite(context)}?`, ["dore", "\u304b"]);
}

function whichNounCard(cards, unitId, words, determinerId, nounId) {
  add(cards, unitId, [token(w(words, determinerId)), token(w(words, nounId)), g.desu(), g.ka(), g.q()], `Which ${bareMeaning(w(words, nounId))} is it?`, ["dono N", "か"]);
}

function buildUnit7(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];

  const rows = [
    // Pairing notes: question words need answerable contexts; food/drink need verbs.
    // Unit 5 time words support talk/wait actions without becoming a detached review wall.
    ["questionWord", "nan", "watashi"],
    ["past", "ryokou", "kinou"],
    ["questionWord", "dare", "yuki"],
    ["subjectAction", "haha", "kiku"],
    ["topicQuestion", "otokonohito", "sensei"],
    ["possession", "chichi", "kaban"],
    ["subjectAction", "watashi", "hanasu"],
    ["past", "shigoto", "sengetsu"],
    ["questionWord", "dore", "hon"],
    ["subjectTime", "sakura", "asa", "hataraku"],
    ["whichNoun", "dono", "hon"],
    ["possession", "ane", "heya"],
    ["subjectPlace", "sakura", "eki", "matsu", "de"],
    ["past", "yasumi", "kyonen"],
    ["topicQuestion", "onnanohito", "gakusei"],
    ["subjectActionQuestion", "otouto", "miru"],
    ["identity", "tabemono"],
    ["subjectTime", "yuki", "yoru", "benkyou_suru"],
    ["identity", "nomimono"],
    ["possession", "kazoku", "shashin"],
    ["questionWord", "nan", "sensei"],
    ["subjectActionQuestion", "haha", "kiku"],
    ["pastQuestion", "ryokou", "kinou"],
    ["questionWord", "dare", "haha"],
    ["subjectPlace", "onnanohito", "heya", "matsu", "de"],
    ["subjectAction", "chichi", "kiku"],
    ["questionWord", "dore", "ie"],
    ["subjectTime", "tanaka", "asa", "hataraku"],
    ["whichNoun", "dono", "ocha"],
    ["subjectObjectQuestion", "otokonohito", "tabemono", "taberu"],
    ["subjectObject", "sakura", "tabemono", "taberu"],
    ["pastQuestion", "shigoto", "sengetsu"],
    ["subjectActionQuestion", "onnanohito", "hanasu"],
    ["subjectTime", "ane", "yoru", "benkyou_suru"],
    ["questionWord", "nan", "otokonohito"],
    ["possession", "otouto", "heya"],
    ["subjectPlace", "otokonohito", "mise", "matsu", "de"],
    ["pastQuestion", "yasumi", "kyonen"],
    ["questionWord", "dare", "onnanohito"],
    ["object", "nomimono", "nomu"],
    ["whichNoun", "dono", "tabemono"],
    ["subjectTime", "haha", "asa", "hataraku"],
    ["subjectAction", "kazoku", "hanasu"],
    ["topicQuestion", "mizu", "nomimono"],
    ["questionWord", "dore", "nomimono"],
    ["subjectAction", "chichi", "hanasu"],
    ["subjectObjectQuestion", "watashi", "tabemono", "taberu"],
    ["subjectTime", "otouto", "yoru", "benkyou_suru"],
    ["whichNoun", "dono", "heya"],
    ["subjectActionQuestion", "otokonohito", "hanasu"],
    ["past", "ryokou", "sengetsu"],
    ["questionWord", "nan", "gakusei"],
    ["subjectPlace", "haha", "byouin", "matsu", "de"],
    ["object", "shashin", "miru"],
    ["questionWord", "dare", "chichi"],
    ["subjectObject", "yuki", "nomimono", "nomu"],
    ["whichNoun", "dono", "kaban"],
    ["subjectTime", "kazoku", "asa", "hataraku"],
    ["questionWord", "dore", "shashin"],
    ["subjectAction", "onnanohito", "hanasu"],
    ["past", "shigoto", "kyonen"],
    ["subjectPlace", "ane", "eki", "matsu", "de"],
    ["possession", "otouto", "kaban"],
    ["questionWord", "nan", "tomodachi"],
    ["subjectObjectQuestion", "sakura", "tabemono", "taberu"],
    ["whichNoun", "dono", "mizu"],
    ["subjectTime", "tomodachi", "yoru", "benkyou_suru"],
    ["questionWord", "dare", "kazoku"],
    ["subjectActionQuestion", "otouto", "hanasu"],
    ["object", "kaban", "miru"],
    ["questionWord", "dore", "kaban"],
    ["questionWord", "dore", "tabemono"],
    ["past", "yasumi", "kinou"],
    ["topicQuestion", "ocha", "nomimono"],
    ["subjectTime", "watashi", "asa", "hataraku"],
    ["questionWord", "nan", "onnanohito"],
    ["subjectPlace", "kazoku", "ie", "matsu", "de"],
    ["subjectActionQuestion", "ane", "kiku"],
    ["questionWord", "dare", "otokonohito"],
    ["subjectObject", "tanaka", "tabemono", "taberu"],
    ["whichNoun", "dono", "ie"],
    ["subjectTime", "sakura", "yoru", "benkyou_suru"],
    ["questionWord", "dore", "mizu"],
    ["subjectPlace", "onnanohito", "kaisha", "matsu", "de"],
    ["possession", "kazoku", "heya"],
    ["questionWord", "nan", "kazoku"],
    ["subjectAction", "otokonohito", "hanasu"],
    ["whichNoun", "dono", "nomimono"],
    ["subjectTime", "chichi", "asa", "hataraku"],
    ["questionWord", "dare", "tomodachi"],
    ["subjectObjectQuestion", "yuki", "nomimono", "nomu"],
    ["subjectPlace", "otokonohito", "eki", "matsu", "de"],
    ["pastQuestion", "ryokou", "sengetsu"],
    ["questionWord", "dore", "ocha"],
    ["subjectTime", "haha", "yoru", "benkyou_suru"],
    ["subjectAction", "onnanohito", "miru"],
    ["questionWord", "nan", "otouto"],
    ["questionWord", "dare", "ane"],
    ["pastQuestion", "yasumi", "kinou"],
    ["pastQuestion", "shigoto", "kyonen"],
  ];

  for (const row of rows) addFoundationRow(cards, 7, words, row);
  return cards;
}

function whereQuestion(cards, unitId, words, targetId) {
  const target = w(words, targetId);
  add(cards, unitId, [token(target), g.wa(), token(w(words, "doko")), g.desu(), g.ka(), g.q()], `Where is ${subject(target)}?`, [
    "どこ",
    "AはBですか",
  ]);
}

function placeAnswer(cards, unitId, words, targetId, placeId) {
  const target = w(words, targetId);
  const place = w(words, placeId);
  add(cards, unitId, [token(target), g.wa(), token(place), g.desu()], `${sentenceStart(subject(target))} is ${placePhrase(place, "at")}`, [
    "simple place answer",
  ]);
}

function demonstrativePlace(cards, unitId, words, demonstrativeId, placeId) {
  const demonstrative = w(words, demonstrativeId);
  const place = w(words, placeId);
  const label = demonstrative.id === "kore" ? "This" : demonstrative.id === "sore" ? "That near you" : "That over there";
  add(cards, unitId, [token(demonstrative), g.wa(), token(place), g.desu()], `${label} is ${placePhrase(place, "at")}`, [
    "kore/sore/are",
    "simple place answer",
  ]);
}

function whenQuestion(cards, unitId, words, eventId) {
  const event = w(words, eventId);
  add(cards, unitId, [token(event), g.wa(), token(w(words, "itsu")), g.desu(), g.ka(), g.q()], `When is ${subject(event)}?`, [
    "いつ",
    "AはBですか",
  ]);
}

function whenActionQuestion(cards, unitId, words, actorId, placeId, verbId) {
  const actor = w(words, actorId);
  const place = w(words, placeId);
  const verb = w(words, verbId);
  const action = verbForms.get(verb.id)[2];
  const question = actor.id === "watashi" || actor.id === "sakura" ? "do" : "does";
  add(cards, unitId, [token(actor), g.wa(), token(w(words, "itsu")), token(place), g.ni(), verbToken(verb), g.ka(), g.q()], `When ${question} ${questionSubject(actor)} ${action} ${placePhrase(place, "to")}?`, [
    "いつ",
    "early Vます action",
  ]);
}

function timeAnswer(cards, unitId, words, eventId, timeId) {
  const event = w(words, eventId);
  const time = w(words, timeId);
  add(cards, unitId, [token(event), g.wa(), token(time), g.desu()], `${sentenceStart(subject(event))} is ${timePhrase(time)}`, [
    "simple time answer",
  ]);
}

function weatherStatement(cards, unitId, words, timeId, weatherId, endingId) {
  const time = w(words, timeId);
  const weather = w(words, weatherId);
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "isn't it" : "you know";
  const descriptor = weatherAdjectives.get(weather.id) ?? bareMeaning(weather);
  const english = weather.id === "tenki" ? `The weather is ${timePhrase(time)}, ${tail}` : `It is ${descriptor} ${timePhrase(time)}, ${tail}`;
  add(cards, unitId, [token(time), g.wa(), token(weather), g.desu(), ending], english, ["ね/よ", ending.surface]);
}

function weatherBare(cards, unitId, words, weatherId, endingId) {
  const weather = w(words, weatherId);
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "isn't it" : "you know";
  const descriptor = weatherAdjectives.get(weather.id) ?? bareMeaning(weather);
  const english = weather.id === "tenki" ? `It is the weather, ${tail}` : `It is ${descriptor}, ${tail}`;
  add(cards, unitId, [token(weather), g.desu(), ending], english, ["ね/よ", ending.surface]);
}

function weatherTopic(cards, unitId, words, weatherId, endingId) {
  const weather = w(words, weatherId);
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "isn't it" : "you know";
  const descriptor = weatherAdjectives.get(weather.id) ?? bareMeaning(weather);
  add(cards, unitId, [token(w(words, "tenki")), g.wa(), token(weather), g.desu(), ending], `The weather is ${descriptor}, ${tail}`, ["ね/よ", ending.surface]);
}

function placeAnswerEnding(cards, unitId, words, targetId, placeId, endingId) {
  const target = w(words, targetId);
  const place = w(words, placeId);
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "isn't it" : "you know";
  add(cards, unitId, [token(target), g.wa(), token(place), g.desu(), ending], `${sentenceStart(subject(target))} is ${placePhrase(place, "at")}, ${tail}`, ["ね/よ", ending.surface]);
}

function subjectActionEnding(cards, unitId, words, actorId, verbId, endingId) {
  const actor = w(words, actorId);
  const verb = w(words, verbId);
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "right" : "you know";
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  add(cards, unitId, [token(actor), g.wa(), verbToken(verb), ending], `${sentenceStart(subject(actor))} ${action}, ${tail}`, ["ね/よ", "early Vます action"]);
}

function subjectObjectActionEnding(cards, unitId, words, actorId, objectId, verbId, endingId) {
  const actor = w(words, actorId);
  const object = w(words, objectId);
  const verb = w(words, verbId);
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "right" : "you know";
  const form = verbForms.get(verb.id);
  const action = actor.id === "watashi" || actor.id === "sakura" ? form[2] : form[3];
  const actionText = verb.id === "miru" ? `${action} at` : verb.id === "kiku" ? `${action} to` : action;
  add(cards, unitId, [token(actor), g.wa(), token(object), g.wo(), verbToken(verb), ending], `${sentenceStart(subject(actor))} ${actionText} ${indefinite(object)}, ${tail}`, [
    "ね/よ",
    "NをVます",
  ]);
}

function pastTopicEnding(cards, unitId, words, leftId, rightId, endingId) {
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "right" : "you know";
  const left = w(words, leftId);
  const right = w(words, rightId);
  add(cards, unitId, [token(left), g.wa(), token(right), g.deshita(), ending], `${pastClause(left, right)}, ${tail}`, ["ね/よ", "Aでした"]);
}

function endingTopic(cards, unitId, words, leftId, rightId, endingId) {
  const ending = endingId === "ne" ? g.ne() : g.yo();
  const tail = endingId === "ne" ? "isn't it" : "you know";
  const clause = presentClause(w(words, leftId), w(words, rightId));
  add(cards, unitId, [token(w(words, leftId)), g.wa(), token(w(words, rightId)), g.desu(), ending], `${clause}, ${tail}`, ["ね/よ", ending.surface]);
}

function iAdjectiveForm(word, form) {
  const surfaceStem = word.surface.slice(0, -1);
  const readingStem = word.reading.slice(0, -1);
  if (form === "present") return { surface: word.surface, reading: word.reading, explain: word.meaning, wordId: word.id };
  if (form === "negative") return { surface: `${surfaceStem}くない`, reading: `${readingStem}くない`, explain: `not ${bareMeaning(word)}`, wordId: word.id };
  if (form === "past") return { surface: `${surfaceStem}かった`, reading: `${readingStem}かった`, explain: `was ${bareMeaning(word)}`, wordId: word.id };
  if (form === "negativePast") return { surface: `${surfaceStem}くなかった`, reading: `${readingStem}くなかった`, explain: `was not ${bareMeaning(word)}`, wordId: word.id };
  throw new Error(`Unknown i-adjective form ${form}`);
}

function iAdjectiveNoun(cards, unitId, words, adjectiveId, nounId) {
  const adjective = w(words, adjectiveId);
  const noun = w(words, nounId);
  add(cards, unitId, [iAdjectiveForm(adjective, "present"), token(noun), g.desu()], `It is ${indefinite({ ...noun, meaning: `${bareMeaning(adjective)} ${bareMeaning(noun)}` })}`, [
    "i-adjective noun",
  ]);
}

function iAdjectivePredicate(cards, unitId, words, nounId, adjectiveId, form = "present") {
  const noun = w(words, nounId);
  const adjective = w(words, adjectiveId);
  const adjectiveToken = iAdjectiveForm(adjective, form);
  const grammarTags = form === "present" ? ["i-adjective predicate"] : [`i-adjective ${form}`];
  const meanings = {
    present: presentBeClause(noun, bareMeaning(adjective)),
    negative: negativeBeClause(noun, bareMeaning(adjective)),
    past: pastBeClause(noun, bareMeaning(adjective)),
    negativePast: pastNegativeBeClause(noun, bareMeaning(adjective)),
  };
  add(cards, unitId, [token(noun), g.wa(), adjectiveToken, g.desu()], meanings[form], grammarTags);
}

function iAdjectiveQuestion(cards, unitId, words, nounId, adjectiveId) {
  const noun = w(words, nounId);
  const adjective = w(words, adjectiveId);
  add(cards, unitId, [token(noun), g.wa(), iAdjectiveForm(adjective, "present"), g.desu(), g.ka(), g.q()], questionBeClause(noun, bareMeaning(adjective)), [
    "i-adjective predicate",
    "か",
  ]);
}

function naAdjectiveForm(word, attributive = false) {
  if (!attributive) return token(word);
  return { surface: `${word.surface}な`, reading: `${word.reading}な`, explain: word.meaning, wordId: word.id };
}

function naAdjectiveNoun(cards, unitId, words, adjectiveId, nounId) {
  const adjective = w(words, adjectiveId);
  const noun = w(words, nounId);
  add(cards, unitId, [naAdjectiveForm(adjective, true), token(noun), g.desu()], `It is ${indefinite({ ...noun, meaning: `${bareMeaning(adjective)} ${bareMeaning(noun)}` })}`, [
    "na-adjective noun",
  ]);
}

function naAdjectivePredicate(cards, unitId, words, nounId, adjectiveId, question = false) {
  const noun = w(words, nounId);
  const adjective = w(words, adjectiveId);
  if (question) {
    add(cards, unitId, [token(noun), g.wa(), naAdjectiveForm(adjective), g.desu(), g.ka(), g.q()], questionBeClause(noun, bareMeaning(adjective)), [
      "na-adjective predicate",
      "か",
    ]);
  } else {
    add(cards, unitId, [token(noun), g.wa(), naAdjectiveForm(adjective), g.desu()], presentBeClause(noun, bareMeaning(adjective)), [
      "na-adjective predicate",
    ]);
  }
}

function naAdjectivePredicateForm(cards, unitId, words, nounId, adjectiveId, form = "negative") {
  const noun = w(words, nounId);
  const adjective = w(words, adjectiveId);
  const meanings = {
    negative: negativeBeClause(noun, bareMeaning(adjective)),
    past: pastBeClause(noun, bareMeaning(adjective)),
    negativePast: pastNegativeBeClause(noun, bareMeaning(adjective)),
  };
  const endings = {
    negative: g.dewaArimasen(),
    past: g.deshita(),
    negativePast: g.dewaArimasenDeshita(),
  };
  add(cards, unitId, [token(noun), g.wa(), token(adjective), endings[form]], meanings[form], [`na-adjective ${form}`]);
}

function degreeAdjectivePredicate(cards, unitId, words, nounId, adverbId, adjectiveId, adjectiveKind = "i", negative = false) {
  const noun = w(words, nounId);
  const adverb = w(words, adverbId);
  const adjective = w(words, adjectiveId);
  const adjectiveToken = adjectiveKind === "na" ? naAdjectiveForm(adjective) : iAdjectiveForm(adjective, negative ? "negative" : "present");
  const degreeText = {
    totemo: "very",
    sukoshi: "a little",
    maa_maa: "sort of",
    hontou_ni: "really",
    kanari: "rather",
    chotto: "a little",
  }[adverb.id] ?? bareMeaning(adverb);
  const english = negative
    ? negativeBeClause(noun, `${adverb.id === "zenzen" ? "at all" : "very"} ${bareMeaning(adjective)}`)
    : presentBeClause(noun, `${degreeText} ${bareMeaning(adjective)}`);
  if (negative && adjectiveKind === "na") {
    add(cards, unitId, [token(noun), g.wa(), token(adverb), adjectiveToken, g.dewaArimasen()], english, ["degree adverb", "na-adjective negative"]);
    return;
  }
  add(cards, unitId, [token(noun), g.wa(), token(adverb), adjectiveToken, g.desu()], english, ["degree adverb"]);
}

function temporalAdverbIdentity(cards, unitId, words, adverbId, nounId) {
  const adverb = w(words, adverbId);
  const noun = w(words, nounId);
  const preferredAdjectiveId = adverb.id === "chotto" ? "hen" : "hima";
  const adjectiveId = words.has(preferredAdjectiveId)
    ? preferredAdjectiveId
    : words.has("shizuka")
      ? "shizuka"
      : words.has("ookii")
        ? "ookii"
        : null;
  if (!adjectiveId) throw new Error(`Missing adjective support for temporal adverb ${adverb.id}`);
  const adjective = w(words, adjectiveId);
  const adjectiveToken = adjective.function === "adjectival noun" ? naAdjectiveForm(adjective) : iAdjectiveForm(adjective, "present");
  const degreeText = adverb.id === "mou" ? "already" : adverb.id === "mada" ? "still" : "a little";
  add(cards, unitId, [token(noun), g.wa(), token(adverb), adjectiveToken, g.desu()], presentBeClause(noun, `${degreeText} ${bareMeaning(adjective)}`), [
    "temporal adverb",
  ]);
}

function quantityWord(quantity) {
  return {
    hitotsu: "one",
    futatsu: "two",
    mittsu: "three",
    yottsu: "four",
    itsutsu: "five",
    muttsu: "six",
    nanatsu: "seven",
    yattsu: "eight",
    kokonotsu: "nine",
    too: "ten",
  }[quantity.id] ?? bareMeaning(quantity);
}

function pluralMeaning(word) {
  const meaning = bareMeaning(word);
  if (["fish", "paper"].includes(meaning)) return meaning;
  if (meaning.endsWith("s")) return meaning;
  return `${meaning}s`;
}

function quantityExistence(cards, unitId, words, itemId, quantityId, placeId = null) {
  const item = w(words, itemId);
  const quantity = w(words, quantityId);
  const placeParts = placeId ? [token(w(words, placeId)), g.ni()] : [];
  const placeText = placeId ? ` ${placePhrase(w(words, placeId), "at")}` : "";
  const nounText = quantity.id === "hitotsu" ? bareMeaning(item) : pluralMeaning(item);
  const existential = quantity.id === "hitotsu" ? "There is" : "There are";
  add(cards, unitId, [...placeParts, token(item), g.ga(), token(quantity), g.arimasu()], `${existential} ${quantityWord(quantity)} ${nounText}${placeText}`, [
    "quantity existence",
    "Nがquantityあります",
  ]);
}

function locationPhrase(location) {
  return {
    ue: "on top of",
    shita: "under",
    naka: "inside",
    mae: "in front of",
    ushiro: "behind",
    tonari: "next to",
    migi: "to the right of",
    hidari: "to the left of",
    aida: "between",
    chikaku: "near",
  }[location.id] ?? bareMeaning(location);
}

function relativeExistence(cards, unitId, words, anchorId, locationId, itemId) {
  const anchor = w(words, anchorId);
  const location = w(words, locationId);
  const item = w(words, itemId);
  const ending = isLivingExistenceWord(item) ? g.imasu() : g.arimasu();
  const english = `There is ${indefinite(item)} ${locationPhrase(location)} ${indefinite(anchor)}`;
  add(cards, unitId, [token(anchor), g.no(), token(location), g.ni(), token(item), g.ga(), ending], english, [
    "relative location existence",
  ]);
}

function betweenExistence(cards, unitId, words, firstAnchorId, secondAnchorId, itemId) {
  const firstAnchor = w(words, firstAnchorId);
  const secondAnchor = w(words, secondAnchorId);
  const location = w(words, "aida");
  const item = w(words, itemId);
  const ending = isLivingExistenceWord(item) ? g.imasu() : g.arimasu();
  const english = `There is ${indefinite(item)} between ${indefinite(firstAnchor)} and ${indefinite(secondAnchor)}`;
  add(cards, unitId, [token(firstAnchor), g.to(), token(secondAnchor), g.no(), token(location), g.ni(), token(item), g.ga(), ending], english, [
    "between location existence",
  ]);
}

function sceneDestination(cards, unitId, words, actorId, placeId, verbId = "iku") {
  subjectPlaceAction(cards, unitId, w(words, actorId), w(words, placeId), w(words, verbId), g.ni());
}

function addA1Row(cards, unitId, words, row) {
  const [type, ...args] = row;
  if (type === "where") whereQuestion(cards, unitId, words, args[0]);
  else if (type === "placeAnswer") placeAnswer(cards, unitId, words, args[0], args[1]);
  else if (type === "demonstrativePlace") demonstrativePlace(cards, unitId, words, args[0], args[1]);
  else if (type === "when") whenQuestion(cards, unitId, words, args[0]);
  else if (type === "whenAction") whenActionQuestion(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "timeAnswer") timeAnswer(cards, unitId, words, args[0], args[1]);
  else if (type === "timeAdverbAction") subjectTimeAdverbAction(cards, unitId, w(words, args[0]), w(words, args[1]), w(words, args[2]));
  else if (type === "weather") weatherStatement(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "weatherBare") weatherBare(cards, unitId, words, args[0], args[1]);
  else if (type === "weatherTopic") weatherTopic(cards, unitId, words, args[0], args[1]);
  else if (type === "placeEnding") placeAnswerEnding(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "actionEnding") subjectActionEnding(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "objectEnding") subjectObjectActionEnding(cards, unitId, words, args[0], args[1], args[2], args[3]);
  else if (type === "pastEnding") pastTopicEnding(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "endingTopic") endingTopic(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "iAdjNoun") iAdjectiveNoun(cards, unitId, words, args[0], args[1]);
  else if (type === "iAdj") iAdjectivePredicate(cards, unitId, words, args[0], args[1]);
  else if (type === "iAdjQ") iAdjectiveQuestion(cards, unitId, words, args[0], args[1]);
  else if (type === "iAdjNeg") iAdjectivePredicate(cards, unitId, words, args[0], args[1], "negative");
  else if (type === "iAdjPast") iAdjectivePredicate(cards, unitId, words, args[0], args[1], "past");
  else if (type === "iAdjNegPast") iAdjectivePredicate(cards, unitId, words, args[0], args[1], "negativePast");
  else if (type === "naAdjNoun") naAdjectiveNoun(cards, unitId, words, args[0], args[1]);
  else if (type === "naAdj") naAdjectivePredicate(cards, unitId, words, args[0], args[1]);
  else if (type === "naAdjQ") naAdjectivePredicate(cards, unitId, words, args[0], args[1], true);
  else if (type === "naAdjNeg") naAdjectivePredicateForm(cards, unitId, words, args[0], args[1], "negative");
  else if (type === "naAdjPast") naAdjectivePredicateForm(cards, unitId, words, args[0], args[1], "past");
  else if (type === "naAdjNegPast") naAdjectivePredicateForm(cards, unitId, words, args[0], args[1], "negativePast");
  else if (type === "degreeI") degreeAdjectivePredicate(cards, unitId, words, args[0], args[1], args[2], "i", args[3] === "negative");
  else if (type === "degreeNa") degreeAdjectivePredicate(cards, unitId, words, args[0], args[1], args[2], "na", args[3] === "negative");
  else if (type === "temporalAdverb") temporalAdverbIdentity(cards, unitId, words, args[0], args[1]);
  else if (type === "existence") existence(cards, unitId, w(words, args[0]), args[1] === "negative");
  else if (type === "located") locatedExistence(cards, unitId, w(words, args[0]), w(words, args[1]), args[2] === "negative");
  else if (type === "locatedAbsent") locatedExistence(cards, unitId, w(words, args[0]), w(words, args[1]), true);
  else if (type === "quantityExistence") quantityExistence(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "relativeExistence") relativeExistence(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "betweenExistence") betweenExistence(cards, unitId, words, args[0], args[1], args[2]);
  else if (type === "sceneDestination") sceneDestination(cards, unitId, words, args[0], args[1], args[2] ?? "iku");
  else addFoundationRow(cards, unitId, words, row);
}

function buildUnit8(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const rows = [];
  const placeTargets = ["gakkou", "toshokan", "mise", "byouin", "eki", "kaisha", "ie", "kouen"];
  const answerPlaces = ["koko", "soko", "asoko", "koko", "soko", "asoko", "koko", "soko"];
  const events = ["yasumi", "ryokou", "shigoto", "gakkou", "kouen", "toshokan", "mise", "byouin"];
  const times = ["kyou", "ashita", "ima", "ashita", "ima", "ashita", "kyou", "ima"];
  const actors = ["watashi", "sakura", "yuki", "tanaka", "kodomo", "otona", "sensei", "gakusei"];
  const movingPlaces = ["kouen", "toshokan", "mise", "byouin", "eki", "kaisha", "kouen", "asoko"];
  const verbs = ["iku", "kuru", "iku", "kuru", "iku", "kuru", "iku", "kuru"];
  const items = ["hon", "mizu", "ocha", "isu", "tsukue", "neko", "inu", "kodomo"];
  const actionObjects = ["mizu", "isu", "ocha", "tsukue", "mizu", "isu", "ocha", "tsukue"];
  const objectVerbs = ["kau", "tsukau", "kau", "tsukau", "kau", "tsukau", "kau", "tsukau"];

  for (let index = 0; index < 8; index += 1) {
    rows.push(["where", placeTargets[index]]);
    rows.push(["placeAnswer", placeTargets[(index + 3) % placeTargets.length], answerPlaces[index]]);
    rows.push(["when", events[index]]);
    rows.push(["timeAnswer", events[(index + 2) % events.length], times[index]]);
    rows.push(["subjectPlace", actors[index], movingPlaces[index], verbs[index], "ni"]);
    rows.push(["timeAdverbAction", actors[(index + 2) % actors.length], index === 3 ? "kyou" : times[index], index % 2 === 0 ? "taberu" : "nomu"]);
    rows.push(index % 2 === 0 ? ["located", movingPlaces[index], items[index]] : ["subjectObject", actors[index], actionObjects[index], objectVerbs[index]]);
    rows.push(
      index < 3
        ? ["demonstrative", ["kore", "sore", "are"][index], items[(index + 1) % items.length]]
        : ["determiner", ["kono", "sono", "ano"][index % 3], items[(index + 1) % items.length]],
    );
  }

  const tail = [
    ["where", "koko"],
    ["placeAnswer", "toshokan", "asoko"],
    ["timeAnswer", "yasumi", "ashita"],
    ["timeAnswer", "gakkou", "kyou"],
    ["subjectPlace", "watashi", "toshokan", "iku", "ni"],
    ["subjectPlace", "sakura", "kouen", "kuru", "ni"],
    ["determinerObject", "tanaka", "kono", "ocha", "kau"],
    ["determinerObject", "yuki", "sono", "tsukue", "tsukau"],
    ["where", "soko"],
    ["placeAnswer", "kouen", "koko"],
    ["when", "ashita"],
    ["timeAnswer", "ryokou", "ashita"],
    ["placeAnswer", "kodomo", "soko"],
    ["placeAnswer", "otona", "asoko"],
    ["determinerObject", "gakusei", "ano", "mizu", "kau"],
    ["timeAdverbAction", "sensei", "kyou", "nomu"],
    ["demonstrativePlace", "kore", "koko"],
    ["demonstrativePlace", "sore", "soko"],
    ["demonstrativePlace", "are", "asoko"],
    ["timeAdverbAction", "watashi", "ima", "yomu"],
    ["demonstrativePlace", "kore", "asoko"],
    ["demonstrativePlace", "sore", "koko"],
    ["timeAdverbAction", "sakura", "kyou", "kaku"],
    ["demonstrativePlace", "are", "soko"],
    ["timeAdverbAction", "yuki", "ima", "taberu"],
    ["demonstrativePlace", "kore", "soko"],
    ["demonstrativePlace", "sore", "asoko"],
    ["demonstrativePlace", "are", "koko"],
    ["placeAnswer", "toshokan", "soko"],
    ["determiner", "sono", "mizu"],
    ["determiner", "ano", "ocha"],
    ["whenAction", "sensei", "kouen", "iku"],
    ["where", "tsukue"],
    ["placeAnswer", "kaisha", "soko"],
    ["determinerObject", "otona", "kono", "mizu", "kau"],
    ["determinerObject", "kodomo", "ano", "isu", "kau"],
  ];

  for (const row of [...rows, ...tail]) addA1Row(cards, 8, words, row);
  return cards;
}

function buildUnit9(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const rows = [];
  const weatherIds = ["ame", "yuki_snow", "kaze", "sora"];
  const landscapeIds = ["umi", "yama", "machi", "shima", "kuni"];
  const weatherRowGroups = [];
  const landscapeRowGroups = [];
  const reviewRows = [];

  weatherRowGroups.push([
    ["weatherBare", "tenki", "ne"],
    ...weatherIds.flatMap((weatherId) => [
      ["weatherTopic", weatherId, "ne"],
      ["weatherTopic", weatherId, "yo"],
    ]).slice(0, 7),
  ]);

  for (const [weatherIndex, weatherId] of weatherIds.entries()) {
    const group = [["weatherBare", weatherId, weatherIndex % 2 === 0 ? "ne" : "yo"]];
    const times = ["asa", "yoru", "kyou", "ashita"];
    for (const [timeIndex, timeId] of times.entries()) {
      group.push(["weather", timeId, weatherId, (weatherIndex + timeIndex) % 2 === 0 ? "ne" : "yo"]);
      group.push(["weather", timeId, weatherId, (weatherIndex + timeIndex) % 2 === 0 ? "yo" : "ne"]);
    }
    group.splice(8);
    weatherRowGroups.push(group);
  }

  for (const [landscapeIndex, landscapeId] of landscapeIds.entries()) {
    const group = [];
    const places = ["koko", "soko", "asoko"];
    for (const [placeIndex, placeId] of places.entries()) {
      group.push(["placeEnding", landscapeId, placeId, (landscapeIndex + placeIndex) % 2 === 0 ? "ne" : "yo"]);
      group.push(["placeEnding", landscapeId, placeId, (landscapeIndex + placeIndex) % 2 === 0 ? "yo" : "ne"]);
    }
    group.push(["where", landscapeId]);
    if (landscapeIndex === 0) group.push(["questionWord", "nan", landscapeId]);
    else if (landscapeIndex === 1) group.push(["questionWord", "dore", landscapeId]);
    else group.push(["whichNoun", "dono", landscapeId]);
    landscapeRowGroups.push(group);
  }

  reviewRows.push(
    ["objectEnding", "watashi", "tabemono", "taberu", "ne"],
    ["objectEnding", "sakura", "nomimono", "nomu", "yo"],
    ["actionEnding", "otokonohito", "hanasu", "ne"],
    ["actionEnding", "onnanohito", "matsu", "yo"],
    ["actionEnding", "namae", "hataraku", "yo"],
    ["pastEnding", "ryokou", "kinou", "ne"],
    ["pastEnding", "shigoto", "sengetsu", "yo"],
    ["pastEnding", "yasumi", "kyonen", "ne"],
    ["questionWord", "nan", "tabemono"],
    ["questionWord", "dare", "otokonohito"],
    ["questionWord", "dore", "nomimono"],
    ["whichNoun", "dono", "tabemono"],
    ["actionEnding", "yuki", "hataraku", "yo"],
    ["actionEnding", "tanaka", "benkyou_suru", "ne"],
    ["actionEnding", "gakusei", "benkyou_suru", "yo"],
    ["actionEnding", "sensei", "matsu", "ne"],
    ["pastEnding", "ryokou", "sengetsu", "yo"],
    ["pastEnding", "shigoto", "kyonen", "ne"],
    ["objectEnding", "tomodachi", "tabemono", "taberu", "ne"],
    ["objectEnding", "otokonohito", "nomimono", "nomu", "yo"],
    ["actionEnding", "onnanohito", "hanasu", "ne"],
    ["questionWord", "dare", "sensei"],
    ["actionEnding", "watashi", "hataraku", "ne"],
    ["actionEnding", "sakura", "benkyou_suru", "ne"],
    ["objectEnding", "yuki", "tabemono", "taberu", "yo"],
    ["objectEnding", "tanaka", "nomimono", "nomu", "ne"],
    ["actionEnding", "tomodachi", "hanasu", "yo"],
    ["actionEnding", "sensei", "matsu", "yo"],
    ["pastEnding", "yasumi", "kinou", "yo"],
    ["actionEnding", "gakusei", "kiku", "ne"],
  );

  const currentRows = [];
  const maxCurrentGroupLength = Math.max(...weatherRowGroups.map((group) => group.length), ...landscapeRowGroups.map((group) => group.length));
  for (let index = 0; index < maxCurrentGroupLength; index += 1) {
    for (const group of weatherRowGroups) if (group[index]) currentRows.push(group[index]);
    for (const group of landscapeRowGroups) if (group[index]) currentRows.push(group[index]);
  }

  for (const [index, row] of currentRows.entries()) {
    rows.push(row);
    if (index % 3 === 2 && reviewRows.length > 0) rows.push(reviewRows.shift());
  }
  rows.push(...reviewRows);

  for (const row of rows) addA1Row(cards, 9, words, row);
  return cards;
}

function buildUnit10(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const adjectives = spec.newWords.map((word) => word.id);
  const nouns = ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya", "kouen", "toshokan", "machi", "yama", "umi", "shima", "kaban", "isu", "tsukue", "neko", "inu"];
  const supportRowsA = [
    ["demonstrativePlace", "kore", "koko"],
    ["demonstrativePlace", "sore", "soko"],
    ["demonstrativePlace", "are", "asoko"],
    ["timeAdverbAction", "isha", "kyou", "yomu"],
    ["timeAdverbAction", "gakusei", "ashita", "kaku"],
    ["timeAdverbAction", "neko", "ima", "taberu"],
    ["determinerObject", "watashi", "kono", "mizu", "kau"],
    ["determinerObject", "sakura", "sono", "ocha", "tsukau"],
    ["topic", "neko", "doubutsu"],
    ["where", "basho"],
  ];
  const supportRowsB = [
    ["where", "kouen"],
    ["where", "toshokan"],
    ["whenAction", "isha", "kouen", "iku"],
    ["placeAnswer", "hon", "asoko"],
    ["determiner", "ano", "hon"],
    ["subjectObject", "sensei", "hon", "yomu"],
    ["subjectObject", "gakusei", "hon", "kaku"],
    ["topic", "inu", "doubutsu"],
    ["whenAction", "isha", "toshokan", "kaku"],
    ["determinerObject", "watashi", "kono", "ocha", "kau"],
  ];
  const rowGroups = adjectives.map((adjectiveId, index) => [
    ["iAdj", cycle(nouns, index), adjectiveId],
    ["iAdjNoun", adjectiveId, cycle(nouns, index + 3)],
    ["iAdjQ", cycle(nouns, index + 6), adjectiveId],
    supportRowsA[index],
    ["iAdj", cycle(nouns, index + 9), adjectiveId],
    ["iAdjNoun", adjectiveId, cycle(nouns, index + 1)],
    ["iAdjQ", cycle(nouns, index + 4), adjectiveId],
    supportRowsB[index],
    ["iAdj", cycle(nouns, index + 7), adjectiveId],
    ["iAdjNoun", adjectiveId, cycle(nouns, index + 11)],
  ]);
  const rows = [];
  rows.push(["timeAdverbAction", "watashi", "ashita", "yomu"]);
  rows.push(["timeAdverbAction", "sakura", "ima", "kaku"]);
  for (let passIndex = 0; passIndex < 10; passIndex += 1) {
    for (let groupIndex = 0; groupIndex < rowGroups.length; groupIndex += 1) {
      rows.push(rowGroups[groupIndex][(passIndex + groupIndex) % rowGroups[groupIndex].length]);
    }
  }
  rows.push(
    ["timeAdverbAction", "watashi", "kyou", "yomu"],
    ["timeAdverbAction", "sakura", "ashita", "kaku"],
    ["timeAdverbAction", "yuki", "ima", "taberu"],
    ["demonstrativePlace", "kore", "soko"],
    ["demonstrativePlace", "sore", "asoko"],
    ["demonstrativePlace", "are", "koko"],
    ["determinerObject", "tanaka", "sono", "mizu", "tsukau"],
    ["determiner", "ano", "basho"],
    ["determinerObject", "tomodachi", "kono", "ocha", "kau"],
    ["placeAnswer", "basho", "koko"],
  );
  for (const row of rows) addA1Row(cards, 10, words, row);
  return cards;
}

function buildUnit11(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const adjectives = spec.newWords.map((word) => word.id);
  const nouns = ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya", "kouen", "toshokan", "machi", "yama", "umi", "shima", "kuni", "kaban", "isu", "tsukue", "neko", "inu"];
  const supportRowsA = [
    ["weather", "asa", "ame", "ne"],
    ["weather", "yoru", "yuki_snow", "yo"],
    ["placeEnding", "umi", "koko", "ne"],
    ["placeEnding", "yama", "soko", "yo"],
    ["questionWord", "nan", "tabemono"],
    ["questionWord", "dare", "onnanohito"],
    ["questionWord", "dore", "nomimono"],
    ["whichNoun", "dono", "heya"],
    ["possession", "haha", "kaban"],
    ["actionEnding", "ane", "kiku", "ne"],
  ];
  const supportRowsB = [
    ["weatherTopic", "kaze", "ne"],
    ["weatherTopic", "sora", "yo"],
    ["placeEnding", "machi", "asoko", "ne"],
    ["placeEnding", "shima", "koko", "yo"],
    ["actionEnding", "otokonohito", "hanasu", "ne"],
    ["actionEnding", "onnanohito", "matsu", "yo"],
    ["objectEnding", "otouto", "nomimono", "nomu", "ne"],
    ["objectEnding", "chichi", "tabemono", "taberu", "yo"],
    ["possession", "kazoku", "heya"],
    ["objectEnding", "tomodachi", "kaban", "miru", "yo"],
  ];
  const rowGroups = adjectives.map((adjectiveId, index) => [
    ["iAdjNeg", cycle(nouns, index), adjectiveId],
    ["iAdjPast", cycle(nouns, index + 2), adjectiveId],
    ["iAdjNegPast", cycle(nouns, index + 4), adjectiveId],
    supportRowsA[index],
    ["iAdj", cycle(nouns, index + 6), adjectiveId],
    ["iAdjQ", cycle(nouns, index + 8), adjectiveId],
    ["iAdjPast", cycle(nouns, index + 10), adjectiveId],
    supportRowsB[index],
    ["iAdjNeg", cycle(nouns, index + 12), adjectiveId],
    ["iAdjNegPast", cycle(nouns, index + 14), adjectiveId],
  ]);
  const rows = [];
  for (let passIndex = 0; passIndex < 8; passIndex += 1) {
    for (let groupIndex = 0; groupIndex < rowGroups.length; groupIndex += 1) {
      rows.push(rowGroups[groupIndex][(passIndex + groupIndex) % rowGroups[groupIndex].length]);
    }
  }
  const tailRows = [
    ["weatherTopic", "ame", "yo"],
    ["weatherTopic", "yuki_snow", "ne"],
    ["weatherTopic", "kaze", "yo"],
    ["weatherTopic", "sora", "ne"],
    ["questionWord", "nan", "kazoku"],
    ["questionWord", "dare", "chichi"],
    ["questionWord", "dore", "otouto"],
    ["whichNoun", "dono", "shashin"],
    ["actionEnding", "otokonohito", "hanasu", "yo"],
    ["actionEnding", "ane", "matsu", "ne"],
    ["actionEnding", "haha", "kiku", "yo"],
    ["objectEnding", "chichi", "shashin", "miru", "ne"],
  ];
  rows.push(...tailRows);
  for (let passIndex = 8; passIndex < 10; passIndex += 1) {
    for (let groupIndex = 0; groupIndex < rowGroups.length; groupIndex += 1) {
      rows.push(rowGroups[groupIndex][(passIndex + groupIndex) % rowGroups[groupIndex].length]);
    }
  }
  for (const row of rows) addA1Row(cards, 11, words, row);
  return cards;
}

function buildUnit12(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  const adjectives = spec.newWords.map((word) => word.id);
  const nouns = ["heya", "gakkou", "mise", "byouin", "eki", "kaisha", "kouen", "toshokan", "machi", "kuni", "namae", "sensei", "gakusei", "tomodachi", "kodomo", "otona", "neko", "inu"];
  const iAdjectives = ["ookii", "chiisai", "atarashii", "furui", "takai", "yasui", "nagai", "mijikai", "akai", "shiroi"];
  const supportRowsB = [
    ["where", "asoko"],
    ["whenAction", "otona", "byouin", "kuru"],
    ["timeAnswer", "yasumi", "kyou"],
    ["timeAdverbAction", "isha", "ashita", "yomu"],
    ["placeAnswer", "mise", "koko"],
    ["placeAnswer", "byouin", "soko"],
    ["located", "eki", "isu"],
    ["timeAdverbAction", "kodomo", "ima", "iku"],
    ["subjectPlace", "kodomo", "kouen", "iku", "ni"],
    ["located", "asoko", "tsukue"],
  ];
  const rowGroups = adjectives.map((adjectiveId, index) => [
    ["naAdj", cycle(nouns, index), adjectiveId],
    ["naAdjNoun", adjectiveId, cycle(nouns, index + 2)],
    ["naAdjQ", cycle(nouns, index + 4), adjectiveId],
    ["iAdj", cycle(nouns, index + 1), iAdjectives[index]],
    ["naAdj", cycle(nouns, index + 6), adjectiveId],
    ["naAdjNoun", adjectiveId, cycle(nouns, index + 5)],
    ["naAdjQ", cycle(nouns, index + 7), adjectiveId],
    supportRowsB[index],
    ["naAdj", cycle(nouns, index + 9), adjectiveId],
    ["naAdjNoun", adjectiveId, cycle(nouns, index + 11)],
  ]);
  const rows = [];
  for (let passIndex = 0; passIndex < 9; passIndex += 1) {
    for (let groupIndex = 0; groupIndex < rowGroups.length; groupIndex += 1) {
      rows.push(rowGroups[groupIndex][(passIndex + groupIndex) % rowGroups[groupIndex].length]);
    }
  }
  const tailRows = [
    ["iAdjQ", "koko", "ookii"],
    ["iAdjQ", "soko", "chiisai"],
    ["iAdj", "mise", "atarashii"],
    ["iAdj", "byouin", "furui"],
    ["iAdj", "eki", "takai"],
    ["iAdj", "kaisha", "yasui"],
    ["iAdj", "isu", "nagai"],
    ["iAdj", "tsukue", "mijikai"],
    ["iAdj", "kodomo", "akai"],
    ["iAdj", "otona", "shiroi"],
    ["whenAction", "isha", "mise", "iku"],
    ["timeAdverbAction", "otona", "ashita", "kuru"],
    ["timeAdverbAction", "isha", "ima", "yomu"],
    ["where", "kaisha"],
    ["timeAdverbAction", "watashi", "kyou", "yomu"],
  ];
  rows.push(...tailRows);
  for (let groupIndex = 0; groupIndex < rowGroups.length; groupIndex += 1) {
    rows.push(rowGroups[groupIndex][(9 + groupIndex) % rowGroups[groupIndex].length]);
  }
  for (const row of rows) addA1Row(cards, 12, words, row);
  return cards;
}

function interleaveCurrentAndSupport(currentGroups, supportRows, supportCadence = 3) {
  const rows = [];
  const support = [...supportRows];
  const passes = Math.max(...currentGroups.map((group) => group.length));
  let currentCount = 0;
  for (let passIndex = 0; passIndex < passes; passIndex += 1) {
    for (let groupIndex = 0; groupIndex < currentGroups.length; groupIndex += 1) {
      const row = currentGroups[groupIndex][passIndex];
      if (!row) continue;
      rows.push(row);
      currentCount += 1;
      if (currentCount % supportCadence === 0 && support.length > 0) rows.push(support.shift());
    }
  }
  rows.push(...support);
  return rows;
}

function buildUnit13(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const adjectives = spec.newWords.map((word) => word.id);
  const nouns = [
    "tenki",
    "ame",
    "yuki_snow",
    "kaze",
    "sora",
    "umi",
    "yama",
    "machi",
    "shima",
    "kuni",
    "kinou",
    "sengetsu",
    "kyonen",
    "asa",
    "yoru",
    "yasumi",
    "ryokou",
    "shigoto",
    "watashi",
    "sakura",
    "sensei",
    "gakusei",
    "tomodachi",
    "kazoku",
  ];
  const currentGroups = adjectives.map((adjectiveId, index) => [
    ["naAdjNeg", cycle(nouns, index), adjectiveId],
    ["naAdjPast", cycle(nouns, index + 2), adjectiveId],
    ["naAdjNegPast", cycle(nouns, index + 4), adjectiveId],
    ["naAdjQ", cycle(nouns, index + 6), adjectiveId],
    ["naAdjNeg", cycle(nouns, index + 8), adjectiveId],
    ["naAdjPast", cycle(nouns, index + 10), adjectiveId],
    ["naAdjNegPast", cycle(nouns, index + 12), adjectiveId],
    ["naAdj", cycle(nouns, index + 1), adjectiveId],
  ]);
  const supportRows = [
    ["iAdjNeg", "ie", "atsui"],
    ["iAdjPast", "gakkou", "samui"],
    ["iAdjNegPast", "mise", "isogashii"],
    ["iAdj", "byouin", "tanoshii"],
    ["iAdjNeg", "eki", "muzukashii"],
    ["iAdjPast", "kaisha", "yasashii_easy"],
    ["iAdjNegPast", "tabemono", "oishii"],
    ["iAdj", "asa", "hayai"],
    ["iAdjNeg", "yoru", "osoi"],
    ["iAdjPast", "heya", "akarui"],
    ["iAdjPast", "umi", "atsui"],
    ["iAdjNeg", "yama", "samui"],
    ["iAdj", "machi", "isogashii"],
    ["iAdjPast", "shima", "tanoshii"],
    ["iAdjNeg", "kuni", "muzukashii"],
    ["iAdj", "tenki", "yasashii_easy"],
    ["iAdjPast", "ame", "oishii"],
    ["iAdjNeg", "sora", "hayai"],
    ["iAdj", "yasumi", "osoi"],
    ["iAdjNegPast", "ryokou", "akarui"],
    ["subjectAction", "watashi", "hataraku"],
    ["subjectAction", "sakura", "benkyou_suru"],
    ["subjectAction", "yuki", "hanasu"],
    ["subjectAction", "tanaka", "matsu"],
    ["subjectAction", "sensei", "hataraku"],
    ["subjectAction", "gakusei", "benkyou_suru"],
    ["subjectAction", "tomodachi", "hanasu"],
    ["subjectAction", "kazoku", "matsu"],
    ["subjectObject", "haha", "tabemono", "taberu"],
    ["subjectObject", "chichi", "nomimono", "nomu"],
    ["subjectObject", "ane", "shashin", "miru"],
    ["subjectActionQuestion", "otouto", "kiku"],
  ];
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 3)) addA1Row(cards, 13, words, row);
  return cards;
}

function buildUnit14(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const adverbs = spec.newWords.map((word) => word.id);
  const nouns = ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya", "kouen", "toshokan", "machi", "kuni", "tabemono", "hon", "shashin"];
  const iAdjectives = ["ookii", "chiisai", "atarashii", "furui", "takai", "yasui", "nagai", "mijikai", "akai", "shiroi", "atsui", "samui", "isogashii", "tanoshii", "muzukashii", "yasashii_easy", "oishii", "hayai", "osoi", "akarui"];
  const naAdjectives = ["shizuka", "nigiyaka", "kirei", "genki", "yuumei", "shinsetsu", "kantan", "taisetsu", "anzen", "kiken", "hima", "hen", "suteki", "majime", "teinei", "shitsurei", "fukuzatsu", "tokubetsu", "futsuu", "zannen"];
  const currentGroups = adverbs.map((adverbId, index) => {
    if (["mou", "mada"].includes(adverbId)) {
      return [
        ["temporalAdverb", adverbId, "asa"],
        ["temporalAdverb", adverbId, "yoru"],
        ["temporalAdverb", adverbId, "yasumi"],
        ["temporalAdverb", adverbId, "shigoto"],
        ["temporalAdverb", adverbId, "ryokou"],
        ["temporalAdverb", adverbId, "gakkou"],
        ["temporalAdverb", adverbId, "kaisha"],
        ["temporalAdverb", adverbId, "kuni"],
      ];
    }
    const negative = ["amari", "zenzen"].includes(adverbId);
    return [
      ["degreeI", cycle(nouns, index), adverbId, cycle(iAdjectives, index), negative ? "negative" : "positive"],
      ["degreeNa", cycle(nouns, index + 2), adverbId, cycle(naAdjectives, index), negative ? "negative" : "positive"],
      ["degreeI", cycle(nouns, index + 4), adverbId, cycle(iAdjectives, index + 5), negative ? "negative" : "positive"],
      ["degreeNa", cycle(nouns, index + 6), adverbId, cycle(naAdjectives, index + 5), negative ? "negative" : "positive"],
      ["degreeI", cycle(nouns, index + 8), adverbId, cycle(iAdjectives, index + 10), negative ? "negative" : "positive"],
      ["degreeNa", cycle(nouns, index + 10), adverbId, cycle(naAdjectives, index + 10), negative ? "negative" : "positive"],
      ["degreeI", cycle(nouns, index + 12), adverbId, cycle(iAdjectives, index + 15), negative ? "negative" : "positive"],
      ["degreeNa", cycle(nouns, index + 1), adverbId, cycle(naAdjectives, index + 15), negative ? "negative" : "positive"],
    ];
  });
  const supportRows = [
    ["demonstrative", "are", "ocha"],
    ["demonstrative", "kore", "ocha"],
    ["iAdjNegPast", "mise", "atarashii"],
    ["iAdj", "byouin", "furui"],
    ["iAdjNeg", "eki", "takai"],
    ["iAdjPast", "kaisha", "yasui"],
    ["iAdjNegPast", "heya", "nagai"],
    ["iAdj", "kouen", "mijikai"],
    ["iAdjNeg", "toshokan", "akai"],
    ["iAdjPast", "machi", "shiroi"],
    ["naAdjNeg", "watashi", "shizuka"],
    ["naAdjPast", "sakura", "nigiyaka"],
    ["naAdjNegPast", "sensei", "kirei"],
    ["naAdj", "gakusei", "genki"],
    ["naAdjNeg", "tomodachi", "yuumei"],
    ["naAdjPast", "kazoku", "shinsetsu"],
    ["naAdjNegPast", "gakkou", "kantan"],
    ["naAdj", "mise", "taisetsu"],
    ["naAdjNeg", "kaisha", "anzen"],
    ["naAdjPast", "heya", "kiken"],
    ["demonstrative", "kore", "mizu"],
    ["demonstrative", "sore", "ocha"],
    ["demonstrative", "are", "mizu"],
    ["determinerObject", "watashi", "kono", "mizu", "kau"],
    ["determinerObject", "sakura", "sono", "ocha", "tsukau"],
    ["determinerObject", "yuki", "ano", "mizu", "kau"],
    ["determinerObject", "tanaka", "kono", "ocha", "tsukau"],
    ["determinerObject", "sensei", "sono", "mizu", "kau"],
    ["determinerObject", "gakusei", "ano", "ocha", "tsukau"],
    ["demonstrative", "sore", "mizu"],
  ];
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 3)) addA1Row(cards, 14, words, row);
  return cards;
}

function buildUnit15(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const objects = spec.newWords.map((word) => word.id);
  const places = ["koko", "soko", "asoko", "ie", "gakkou", "mise", "heya", "kouen", "toshokan", "machi"];
  const adjectives = ["atsui", "samui", "isogashii", "tanoshii", "muzukashii", "yasashii_easy", "oishii", "hayai", "osoi", "akarui"];
  const naAdjectives = ["hima", "hen", "suteki", "majime", "teinei", "shitsurei", "fukuzatsu", "tokubetsu", "futsuu", "zannen"];
  const adverbs = ["totemo", "amari", "sukoshi", "maa_maa", "hontou_ni", "kanari", "zenzen", "mou", "mada", "chotto"];
  const currentGroups = objects.map((objectId, index) => [
    ["existence", objectId],
    ["located", cycle(places, index), objectId],
    ["existence", objectId, "negative"],
    ["located", cycle(places, index + 2), objectId],
    ["located", cycle(places, index + 4), objectId],
    ["located", cycle(places, index + 5), objectId, "negative"],
    ["located", cycle(places, index + 6), objectId],
    ["located", cycle(places, index + 8), objectId],
  ]);
  const supportRows = [];
  for (let index = 0; index < 10; index += 1) {
    supportRows.push(["iAdjNeg", cycle(places, index), adjectives[index]]);
    supportRows.push(["naAdjPast", cycle(places, index + 1), naAdjectives[index]]);
    supportRows.push(index < 7 ? ["degreeI", cycle(places, index + 2), adverbs[index], adjectives[(index + 3) % adjectives.length], ["amari", "zenzen"].includes(adverbs[index]) ? "negative" : "positive"] : ["temporalAdverb", adverbs[index], cycle(["asa", "yoru", "yasumi"], index)]);
  }
  supportRows.push(
    ["questionWord", "nan", "tabemono"],
    ["questionWord", "dare", "otokonohito"],
    ["questionWord", "dore", "nomimono"],
    ["whichNoun", "dono", "tabemono"],
    ["subjectAction", "otokonohito", "hanasu"],
    ["subjectAction", "onnanohito", "matsu"],
    ["subjectObject", "watashi", "tabemono", "taberu"],
    ["subjectObject", "sakura", "nomimono", "nomu"],
    ["subjectActionQuestion", "otokonohito", "hanasu"],
    ["subjectActionQuestion", "onnanohito", "matsu"],
  );
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 2)) addA1Row(cards, 15, words, row);
  return cards;
}

function buildUnit16(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const beings = spec.newWords.map((word) => word.id);
  const places = ["ie", "gakkou", "mise", "byouin", "eki", "kaisha", "heya", "machi", "umi", "yama"];
  const objects = ["hako", "mado", "doa", "sara", "koppu", "chizu", "kami", "pen", "hana_flower", "denwa"];
  const adverbs = ["totemo", "amari", "sukoshi", "maa_maa", "hontou_ni", "kanari", "zenzen", "mou", "mada", "chotto"];
  const naAdjectives = ["shizuka", "nigiyaka", "kirei", "genki", "yuumei", "shinsetsu", "kantan", "taisetsu", "anzen", "kiken", "hima", "hen", "suteki", "majime", "teinei", "shitsurei", "fukuzatsu", "tokubetsu", "futsuu", "zannen"];
  const currentGroups = beings.map((beingId, index) => [
    ["existence", beingId],
    ["located", cycle(places, index), beingId],
    ["existence", beingId, "negative"],
    ["located", cycle(places, index + 2), beingId],
    ["located", cycle(places, index + 4), beingId, "negative"],
    ["located", cycle(places, index + 5), beingId],
    ["located", cycle(places, index + 6), beingId],
    ["located", cycle(places, index + 8), beingId],
  ]);
  const supportRows = [];
  for (let index = 0; index < 10; index += 1) {
    supportRows.push(["located", cycle(places, index), objects[index]]);
    supportRows.push(["naAdj", cycle(places, index + 1), naAdjectives[index]]);
    supportRows.push(index < 7 ? ["degreeNa", cycle(places, index + 2), adverbs[index], naAdjectives[index + 10], ["amari", "zenzen"].includes(adverbs[index]) ? "negative" : "positive"] : ["temporalAdverb", adverbs[index], cycle(["asa", "yoru", "yasumi"], index)]);
  }
  supportRows.push(
    ["where", "kouen"],
    ["when", "ashita"],
    ["timeAnswer", "yasumi", "kyou"],
    ["timeAdverbAction", "watashi", "ima", "taberu"],
    ["whenAction", "sakura", "toshokan", "iku"],
    ["demonstrativePlace", "kore", "koko"],
    ["demonstrativePlace", "sore", "soko"],
    ["demonstrativePlace", "are", "asoko"],
  );
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 2)) addA1Row(cards, 16, words, row);
  return cards;
}

function buildUnit17(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const places = spec.newWords.map((word) => word.id);
  const things = ["hako", "mado", "doa", "sara", "koppu", "chizu", "kami", "pen", "hana_flower", "denwa"];
  const beings = ["sobo", "sofu", "ani", "imouto", "akachan", "tori", "sakana", "uma", "ushi", "mushi"];
  const currentGroups = places.map((placeId, index) => [
    ["located", placeId, cycle(things, index)],
    ["located", placeId, cycle(beings, index)],
    ["where", placeId],
    ["placeAnswer", placeId, cycle(["koko", "soko", "asoko"], index)],
    ["located", placeId, cycle(things, index + 3), "negative"],
    ["sceneDestination", cycle(["watashi", "sakura", "sensei", "gakusei", "yuki", "tanaka"], index), placeId, index % 2 === 0 ? "iku" : "kuru"],
    ["located", placeId, cycle(beings, index + 4), "negative"],
    ["located", placeId, cycle(things, index + 6)],
  ]);
  const supportRows = [];
  const naAdjectives = ["hima", "hen", "suteki", "majime", "teinei", "shitsurei", "fukuzatsu", "tokubetsu", "futsuu", "zannen"];
  const adverbs = ["totemo", "amari", "sukoshi", "maa_maa", "hontou_ni", "kanari", "zenzen", "mou", "mada", "chotto"];
  const weather = ["tenki", "ame", "yuki_snow", "kaze", "sora", "umi", "yama", "machi", "shima", "kuni"];
  for (let index = 0; index < 10; index += 1) {
    supportRows.push(["naAdjNeg", cycle(["watashi", "sakura", "sensei", "gakusei", "tomodachi", "kazoku", ...places], index), naAdjectives[index]]);
    supportRows.push(index < 7 ? ["degreeNa", cycle(places, index), adverbs[index], cycle(naAdjectives, index + 2), ["amari", "zenzen"].includes(adverbs[index]) ? "negative" : "positive"] : ["temporalAdverb", adverbs[index], cycle(["asa", "yoru", "yasumi"], index)]);
    supportRows.push(index === 0 ? ["weatherBare", "tenki", "ne"] : index < 5 ? ["weatherTopic", weather[index], index % 2 === 0 ? "ne" : "yo"] : ["placeEnding", weather[index], cycle(["koko", "soko", "asoko"], index), index % 2 === 0 ? "ne" : "yo"]);
  }
  supportRows.push(["topic", "namae", "gakusei"], ["subjectAction", "watashi", "taberu"], ["subjectAction", "sakura", "nomu"]);
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 3)) addA1Row(cards, 17, words, row);
  return cards;
}

function buildUnit18(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const locations = spec.newWords.map((word) => word.id);
  const anchors = ["daidokoro", "niwa", "kyoushitsu", "shokudou", "toire", "michi", "hashi_bridge", "kawa", "kuukou", "hoteru"];
  const things = ["hako", "mado", "doa", "sara", "koppu", "chizu", "kami", "pen", "hana_flower", "denwa"];
  const beings = ["sobo", "sofu", "ani", "imouto", "akachan", "tori", "sakana", "uma", "ushi", "mushi"];
  const currentGroups = locations.map((locationId, index) => {
    if (locationId === "aida") {
      return [
        ["betweenExistence", cycle(anchors, index), cycle(anchors, index + 1), cycle(things, index)],
        ["betweenExistence", cycle(anchors, index + 2), cycle(anchors, index + 3), cycle(beings, index)],
        ["betweenExistence", cycle(things, index), cycle(things, index + 1), cycle(things, index + 3)],
        ["betweenExistence", cycle(anchors, index + 4), cycle(anchors, index + 5), cycle(things, index + 5)],
        ["betweenExistence", cycle(anchors, index + 6), cycle(anchors, index + 7), cycle(beings, index + 4)],
        ["betweenExistence", cycle(things, index + 2), cycle(things, index + 3), cycle(things, index + 7)],
        ["betweenExistence", cycle(anchors, index + 8), cycle(anchors, index + 9), cycle(things, index + 1)],
        ["betweenExistence", cycle(anchors, index + 1), cycle(anchors, index + 2), cycle(beings, index + 7)],
      ];
    }
    return [
      ["relativeExistence", cycle(anchors, index), locationId, cycle(things, index)],
      ["relativeExistence", cycle(anchors, index + 2), locationId, cycle(beings, index)],
      ["relativeExistence", cycle(things, index), locationId, cycle(things, index + 3)],
      ["relativeExistence", cycle(anchors, index + 4), locationId, cycle(things, index + 5)],
      ["relativeExistence", cycle(anchors, index + 6), locationId, cycle(beings, index + 4)],
      ["relativeExistence", cycle(things, index + 2), locationId, cycle(things, index + 7)],
      ["relativeExistence", cycle(anchors, index + 8), locationId, cycle(things, index + 1)],
      ["relativeExistence", cycle(anchors, index + 1), locationId, cycle(beings, index + 7)],
    ];
  });
  const supportRows = [];
  const adverbs = ["totemo", "amari", "sukoshi", "maa_maa", "hontou_ni", "kanari", "zenzen", "mou", "mada", "chotto"];
  for (let index = 0; index < 10; index += 1) {
    supportRows.push(["located", anchors[index], things[index]]);
    supportRows.push(["located", anchors[index], beings[index]]);
    supportRows.push(index < 7 ? ["degreeI", anchors[index], adverbs[index], cycle(["ookii", "chiisai", "atarashii", "furui", "takai", "yasui", "nagai"], index), ["amari", "zenzen"].includes(adverbs[index]) ? "negative" : "positive"] : ["temporalAdverb", adverbs[index], cycle(["asa", "yoru", "yasumi"], index)]);
  }
  supportRows.push(
    ["iAdj", "michi", "mijikai"],
    ["iAdj", "hashi_bridge", "akai"],
    ["iAdj", "kawa", "shiroi"],
    ["topic", "neko", "doubutsu"],
    ["topic", "inu", "doubutsu"],
    ["object", "hon", "yomu"],
    ["object", "hon", "kaku"],
    ["where", "ie"],
    ["where", "gakkou"],
    ["where", "basho"],
    ["topic", "isha", "sensei"],
  );
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 2)) addA1Row(cards, 18, words, row);
  return cards;
}

function buildUnit19(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const quantities = spec.newWords.map((word) => word.id);
  const things = ["hako", "mado", "doa", "sara", "koppu", "chizu", "kami", "pen", "hana_flower", "denwa"];
  const places = ["daidokoro", "niwa", "kyoushitsu", "shokudou", "toire", "michi", "hashi_bridge", "kawa", "kuukou", "hoteru"];
  const locations = ["ue", "shita", "naka", "mae", "ushiro", "tonari", "migi", "hidari", "chikaku"];
  const beings = ["sobo", "sofu", "ani", "imouto", "akachan", "tori", "sakana", "uma", "ushi", "mushi"];
  const currentGroups = quantities.map((quantityId, index) => [
    ["quantityExistence", cycle(things, index), quantityId],
    ["quantityExistence", cycle(things, index + 1), quantityId, cycle(places, index)],
    ["quantityExistence", cycle(things, index + 2), quantityId, cycle(places, index + 2)],
    ["quantityExistence", cycle(things, index + 3), quantityId, cycle(places, index + 3)],
    ["quantityExistence", cycle(things, index + 4), quantityId],
    ["quantityExistence", cycle(things, index + 5), quantityId, cycle(places, index + 4)],
    ["quantityExistence", cycle(things, index + 7), quantityId, cycle(places, index + 5)],
    ["quantityExistence", cycle(things, index + 6), quantityId, cycle(places, index + 6)],
  ]);
  const supportRows = [];
  for (let index = 0; index < 10; index += 1) {
    supportRows.push(["located", places[index], things[index]]);
    supportRows.push(["located", places[index], beings[index]]);
    supportRows.push(["relativeExistence", places[index], cycle(locations, index), cycle(things, index + 2)]);
  }
  supportRows.push(
    ["betweenExistence", "daidokoro", "niwa", "hako"],
    ["iAdj", "ie", "atsui"],
    ["iAdj", "gakkou", "samui"],
    ["iAdj", "mise", "isogashii"],
    ["iAdj", "byouin", "tanoshii"],
    ["iAdj", "eki", "muzukashii"],
    ["iAdj", "kaisha", "yasashii_easy"],
    ["iAdj", "tabemono", "oishii"],
    ["iAdj", "asa", "hayai"],
    ["iAdj", "yoru", "osoi"],
    ["iAdj", "heya", "akarui"],
    ["topic", "haha", "kazoku"],
    ["topic", "chichi", "kazoku"],
    ["topic", "ane", "kazoku"],
    ["topic", "otouto", "kazoku"],
    ["subjectObject", "watashi", "shashin", "miru"],
    ["subjectObject", "sakura", "kaban", "miru"],
    ["subjectAction", "haha", "kiku"],
    ["subjectAction", "chichi", "kiku"],
    ["possession", "kazoku", "heya"],
    ["possession", "ane", "kaban"],
  );
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 1)) addA1Row(cards, 19, words, row);
  return cards;
}

function buildUnit20(spec, previousWords, reviewWords) {
  const words = byId([...previousWords, ...spec.newWords]);
  const current = spec.newWords.map((word) => word.id);
  const scenePlaces = current.slice(0, 7);
  const sceneThings = current.slice(7);
  const beings = ["sobo", "sofu", "ani", "imouto", "akachan", "tori", "sakana", "uma", "ushi", "mushi"];
  const oldPlaces = ["daidokoro", "niwa", "kyoushitsu", "shokudou", "toire", "michi", "hashi_bridge", "kawa", "kuukou", "hoteru"];
  const oldThings = ["hako", "mado", "doa", "sara", "koppu", "chizu", "kami", "pen", "hana_flower", "denwa"];
  const locations = ["ue", "shita", "naka", "mae", "ushiro", "tonari", "migi", "hidari", "chikaku"];
  const quantities = ["hitotsu", "futatsu", "mittsu", "yottsu", "itsutsu", "muttsu", "nanatsu", "yattsu", "kokonotsu", "too"];
  const currentGroups = current.map((wordId, index) => {
    if (scenePlaces.includes(wordId)) {
      return [
        ["where", wordId],
        ["sceneDestination", cycle(["watashi", "sakura", "sensei", "gakusei", "yuki", "tanaka"], index), wordId, index % 2 === 0 ? "iku" : "kuru"],
        ["located", wordId, cycle(beings, index)],
        ["located", wordId, cycle(oldThings, index)],
        ["relativeExistence", wordId, cycle(locations, index), cycle(oldThings, index + 1)],
        ["placeAnswer", wordId, cycle(["koko", "soko", "asoko"], index)],
        ["located", wordId, cycle(beings, index + 2), "negative"],
        ["sceneDestination", cycle(["tomodachi", "isha", "otona", "kodomo"], index), wordId, index % 2 === 0 ? "kuru" : "iku"],
      ];
    }
    return [
      ["existence", wordId],
      ["located", cycle(oldPlaces, index + 3), wordId],
      ["quantityExistence", wordId, cycle(quantities, index), cycle(scenePlaces, index + 4)],
      ["relativeExistence", cycle(scenePlaces, index + 5), cycle(locations, index), wordId],
      ["existence", wordId, "negative"],
      ["located", cycle(oldPlaces, index), wordId],
      ["quantityExistence", wordId, cycle(quantities, index + 3)],
      ["relativeExistence", cycle(oldPlaces, index + 3), cycle(locations, index + 2), wordId],
    ];
  });
  const supportRows = [];
  for (let index = 0; index < 10; index += 1) {
    supportRows.push(["located", oldPlaces[index], beings[index]]);
    supportRows.push(["relativeExistence", oldPlaces[index], cycle(locations, index), cycle(beings, index + 3)]);
    supportRows.push(["quantityExistence", cycle(oldThings, index), quantities[index], cycle(scenePlaces, index)]);
  }
  supportRows.push(["betweenExistence", "daidokoro", "niwa", "basu"]);
  const naReviews = ["shizuka", "nigiyaka", "kirei", "genki", "yuumei", "shinsetsu", "kantan", "taisetsu", "anzen", "kiken"];
  const unit4Pairs = [
    ["mise", "kodomo"],
    ["byouin", "otona"],
    ["eki", "isu"],
    ["kaisha", "tsukue"],
    ["byouin", "kodomo"],
    ["eki", "otona"],
    ["kaisha", "isu"],
    ["mise", "tsukue"],
    ["eki", "kodomo"],
    ["kaisha", "otona"],
  ];
  for (let index = 0; index < 10; index += 1) {
    const [placeId, objectId] = unit4Pairs[index];
    supportRows.push(["naAdj", cycle(oldPlaces, index), naReviews[index]]);
    supportRows.push(index % 2 === 0 ? ["located", placeId, objectId] : ["subjectPlace", objectId, placeId, index % 3 === 0 ? "kuru" : "iku", "ni"]);
  }
  const cards = [];
  for (const row of interleaveCurrentAndSupport(currentGroups, supportRows, 1)) addA1Row(cards, 20, words, row);
  return cards;
}

function reviewWordsFor(source, unitId) {
  return wordsForUnits(source, reviewVocabularyUnitIds(unitId));
}

function lexiconWordsFor(source, unitId) {
  return wordsForUnits(source, lexiconVocabularyUnitIds(unitId, authoredUnitIds(source)));
}

function assertUnit(unit, reviewWords = []) {
  const maxCards = unit.id <= 20 ? (unit.id >= 19 && reviewWords.length >= 28 ? 135 : unit.id >= 15 && reviewWords.length >= 28 ? 125 : reviewWords.length >= 28 ? 115 : 100) : 150;
  if (unit.cards.length < 80 || unit.cards.length > maxCards) throw new Error(`unit ${unit.id}: expected 80-${maxCards} cards, got ${unit.cards.length}`);
  const allowedBareDesuWordIds =
    unit.id === 1 ? ["watashi", "sakura", "yuki", "tanaka"] : unit.id === 4 ? ["doubutsu", "basho"] : unit.id === 6 ? ["mizu", "ocha"] : [];
  const maxExposureGap = unit.id === 4 ? 50 : reviewWords.length >= 28 ? 35 : 24;
  assertUnitVariety(unit, {
    allowedBareDesuWordIds,
    maxExposureGap,
  });
  const tautologyFindings = tautologicalIdentityFindings(unit);
  if (tautologyFindings.length > 0) {
    throw new Error(tautologyFindings.map((finding) => `unit ${unit.id}: tautological identity frame ${finding.text} [${finding.id}]`).join("\n"));
  }
  const currentWordIds = new Set(unit.newWords.map((word) => word.id));
  const firstWordPositions = new Map();
  const wordAppearanceCounts = new Map();
  const badEnglishIdentity = /\b(I am|You are|He is|She is|The teacher is|The student is|The friend is|The doctor is|My mother is|My father is)\b (a cat|a dog|an animal|a book|a photo|a bag|a chair|a desk|a place|a house|a school|a shop|a hospital|a station|a company|a name|me|you|him|her|my mother|my father|my older sister|my younger brother|yesterday|last month|last year|morning|night|day off|a trip|work)$/;
  for (const [index, card] of unit.cards.entries()) {
    if (card.id !== `u${pad(unit.id)}-c${pad(index + 1)}`) throw new Error(`unit ${unit.id}: bad card id ${card.id}`);
    if (card.line.length !== card.tts.length || card.line.length !== card.explain.length || card.line.length !== card.tokens.length) {
      throw new Error(`unit ${unit.id} ${card.id}: alignment mismatch`);
    }
    for (const token of card.tokens ?? []) {
      if (token.wordId && !firstWordPositions.has(token.wordId)) firstWordPositions.set(token.wordId, index + 1);
    }
    for (const wordId of new Set((card.tokens ?? []).flatMap((token) => (token.wordId ? [token.wordId] : [])))) {
      wordAppearanceCounts.set(wordId, (wordAppearanceCounts.get(wordId) ?? 0) + 1);
    }
    if (unit.id <= 20 && badEnglishIdentity.test(card.english)) {
      throw new Error(`unit ${unit.id} ${card.id}: suspicious identity sentence "${card.english}"`);
    }
  }
  if (unit.id <= 20) {
    for (const word of unit.newWords) {
      const firstSeen = firstWordPositions.get(word.id);
      if (!firstSeen || firstSeen > 60) {
        throw new Error(`unit ${unit.id}: current word ${word.id} first appears too late at card ${firstSeen ?? "never"}`);
      }
    }
    const currentCardsInTail = unit.cards.slice(-20).filter((card) => card.tokens?.some((token) => currentWordIds.has(token.wordId))).length;
    if (currentCardsInTail < 8) {
      throw new Error(`unit ${unit.id}: expected at least 8 current-word cards in final 20, got ${currentCardsInTail}`);
    }
    for (const word of reviewWords) {
      const firstSeen = firstWordPositions.get(word.id);
      const reviewFirstSeenBy = unit.id >= 15 && reviewWords.length >= 28 ? 125 : reviewWords.length >= 28 ? 105 : 80;
      if (firstSeen && firstSeen > reviewFirstSeenBy) {
        throw new Error(`unit ${unit.id}: review word ${word.id} first appears too late at card ${firstSeen}`);
      }
    }
    if (unit.id >= 3 && unit.id <= 20) {
      if (unit.cards.length > maxCards) throw new Error(`unit ${unit.id}: expected at most ${maxCards} cards, got ${unit.cards.length}`);
      const currentCounts = Object.fromEntries(unit.newWords.map((word) => [word.id, wordAppearanceCounts.get(word.id) ?? 0]));
      for (const word of unit.newWords) {
        const count = wordAppearanceCounts.get(word.id) ?? 0;
        if (grammarFocusSrsWordIds.has(word.id)) {
          if (count < 8) {
            throw new Error(`unit ${unit.id}: grammar SRS word ${word.id} expected at least 8 appearances, got ${count}; counts ${JSON.stringify(currentCounts)}`);
          }
          continue;
        }
        if (count < 8 || count > 12) {
          throw new Error(`unit ${unit.id}: current word ${word.id} expected 8-12 appearances, got ${count}; counts ${JSON.stringify(currentCounts)}`);
        }
      }
      const reviewCounts = Object.fromEntries(reviewWords.map((word) => [word.id, wordAppearanceCounts.get(word.id) ?? 0]));
      const minReviewCount = reviewWords.length >= 28 ? 1 : reviewWords.length >= 18 ? 4 : 5;
      const maxReviewCount = unit.id >= 19 && reviewWords.length >= 28 ? 12 : 8;
      for (const word of reviewWords) {
        const count = wordAppearanceCounts.get(word.id) ?? 0;
        if (count < minReviewCount || count > maxReviewCount) {
          throw new Error(`unit ${unit.id}: SRS review word ${word.id} expected ${minReviewCount}-${maxReviewCount} appearances, got ${count}; counts ${JSON.stringify(reviewCounts)}`);
        }
      }
    }
  }
}

const source = await readJson("data/jp/curriculum/source/unit_specs.json");
const specs = new Map(source.units.map((unit) => [unit.id, unit]));
const unitsArg = process.argv.find((arg) => arg.startsWith("--units="));
const unitsToBuild = unitsArg ? parseUnitRange(unitsArg.slice("--units=".length)) : [1, 2, 3, 4, 5, 6, 7];
const grammarFocusSrsWordIds = new Set(["aru", "iru"]);

function parseUnitRange(value) {
  if (/^\d+-\d+$/.test(value)) {
    const [start, end] = value.split("-").map(Number);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
  return value.split(",").map(Number).filter((unitId) => Number.isInteger(unitId) && unitId > 0);
}

for (const unitId of unitsToBuild) {
  const existing = await readJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`);
  const spec = specs.get(unitId);
  if (!spec) throw new Error(`Missing source spec for unit ${unitId}`);
  const previousWords = source.units.filter((unit) => unit.id < unitId).flatMap((unit) => unit.newWords);

  const builders = new Map([
    [1, buildUnit1],
    [2, buildUnit2],
    [3, buildUnit3],
    [4, buildUnit4],
    [5, buildUnit5],
    [6, buildUnit6],
    [7, buildUnit7],
    [8, buildUnit8],
    [9, buildUnit9],
    [10, buildUnit10],
    [11, buildUnit11],
    [12, buildUnit12],
    [13, buildUnit13],
    [14, buildUnit14],
    [15, buildUnit15],
    [16, buildUnit16],
    [17, buildUnit17],
    [18, buildUnit18],
    [19, buildUnit19],
    [20, buildUnit20],
  ]);
  if (!builders.has(unitId)) throw new Error(`No deterministic rebuild builder for unit ${unitId}`);
  const reviewWords = reviewWordsFor(source, unitId);
  const lexiconWords = lexiconWordsFor(source, unitId);
  const cards = builders.get(unitId)(spec, previousWords, reviewWords);
  const unit = { ...existing, ...spec, reviewWordIds: reviewWords.map((word) => word.id), lexiconWordIds: lexiconWords.map((word) => word.id), cards };
  assertUnit(unit, reviewWords);
  await writeJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`, unit);
}

console.log(`Rebuilt units ${unitsToBuild.join(", ")} with deterministic A1 lanes.`);
