import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { repairStarterUnit, reviewedSelectableObject } from "./lib/starter-semantic-repairs.mjs";
import { funSubjectIds } from "./lib/starter-content-quality.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const teachingWords = JSON.parse(await fs.readFile(path.join(root, "data/jp/dictionary/teaching_words.json"), "utf8")).words;

const jp = {
  wa: ["\u306f", "\u308f", "topic marker"],
  ga: ["\u304c", "\u304c", "subject marker"],
  o: ["\u3092", "\u3092", "object marker"],
  ni: ["\u306b", "\u306b", "location or time marker"],
  de: ["\u3067", "\u3067", "action location marker"],
  to: ["\u3068", "\u3068", "and; with"],
  mo: ["\u3082", "\u3082", "also; too"],
  no: ["\u306e", "\u306e", "possession marker"],
  ka: ["\u304b", "\u304b", "question marker"],
  desu: ["\u3067\u3059", "\u3067\u3059", "polite copula: is/am/are"],
  ne: ["\u306d", "\u306d", "seeking agreement"],
  yo: ["\u3088", "\u3088", "giving emphasis"],
  q: ["\uff1f", "\uff1f", "question mark"],
};

function fw(name) {
  const [surface, reading, explain] = jp[name];
  return { surface, reading, explain };
}

function w(id, surface, reading, meaning, fn, extra = {}) {
  return { id, surface, reading, meaning, function: fn, ...extra };
}

function verb(id, surface, reading, meaning, masu, masuReading, transitive = false) {
  return w(id, surface, reading, meaning, "verb", { masu, masuReading, transitive });
}

