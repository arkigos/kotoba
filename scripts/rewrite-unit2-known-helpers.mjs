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

function makeCard(unitId, words, imageRef) {
  const token = tokenFactory(words);
  return (index, values, english, fact, grammarTags) => {
    const tokens = values.map(token);
    return {
      id: `u${String(unitId).padStart(3, "0")}-c${String(index).padStart(3, "0")}`,
      line: tokens.map((part) => part.surface),
      tts: tokens.map((part) => part.reading),
      explain: tokens.map((part) => part.explain),
      tokens,
      english,
      imagePrompt: `Watercolor card scene: ${english}`,
      fact,
      grammarTags,
      ...(imageRef ? { imageRef } : {}),
    };
  };
}

const unit1 = await readJson("data/jp/curriculum/units/unit_001.json");
const unit2 = await readJson("data/jp/curriculum/units/unit_002.json");
const knownWords = [...unit1.newWords, ...unit2.newWords];
const imageRef = unit2.cards.find((entry) => entry.imageRef)?.imageRef;
const card = makeCard(2, knownWords, imageRef);
const cards = [];
let i = 1;

function push(values, english, fact, grammarTags) {
  cards.push(card(i++, values, english, fact, grammarTags));
}

const warm = "A quick vocabulary warm-up before topic-comment sentences begin.";
const topic = "`\u306f` marks the topic; older known words can now help the new vocabulary feel useful.";
const pair = "`\u3068` joins concrete nouns so new and known vocabulary can combine.";
const choice = "`\u304b` chains choices and keeps the learner comparing categories.";
const paired = "Paired sentences let known helper vocabulary support the new unit words.";

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
].forEach(([a, en]) => push([a, jp.desu, jp.period], en, warm, ["A\u3067\u3059"]));

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
topicStatements.forEach(([a, b, en]) => push([a, jp.wa, b, jp.desu, jp.period], en, topic, ["A\u306fB\u3067\u3059"]));
topicStatements.forEach(([a, b, _en, q]) => push([a, jp.wa, b, jp.desuKa, jp.question], q, topic, ["A\u306fB\u3067\u3059\u304b"]));

const compoundTopics = [
  ["neko", "inu", "doubutsu", "Cats and dogs are animals.", "Are cats and dogs animals?"],
  ["sensei", "isha", "hito", "Teachers and doctors are people.", "Are teachers and doctors people?"],
  ["gakusei", "sensei", "hito", "Students and teachers are people.", "Are students and teachers people?"],
  ["ken", "yuki", "hito", "Ken and Yuki are people.", "Are Ken and Yuki people?"],
  ["tanaka", "ken", "hito", "Tanaka and Ken are people.", "Are Tanaka and Ken people?"],
  ["ie", "gakkou", "basho", "Houses and schools are places.", "Are houses and schools places?"],
  ["nihon", "amerika", "basho", "Japan and America are places.", "Are Japan and America places?"],
  ["hon", "ie", "mono", "Books and houses are things.", "Are books and houses things?"],
  ["hon", "gakkou", "mono", "Books and schools are things.", "Are books and schools things?"],
  ["neko", "hon", "mono", "Cats and books are things.", "Are cats and books things?"],
];
compoundTopics.forEach(([a, b, c, en]) => push([a, jp.to, b, jp.wa, c, jp.desu, jp.period], en, pair, ["A\u3068B\u306fC\u3067\u3059"]));
compoundTopics.forEach(([a, b, c, _en, q]) => push([a, jp.to, b, jp.wa, c, jp.desuKa, jp.question], q, pair, ["A\u3068B\u306fC\u3067\u3059\u304b"]));

[
  ["ken", "isha", "hito", "Is Ken a doctor or a person?"],
  ["yuki", "gakusei", "hito", "Is Yuki a student or a person?"],
  ["tanaka", "sensei", "hito", "Is Tanaka a teacher or a person?"],
  ["neko", "inu", "doubutsu", "Is it a cat, a dog, or an animal?"],
  ["hon", "ie", "mono", "Is it a book, a house, or a thing?"],
  ["ie", "gakkou", "basho", "Is it a house, a school, or a place?"],
  ["isha", "sensei", "hito", "Is it a doctor, a teacher, or a person?"],
  ["nihon", "amerika", "basho", "Is it Japan, America, or a place?"],
  ["neko", "hon", "mono", "Is it a cat, a book, or a thing?"],
  ["gakkou", "hon", "mono", "Is it a school, a book, or a thing?"],
].forEach(([a, b, c, en]) => push([a, jp.ka, b, jp.ka, c, jp.desuKa, jp.question], en, choice, ["A\u304bB\u304bC\u3067\u3059\u304b"]));

[
  ["neko", "doubutsu", "mono", "Is the cat an animal or a thing?"],
  ["inu", "doubutsu", "mono", "Is the dog an animal or a thing?"],
  ["ie", "basho", "mono", "Is the house a place or a thing?"],
  ["gakkou", "basho", "mono", "Is the school a place or a thing?"],
  ["isha", "hito", "sensei", "Is the doctor a person or a teacher?"],
  ["sensei", "hito", "isha", "Is the teacher a person or a doctor?"],
  ["gakusei", "hito", "tomodachi", "Is the student a person or a friend?"],
  ["nihon", "basho", "mono", "Is Japan a place or a thing?"],
  ["amerika", "basho", "mono", "Is America a place or a thing?"],
  ["hon", "mono", "basho", "Is the book a thing or a place?"],
].forEach(([a, b, c, en]) => push([a, jp.wa, b, jp.ka, c, jp.desuKa, jp.question], en, choice, ["A\u306fB\u304bC\u3067\u3059\u304b"]));

[
  ["ken", "hito", "neko", "doubutsu", "Ken is a person. The cat is an animal."],
  ["yuki", "hito", "inu", "doubutsu", "Yuki is a person. The dog is an animal."],
  ["sensei", "hito", "hon", "mono", "The teacher is a person. The book is a thing."],
  ["gakusei", "hito", "gakkou", "basho", "The student is a person. The school is a place."],
  ["isha", "hito", "ie", "basho", "The doctor is a person. The house is a place."],
  ["nihon", "basho", "amerika", "basho", "Japan is a place. America is a place."],
  ["tanaka", "sensei", "isha", "hito", "Tanaka is the teacher. The doctor is a person."],
  ["tomodachi", "hito", "neko", "doubutsu", "The friend is a person. The cat is an animal."],
  ["namae", "ken", "hon", "mono", "The name is Ken. The book is a thing."],
  ["watashi", "gakusei", "gakkou", "basho", "I am a student. The school is a place."],
].forEach(([a, b, c, d, en]) => push([a, jp.wa, b, jp.desu, jp.period, c, jp.wa, d, jp.desu, jp.period], en, paired, ["A\u306fB\u3067\u3059"]));

if (cards.length !== 80) throw new Error(`unit2 ${cards.length}`);

const englishCounts = new Map();
for (const entry of cards) englishCounts.set(entry.english, (englishCounts.get(entry.english) ?? 0) + 1);
const repeated = [...englishCounts].filter(([, count]) => count > 1);
if (repeated.length > 0) {
  throw new Error(`Repeated English in unit2: ${repeated.map(([english]) => english).join("; ")}`);
}

await writeJson("data/jp/curriculum/units/unit_002.json", { ...unit2, cards });
console.log("Rewrote Unit 002 with Unit 001 helper vocabulary.");
