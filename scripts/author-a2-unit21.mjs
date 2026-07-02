import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = path.join(root, "data/jp/curriculum/units");
const manifestDir = path.join(root, "data/jp/media/manifests");

function pad(value) {
  return String(value).padStart(3, "0");
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const sourceUnit = readJson("data/jp/curriculum/source/unit_specs.json").units.find((unit) => unit.id === 21);
if (!sourceUnit) throw new Error("Missing source spec for unit 21");

const spec = {
  id: 21,
  slug: "polite-verbs-non-past",
  title: "Unit 21: Polite Verbs, Non-Past",
  grammarFocus: "Vます / polite non-past actions",
  words: sourceUnit.newWords.map((word) => [word.id, word.surface, word.reading, word.meaning, word.function]),
};

const lexicon = new Map();
const wordsByUnit = new Map();
for (let unitId = 1; unitId <= 20; unitId += 1) {
  const unit = readJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`);
  wordsByUnit.set(unitId, unit.newWords.map((word) => word.id));
  for (const word of unit.newWords) lexicon.set(word.id, word);
}
for (const [id, surface, reading, meaning, fn] of spec.words) {
  lexicon.set(id, { id, surface, reading, meaning, function: fn });
}
wordsByUnit.set(spec.id, spec.words.map(([id]) => id));

function bareMeaning(value) {
  return value.split(";")[0];
}

function word(id, surface, reading, explain) {
  const entry = lexicon.get(id);
  if (!entry) throw new Error(`Unknown word ${id}`);
  return { surface: surface ?? entry.surface, reading: reading ?? entry.reading, explain: explain ?? entry.meaning, wordId: id };
}

function grammar(surface, reading, explain) {
  return { surface, reading: reading ?? surface, explain };
}

const jp = {
  p: () => grammar("。", "。", "period"),
  q: () => grammar("？", "？", "question mark"),
  wa: () => grammar("は", "わ", "topic marker"),
  ga: () => grammar("が", "が", "subject marker"),
  no: () => grammar("の", "の", "possession or description marker"),
  ni: () => grammar("に", "に", "location or time marker"),
  desu: () => grammar("です", "です", "polite sentence ending"),
  desuKa: () => grammar("ですか", "ですか", "polite question ending"),
  deshita: () => grammar("でした", "でした", "polite past ending"),
  arimasu: () => grammar("あります", "あります", "exists; there is"),
  imasu: () => grammar("います", "います", "exists for living things; there is"),
  ne: () => grammar("ね", "ね", "sentence ending seeking agreement"),
  yo: () => grammar("よ", "よ", "sentence ending giving emphasis or new information"),
};

function cardParts(parts) {
  return parts.filter((part) => part.surface !== "\u3002");
}

function cardEnglish(english) {
  return english.replace(/\.+$/, "");
}

const facts = {
  masu: "`ます` makes an action sentence polite. In this unit it can mean present or future depending on context.",
  question: "`ますか` turns a polite action sentence into a yes/no question.",
  time: "A time word like `今日` or `明日` can appear before a polite verb sentence.",
  review: "A2 starts moving A1 nouns and descriptions into action sentences.",
};

const verbForms = new Map([
  ["taberu", ["食べます", "たべます", "eat", "eats", "will eat"]],
  ["nomu", ["飲みます", "のみます", "drink", "drinks", "will drink"]],
  ["iku", ["行きます", "いきます", "go", "goes", "will go"]],
  ["kuru", ["来ます", "きます", "come", "comes", "will come"]],
  ["kaeru_verb", ["帰ります", "かえります", "return", "returns", "will return"]],
  ["miru", ["見ます", "みます", "watch", "watches", "will watch"]],
  ["kiku", ["聞きます", "ききます", "listen", "listens", "will listen"]],
  ["yomu", ["読みます", "よみます", "read", "reads", "will read"]],
  ["kaku", ["書きます", "かきます", "write", "writes", "will write"]],
  ["benkyou_suru", ["勉強します", "べんきょうします", "study", "studies", "will study"]],
  ["hataraku", ["働きます", "はたらきます", "work", "works", "will work"]],
  ["utau", ["歌います", "うたいます", "sing", "sings", "will sing"]],
  ["odoru", ["踊ります", "おどります", "dance", "dances", "will dance"]],
  ["warau", ["笑います", "わらいます", "laugh", "laughs", "will laugh"]],
  ["naku", ["泣きます", "なきます", "cry", "cries", "will cry"]],
  ["wakaru", ["分かります", "わかります", "understand", "understands", "will understand"]],
  ["ganbaru", ["頑張ります", "がんばります", "do one's best", "does one's best", "will do one's best"]],
  ["komaru", ["困ります", "こまります", "be troubled", "is troubled", "will be troubled"]],
  ["modoru", ["戻ります", "もどります", "return", "returns", "will return"]],
  ["tomaru", ["止まります", "とまります", "stop", "stops", "will stop"]],
]);

const people = [
  ["watashi", "I", false],
  ["sakura", "you", false],
  ["yuki", "he", true],
  ["tanaka", "she", true],
  ["sensei", "The teacher", true],
  ["gakusei", "The student", true],
  ["tomodachi", "My friend", true],
  ["otokonohito", "The man", true],
  ["onnanohito", "The woman", true],
  ["kodomo", "The child", true],
];

const times = [
  ["kyou", "today", false],
  ["ashita", "tomorrow", true],
  ["asa", "in the morning", false],
  ["yoru", "at night", false],
  ["ima", "now", false],
];

function verbToken(id) {
  const form = verbForms.get(id);
  return word(id, form[0], form[1], form[2]);
}

function actionEnglish(person, verbId) {
  const form = verbForms.get(verbId);
  return `${person[1]} ${person[2] ? form[3] : form[2]}.`;
}

function timedActionEnglish(person, time, verbId) {
  const form = verbForms.get(verbId);
  const action = time[2] ? form[4] : person[2] ? form[3] : form[2];
  return `${person[1]} ${action} ${time[1]}.`;
}

function questionSubject(person) {
  if (person[0] === "watashi") return "I";
  if (["you", "he", "she"].includes(person[1])) return person[1];
  return person[1].replace(/^The /, "the ").replace(/^My /, "my ");
}

function questionEnglish(person, verbId) {
  const form = verbForms.get(verbId);
  if (person[0] === "watashi") return `Do I ${form[2]}?`;
  if (!person[2]) return `Do ${questionSubject(person)} ${form[2]}?`;
  return `Does ${questionSubject(person)} ${form[2]}?`;
}

function makeCard(unitId, index, parts, english, grammarTags, _visualPrompt, fact) {
  const id = `u${pad(unitId)}-c${pad(index)}`;
  const visibleParts = cardParts(parts);
  return {
    id,
    line: visibleParts.map((part) => part.surface),
    tts: visibleParts.map((part) => part.reading),
    explain: visibleParts.map((part) => part.explain),
    tokens: visibleParts.map((part) => {
      const token = { surface: part.surface, reading: part.reading, explain: part.explain };
      if (part.wordId) token.wordId = part.wordId;
      return token;
    }),
    english: cardEnglish(english),
    fact,
    grammarTags,
  };
}

function countEnglish(quantityId, singular, plural) {
  const counts = new Map([
    ["hitotsu", ["one", 1]],
    ["futatsu", ["two", 2]],
    ["mittsu", ["three", 3]],
    ["yottsu", ["four", 4]],
    ["itsutsu", ["five", 5]],
    ["muttsu", ["six", 6]],
    ["nanatsu", ["seven", 7]],
    ["yattsu", ["eight", 8]],
    ["kokonotsu", ["nine", 9]],
    ["too", ["ten", 10]],
  ]);
  const [label, amount] = counts.get(quantityId);
  return `There ${amount === 1 ? "is" : "are"} ${label} ${amount === 1 ? singular : plural}.`;
}

function placePhrase(placeId) {
  const meaning = bareMeaning(lexicon.get(placeId).meaning);
  if (["michi", "hashi_bridge"].includes(placeId)) return `on the ${meaning}`;
  if (placeId === "kuukou") return `at the ${meaning}`;
  return `in the ${meaning}`;
}

function generateCards() {
  const cards = [];
  const verbs = spec.words.map(([id]) => id);
  const add = (parts, english, tags, prompt, fact) => {
    cards.push(makeCard(spec.id, cards.length + 1, parts, english, tags, prompt, fact));
  };

  for (let index = 0; index < 20; index += 1) {
    const person = people[index % people.length];
    const verbId = verbs[index % verbs.length];
    add([word(person[0]), jp.wa(), verbToken(verbId), jp.p()], actionEnglish(person, verbId), ["Vます"], "A person doing a simple action.", facts.masu);
  }

  for (let index = 0; index < 20; index += 1) {
    const person = people[(index + 3) % people.length];
    const time = times[index % times.length];
    const verbId = verbs[(index + 2) % verbs.length];
    add([word(person[0]), jp.wa(), word(time[0]), verbToken(verbId), jp.p()], timedActionEnglish(person, time, verbId), ["Vます", "time words"], "A polite action with a familiar time word.", facts.time);
  }

  for (let index = 0; index < 20; index += 1) {
    const person = people[(index + 5) % people.length];
    const verbId = verbs[(index + 4) % verbs.length];
    add([word(person[0]), jp.wa(), verbToken(verbId), grammar("か", "か", "question marker"), jp.q()], questionEnglish(person, verbId), ["Vますか"], "A polite action question.", facts.question);
  }

  for (let index = 0; index < 10; index += 1) {
    const person = people[(index + 1) % people.length];
    const verbId = verbs[(index + 6) % verbs.length];
    const ending = index % 2 === 0 ? jp.ne() : jp.yo();
    const base = actionEnglish(person, verbId).replace(/\.$/, "");
    const english = index % 2 === 0 ? `${base}, right?` : `${base}, you know.`;
    add([word(person[0]), jp.wa(), verbToken(verbId), ending, jp.p()], english, ["Vます", "ね/よ"], "A polite action with a sentence ending.", facts.masu);
  }

  const quantities = wordsByUnit.get(19);
  const nouns = [
    ["hon", "book", "books"],
    ["kaban", "bag", "bags"],
    ["pen", "pen", "pens"],
    ["sara", "plate", "plates"],
    ["koppu", "cup", "cups"],
    ["hako", "box", "boxes"],
    ["hana_flower", "flower", "flowers"],
    ["chizu", "map", "maps"],
    ["ocha", "tea", "servings of tea"],
    ["mado", "window", "windows"],
  ];
  for (let index = 0; index < quantities.length; index += 1) {
    const noun = nouns[index % nouns.length];
    add([word(noun[0]), jp.ga(), word(quantities[index]), jp.arimasu(), jp.p()], countEnglish(quantities[index], noun[1], noun[2]), ["A1 review", "basic counters"], "A counted object review sentence.", facts.review);
  }

  const places = wordsByUnit.get(17);
  const reviewThings = [["hon", "book"], ["kaban", "bag"], ["shashin", "photo"], ["hako", "box"], ["denwa", "telephone"]];
  for (let index = 0; index < places.length; index += 1) {
    const thing = reviewThings[index % reviewThings.length];
    add([word(places[index]), jp.ni(), word(thing[0]), jp.ga(), jp.arimasu(), jp.p()], `There is a ${thing[1]} ${placePhrase(places[index])}.`, ["A1 review", "場所にNがあります"], "An A1 place sentence returning inside an A2 unit.", facts.review);
  }

  const adjectives = wordsByUnit.get(13);
  for (let index = 0; index < adjectives.length; index += 1) {
    const place = places[index % places.length];
    add([word(place), jp.wa(), word(adjectives[index]), jp.desu(), jp.ne(), jp.p()], `The ${bareMeaning(lexicon.get(place).meaning)} is ${bareMeaning(lexicon.get(adjectives[index]).meaning)}, isn't it?`, ["A1 review", "na-adjectives", "ね"], "A familiar description before returning to action sentences.", facts.review);
  }

  const events = wordsByUnit.get(5);
  const eventReview = new Map([
    ["kinou", [[word("kinou"), jp.wa(), word("yasumi"), jp.deshita(), jp.p()], "Yesterday was a day off."]],
    ["sengetsu", [[word("sengetsu"), jp.wa(), word("ryokou"), jp.deshita(), jp.p()], "Last month was a trip."]],
    ["kyonen", [[word("kyonen"), jp.wa(), word("tokubetsu"), jp.deshita(), jp.p()], "Last year was special."]],
    ["asa", [[word("asa"), jp.wa(), word("shizuka"), jp.desu(), jp.p()], "Morning is quiet."]],
    ["yoru", [[word("yoru"), jp.wa(), word("shizuka"), jp.desu(), jp.p()], "Night is quiet."]],
    ["yasumi", [[word("yasumi"), jp.wa(), word("itsu"), jp.desuKa(), jp.q()], "When is the day off?"]],
    ["ryokou", [[word("ryokou"), jp.wa(), word("itsu"), jp.desuKa(), jp.q()], "When is the trip?"]],
    ["shigoto", [[word("shigoto"), jp.wa(), word("itsu"), jp.desuKa(), jp.q()], "When is work?"]],
    ["hataraku", [[word("watashi"), jp.wa(), verbToken("hataraku"), jp.p()], "I work."]],
    ["benkyou_suru", [[word("watashi"), jp.wa(), verbToken("benkyou_suru"), jp.p()], "I study."]],
  ]);
  for (const eventId of events) {
    const [parts, english] = eventReview.get(eventId);
    add(parts, english, ["A1 review", "time words"], "A time word kept alive in the first A2 unit.", facts.review);
  }

  return cards;
}