let units = [
  {
    id: 1,
    slug: "starter-classroom-japanese",
    title: "Unit 1: Classroom Japanese",
    grammarFocus: "\u3067\u3059 / N\u304c\u5206\u304b\u308a\u307e\u3059 / N\u3092\u8aad\u307f\u307e\u3059",
    newWords: [
      w("watashi", "\u79c1", "\u308f\u305f\u3057", "I; me", "person", { english: "I" }),
      w("anata", "\u3042\u306a\u305f", "\u3042\u306a\u305f", "you", "person", { english: "you" }),
      w("gakusei", "\u5b66\u751f", "\u304c\u304f\u305b\u3044", "student", "person"),
      w("sensei", "\u5148\u751f", "\u305b\u3093\u305b\u3044", "teacher", "person"),
      w("nihongo", "\u65e5\u672c\u8a9e", "\u306b\u307b\u3093\u3054", "Japanese language", "noun"),
      w("eigo", "\u82f1\u8a9e", "\u3048\u3044\u3054", "English language", "noun"),
      w("hiragana", "\u3072\u3089\u304c\u306a", "\u3072\u3089\u304c\u306a", "hiragana", "noun"),
      w("katakana", "\u30ab\u30bf\u30ab\u30ca", "\u304b\u305f\u304b\u306a", "katakana", "noun"),
      w("kanji", "\u6f22\u5b57", "\u304b\u3093\u3058", "kanji", "noun"),
      verb("yomu", "\u8aad\u3080", "\u3088\u3080", "read", "\u8aad\u307f\u307e\u3059", "\u3088\u307f\u307e\u3059", true),
      verb("kaku", "\u66f8\u304f", "\u304b\u304f", "write", "\u66f8\u304d\u307e\u3059", "\u304b\u304d\u307e\u3059", true),
      verb("wakaru", "\u5206\u304b\u308b", "\u308f\u304b\u308b", "understand", "\u5206\u304b\u308a\u307e\u3059", "\u308f\u304b\u308a\u307e\u3059"),
    ],
  },
  {
    id: 2,
    slug: "starter-countries-jobs",
    title: "Unit 2: Countries And Jobs",
    grammarFocus: "A\u306fB\u3067\u3059 / A\u306fB\u3067\u3059\u304b",
    newWords: [
      w("kuni", "\u56fd", "\u304f\u306b", "country", "place"),
      w("nihon", "\u65e5\u672c", "\u306b\u307b\u3093", "Japan", "proper"),
      w("oosutoraria", "\u30aa\u30fc\u30b9\u30c8\u30e9\u30ea\u30a2", "\u304a\u30fc\u3059\u3068\u3089\u308a\u3042", "Australia", "proper"),
      w("supein", "\u30b9\u30da\u30a4\u30f3", "\u3059\u307a\u3044\u3093", "Spain", "proper"),
      w("tai", "\u30bf\u30a4", "\u305f\u3044", "Thailand", "proper"),
      w("firipin", "\u30d5\u30a3\u30ea\u30d4\u30f3", "\u3075\u3043\u308a\u3074\u3093", "the Philippines", "proper"),
      w("roshia", "\u30ed\u30b7\u30a2", "\u308d\u3057\u3042", "Russia", "proper"),
      w("kaishain", "\u4f1a\u793e\u54e1", "\u304b\u3044\u3057\u3083\u3044\u3093", "company employee", "person"),
      w("enjinia", "\u30a8\u30f3\u30b8\u30cb\u30a2", "\u3048\u3093\u3058\u306b\u3042", "engineer", "person"),
      w("shufu", "\u4e3b\u5a66", "\u3057\u3085\u3075", "homemaker", "person"),
      verb("hataraku", "\u50cd\u304f", "\u306f\u305f\u3089\u304f", "work", "\u50cd\u304d\u307e\u3059", "\u306f\u305f\u3089\u304d\u307e\u3059"),
      verb("sumu", "\u4f4f\u3080", "\u3059\u3080", "live", "\u4f4f\u307f\u307e\u3059", "\u3059\u307f\u307e\u3059"),
    ],
  },
  {
    id: 3,
    slug: "starter-family-people",
    title: "Unit 3: Family And People",
    grammarFocus: "A\u306eB / A\u3082B\u3067\u3059",
    newWords: [
      w("kazoku", "\u5bb6\u65cf", "\u304b\u305e\u304f", "family", "person"),
      w("chichi", "\u7236", "\u3061\u3061", "father", "person"),
      w("haha", "\u6bcd", "\u306f\u306f", "mother", "person"),
      w("ani", "\u5144", "\u3042\u306b", "older brother", "person"),
      w("ane", "\u59c9", "\u3042\u306d", "older sister", "person"),
      w("otouto", "\u5f1f", "\u304a\u3068\u3046\u3068", "younger brother", "person"),
      w("imouto", "\u59b9", "\u3044\u3082\u3046\u3068", "younger sister", "person"),
      w("kodomo", "\u5b50\u3069\u3082", "\u3053\u3069\u3082", "child", "person"),
      w("tomodachi", "\u53cb\u9054", "\u3068\u3082\u3060\u3061", "friend", "person"),
      w("hito", "\u4eba", "\u3072\u3068", "person", "person"),
      verb("au", "\u4f1a\u3046", "\u3042\u3046", "meet", "\u4f1a\u3044\u307e\u3059", "\u3042\u3044\u307e\u3059", true),
      verb("hanasu", "\u8a71\u3059", "\u306f\u306a\u3059", "speak; talk", "\u8a71\u3057\u307e\u3059", "\u306f\u306a\u3057\u307e\u3059", true),
    ],
  },
  {
    id: 4,
    slug: "starter-food-drink",
    title: "Unit 4: Food And Drink",
    grammarFocus: "N\u3092V\u307e\u3059 / food and drink preferences",
    newWords: [
      w("gohan", "\u3054\u98ef", "\u3054\u306f\u3093", "meal; rice", "noun"),
      w("asagohan", "\u671d\u3054\u98ef", "\u3042\u3055\u3054\u306f\u3093", "breakfast", "noun"),
      w("pan", "\u30d1\u30f3", "\u3071\u3093", "bread", "noun"),
      w("mizu", "\u6c34", "\u307f\u305a", "water", "noun"),
      w("ocha", "\u304a\u8336", "\u304a\u3061\u3083", "tea", "noun"),
      w("koohii", "\u30b3\u30fc\u30d2\u30fc", "\u3053\u30fc\u3072\u30fc", "coffee", "noun"),
      w("gyuunyuu", "\u725b\u4e73", "\u304e\u3085\u3046\u306b\u3085\u3046", "milk", "noun"),
      w("sakana", "\u9b5a", "\u3055\u304b\u306a", "fish", "noun"),
      w("niku", "\u8089", "\u306b\u304f", "meat", "noun"),
      w("yasai", "\u91ce\u83dc", "\u3084\u3055\u3044", "vegetables", "noun"),
      verb("taberu", "\u98df\u3079\u308b", "\u305f\u3079\u308b", "eat", "\u98df\u3079\u307e\u3059", "\u305f\u3079\u307e\u3059", true),
      verb("nomu", "\u98f2\u3080", "\u306e\u3080", "drink", "\u98f2\u307f\u307e\u3059", "\u306e\u307f\u307e\u3059", true),
    ],
  },
  {
    id: 5,
    slug: "starter-restaurants-taste",
    title: "Unit 5: Restaurants And Taste",
    grammarFocus: "\u3044-adjectives with familiar food scenes",
    newWords: [
      w("mise", "\u5e97", "\u307f\u305b", "shop; restaurant", "place"),
      w("resutoran", "\u30ec\u30b9\u30c8\u30e9\u30f3", "\u308c\u3059\u3068\u3089\u3093", "restaurant", "place"),
      w("menyuu", "\u30e1\u30cb\u30e5\u30fc", "\u3081\u306b\u3085\u30fc", "menu", "noun"),
      w("sushi", "\u3059\u3057", "\u3059\u3057", "sushi", "noun"),
      w("raamen", "\u30e9\u30fc\u30e1\u30f3", "\u3089\u30fc\u3081\u3093", "ramen", "noun"),
      w("karee", "\u30ab\u30ec\u30fc", "\u304b\u308c\u30fc", "curry", "noun"),
      w("udon", "\u3046\u3069\u3093", "\u3046\u3069\u3093", "udon noodles", "noun"),
      w("piza", "\u30d4\u30b6", "\u3074\u3056", "pizza", "noun"),
      w("oishii", "\u304a\u3044\u3057\u3044", "\u304a\u3044\u3057\u3044", "delicious", "adjective"),
      w("hayai", "\u65e9\u3044", "\u306f\u3084\u3044", "early; fast", "adjective"),
      verb("erabu", "\u9078\u3076", "\u3048\u3089\u3076", "choose", "\u9078\u3073\u307e\u3059", "\u3048\u3089\u3073\u307e\u3059", true),
      verb("hairu", "\u5165\u308b", "\u306f\u3044\u308b", "enter", "\u5165\u308a\u307e\u3059", "\u306f\u3044\u308a\u307e\u3059"),
    ],
  },
  {
    id: 6,
    slug: "starter-home-rooms",
    title: "Unit 6: Home And Rooms",
    grammarFocus: "N\u304c\u3042\u308a\u307e\u3059 / N\u304c\u3044\u307e\u3059",
    newWords: [
      w("ie", "\u5bb6", "\u3044\u3048", "house", "place"),
      w("uchi", "\u3046\u3061", "\u3046\u3061", "home", "place"),
      w("heya", "\u90e8\u5c4b", "\u3078\u3084", "room", "place"),
      w("apaato", "\u30a2\u30d1\u30fc\u30c8", "\u3042\u3071\u30fc\u3068", "apartment", "place"),
      w("manshon", "\u30de\u30f3\u30b7\u30e7\u30f3", "\u307e\u3093\u3057\u3087\u3093", "apartment building", "place"),
      w("isu", "\u3044\u3059", "\u3044\u3059", "chair", "noun"),
      w("teeburu", "\u30c6\u30fc\u30d6\u30eb", "\u3066\u30fc\u3076\u308b", "table", "noun"),
      w("beddo", "\u30d9\u30c3\u30c9", "\u3079\u3063\u3069", "bed", "noun"),
      w("terebi", "\u30c6\u30ec\u30d3", "\u3066\u308c\u3073", "television", "noun"),
      w("eakon", "\u30a8\u30a2\u30b3\u30f3", "\u3048\u3042\u3053\u3093", "air conditioner", "noun"),
      verb("aru", "\u3042\u308b", "\u3042\u308b", "exist; there is for things", "\u3042\u308a\u307e\u3059", "\u3042\u308a\u307e\u3059"),
      verb("iru", "\u3044\u308b", "\u3044\u308b", "exist; there is for living things", "\u3044\u307e\u3059", "\u3044\u307e\u3059"),
    ],
  },
  {
    id: 7,
    slug: "starter-neighborhood-places",
    title: "Unit 7: Neighborhood Places",
    grammarFocus: "\u5834\u6240\u306b / \u5834\u6240\u3078 movement",
    newWords: [
      w("kouen", "\u516c\u5712", "\u3053\u3046\u3048\u3093", "park", "place"),
      w("gakkou", "\u5b66\u6821", "\u304c\u3063\u3053\u3046", "school", "place"),
      w("byouin", "\u75c5\u9662", "\u3073\u3087\u3046\u3044\u3093", "hospital", "place"),
      w("ginkou", "\u9280\u884c", "\u304e\u3093\u3053\u3046", "bank", "place"),
      w("depaato", "\u30c7\u30d1\u30fc\u30c8", "\u3067\u3071\u30fc\u3068", "department store", "place"),
      w("toire", "\u30c8\u30a4\u30ec", "\u3068\u3044\u308c", "toilet; restroom", "place"),
      w("eki", "\u99c5", "\u3048\u304d", "station", "place"),
      w("machi", "\u753a", "\u307e\u3061", "town", "place"),
      w("chikai", "\u8fd1\u3044", "\u3061\u304b\u3044", "near", "adjective"),
      w("tooi", "\u9060\u3044", "\u3068\u304a\u3044", "far", "adjective"),
      verb("iku", "\u884c\u304f", "\u3044\u304f", "go", "\u884c\u304d\u307e\u3059", "\u3044\u304d\u307e\u3059"),
      verb("kuru", "\u6765\u308b", "\u304f\u308b", "come", "\u6765\u307e\u3059", "\u304d\u307e\u3059"),
    ],
  },
  {
    id: 8,
    slug: "starter-daily-life-time",
    title: "Unit 8: Daily Life And Time",
    grammarFocus: "\u6642\u9593\u306bV\u307e\u3059 / daily routine statements",
    newWords: [
      w("asa", "\u671d", "\u3042\u3055", "morning", "time"),
      w("hiru", "\u663c", "\u3072\u308b", "noon; daytime", "time"),
      w("yoru", "\u591c", "\u3088\u308b", "night", "time"),
      w("gozen", "\u5348\u524d", "\u3054\u305c\u3093", "am; morning", "time"),
      w("gogo", "\u5348\u5f8c", "\u3054\u3054", "pm; afternoon", "time"),
      w("mainichi", "\u6bce\u65e5", "\u307e\u3044\u306b\u3061", "every day", "time"),
      w("shigoto", "\u4ed5\u4e8b", "\u3057\u3054\u3068", "work; job", "noun"),
      w("jugyou", "\u6388\u696d", "\u3058\u3085\u304e\u3087\u3046", "class; lesson", "noun"),
      verb("okiru", "\u8d77\u304d\u308b", "\u304a\u304d\u308b", "get up", "\u8d77\u304d\u307e\u3059", "\u304a\u304d\u307e\u3059"),
      verb("neru", "\u5bdd\u308b", "\u306d\u308b", "go to bed; sleep", "\u5bdd\u307e\u3059", "\u306d\u307e\u3059"),
      verb("kaeru", "\u5e30\u308b", "\u304b\u3048\u308b", "go home; return", "\u5e30\u308a\u307e\u3059", "\u304b\u3048\u308a\u307e\u3059"),
      verb("suru", "\u3059\u308b", "\u3059\u308b", "do", "\u3057\u307e\u3059", "\u3057\u307e\u3059", true),
    ],
  },
  {
    id: 9,
    slug: "starter-calendar-events",
    title: "Unit 9: Calendar And Events",
    grammarFocus: "\u3044\u3064 / calendar words with simple plans",
    newWords: [
      w("kyou", "\u4eca\u65e5", "\u304d\u3087\u3046", "today", "time"),
      w("ashita", "\u660e\u65e5", "\u3042\u3057\u305f", "tomorrow", "time"),
      w("kinou", "\u6628\u65e5", "\u304d\u306e\u3046", "yesterday", "time"),
      w("getsuyoubi", "\u6708\u66dc\u65e5", "\u3052\u3064\u3088\u3046\u3073", "Monday", "time"),
      w("kayoubi", "\u706b\u66dc\u65e5", "\u304b\u3088\u3046\u3073", "Tuesday", "time"),
      w("tanjoubi", "\u8a95\u751f\u65e5", "\u305f\u3093\u3058\u3087\u3046\u3073", "birthday", "time"),
      w("paatii", "\u30d1\u30fc\u30c6\u30a3\u30fc", "\u3071\u30fc\u3066\u3043\u30fc", "party", "noun"),
      w("konsaato", "\u30b3\u30f3\u30b5\u30fc\u30c8", "\u3053\u3093\u3055\u30fc\u3068", "concert", "noun"),
      w("yasumi", "\u4f11\u307f", "\u3084\u3059\u307f", "day off; break", "time"),
      w("daijoubu", "\u5927\u4e08\u592b", "\u3060\u3044\u3058\u3087\u3046\u3076", "okay; all right", "adjective"),
      verb("yasumu", "\u4f11\u3080", "\u3084\u3059\u3080", "rest; be absent", "\u4f11\u307f\u307e\u3059", "\u3084\u3059\u307f\u307e\u3059"),
    ],
  },
  {
    id: 10,
    slug: "starter-hobbies-entertainment",
    title: "Unit 10: Hobbies And Entertainment",
    grammarFocus: "\u597d\u304d\u306aN / hobby and entertainment talk",
    newWords: [
      w("shumi", "\u8da3\u5473", "\u3057\u3085\u307f", "hobby; interest", "noun"),
      w("ongaku", "\u97f3\u697d", "\u304a\u3093\u304c\u304f", "music", "noun"),
      w("eiga", "\u6620\u753b", "\u3048\u3044\u304c", "movie", "noun"),
      w("anime", "\u30a2\u30cb\u30e1", "\u3042\u306b\u3081", "anime", "noun"),
      w("manga", "\u30de\u30f3\u30ac", "\u307e\u3093\u304c", "manga", "noun"),
      w("supootsu", "\u30b9\u30dd\u30fc\u30c4", "\u3059\u307d\u30fc\u3064", "sports", "noun"),
      w("sakkaa", "\u30b5\u30c3\u30ab\u30fc", "\u3055\u3063\u304b\u30fc", "soccer", "noun"),
      w("yakyuu", "\u91ce\u7403", "\u3084\u304d\u3085\u3046", "baseball", "noun"),
      w("piano", "\u30d4\u30a2\u30ce", "\u3074\u3042\u306e", "piano", "noun"),
      w("gitaa", "\u30ae\u30bf\u30fc", "\u304e\u305f\u30fc", "guitar", "noun"),
      verb("miru", "\u898b\u308b", "\u307f\u308b", "watch; see", "\u898b\u307e\u3059", "\u307f\u307e\u3059", true),
      verb("kiku", "\u805e\u304f", "\u304d\u304f", "listen; ask", "\u805e\u304d\u307e\u3059", "\u304d\u304d\u307e\u3059", true),
    ],
  },
  {
    id: 11,
    slug: "starter-culture-festivals",
    title: "Unit 11: Culture And Festivals",
    grammarFocus: "\u3069\u3093\u306aN / culture nouns in simple descriptions",
    newWords: [
      w("kabuki", "\u6b4c\u821e\u4f0e", "\u304b\u3076\u304d", "kabuki", "noun"),
      w("kimono", "\u7740\u7269", "\u304d\u3082\u306e", "kimono", "noun"),
      w("sumou", "\u76f8\u64b2", "\u3059\u3082\u3046", "sumo", "noun"),
      w("taiko", "\u592a\u9f13", "\u305f\u3044\u3053", "taiko drum", "noun"),
      w("matsuri", "\u796d\u308a", "\u307e\u3064\u308a", "festival", "noun"),
      w("hanabi", "\u82b1\u706b", "\u306f\u306a\u3073", "fireworks", "noun"),
      w("sadou", "\u8336\u9053", "\u3055\u3069\u3046", "tea ceremony", "noun"),
      w("origami", "\u6298\u308a\u7d19", "\u304a\u308a\u304c\u307f", "origami", "noun"),
      w("ikebana", "\u751f\u3051\u82b1", "\u3044\u3051\u3070\u306a", "flower arrangement", "noun"),
      w("yuumei", "\u6709\u540d", "\u3086\u3046\u3081\u3044", "famous", "adjective"),
      verb("toru", "\u64ae\u308b", "\u3068\u308b", "take a photo", "\u64ae\u308a\u307e\u3059", "\u3068\u308a\u307e\u3059", true),
      verb("utau", "\u6b4c\u3046", "\u3046\u305f\u3046", "sing", "\u6b4c\u3044\u307e\u3059", "\u3046\u305f\u3044\u307e\u3059", true),
    ],
  },
  {
    id: 12,
    slug: "starter-transport-directions",
    title: "Unit 12: Transport And Directions",
    grammarFocus: "\u4e57\u308a\u307e\u3059 / \u964d\u308a\u307e\u3059 / transport choices",
    newWords: [
      w("basu", "\u30d0\u30b9", "\u3070\u3059", "bus", "noun"),
      w("densha", "\u96fb\u8eca", "\u3067\u3093\u3057\u3083", "train", "noun"),
      w("takushii", "\u30bf\u30af\u30b7\u30fc", "\u305f\u304f\u3057\u30fc", "taxi", "noun"),
      w("chikatetsu", "\u5730\u4e0b\u9244", "\u3061\u304b\u3066\u3064", "subway", "noun"),
      w("kuukou", "\u7a7a\u6e2f", "\u304f\u3046\u3053\u3046", "airport", "place"),
      w("hoteru", "\u30db\u30c6\u30eb", "\u307b\u3066\u308b", "hotel", "place"),
      w("jitensha", "\u81ea\u8ee2\u8eca", "\u3058\u3066\u3093\u3057\u3083", "bicycle", "noun"),
      w("nimotsu", "\u8377\u7269", "\u306b\u3082\u3064", "luggage", "noun"),
      w("benri", "\u4fbf\u5229", "\u3079\u3093\u308a", "convenient", "adjective"),
      w("raku", "\u697d", "\u3089\u304f", "easy; comfortable", "adjective"),
      verb("noru", "\u4e57\u308b", "\u306e\u308b", "ride; get on", "\u4e57\u308a\u307e\u3059", "\u306e\u308a\u307e\u3059"),
      verb("oriru", "\u964d\u308a\u308b", "\u304a\u308a\u308b", "get off", "\u964d\u308a\u307e\u3059", "\u304a\u308a\u307e\u3059"),
    ],
  },
  {
    id: 13,
    slug: "starter-tokyo-landmarks",
    title: "Unit 13: Tokyo Landmarks",
    grammarFocus: "\u3053\u3053 / \u305d\u3053 / \u3042\u305d\u3053 with landmarks",
    newWords: [
      w("asakusa", "\u6d45\u8349", "\u3042\u3055\u304f\u3055", "Asakusa", "proper"),
      w("ueno", "\u4e0a\u91ce", "\u3046\u3048\u306e", "Ueno", "proper"),
      w("sensouji", "\u6d45\u8349\u5bfa", "\u305b\u3093\u305d\u3046\u3058", "Senso-ji Temple", "proper"),
      w("toukyou_tower", "\u6771\u4eac\u30bf\u30ef\u30fc", "\u3068\u3046\u304d\u3087\u3046\u305f\u308f\u30fc", "Tokyo Tower", "proper"),
      w("sukaitsuri", "\u30b9\u30ab\u30a4\u30c4\u30ea\u30fc", "\u3059\u304b\u3044\u3064\u308a\u30fc", "Tokyo Skytree", "proper"),
      w("akihabara", "\u79cb\u8449\u539f", "\u3042\u304d\u306f\u3070\u3089", "Akihabara", "proper"),
      w("ginza", "\u9280\u5ea7", "\u304e\u3093\u3056", "Ginza", "proper"),
      w("shibuya", "\u6e0b\u8c37", "\u3057\u3076\u3084", "Shibuya", "proper"),
      w("harajuku", "\u539f\u5bbf", "\u306f\u3089\u3058\u3085\u304f", "Harajuku", "proper"),
      w("jinja", "\u795e\u793e", "\u3058\u3093\u3058\u3083", "shrine", "place"),
      verb("tsuku", "\u7740\u304f", "\u3064\u304f", "arrive", "\u7740\u304d\u307e\u3059", "\u3064\u304d\u307e\u3059"),
    ],
  },
  {
    id: 14,
    slug: "starter-shopping-souvenirs",
    title: "Unit 14: Shopping And Souvenirs",
    grammarFocus: "\u307b\u3057\u3044\u3067\u3059 / buying souvenirs",
    newWords: [
      w("omiyage", "\u304a\u571f\u7523", "\u304a\u307f\u3084\u3052", "souvenir", "noun"),
      w("ehagaki", "\u7d75\u306f\u304c\u304d", "\u3048\u306f\u304c\u304d", "picture postcard", "noun"),
      w("kaado", "\u30ab\u30fc\u30c9", "\u304b\u30fc\u3069", "card; credit card", "noun"),
      w("kasa", "\u5098", "\u304b\u3055", "umbrella", "noun"),
      w("hankachi", "\u30cf\u30f3\u30ab\u30c1", "\u306f\u3093\u304b\u3061", "handkerchief", "noun"),
      w("hashi", "\u7bb8", "\u306f\u3057", "chopsticks", "noun"),
      w("hashioki", "\u7bb8\u7f6d\u304d", "\u306f\u3057\u304a\u304d", "chopstick rest", "noun"),
      w("tiishatsu", "T\u30b7\u30e3\u30c4", "\u3066\u3043\u30fc\u3057\u3083\u3064", "T-shirt", "noun"),
      w("shuriken", "\u624b\u88cf\u5263", "\u3057\u3085\u308a\u3051\u3093", "ninja star", "noun"),
      w("ninja", "\u5fcd\u8005", "\u306b\u3093\u3058\u3083", "ninja", "person"),
      verb("ageru", "\u3042\u3052\u308b", "\u3042\u3052\u308b", "give", "\u3042\u3052\u307e\u3059", "\u3042\u3052\u307e\u3059", true),
      w("hoshii", "\u307b\u3057\u3044", "\u307b\u3057\u3044", "want; wanted", "adjective"),
    ],
  },
  {
    id: 15,
    slug: "starter-clothes-colors",
    title: "Unit 15: Clothes And Colors",
    grammarFocus: "\u7740\u307e\u3059 / colors and clothing",
    newWords: [
      w("kutsu", "\u9774", "\u304f\u3064", "shoes", "noun"),
      w("kutsushita", "\u9774\u4e0b", "\u304f\u3064\u3057\u305f", "socks", "noun"),
      w("shatsu", "\u30b7\u30e3\u30c4", "\u3057\u3083\u3064", "shirt", "noun"),
      w("jaketto", "\u30b8\u30e3\u30b1\u30c3\u30c8", "\u3058\u3083\u3051\u3063\u3068", "jacket", "noun"),
      w("sukaato", "\u30b9\u30ab\u30fc\u30c8", "\u3059\u304b\u30fc\u3068", "skirt", "noun"),
      w("jiinzu", "\u30b8\u30fc\u30f3\u30ba", "\u3058\u30fc\u3093\u305a", "jeans", "noun"),
      w("baggu", "\u30d0\u30c3\u30b0", "\u3070\u3063\u3050", "bag", "noun"),
      w("ao", "\u9752", "\u3042\u304a", "blue", "adjective"),
      w("aka", "\u8d64", "\u3042\u304b", "red", "adjective"),
      w("shiro", "\u767d", "\u3057\u308d", "white", "adjective"),
      verb("kiru", "\u7740\u308b", "\u304d\u308b", "wear", "\u7740\u307e\u3059", "\u304d\u307e\u3059", true),
      verb("niau", "\u4f3c\u5408\u3046", "\u306b\u3042\u3046", "suit; look good on", "\u4f3c\u5408\u3044\u307e\u3059", "\u306b\u3042\u3044\u307e\u3059"),
    ],
  },
  {
    id: 16,
    slug: "starter-size-money",
    title: "Unit 16: Size And Money",
    grammarFocus: "\u3044\u304f\u3089\u3067\u3059\u304b / size and price",
    newWords: [
      w("ookii", "\u5927\u304d\u3044", "\u304a\u304a\u304d\u3044", "big", "adjective"),
      w("chiisai", "\u5c0f\u3055\u3044", "\u3061\u3044\u3055\u3044", "small", "adjective"),
      w("takai", "\u9ad8\u3044", "\u305f\u304b\u3044", "expensive; high", "adjective"),
      w("atarashii", "\u65b0\u3057\u3044", "\u3042\u305f\u3089\u3057\u3044", "new", "adjective"),
      w("furui", "\u53e4\u3044", "\u3075\u308b\u3044", "old", "adjective"),
      w("ii", "\u3044\u3044", "\u3044\u3044", "good", "adjective"),
      w("suteki", "\u3059\u3066\u304d", "\u3059\u3066\u304d", "lovely; nice", "adjective"),
      w("iro", "\u8272", "\u3044\u308d", "color", "noun"),
      w("saizu", "\u30b5\u30a4\u30ba", "\u3055\u3044\u305a", "size", "noun"),
      w("en", "\u5186", "\u3048\u3093", "yen", "quantity"),
      verb("miseru", "\u898b\u305b\u308b", "\u307f\u305b\u308b", "show", "\u898b\u305b\u307e\u3059", "\u307f\u305b\u307e\u3059", true),
      verb("tsukau", "\u4f7f\u3046", "\u3064\u304b\u3046", "use", "\u4f7f\u3044\u307e\u3059", "\u3064\u304b\u3044\u307e\u3059", true),
    ],
  },
  {
    id: 17,
    slug: "starter-travel-weather",
    title: "Unit 17: Travel And Weather",
    grammarFocus: "\u65c5\u884c\u306e\u9806\u5e8f / travel scenes",
    newWords: [
      w("kyouto", "\u4eac\u90fd", "\u304d\u3087\u3046\u3068", "Kyoto", "proper"),
      w("hiroshima", "\u5e83\u5cf6", "\u3072\u308d\u3057\u307e", "Hiroshima", "proper"),
      w("shinjuku", "\u65b0\u5bbf", "\u3057\u3093\u3058\u3085\u304f", "Shinjuku", "proper"),
      w("kuruma", "\u8eca", "\u304f\u308b\u307e", "car", "noun"),
      w("hikouki", "\u98db\u884c\u6a5f", "\u3072\u3053\u3046\u304d", "airplane", "noun"),
      w("fune", "\u8239", "\u3075\u306d", "ship; boat", "noun"),
      w("monoreeru", "\u30e2\u30ce\u30ec\u30fc\u30eb", "\u3082\u306e\u308c\u30fc\u308b", "monorail", "noun"),
      w("biichi", "\u30d3\u30fc\u30c1", "\u3073\u30fc\u3061", "beach", "place"),
      w("yuki_snow", "\u96ea", "\u3086\u304d", "snow", "noun"),
      w("nagai", "\u9577\u3044", "\u306a\u304c\u3044", "long", "adjective"),
      verb("tomaru", "\u6cca\u307e\u308b", "\u3068\u307e\u308b", "stay overnight", "\u6cca\u307e\u308a\u307e\u3059", "\u3068\u307e\u308a\u307e\u3059"),
      verb("tsukareru", "\u75b2\u308c\u308b", "\u3064\u304b\u308c\u308b", "get tired", "\u75b2\u308c\u307e\u3059", "\u3064\u304b\u308c\u307e\u3059"),
    ],
  },
  {
    id: 18,
    slug: "starter-feelings-conversation",
    title: "Unit 18: Feelings And Conversation",
    grammarFocus: "\u3067\u3082 / \u305d\u308c\u304b\u3089 / simple connected comments",
    newWords: [
      w("ureshii", "\u3046\u308c\u3057\u3044", "\u3046\u308c\u3057\u3044", "happy; glad", "adjective"),
      w("taihen", "\u5927\u5909", "\u305f\u3044\u3078\u3093", "hard; tough", "adjective"),
      w("subarashii", "\u3059\u3070\u3089\u3057\u3044", "\u3059\u3070\u3089\u3057\u3044", "wonderful", "adjective"),
      w("hontou", "\u672c\u5f53", "\u307b\u3093\u3068\u3046", "really; truth", "adverb"),
      w("mata", "\u307e\u305f", "\u307e\u305f", "again", "adverb"),
      w("demo", "\u3067\u3082", "\u3067\u3082", "but", "adverb"),
      w("sorekara", "\u305d\u308c\u304b\u3089", "\u305d\u308c\u304b\u3089", "and then", "adverb"),
      w("issho", "\u4e00\u7dd2", "\u3044\u3063\u3057\u3087", "together", "adverb"),
      w("watashitachi", "\u79c1\u305f\u3061", "\u308f\u305f\u3057\u305f\u3061", "we; us", "person", { english: "we" }),
      w("boku", "\u50d5", "\u307c\u304f", "I; me, used by males", "person", { english: "I" }),
      verb("asobu", "\u904a\u3076", "\u3042\u305d\u3076", "play; hang out", "\u904a\u3073\u307e\u3059", "\u3042\u305d\u3073\u307e\u3059"),
      verb("matsu", "\u5f85\u3064", "\u307e\u3064", "wait", "\u5f85\u3061\u307e\u3059", "\u307e\u3061\u307e\u3059"),
    ],
  },
  {
    id: 19,
    slug: "starter-numbers-counters",
    title: "Unit 19: Numbers And Counters",
    grammarFocus: "\u6570 / \u4e00\u3064-\u4e8c\u3064 / counting things",
    newWords: [
      w("ichi", "\u4e00", "\u3044\u3061", "one", "quantity"),
      w("ni", "\u4e8c", "\u306b", "two", "quantity"),
      w("san", "\u4e09", "\u3055\u3093", "three", "quantity"),
      w("yon", "\u56db", "\u3088\u3093", "four", "quantity"),
      w("go", "\u4e94", "\u3054", "five", "quantity"),
      w("roku", "\u516d", "\u308d\u304f", "six", "quantity"),
      w("nana", "\u4e03", "\u306a\u306a", "seven", "quantity"),
      w("hachi", "\u516b", "\u306f\u3061", "eight", "quantity"),
      w("kyuu", "\u4e5d", "\u304d\u3085\u3046", "nine", "quantity"),
      w("juu", "\u5341", "\u3058\u3085\u3046", "ten", "quantity"),
      w("hitotsu", "\u4e00\u3064", "\u3072\u3068\u3064", "one thing", "quantity"),
      w("futatsu", "\u4e8c\u3064", "\u3075\u305f\u3064", "two things", "quantity"),
    ],
  },
  {
    id: 20,
    slug: "starter-social-phrases",
    title: "Unit 20: Starter Social Phrases",
    grammarFocus: "Starter phrase review and social routines",
    newWords: [
      w("arigatou", "\u3042\u308a\u304c\u3068\u3046", "\u3042\u308a\u304c\u3068\u3046", "thank you", "phrase"),
      w("sumimasen", "\u3059\u307f\u307e\u305b\u3093", "\u3059\u307f\u307e\u305b\u3093", "excuse me; sorry", "phrase"),
      w("onegaishimasu", "\u304a\u9858\u3044\u3057\u307e\u3059", "\u304a\u306d\u304c\u3044\u3057\u307e\u3059", "please", "phrase"),
      w("douzo", "\u3069\u3046\u305e", "\u3069\u3046\u305e", "please; here you are", "phrase"),
      w("konnichiwa", "\u3053\u3093\u306b\u3061\u306f", "\u3053\u3093\u306b\u3061\u306f", "hello", "phrase"),
      w("sayounara", "\u3055\u3088\u3046\u306a\u3089", "\u3055\u3088\u3046\u306a\u3089", "goodbye", "phrase"),
      w("ohayou", "\u304a\u306f\u3088\u3046", "\u304a\u306f\u3088\u3046", "good morning", "phrase"),
      w("hajimemashite", "\u306f\u3058\u3081\u307e\u3057\u3066", "\u306f\u3058\u3081\u307e\u3057\u3066", "How do you do?; nice to meet you", "phrase"),
      w("wakarimasen", "\u5206\u304b\u308a\u307e\u305b\u3093", "\u308f\u304b\u308a\u307e\u305b\u3093", "I do not understand", "phrase"),
      w("mouichido", "\u3082\u3046\u4e00\u5ea6", "\u3082\u3046\u3044\u3061\u3069", "one more time", "phrase"),
      w("itadakimasu", "\u3044\u305f\u3060\u304d\u307e\u3059", "\u3044\u305f\u3060\u304d\u307e\u3059", "said before eating", "phrase"),
      w("gochisousama", "\u3054\u3061\u305d\u3046\u3055\u307e", "\u3054\u3061\u305d\u3046\u3055\u307e", "said after eating", "phrase"),
    ],
  },
];

