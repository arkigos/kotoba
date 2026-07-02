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

function grammarIntro(cards, unitId, part, english, fact) {
  add(cards, unitId, [part], english, fact, ["grammar introduction"]);
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
  const action = verb.id === "miru" ? "look at" : verb.id === "kiku" ? "listen to" : verbForms.get(verb.id)[2];
  add(cards, unitId, [token(object), g.wo(), verbToken(verb)], `I ${action} ${indefinite(object)}`, "A familiar object cushions the current verb.", ["early Vます action", "NをVます"]);
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
  add(cards, unitId, [token(place), particle, verbToken(verb)], `I ${action} ${placePhrase(place, prep)}`, "A familiar place cushions the current verb.", ["early Vます action"]);
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
    "A familiar subject and place keep the current verb in motion.",
    ["early V\u307e\u3059 action"],
  );
}

function compound(cards, unitId, first, second, category, englishCategory) {
  add(cards, unitId, [token(first), g.to(), token(second), g.wa(), token(category), g.desu()], `${sentenceStart(subject(first))} and ${subject(second)} are ${englishCategory}`, "`と` joins two concrete nouns before the topic marker.", ["AとBはCです"]);
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
  for (const id of ["watashi", "gakusei", "sensei", "namae", "sakura", "yuki", "tanaka", "tomodachi"]) {
    identity(cards, 1, w(words, id));
  }
  subjectAction(cards, 1, w(words, "watashi"), w(words, "taberu"));
  subjectAction(cards, 1, w(words, "sakura"), w(words, "nomu"));

  const subjects = ["watashi", "sakura", "yuki", "tanaka"];
  const roles = ["gakusei", "sensei", "tomodachi"];
  for (const role of roles) for (const subjectId of subjects) topic(cards, 1, w(words, subjectId), w(words, role));
  for (const role of roles) for (const subjectId of subjects) topicQuestion(cards, 1, w(words, subjectId), w(words, role));
  currentVerbs(spec).forEach((word) => drillVerb(cards, 1, words, w(words, word.id), 12));
  for (let index = 0; cards.length < 80; index += 1) topic(cards, 1, w(words, cycle(subjects, index)), w(words, cycle(roles, index)));
  return cards;
}

function buildUnit2(spec, previousWords) {
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  warmReview(cards, 2, previous);
  for (const id of ["neko", "inu", "doubutsu", "hon", "ie", "gakkou", "basho", "isha"]) {
    identity(cards, 2, w(words, id));
  }
  objectAction(cards, 2, w(words, "hon"), w(words, "yomu"));
  subjectAction(cards, 2, w(words, "watashi"), w(words, "kaku"));
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
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  warmReview(cards, 3, previous);
  for (const id of ["kazoku", "haha", "chichi", "ane", "otouto", "shashin", "kaban", "heya"]) {
    identity(cards, 3, w(words, id));
  }
  objectAction(cards, 3, w(words, "shashin"), w(words, "miru"));
  subjectAction(cards, 3, w(words, "watashi"), w(words, "kiku"));
  addReview(cards, 3, words, reviewWords);
  currentNonVerbs(spec).forEach((word, index) => {
    const current = w(words, word.id);
    for (let repeat = 0; repeat < 4; repeat += 1) possession(cards, 3, w(words, cycle(["watashi", "sakura", "yuki", "tanaka"], index + repeat)), current);
    for (let repeat = 0; repeat < 3; repeat += 1) also(cards, 3, current, w(words, cycle(["gakusei", "sensei", "isha", "tomodachi"], index + repeat)));
  });
  currentVerbs(spec).forEach((word) => drillVerb(cards, 3, words, w(words, word.id), 10));
  return cards;
}

