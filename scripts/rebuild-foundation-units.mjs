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
const noArticleIds = new Set(["mizu", "ocha", "tabemono", "kinou", "sengetsu", "kyonen", "asa", "yoru", "yasumi", "shigoto"]);
const bareSubjectIds = new Set(["kinou", "sengetsu", "kyonen", "asa", "yoru"]);

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
  const actionText = verb.id === "kiku" ? `${action} to` : action;
  add(cards, unitId, [token(actor), g.wa(), token(object), g.wo(), verbToken(verb)], `${sentenceStart(subject(actor))} ${actionText} ${indefinite(object)}`, ["early Vます action", "NをVます"]);
}

function subjectObjectActionQuestion(cards, unitId, actor, object, verb) {
  const action = verbForms.get(verb.id)[2];
  const actionText = verb.id === "kiku" ? `${action} to` : action;
  const question = actor.id === "watashi" || actor.id === "sakura" ? "Do" : "Does";
  add(cards, unitId, [token(actor), g.wa(), token(object), g.wo(), verbToken(verb), g.ka(), g.q()], `${question} ${questionSubject(actor)} ${actionText} ${indefinite(object)}?`, ["early Vます action", "NをVます", "か"]);
}

function placePhrase(place, prep) {
  if (place.id === "ie" && prep === "to") return "home";
  if (place.id === "ie" && prep === "at") return "at home";
  if (place.id === "heya" && prep === "at") return "in a room";
  return `${prep} ${indefinite(place)}`;
}

