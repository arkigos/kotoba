import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const jp = {
  desu: "\u3067\u3059",
  desuKa: "\u3067\u3059\u304b",
  ka: "\u304b",
  to: "\u3068",
  wa: "\u306f",
  period: "\u3002",
  question: "\uff1f",
};

const grammar = {
  [jp.desu]: [jp.desu, "polite identity marker"],
  [jp.desuKa]: [jp.desuKa, "polite question ending"],
  [jp.ka]: [jp.ka, "or; question marker"],
  [jp.to]: [jp.to, "and"],
  [jp.wa]: ["\u308f", "topic marker"],
  [jp.period]: [jp.period, "period"],
  [jp.question]: [jp.question, "question mark"],
};

function cardValues(values) {
  return values.filter((value) => value !== jp.period);
}

function cardEnglish(english) {
  return english.replace(/\.+$/, "");
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function tokenFactory(words) {
  return (value) => {
    const word = words.find((entry) => entry.id === value);
    if (word) return { surface: word.surface, reading: word.reading, explain: word.meaning, wordId: word.id };
    const [reading, explain] = grammar[value] ?? [value, value];
    return { surface: value, reading, explain };
  };
}

function makeCard(unitId, words) {
  const token = tokenFactory(words);
  return (index, values, english, grammarTags) => {
    const tokens = cardValues(values).map(token);
    return {
      id: `u${String(unitId).padStart(3, "0")}-c${String(index).padStart(3, "0")}`,
      line: tokens.map((part) => part.surface),
      tts: tokens.map((part) => part.reading),
      explain: tokens.map((part) => part.explain),
      tokens,
      english: cardEnglish(english),
      grammarTags,
    };
  };
}

const unit1 = await readJson("data/jp/curriculum/units/unit_001.json");
const unit2 = await readJson("data/jp/curriculum/units/unit_002.json");
const knownWords = [...unit1.newWords, ...unit2.newWords];
const card = makeCard(2, knownWords);
const cards = [];
let i = 1;

function push(values, english, grammarTags) {
  cards.push(card(i++, values, english, grammarTags));
}


[
  ["neko", "It's a cat."],
  ["inu", "It's a dog."],
  ["doubutsu", "It's an animal."],
  ["hon", "It's a book."],
  ["ie", "It's a house."],
  ["gakkou", "It's a school."],
  ["basho", "It's a place."],
  ["isha", "It's a doctor."],
  ["hito", "It's a person."],
  ["mono", "It's a thing."],
].forEach(([a, en]) => push([a, jp.desu, jp.period], en, ["A\u3067\u3059"]));

const topicStatements = [
  ["neko", "doubutsu", "The cat is an animal.", "Is the cat an animal?"],
  ["inu", "doubutsu", "The dog is an animal.", "Is the dog an animal?"],
  ["hon", "mono", "The book is a thing.", "Is the book a thing?"],
  ["ie", "basho", "The house is a place.", "Is the house a place?"],
  ["gakkou", "basho", "The school is a place.", "Is the school a place?"],
  ["isha", "hito", "The doctor is a person.", "Is the doctor a person?"],
  ["sensei", "hito", "The teacher is a person.", "Is the teacher a person?"],
  ["gakusei", "hito", "The student is a person.", "Is the student a person?"],
  ["nihon", "basho", "Japan is a place.", "Is Japan a place?"],
  ["amerika", "basho", "America is a place.", "Is America a place?"],
];
topicStatements.forEach(([a, b, en]) => push([a, jp.wa, b, jp.desu, jp.period], en, ["A\u306fB\u3067\u3059"]));
topicStatements.forEach(([a, b, _en, q]) => push([a, jp.wa, b, jp.desuKa, jp.question], q, ["A\u306fB\u3067\u3059\u304b"]));

const compoundTopics = [
  ["neko", "inu", "doubutsu", "Cats and dogs are animals.", "Are cats and dogs animals?"],
  ["sensei", "isha", "hito", "Teachers and doctors are people.", "Are teachers and doctors people?"],
  ["gakusei", "sensei", "hito", "Students and teachers are people.", "Are students and teachers people?"],
  ["sakura", "yuki", "hito", "Sakura and Yuki are people.", "Are Sakura and Yuki people?"],
  ["tanaka", "sakura", "hito", "Tanaka and Sakura are people.", "Are Tanaka and Sakura people?"],
  ["ie", "gakkou", "basho", "Houses and schools are places.", "Are houses and schools places?"],
  ["nihon", "amerika", "basho", "Japan and America are places.", "Are Japan and America places?"],
  ["isha", "gakusei", "hito", "Doctors and students are people.", "Are doctors and students people?"],
  ["tomodachi", "tanaka", "hito", "The friend and Tanaka are people.", "Are the friend and Tanaka people?"],
  ["sensei", "tomodachi", "hito", "The teacher and the friend are people.", "Are the teacher and the friend people?"],
];
compoundTopics.forEach(([a, b, c, en]) => push([a, jp.to, b, jp.wa, c, jp.desu, jp.period], en, ["A\u3068B\u306fC\u3067\u3059"]));
compoundTopics.forEach(([a, b, c, _en, q]) => push([a, jp.to, b, jp.wa, c, jp.desuKa, jp.question], q, ["A\u3068B\u306fC\u3067\u3059\u304b"]));

[
  ["sakura", "yuki", "Is it Sakura or Yuki?"],
  ["gakusei", "sensei", "Are they a student or a teacher?"],
  ["tanaka", "isha", "Is it Tanaka or the doctor?"],
  ["neko", "inu", "Is it a cat or a dog?"],
  ["hon", "namae", "Is it a book or a name?"],
  ["ie", "gakkou", "Is it a house or a school?"],
  ["isha", "sensei", "Is it a doctor or a teacher?"],
  ["nihon", "amerika", "Is it Japan or America?"],
  ["tomodachi", "gakusei", "Are they a friend or a student?"],
  ["tanaka", "tomodachi", "Is it Tanaka or a friend?"],
].forEach(([a, b, en]) => push([a, jp.ka, b, jp.desuKa, jp.question], en, ["A\u304bB\u3067\u3059\u304b"]));

[
  ["sakura", "gakusei", "sensei", "Is Sakura a student or a teacher?"],
  ["yuki", "gakusei", "tomodachi", "Is Yuki a student or a friend?"],
  ["tanaka", "sensei", "isha", "Is Tanaka a teacher or a doctor?"],
  ["doubutsu", "neko", "inu", "Is the animal a cat or a dog?"],
  ["namae", "sakura", "yuki", "Is the name Sakura or Yuki?"],
  ["tomodachi", "gakusei", "sensei", "Is the friend a student or a teacher?"],
  ["isha", "tanaka", "sakura", "Is the doctor Tanaka or Sakura?"],
  ["basho", "nihon", "amerika", "Is the place Japan or America?"],
  ["namae", "tanaka", "sakura", "Is the name Tanaka or Sakura?"],
  ["hito", "sensei", "isha", "Is the person a teacher or a doctor?"],
].forEach(([a, b, c, en]) => push([a, jp.wa, b, jp.ka, c, jp.desuKa, jp.question], en, ["A\u306fB\u304bC\u3067\u3059\u304b"]));

[
  ["sakura", "tomodachi", "hito", "Sakura and the friend are people"],
  ["yuki", "tanaka", "hito", "Yuki and Tanaka are people"],
  ["sensei", "gakusei", "hito", "The teacher and the student are people"],
  ["isha", "tanaka", "hito", "The doctor and Tanaka are people"],
  ["neko", "inu", "doubutsu", "The cat and the dog are animals"],
  ["gakkou", "ie", "basho", "The school and the house are places"],
  ["amerika", "nihon", "basho", "America and Japan are places"],
  ["isha", "sensei", "hito", "The doctor and the teacher are people"],
  ["gakusei", "tomodachi", "hito", "The student and the friend are people"],
  ["ie", "gakkou", "basho", "The house and the school are places"],
].forEach(([a, b, c, en]) => push([a, jp.to, b, jp.wa, c, jp.desu, jp.period], en, ["A\u3068B\u306fC\u3067\u3059"]));

if (cards.length !== 80) throw new Error(`unit2 ${cards.length}`);

const englishCounts = new Map();
for (const entry of cards) englishCounts.set(entry.english, (englishCounts.get(entry.english) ?? 0) + 1);
const repeated = [...englishCounts].filter(([, count]) => count > 1);
if (repeated.length > 0) {
  throw new Error(`Repeated English in unit2: ${repeated.map(([english]) => english).join("; ")}`);
}

await writeJson("data/jp/curriculum/units/unit_002.json", { ...unit2, cards });
console.log("Rewrote Unit 002 with Unit 001 helper vocabulary.");