const cards = generateCards();
const unitSlug = `unit_${pad(spec.id)}`;
const unit = {
  id: spec.id,
  slug: spec.slug,
  title: spec.title,
  grammarFocus: spec.grammarFocus,
  newWords: spec.words.map(([id, surface, reading, meaning, fn]) => ({ id, surface, reading, meaning, function: fn })),
  cards,
};
writeJson(path.join(unitDir, `${unitSlug}.json`), unit);


const manifest = {
  unitId: spec.id,
  unitSlug,
  generatedAt: "2026-06-28T00:00:00.000Z",
  audioPolicy: "audio is queued; app uses browser speech fallback until production audio exists",
  audio: cards.map((card) => ({ cardId: card.id, status: "queued", path: `/media/jp/audio/${unitSlug}/${card.id}.mp3`, text: card.line.join("") })),
};
writeJson(path.join(manifestDir, `${unitSlug}.assets.json`), manifest);

const indexPath = path.join(root, "data/jp/curriculum/unit_index.json");
const index = readJson("data/jp/curriculum/unit_index.json");
const indexed = new Map(index.units.map((entry) => [entry.id, entry]));
indexed.set(spec.id, {
  id: spec.id,
  slug: spec.slug,
  title: spec.title,
  grammarFocus: spec.grammarFocus,
  path: `data/jp/curriculum/units/unit_${pad(spec.id)}.json`,
});
index.units = [...indexed.values()].sort((a, b) => a.id - b.id);
writeJson(indexPath, index);

console.log("Authored A2 unit 21 with manifest and placeholder scenes.");
