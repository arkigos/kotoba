import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const HIRAGANA_ROWS = [
  ["a", "\u3042"], ["i", "\u3044"], ["u", "\u3046"], ["e", "\u3048"], ["o", "\u304a"],
  ["ka", "\u304b"], ["ki", "\u304d"], ["ku", "\u304f"], ["ke", "\u3051"], ["ko", "\u3053"],
  ["sa", "\u3055"], ["shi", "\u3057"], ["su", "\u3059"], ["se", "\u305b"], ["so", "\u305d"],
  ["ta", "\u305f"], ["chi", "\u3061"], ["tsu", "\u3064"], ["te", "\u3066"], ["to", "\u3068"],
  ["na", "\u306a"], ["ni", "\u306b"], ["nu", "\u306c"], ["ne", "\u306d"], ["no", "\u306e"],
  ["ha", "\u306f"], ["hi", "\u3072"], ["fu", "\u3075"], ["he", "\u3078"], ["ho", "\u307b"],
  ["ma", "\u307e"], ["mi", "\u307f"], ["mu", "\u3080"], ["me", "\u3081"], ["mo", "\u3082"],
  ["ya", "\u3084"], ["yu", "\u3086"], ["yo", "\u3088"],
  ["ra", "\u3089"], ["ri", "\u308a"], ["ru", "\u308b"], ["re", "\u308c"], ["ro", "\u308d"],
  ["wa", "\u308f"], ["wo", "\u3092"], ["n", "\u3093"],
  ["small_a", "\u3041", "small a"], ["small_i", "\u3043", "small i"], ["small_u", "\u3045", "small u"], ["small_e", "\u3047", "small e"], ["small_o", "\u3049", "small o"],
  ["small_tsu", "\u3063", "small tsu"], ["small_ya", "\u3083", "small ya"], ["small_yu", "\u3085", "small yu"], ["small_yo", "\u3087", "small yo"],
];

const HIRAGANA_DAKUTEN = [
  ["ga", "\u304c"], ["gi", "\u304e"], ["gu", "\u3050"], ["ge", "\u3052"], ["go", "\u3054"],
  ["za", "\u3056"], ["ji_zi", "\u3058", "ji"], ["zu", "\u305a"], ["ze", "\u305c"], ["zo", "\u305e"],
  ["da", "\u3060"], ["ji_di", "\u3062", "ji"], ["zu_du", "\u3065", "zu"], ["de", "\u3067"], ["do", "\u3069"],
  ["ba", "\u3070"], ["bi", "\u3073"], ["bu", "\u3076"], ["be", "\u3079"], ["bo", "\u307c"],
  ["pa", "\u3071"], ["pi", "\u3074"], ["pu", "\u3077"], ["pe", "\u307a"], ["po", "\u307d"],
];

const HIRAGANA_YOON = [
  ["kya", "\u304d\u3083"], ["kyu", "\u304d\u3085"], ["kyo", "\u304d\u3087"],
  ["gya", "\u304e\u3083"], ["gyu", "\u304e\u3085"], ["gyo", "\u304e\u3087"],
  ["sha", "\u3057\u3083"], ["shu", "\u3057\u3085"], ["sho", "\u3057\u3087"],
  ["ja", "\u3058\u3083"], ["ju", "\u3058\u3085"], ["jo", "\u3058\u3087"],
  ["cha", "\u3061\u3083"], ["chu", "\u3061\u3085"], ["cho", "\u3061\u3087"],
  ["nya", "\u306b\u3083"], ["nyu", "\u306b\u3085"], ["nyo", "\u306b\u3087"],
  ["hya", "\u3072\u3083"], ["hyu", "\u3072\u3085"], ["hyo", "\u3072\u3087"],
  ["bya", "\u3073\u3083"], ["byu", "\u3073\u3085"], ["byo", "\u3073\u3087"],
  ["pya", "\u3074\u3083"], ["pyu", "\u3074\u3085"], ["pyo", "\u3074\u3087"],
  ["mya", "\u307f\u3083"], ["myu", "\u307f\u3085"], ["myo", "\u307f\u3087"],
  ["rya", "\u308a\u3083"], ["ryu", "\u308a\u3085"], ["ryo", "\u308a\u3087"],
];