function buildUnit4(spec, previousWords, reviewWords) {
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  warmReview(cards, 4, previous);

  const firstNegativeRows = [
    ["mise", "gakkou"],
    ["byouin", "ie"],
    ["eki", "gakkou"],
    ["kaisha", "basho"],
    ["kodomo", "sensei"],
    ["otona", "gakusei"],
    ["isu", "hon"],
    ["tsukue", "kaban"],
  ];
  for (const [left, right] of firstNegativeRows) negativeTopic(cards, 4, w(words, left), w(words, right));
  placeAction(cards, 4, w(words, "gakkou"), w(words, "iku"));
  placeAction(cards, 4, w(words, "ie"), w(words, "kuru"));

  const placeIds = ["mise", "byouin", "eki", "kaisha"];
  const personIds = ["kodomo", "otona"];
  const objectIds = ["isu", "tsukue"];
  const movementActorIds = ["watashi", "sakura", "yuki", "tanaka", "sensei", "gakusei", "tomodachi", "isha"].filter((id) =>
    words.has(id),
  );
  function movement(offset, verbId) {
    subjectPlaceAction(
      cards,
      4,
      w(words, cycle(movementActorIds, offset)),
      w(words, cycle(placeIds, Math.floor(offset / movementActorIds.length))),
      w(words, verbId),
    );
  }
  const complementById = new Map([
    ["mise", ["gakkou", "ie", "basho", "heya"]],
    ["byouin", ["ie", "gakkou", "basho", "heya"]],
    ["eki", ["gakkou", "ie", "basho", "byouin"]],
    ["kaisha", ["gakkou", "ie", "basho", "mise"]],
    ["kodomo", ["sensei", "isha", "gakusei", "otona"]],
    ["otona", ["gakusei", "kodomo", "sensei", "tomodachi"]],
    ["isu", ["hon", "kaban", "tsukue", "doubutsu"]],
    ["tsukue", ["kaban", "hon", "isu", "doubutsu"]],
  ]);
  const wovenNouns = ["mise", "kodomo", "byouin", "isu", "eki", "otona", "kaisha", "tsukue"];
  const reviewRows = [
    () => topic(cards, 4, w(words, "neko"), w(words, "doubutsu")),
    () => topicQuestion(cards, 4, w(words, "ie"), w(words, "basho")),
    () => objectAction(cards, 4, w(words, "hon"), w(words, "yomu")),
    () => possession(cards, 4, w(words, "watashi"), w(words, "kaban")),
    () => also(cards, 4, w(words, "haha"), w(words, "sensei")),
    () => objectAction(cards, 4, w(words, "shashin"), w(words, "miru")),
  ];

  for (let round = 0; round < 5; round += 1) {
    for (let index = 0; index < wovenNouns.length; index += 1) {
      const nounId = cycle(wovenNouns, index + round * 3);
      negativeTopic(cards, 4, w(words, nounId), w(words, cycle(complementById.get(nounId), round + index)));
      if ((index + round) % 2 === 0) {
        movement(round * wovenNouns.length + index, (round + index) % 4 === 0 ? "kuru" : "iku");
      }
      if ((index + round) % 3 === 1) {
        movement(53 + round * wovenNouns.length + index, (round + index) % 2 === 0 ? "kuru" : "iku");
      }
      if ((index + round) % 4 === 2) cycle(reviewRows, round + index)();
    }
    if (round === 1) addReview(cards, 4, words, reviewWords, 1);
  }

  for (let index = 0; index < 4; index += 1) {
    negativeTopic(cards, 4, w(words, cycle([...placeIds, ...personIds, ...objectIds], index)), w(words, cycle(["gakkou", "sensei", "hon", "basho"], index)));
    movement(101 + index, index % 2 === 0 ? "iku" : "kuru");
  }
  for (let index = 0; index < 4; index += 1) {
    negativeTopic(cards, 4, w(words, cycle(objectIds, index)), w(words, cycle(["hon", "kaban", "doubutsu", "neko"], index)));
  }
  for (let index = 0; index < 12; index += 1) {
    const nounId = cycle(wovenNouns, index * 2);
    negativeTopic(cards, 4, w(words, nounId), w(words, cycle(complementById.get(nounId), index + 1)));
    if (index % 2 === 0) movement(151 + index, index % 4 === 0 ? "iku" : "kuru");
  }
  return cards;
}