function allWordsUntil(unitId) {
  return units.filter((unit) => unit.id <= unitId).flatMap((unit) => unit.newWords);
}

function reviewUnitIds(unitId) {
  const ids = [];
  for (let offset = 2; unitId - offset >= 1; offset *= 2) ids.push(unitId - offset);
  return ids;
}

function wordsForUnits(ids) {
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  return ids.flatMap((id) => byId.get(id)?.newWords ?? []);
}

function lexiconUnits(unitId) {
  const review = new Set(reviewUnitIds(unitId));
  return units.filter((unit) => unit.id < unitId && !review.has(unit.id)).map((unit) => unit.id);
}

function token(word, form = "base") {
  if (form === "masu" && word.masu) {
    return {
      surface: word.masu,
      reading: word.masuReading,
      explain: `polite form of ${word.meaning}`,
      wordId: word.id,
    };
  }
  return {
    surface: word.surface,
    reading: word.reading,
    explain: word.meaning,
    wordId: word.id,
  };
}

function cap(text) {
  return text.slice(0, 1).toUpperCase() + text.slice(1);
}

function cleanMeaning(word) {
  const meaning = (word.english ?? word.meaning)
    .split(/[;/]/)[0]
    .split(",")[0]
    .trim()
    .replace(/\.+$/, "");
  if (word.id === "nihongo") return "Japanese";
  if (word.id === "eigo") return "English";
  if (word.id === "go_language") return "language";
  if (word.function === "quantity") return meaning.replace(/\s+thing$/, "");
  return meaning;
}

function subjectEnglish(word) {
  if (word.english) return word.english;
  if (word.function === "proper") return cleanMeaning(word);
  if (word.function === "person") return `the ${cleanMeaning(word)}`;
  return `the ${cleanMeaning(word)}`;
}

function objectEnglish(word) {
  if (word.id === "watashi" || word.id === "boku") return "me";
  if (word.id === "anata") return "you";
  if (word.id === "watashitachi") return "us";
  if (languageWordIds.has(word.id) || scriptWordIds.has(word.id)) return cleanMeaning(word);
  if (word.function === "proper") return cleanMeaning(word);
  if (["adjective", "adverb", "quantity", "phrase"].includes(word.function)) return cleanMeaning(word);
  return `the ${cleanMeaning(word)}`;
}

function beVerb(subject) {
  const text = subjectEnglish(subject).toLowerCase();
  if (text === "i") return "am";
  if (text === "you" || text === "we") return "are";
  if (pluralSubjectWordIds.has(subject?.id)) return "are";
  return "is";
}

function verbEnglish(subject, verbWord) {
  const base = cleanMeaning(verbWord);
  const text = subjectEnglish(subject).toLowerCase();
  const isFirstSecondOrPlural = text === "i" || text === "you" || text === "we";
  if (["okuremasu"].includes(verbWord?.id)) return text === "i" ? "am late" : text === "you" || text === "we" ? "are late" : "is late";
  if (["yasumimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "take a day off" : "takes a day off";
  if (["dekimasu"].includes(verbWord?.id)) return "can do it";
  if (["hairimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "enter" : "enters";
  if (["abimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "bathe" : "bathes";
  if (verbWord?.id === "kaimonoshimasu") return isFirstSecondOrPlural ? "go shopping" : "goes shopping";
  if (["nemasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "go to bed" : "goes to bed";
  if (["kimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "come" : "comes";
  if (["ikimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "go" : "goes";
  if (["kaerimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "go home" : "goes home";
  if (["norimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "ride" : "rides";
  if (["mimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "watch" : "watches";
  if (["iimasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "say" : "says";
  if (["tsukaremasu"].includes(verbWord?.id)) return isFirstSecondOrPlural ? "get tired" : "gets tired";
  const thirdPerson = new Map([
    ["play", "plays"],
    ["stay overnight", "stays overnight"],
    ["get tired", "gets tired"],
    ["can do/to be able to do", "can do"],
    ["be late/be delayed", "is late"],
    ["start/to begin", "starts"],
    ["rest/to take a day off", "rests"],
    ["bathe in (water)/to pour (water) over oneself", "bathes"],
    ["get up", "gets up"],
    ["go to bed", "goes to bed"],
    ["go home", "goes home"],
    ["return", "returns"],
    ["take a photo", "takes a photo"],
    ["get off", "gets off"],
    ["give", "gives"],
    ["suit", "looks good"],
  ]);
  if (isFirstSecondOrPlural) return base;
  if (thirdPerson.has(base)) return thirdPerson.get(base);
  if (base.endsWith("s") || base.endsWith("sh") || base.endsWith("ch") || base.endsWith("x")) return `${base}es`;
  if (base.endsWith("y") && !/[aeiou]y$/.test(base)) return `${base.slice(0, -1)}ies`;
  if (base === "go") return "goes";
  if (base === "do") return "does";
  return `${base}s`;
}

function suruActivityEnglish(subject, object) {
  const subjectText = subjectEnglish(subject).toLowerCase();
  const thirdPerson = !(subjectText === "i" || subjectText === "you" || subjectText === "we");
  const activityText = cleanMeaning(object);
  const byId = new Map([
    ["shigoto", thirdPerson ? "works" : "work"],
    ["jugyou", thirdPerson ? "has class" : "have class"],
    ["kaimono", thirdPerson ? "goes shopping" : "go shopping"],
    ["benkyoo", thirdPerson ? "studies" : "study"],
    ["sanpo", thirdPerson ? "takes a walk" : "take a walk"],
    ["dansu", thirdPerson ? "dances" : "dance"],
    ["dokusho", thirdPerson ? "reads" : "read"],
    ["sentaku", thirdPerson ? "does laundry" : "do laundry"],
    ["sooji", thirdPerson ? "cleans" : "clean"],
    ["karaoke", thirdPerson ? "sings karaoke" : "sing karaoke"],
  ]);
  if (playActivityWordIds.has(object.id)) return `${thirdPerson ? "plays" : "play"} ${activityText}`;
  return byId.get(object.id) ?? `${thirdPerson ? "does" : "do"} ${objectEnglish(object)}`;
}

function makeCard(unitId, ordinal, parts, english, grammarTags) {
  return {
    id: `u${String(unitId).padStart(3, "0")}-c${String(ordinal).padStart(3, "0")}`,
    line: parts.map((part) => part.surface),
    tts: parts.map((part) => part.reading),
    explain: parts.map((part) => part.explain),
    tokens: parts,
    english,
    grammarTags,
  };
}

function identity(unit, n, word, tag = unit.grammarFocus) {
  return makeCard(unit.id, n, [token(word), fw("desu")], `It's ${objectEnglish(word)}`, [tag, "\u3067\u3059"]);
}

function unitOneIntroCard(unit, n, word, knownSoFar) {
  const byId = new Map([...knownSoFar, ...unit.newWords].map((candidate) => [candidate.id, candidate]));
  const englishById = new Map([
    ["watashi", "It's me"],
    ["anata", "It's you"],
    ["gakusei", "It's a student"],
    ["sensei", "It's a teacher"],
    ["nihongo", "It's Japanese"],
    ["eigo", "It's English"],
    ["hiragana", "It's hiragana"],
    ["katakana", "It's katakana"],
    ["kanji", "It's kanji"],
  ]);

  if (englishById.has(word.id)) {
    return makeCard(unit.id, n, [token(word), fw("desu")], englishById.get(word.id), [unit.grammarFocus, "\u3067\u3059", "first contact"]);
  }

  const watashi = byId.get("watashi");
  if (word.id === "yomu" && watashi && byId.get("nihongo")) return objectAction(unit, n, watashi, byId.get("nihongo"), word);
  if (word.id === "kaku" && watashi && byId.get("kanji")) return objectAction(unit, n, watashi, byId.get("kanji"), word);
  if (word.id === "wakaru" && watashi && byId.get("hiragana")) return understoodObjectAction(unit, n, watashi, byId.get("hiragana"), word);

  const subject = watashi ?? pick(knownSoFar.filter((candidate) => candidate.function === "person"), n);
  const firstAction = subject ? smartActionForVerb(unit, n, subject, word, knownSoFar, { known: knownSoFar }, 0) : undefined;
  return firstAction ?? simpleActionSentence(unit, n, word);
}

function topicIdentity(unit, n, subject, complement, tag = unit.grammarFocus) {
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(complement), fw("desu")],
    `${cap(subjectEnglish(subject))} ${beVerb(subject)} ${predicateEnglish(complement)}`,
    [tag, "A\u306fB\u3067\u3059"],
  );
}

function topicQuestion(unit, n, subject, complement) {
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(complement), fw("desu"), fw("ka"), fw("q")],
    `${cap(beVerb(subject))} ${subjectEnglish(subject)} ${predicateEnglish(complement)}?`,
    [unit.grammarFocus, "A\u306fB\u3067\u3059\u304b"],
  );
}

function action(unit, n, subject, verbWord) {
  if (["suru", "shimasu"].includes(verbWord?.id)) {
    const activity = allWordsUntil(unit.id).find((word) => word.id === "shigoto") ?? allWordsUntil(unit.id).find((word) => activityWordIds.has(word.id));
    if (activity) return objectAction(unit, n, subject, activity, verbWord);
  }
  if (["ageru", "agemasu"].includes(verbWord?.id)) {
    const gift = allWordsUntil(unit.id).find((word) => giftWordIds.has(word.id));
    if (gift) return objectAction(unit, n, subject, gift, verbWord);
  }
  if (["au", "aimasu"].includes(verbWord?.id)) {
    const person = allWordsUntil(unit.id).find((word) => word.function === "person" && word.id !== subject?.id);
    if (person) return personAction(unit, n, subject, person, verbWord);
  }
  if (["aru", "arimasu"].includes(verbWord?.id)) {
    if (subject?.function === "person") {
      return makeCard(unit.id, n, [token(verbWord, "masu")], "There is something", [unit.grammarFocus, "V\u307e\u3059"]);
    }
    return makeCard(
      unit.id,
      n,
      [token(subject), fw("ga"), token(verbWord, "masu")],
      `There is ${objectEnglish(subject)}`,
      [unit.grammarFocus, "N\u304c\u3042\u308a\u307e\u3059"],
    );
  }
  if (["iru", "imasu"].includes(verbWord?.id)) {
    if (subject?.function !== "person") {
      return makeCard(unit.id, n, [token(verbWord, "masu")], "There is someone", [unit.grammarFocus, "V\u307e\u3059"]);
    }
    if (subject.id === "watashi" || subject.id === "boku") {
      return makeCard(unit.id, n, [token(subject), fw("ga"), token(verbWord, "masu")], "I am here", [unit.grammarFocus, "N\u304c\u3044\u307e\u3059"]);
    }
    if (subject.id === "watashitachi") {
      return makeCard(unit.id, n, [token(subject), fw("ga"), token(verbWord, "masu")], "We are here", [unit.grammarFocus, "N\u304c\u3044\u307e\u3059"]);
    }
    return makeCard(
      unit.id,
      n,
      [token(subject), fw("ga"), token(verbWord, "masu")],
      subject.id === "anata" ? "You are here" : `There is ${objectEnglish(subject)}`,
      [unit.grammarFocus, "N\u304c\u3044\u307e\u3059"],
    );
  }
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(verbWord, "masu")],
    `${cap(subjectEnglish(subject))} ${verbEnglish(subject, verbWord)}`,
    [unit.grammarFocus, "early V\u307e\u3059 action"],
  );
}

function impliedActionEnglish(verbWord) {
  if (verbWord.id === "hajimeru") return "We start";
  if (verbWord.id === "owaru") return "We finish";
  return cap(cleanMeaning(verbWord));
}

function simpleActionSentence(unit, n, verbWord) {
  return makeCard(unit.id, n, [token(verbWord, "masu")], impliedActionEnglish(verbWord), [unit.grammarFocus, "V\u307e\u3059"]);
}

function simpleActionQuestion(unit, n, verbWord) {
  const base = impliedActionEnglish(verbWord).replace(/^We /, "we ");
  return makeCard(unit.id, n, [token(verbWord, "masu"), fw("ka"), fw("q")], `Do ${base}?`, [unit.grammarFocus, "V\u307e\u3059\u304b"]);
}

function targetActionQuestion(unit, n, subject, object, verbWord) {
  const particle = ["wakaru", "wakarimasu"].includes(verbWord.id) ? fw("ga") : fw("o");
  const objectText = ["kiku", "kikimasu"].includes(verbWord.id) ? `to ${objectEnglish(object)}` : objectEnglish(object);
  const subjectText = subjectEnglish(subject).toLowerCase();
  const auxiliary = subjectText === "i" || subjectText === "you" || subjectText === "we" ? "Do" : "Does";
  const questionVerb = cleanMeaning(verbWord);
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(object), particle, token(verbWord, "masu"), fw("ka"), fw("q")],
    `${auxiliary} ${subjectEnglish(subject)} ${questionVerb} ${objectText}?`,
    [unit.grammarFocus, "N\u3092/N\u304cV\u307e\u3059\u304b"],
  );
}

function objectAction(unit, n, subject, object, verbWord) {
  const objectText = ["kiku", "kikimasu"].includes(verbWord.id) ? `to ${objectEnglish(object)}` : objectEnglish(object);
  const english =
    ["suru", "shimasu"].includes(verbWord.id) && activityWordIds.has(object.id)
      ? `${cap(subjectEnglish(subject))} ${suruActivityEnglish(subject, object)}`
      : `${cap(subjectEnglish(subject))} ${verbEnglish(subject, verbWord)} ${objectText}`;
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(object), fw("o"), token(verbWord, "masu")],
    english,
    [unit.grammarFocus, "N\u3092V\u307e\u3059"],
  );
}

function understoodObjectAction(unit, n, subject, object, verbWord) {
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(object), fw("ga"), token(verbWord, "masu")],
    `${cap(subjectEnglish(subject))} ${verbEnglish(subject, verbWord)} ${objectEnglish(object)}`,
    [unit.grammarFocus, "N\u304c\u5206\u304b\u308a\u307e\u3059"],
  );
}

function personAction(unit, n, subject, person, verbWord) {
  const isMeetVerb = ["au", "aimasu"].includes(verbWord.id);
  const particle = isMeetVerb ? fw("ni") : fw("to");
  const baseVerb = isMeetVerb ? "meet" : "speak with";
  const subjectText = subjectEnglish(subject).toLowerCase();
  const englishVerb = subjectText === "i" || subjectText === "you" || subjectText === "we" ? baseVerb : baseVerb === "meet" ? "meets" : "speaks with";
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(person), particle, token(verbWord, "masu")],
    `${cap(subjectEnglish(subject))} ${englishVerb} ${objectEnglish(person)}`,
    [unit.grammarFocus, verbWord.id === "au" ? "人に会います" : "人と話します"],
  );
}

function destinationAction(unit, n, subject, destination, verbWord) {
  const stayPreposition = ["hoteru", "biichi"].includes(destination?.id) ? "at" : "in";
  const arrivePreposition = residencePlaceWordIds.has(destination?.id) ? "in" : "at";
  const preposition = ["sumu", "sumimasu"].includes(verbWord.id) ? "in" : ["tsuku", "tsukimasu"].includes(verbWord.id) ? arrivePreposition : ["tomaru", "tomarimasu"].includes(verbWord.id) ? stayPreposition : "to";
  const english =
    ["hairu", "hairimasu"].includes(verbWord.id)
      ? `${cap(subjectEnglish(subject))} ${verbEnglish(subject, verbWord)} ${objectEnglish(destination)}`
      : ["kaeru", "kaerimasu"].includes(verbWord.id)
        ? `${cap(subjectEnglish(subject))} ${subjectEnglish(subject).toLowerCase() === "i" || subjectEnglish(subject).toLowerCase() === "you" || subjectEnglish(subject).toLowerCase() === "we" ? "return" : "returns"} to ${objectEnglish(destination)}`
      : ["noru", "norimasu", "oriru", "orimasu"].includes(verbWord.id)
        ? `${cap(subjectEnglish(subject))} ${verbEnglish(subject, verbWord)} ${objectEnglish(destination)}`
      : `${cap(subjectEnglish(subject))} ${verbEnglish(subject, verbWord)} ${preposition} ${objectEnglish(destination)}`;
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(destination), fw("ni"), token(verbWord, "masu")],
    english,
    [unit.grammarFocus, "\u5834\u6240\u306bV\u307e\u3059"],
  );
}

function simpleActionChunk(unit, n, verbWord) {
  const english = verbWord.id === "hajimeru" ? "Let's start" : impliedActionEnglish(verbWord);
  return makeCard(unit.id, n, [token(verbWord, "masu"), fw("ne")], `${english}, okay?`, [unit.grammarFocus, "Vます phrase"]);
}

function placeAction(unit, n, subject, place, verbWord) {
  const preposition = place.function === "proper" || place.id === "kuni" ? "in" : "at";
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(place), fw("de"), token(verbWord, "masu")],
    `${cap(subjectEnglish(subject))} ${verbEnglish(subject, verbWord)} ${preposition} ${objectEnglish(place)}`,
    [unit.grammarFocus, "\u5834\u6240\u3067V\u307e\u3059"],
  );
}

function timeEnglishLead(timeWord) {
  const text = cleanMeaning(timeWord);
  const byId = new Map([
    ["asa", "In the morning"],
    ["hiru", "At noon"],
    ["yoru", "At night"],
    ["gozen", "In the morning"],
    ["gogo", "In the afternoon"],
    ["mainichi", "Every day"],
    ["itsumo", "Always"],
    ["yoku", "Often"],
    ["tokidoki", "Sometimes"],
    ["mata", "Again"],
    ["kinou", "Yesterday"],
    ["kyou", "Today"],
    ["ashita", "Tomorrow"],
    ["konshuu", "This week"],
    ["senshuu", "Last week"],
    ["raishuu", "Next week"],
    ["kyonen", "Last year"],
    ["kotoshi", "This year"],
    ["tanjoubi", "On the birthday"],
    ["yasumi", "On the day off"],
    ["yukkuri", "Slowly"],
    ["sukoshi", "A little"],
    ["chotto", "A little"],
    ["mada", "Not yet"],
    ["moo", "Already"],
  ]);
  if (byId.has(timeWord.id)) return byId.get(timeWord.id);
  const lower = text.toLowerCase();
  const byMeaning = new Map([
    ["today", "Today"],
    ["tomorrow", "Tomorrow"],
    ["yesterday", "Yesterday"],
    ["this week", "This week"],
    ["last week", "Last week"],
    ["next week", "Next week"],
    ["last year", "Last year"],
    ["this year", "This year"],
  ]);
  if (byMeaning.has(lower)) return byMeaning.get(lower);
  if (/day$/i.test(text) || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(text)) return `On ${text}`;
  return cap(text);
}

function timeAdverbAction(unit, n, timeWord, subject, verbWord) {
  const noNiTimeIds = new Set(["mainichi", "itsumo", "yoku", "tokidoki", "mata", "kinou", "kyou", "ashita", "konshuu", "senshuu", "raishuu", "kyonen", "kotoshi"]);
  const adverbNiIds = new Set(["hontou", "issho"]);
  const timeMeaning = cleanMeaning(timeWord).toLowerCase();
  const noNiByMeaning = ["today", "tomorrow", "yesterday", "this week", "last week", "next week", "last year", "this year"].includes(timeMeaning);
  const timeParts = (timeWord.function === "time" && !noNiTimeIds.has(timeWord.id) && !noNiByMeaning) || adverbNiIds.has(timeWord.id) ? [token(timeWord), fw("ni")] : [token(timeWord)];
  return makeCard(
    unit.id,
    n,
    [...timeParts, token(subject), fw("wa"), token(verbWord, "masu")],
    `${timeEnglishLead(timeWord)}, ${subjectEnglish(subject)} ${verbEnglish(subject, verbWord)}`,
    [unit.grammarFocus, "time/adverb + V\u307e\u3059"],
  );
}

function placeExistence(unit, n, place, thing, aruWord) {
  const preposition = place.id === "kuni" || place.function === "proper" ? "in" : "in";
  return makeCard(
    unit.id,
    n,
    [token(place), fw("ni"), token(thing), fw("ga"), token(aruWord, "masu")],
    `There is ${objectEnglish(thing)} ${preposition} ${objectEnglish(place)}`,
    [unit.grammarFocus, "N\u304c\u3042\u308a\u307e\u3059"],
  );
}

function personExistence(unit, n, place, person, iruWord) {
  if (person.id === "watashi" || person.id === "boku") {
    return makeCard(
      unit.id,
      n,
      [token(place), fw("ni"), token(person), fw("ga"), token(iruWord, "masu")],
      `I am in ${objectEnglish(place)}`,
      [unit.grammarFocus, "N\u304c\u3044\u307e\u3059"],
    );
  }
  if (person.id === "anata") {
    return makeCard(
      unit.id,
      n,
      [token(place), fw("ni"), token(person), fw("ga"), token(iruWord, "masu")],
      `You are in ${objectEnglish(place)}`,
      [unit.grammarFocus, "N\u304c\u3044\u307e\u3059"],
    );
  }
  if (person.id === "watashitachi") {
    return makeCard(
      unit.id,
      n,
      [token(place), fw("ni"), token(person), fw("ga"), token(iruWord, "masu")],
      `We are in ${objectEnglish(place)}`,
      [unit.grammarFocus, "N\u304c\u3044\u307e\u3059"],
    );
  }
  const personText = person.id === "anata" ? "you" : objectEnglish(person);
  return makeCard(
    unit.id,
    n,
    [token(place), fw("ni"), token(person), fw("ga"), token(iruWord, "masu")],
    `There is ${personText} in ${objectEnglish(place)}`,
    [unit.grammarFocus, "N\u304c\u3044\u307e\u3059"],
  );
}

function adjectiveCard(unit, n, subject, adjective) {
  const adjectiveText = adjective.id === "hayai" && (shopPlaceWordIds.has(subject.id) || transportWordIds.has(subject.id)) ? "fast" : cleanMeaning(adjective);
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(adjective), fw("desu")],
    `${cap(subjectEnglish(subject))} ${beVerb(subject)} ${adjectiveText}`,
    [unit.grammarFocus, "adjective predicate"],
  );
}