const KATAKANA_ROWS = [
  ["a", "\u30a2"], ["i", "\u30a4"], ["u", "\u30a6"], ["e", "\u30a8"], ["o", "\u30aa"],
  ["ka", "\u30ab"], ["ki", "\u30ad"], ["ku", "\u30af"], ["ke", "\u30b1"], ["ko", "\u30b3"],
  ["sa", "\u30b5"], ["shi", "\u30b7"], ["su", "\u30b9"], ["se", "\u30bb"], ["so", "\u30bd"],
  ["ta", "\u30bf"], ["chi", "\u30c1"], ["tsu", "\u30c4"], ["te", "\u30c6"], ["to", "\u30c8"],
  ["na", "\u30ca"], ["ni", "\u30cb"], ["nu", "\u30cc"], ["ne", "\u30cd"], ["no", "\u30ce"],
  ["ha", "\u30cf"], ["hi", "\u30d2"], ["fu", "\u30d5"], ["he", "\u30d8"], ["ho", "\u30db"],
  ["ma", "\u30de"], ["mi", "\u30df"], ["mu", "\u30e0"], ["me", "\u30e1"], ["mo", "\u30e2"],
  ["ya", "\u30e4"], ["yu", "\u30e6"], ["yo", "\u30e8"],
  ["ra", "\u30e9"], ["ri", "\u30ea"], ["ru", "\u30eb"], ["re", "\u30ec"], ["ro", "\u30ed"],
  ["wa", "\u30ef"], ["wo", "\u30f2"], ["n", "\u30f3"],
  ["small_a", "\u30a1", "small a"], ["small_i", "\u30a3", "small i"], ["small_u", "\u30a5", "small u"], ["small_e", "\u30a7", "small e"], ["small_o", "\u30a9", "small o"],
  ["small_tsu", "\u30c3", "small tsu"], ["small_ya", "\u30e3", "small ya"], ["small_yu", "\u30e5", "small yu"], ["small_yo", "\u30e7", "small yo"],
  ["long_mark", "\u30fc", "long vowel mark"],
];

const KATAKANA_DAKUTEN = [
  ["ga", "\u30ac"], ["gi", "\u30ae"], ["gu", "\u30b0"], ["ge", "\u30b2"], ["go", "\u30b4"],
  ["za", "\u30b6"], ["ji_zi", "\u30b8", "ji"], ["zu", "\u30ba"], ["ze", "\u30bc"], ["zo", "\u30be"],
  ["da", "\u30c0"], ["ji_di", "\u30c2", "ji"], ["zu_du", "\u30c5", "zu"], ["de", "\u30c7"], ["do", "\u30c9"],
  ["ba", "\u30d0"], ["bi", "\u30d3"], ["bu", "\u30d6"], ["be", "\u30d9"], ["bo", "\u30dc"],
  ["pa", "\u30d1"], ["pi", "\u30d4"], ["pu", "\u30d7"], ["pe", "\u30da"], ["po", "\u30dd"],
];

const KATAKANA_YOON = [
  ["kya", "\u30ad\u30e3"], ["kyu", "\u30ad\u30e5"], ["kyo", "\u30ad\u30e7"],
  ["gya", "\u30ae\u30e3"], ["gyu", "\u30ae\u30e5"], ["gyo", "\u30ae\u30e7"],
  ["sha", "\u30b7\u30e3"], ["shu", "\u30b7\u30e5"], ["sho", "\u30b7\u30e7"],
  ["ja", "\u30b8\u30e3"], ["ju", "\u30b8\u30e5"], ["jo", "\u30b8\u30e7"],
  ["cha", "\u30c1\u30e3"], ["chu", "\u30c1\u30e5"], ["cho", "\u30c1\u30e7"],
  ["nya", "\u30cb\u30e3"], ["nyu", "\u30cb\u30e5"], ["nyo", "\u30cb\u30e7"],
  ["hya", "\u30d2\u30e3"], ["hyu", "\u30d2\u30e5"], ["hyo", "\u30d2\u30e7"],
  ["bya", "\u30d3\u30e3"], ["byu", "\u30d3\u30e5"], ["byo", "\u30d3\u30e7"],
  ["pya", "\u30d4\u30e3"], ["pyu", "\u30d4\u30e5"], ["pyo", "\u30d4\u30e7"],
  ["mya", "\u30df\u30e3"], ["myu", "\u30df\u30e5"], ["myo", "\u30df\u30e7"],
  ["rya", "\u30ea\u30e3"], ["ryu", "\u30ea\u30e5"], ["ryo", "\u30ea\u30e7"],
];