function buildUnit5(spec, previousWords, reviewWords) {
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  warmReview(cards, 5, previous);
  currentNonVerbs(spec).forEach((word) => identity(cards, 5, w(words, word.id)));
  placeAction(cards, 5, w(words, "kaisha"), w(words, "hataraku"), g.de());
  placeAction(cards, 5, w(words, "gakkou"), w(words, "benkyou_suru"), g.de());
  addReview(cards, 5, words, reviewWords);
  currentNonVerbs(spec).forEach((word, index) => {
    const current = w(words, word.id);
    for (let repeat = 0; repeat < 7; repeat += 1) pastTopic(cards, 5, current, w(words, cycle(["yasumi", "ryokou", "shigoto", "gakusei", "sensei", "tomodachi"], index + repeat)));
  });
  currentVerbs(spec).forEach((word) => drillVerb(cards, 5, words, w(words, word.id), 16));
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
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  warmReview(cards, 6, previous);
  const nounIds = ["hon", "ie", "gakkou", "mise", "byouin", "eki", "mizu", "ocha", "shashin", "kaban"].filter((id) => words.has(id));
  demonstrativeTopic(cards, 6, w(words, "kore"), w(words, "hon"));
  demonstrativeTopic(cards, 6, w(words, "sore"), w(words, "hon"));
  demonstrativeTopic(cards, 6, w(words, "are"), w(words, "hon"));
  determinerIdentity(cards, 6, w(words, "kono"), w(words, "hon"));
  determinerIdentity(cards, 6, w(words, "sono"), w(words, "hon"));
  determinerIdentity(cards, 6, w(words, "ano"), w(words, "hon"));
  demonstrativeTopic(cards, 6, w(words, "kore"), w(words, "mizu"));
  demonstrativeTopic(cards, 6, w(words, "sore"), w(words, "ocha"));
  objectAction(cards, 6, w(words, "mizu"), w(words, "kau"));
  objectAction(cards, 6, w(words, "hon"), w(words, "tsukau"));
  addReview(cards, 6, words, reviewWords);
  for (const id of ["kore", "sore", "are"]) for (let index = 0; index < 7; index += 1) demonstrativeTopic(cards, 6, w(words, id), w(words, cycle(nounIds, index)));
  for (const id of ["kono", "sono", "ano"]) for (let index = 0; index < 7; index += 1) determinerIdentity(cards, 6, w(words, id), w(words, cycle(nounIds, index)));
  for (const id of ["mizu", "ocha"]) for (let index = 0; index < 7; index += 1) demonstrativeTopic(cards, 6, w(words, cycle(["kore", "sore", "are"], index)), w(words, id));
  currentVerbs(spec).forEach((word) => drillVerb(cards, 6, words, w(words, word.id), 16));
  return cards;
}

function questionWordCard(cards, unitId, words, questionId, contextId) {
  const context = w(words, contextId);
  const question = w(words, questionId);
  const questionSubject =
    context.id === "watashi" ? "am I" : context.id === "sakura" ? "are you" : `is ${subject(context)}`;
  if (questionId === "nan") add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], `What ${questionSubject}?`, "What asks for the identity of the topic.", ["nan", "A\u306fB\u3067\u3059\u304b"]);
  else if (questionId === "dare") add(cards, unitId, [token(context), g.wa(), token(question), g.desu(), g.ka(), g.q()], `Who ${questionSubject}?`, "Who asks for the person behind the topic.", ["dare", "A\u306fB\u3067\u3059\u304b"]);
  else if (questionId === "dore") add(cards, unitId, [token(question), g.ga(), token(context), g.desu(), g.ka(), g.q()], `Which one is ${indefinite(context)}?`, "Which-one questions can point to a concrete known noun.", ["dore", "\u304b"]);
}

function whichNounCard(cards, unitId, words, determinerId, nounId) {
  add(cards, unitId, [token(w(words, determinerId)), token(w(words, nounId)), g.desu(), g.ka(), g.q()], `Which ${bareMeaning(w(words, nounId))} is it?`, "Which sits before the noun being asked about.", ["dono N", "か"]);
}