function wantCard(unit, n, subject, object, adjective) {
  return makeCard(
    unit.id,
    n,
    [token(subject), fw("wa"), token(object), fw("ga"), token(adjective), fw("desu")],
    `${cap(subjectEnglish(subject))} ${subjectEnglish(subject).toLowerCase() === "i" || subjectEnglish(subject).toLowerCase() === "you" || subjectEnglish(subject).toLowerCase() === "we" ? "want" : "wants"} ${objectEnglish(object)}`,
    [unit.grammarFocus, "N\u304c\u307b\u3057\u3044\u3067\u3059"],
  );
}

function suitCard(unit, n, clothing, verbWord) {
  return makeCard(
    unit.id,
    n,
    [token(clothing), fw("ga"), token(verbWord, "masu")],
    `${cap(subjectEnglish(clothing))} ${beVerb(clothing) === "are" ? "look" : "looks"} good`,
    [unit.grammarFocus, "N\u304c\u4f3c\u5408\u3044\u307e\u3059"],
  );
}

function possessiveCard(unit, n, owner, owned) {
  const ownerText =
    owner.id === "watashi" || owner.id === "boku"
      ? "my"
      : owner.id === "anata"
        ? "your"
        : owner.id === "watashitachi"
          ? "our"
          : `${subjectEnglish(owner)}'s`;
  return makeCard(
    unit.id,
    n,
    [token(owner), fw("no"), token(owned), fw("desu")],
    `It's ${ownerText} ${cleanMeaning(owned)}`,
    [unit.grammarFocus, "A\u306eB"],
  );
}

function phraseCard(unit, n, phrase, context) {
  return makeCard(unit.id, n, [token(phrase)], context ?? cap(cleanMeaning(phrase)), [unit.grammarFocus, "set phrase"]);
}

function classify(words) {
  return {
    people: words.filter((word) => word.function === "person"),
    places: words.filter(isPlaceLike),
    nouns: words.filter((word) => ["noun", "proper", "place"].includes(word.function)),
    commonNouns: words.filter((word) => word.function === "noun"),
    adjectives: words.filter((word) => word.function === "adjective"),
    verbs: words.filter((word) => word.function === "verb"),
    phrases: words.filter((word) => word.function === "phrase"),
    time: words.filter((word) => word.function === "time" || word.function === "adverb" || word.function === "quantity"),
  };
}

const drinkWordIds = new Set(["mizu", "ocha", "koohii", "gyuunyuu", "biiru", "wain", "juusu"]);
const languageWordIds = new Set(["nihongo", "eigo", "go_language"]);
const scriptWordIds = new Set(["hiragana", "katakana", "kanji"]);
const nameWordIds = new Set(["namae", "onamae-namae"]);
const readingWordIds = new Set(["hon", "manga", "ehagaki", "kaado"]);
const watchWordIds = new Set(["eiga", "anime"]);
const listeningWordIds = new Set(["ongaku", "uta"]);
const eventWordIds = new Set(["konsaato", "paatii", "matsuri"]);
const clothingWordIds = new Set(["kutsu", "kutsushita", "shatsu", "jaketto", "sukaato", "jiinzu", "baggu", "tiishatsu", "wanpiisu"]);
const kiruWearableWordIds = new Set(["kimono", "shatsu", "jaketto", "sukaato", "jiinzu", "tiishatsu", "wanpiisu"]);
const transportWordIds = new Set(["basu", "densha", "takushii", "chikatetsu", "jitensha", "kuruma", "hikouki", "fune", "monoreeru"]);
const shopPlaceWordIds = new Set(["mise", "resutoran", "kissaten", "koohii-shoppu", "depaato"]);
const residencePlaceWordIds = new Set(["kuni", "nihon", "oosutoraria", "supein", "tai", "firipin", "roshia", "ie", "uchi", "apaato", "manshon", "machi", "toukyou", "oosaka", "sooru", "hokkaidoo", "kyouto", "hiroshima", "shinjuku", "japan", "kankoku", "doitsu", "chuugoku", "ejiputo", "furansu", "kairo", "kerun", "shanhai", "pari", "okinawa"]);
const destinationProperWordIds = new Set(["asakusa", "ueno", "sensouji", "toukyou_tower", "sukaitsuri", "akihabara", "ginza", "shibuya", "harajuku", "kuukou", "hoteru", "sensooji", "tookyoo-tawaa"]);
const foodWordIds = new Set(["gohan", "asagohan", "pan", "sakana", "niku", "yasai", "sushi", "raamen", "karee", "udon", "piza", "hottodoggu", "hanbaagaa", "chiizu-baagaa", "furaido-poteto", "ryoori", "tamago", "kudamono", "misoshiru", "soba", "tenpura"]);
const giftWordIds = new Set(["omiyage", "ehagaki", "kaado", "kasa", "hankachi", "hashi", "hashioki", "tiishatsu", "shuriken"]);
const usefulItemWordIds = new Set(["kasa", "hankachi", "hashi", "hashioki", "kaado", "nimotsu", "baggu", "jitensha", "terebi", "eakon"]);
const colorTargetWordIds = new Set(["kimono", "shatsu", "jaketto", "sukaato", "jiinzu", "baggu", "tiishatsu", "wanpiisu", "kutsu", "kutsushita", "kasa", "hankachi", "kaado"]);
const feelingTargetWordIds = new Set(["paatii", "konsaato", "matsuri", "hanabi", "shigoto", "jugyou", "benkyoo", "ryokoo", "shumi", "eiga", "anime", "ongaku", "kabuki", "sumou"]);
const activityWordIds = new Set(["shigoto", "jugyou", "kaimono", "benkyoo", "sanpo", "dansu", "dokusho", "sentaku", "sooji", "karaoke", "tenisu", "sakkaa", "yakyuu"]);
const playActivityWordIds = new Set(["tenisu", "sakkaa", "yakyuu"]);
const sentenceAdverbWordIds = new Set(["mainichi", "itsumo", "yoku", "tokidoki", "mata", "demo", "sorekara", "hontou", "issho", "issho-ni", "yukkuri", "sukoshi", "chotto", "mada", "moo", "kyou", "ashita", "kinou", "konshuu", "senshuu", "raishuu", "kyonen", "kotoshi"]);
const timeActionVerbIds = new Set([
  "hataraku",
  "hanasu",
  "taberu",
  "nomu",
  "iku",
  "kuru",
  "okiru",
  "neru",
  "kaeru",
  "yasumu",
  "toru",
  "utau",
  "tsuku",
  "tomaru",
  "tsukareru",
  "asobu",
  "matsu",
  "okuremasu",
  "owarimasu",
  "hajimemasu",
  "yasumimasu",
  "dekimasu",
  "tabemasu",
  "nomimasu",
  "abimasu",
  "ikimasu",
  "okimasu",
  "kaerimasu",
  "nemasu",
  "kimasu",
  "yukkurishimasu",
  "iimasu",
  "tsukaremasu",
  "kaimonoshimasu",
  "tomarimasu",
]);
const watchableWordIds = new Set(["eiga", "anime", "terebi", "shashin", "hanabi", "hanabi-taikai", "kabuki", "sumou", "shoo", "biitoruzu", "rezzu"]);
const listenableWordIds = new Set(["jei-poppu", "ongaku", "uta", "kurashikku", "jazu", "poppusu", "rokku"]);
const pluralSubjectWordIds = new Set(["yasai", "kutsu", "kutsushita", "jiinzu", "supootsu", "hanabi", "furaido-poteto", "pantsu", "hashi"]);
const genericPersonWordIds = new Set(["hito"]);