function placeAction(cards, unitId, place, verb, particle = g.ni()) {
  const action = verbForms.get(verb.id)[2];
  const prep = particle.surface === "で" ? "at" : "to";
  add(cards, unitId, [token(place), particle, verbToken(verb)], `I ${action} ${placePhrase(place, prep)}`, ["early Vます action"]);
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
  const when = time.id === "asa" ? "in the morning" : time.id === "yoru" ? "at night" : bareMeaning(time);
  add(cards, unitId, [token(actor), g.wa(), token(time), g.ni(), verbToken(verb)], `${sentenceStart(subject(actor))} ${action} ${when}`, [
    "early Vます action",
    "time に",
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
  identity(cards, 1, w(words, "watashi"));
  topic(cards, 1, w(words, "watashi"), w(words, "gakusei"));
  topic(cards, 1, w(words, "watashi"), w(words, "sensei"));
  topic(cards, 1, w(words, "watashi"), w(words, "namae"));
  identity(cards, 1, w(words, "sakura"));
  identity(cards, 1, w(words, "yuki"));
  identity(cards, 1, w(words, "tanaka"));
  topic(cards, 1, w(words, "watashi"), w(words, "tomodachi"));
  subjectAction(cards, 1, w(words, "watashi"), w(words, "taberu"));
  subjectAction(cards, 1, w(words, "sakura"), w(words, "nomu"));
  const personPractice = [
    () => topic(cards, 1, w(words, "sakura"), w(words, "namae")),
    () => topicQuestion(cards, 1, w(words, "sakura"), w(words, "namae")),
    () => topic(cards, 1, w(words, "namae"), w(words, "gakusei")),
    () => topic(cards, 1, w(words, "namae"), w(words, "sensei")),
    () => topic(cards, 1, w(words, "namae"), w(words, "tomodachi")),
    () => topicQuestion(cards, 1, w(words, "namae"), w(words, "gakusei")),
    () => topicQuestion(cards, 1, w(words, "namae"), w(words, "sensei")),
    () => topicQuestion(cards, 1, w(words, "namae"), w(words, "tomodachi")),
  ];
  const addPersonPractice = () => {
    const next = personPractice.shift();
    if (next) next();
  };

  const topicRows = [
    ["yuki", "sensei"],
    ["sakura", "tomodachi"],
    ["tanaka", "gakusei"],
    ["sensei", "tomodachi"],
    ["gakusei", "sensei"],
    ["tomodachi", "gakusei"],
    ["tanaka", "tomodachi"],
    ["sakura", "gakusei"],
    ["yuki", "tomodachi"],
    ["sensei", "gakusei"],
    ["tomodachi", "sensei"],
    ["gakusei", "tomodachi"],
    ["tanaka", "sensei"],
    ["sakura", "sensei"],
    ["yuki", "gakusei"],
    ["yuki", "namae"],
    ["tanaka", "namae"],
    ["gakusei", "namae"],
    ["sensei", "namae"],
    ["tomodachi", "namae"],
  ];
  const actionRows = [
    ["sensei", "nomu", false],
    ["yuki", "taberu", true],
    ["tomodachi", "nomu", false],
    ["sakura", "taberu", true],
    ["gakusei", "nomu", true],
    ["tanaka", "taberu", false],
    ["watashi", "nomu", true],
    ["sensei", "taberu", false],
    ["sakura", "nomu", true],
    ["tomodachi", "taberu", false],
    ["yuki", "nomu", true],
    ["gakusei", "taberu", false],
    ["tanaka", "nomu", true],
    ["watashi", "taberu", true],
    ["yuki", "taberu", false],
    ["sakura", "taberu", false],
    ["sensei", "nomu", true],
    ["tomodachi", "taberu", true],
    ["gakusei", "taberu", true],
    ["tanaka", "taberu", true],
  ];
  const addActionPractice = () => {
    const next = actionRows.shift();
    if (!next) return;
    const [subjectId, verbId, question] = next;
    if (question) subjectActionQuestion(cards, 1, w(words, subjectId), w(words, verbId));
    else subjectAction(cards, 1, w(words, subjectId), w(words, verbId));
  };
  const actionInsertIndexes = new Set([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);

  for (const [index, [subjectId, role]] of topicRows.entries()) {
    topic(cards, 1, w(words, subjectId), w(words, role));
    if ([3, 7, 11, 15].includes(index)) addPersonPractice();
    if (actionInsertIndexes.has(index)) addActionPractice();
    if (index === 8) subjectAction(cards, 1, w(words, "watashi"), w(words, "nomu"));
  }
  for (const [index, [subjectId, role]] of topicRows.entries()) {
    topicQuestion(cards, 1, w(words, subjectId), w(words, role));
    if ([3, 7, 11, 15].includes(index)) addPersonPractice();
    if (actionInsertIndexes.has(index)) addActionPractice();
    if (index === 8) topicQuestion(cards, 1, w(words, "watashi"), w(words, "namae"));
  }
  subjectActionQuestion(cards, 1, w(words, "tomodachi"), w(words, "nomu"));
  subjectAction(cards, 1, w(words, "gakusei"), w(words, "nomu"));
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
    ["topic", "ie", "basho"],
    ["possession", "sensei", "gakkou"],
    ["topic", "gakkou", "basho"],
    ["topic", "isha", "namae"],
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
    ["object", "sensei", "hon", "kaku"],
    ["subjectActionQuestion", "inu", "nomu"],
    ["possession", "sakura", "hon"],
    ["subjectAction", "gakusei", "kaku"],
    ["topic", "doubutsu", "neko"],
    ["possession", "sakura", "ie"],
    ["object", "yuki", "hon", "yomu"],
    ["topicQuestion", "ie", "gakkou"],
    ["possession", "gakusei", "gakkou"],
    ["subjectAction", "tanaka", "yomu"],
    ["topic", "doubutsu", "inu"],
    ["topicQuestion", "basho", "gakkou"],
    ["object", "tomodachi", "hon", "kaku"],
    ["topicQuestion", "gakkou", "basho"],
    ["topicQuestion", "isha", "sensei"],
    ["subjectAction", "isha", "kaku"],
    ["topic", "basho", "ie"],
    ["object", "gakusei", "hon", "yomu"],
    ["compound", "neko", "inu", "doubutsu", "animals"],
    ["subjectAction", "watashi", "kaku"],
    ["topic", "basho", "gakkou"],
    ["object", "tanaka", "hon", "kaku"],
    ["compound", "ie", "gakkou", "basho", "places"],
    ["subjectAction", "sakura", "yomu"],
    ["topicQuestion", "doubutsu", "neko"],
    ["object", "isha", "hon", "yomu"],
    ["compound", "inu", "neko", "doubutsu", "animals"],
    ["subjectActionQuestion", "sensei", "yomu"],
    ["topicQuestion", "doubutsu", "inu"],
    ["object", "watashi", "hon", "kaku"],
    ["compound", "gakkou", "ie", "basho", "places"],
    ["subjectActionQuestion", "yuki", "kaku"],
    ["topicQuestion", "basho", "ie"],
    ["object", "sakura", "hon", "yomu"],
    ["topic", "isha", "tomodachi"],
    ["subjectActionQuestion", "tomodachi", "yomu"],
    ["topicQuestion", "basho", "namae"],
    ["objectQuestion", "sensei", "hon", "kaku"],
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
    ["topic", "haha", "namae"],
    ["topic", "chichi", "namae"],
    ["possession", "watashi", "shashin"],
    ["possession", "sakura", "kaban"],
    ["topic", "heya", "basho"],
    ["object", "shashin", "miru"],
    ["subjectAction", "sensei", "kiku"],
    ["topic", "ane", "namae"],
    ["topic", "otouto", "namae"],
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
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  warmReview(cards, 4, previous);

  const firstNegativeRows = [
    ["mise", "heya"],
    ["byouin", "heya"],
    ["eki", "heya"],
    ["kaisha", "heya"],
    ["kodomo", "sensei"],
    ["otona", "gakusei"],
    ["isu", "kaban"],
    ["tsukue", "kaban"],
  ];
  for (const [left, right] of firstNegativeRows) negativeTopic(cards, 4, w(words, left), w(words, right));
  placeAction(cards, 4, w(words, "gakkou"), w(words, "iku"));
  placeAction(cards, 4, w(words, "ie"), w(words, "kuru"));

  const unit2ReviewRows = [
    () => topic(cards, 4, w(words, "neko"), w(words, "doubutsu")),
    () => topicQuestion(cards, 4, w(words, "neko"), w(words, "doubutsu")),
    () => negativeTopic(cards, 4, w(words, "neko"), w(words, "isu")),
    () => negativeTopic(cards, 4, w(words, "neko"), w(words, "tsukue")),
    () => topic(cards, 4, w(words, "inu"), w(words, "doubutsu")),
    () => topicQuestion(cards, 4, w(words, "inu"), w(words, "doubutsu")),
    () => negativeTopic(cards, 4, w(words, "inu"), w(words, "isu")),
    () => negativeTopic(cards, 4, w(words, "inu"), w(words, "tsukue")),
    () => negativeTopic(cards, 4, w(words, "inu"), w(words, "kodomo")),
    () => objectAction(cards, 4, w(words, "hon"), w(words, "yomu")),
    () => objectAction(cards, 4, w(words, "hon"), w(words, "yomu")),
    () => objectAction(cards, 4, w(words, "hon"), w(words, "yomu")),
    () => objectAction(cards, 4, w(words, "hon"), w(words, "yomu")),
    () => subjectAction(cards, 4, w(words, "watashi"), w(words, "kaku")),
    () => subjectAction(cards, 4, w(words, "sakura"), w(words, "kaku")),
    () => subjectAction(cards, 4, w(words, "yuki"), w(words, "kaku")),
    () => subjectAction(cards, 4, w(words, "tanaka"), w(words, "kaku")),
    () => subjectAction(cards, 4, w(words, "sensei"), w(words, "kaku")),
    () => subjectPlaceAction(cards, 4, w(words, "isha"), w(words, "byouin"), w(words, "iku")),
    () => subjectPlaceAction(cards, 4, w(words, "isha"), w(words, "byouin"), w(words, "kuru")),
    () => negativeTopic(cards, 4, w(words, "isha"), w(words, "kodomo")),
    () => negativeTopic(cards, 4, w(words, "isha"), w(words, "otona")),
    () => negativeTopic(cards, 4, w(words, "isha"), w(words, "tsukue")),
    () => negativeTopic(cards, 4, w(words, "gakkou"), w(words, "mise")),
    () => negativeTopic(cards, 4, w(words, "gakkou"), w(words, "kaisha")),
    () => placeAction(cards, 4, w(words, "gakkou"), w(words, "iku")),
    () => negativeTopic(cards, 4, w(words, "ie"), w(words, "byouin")),
    () => negativeTopic(cards, 4, w(words, "ie"), w(words, "eki")),
    () => placeAction(cards, 4, w(words, "ie"), w(words, "kuru")),
    () => negativeTopic(cards, 4, w(words, "basho"), w(words, "mise")),
    () => negativeTopic(cards, 4, w(words, "basho"), w(words, "eki")),
    () => negativeTopic(cards, 4, w(words, "basho"), w(words, "kaisha")),
  ];
  for (const row of unit2ReviewRows) row();

  const complementById = new Map([
    ["mise", ["heya", "shashin", "kaban", "tomodachi"]],
    ["byouin", ["heya", "kaban", "shashin", "tomodachi"]],
    ["eki", ["heya", "kaban", "shashin", "tomodachi"]],
    ["kaisha", ["heya", "shashin", "kaban", "tomodachi"]],
    ["kodomo", ["sensei", "gakusei", "otona", "tomodachi"]],
    ["otona", ["gakusei", "kodomo", "sensei", "tomodachi"]],
    ["isu", ["kaban", "tsukue", "shashin", "heya"]],
    ["tsukue", ["kaban", "isu", "shashin", "heya"]],
  ]);

  const balancedNouns = ["mise", "kodomo", "byouin", "isu", "eki", "otona", "kaisha", "tsukue"];
  const movementRows = [
    ["watashi", "mise", "iku"],
    ["sakura", "byouin", "kuru"],
    ["yuki", "eki", "iku"],
    ["tanaka", "kaisha", "kuru"],
    ["sensei", "mise", "kuru"],
    ["gakusei", "byouin", "iku"],
    ["tomodachi", "eki", "kuru"],
    ["isha", "kaisha", "iku"],
    ["watashi", "mise", "iku"],
    ["sakura", "byouin", "kuru"],
    ["yuki", "eki", "iku"],
    ["tanaka", "kaisha", "kuru"],
  ];

  for (let index = 0; index < movementRows.length; index += 1) {
    const [actorId, placeId, verbId] = movementRows[index];
    subjectPlaceAction(cards, 4, w(words, actorId), w(words, placeId), w(words, verbId));
    const nounId = cycle(balancedNouns, index * 3);
    negativeTopic(cards, 4, w(words, nounId), w(words, cycle(complementById.get(nounId), index + 1)));
  }

  const closingRows = [
    ["kodomo", "gakusei"],
    ["otona", "tomodachi"],
    ["isu", "shashin"],
    ["tsukue", "kaban"],
    ["kodomo", "sensei"],
    ["otona", "kodomo"],
    ["isu", "heya"],
    ["eki", "shashin"],
    ["kodomo", "tomodachi"],
    ["otona", "gakusei"],
    ["otona", "sensei"],
    ["otona", "tomodachi"],
    ["isu", "shashin"],
    ["isu", "heya"],
    ["tsukue", "shashin"],
    ["tsukue", "heya"],
    ["tsukue", "kaban"],
  ];
  for (const [left, right] of closingRows) {
    negativeTopic(cards, 4, w(words, left), w(words, right));
  }

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
  if (type === "topic") topic(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "topicQuestion") topicQuestion(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "negative") negativeTopic(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "past") pastTopic(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "pastQuestion") pastTopicQuestion(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "pastIdentity") pastIdentity(cards, unitId, w(words, args[0]));
  else if (type === "possession") possession(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "also") also(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "object") objectAction(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "subjectAction") subjectAction(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "subjectActionQuestion") subjectActionQuestion(cards, unitId, w(words, args[0]), w(words, args[1]));
  else if (type === "subjectObject") subjectObjectAction(cards, unitId, w(words, args[0]), w(words, args[1]), w(words, args[2]));
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

  const currentRows = [
    ["pastIdentity", "kinou"],
    ["pastIdentity", "sengetsu"],
    ["pastIdentity", "kyonen"],
    ["pastIdentity", "asa"],
    ["pastIdentity", "yoru"],
    ["pastIdentity", "yasumi"],
    ["pastIdentity", "ryokou"],
    ["pastIdentity", "shigoto"],
    ["subjectAction", "sensei", "hataraku"],
    ["subjectAction", "gakusei", "benkyou_suru"],
    ["past", "asa", "shigoto"],
    ["past", "yoru", "yasumi"],
    ["past", "kinou", "ryokou"],
    ["subjectTime", "yuki", "asa", "benkyou_suru"],
    ["subjectTime", "tanaka", "yoru", "hataraku"],
    ["past", "sengetsu", "shigoto"],
    ["past", "kyonen", "yasumi"],
    ["past", "ryokou", "kinou"],
    ["subjectPlace", "tomodachi", "mise", "hataraku", "de"],
    ["subjectPlace", "haha", "ie", "benkyou_suru", "de"],
    ["past", "shigoto", "sengetsu"],
    ["past", "yasumi", "kyonen"],
    ["past", "asa", "ryokou"],
    ["subjectTime", "chichi", "asa", "hataraku"],
    ["subjectTime", "ane", "yoru", "benkyou_suru"],
    ["past", "yoru", "shigoto"],
    ["past", "kinou", "shigoto"],
    ["past", "sengetsu", "yasumi"],
    ["subjectPlace", "isha", "byouin", "hataraku", "de"],
    ["subjectPlace", "otouto", "heya", "benkyou_suru", "de"],
    ["past", "kyonen", "ryokou"],
    ["past", "ryokou", "asa"],
    ["past", "shigoto", "yoru"],
    ["subjectTime", "watashi", "yoru", "benkyou_suru"],
    ["subjectTime", "sakura", "asa", "hataraku"],
    ["past", "yasumi", "sengetsu"],
    ["past", "asa", "kinou"],
    ["past", "yoru", "kyonen"],
    ["subjectPlace", "sensei", "gakkou", "benkyou_suru", "de"],
    ["subjectPlace", "gakusei", "kaisha", "hataraku", "de"],
    ["pastQuestion", "kinou", "yasumi"],
    ["pastQuestion", "sengetsu", "ryokou"],
    ["pastQuestion", "kyonen", "shigoto"],
    ["past", "yasumi", "shigoto"],
    ["pastQuestion", "ryokou", "sengetsu"],
    ["pastQuestion", "shigoto", "kyonen"],
    ["pastQuestion", "kinou", "shigoto"],
    ["pastQuestion", "yasumi", "kinou"],
    ["pastQuestion", "sengetsu", "yasumi"],
    ["pastQuestion", "kyonen", "ryokou"],
    ["subjectPlace", "sensei", "kaisha", "hataraku", "de"],
    ["subjectPlace", "gakusei", "gakkou", "benkyou_suru", "de"],
  ];
  const reviewRows = [
    ["topic", "neko", "doubutsu"],
    ["topicQuestion", "inu", "doubutsu"],
    ["object", "hon", "yomu"],
    ["subjectObjectQuestion", "tanaka", "hon", "kaku"],
    ["possession", "watashi", "shashin"],
    ["subjectAction", "tanaka", "miru"],
    ["subjectActionQuestion", "yuki", "kiku"],
    ["negative", "kodomo", "sensei"],
    ["negative", "otona", "gakusei"],
    ["subjectPlace", "watashi", "mise", "iku", "ni"],
    ["subjectPlace", "sakura", "eki", "kuru", "ni"],
    ["possession", "haha", "kaban"],
    ["possession", "chichi", "heya"],
    ["topicQuestion", "gakkou", "basho"],
    ["negative", "isu", "tsukue"],
    ["negative", "tsukue", "isu"],
    ["subjectAction", "tomodachi", "taberu"],
    ["subjectActionQuestion", "gakusei", "nomu"],
    ["topic", "isha", "sensei"],
    ["topicQuestion", "ie", "basho"],
    ["subjectPlace", "tanaka", "byouin", "iku", "ni"],
    ["subjectPlace", "yuki", "kaisha", "kuru", "ni"],
    ["possession", "ane", "shashin"],
    ["possession", "otouto", "kaban"],
    ["object", "shashin", "miru"],
    ["subjectActionQuestion", "sensei", "kiku"],
    ["negative", "byouin", "eki"],
    ["negative", "mise", "kaisha"],
    ["subjectObject", "yuki", "hon", "yomu"],
    ["subjectObjectQuestion", "sakura", "hon", "kaku"],
    ["topic", "kazoku", "tomodachi"],
    ["topicQuestion", "namae", "sensei"],
    ["topicQuestion", "kaban", "shashin"],
    ["subjectPlace", "gakusei", "ie", "iku", "ni"],
    ["subjectPlace", "tomodachi", "gakkou", "kuru", "ni"],
  ];

  const closingCurrentRows = currentRows.slice(-8);
  const openingCurrentRows = currentRows.slice(0, -8);
  for (const row of [...interleaveRows(openingCurrentRows, reviewRows, 2), ...closingCurrentRows]) addFoundationRow(cards, 5, words, row);
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

  const currentRows = [
    ["demonstrative", "kore", "hon"],
    ["demonstrative", "sore", "byouin"],
    ["demonstrative", "are", "kaban"],
    ["determiner", "kono", "hon"],
    ["determiner", "sono", "shashin"],
    ["determiner", "ano", "kaban"],
    ["demonstrative", "kore", "mizu"],
    ["demonstrative", "sore", "ocha"],
    ["subjectObject", "watashi", "hon", "kau"],
    ["subjectObject", "sakura", "kaban", "tsukau"],
    ["subjectObject", "yuki", "ocha", "kau"],
    ["demonstrative", "sore", "mizu"],
    ["subjectObject", "tanaka", "kaban", "tsukau"],
    ["determiner", "kono", "mizu"],
    ["demonstrative", "are", "ocha"],
    ["subjectObjectQuestion", "sensei", "shashin", "kau"],
    ["determiner", "sono", "kaban"],
    ["determiner", "ano", "hon"],
    ["subjectObjectQuestion", "gakusei", "mizu", "tsukau"],
    ["demonstrative", "kore", "kaban"],
    ["demonstrative", "sore", "shashin"],
    ["subjectObject", "tomodachi", "shashin", "kau"],
    ["determiner", "kono", "ocha"],
    ["demonstrative", "are", "mizu"],
    ["subjectObject", "isha", "hon", "tsukau"],
    ["determiner", "sono", "hon"],
    ["determiner", "ano", "ocha"],
    ["subjectObjectQuestion", "watashi", "mizu", "kau"],
    ["demonstrative", "kore", "ocha"],
    ["demonstrative", "sore", "kaban"],
    ["subjectObjectQuestion", "sakura", "mizu", "tsukau"],
    ["determiner", "kono", "kaban"],
    ["demonstrative", "are", "hon"],
    ["subjectObject", "yuki", "mizu", "kau"],
    ["determiner", "sono", "mizu"],
    ["determiner", "ano", "shashin"],
    ["subjectObject", "tanaka", "hon", "tsukau"],
    ["demonstrative", "kore", "shashin"],
    ["demonstrative", "sore", "hon"],
    ["subjectObjectQuestion", "sensei", "ocha", "kau"],
    ["determiner", "kono", "shashin"],
    ["demonstrative", "are", "isu"],
    ["subjectObjectQuestion", "gakusei", "kaban", "tsukau"],
    ["determiner", "sono", "byouin"],
    ["determiner", "ano", "isu"],
    ["subjectObject", "tomodachi", "ocha", "kau"],
    ["demonstrative", "kore", "gakkou"],
    ["demonstrative", "sore", "ie"],
    ["subjectObject", "isha", "kaban", "tsukau"],
    ["determiner", "kono", "gakkou"],
    ["demonstrative", "are", "mise"],
    ["subjectObjectQuestion", "watashi", "ocha", "kau"],
    ["determiner", "sono", "ie"],
    ["determiner", "ano", "mise"],
    ["subjectObjectQuestion", "sakura", "kaban", "tsukau"],
    ["demonstrative", "kore", "byouin"],
    ["demonstrative", "sore", "eki"],
    ["subjectObject", "yuki", "shashin", "kau"],
    ["determiner", "kono", "byouin"],
    ["demonstrative", "are", "ie"],
    ["subjectObject", "tanaka", "mizu", "tsukau"],
    ["determiner", "sono", "eki"],
    ["determiner", "ano", "byouin"],
    ["subjectObjectQuestion", "sensei", "mizu", "kau"],
    ["subjectObjectQuestion", "gakusei", "hon", "tsukau"],
    ["demonstrative", "kore", "tsukue"],
    ["demonstrative", "sore", "isu"],
    ["demonstrative", "are", "tsukue"],
    ["determiner", "kono", "tsukue"],
    ["determiner", "sono", "isu"],
    ["determiner", "ano", "tsukue"],
  ];
  const reviewRows = [
    ["topic", "neko", "doubutsu"],
    ["topicQuestion", "inu", "doubutsu"],
    ["negative", "mise", "byouin"],
    ["negative", "eki", "kaisha"],
    ["subjectPlace", "watashi", "mise", "iku", "ni"],
    ["subjectPlace", "sakura", "byouin", "kuru", "ni"],
    ["topic", "ie", "basho"],
    ["topicQuestion", "gakkou", "basho"],
    ["negative", "kodomo", "otona"],
    ["negative", "isu", "tsukue"],
    ["subjectPlace", "yuki", "eki", "iku", "ni"],
    ["subjectPlace", "tanaka", "kaisha", "kuru", "ni"],
    ["topic", "isha", "sensei"],
    ["object", "hon", "yomu"],
    ["subjectObject", "sensei", "hon", "kaku"],
    ["negative", "tsukue", "kaban"],
  ];

  for (const row of interleaveRows(currentRows, reviewRows, 4)) addFoundationRow(cards, 6, words, row);
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

  const currentRows = [
    ["questionWord", "nan", "watashi"],
    ["questionWord", "dare", "yuki"],
    ["subjectAction", "chichi", "hanasu"],
    ["questionWord", "dore", "hon"],
    ["whichNoun", "dono", "hon"],
    ["subjectPlace", "sakura", "eki", "matsu", "de"],
    ["topicQuestion", "otokonohito", "gakusei"],
    ["topicQuestion", "onnanohito", "sensei"],
    ["questionWord", "nan", "sakura"],
    ["questionWord", "dare", "tanaka"],
    ["subjectAction", "haha", "hanasu"],
    ["questionWord", "dore", "tabemono"],
    ["whichNoun", "dono", "nomimono"],
    ["subjectPlace", "tanaka", "heya", "matsu", "de"],
    ["topicQuestion", "kore", "tabemono"],
    ["topicQuestion", "sore", "nomimono"],
    ["questionWord", "nan", "sensei"],
    ["questionWord", "dare", "haha"],
    ["subjectActionQuestion", "sensei", "hanasu"],
    ["questionWord", "dore", "mizu"],
    ["whichNoun", "dono", "ocha"],
    ["subjectPlace", "sensei", "byouin", "matsu", "de"],
    ["topicQuestion", "otokonohito", "tomodachi"],
    ["topicQuestion", "onnanohito", "gakusei"],
    ["questionWord", "nan", "gakusei"],
    ["questionWord", "dare", "chichi"],
    ["subjectAction", "gakusei", "hanasu"],
    ["questionWord", "dore", "ocha"],
    ["whichNoun", "dono", "mizu"],
    ["subjectPlace", "gakusei", "mise", "matsu", "de"],
    ["topicQuestion", "are", "tabemono"],
    ["topicQuestion", "kore", "nomimono"],
    ["questionWord", "nan", "haha"],
    ["questionWord", "dare", "sensei"],
    ["subjectActionQuestion", "tomodachi", "hanasu"],
    ["questionWord", "dore", "nomimono"],
    ["whichNoun", "dono", "tabemono"],
    ["subjectPlace", "tomodachi", "ie", "matsu", "de"],
    ["topicQuestion", "otokonohito", "sensei"],
    ["topicQuestion", "onnanohito", "tomodachi"],
    ["questionWord", "nan", "chichi"],
    ["questionWord", "dare", "gakusei"],
    ["subjectAction", "watashi", "hanasu"],
    ["questionWord", "dore", "shashin"],
    ["whichNoun", "dono", "kaban"],
    ["subjectPlace", "watashi", "kaisha", "matsu", "de"],
    ["topicQuestion", "sore", "tabemono"],
    ["topicQuestion", "are", "nomimono"],
    ["questionWord", "nan", "kazoku"],
    ["questionWord", "dare", "kazoku"],
    ["subjectActionQuestion", "sakura", "hanasu"],
    ["questionWord", "dore", "kaban"],
    ["whichNoun", "dono", "shashin"],
    ["subjectPlace", "sakura", "byouin", "matsu", "de"],
    ["topicQuestion", "otokonohito", "isha"],
    ["topicQuestion", "onnanohito", "ocha"],
    ["questionWord", "nan", "tomodachi"],
    ["questionWord", "dare", "tomodachi"],
    ["subjectAction", "yuki", "hanasu"],
    ["questionWord", "dore", "ie"],
    ["whichNoun", "dono", "ie"],
    ["subjectPlace", "yuki", "eki", "matsu", "de"],
    ["topicQuestion", "hon", "tabemono"],
    ["topicQuestion", "mizu", "nomimono"],
    ["questionWord", "nan", "otokonohito"],
    ["questionWord", "dare", "onnanohito"],
    ["subjectActionQuestion", "tanaka", "hanasu"],
    ["questionWord", "dore", "gakkou"],
    ["whichNoun", "dono", "gakkou"],
    ["subjectPlace", "tanaka", "gakkou", "matsu", "de"],
    ["topicQuestion", "otokonohito", "namae"],
    ["topicQuestion", "onnanohito", "namae"],
    ["topicQuestion", "otokonohito", "otona"],
    ["topicQuestion", "onnanohito", "otona"],
    ["topicQuestion", "ocha", "nomimono"],
    ["subjectObject", "sakura", "tabemono", "taberu"],
    ["questionWord", "dare", "otokonohito"],
    ["topicQuestion", "onnanohito", "isha"],
    ["object", "tabemono", "taberu"],
    ["topicQuestion", "nomimono", "ocha"],
  ];

  const reviewRows = [
    ["past", "kinou", "yasumi"],
    ["pastQuestion", "ryokou", "sengetsu"],
    ["pastQuestion", "shigoto", "kyonen"],
    ["subjectTime", "watashi", "asa", "hataraku"],
    ["subjectTime", "sakura", "yoru", "benkyou_suru"],
    ["past", "yasumi", "shigoto"],
    ["topic", "ane", "tomodachi"],
    ["topicQuestion", "otouto", "gakusei"],
    ["topic", "neko", "doubutsu"],
    ["object", "hon", "yomu"],
    ["subjectObject", "sakura", "hon", "kaku"],
    ["possession", "watashi", "shashin"],
    ["subjectAction", "tanaka", "miru"],
    ["subjectActionQuestion", "sensei", "kiku"],
    ["negative", "kodomo", "otona"],
    ["subjectPlace", "gakusei", "mise", "iku", "ni"],
  ];

  for (const row of interleaveRows(currentRows, reviewRows, 2)) addFoundationRow(cards, 7, words, row);
  return cards;
}

function reviewWordsFor(source, unitId) {
  return wordsForUnits(source, reviewVocabularyUnitIds(unitId));
}

function lexiconWordsFor(source, unitId) {
  return wordsForUnits(source, lexiconVocabularyUnitIds(unitId, authoredUnitIds(source)));
}

function assertUnit(unit, reviewWords = []) {
  if (unit.cards.length < 80 || unit.cards.length > 150) throw new Error(`unit ${unit.id}: expected 80-150 cards, got ${unit.cards.length}`);
  if (unit.id <= 3) assertUnitVariety(unit, { allowedBareDesuWordIds: unit.id === 1 ? ["watashi", "sakura", "yuki", "tanaka"] : [] });
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
    if (unit.id <= 7 && badEnglishIdentity.test(card.english)) {
      throw new Error(`unit ${unit.id} ${card.id}: suspicious identity sentence "${card.english}"`);
    }
  }
  if (unit.id <= 7) {
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
      if (firstSeen && firstSeen > 80) {
        throw new Error(`unit ${unit.id}: review word ${word.id} first appears too late at card ${firstSeen}`);
      }
    }
    if (unit.id === 3 || unit.id === 4) {
      if (unit.cards.length >= 100) throw new Error(`unit ${unit.id}: expected fewer than 100 cards, got ${unit.cards.length}`);
      const currentCounts = Object.fromEntries(unit.newWords.map((word) => [word.id, wordAppearanceCounts.get(word.id) ?? 0]));
      for (const word of unit.newWords) {
        const count = wordAppearanceCounts.get(word.id) ?? 0;
        if (count < 8 || count > 12) {
          throw new Error(`unit ${unit.id}: current word ${word.id} expected 8-12 appearances, got ${count}; counts ${JSON.stringify(currentCounts)}`);
        }
      }
      const reviewCounts = Object.fromEntries(reviewWords.map((word) => [word.id, wordAppearanceCounts.get(word.id) ?? 0]));
      for (const word of reviewWords) {
        const count = wordAppearanceCounts.get(word.id) ?? 0;
        if (count < 5 || count > 8) {
          throw new Error(`unit ${unit.id}: SRS review word ${word.id} expected 5-8 appearances, got ${count}; counts ${JSON.stringify(reviewCounts)}`);
        }
      }
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
  const reviewWords = reviewWordsFor(source, unitId);
  const lexiconWords = lexiconWordsFor(source, unitId);
  const cards = builders.get(unitId)(spec, previousWords, reviewWords);
  const unit = { ...existing, ...spec, reviewWordIds: reviewWords.map((word) => word.id), lexiconWordIds: lexiconWords.map((word) => word.id), cards };
  assertUnit(unit, reviewWords);
  await writeJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`, unit);
  previousWords.push(...spec.newWords);
}

console.log("Rebuilt foundation units 1-7 with real verb vocabulary lanes.");