const kanji = [
  ["hito", "\u4eba", "\u3072\u3068", "person"],
  ["hi", "\u65e5", "\u3072", "sun; day"],
  ["tsuki", "\u6708", "\u3064\u304d", "moon; month"],
  ["hi_fire", "\u706b", "\u3072", "fire"],
  ["mizu", "\u6c34", "\u307f\u305a", "water"],
  ["ki", "\u6728", "\u304d", "tree"],
  ["kane", "\u91d1", "\u304b\u306d", "gold; money"],
  ["tsuchi", "\u571f", "\u3064\u3061", "earth; soil"],
  ["yama", "\u5c71", "\u3084\u307e", "mountain"],
  ["kawa", "\u5ddd", "\u304b\u308f", "river"],
  ["ta", "\u7530", "\u305f", "rice field"],
  ["kuchi", "\u53e3", "\u304f\u3061", "mouth"],
  ["me", "\u76ee", "\u3081", "eye"],
  ["mimi", "\u8033", "\u307f\u307f", "ear"],
  ["te", "\u624b", "\u3066", "hand"],
  ["ashi", "\u8db3", "\u3042\u3057", "foot; leg"],
  ["ookii", "\u5927", "\u304a\u304a", "big"],
  ["chiisai", "\u5c0f", "\u3057\u3087\u3046", "small"],
  ["naka", "\u4e2d", "\u306a\u304b", "middle; inside"],
  ["ue", "\u4e0a", "\u3046\u3048", "up; above"],
];

const preludeLevel = {
  code: "Kana",
  title: "Kana And First Symbols",
  unitStart: 101,
  unitEnd: 103,
  canDoSummary: "Recognize hiragana, katakana, and a small set of common kanji symbols before A1 sentences.",
  courseStage: "prelude",
};

function kanaWords(prefix, functionName, rows) {
  return rows.map(([id, surface, meaning = id.replaceAll("_", " ")]) => ({
    id: `${prefix}_${id}`,
    surface,
    reading: kanaReading(id, surface, functionName),
    audioText: kanaAudioText(id, kanaReading(id, surface, functionName)),
    meaning,
    function: functionName,
  }));
}

const smallKanaReadings = new Map([
  ["\u3041", "\u3042"],
  ["\u3043", "\u3044"],
  ["\u3045", "\u3046"],
  ["\u3047", "\u3048"],
  ["\u3049", "\u304a"],
  ["\u3063", "\u3064"],
  ["\u3083", "\u3084"],
  ["\u3085", "\u3086"],
  ["\u3087", "\u3088"],
]);

function katakanaToHiragana(value) {
  return [...value]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 0x30a1 && code <= 0x30f6) return String.fromCharCode(code - 0x60);
      return char;
    })
    .join("");
}

function kanaReading(id, surface, functionName) {
  if (id === "long_mark") return "\u3061\u3087\u3046\u304a\u3093\u3077";
  const hiragana = functionName === "katakana" ? katakanaToHiragana(surface) : surface;
  if (hiragana.length > 1) return hiragana;
  return [...hiragana].map((char) => smallKanaReadings.get(char) ?? char).join("");
}

function kanaAudioText(id, reading) {
  if (id === "long_mark") return "\u3061\u3087\u3046\u304a\u3093\u3077";
  if (id.startsWith("small_")) return `\u3061\u3044\u3055\u3044${reading}`;
  return reading;
}