function isDrinkWord(word) {
  return Boolean(word && drinkWordIds.has(word.id));
}

function isLanguageOrScriptWord(word) {
  return Boolean(word && (languageWordIds.has(word.id) || scriptWordIds.has(word.id)));
}

function isPlaceLike(word) {
  return Boolean(word && (word.function === "place" || residencePlaceWordIds.has(word.id) || destinationProperWordIds.has(word.id)));
}

function articleFor(text) {
  return /^[aeiou]/i.test(text) ? "an" : "a";
}

function predicateEnglish(word) {
  const text = cleanMeaning(word);
  if (word.id === "kuni") return "a country";
  if (word.function === "person" && !["watashi", "anata", "watashitachi", "boku"].includes(word.id)) return `${articleFor(text)} ${text}`;
  if (["noun", "place"].includes(word.function) && !languageWordIds.has(word.id) && !scriptWordIds.has(word.id)) return `${articleFor(text)} ${text}`;
  return objectEnglish(word);
}

function isNiMovementOrLocationVerb(verbWord) {
  return ["iku", "kuru", "tsuku", "tomaru", "sumu", "hairu", "kaeru", "ikimasu", "kimasu", "tsukimasu", "tomarimasu", "sumimasu", "hairimasu", "kaerimasu"].includes(verbWord?.id);
}

function compatibleAdjectiveTargets(adjective, nouns) {
  if (!adjective) return nouns;
  if (adjective.id === "tanoshii") return nouns.filter(word => funSubjectIds.has(word.id));
  if (adjective.id === "kiree-na") return nouns.filter(word => clothingWordIds.has(word.id) || ["niwa", "ie", "heya"].includes(word.id));
  if (adjective.id === "oishii") {
    return nouns.filter((word) => isDrinkWord(word) || compatibleVerbIdsForTarget(word).includes("taberu"));
  }
  if (adjective.id === "hayai") {
    return nouns.filter((word) => word.function === "person" || ["asagohan", "asa", "jugyou", "shigoto", "basu", "densha"].includes(word.id) || shopPlaceWordIds.has(word.id));
  }
  if (["chikai", "tooi"].includes(adjective.id)) {
    return nouns.filter(isPlaceLike);
  }
  if (["takai", "yasui"].includes(adjective.id)) {
    return nouns.filter((word) => ["noun", "place"].includes(word.function) && !isLanguageOrScriptWord(word));
  }
  if (["benri", "raku"].includes(adjective.id)) {
    return nouns.filter((word) => usefulItemWordIds.has(word.id) || transportWordIds.has(word.id) || isPlaceLike(word));
  }
  if (["ao", "aka", "shiro"].includes(adjective.id)) {
    return nouns.filter((word) => colorTargetWordIds.has(word.id));
  }
  if (adjective.id === "ureshii") {
    return nouns.filter((word) => word.function === "person");
  }
  if (adjective.id === "taihen") {
    return nouns.filter((word) => ["shigoto", "jugyou", "benkyoo", "ryokoo"].includes(word.id));
  }
  if (adjective.id === "subarashii") {
    return nouns.filter((word) => feelingTargetWordIds.has(word.id) || eventWordIds.has(word.id));
  }
  if (adjective.id === "nagai") {
    return nouns.filter((word) => transportWordIds.has(word.id) || ["michi", "ryokoo", "menyuu", "jugyou"].includes(word.id));
  }
  const adjectiveMeaning = cleanMeaning(adjective).toLowerCase();
  if (adjectiveMeaning.includes("young")) {
    return nouns.filter((word) => word.function === "person");
  }
  if (adjectiveMeaning.includes("busy")) {
    return nouns.filter((word) => word.function === "person" || ["shigoto", "jugyou", "kaisha"].includes(word.id));
  }
  if (adjectiveMeaning.includes("late") || adjectiveMeaning.includes("slow")) {
    return nouns.filter((word) => word.function === "person" || transportWordIds.has(word.id) || eventWordIds.has(word.id) || ["jugyou", "shigoto"].includes(word.id));
  }
  if (adjectiveMeaning.includes("bright") || adjectiveMeaning.includes("dark") || adjectiveMeaning.includes("spacious") || adjectiveMeaning.includes("cramped")) {
    return nouns.filter((word) => isPlaceLike(word) || ["ie", "uchi", "heya", "apaato", "manshon", "kyoushitsu", "daidokoro", "genkan", "ofuro-furo", "kouen", "tokoro", "gakkoo"].includes(word.id));
  }
  if (adjectiveMeaning.includes("cute") || adjectiveMeaning.includes("cool") || adjectiveMeaning.includes("good-looking") || adjectiveMeaning.includes("pretty") || adjectiveMeaning.includes("tidy") || adjectiveMeaning.includes("clean")) {
    return nouns.filter((word) => word.function === "person" || clothingWordIds.has(word.id) || colorTargetWordIds.has(word.id) || eventWordIds.has(word.id) || watchableWordIds.has(word.id));
  }
  return nouns.filter((word) => !isLanguageOrScriptWord(word));
}

function uniqueWords(words) {
  const seen = new Set();
  return words.filter((word) => {
    if (!word || seen.has(word.id)) return false;
    seen.add(word.id);
    return true;
  });
}

function isExistenceVerb(word) {
  return ["aru", "iru", "arimasu", "imasu"].includes(word?.id);
}

function productiveVerbs(words) {
  return uniqueWords(words).filter((word) => word.function === "verb" && !isExistenceVerb(word));
}

function timeActionVerbs(words) {
  return productiveVerbs(words).filter((word) => timeActionVerbIds.has(word.id));
}

function isPastTimeWord(word) {
  const text = cleanMeaning(word).toLowerCase();
  return ["yesterday", "last week", "last year"].includes(text);
}

function verbByIds(words, ids, index = 0) {
  const verbs = uniqueWords(words).filter((word) => word.function === "verb" && ids.includes(word.id));
  return pick(verbs, index);
}

function compatibleVerbIdsForTarget(word) {
  if (!word) return [];
  if (scriptWordIds.has(word.id)) return ["wakaru", "kaku", "yomu", "benkyooshimasu", "yomimasu", "kakimasu"];
  if (languageWordIds.has(word.id)) return ["wakaru", "hanasu", "benkyooshimasu", "kiku", "wakarimasu"];
  if (nameWordIds.has(word.id)) return ["kaku", "wakaru", "kakimasu", "wakarimasu"];
  if (isDrinkWord(word)) return ["nomu", "erabu", "kau", "kaimasu"];
  if (foodWordIds.has(word.id)) {
    return ["taberu", "erabu", "kau", "kaimasu"];
  }
  if (readingWordIds.has(word.id)) return ["yomu", "kaku", "yomimasu", "kakimasu"];
  if (watchWordIds.has(word.id) || watchableWordIds.has(word.id)) return ["miru"];
  if (word.id === "uta" || word.id === "karaoke") return ["kiku", "kikimasu", "utau"];
  if (listeningWordIds.has(word.id) || listenableWordIds.has(word.id)) return ["kiku", "kikimasu"];
  if (eventWordIds.has(word.id)) return ["iku", "ikimasu"];
  if (clothingWordIds.has(word.id)) return kiruWearableWordIds.has(word.id) ? ["kiru", "erabu", "kau", "kaimasu"] : ["erabu", "kau", "kaimasu"];
  if (giftWordIds.has(word.id)) return ["ageru", "agemasu", "erabu", "kau", "kaimasu"];
  if (transportWordIds.has(word.id)) return ["noru", "oriru", "erabu", "tsukau"];
  if (shopPlaceWordIds.has(word.id)) return ["hairu", "iku", "erabu"];
  if (residencePlaceWordIds.has(word.id)) return ["iku", "tsuku", "kuru", "sumu", "tomaru", "ikimasu"];
  if (isPlaceLike(word)) return ["iku", "tsuku", "kuru", "tomaru", "hairu", "ikimasu"];
  if (word.function === "person") return ["au", "hanasu", "kiku", "matsu"];
  if (activityWordIds.has(word.id)) return ["suru", "shimasu"];
  // A noun label alone cannot license choose/show: imported entries also contain
  // colors, questions, discourse markers, and adverbs. Only reviewed objects do.
  if (reviewedSelectableObject(word)) return ["erabu", "miseru"];
  return [];
}

function actionForTarget(unit, n, target, subject, verbWord) {
  if (!target || !subject || !verbWord) return undefined;
  if (["wakaru", "wakarimasu"].includes(verbWord.id)) return understoodObjectAction(unit, n, subject, target, verbWord);
  if (["noru", "norimasu", "oriru", "orimasu"].includes(verbWord.id) && transportWordIds.has(target.id)) return destinationAction(unit, n, subject, target, verbWord);
  if (["iku", "kuru", "tsuku", "tomaru", "sumu", "hairu", "ikimasu", "tomarimasu", "sumimasu"].includes(verbWord.id)) {
    if (isPlaceLike(target) || eventWordIds.has(target.id)) return destinationAction(unit, n, subject, target, verbWord);
  }
  if (["au", "hanasu"].includes(verbWord.id) && target.function === "person") return personAction(unit, n, subject, target, verbWord);
  return objectAction(unit, n, subject, target, verbWord);
}

function smartActionForWord(unit, n, word, pools, indexOffset = 0) {
  const c = classify(unit.newWords);
  const known = classify(pools.known);
  const subject = pick([...c.people, ...known.people], n + indexOffset, pools.known);
  const verbPool = uniqueWords([...unit.newWords, ...pools.known, ...(pools.reviewWords ?? []), ...(pools.lexiconWords ?? [])]);
  if (kiruWearableWordIds.has(word?.id)) {
    const wearVerb = verbByIds(verbPool, ["kiru"], 0);
    const wearingAction = actionForTarget(unit, n, word, subject, wearVerb);
    if (wearingAction) return wearingAction;
  }
  if (transportWordIds.has(word?.id)) {
    const rideVerb = verbByIds(verbPool, ["noru"], 0);
    const rideAction = actionForTarget(unit, n, word, subject, rideVerb);
    if (rideAction) return rideAction;
  }
  const verbWord = verbByIds(verbPool, compatibleVerbIdsForTarget(word), n + indexOffset);
  return actionForTarget(unit, n, word, subject, verbWord);
}

function smartActionForVerb(unit, n, subject, verbWord, candidates, pools, indexOffset = 0) {
  if (!subject || !verbWord) return undefined;
  if (["niau", "niaimasu"].includes(verbWord.id)) {
    const clothing = pick([...candidates, ...(pools.known ?? [])].filter((word) => clothingWordIds.has(word.id)), n + indexOffset);
    if (clothing) return suitCard(unit, n, clothing, verbWord);
  }
  if (verbWord.id === "aru") {
    const places = classify([...(pools.known ?? []), ...unit.newWords]).places;
    const things = objectCandidates(candidates).filter((word) => word.function === "noun" && !languageWordIds.has(word.id) && !scriptWordIds.has(word.id));
    const place = pick(places, n + indexOffset);
    const thing = pick(things, n + indexOffset);
    if (place && thing) return placeExistence(unit, n, place, thing, verbWord);
  }
  if (verbWord.id === "iru") {
    const places = classify([...(pools.known ?? []), ...unit.newWords]).places;
    const people = [...classify(candidates).people, ...classify(pools.known ?? []).people];
    const place = pick(places, n + indexOffset);
    const person = pick(people, n + indexOffset);
    if (place && person) return personExistence(unit, n, place, person, verbWord);
  }
  if (["sumu", "sumimasu"].includes(verbWord.id)) {
    const places = uniqueWords([...candidates, ...(pools.known ?? []), ...unit.newWords]).filter((word) => residencePlaceWordIds.has(word.id));
    const place = pick(places, n + indexOffset);
    if (place) return destinationAction(unit, n, subject, place, verbWord);
  }
  if (["tomaru", "tomarimasu"].includes(verbWord.id)) {
    const places = uniqueWords([...candidates, ...(pools.known ?? []), ...unit.newWords]).filter((word) => isPlaceLike(word) && !shopPlaceWordIds.has(word.id));
    const place = pick(places, n + indexOffset);
    if (place) return destinationAction(unit, n, subject, place, verbWord);
  }
  if (["iku", "kuru", "tsuku", "hairu", "kaeru", "ikimasu", "kimasu", "tsukimasu", "hairimasu", "kaerimasu"].includes(verbWord.id)) {
    const places = uniqueWords([...candidates, ...(pools.known ?? []), ...unit.newWords]).filter((word) => {
      if (!isPlaceLike(word) && !eventWordIds.has(word.id)) return false;
      if (["kaeru", "kaerimasu"].includes(verbWord.id)) return residencePlaceWordIds.has(word.id);
      if (["hairu", "hairimasu"].includes(verbWord.id)) return !residencePlaceWordIds.has(word.id) || ["ie", "uchi", "heya", "apaato", "manshon"].includes(word.id);
      return true;
    });
    const place = pick(places, n + indexOffset);
    if (place) return destinationAction(unit, n, subject, place, verbWord);
  }
  const target = objectForVerb(unit, verbWord, candidates, n + indexOffset, pools.known);
  if (target) {
    if (["wakaru", "wakarimasu"].includes(verbWord.id)) return understoodObjectAction(unit, n, subject, target, verbWord);
    if (["suru", "shimasu"].includes(verbWord.id) && activityWordIds.has(target.id)) return objectAction(unit, n, subject, target, verbWord);
    if (verbWord.id === "hanasu" && target.function !== "person") return objectAction(unit, n, subject, target, verbWord);
    if (["au", "aimasu", "hanasu"].includes(verbWord.id) && target.function === "person") {
      const people = candidates.filter((word) => word.function === "person");
      const partner = pickDifferent(people, n + indexOffset + 3, subject, pools.known) ?? target;
      return personAction(unit, n, subject, partner, verbWord);
    }
    if (verbWord.transitive) return objectAction(unit, n, subject, target, verbWord);
  }
  return action(unit, n, subject, verbWord);
}

function objectCandidates(words) {
  return words.filter((word) => ["noun", "person"].includes(word.function));
}

