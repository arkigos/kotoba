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

const lexicon = new Map();
const wordsByUnit = new Map();
for (let unitId = 1; unitId <= 7; unitId += 1) {
  const unit = readJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`);
  wordsByUnit.set(unitId, unit.newWords.map((word) => word.id));
  for (const word of unit.newWords) lexicon.set(word.id, word);
}

const specs = [
  {
    id: 8,
    slug: "where-and-when",
    title: "Unit 8: Asking Where And When",
    grammarFocus: "どこ / いつ / ここ / そこ / あそこ",
    words: [
      ["doko", "どこ", "どこ", "where", "question"],
      ["itsu", "いつ", "いつ", "when", "question"],
      ["kyou", "今日", "きょう", "today", "time"],
      ["ashita", "明日", "あした", "tomorrow", "time"],
      ["ima", "今", "いま", "now", "time"],
      ["koko", "ここ", "ここ", "here", "place"],
      ["soko", "そこ", "そこ", "there near you", "place"],
      ["asoko", "あそこ", "あそこ", "over there", "place"],
      ["kouen", "公園", "こうえん", "park", "place"],
      ["toshokan", "図書館", "としょかん", "library", "place"],
    ],
  },
  {
    id: 9,
    slug: "sentence-endings",
    title: "Unit 9: Sentence Endings",
    grammarFocus: "ね / よ",
    words: [
      ["tenki", "天気", "てんき", "weather", "noun"],
      ["ame", "雨", "あめ", "rain", "noun"],
      ["yuki_snow", "雪", "ゆき", "snow", "noun"],
      ["kaze", "風", "かぜ", "wind", "noun"],
      ["sora", "空", "そら", "sky", "noun"],
      ["umi", "海", "うみ", "sea", "place"],
      ["yama", "山", "やま", "mountain", "place"],
      ["machi", "町", "まち", "town", "place"],
      ["shima", "島", "しま", "island", "place"],
      ["kuni", "国", "くに", "country", "place"],
    ],
  },
  {
    id: 10,
    slug: "i-adjectives-present",
    title: "Unit 10: I-Adjectives, Present",
    grammarFocus: "大きいN / Nは大きいです",
    words: [
      ["ookii", "大きい", "おおきい", "big", "adjective"],
      ["chiisai", "小さい", "ちいさい", "small", "adjective"],
      ["atarashii", "新しい", "あたらしい", "new", "adjective"],
      ["furui", "古い", "ふるい", "old", "adjective"],
      ["takai", "高い", "たかい", "tall; expensive", "adjective"],
      ["yasui", "安い", "やすい", "cheap", "adjective"],
      ["nagai", "長い", "ながい", "long", "adjective"],
      ["mijikai", "短い", "みじかい", "short", "adjective"],
      ["akai", "赤い", "あかい", "red", "adjective"],
      ["shiroi", "白い", "しろい", "white", "adjective"],
    ],
  },
  {
    id: 11,
    slug: "i-adjectives-negative-past",
    title: "Unit 11: I-Adjectives, Negative And Past",
    grammarFocus: "大きくないです / 大きかったです / 大きくなかったです",
    words: [
      ["atsui", "暑い", "あつい", "hot", "adjective"],
      ["samui", "寒い", "さむい", "cold", "adjective"],
      ["isogashii", "忙しい", "いそがしい", "busy", "adjective"],
      ["tanoshii", "楽しい", "たのしい", "fun", "adjective"],
      ["muzukashii", "難しい", "むずかしい", "difficult", "adjective"],
      ["yasashii_easy", "易しい", "やさしい", "easy", "adjective"],
      ["oishii", "美味しい", "おいしい", "delicious", "adjective"],
      ["hayai", "早い", "はやい", "early; fast", "adjective"],
      ["osoi", "遅い", "おそい", "late; slow", "adjective"],
      ["akarui", "明るい", "あかるい", "bright", "adjective"],
    ],
  },
  {
    id: 12,
    slug: "na-adjectives-present",
    title: "Unit 12: Na-Adjectives, Present",
    grammarFocus: "静かなN / Nは静かです",
    words: [
      ["shizuka", "静か", "しずか", "quiet", "adjectival noun"],
      ["nigiyaka", "にぎやか", "にぎやか", "lively", "adjectival noun"],
      ["kirei", "きれい", "きれい", "pretty; clean", "adjectival noun"],
      ["genki", "元気", "げんき", "healthy; energetic", "adjectival noun"],
      ["yuumei", "有名", "ゆうめい", "famous", "adjectival noun"],
      ["shinsetsu", "親切", "しんせつ", "kind", "adjectival noun"],
      ["kantan", "簡単", "かんたん", "simple", "adjectival noun"],
      ["taisetsu", "大切", "たいせつ", "important", "adjectival noun"],
      ["anzen", "安全", "あんぜん", "safe", "adjectival noun"],
      ["kiken", "危険", "きけん", "dangerous", "adjectival noun"],
    ],
  },
  {
    id: 13,
    slug: "na-adjectives-negative-past",
    title: "Unit 13: Na-Adjectives, Negative And Past",
    grammarFocus: "静かではありません / 静かでした / 静かではありませんでした",
    words: [
      ["hima", "暇", "ひま", "free; not busy", "adjectival noun"],
      ["hen", "変", "へん", "strange", "adjectival noun"],
      ["suteki", "すてき", "すてき", "lovely", "adjectival noun"],
      ["majime", "真面目", "まじめ", "serious", "adjectival noun"],
      ["teinei", "丁寧", "ていねい", "polite; careful", "adjectival noun"],
      ["shitsurei", "失礼", "しつれい", "rude", "adjectival noun"],
      ["fukuzatsu", "複雑", "ふくざつ", "complex", "adjectival noun"],
      ["tokubetsu", "特別", "とくべつ", "special", "adjectival noun"],
      ["futsuu", "普通", "ふつう", "ordinary", "adjectival noun"],
      ["zannen", "残念", "ざんねん", "unfortunate", "adjectival noun"],
    ],
  },
  {
    id: 14,
    slug: "degree-words",
    title: "Unit 14: Degree Words",
    grammarFocus: "とても / あまり...ない",
    words: [
      ["totemo", "とても", "とても", "very", "adverb"],
      ["amari", "あまり", "あまり", "not very; too much", "adverb"],
      ["sukoshi", "少し", "すこし", "a little", "adverb"],
      ["maa_maa", "まあまあ", "まあまあ", "so-so", "adverb"],
      ["hontou_ni", "本当に", "ほんとうに", "really", "adverb"],
      ["kanari", "かなり", "かなり", "rather; considerably", "adverb"],
      ["zenzen", "全然", "ぜんぜん", "not at all", "adverb"],
      ["mou", "もう", "もう", "already; anymore", "adverb"],
      ["mada", "まだ", "まだ", "still; not yet", "adverb"],
      ["chotto", "ちょっと", "ちょっと", "a little; briefly", "adverb"],
    ],
  },
  {
    id: 15,
    slug: "existence-for-things",
    title: "Unit 15: Existence For Things",
    grammarFocus: "Nがあります",
    words: [
      ["hako", "箱", "はこ", "box", "noun"],
      ["mado", "窓", "まど", "window", "noun"],
      ["doa", "ドア", "どあ", "door", "noun"],
      ["sara", "皿", "さら", "plate", "noun"],
      ["koppu", "コップ", "こっぷ", "cup", "noun"],
      ["chizu", "地図", "ちず", "map", "noun"],
      ["kami", "紙", "かみ", "paper", "noun"],
      ["pen", "ペン", "ぺん", "pen", "noun"],
      ["hana_flower", "花", "はな", "flower", "noun"],
      ["denwa", "電話", "でんわ", "telephone", "noun"],
    ],
  },
  {
    id: 16,
    slug: "existence-for-living-things",
    title: "Unit 16: Existence For People And Animals",
    grammarFocus: "Nがいます",
    words: [
      ["sobo", "祖母", "そぼ", "grandmother", "person"],
      ["sofu", "祖父", "そふ", "grandfather", "person"],
      ["ani", "兄", "あに", "older brother", "person"],
      ["imouto", "妹", "いもうと", "younger sister", "person"],
      ["akachan", "赤ちゃん", "あかちゃん", "baby", "person"],
      ["tori", "鳥", "とり", "bird", "animal"],
      ["sakana", "魚", "さかな", "fish", "animal"],
      ["uma", "馬", "うま", "horse", "animal"],
      ["ushi", "牛", "うし", "cow", "animal"],
      ["mushi", "虫", "むし", "bug", "animal"],
    ],
  },
  {
    id: 17,
    slug: "existence-in-a-place",
    title: "Unit 17: Existence In A Place",
    grammarFocus: "場所にNがあります / 場所にNがいます",
    words: [
      ["daidokoro", "台所", "だいどころ", "kitchen", "place"],
      ["niwa", "庭", "にわ", "garden", "place"],
      ["kyoushitsu", "教室", "きょうしつ", "classroom", "place"],
      ["shokudou", "食堂", "しょくどう", "cafeteria", "place"],
      ["toire", "トイレ", "といれ", "toilet; restroom", "place"],
      ["michi", "道", "みち", "road", "place"],
      ["hashi_bridge", "橋", "はし", "bridge", "place"],
      ["kawa", "川", "かわ", "river", "place"],
      ["kuukou", "空港", "くうこう", "airport", "place"],
      ["hoteru", "ホテル", "ほてる", "hotel", "place"],
    ],
  },
  {
    id: 18,
    slug: "location-words",
    title: "Unit 18: Location Words",
    grammarFocus: "上 / 下 / 中 / 前 / 後ろ / 隣 / Aの上",
    words: [
      ["ue", "上", "うえ", "above; on top", "location"],
      ["shita", "下", "した", "below; under", "location"],
      ["naka", "中", "なか", "inside", "location"],
      ["mae", "前", "まえ", "front; before", "location"],
      ["ushiro", "後ろ", "うしろ", "behind", "location"],
      ["tonari", "隣", "となり", "next to", "location"],
      ["migi", "右", "みぎ", "right", "location"],
      ["hidari", "左", "ひだり", "left", "location"],
      ["aida", "間", "あいだ", "between", "location"],
      ["chikaku", "近く", "ちかく", "nearby", "location"],
    ],
  },
  {
    id: 19,
    slug: "basic-numbers-counters",
    title: "Unit 19: Basic Numbers And Counters",
    grammarFocus: "一つ / 二つ / 三つ / Nが一つあります",
    words: [
      ["hitotsu", "一つ", "ひとつ", "one thing", "quantity"],
      ["futatsu", "二つ", "ふたつ", "two things", "quantity"],
      ["mittsu", "三つ", "みっつ", "three things", "quantity"],
      ["yottsu", "四つ", "よっつ", "four things", "quantity"],
      ["itsutsu", "五つ", "いつつ", "five things", "quantity"],
      ["muttsu", "六つ", "むっつ", "six things", "quantity"],
      ["nanatsu", "七つ", "ななつ", "seven things", "quantity"],
      ["yattsu", "八つ", "やっつ", "eight things", "quantity"],
      ["kokonotsu", "九つ", "ここのつ", "nine things", "quantity"],
      ["too", "十", "とお", "ten things", "quantity"],
    ],
  },
  {
    id: 20,
    slug: "a1-scene-review",
    title: "Unit 20: A1 Scene Review",
    grammarFocus: "A1 mixed identity, question, time, adjective, existence, and location review",
    words: [
      ["ichiba", "市場", "いちば", "market", "place"],
      ["kouban", "交番", "こうばん", "police box", "place"],
      ["yuubinkyoku", "郵便局", "ゆうびんきょく", "post office", "place"],
      ["ginkou", "銀行", "ぎんこう", "bank", "place"],
      ["eigakan", "映画館", "えいがかん", "movie theater", "place"],
      ["resutoran", "レストラン", "れすとらん", "restaurant", "place"],
      ["kafe", "カフェ", "かふぇ", "cafe", "place"],
      ["basu", "バス", "ばす", "bus", "noun"],
      ["densha", "電車", "でんしゃ", "train", "noun"],
      ["chiketto", "チケット", "ちけっと", "ticket", "noun"],
    ],
  },
];

for (const spec of specs) {
  for (const [id, surface, reading, meaning, fn] of spec.words) {
    lexicon.set(id, { id, surface, reading, meaning, function: fn });
  }
  wordsByUnit.set(spec.id, spec.words.map(([id]) => id));
}

const pools = {
  nouns: [
    ["hon", "book"],
    ["kaban", "bag"],
    ["shashin", "photo"],
    ["mizu", "water"],
    ["ocha", "tea"],
    ["neko", "cat"],
    ["inu", "dog"],
    ["doubutsu", "animal"],
    ["tabemono", "food"],
    ["nomimono", "drink"],
  ],
  people: [
    ["sensei", "the teacher"],
    ["gakusei", "the student"],
    ["tomodachi", "the friend"],
    ["isha", "the doctor"],
    ["haha", "my mother"],
    ["chichi", "my father"],
    ["ane", "my older sister"],
    ["otouto", "my younger brother"],
  ],
  places: [
    ["koko", "here"],
    ["soko", "there near you"],
    ["asoko", "over there"],
    ["kouen", "the park"],
    ["toshokan", "the library"],
    ["gakkou", "the school"],
    ["mise", "the shop"],
    ["eki", "the station"],
    ["byouin", "the hospital"],
    ["kaisha", "the company"],
  ],
  times: [
    ["kyou", "today"],
    ["ashita", "tomorrow"],
    ["ima", "now"],
    ["kinou", "yesterday"],
    ["sengetsu", "last month"],
    ["kyonen", "last year"],
    ["asa", "morning"],
    ["yoru", "night"],
  ],
};

const facts = {
  question: "Question words sit where the missing answer would normally sit in the Japanese sentence.",
  ending: "`ね` checks shared feeling or agreement; `よ` presents information with a little emphasis.",
  iAdj: "I-adjectives can come before a noun directly, and they can also end a polite sentence with `です`.",
  iPast: "I-adjectives change shape before `です` when they are negative or past.",
  naAdj: "Na-adjectives use `な` before a noun, but no `な` before `です`.",
  degree: "Degree words come before the adjective or phrase they modify.",
  aru: "`あります` is used for things, events, and non-living objects.",
  iru: "`います` is used for people and animals.",
  place: "Japanese puts the place before `に` when saying where something exists.",
  loc: "Location nouns work like small nouns: `Aの上` means `on top of A`.",
  count: "Small native counters like `一つ` count objects when a more specific counter is not needed yet.",
  review: "A1 review cards recombine familiar grammar so sentences feel reusable, not isolated.",
};

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
  ka: () => grammar("か", "か", "question marker"),
  no: () => grammar("の", "の", "possession or description marker"),
  ni: () => grammar("に", "に", "location or time marker"),
  na: () => grammar("な", "な", "noun-linking marker for na-adjectives"),
  desu: () => grammar("です", "です", "polite sentence ending"),
  desuKa: () => grammar("ですか", "ですか", "polite question ending"),
  deshita: () => grammar("でした", "でした", "polite past ending"),
  dewaArimasen: () => grammar("ではありません", "でわありません", "polite negative ending"),
  dewaArimasenDeshita: () => grammar("ではありませんでした", "でわありませんでした", "polite past negative ending"),
  arimasu: () => grammar("あります", "あります", "exists; there is"),
  arimasuKa: () => grammar("ありますか", "ありますか", "is there?"),
  imasu: () => grammar("います", "います", "exists for living things; there is"),
  imasuKa: () => grammar("いますか", "いますか", "is there?"),
  ne: () => grammar("ね", "ね", "sentence ending seeking agreement"),
  yo: () => grammar("よ", "よ", "sentence ending giving emphasis or new information"),
};

function expandedParts(parts) {
  return parts.flatMap((part) => {
    if (part.surface === "ですか") return [jp.desu(), jp.ka()];
    if (part.surface === "ありますか") return [jp.arimasu(), jp.ka()];
    if (part.surface === "いますか") return [jp.imasu(), jp.ka()];
    return [part];
  });
}

function cardParts(parts) {
  return expandedParts(parts).filter((part) => part.surface !== "\u3002");
}

function cardEnglish(english) {
  return english.replace(/\.+$/, "");
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

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const properNouns = new Set(["Japan", "America"]);
const pronounMeanings = new Set(["I", "me", "you", "he", "him", "she", "her"]);
const uncountableNouns = new Set(["water", "tea", "weather", "rain", "snow", "wind", "sky", "paper", "work", "food"]);
const countries = new Set(["Japan", "America"]);

function bareMeaning(value) {
  return value.split(";")[0];
}

function needsArticle(value) {
  return !properNouns.has(value) && !uncountableNouns.has(value) && !value.startsWith("the ") && !value.startsWith("my ");
}

function aOrAn(value) {
  return /^[aeiou]/i.test(value) ? "an" : "a";
}

function nounPhrase(value, definite = false) {
  if (pronounMeanings.has(value)) return value;
  if (properNouns.has(value) || value.startsWith("the ") || value.startsWith("my ")) return value;
  if (uncountableNouns.has(value)) return definite ? `the ${value}` : value;
  return `${definite ? "the" : aOrAn(value)} ${value}`;
}

function adjectiveNounPhrase(adjective, noun) {
  return `${aOrAn(adjective)} ${adjective} ${noun}`;
}

function pluralize(value) {
  if (/[bcdfghjklmnpqrstvwxyz]y$/i.test(value)) return `${value.slice(0, -1)}ies`;
  if (value.endsWith("s") || value.endsWith("x") || value.endsWith("ch") || value.endsWith("sh")) return `${value}es`;
  return `${value}s`;
}

const iAdjectiveNegativeForms = new Map([
  ["ookii", ["大きくない", "おおきくない", "not big"]],
  ["chiisai", ["小さくない", "ちいさくない", "not small"]],
  ["atarashii", ["新しくない", "あたらしくない", "not new"]],
  ["furui", ["古くない", "ふるくない", "not old"]],
  ["takai", ["高くない", "たかくない", "not tall; not expensive"]],
  ["yasui", ["安くない", "やすくない", "not cheap"]],
  ["nagai", ["長くない", "ながくない", "not long"]],
  ["mijikai", ["短くない", "みじかくない", "not short"]],
  ["akai", ["赤くない", "あかくない", "not red"]],
  ["shiroi", ["白くない", "しろくない", "not white"]],
  ["atsui", ["暑くない", "あつくない", "not hot"]],
  ["samui", ["寒くない", "さむくない", "not cold"]],
  ["isogashii", ["忙しくない", "いそがしくない", "not busy"]],
  ["tanoshii", ["楽しくない", "たのしくない", "not fun"]],
  ["muzukashii", ["難しくない", "むずかしくない", "not difficult"]],
  ["yasashii_easy", ["易しくない", "やさしくない", "not easy"]],
  ["oishii", ["美味しくない", "おいしくない", "not delicious"]],
  ["hayai", ["早くない", "はやくない", "not early"]],
  ["osoi", ["遅くない", "おそくない", "not late"]],
  ["akarui", ["明るくない", "あかるくない", "not bright"]],
]);

function negativeDescriptionParts(id) {
  const form = iAdjectiveNegativeForms.get(id);
  if (form) return [word(id, form[0], form[1], form[2]), jp.desu()];
  return [word(id), jp.dewaArimasen()];
}

function degreeEnglish(adverbId, adjective) {
  const adjectiveMeaning = bareMeaning(lexicon.get(adjective).meaning);
  switch (adverbId) {
    case "totemo": return `It is very ${adjectiveMeaning}.`;
    case "amari": return `It is not very ${adjectiveMeaning}.`;
    case "sukoshi": return `It is a little ${adjectiveMeaning}.`;
    case "maa_maa": return `It is somewhat ${adjectiveMeaning}.`;
    case "hontou_ni": return `It is really ${adjectiveMeaning}.`;
    case "kanari": return `It is quite ${adjectiveMeaning}.`;
    case "zenzen": return `It is not at all ${adjectiveMeaning}.`;
    case "mou": return `It is already ${adjectiveMeaning}.`;
    case "mada": return `It is still ${adjectiveMeaning}.`;
    case "chotto": return `It is a little ${adjectiveMeaning}.`;
    default: return `It is ${adjectiveMeaning}.`;
  }
}

function locationTarget(anchor) {
  return nounPhrase(anchor[1], true);
}

function locationPhrase(locId, anchor, otherAnchor) {
  if (locId === "aida") {
    return {
      parts: [word(anchor[0]), grammar("と", "と", "and"), word(otherAnchor[0]), jp.no(), word(locId)],
      english: `between ${locationTarget(anchor)} and ${locationTarget(otherAnchor)}`,
    };
  }

  const target = locationTarget(anchor);
  const english = {
    ue: `on top of ${target}`,
    shita: `under ${target}`,
    naka: `inside ${target}`,
    mae: `in front of ${target}`,
    ushiro: `behind ${target}`,
    tonari: `next to ${target}`,
    migi: `to the right of ${target}`,
    hidari: `to the left of ${target}`,
    chikaku: `near ${target}`,
  }[locId] ?? `${bareMeaning(lexicon.get(locId).meaning)} ${target}`;

  return { parts: [word(anchor[0]), jp.no(), word(locId)], english };
}

function existenceEnglish(subject, locationEnglish, living = false) {
  const phrase = nounPhrase(subject);
  if (living && (properNouns.has(subject) || phrase.startsWith("the ") || phrase.startsWith("my "))) return `${capitalize(phrase)} is ${locationEnglish}.`;
  return `There is ${phrase} ${locationEnglish}.`;
}

function placeLocation(value) {
  if (["here", "there near you", "over there"].includes(value)) return value;
  return `at ${value}`;
}

function containmentLocation(placeId, meaning) {
  if (["michi", "hashi_bridge"].includes(placeId)) return `on ${nounPhrase(meaning, true)}`;
  if (["kuukou"].includes(placeId)) return `at ${nounPhrase(meaning, true)}`;
  return `in ${nounPhrase(meaning, true)}`;
}

const countWords = new Map([
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

function countSentence(countId, noun, location) {
  const [number, amount] = countWords.get(countId);
  const object = amount === 1 ? noun : pluralize(noun);
  const verb = amount === 1 ? "is" : "are";
  return `There ${verb} ${number} ${object}${location ? ` ${placeLocation(location)}` : ""}.`;
}

function countLabel(countId) {
  return countWords.get(countId)[0];
}

function countObservation(countId, noun) {
  const sentence = countSentence(countId, noun).replace(/\.$/, "");
  return countWords.get(countId)[1] === 1 ? `${sentence}, isn't there?` : `${sentence}, aren't there?`;
}

function cycle(list, count) {
  return Array.from({ length: count }, (_, index) => list[index % list.length]);
}

function append(cards, unitId, rows, build) {
  for (const row of rows) cards.push(build(row, cards.length + 1));
}

function simpleUnit(spec, handlers) {
  const cards = [];
  for (const handler of handlers) append(cards, spec.id, handler.rows, handler.build);
  if (cards.length !== 80) throw new Error(`${spec.title}: expected 80 cards, got ${cards.length}`);
  return cards;
}

function reviewVocabularyUnitIds(unitId) {
  const units = [];
  for (let offset = 2; unitId - offset >= 1; offset *= 2) units.push(unitId - offset);
  return units;
}

function usedWordIds(cards) {
  const ids = new Set();
  for (const card of cards) {
    for (const token of card.tokens) {
      if (token.wordId) ids.add(token.wordId);
    }
  }
  return ids;
}

function requiredWordIds(unitId) {
  const ids = new Set();
  for (const sourceUnitId of [unitId, ...reviewVocabularyUnitIds(unitId)]) {
    for (const wordId of wordsByUnit.get(sourceUnitId) ?? []) ids.add(wordId);
  }
  return ids;
}

function reviewCard(unitId, index, wordId) {
  const entry = lexicon.get(wordId);
  if (!entry) throw new Error(`Unknown review word ${wordId}`);
  const meaning = bareMeaning(entry.meaning);
  const prompt = `A focused review card for ${entry.surface}.`;
  const tags = ["review vocabulary"];

  if (wordId === "doko") return makeCard(unitId, index, [word("doko"), jp.desuKa(), jp.q()], "Where is it?", tags, prompt, facts.review);
  if (wordId === "itsu") return makeCard(unitId, index, [word("itsu"), jp.desuKa(), jp.q()], "When is it?", tags, prompt, facts.review);
  if (wordId === "nan") return makeCard(unitId, index, [word("nan"), jp.desuKa(), jp.q()], "What is it?", tags, prompt, facts.review);
  if (wordId === "dare") return makeCard(unitId, index, [word("dare"), jp.desuKa(), jp.q()], "Who is it?", tags, prompt, facts.review);
  if (wordId === "dore") return makeCard(unitId, index, [word("dore"), jp.desuKa(), jp.q()], "Which one is it?", tags, prompt, facts.review);
  if (wordId === "dono") return makeCard(unitId, index, [word("dono"), word("hon"), jp.desuKa(), jp.q()], "Which book is it?", tags, prompt, facts.review);

  if (["kore", "sore", "are"].includes(wordId)) {
    const english = { kore: "This is a book.", sore: "That near you is a book.", are: "That over there is a book." }[wordId];
    return makeCard(unitId, index, [word(wordId), jp.wa(), word("hon"), jp.desu(), jp.p()], english, tags, prompt, facts.review);
  }

  if (["kono", "sono", "ano"].includes(wordId)) {
    const english = { kono: "It is this book.", sono: "It is that book near you.", ano: "It is that book over there." }[wordId];
    return makeCard(unitId, index, [word(wordId), word("hon"), jp.desu(), jp.p()], english, tags, prompt, facts.review);
  }

  if (entry.function === "time") {
    if (wordId === "yasumi") {
      return makeCard(unitId, index, [word("kyou"), jp.wa(), word(wordId), jp.desu(), jp.p()], "Today is a day off.", tags, prompt, facts.review);
    }
    return makeCard(unitId, index, [word(wordId), jp.wa(), word("yasumi"), jp.desu(), jp.p()], `${capitalize(meaning)} is a day off.`, tags, prompt, facts.review);
  }

  if (entry.function === "place") {
    return makeCard(unitId, index, [word(wordId), jp.wa(), word("doko"), jp.desuKa(), jp.q()], `Where is ${countries.has(meaning) ? meaning : nounPhrase(meaning, true)}?`, tags, prompt, facts.review);
  }

  if (entry.function === "adverb") {
    const negative = ["amari", "zenzen"].includes(wordId);
    const adjective = "ookii";
    const description = negative ? negativeDescriptionParts(adjective) : [word(adjective), jp.desu()];
    return makeCard(
      unitId,
      index,
      [word(wordId), ...description, jp.p()],
      degreeEnglish(wordId, adjective),
      tags,
      prompt,
      facts.review
    );
  }

  if (entry.function === "location") {
    if (wordId === "aida") {
      return makeCard(unitId, index, [word("hon"), jp.wa(), word("tsukue"), grammar("と", "と", "and"), word("isu"), jp.no(), word(wordId), jp.desu(), jp.p()], "The book is between the desk and the chair.", tags, prompt, facts.review);
    }
    const loc = locationPhrase(wordId, ["tsukue", "desk"]);
    return makeCard(unitId, index, [word("hon"), jp.wa(), ...loc.parts, jp.desu(), jp.p()], `The book is ${loc.english}.`, tags, prompt, facts.review);
  }

  if (entry.function === "quantity") {
    return makeCard(unitId, index, [word("hon"), jp.ga(), word(wordId), jp.arimasu(), jp.p()], countSentence(wordId, "book"), tags, prompt, facts.review);
  }

  if (entry.function === "animal" && unitId >= 16) {
    return makeCard(unitId, index, [word(wordId), jp.ga(), jp.imasu(), jp.p()], `There is ${nounPhrase(meaning)}.`, tags, prompt, facts.review);
  }

  if (entry.function === "adjective" || entry.function === "adjectival noun") {
    return makeCard(unitId, index, [word("kore"), jp.wa(), word(wordId), jp.desu(), jp.p()], `This one is ${meaning}.`, tags, prompt, facts.review);
  }

  if (wordId === "watashi") return makeCard(unitId, index, [word("kore"), jp.wa(), word(wordId), jp.desu(), jp.p()], "It's me.", tags, prompt, facts.review);
  if (wordId === "sakura") return makeCard(unitId, index, [word("kore"), jp.wa(), word(wordId), jp.desu(), jp.p()], "It's you.", tags, prompt, facts.review);
  if (wordId === "yuki") return makeCard(unitId, index, [word("kore"), jp.wa(), word(wordId), jp.desu(), jp.p()], "It's him.", tags, prompt, facts.review);
  if (wordId === "tanaka") return makeCard(unitId, index, [word("kore"), jp.wa(), word(wordId), jp.desu(), jp.p()], "It's her.", tags, prompt, facts.review);
  return makeCard(unitId, index, [word("kore"), jp.wa(), word(wordId), jp.desu(), jp.p()], `This is ${nounPhrase(meaning)}.`, tags, prompt, facts.review);
}

function ensureRequiredWords(spec, cards) {
  const required = requiredWordIds(spec.id);
  let present = usedWordIds(cards);
  let missing = [...required].filter((wordId) => !present.has(wordId));

  for (const wordId of missing) {
    cards.push(reviewCard(spec.id, cards.length + 1, wordId));
  }

  present = usedWordIds(cards);
  missing = [...required].filter((wordId) => !present.has(wordId));
  if (missing.length > 0) throw new Error(`${spec.title}: missing required words after review fill: ${missing.join(", ")}`);
  if (cards.length > 150) throw new Error(`${spec.title}: generated ${cards.length} cards, above the 150-card unit limit`);
}

function generateCards(spec) {
  const unitWords = spec.words.map(([id, , , meaning]) => [id, bareMeaning(meaning)]);

  if (spec.id === 8) {
    const sceneRows = [
      ["koko", "gakkou", "Here is the school."],
      ["soko", "mise", "There near you is the shop."],
      ["asoko", "kouen", "Over there is the park."],
      ["koko", "toshokan", "Here is the library."],
      ["soko", "eki", "There near you is the station."],
      ["asoko", "byouin", "Over there is the hospital."],
      ["koko", "heya", "Here is the room."],
      ["soko", "kaisha", "There near you is the company."],
      ["asoko", "ie", "Over there is the house."],
      ["koko", "basho", "Here is the place."],
    ];
    const timeRows = [
      ["kyou", "yasumi", "Today is a day off."],
      ["ashita", "shigoto", "Tomorrow is work."],
      ["ima", "shigoto", "Now is work."],
      ["kyou", "yasumi", "Today is a day off."],
      ["ashita", "ryokou", "Tomorrow is the trip."],
      ["ima", "yasumi", "Now is a break."],
      ["kyou", "shigoto", "Today is work."],
      ["ashita", "gakkou", "Tomorrow is school."],
      ["ima", "gakkou", "Now is school."],
      ["kyou", "ryokou", "Today is the trip."],
    ];
    const contrastRows = [
      ["koko", "kouen", "Here is the park."],
      ["soko", "toshokan", "There near you is the library."],
      ["asoko", "gakkou", "Over there is the school."],
      ["koko", "mise", "Here is the shop."],
      ["soko", "byouin", "There near you is the hospital."],
      ["asoko", "eki", "Over there is the station."],
      ["koko", "kaisha", "Here is the company."],
      ["soko", "heya", "There near you is the room."],
      ["asoko", "basho", "Over there is the place."],
      ["koko", "ie", "Here is the house."],
    ];
    return simpleUnit(spec, [
      { rows: [...sceneRows, ...timeRows], build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word(r[1]), jp.desu(), jp.p()], r[2], ["AはBです"], "A simple place or time word in context.", facts.question) },
      { rows: cycle([...pools.places.slice(3), ...pools.people, ...pools.nouns], 30), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word("doko"), jp.desuKa(), jp.q()], `Where is ${nounPhrase(r[1], true)}?`, ["どこですか"], "A where-question scene.", facts.question) },
      { rows: cycle([["yasumi", "the day off"], ["ryokou", "the trip"], ["shigoto", "work"], ["gakkou", "school"], ["asa", "morning"], ["yoru", "night"]], 12), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word("itsu"), jp.desuKa(), jp.q()], `When is ${r[1]}?`, ["いつですか"], "A when-question scene.", facts.question) },
      { rows: cycle(contrastRows, 18), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word(r[1]), jp.desu(), jp.p()], r[2], ["ここ/そこ/あそこ"], "A here-there-over-there contrast.", facts.question) },
    ]);
  }

  if (spec.id === 9) {
    const placeWords = [
      ...unitWords.filter(([id]) => ["umi", "yama", "machi", "shima", "kuni", "sora"].includes(id)),
      ["kouen", "park"],
      ["toshokan", "library"],
      ["gakkou", "school"],
      ["mise", "shop"],
    ];
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("kore"), jp.wa(), word(r[0]), jp.desu(), jp.ne(), jp.p()], `This is ${nounPhrase(r[1], true)}, isn't it?`, ["ね"], "A shared-observation sentence.", facts.ending) },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("sore"), jp.wa(), word(r[0]), jp.desu(), jp.yo(), jp.p()], `That near you is ${nounPhrase(r[1], true)}, you know.`, ["よ"], "A sentence giving a small piece of information.", facts.ending) },
      { rows: cycle(placeWords, 20), build: (r, i) => makeCard(spec.id, i, [word("are"), jp.wa(), word(r[0]), jp.desu(), jp.yo(), jp.p()], `That over there is ${nounPhrase(r[1], true)}, you know.`, ["よ"], "A demonstrative sentence with emphasis.", facts.ending) },
      { rows: cycle(placeWords, 20), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word("doko"), jp.desuKa(), jp.ne(), jp.q()], `Where is ${nounPhrase(r[1], true)}, I wonder?`, ["どこ", "ね"], "A question softened by `ね`.", facts.ending) },
    ]);
  }

  if (spec.id === 10) {
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("kore"), jp.wa(), word(r[0]), jp.desu(), jp.p()], `This one is ${r[1]}.`, ["i-adjective present"], "A simple adjective predicate.", facts.iAdj) },
      { rows: cycle(unitWords, 20), build: (r, i) => { const noun = pools.nouns[i % pools.nouns.length]; return makeCard(spec.id, i, [word(r[0]), word(noun[0]), jp.desu(), jp.p()], `It is ${adjectiveNounPhrase(r[1], noun[1])}.`, ["i-adjective before noun"], "An adjective placed before a noun.", facts.iAdj); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const noun = pools.nouns[(i + 3) % pools.nouns.length]; return makeCard(spec.id, i, [word(noun[0]), jp.wa(), word(r[0]), jp.desu(), jp.p()], `The ${noun[1]} is ${r[1]}.`, ["i-adjective present"], "An adjective as the comment of a topic sentence.", facts.iAdj); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const noun = pools.nouns[(i + 5) % pools.nouns.length]; return makeCard(spec.id, i, [word("dono"), word(noun[0]), jp.ga(), word(r[0]), jp.desuKa(), jp.q()], `Which ${noun[1]} is ${r[1]}?`, ["どのN", "i-adjective present"], "A which-question with an adjective.", facts.iAdj); } },
    ]);
  }

  if (spec.id === 11) {
    const forms = new Map([
      ["atsui", ["暑くない", "あつくない", "not hot", "暑かった", "あつかった", "was hot", "暑くなかった", "あつくなかった", "was not hot"]],
      ["samui", ["寒くない", "さむくない", "not cold", "寒かった", "さむかった", "was cold", "寒くなかった", "さむくなかった", "was not cold"]],
      ["isogashii", ["忙しくない", "いそがしくない", "not busy", "忙しかった", "いそがしかった", "was busy", "忙しくなかった", "いそがしくなかった", "was not busy"]],
      ["tanoshii", ["楽しくない", "たのしくない", "not fun", "楽しかった", "たのしかった", "was fun", "楽しくなかった", "たのしくなかった", "was not fun"]],
      ["muzukashii", ["難しくない", "むずかしくない", "not difficult", "難しかった", "むずかしかった", "was difficult", "難しくなかった", "むずかしくなかった", "was not difficult"]],
      ["yasashii_easy", ["易しくない", "やさしくない", "not easy", "易しかった", "やさしかった", "was easy", "易しくなかった", "やさしくなかった", "was not easy"]],
      ["oishii", ["美味しくない", "おいしくない", "not delicious", "美味しかった", "おいしかった", "was delicious", "美味しくなかった", "おいしくなかった", "was not delicious"]],
      ["hayai", ["早くない", "はやくない", "not early", "早かった", "はやかった", "was early", "早くなかった", "はやくなかった", "was not early"]],
      ["osoi", ["遅くない", "おそくない", "not late", "遅かった", "おそかった", "was late", "遅くなかった", "おそくなかった", "was not late"]],
      ["akarui", ["明るくない", "あかるくない", "not bright", "明るかった", "あかるかった", "was bright", "明るくなかった", "あかるくなかった", "was not bright"]],
    ]);
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => { const f = forms.get(r[0]); return makeCard(spec.id, i, [word("kyou"), jp.wa(), word(r[0], f[0], f[1], f[2]), jp.desu(), jp.p()], `Today is ${f[2]}.`, ["i-adjective negative"], "A negative i-adjective sentence.", facts.iPast); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const f = forms.get(r[0]); return makeCard(spec.id, i, [word("kinou"), jp.wa(), word(r[0], f[3], f[4], f[5]), jp.desu(), jp.p()], `Yesterday ${f[5]}.`, ["i-adjective past"], "A past i-adjective sentence.", facts.iPast); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const f = forms.get(r[0]); return makeCard(spec.id, i, [word("kinou"), jp.wa(), word(r[0], f[6], f[7], f[8]), jp.desu(), jp.p()], `Yesterday ${f[8]}.`, ["i-adjective past negative"], "A past negative i-adjective sentence.", facts.iPast); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const f = forms.get(r[0]); const noun = pools.nouns[i % pools.nouns.length]; return makeCard(spec.id, i, [word(noun[0]), jp.wa(), word(r[0], f[3], f[4], f[5]), jp.desuKa(), jp.q()], `Was the ${noun[1]} ${r[1]}?`, ["i-adjective past question"], "A past adjective question.", facts.iPast); } },
    ]);
  }

  if (spec.id === 12) {
    const placeNouns = [["kouen", "park"], ["toshokan", "library"], ["gakkou", "school"], ["mise", "shop"], ["eki", "station"], ["byouin", "hospital"], ["kaisha", "company"], ["heya", "room"], ["ie", "house"], ["basho", "place"]];
    const questionForNaAdj = (wordId, meaning) => {
      if (wordId === "genki" || wordId === "shinsetsu") {
        return { parts: [word("dare"), jp.ga(), word(wordId), jp.desuKa(), jp.q()], english: `Who is ${meaning}?` };
      }
      if (wordId === "kantan" || wordId === "taisetsu") {
        return { parts: [word("nan"), jp.ga(), word(wordId), jp.desuKa(), jp.q()], english: `What is ${meaning}?` };
      }
      return { parts: [word("doko"), jp.ga(), word(wordId), jp.desuKa(), jp.q()], english: `Which place is ${meaning}?` };
    };
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("koko"), jp.wa(), word(r[0]), jp.desu(), jp.p()], `It is ${r[1]} here.`, ["na-adjective present"], "A na-adjective before `です`.", facts.naAdj) },
      { rows: cycle(unitWords, 20), build: (r, i) => { const noun = placeNouns[i % placeNouns.length]; return makeCard(spec.id, i, [word(r[0]), jp.na(), word(noun[0]), jp.desu(), jp.p()], `It is ${adjectiveNounPhrase(r[1], noun[1])}.`, ["na-adjective before noun"], "A na-adjective linked to a noun with `な`.", facts.naAdj); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const noun = pools.places[(i + 3) % pools.places.length]; return makeCard(spec.id, i, [word(noun[0]), jp.wa(), word(r[0]), jp.desu(), jp.p()], `${capitalize(noun[1])} is ${r[1]}.`, ["na-adjective present"], "A place described with a na-adjective.", facts.naAdj); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const question = questionForNaAdj(r[0], r[1]); return makeCard(spec.id, i, question.parts, question.english, ["question words", "na-adjective present"], "A question using a na-adjective as the missing description.", facts.naAdj); } },
    ]);
  }

  if (spec.id === 13) {
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("kyou"), jp.wa(), word(r[0]), jp.dewaArimasen(), jp.p()], `Today is not ${r[1]}.`, ["na-adjective negative"], "A negative na-adjective sentence.", facts.naAdj) },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("kinou"), jp.wa(), word(r[0]), jp.deshita(), jp.p()], `Yesterday was ${r[1]}.`, ["na-adjective past"], "A past na-adjective sentence.", facts.naAdj) },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("kinou"), jp.wa(), word(r[0]), jp.dewaArimasenDeshita(), jp.p()], `Yesterday was not ${r[1]}.`, ["na-adjective past negative"], "A past negative na-adjective sentence.", facts.naAdj) },
      { rows: cycle(unitWords, 20), build: (r, i) => { const noun = pools.places[i % pools.places.length]; return makeCard(spec.id, i, [word(noun[0]), jp.wa(), word(r[0]), jp.deshita(), jp.ne(), jp.p()], `${noun[1]} was ${r[1]}, wasn't it?`, ["na-adjective past", "ね"], "A past description with a sentence ending.", facts.naAdj); } },
    ]);
  }

  if (spec.id === 14) {
    const adjs = ["ookii", "chiisai", "atarashii", "furui", "takai", "yasui", "nagai", "mijikai", "akai", "shiroi", "atsui", "samui", "isogashii", "tanoshii", "muzukashii", "yasashii_easy", "oishii", "hayai", "osoi", "akarui"];
    return simpleUnit(spec, [
      { rows: cycle(adjs, 20), build: (id, i) => makeCard(spec.id, i, [word("totemo"), word(id), jp.desu(), jp.p()], degreeEnglish("totemo", id), ["とても"], "A strong degree word before a description.", facts.degree) },
      { rows: cycle(adjs, 20), build: (id, i) => makeCard(spec.id, i, [word("sukoshi"), word(id), jp.desu(), jp.p()], degreeEnglish("sukoshi", id), ["少し"], "A small degree word before a description.", facts.degree) },
      { rows: cycle(adjs, 20), build: (id, i) => makeCard(spec.id, i, [word("amari"), ...negativeDescriptionParts(id), jp.p()], degreeEnglish("amari", id), ["あまり...ない"], "`あまり` pairs naturally with a negative ending.", facts.degree) },
      { rows: cycle(unitWords, 20), build: (r, i) => { const adj = adjs[i % adjs.length]; const negative = r[0] === "zenzen" || r[0] === "amari"; const description = negative ? negativeDescriptionParts(adj) : [word(adj), jp.desu()]; return makeCard(spec.id, i, [word(r[0]), ...description, jp.p()], degreeEnglish(r[0], adj), ["degree words"], "A mixed degree-word review card.", facts.degree); } },
    ]);
  }

  if (spec.id === 15) {
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.ga(), jp.arimasu(), jp.p()], `There is ${nounPhrase(r[1])}.`, ["Nがあります"], "A thing exists.", facts.aru) },
      { rows: cycle(unitWords, 20), build: (r, i) => { const place = pools.places[i % pools.places.length]; return makeCard(spec.id, i, [word(place[0]), jp.ni(), word(r[0]), jp.ga(), jp.arimasu(), jp.p()], existenceEnglish(r[1], placeLocation(place[1])), ["場所にNがあります"], "A thing exists in a place.", facts.aru); } },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("doko"), jp.ni(), word(r[0]), jp.ga(), jp.arimasuKa(), jp.q()], `Where is there ${nounPhrase(r[1])}?`, ["どこ", "Nがあります"], "A where-question about existence.", facts.aru) },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("koko"), jp.ni(), word(r[0]), jp.ga(), jp.arimasu(), jp.ne(), jp.p()], `There is ${nounPhrase(r[1])} here, isn't there?`, ["Nがあります", "ね"], "Existence with shared attention.", facts.aru) },
    ]);
  }

  if (spec.id === 16) {
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.ga(), jp.imasu(), jp.p()], `There is ${nounPhrase(r[1])}.`, ["Nがいます"], "A living being exists.", facts.iru) },
      { rows: cycle(unitWords, 20), build: (r, i) => { const place = pools.places[i % pools.places.length]; return makeCard(spec.id, i, [word(place[0]), jp.ni(), word(r[0]), jp.ga(), jp.imasu(), jp.p()], existenceEnglish(r[1], placeLocation(place[1]), true), ["場所にNがいます"], "A living being exists in a place.", facts.iru); } },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word("doko"), jp.ni(), word(r[0]), jp.ga(), jp.imasuKa(), jp.q()], `Where is there ${nounPhrase(r[1])}?`, ["どこ", "Nがいます"], "A where-question about living beings.", facts.iru) },
      { rows: cycle(unitWords, 20), build: (r, i) => { const place = pools.places[(i + 3) % pools.places.length]; return makeCard(spec.id, i, [word(place[0]), jp.ni(), word(r[0]), jp.ga(), jp.imasu(), jp.yo(), jp.p()], `${existenceEnglish(r[1], placeLocation(place[1]), true).replace(/\.$/, "")}, you know.`, ["Nがいます", "よ"], "Existence with an emphatic ending.", facts.iru); } },
    ]);
  }

  if (spec.id === 17) {
    const things = [["hon", "book"], ["kaban", "bag"], ["shashin", "photo"], ["mizu", "water"], ["ocha", "tea"], ["neko", "cat"], ["inu", "dog"], ["doubutsu", "animal"], ["hako", "box"], ["denwa", "telephone"]];
    const beings = [...pools.people.slice(0, 6), ["tori", "bird"], ["sakana", "fish"], ["akachan", "baby"]];
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => { const thing = things[i % things.length]; return makeCard(spec.id, i, [word(r[0]), jp.ni(), word(thing[0]), jp.ga(), jp.arimasu(), jp.p()], existenceEnglish(thing[1], containmentLocation(r[0], r[1])), ["場所にNがあります"], "A thing exists in a new place.", facts.place); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const being = beings[i % beings.length]; return makeCard(spec.id, i, [word(r[0]), jp.ni(), word(being[0]), jp.ga(), jp.imasu(), jp.p()], existenceEnglish(being[1], containmentLocation(r[0], r[1]), true), ["場所にNがいます"], "A person or animal exists in a new place.", facts.place); } },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word("doko"), jp.desuKa(), jp.q()], `Where is the ${r[1]}?`, ["どこですか"], "A where-question about a place.", facts.place) },
      { rows: cycle(unitWords, 20), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word("shizuka"), jp.desu(), jp.ne(), jp.p()], `The ${r[1]} is quiet, isn't it?`, ["na-adjective present", "ね"], "A familiar description applied to a new place.", facts.place) },
    ]);
  }

  if (spec.id === 18) {
    const anchors = [["tsukue", "desk"], ["isu", "chair"], ["hako", "box"], ["mado", "window"], ["doa", "door"], ["ie", "house"], ["gakkou", "school"], ["mise", "shop"], ["toshokan", "library"], ["kouen", "park"]];
    const items = [["hon", "book"], ["kaban", "bag"], ["pen", "pen"], ["chizu", "map"], ["denwa", "telephone"], ["hana_flower", "flower"], ["mizu", "water"], ["ocha", "tea"], ["tabemono", "food"], ["shashin", "photo"]];
    const beings = [["neko", "cat"], ["inu", "dog"], ["tori", "bird"], ["akachan", "baby"], ["gakusei", "student"]];
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => { const anchor = anchors[i % anchors.length]; const otherAnchor = anchors[(i + 1) % anchors.length]; const item = items[i % items.length]; const loc = locationPhrase(r[0], anchor, otherAnchor); return makeCard(spec.id, i, [...loc.parts, jp.ni(), word(item[0]), jp.ga(), jp.arimasu(), jp.p()], existenceEnglish(item[1], loc.english), ["Aの上", "Nがあります"], "A thing exists at a relative location.", facts.loc); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const anchor = anchors[(i + 3) % anchors.length]; const otherAnchor = anchors[(i + 4) % anchors.length]; const being = beings[i % beings.length]; const loc = locationPhrase(r[0], anchor, otherAnchor); return makeCard(spec.id, i, [...loc.parts, jp.ni(), word(being[0]), jp.ga(), jp.imasu(), jp.p()], existenceEnglish(being[1], loc.english, true), ["Aの上", "Nがいます"], "A living being exists at a relative location.", facts.loc); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const anchor = anchors[(i + 5) % anchors.length]; const otherAnchor = anchors[(i + 6) % anchors.length]; const item = items[(i + 2) % items.length]; const loc = locationPhrase(r[0], anchor, otherAnchor); return makeCard(spec.id, i, [word(item[0]), jp.wa(), ...loc.parts, jp.desu(), jp.p()], `${capitalize(nounPhrase(item[1], true))} is ${loc.english}.`, ["Aの上"], "A location noun used as the sentence comment.", facts.loc); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const anchor = anchors[(i + 7) % anchors.length]; const otherAnchor = anchors[(i + 8) % anchors.length]; const loc = locationPhrase(r[0], anchor, otherAnchor); return makeCard(spec.id, i, [...loc.parts, jp.ni(), word("nan"), jp.ga(), jp.arimasuKa(), jp.q()], `What is ${loc.english}?`, ["何", "location nouns"], "A question about a relative location.", facts.loc); } },
    ]);
  }

  if (spec.id === 19) {
    const things = [["hon", "book"], ["kaban", "bag"], ["pen", "pen"], ["sara", "plate"], ["koppu", "cup"], ["hako", "box"], ["hana_flower", "flower"], ["chizu", "map"], ["mizu", "water"], ["mado", "window"]];
    return simpleUnit(spec, [
      { rows: cycle(unitWords, 20), build: (r, i) => { const thing = things[i % things.length]; return makeCard(spec.id, i, [word(thing[0]), jp.ga(), word(r[0]), jp.arimasu(), jp.p()], countSentence(r[0], thing[1]), ["basic counters"], "A native counter before `あります`.", facts.count); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const place = pools.places[i % pools.places.length]; const thing = things[(i + 3) % things.length]; return makeCard(spec.id, i, [word(place[0]), jp.ni(), word(thing[0]), jp.ga(), word(r[0]), jp.arimasu(), jp.p()], countSentence(r[0], thing[1], place[1]), ["場所にNがあります", "basic counters"], "A counted object in a place.", facts.count); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const thing = things[(i + 5) % things.length]; return makeCard(spec.id, i, [word(thing[0]), jp.wa(), word(r[0]), jp.desu(), jp.p()], `The ${thing[1]} count is ${countLabel(r[0])}.`, ["basic counters"], "A count used as the sentence comment.", facts.count); } },
      { rows: cycle(unitWords, 20), build: (r, i) => { const thing = things[(i + 7) % things.length]; return makeCard(spec.id, i, [word(thing[0]), jp.ga(), word(r[0]), jp.arimasu(), jp.ne(), jp.p()], countObservation(r[0], thing[1]), ["basic counters", "ね"], "A counted observation with `ね`.", facts.count); } },
    ]);
  }

  const places = spec.words.slice(0, 7).map(([id, , , meaning]) => [id, meaning]);
  const transport = spec.words.slice(7).map(([id, , , meaning]) => [id, meaning]);
  return simpleUnit(spec, [
    { rows: cycle([...places, ...transport], 20), build: (r, i) => makeCard(spec.id, i, [word(r[0]), jp.wa(), word("doko"), jp.desuKa(), jp.q()], `Where is ${nounPhrase(r[1], true)}?`, ["A1 review", "どこ"], "A practical A1 place question.", facts.review) },
    { rows: cycle(places, 20), build: (r, i) => { const item = transport[i % transport.length]; return makeCard(spec.id, i, [word(r[0]), jp.ni(), word(item[0]), jp.ga(), jp.arimasu(), jp.p()], `There is a ${item[1]} at the ${r[1]}.`, ["A1 review", "Nがあります"], "A practical existence sentence.", facts.review); } },
    { rows: cycle([...places, ...transport], 20), build: (r, i) => { const adj = ["ookii", "chiisai", "atarashii", "furui", "shizuka", "nigiyaka", "kirei", "taisetsu"][i % 8]; return makeCard(spec.id, i, [word(r[0]), jp.wa(), word(adj), jp.desu(), jp.ne(), jp.p()], `${capitalize(nounPhrase(r[1], true))} is ${bareMeaning(lexicon.get(adj).meaning)}, isn't it?`, ["A1 review", "ね"], "A description with a familiar sentence ending.", facts.review); } },
    { rows: cycle(places, 20), build: (r, i) => { const locId = ["mae", "ushiro", "tonari", "chikaku", "migi", "hidari", "naka", "ue"][i % 8]; const item = ["basu", "densha", "chiketto", "denwa", "pen", "kaban", "hako", "hon"][i % 8]; const loc = locationPhrase(locId, r); const itemMeaning = bareMeaning(lexicon.get(item).meaning); return makeCard(spec.id, i, [...loc.parts, jp.ni(), word(item), jp.ga(), jp.arimasu(), jp.p()], existenceEnglish(itemMeaning, loc.english), ["A1 review", "location nouns"], "A mixed A1 scene sentence.", facts.review); } },
  ]);
}

for (const spec of specs) {
  const unitSlug = `unit_${pad(spec.id)}`;
  const cards = generateCards(spec);
  ensureRequiredWords(spec, cards);
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
}

const indexPath = path.join(root, "data/jp/curriculum/unit_index.json");
const index = readJson("data/jp/curriculum/unit_index.json");
const indexed = new Map(index.units.map((entry) => [entry.id, entry]));
for (const spec of specs) {
  indexed.set(spec.id, {
    id: spec.id,
    slug: spec.slug,
    title: spec.title,
    grammarFocus: spec.grammarFocus,
    path: `data/jp/curriculum/units/unit_${pad(spec.id)}.json`,
  });
}
index.units = [...indexed.values()].sort((a, b) => a.id - b.id);
writeJson(indexPath, index);

console.log("Authored A1 units 8-20 with manifests and placeholder scenes.");