const preludeSpecs = [
  {
    id: 101,
    slug: "hiragana",
    title: "Kana 1: Hiragana",
    grammarFocus: "Hiragana sound recognition",
    kind: "kana",
    words: kanaWords("hiragana", "hiragana", [...HIRAGANA_ROWS, ...HIRAGANA_DAKUTEN, ...HIRAGANA_YOON]),
  },
  {
    id: 102,
    slug: "katakana",
    title: "Kana 2: Katakana",
    grammarFocus: "Katakana sound recognition",
    kind: "kana",
    words: kanaWords("katakana", "katakana", [...KATAKANA_ROWS, ...KATAKANA_DAKUTEN, ...KATAKANA_YOON]),
  },
  {
    id: 103,
    slug: "first-kanji-symbols",
    title: "Kana 3: First Kanji Symbols",
    grammarFocus: "Common kanji symbol recognition",
    kind: "kanji",
    words: kanji.map(([id, surface, reading, meaning]) => ({
      id: `kanji_${id}`,
      surface,
      reading,
      meaning,
      function: "kanji",
    })),
  },
];

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function cardForWord(unitId, word, index) {
  return {
    id: `u${unitId}-c${String(index + 1).padStart(3, "0")}`,
    line: [word.surface],
    tts: [word.reading],
    explain: [word.function],
    tokens: [
      {
        surface: word.surface,
        reading: word.reading,
        explain: word.function,
        wordId: word.id,
      },
    ],
    english: word.meaning,
    audioText: word.audioText ?? word.reading,
    grammarTags: [word.function, "recognition"],
  };
}

function cardsForSpec(spec) {
  return spec.words.map((word, index) => cardForWord(spec.id, word, index));
}

function indexEntry(spec) {
  return {
    id: spec.id,
    slug: spec.slug,
    title: spec.title,
    grammarFocus: spec.grammarFocus,
    path: `data/jp/curriculum/units/unit_${String(spec.id).padStart(3, "0")}.json`,
    kind: spec.kind,
  };
}

function sourceEntry(spec) {
  return {
    id: spec.id,
    slug: spec.slug,
    title: spec.title,
    grammarFocus: spec.grammarFocus,
    kind: spec.kind,
    newWords: spec.words,
  };
}

async function main() {
  const courseLevels = await readJson("data/jp/curriculum/course_levels.json");
  courseLevels.levels = [preludeLevel, ...courseLevels.levels.filter((level) => level.code !== preludeLevel.code)];
  for (const level of courseLevels.levels) {
    if (["A1", "A2", "B1", "B2"].includes(level.code) && !level.courseStage) {
      level.courseStage = "core";
    }
  }
  await writeJson("data/jp/curriculum/course_levels.json", courseLevels);

  const unitIndex = await readJson("data/jp/curriculum/unit_index.json");
  const preludeIds = new Set(preludeSpecs.map((spec) => spec.id));
  unitIndex.units = [...unitIndex.units.filter((entry) => !preludeIds.has(entry.id)), ...preludeSpecs.map(indexEntry)].sort((a, b) => a.id - b.id);
  await writeJson("data/jp/curriculum/unit_index.json", unitIndex);

  const unitSpecs = await readJson("data/jp/curriculum/source/unit_specs.json");
  unitSpecs.units = [...unitSpecs.units.filter((entry) => !preludeIds.has(entry.id)), ...preludeSpecs.map(sourceEntry)].sort((a, b) => a.id - b.id);
  await writeJson("data/jp/curriculum/source/unit_specs.json", unitSpecs);

  for (const spec of preludeSpecs) {
    const unit = {
      id: spec.id,
      slug: spec.slug,
      title: spec.title,
      grammarFocus: spec.grammarFocus,
      kind: spec.kind,
      newWords: spec.words,
      reviewWordIds: [],
      lexiconWordIds: [],
      cards: cardsForSpec(spec),
    };
    await writeJson(`data/jp/curriculum/units/unit_${String(spec.id).padStart(3, "0")}.json`, unit);
  }
}

await main();
console.log("Authored Kana prelude units 101-103.");