function objectForVerb(unit, verbWord, candidates, index, fallback = []) {
  const pool = objectCandidates(candidates);
  const fallbackPool = objectCandidates(fallback);

  if (["wakaru", "wakarimasu"].includes(verbWord?.id)) {
    return pick(
      pool.filter((word) => scriptWordIds.has(word.id) || languageWordIds.has(word.id) || nameWordIds.has(word.id)),
      index,
      fallbackPool.filter((word) => scriptWordIds.has(word.id) || languageWordIds.has(word.id) || nameWordIds.has(word.id)),
    );
  }

  if (["yomu", "yomimasu"].includes(verbWord?.id)) {
    return pick(
      pool.filter((word) => scriptWordIds.has(word.id) || languageWordIds.has(word.id) || readingWordIds.has(word.id)),
      index,
      fallbackPool.filter((word) => scriptWordIds.has(word.id) || languageWordIds.has(word.id) || readingWordIds.has(word.id)),
    );
  }

  if (["kaku", "kakimasu"].includes(verbWord?.id)) {
    return pick(
      pool.filter((word) => scriptWordIds.has(word.id) || nameWordIds.has(word.id) || readingWordIds.has(word.id)),
      index,
      fallbackPool.filter((word) => scriptWordIds.has(word.id) || nameWordIds.has(word.id) || readingWordIds.has(word.id)),
    );
  }

  if (["erabu", "erabimasu"].includes(verbWord?.id)) {
    const selectable = (word) => reviewedSelectableObject(word) || foodWordIds.has(word.id) || drinkWordIds.has(word.id) || clothingWordIds.has(word.id) || giftWordIds.has(word.id) || transportWordIds.has(word.id);
    return pick(pool.filter(selectable), index, fallbackPool.filter(selectable));
  }

  if (["kiku", "kikimasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => listeningWordIds.has(word.id) || languageWordIds.has(word.id)), index, fallbackPool.filter((word) => listeningWordIds.has(word.id) || languageWordIds.has(word.id)));
  }

  if (["utau", "utaimasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => ["uta", "karaoke"].includes(word.id)), index, fallbackPool.filter((word) => ["uta", "karaoke"].includes(word.id)));
  }

  if (verbWord?.id === "nomu") {
    return pick(pool.filter(isDrinkWord), index, fallbackPool.filter(isDrinkWord));
  }

  if (verbWord?.id === "taberu") {
    return pick(pool.filter((word) => foodWordIds.has(word.id)), index, fallbackPool.filter((word) => foodWordIds.has(word.id)));
  }

  if (["miru", "mimasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => watchWordIds.has(word.id) || watchableWordIds.has(word.id)), index, fallbackPool.filter((word) => watchWordIds.has(word.id) || watchableWordIds.has(word.id)));
  }

  if (["suru", "shimasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => activityWordIds.has(word.id)), index, fallbackPool.filter((word) => activityWordIds.has(word.id)));
  }

  if (["kiru", "kimasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => kiruWearableWordIds.has(word.id)), index, fallbackPool.filter((word) => kiruWearableWordIds.has(word.id)));
  }

  if (["tsukau", "tsukaimasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => usefulItemWordIds.has(word.id)), index, fallbackPool.filter((word) => usefulItemWordIds.has(word.id)));
  }

  if (["noru", "norimasu", "oriru", "orimasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => transportWordIds.has(word.id)), index, fallbackPool.filter((word) => transportWordIds.has(word.id)));
  }

  if (["ageru", "agemasu"].includes(verbWord?.id)) {
    return pick(pool.filter((word) => giftWordIds.has(word.id)), index, fallbackPool.filter((word) => giftWordIds.has(word.id)));
  }

  if (["kau", "kaimasu"].includes(verbWord?.id)) {
    const buyable = (word) => giftWordIds.has(word.id) || foodWordIds.has(word.id) || clothingWordIds.has(word.id) || usefulItemWordIds.has(word.id);
    return pick(pool.filter(buyable), index, fallbackPool.filter(buyable));
  }

  if (verbWord?.id === "hanasu" || verbWord?.id === "au") {
    if (verbWord.id === "hanasu") {
      return pick(
        pool.filter((word) => word.function === "person" || languageWordIds.has(word.id)),
        index,
        fallbackPool.filter((word) => word.function === "person" || languageWordIds.has(word.id)),
      );
    }
    return pick(pool.filter((word) => word.function === "person"), index, fallbackPool.filter((word) => word.function === "person"));
  }

  if (verbWord?.transitive) {
    const compatibleTargets = pool.filter((word) => compatibleVerbIdsForTarget(word).includes(verbWord.id));
    const compatibleFallback = fallbackPool.filter((word) => compatibleVerbIdsForTarget(word).includes(verbWord.id));
    return pick(compatibleTargets, index, compatibleFallback);
  }

  return undefined;
}

function labelNoun(unit, n, word) {
  return identity(unit, n, word);
}

function unitOnePracticeCard(unit, n, pools) {
  const byId = pools.byId;
  const watashi = byId.get("watashi") ?? unit.newWords.find((word) => word.id === "watashi");
  const anata = byId.get("anata") ?? unit.newWords.find((word) => word.id === "anata");
  const gakusei = byId.get("gakusei") ?? unit.newWords.find((word) => word.id === "gakusei");
  const sensei = byId.get("sensei") ?? unit.newWords.find((word) => word.id === "sensei");
  const nihongo = byId.get("nihongo") ?? unit.newWords.find((word) => word.id === "nihongo");
  const eigo = byId.get("eigo") ?? unit.newWords.find((word) => word.id === "eigo");
  const hiragana = byId.get("hiragana") ?? unit.newWords.find((word) => word.id === "hiragana");
  const katakana = byId.get("katakana") ?? unit.newWords.find((word) => word.id === "katakana");
  const kanji = byId.get("kanji") ?? unit.newWords.find((word) => word.id === "kanji");
  const yomu = byId.get("yomu") ?? unit.newWords.find((word) => word.id === "yomu");
  const kaku = byId.get("kaku") ?? unit.newWords.find((word) => word.id === "kaku");
  const wakaru = byId.get("wakaru") ?? unit.newWords.find((word) => word.id === "wakaru");
  const learningTargets = [nihongo, eigo, hiragana, katakana, kanji].filter(Boolean);
  const people = [watashi, anata, gakusei, sensei].filter(Boolean);

  const actionSubjects = people;
  const actionTargets = learningTargets;
  const actionVerbs = [yomu, kaku, wakaru].filter(Boolean);
  const actionCombos = [];
  for (const subject of actionSubjects) {
    for (const target of actionTargets) {
      for (const verbWord of actionVerbs) actionCombos.push({ subject, target, verbWord });
    }
  }
  const firstIntroActionKeys = new Set(["watashi|nihongo|yomu", "watashi|kanji|kaku", "watashi|hiragana|wakaru"]);
  const usableActionCombos = actionCombos.filter((combo) => !firstIntroActionKeys.has(`${combo.subject.id}|${combo.target.id}|${combo.verbWord.id}`));

  const practiceIndex = n - 13;
  if (practiceIndex >= 0 && practiceIndex < usableActionCombos.length) {
    const combo = usableActionCombos[(practiceIndex * 17) % usableActionCombos.length];
    if (combo.subject.id === "anata") return targetActionQuestion(unit, n, combo.subject, combo.target, combo.verbWord);
    if (["wakaru", "wakarimasu"].includes(combo.verbWord.id)) return understoodObjectAction(unit, n, combo.subject, combo.target, combo.verbWord);
    return objectAction(unit, n, combo.subject, combo.target, combo.verbWord);
  }

  const questions = [
    () => (sensei && eigo && yomu ? targetActionQuestion(unit, n, sensei, eigo, yomu) : undefined),
    () => (gakusei && kanji && kaku ? targetActionQuestion(unit, n, gakusei, kanji, kaku) : undefined),
    () => (sensei && hiragana && wakaru ? targetActionQuestion(unit, n, sensei, hiragana, wakaru) : undefined),
    () => (sensei && nihongo && kaku ? targetActionQuestion(unit, n, sensei, nihongo, kaku) : undefined),
    () => (gakusei && eigo && wakaru ? targetActionQuestion(unit, n, gakusei, eigo, wakaru) : undefined),
    () => (sensei && katakana && yomu ? targetActionQuestion(unit, n, sensei, katakana, yomu) : undefined),
    () => (gakusei && nihongo && yomu ? targetActionQuestion(unit, n, gakusei, nihongo, yomu) : undefined),
    () => (sensei && kanji && wakaru ? targetActionQuestion(unit, n, sensei, kanji, wakaru) : undefined),
    () => (sensei && eigo && kaku ? targetActionQuestion(unit, n, sensei, eigo, kaku) : undefined),
    () =>
      anata && sensei
        ? makeCard(unit.id, n, [token(anata), fw("wa"), token(sensei), fw("desu"), fw("ka"), fw("q")], "Are you a teacher?", [unit.grammarFocus, "A\u306fB\u3067\u3059\u304b"])
        : undefined,
    () =>
      anata && gakusei
        ? makeCard(unit.id, n, [token(anata), fw("wa"), token(gakusei), fw("desu"), fw("ka"), fw("q")], "Are you a student?", [unit.grammarFocus, "A\u306fB\u3067\u3059\u304b"])
        : undefined,
  ];
  const question = questions[(practiceIndex - usableActionCombos.length) % questions.length]?.();
  if (question) return question;

  const target = pick(learningTargets, n);
  if (watashi && wakaru && target) return understoodObjectAction(unit, n, watashi, target, wakaru);
  return makeCard(unit.id, n, [token(watashi), fw("wa"), token(gakusei), fw("desu")], "I am a student", [unit.grammarFocus, "A\u306fB\u3067\u3059"]);
}

function hasQuestionMarker(card) {
  return card.tokens.some((part) => part.surface === jp.ka[0] || part.surface === jp.q[0]);
}

function hasFinalTone(card) {
  return ["\u306d", "\u3088"].includes(card.tokens.at(-1)?.surface);
}

function addToneEnding(card, endingName, englishSuffix) {
  if (hasQuestionMarker(card) || hasFinalTone(card)) return false;
  card.tokens.push(fw(endingName));
  card.english = `${card.english}${englishSuffix}`;
  return true;
}

function makeDesuQuestion(card) {
  if (hasQuestionMarker(card) || !card.tokens.some((part) => part.surface === jp.desu[0])) return false;
  while (hasFinalTone(card)) card.tokens.pop();
  card.tokens.push(fw("ka"), fw("q"));
  card.english = card.english.replace(/, right, you know$|, right\?$|, right$|, you know$/, "");
  card.english = `${card.english}?`;
  return true;
}

function pick(list, index, fallback = []) {
  if (list.length > 0) return list[Math.abs(index) % list.length];
  if (fallback.length > 0) return fallback[Math.abs(index) % fallback.length];
  return undefined;
}

function pickDifferent(list, index, blocked, fallback = []) {
  const pool = list.filter((word) => word?.id !== blocked?.id);
  return pick(pool, index, fallback.filter((word) => word?.id !== blocked?.id));
}

function buildIntroCard(unit, word, n, pools) {
  if (unit.id === 1) return unitOnePracticeCard(unit, n, pools);

  const c = classify(unit.newWords);
  const known = classify(pools.known);
  const subject = pick([...known.people, ...c.people], n, pools.known);
  const noun = pickDifferent([...c.commonNouns, ...known.commonNouns], n, word, pools.known);
  const place = pick([...c.places, ...known.places], n, pools.known);
  const object = objectForVerb(unit, undefined, [...c.commonNouns, ...known.commonNouns], n + 1, pools.known);
  const verbWord = pick(timeActionVerbs([...c.verbs, ...known.verbs]), n);
  const aruWord = pools.byId.get("aru");
  const iruWord = pools.byId.get("iru");

  if (word.function === "phrase") return phraseCard(unit, n, word);
  if (word.function === "verb") {
    if (word.id === "aru" && place && object) return placeExistence(unit, n, place, object, word);
    if (word.id === "iru" && place && subject) return personExistence(unit, n, place, subject, word);
    return smartActionForVerb(unit, n, subject, word, unit.id === 4 ? unit.newWords : [...c.commonNouns, ...known.commonNouns, ...c.people, ...known.people], pools, 1);
  }
  if (word.function === "adjective") {
    if (word.id === "hoshii" && subject) {
      const wanted = pickDifferent([...c.commonNouns, ...known.commonNouns], n, word, pools.known);
      if (wanted) return wantCard(unit, n, subject, wanted, word);
    }
    const described = pickDifferent(compatibleAdjectiveTargets(word, [...c.commonNouns, ...c.places, ...c.people, ...known.commonNouns, ...known.places, ...known.people]), n, word);
    return described ? adjectiveCard(unit, n, described, word) : identity(unit, n, word);
  }
  if (word.function === "person") {
    const verb = pick(productiveVerbs([...c.verbs, ...known.verbs]), n + 2);
    const learner = pools.byId.get("watashi");
    if (genericPersonWordIds.has(word.id)) return identity(unit, n, word);
    if (unit.id === 2 && learner && !["watashi", "anata"].includes(word.id)) return topicIdentity(unit, n, learner, word);
    if (unit.id === 3 && learner && !["watashi", "anata"].includes(word.id)) return possessiveCard(unit, n, learner, word);
    if (n % 2 === 0 && verb) return action(unit, n, word, verb);
    return identity(unit, n, word);
  }
  if (isPlaceLike(word) && aruWord && object) {
    const natural = smartActionForWord(unit, n, word, pools);
    if (natural) return natural;
    return placeExistence(unit, n, word, object, aruWord);
  }
  if (isPlaceLike(word) && unit.id === 2) {
    const countryWord = pools.byId.get("kuni") ?? c.places.find((candidate) => candidate.id === "kuni");
    if (countryWord && countryWord.id !== word.id) return topicIdentity(unit, n, word, countryWord);
    return labelNoun(unit, n, word);
  }
  if (["time", "adverb", "quantity"].includes(word.function)) {
    if (word.function === "quantity" && aruWord && place && unit.id >= 6) return placeExistence(unit, n, place, word, aruWord);
    if (word.function === "time" && isPastTimeWord(word)) return phraseCard(unit, n, word, cap(cleanMeaning(word)));
    if (word.function === "adverb" && !sentenceAdverbWordIds.has(word.id)) return phraseCard(unit, n, word, cap(cleanMeaning(word)));
    if (word.function !== "quantity" && verbWord && subject) return timeAdverbAction(unit, n, word, subject, verbWord);
    return phraseCard(unit, n, word, cap(cleanMeaning(word)));
  }
  if (word.function === "noun" || (word.function === "proper" && !isPlaceLike(word))) {
    const natural = smartActionForWord(unit, n, word, pools);
    if (natural) return natural;
    const foodVerb = isDrinkWord(word) ? pools.byId.get("nomu") : pools.byId.get("taberu");
    if (unit.id === 4 && subject && foodVerb) return objectAction(unit, n, subject, word, foodVerb);
    if (aruWord && unit.id >= 6 && place) return placeExistence(unit, n, place, word, aruWord);
    return labelNoun(unit, n, word);
  }
  if (iruWord && n % 7 === 0 && c.people.length > 0) return personExistence(unit, n, place, pick(c.people, n, pools.known), iruWord);
  return labelNoun(unit, n, word);
}

function buildFirstIntroCard(unit, word, n, knownSoFar) {
  if (unit.id === 1) {
    return unitOneIntroCard(unit, n, word, knownSoFar);
  }

  const known = classify(knownSoFar);
  const subject = pick(known.people, n, knownSoFar);
  const noun = pickDifferent(known.commonNouns, n, word, knownSoFar);
  const place = pick(known.places, n, knownSoFar);
  const verbWord = pick(timeActionVerbs(known.verbs), n);

  if (word.function === "phrase") return phraseCard(unit, n, word);
  if (word.function === "verb") {
    const place = pick(known.places, n, knownSoFar);
    const noun = pick(known.commonNouns, n, knownSoFar);
    const person = pick(known.people, n, knownSoFar);
    if (word.id === "aru" && place && noun) return placeExistence(unit, n, place, noun, word);
    if (word.id === "iru" && place && person) return personExistence(unit, n, place, person, word);
    if (subject) return smartActionForVerb(unit, n, subject, word, unit.id === 4 ? unit.newWords : knownSoFar, { ...classify(knownSoFar), known: knownSoFar }, 0);
    if (subject) return action(unit, n, subject, word);
    return identity(unit, n, word);
  }
  if (word.function === "adjective") {
    if (word.id === "hoshii" && subject) {
      const wanted = pickDifferent(known.commonNouns, n, word, knownSoFar);
      if (wanted) return wantCard(unit, n, subject, wanted, word);
    }
    const described = pickDifferent(compatibleAdjectiveTargets(word, [...known.commonNouns, ...known.places, ...known.people]), n, word);
    if (described) return adjectiveCard(unit, n, described, word);
    return identity(unit, n, word);
  }
  if (word.function === "person") {
    const learner = knownSoFar.find((candidate) => candidate.id === "watashi");
    if (genericPersonWordIds.has(word.id)) return identity(unit, n, word);
    if (unit.id === 2 && learner && !["watashi", "anata"].includes(word.id)) return topicIdentity(unit, n, learner, word);
    if (unit.id === 3 && learner && !["watashi", "anata"].includes(word.id)) return possessiveCard(unit, n, learner, word);
    if (verbWord) return action(unit, n, word, verbWord);
    return identity(unit, n, word);
  }
  if (word.function === "noun" || (word.function === "proper" && !isPlaceLike(word))) {
    const knownById = new Map(knownSoFar.map((candidate) => [candidate.id, candidate]));
    const unitById = new Map(unit.newWords.map((candidate) => [candidate.id, candidate]));
    const suruVerb = unitById.get("suru") ?? unitById.get("shimasu") ?? knownById.get("suru") ?? knownById.get("shimasu");
    if (activityWordIds.has(word.id) && subject && suruVerb) return objectAction(unit, n, subject, word, suruVerb);
    const natural = subject ? actionForTarget(unit, n, word, subject, verbByIds(knownSoFar, compatibleVerbIdsForTarget(word), n)) : undefined;
    if (natural) return natural;
    const foodVerb = isDrinkWord(word) ? knownById.get("nomu") : knownById.get("taberu");
    if (unit.id === 4 && subject && foodVerb) return objectAction(unit, n, subject, word, foodVerb);
    return labelNoun(unit, n, word);
  }
  if (isPlaceLike(word) && unit.id === 2) {
    const countryWord = knownSoFar.find((candidate) => candidate.id === "kuni");
    if (countryWord && countryWord.id !== word.id) return topicIdentity(unit, n, word, countryWord);
    return labelNoun(unit, n, word);
  }
  if (["time", "adverb", "quantity"].includes(word.function)) {
    if (word.function === "time" && isPastTimeWord(word)) return phraseCard(unit, n, word, cap(cleanMeaning(word)));
    if (word.function === "adverb" && !sentenceAdverbWordIds.has(word.id)) return phraseCard(unit, n, word, cap(cleanMeaning(word)));
    if (verbWord && subject && word.function !== "quantity") return timeAdverbAction(unit, n, word, subject, verbWord);
    return phraseCard(unit, n, word, cap(cleanMeaning(word)));
  }
  if (subject && !["time", "adverb", "quantity"].includes(word.function)) return possessiveCard(unit, n, subject, word);
  if (place) return topicIdentity(unit, n, word, place);
  return identity(unit, n, word);
}

function buildMixCard(unit, n, pools) {
  if (unit.id === 1) return unitOnePracticeCard(unit, n, pools);

  const c = classify(unit.newWords);
  const known = classify(pools.known);
  const people = [...c.people, ...known.people];
  const nouns = [...c.commonNouns, ...known.commonNouns];
  const places = [...c.places, ...known.places];
  const subject = pick(people, n + Math.floor(n / 5), pools.known);
  const noun = pick(nouns, Math.floor(n / Math.max(1, people.length)) + n, pools.known);
  const describedNoun = pick(nouns.filter((candidate) => !isLanguageOrScriptWord(candidate)), Math.floor(n / Math.max(1, people.length)) + n, pools.known);
  const other = pickDifferent(nouns, Math.floor(n / 3) + n * 2, noun, pools.known);
  const place = pick(places, Math.floor(n / 4) + n, pools.known);
  const adjective = pick([...c.adjectives, ...known.adjectives], n + Math.floor(n / 6));
  const verbWord = pick(productiveVerbs([...c.verbs, ...known.verbs]), n + Math.floor(n / 7));
  const aruWord = pools.byId.get("aru");
  const iruWord = pools.byId.get("iru");

  if (c.phrases.length > 0 && n % 4 === 0) return phraseCard(unit, n, pick(c.phrases, n, pools.known));
  if (adjective && n % 5 === 0) {
    if (adjective.id === "hoshii" && subject && noun) return wantCard(unit, n, subject, noun, adjective);
    const described = pick(compatibleAdjectiveTargets(adjective, [...nouns, ...places, ...people]), n);
    if (described) return adjectiveCard(unit, n, described, adjective);
  }
  if (noun && n % 4 === 1) {
    const natural = smartActionForWord(unit, n, noun, pools);
    if (natural) return natural;
  }
  if (aruWord && unit.id >= 6 && n % 5 === 1) return placeExistence(unit, n, place, other, aruWord);
  if (iruWord && n % 8 === 2) return personExistence(unit, n, place, subject, iruWord);
  if (verbWord?.id === "aru" && place && noun) return placeExistence(unit, n, place, noun, verbWord);
  if (verbWord?.id === "iru" && place && subject) return personExistence(unit, n, place, subject, verbWord);
  if (verbWord?.transitive && n % 3 !== 0) {
    return smartActionForVerb(unit, n, subject, verbWord, [...nouns, ...people], pools);
  }
  if (verbWord && place) {
    if (isNiMovementOrLocationVerb(verbWord)) return smartActionForVerb(unit, n, subject, verbWord, [...places, ...nouns, ...people], pools);
    return placeAction(unit, n, subject, place, verbWord);
  }
  if (n % 3 === 0 && subject && noun) return possessiveCard(unit, n, subject, noun);
  if (unit.id === 2) {
    const countryWord = pools.byId.get("kuni");
    const country = pick(c.places, n, places);
    if (country && countryWord && country.id !== countryWord.id) return topicQuestion(unit, n, country, countryWord);
  }
  return labelNoun(unit, n, noun ?? subject ?? place);
}

function buildReviewCard(unit, n, dueWord, pools) {
  const current = unit.newWords;
  const c = classify(current);
  const known = classify(pools.known);
  const people = [...c.people, ...known.people];
  const nouns = [...c.commonNouns, ...known.commonNouns];
  const places = [...c.places, ...known.places];
  const subject = pick(people, n + Math.floor(n / 5), pools.known);
  const place = pick(places, n + Math.floor(n / 4), pools.known);
  const noun = pickDifferent(nouns, n + Math.floor(n / 3), dueWord, pools.known);
  const adjective = pick([...c.adjectives, ...known.adjectives], n + Math.floor(n / 6));
  const verbWord = pick(productiveVerbs([...c.verbs, ...known.verbs]), n + Math.floor(n / 7));
  const timeVerbWord = pick(timeActionVerbs([...c.verbs, ...known.verbs]), n + Math.floor(n / 7));
  const aruWord = pools.byId.get("aru");
  const iruWord = pools.byId.get("iru");

  if (dueWord.function === "phrase") {
    return phraseCard(unit, n, dueWord, cap(cleanMeaning(dueWord)));
  }
  if (dueWord.function === "verb") {
    return smartActionForVerb(unit, n, subject, dueWord, [...nouns, ...people], pools);
  }
  if (dueWord.function === "person") {
    if (verbWord) return action(unit, n, dueWord, verbWord);
    return topicIdentity(unit, n, dueWord, noun, "bold review");
  }
  if (dueWord.function === "adjective") {
    if (dueWord.id === "hoshii" && subject) {
      const wanted = pickDifferent(nouns, n, dueWord, pools.known);
      if (wanted) return wantCard(unit, n, subject, wanted, dueWord);
    }
    const described = pickDifferent(compatibleAdjectiveTargets(dueWord, [...nouns, ...places, ...people]), n, dueWord);
    return described ? adjectiveCard(unit, n, described, dueWord) : identity(unit, n, dueWord);
  }
  if (isPlaceLike(dueWord)) {
    const natural = smartActionForWord(unit, n, dueWord, pools);
    if (natural) return natural;
    if (!aruWord) {
      const movementVerb = pools.byId.get("sumu") ?? pools.byId.get("iku") ?? (isNiMovementOrLocationVerb(verbWord) ? verbWord : undefined);
      if (movementVerb && subject) return destinationAction(unit, n, subject, dueWord, movementVerb);
      return topicIdentity(unit, n, dueWord, noun, "bold review");
    }
    return placeExistence(unit, n, dueWord, noun, aruWord);
  }
  if (["time", "adverb"].includes(dueWord.function)) {
    if (dueWord.function === "time" && isPastTimeWord(dueWord)) return phraseCard(unit, n, dueWord, cap(cleanMeaning(dueWord)));
    if (dueWord.function === "adverb" && !sentenceAdverbWordIds.has(dueWord.id)) return phraseCard(unit, n, dueWord, cap(cleanMeaning(dueWord)));
    if (timeVerbWord && subject) return timeAdverbAction(unit, n, dueWord, subject, timeVerbWord);
    return phraseCard(unit, n, dueWord, cap(cleanMeaning(dueWord)));
  }
  if (dueWord.function === "quantity") return phraseCard(unit, n, dueWord, cap(cleanMeaning(dueWord)));
  if (dueWord.function === "noun" || (dueWord.function === "proper" && !isPlaceLike(dueWord))) {
    const natural = smartActionForWord(unit, n, dueWord, pools);
    if (natural) return natural;
    if (dueWord.function === "noun" && verbWord?.transitive && n % 2 === 0) {
      return objectAction(unit, n, subject, dueWord, verbWord);
    }
    if (aruWord && place) return placeExistence(unit, n, place, dueWord, aruWord);
    if (adjective && compatibleAdjectiveTargets(adjective, [dueWord]).length > 0) return adjectiveCard(unit, n, dueWord, adjective);
    return topicIdentity(unit, n, dueWord, noun, "bold review");
  }
  if (iruWord && subject) return personExistence(unit, n, place, subject, iruWord);
  return topicIdentity(unit, n, dueWord, noun, "bold review");
}

function dedupeCards(unit, cards) {
  const seenLines = new Map();
  const seenEnglish = new Map();

  for (const card of cards) {
    seenLines.set(card.line.join(""), card.id);
    seenEnglish.set(card.english, card.id);
  }

  return cards;
}

function resetCardOrdinal(unit, card, ordinal) {
  return { ...card, id: `u${String(unit.id).padStart(3, "0")}-c${String(ordinal).padStart(3, "0")}` };
}

function japaneseLineKey(card) {
  return Array.isArray(card.line) ? card.line.join("") : "";
}

function srsWordIdsOnCard(card, srsWords) {
  const srsIds = new Set(srsWords.map((word) => word.id));
  return [...new Set((card.tokens ?? []).flatMap((token) => (token.wordId && srsIds.has(token.wordId) ? [token.wordId] : [])))];
}

function repairDuplicateJapaneseLines(unit, cards, pools, reviewWords) {
  const seen = new Set();
  const currentById = new Map(unit.newWords.map((word) => [word.id, word]));
  const reviewById = new Map(reviewWords.map((word) => [word.id, word]));
  const srsWords = [...unit.newWords, ...reviewWords];

  for (const [index, card] of cards.entries()) {
    const key = japaneseLineKey(card);
    if (!seen.has(key)) {
      seen.add(key);
      continue;
    }

    const protectedWordIds = srsWordIdsOnCard(card, srsWords);
    const protectedWord =
      protectedWordIds.map((wordId) => reviewById.get(wordId)).find(Boolean) ?? protectedWordIds.map((wordId) => currentById.get(wordId)).find(Boolean);
    const wasForcedReview = card.grammarTags?.includes("forced review coverage");

    let replacement;
    for (let attempt = 1; attempt <= 120; attempt += 1) {
      const variantOrdinal = index + 1 + attempt * 17;
      let candidate;
      try {
        if (protectedWord && reviewById.has(protectedWord.id)) {
          candidate = alternateCardForWord(unit, variantOrdinal, protectedWord, pools, attempt) ?? buildMixCard(unit, variantOrdinal, pools);
          if (!["phrase", "quantity", "adverb"].includes(protectedWord.function) && !candidate.tokens.some((token) => token.wordId === protectedWord.id)) continue;
          if (wasForcedReview) candidate.grammarTags.push("forced review coverage");
        } else if (protectedWord && currentById.has(protectedWord.id)) {
          candidate = alternateCardForWord(unit, variantOrdinal, protectedWord, pools, attempt) ?? buildMixCard(unit, variantOrdinal, pools);
          if (!["phrase", "quantity", "adverb"].includes(protectedWord.function) && !candidate.tokens.some((token) => token.wordId === protectedWord.id)) continue;
        } else {
          candidate = buildMixCard(unit, variantOrdinal, pools);
        }
      } catch {
        continue;
      }

      const candidateKey = japaneseLineKey(candidate);
      if (!candidateKey || seen.has(candidateKey) || candidateKey === key) continue;
      replacement = resetCardOrdinal(unit, candidate, index + 1);
      break;
    }

    if (replacement) {
      cards[index] = replacement;
      seen.add(japaneseLineKey(replacement));
    } else {
      seen.add(key);
    }
  }

  return cards;
}

function replaceRemainingDuplicateJapaneseLines(unit, cards, pools) {
  const seen = new Set();
  for (const [index, card] of cards.entries()) {
    const key = japaneseLineKey(card);
    if (!seen.has(key)) {
      seen.add(key);
      continue;
    }

    let replacement;
    for (let attempt = 1; attempt <= 180; attempt += 1) {
      const candidate = buildMixCard(unit, index + 1 + attempt * 23, pools);
      const candidateKey = japaneseLineKey(candidate);
      if (!candidateKey || seen.has(candidateKey) || candidateKey === key) continue;
      replacement = resetCardOrdinal(unit, candidate, index + 1);
      break;
    }

    if (replacement) {
      cards[index] = replacement;
      seen.add(japaneseLineKey(replacement));
    } else {
      seen.add(key);
    }
  }
  return cards;
}

function alternateCardForWord(unit, n, word, pools, attempt = 0) {
  if (!word || word.function === "phrase") return undefined;

  const c = classify(unit.newWords);
  const known = classify(pools.known);
  const people = uniqueWords([...c.people, ...known.people]);
  const nouns = uniqueWords([...c.commonNouns, ...known.commonNouns]);
  const places = uniqueWords([...c.places, ...known.places]);
  const verbs = productiveVerbs([...c.verbs, ...known.verbs, ...(pools.reviewWords ?? []), ...(pools.lexiconWords ?? [])]);
  const subject = pick(people, n + attempt, pools.known);

  if (word.function === "verb") {
    return smartActionForVerb(unit, n, subject, word, [...nouns, ...people, ...places], pools, attempt);
  }

  if (word.function === "person") {
    const verbWord = verbByIds(verbs, compatibleVerbIdsForTarget(word), n + attempt) ?? pick(verbs, n + attempt);
    const place = pick(places, n + attempt, pools.known);
    if (verbWord && place && ["sumu", "sumimasu"].includes(verbWord.id)) return destinationAction(unit, n, word, place, verbWord);
    if (verbWord && place && ["hataraku", "hatarakimasu"].includes(verbWord.id)) return placeAction(unit, n, word, place, verbWord);
    if (verbWord && subject && subject.id !== word.id && ["au", "hanasu"].includes(verbWord.id)) return personAction(unit, n, subject, word, verbWord);
    if (verbWord) return action(unit, n, word, verbWord);
  }

  if (["time", "adverb", "quantity"].includes(word.function)) {
    if (word.function === "time" && isPastTimeWord(word)) return phraseCard(unit, n, word, cap(cleanMeaning(word)));
    if (word.function === "adverb" && !sentenceAdverbWordIds.has(word.id)) return phraseCard(unit, n, word, cap(cleanMeaning(word)));
    const verbWord = pick(timeActionVerbs(verbs), n + attempt);
    if (verbWord && subject) return timeAdverbAction(unit, n, word, subject, verbWord);
  }

  if (word.function === "adjective") {
    if (word.id === "hoshii" && subject) {
      const wanted = pickDifferent(nouns, n + attempt, word);
      if (wanted) return wantCard(unit, n, subject, wanted, word);
    }
    const described = pickDifferent(compatibleAdjectiveTargets(word, [...nouns, ...places, ...people]), n + attempt, word);
    if (described) return adjectiveCard(unit, n, described, word);
  }

  const natural = smartActionForWord(unit, n, word, pools, attempt);
  if (natural) return natural;

  if (isPlaceLike(word)) {
    const movementVerb = verbByIds(verbs, compatibleVerbIdsForTarget(word), n + attempt);
    if (movementVerb && subject) return destinationAction(unit, n, subject, word, movementVerb);
  }

  if (word.function === "noun") {
    const verbWord = verbByIds(verbs, compatibleVerbIdsForTarget(word), n + attempt);
    if (verbWord && subject) return actionForTarget(unit, n, word, subject, verbWord);
  }

  return undefined;
}

function attachWord(card, word, label = "with") {
  if (!word || card.tokens.some((part) => part.wordId === word.id)) return false;
  if (!["noun", "person", "place", "proper"].includes(word.function)) return false;
  card.tokens.push(fw("to"), token(word));
  card.line = card.tokens.map((part) => part.surface);
  card.tts = card.tokens.map((part) => part.reading);
  card.explain = card.tokens.map((part) => part.explain);
  card.english = `${card.english} ${label} ${objectEnglish(word)}`;
  return true;
}

function wordCounts(cards, words) {
  const ids = new Set(words.map((word) => word.id));
  const counts = new Map(words.map((word) => [word.id, 0]));
  for (const card of cards) {
    const seen = new Set(card.tokens.flatMap((part) => (part.wordId && ids.has(part.wordId) ? [part.wordId] : [])));
    for (const id of seen) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

function balanceCurrentExposure(unit, cards, pools, protectedIndexes = new Set()) {
  const minimum = 8;
  const counts = wordCounts(cards, unit.newWords);
  for (const word of unit.newWords) {
    let count = counts.get(word.id) ?? 0;
    let cursor = 12 + (unit.newWords.findIndex((candidate) => candidate.id === word.id) % 12);
    while (count < minimum && cursor < cards.length) {
      if (protectedIndexes.has(cursor)) {
        cursor += 1;
        continue;
      }
      const card = cards[cursor];
      if (!card.tokens.some((part) => part.wordId === word.id)) {
        cards[cursor] = buildIntroCard(unit, word, cursor + 1, pools);
        count += 1;
      }
      cursor += 12;
    }
  }
}

function forceReviewCoverage(unit, cards, reviewWords, pools) {
  reviewWords.forEach((word, index) => {
    const cardIndex = Math.min(cards.length - 1, 32 + index);
    cards[cardIndex] = buildReviewCard(unit, cardIndex + 1, word, pools);
    if (!cards[cardIndex].tokens.some((part) => part.wordId === word.id)) {
      cards[cardIndex] = ["phrase", "adverb", "time"].includes(word.function)
        ? phraseCard(unit, cardIndex + 1, word, cap(cleanMeaning(word)))
        : identity(unit, cardIndex + 1, word, "forced review coverage");
    }
    cards[cardIndex].grammarTags.push("forced review coverage");
  });
}

function forcedReviewIndexes(cards, reviewWords) {
  return new Set(reviewWords.map((_, index) => Math.min(cards.length - 1, 32 + index)));
}

function buildUnit(unit) {
  const reviewWords = wordsForUnits(reviewUnitIds(unit.id));
  const lexiconWords = wordsForUnits(lexiconUnits(unit.id));
  const previousKnown = units.filter((candidate) => candidate.id < unit.id).flatMap((candidate) => candidate.newWords);
  const known = allWordsUntil(unit.id);
  const byId = new Map(known.map((word) => [word.id, word]));
  const pools = { reviewWords, lexiconWords, known, byId };
  const cards = [];
  const knownSoFar = [...previousKnown];
  const targetCardCount = Math.max(80, 36 + reviewWords.length);

  if (unit.id === 1) {
    for (const word of unit.newWords) {
      cards.push(buildFirstIntroCard(unit, word, cards.length + 1, knownSoFar));
      knownSoFar.push(word);
    }

    while (cards.length < 80) {
      cards.push(unitOnePracticeCard(unit, cards.length + 1, pools));
    }

    repairDuplicateJapaneseLines(unit, cards, pools, reviewWords);
    replaceRemainingDuplicateJapaneseLines(unit, cards, pools);
    dedupeCards(unit, cards);

    return {
      id: unit.id,
      slug: unit.slug,
      title: unit.title,
      grammarFocus: unit.grammarFocus,
      newWords: unit.newWords.map(({ masu, masuReading, transitive, english, ...word }) => word),
      reviewWordIds: reviewWords.map((word) => word.id),
      lexiconWordIds: lexiconWords.map((word) => word.id),
      cards,
    };
  }

  for (const word of unit.newWords) {
    cards.push(buildFirstIntroCard(unit, word, cards.length + 1, knownSoFar));
    knownSoFar.push(word);
  }

  for (const word of unit.newWords) {
    cards.push(buildIntroCard(unit, word, cards.length + 1, pools));
  }

  while (cards.length < 32) {
    cards.push(buildMixCard(unit, cards.length + 1, pools));
  }

  for (const dueWord of reviewWords) {
    if (cards.length >= targetCardCount) break;
    cards.push(buildReviewCard(unit, cards.length + 1, dueWord, pools));
  }

  while (cards.length < targetCardCount) {
    const dueWord = reviewWords.length > 0 ? reviewWords[cards.length % reviewWords.length] : unit.newWords[cards.length % unit.newWords.length];
    cards.push(buildReviewCard(unit, cards.length + 1, dueWord, pools));
  }

  balanceCurrentExposure(unit, cards, pools);
  forceReviewCoverage(unit, cards, reviewWords, pools);
  balanceCurrentExposure(unit, cards, pools, forcedReviewIndexes(cards, reviewWords));
  forceReviewCoverage(unit, cards, reviewWords, pools);
  repairDuplicateJapaneseLines(unit, cards, pools, reviewWords);
  replaceRemainingDuplicateJapaneseLines(unit, cards, pools);
  dedupeCards(unit, cards);

  return {
    id: unit.id,
    slug: unit.slug,
    title: unit.title,
    grammarFocus: unit.grammarFocus,
    newWords: unit.newWords.map(({ masu, masuReading, transitive, english, ...word }) => word),
    reviewWordIds: reviewWords.map((word) => word.id),
    lexiconWordIds: lexiconWords.map((word) => word.id),
    cards,
  };
}

function normalizeKey(text) {
  return String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()（）]/g, "");
}

function slugify(text) {
  return String(text)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function wordIdFromEntry(entry, usedIds) {
  const base =
    slugify(entry.romaji)
      .replace(/^go$/, "go_language")
      .replace(/^san$/, "san_number")
      .replace(/^ni$/, "ni_number") || `starter_${entry.order}`;
  let candidate = base;
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${base}_${suffix}`;
    suffix += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

function classifyIndexEntry(entry, id) {
  const teaching = teachingWords[id];
  if (!teaching?.function) throw new Error(`Review teaching metadata for ${id} before generating sentences`);
  return teaching.function;
}

const phraseMeaningByRomaji = new Map(
  Object.entries({
    aruite: "on foot; by walking",
    "ii desu ne": "That's nice, isn't it?",
    "ikura desu ka": "How much is it?",
    itadakimasu: "said before eating",
    "itsu de mo iidesu": "Anytime is fine",
    irasshai: "Welcome",
    irasshaimase: "Welcome",
    "oikutsu desu ka": "How old are you?",
    "osaki ni shitsureeshimasu": "Excuse me for leaving first",
    ojamashimasu: "Excuse me for coming in",
    otsukaresama: "Thank you for your hard work",
    onegaishimasu: "Please; I would appreciate it",
    "ohayoo gozaimasu": "Good morning",
    omedetoo: "Congratulations",
    kanpai: "Cheers",
    "ki o tsukete": "Take care",
    kudasai: "please give me; please do",
    "kekkoo desu": "No thank you; that's fine",
    "koo yatte": "like this; this way",
    gochisoosama: "said after eating",
    gomenkudasai: "Excuse me; is anyone home?",
    konnichiwa: "Hello",
    konbanwa: "Good evening",
    sayoonara: "Goodbye",
    shitsureeshimasu: "Excuse me",
    mata: "See you",
    sumimasen: "Excuse me; sorry",
    "soo desu ka": "Is that so?",
    "soo desu ne": "That's right; let me see",
    "tanoshimi desu": "I'm looking forward to it",
    "doozo": "Please; here you are",
    "doozo agatte kudasai": "Please come in",
    "doozo yoroshiku": "Nice to meet you",
    "doozo yoroshiku onegaishimasu": "Please treat me well; nice to meet you",
    "doo deshita ka": "How was it?",
    "doomo arigatoo gozaimasu": "Thank you very much",
    "doko nimo ikimasendeshita": "I didn't go anywhere",
    "dochira kara": "Where are you from?",
    "nani mo shimasendeshita": "I didn't do anything",
    hajimemashite: "How do you do?; nice to meet you",
    "benkyoo-chuu": "studying; in the middle of studying",
    "mata kondo": "Maybe another time",
    "moo ichido": "One more time",
    "moo sukoshi": "A little more",
    moshimoshi: "Hello, on the phone",
    wakarimashita: "I understand",
    wakarimasen: "I don't understand",
  }),
);

function meaningFromEntry(entry) {
  const normalizedRomaji = String(entry.romaji ?? "").trim().toLowerCase();
  const mappedPhraseMeaning = phraseMeaningByRomaji.get(normalizedRomaji);
  if (mappedPhraseMeaning) return mappedPhraseMeaning;

  const cleaned = entry.meaning
    .replace(/^phrase:\s*/i, "")
    .replace(/\s*<[^>]+>/g, "")
    .replace(/\s*\(Japanese scripts\)/gi, "")
    .replace(/\s*～/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned) return cleaned;
  return entry.meaning.replace(/[<>]/g, "").trim() || entry.romaji;
}

function wordFromIndexEntry(entry, usedIds) {
  const id = wordIdFromEntry(entry, usedIds);
  const fn = classifyIndexEntry(entry, id);
  const meaning = teachingWords[id].meaning;
  const surface = teachingWords[id].surface;
  const reading = teachingWords[id].reading;
  const extra = {};
  if (["boku", "watashi"].includes(entry.romaji.toLowerCase()) || /^i\/me$/i.test(meaning)) extra.english = "I";
  if (["anata"].includes(entry.romaji.toLowerCase()) || /^you$/i.test(meaning)) extra.english = "you";
  if (fn === "verb") {
    return verb(id, surface, reading, meaning.replace(/^to\s+/i, ""), surface, reading, isIndexVerbTransitive(entry, meaning));
  }
  return w(id, surface, reading, meaning, fn, extra);
}

function isIndexVerbTransitive(entry, meaning) {
  const romaji = String(entry.romaji ?? "").toLowerCase();
  const text = String(meaning ?? "").toLowerCase();
  if (/^(kakimasu|yomimasu|kikimasu|mimasu|kaimasu|tsukaimasu|erabimasu|tabemasu|nomimasu|benkyooshimasu)$/.test(romaji)) return true;
  if (/\b(write|read|listen|watch|buy|use|choose|eat|drink|study)\b/.test(text)) return true;
  return false;
}

const supplementalTopicBuckets = [
  { key: "classroom-language", title: "Classroom Language Expansion", lessons: [1, 2] },
  { key: "introductions-family", title: "Introductions And Family Expansion", lessons: [3, 4] },
  { key: "food-restaurants", title: "Food And Restaurants Expansion", lessons: [5, 6] },
  { key: "home-routines", title: "Home And Daily Routines Expansion", lessons: [7, 8, 9] },
  { key: "plans-hobbies-culture", title: "Plans, Hobbies, And Culture Expansion", lessons: [10, 11, 12] },
  { key: "town-transport", title: "Town And Transport Expansion", lessons: [13, 14] },
  { key: "shopping-clothes", title: "Shopping And Clothes Expansion", lessons: [15, 16] },
  { key: "free-time-travel", title: "Free Time And Travel Expansion", lessons: [17, 18] },
];

function supplementalTopicForLesson(lesson) {
  return supplementalTopicBuckets.find((bucket) => bucket.lessons.includes(Number(lesson)));
}

function balancedChunks(words, maximumSize = 13) {
  if (words.length === 0) return [];
  const chunkCount = Math.ceil(words.length / maximumSize);
  const baseSize = Math.floor(words.length / chunkCount);
  let largerChunkCount = words.length % chunkCount;
  const chunks = [];
  let start = 0;

  for (let index = 0; index < chunkCount; index += 1) {
    const chunkSize = baseSize + (largerChunkCount > 0 ? 1 : 0);
    chunks.push(words.slice(start, start + chunkSize));
    start += chunkSize;
    largerChunkCount -= 1;
  }

  return chunks;
}

function supplementalUnitTitle(topic, indexInTopic, totalInTopic, unitId) {
  const suffix = totalInTopic > 1 ? ` ${indexInTopic + 1}` : "";
  return `Unit ${unitId}: ${topic.title}${suffix}`;
}

async function appendFullStarterIndexUnits() {
  const sourceBank = await readJson("data/jp/curriculum/source/marugoto_starter_index_words.json");
  const functionWords = await readJson("data/jp/curriculum/function_words.json");
  const grammarTokens = await readJson("data/jp/curriculum/grammar_tokens.json");
  const nonSrsTokenSurfaces = new Set([...functionWords, ...grammarTokens].map((word) => normalizeKey(word.surface)));
  const coreSurfaceKeys = new Set(units.flatMap((unit) => unit.newWords.map((word) => normalizeKey(word.surface))));
  const coreRomajiKeys = new Set([...units.flatMap((unit) => unit.newWords.map((word) => word.id)), "eego", "kakimasu", "yomimasu", "wakarimasu"]);
  const usedIds = new Set(units.flatMap((unit) => unit.newWords.map((word) => word.id)));
  const extraWords = [];

  for (const entry of sourceBank.entries ?? []) {
    if (!entry.surface || !entry.romaji || !entry.meaning) continue;
    if (entry.scriptOnly) continue;
    if (/[〜～]/.test(entry.surface)) continue;
    if (/^phrase:\s*/i.test(entry.meaning) && !phraseMeaningByRomaji.has(String(entry.romaji).trim().toLowerCase())) continue;
    if (coreRomajiKeys.has(String(entry.romaji).trim().toLowerCase())) continue;
    if (coreSurfaceKeys.has(normalizeKey(entry.surface))) continue;
    if (nonSrsTokenSurfaces.has(normalizeKey(entry.surface))) continue;
    const word = wordFromIndexEntry(entry, usedIds);
    word.sourceLesson = entry.lesson;
    word.scriptOnly = entry.scriptOnly;
    extraWords.push(word);
  }

  const chunks = [];
  const fallbackTopic = { key: "starter-index", title: "Starter Index Expansion", lessons: [] };
  for (const topic of supplementalTopicBuckets) {
    const topicWords = extraWords.filter((word) => supplementalTopicForLesson(word.sourceLesson)?.key === topic.key);
    for (const chunk of balancedChunks(topicWords, 13)) chunks.push({ topic, words: chunk });
  }
  const unbucketedWords = extraWords.filter((word) => !supplementalTopicForLesson(word.sourceLesson));
  for (const chunk of balancedChunks(unbucketedWords, 13)) chunks.push({ topic: fallbackTopic, words: chunk });

  let unitId = units.length + 1;
  const topicUnitCounts = new Map();
  const topicUnitIndexes = new Map();
  for (const chunk of chunks) {
    topicUnitCounts.set(chunk.topic.key, (topicUnitCounts.get(chunk.topic.key) ?? 0) + 1);
  }

  for (const { topic, words: rawChunk } of chunks) {
    const chunk = rawChunk.map(({ sourceLesson, scriptOnly, ...word }) => word);
    const topicIndex = topicUnitIndexes.get(topic.key) ?? 0;
    topicUnitIndexes.set(topic.key, topicIndex + 1);
    units.push({
      id: unitId,
      slug: `starter-full-index-${String(unitId).padStart(2, "0")}`,
      title: supplementalUnitTitle(topic, topicIndex, topicUnitCounts.get(topic.key) ?? 1, unitId),
      grammarFocus: `${topic.title}: full Starter index vocabulary with bold cumulative review`,
      newWords: chunk,
    });
    unitId += 1;
  }

  return {
    sourceEntries: sourceBank.dedupedEntryCount,
    supplementalWords: extraWords.length,
    supplementalUnits: chunks.length,
  };
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const fullStarterCoverage = await appendFullStarterIndexUnits();
const existingSource = await readJson("data/jp/curriculum/source/unit_specs.json");
const specialUnits = existingSource.units.filter((unit) => unit.kind === "kana" || unit.kind === "kanji");
const sourceUnits = [
  ...units.map((unit) => ({
    id: unit.id,
    slug: unit.slug,
    title: unit.title,
    grammarFocus: unit.grammarFocus,
    newWords: unit.newWords.map(({ masu, masuReading, transitive, english, ...word }) => word),
  })),
  ...specialUnits,
];

const source = {
  ...existingSource,
  description:
    "Source curriculum plan for generated Kotoba units. A1 is a Marugoto Starter-inspired rebuild that covers the full Activities vocabulary and phrase indexes; unit JSON cards are build artifacts derived from this plan plus generation rules.",
  units: sourceUnits,
};

const index = {
  language: "jp",
  units: [
    ...units.map((unit) => ({
      id: unit.id,
      slug: unit.slug,
      title: unit.title,
      grammarFocus: unit.grammarFocus,
      path: `data/jp/curriculum/units/unit_${String(unit.id).padStart(3, "0")}.json`,
    })),
    ...specialUnits.map((unit) => ({
      id: unit.id,
      slug: unit.slug,
      title: unit.title,
      grammarFocus: unit.grammarFocus,
      path: `data/jp/curriculum/units/unit_${String(unit.id).padStart(3, "0")}.json`,
      kind: unit.kind,
    })),
  ],
};

const courseLevels = await readJson("data/jp/curriculum/course_levels.json");
const a1End = units.at(-1).id;
const remainingPlannedUnits = 96 - a1End;
const a2Length = Math.ceil(remainingPlannedUnits * 0.4);
const b1Length = Math.ceil((remainingPlannedUnits - a2Length) / 2);
const adjustedRanges = {
  A1: [1, a1End],
  A2: [a1End + 1, a1End + a2Length],
  B1: [a1End + a2Length + 1, a1End + a2Length + b1Length],
  B2: [a1End + a2Length + b1Length + 1, 96],
};
const updatedCourseLevels = {
  ...courseLevels,
  levels: courseLevels.levels.map((level) =>
    level.code === "A1"
      ? {
          ...level,
          unitStart: adjustedRanges.A1[0],
          unitEnd: adjustedRanges.A1[1],
          title: "Marugoto Starter Foundations",
          canDoSummary:
            "Handle Starter A1 scenes across the full Activities vocabulary and phrase indexes: classroom Japanese, introductions, family, food, home, routines, hobbies, town, travel, shopping, numbers, and social phrases.",
        }
      : adjustedRanges[level.code]
        ? {
            ...level,
            unitStart: adjustedRanges[level.code][0],
            unitEnd: adjustedRanges[level.code][1],
          }
      : level,
  ),
};

for (const unit of units) {
  const authored = buildUnit(unit);
  const reviewed = repairStarterUnit(authored, allWordsUntil(unit.id)).unit;
  await writeJson(`data/jp/curriculum/units/unit_${String(unit.id).padStart(3, "0")}.json`, reviewed);
}

await writeJson("data/jp/curriculum/source/unit_specs.json", source);
await writeJson("data/jp/curriculum/unit_index.json", index);
await writeJson("data/jp/curriculum/course_levels.json", updatedCourseLevels);

console.log(
  `Rebuilt Units 1-${a1End} as a full Marugoto Starter-inspired A1 level (${fullStarterCoverage.supplementalWords} supplemental index words in ${fullStarterCoverage.supplementalUnits} added units).`,
);