function buildUnit7(spec, previousWords, reviewWords) {
  const previous = byId(previousWords);
  const words = byId([...previousWords, ...spec.newWords]);
  const cards = [];
  warmReview(cards, 7, previous);
  const contexts = ["watashi", "sakura", "yuki", "tanaka", "haha", "chichi", "sensei", "gakusei"];
  const nouns = ["hon", "shashin", "kaban", "mizu", "ocha", "tabemono", "nomimono"].filter((id) => words.has(id));
  questionWordCard(cards, 7, words, "nan", "watashi");
  questionWordCard(cards, 7, words, "dare", "yuki");
  questionWordCard(cards, 7, words, "dore", "hon");
  whichNounCard(cards, 7, words, "dono", "hon");
  topicQuestion(cards, 7, w(words, "otokonohito"), w(words, "gakusei"));
  topicQuestion(cards, 7, w(words, "onnanohito"), w(words, "sensei"));
  questionWordCard(cards, 7, words, "dore", "tabemono");
  whichNounCard(cards, 7, words, "dono", "nomimono");
  subjectAction(cards, 7, w(words, "watashi"), w(words, "hanasu"));
  placeAction(cards, 7, w(words, "gakkou"), w(words, "matsu"), g.de());
  addReview(cards, 7, words, reviewWords);
  for (let index = 0; index < 7; index += 1) questionWordCard(cards, 7, words, "nan", cycle(contexts, index));
  for (let index = 0; index < 7; index += 1) questionWordCard(cards, 7, words, "dare", cycle(contexts, index + 2));
  for (let index = 0; index < 7; index += 1) questionWordCard(cards, 7, words, "dore", cycle(nouns, index));
  for (let index = 0; index < 7; index += 1) whichNounCard(cards, 7, words, "dono", cycle(nouns, index));
  for (const id of ["otokonohito", "onnanohito", "tabemono", "nomimono"]) {
    for (let index = 0; index < 7; index += 1) topicQuestion(cards, 7, w(words, id), w(words, cycle(["gakusei", "sensei", "tomodachi", "mizu", "ocha", "hon"], index)));
  }
  currentVerbs(spec).forEach((word) => drillVerb(cards, 7, words, w(words, word.id), 16));
  return cards;
}

function reviewWordsFor(source, unitId) {
  const byUnit = new Map(source.units.map((unit) => [unit.id, unit.newWords]));
  return reviewVocabularyUnitIds(unitId).flatMap((id) => byUnit.get(id) ?? []);
}

function assertUnit(unit, reviewWords = []) {
  if (unit.cards.length < 80 || unit.cards.length > 150) throw new Error(`unit ${unit.id}: expected 80-150 cards, got ${unit.cards.length}`);
  const currentWordIds = new Set(unit.newWords.map((word) => word.id));
  const firstWordPositions = new Map();
  const badEnglishIdentity = /\b(I am|You are|He is|She is|The teacher is|The student is|The friend is|The doctor is|My mother is|My father is)\b (a cat|a dog|an animal|a book|a photo|a bag|a chair|a desk|a place|a house|a school|a shop|a hospital|a station|a company|a name|me|you|him|her|my mother|my father|my older sister|my younger brother|yesterday|last month|last year|morning|night|day off|a trip|work)$/;
  for (const [index, card] of unit.cards.entries()) {
    if (card.id !== `u${pad(unit.id)}-c${pad(index + 1)}`) throw new Error(`unit ${unit.id}: bad card id ${card.id}`);
    if (card.line.length !== card.tts.length || card.line.length !== card.explain.length || card.line.length !== card.tokens.length) {
      throw new Error(`unit ${unit.id} ${card.id}: alignment mismatch`);
    }
    for (const token of card.tokens ?? []) {
      if (token.wordId && !firstWordPositions.has(token.wordId)) firstWordPositions.set(token.wordId, index + 1);
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
  const cards = builders.get(unitId)(spec, previousWords, reviewWords);
  const unit = { ...existing, ...spec, cards };
  assertUnit(unit, reviewWords);
  await writeJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`, unit);
  previousWords.push(...spec.newWords);
}

console.log("Rebuilt foundation units 1-7 with real verb vocabulary lanes.");
