import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewTag = "early masu action preview";
const previewTagsToReplace = new Set([previewTag, "early V\u307e\u3059 action preview"]);

function pad(value) {
  return String(value).padStart(3, "0");
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function token(surface, reading, explain, wordId) {
  return {
    surface,
    reading,
    explain,
    ...(wordId ? { wordId } : {}),
  };
}

function word(lexicon, id) {
  const entry = lexicon.get(id);
  if (!entry) throw new Error(`Missing word ${id}`);
  return token(entry.surface, entry.reading, entry.meaning, id);
}

function grammar(surface, reading, explain) {
  return token(surface, reading, explain);
}

function card(unitId, index, parts, english, tags = []) {
  return {
    id: `u${pad(unitId)}-c${pad(index)}`,
    line: parts.map((part) => part.surface),
    tts: parts.map((part) => part.reading),
    explain: parts.map((part) => part.explain),
    tokens: parts,
    english,
    fact: "`ます`-family endings make actions polite. For now, treat this as one complete action sentence.",
    grammarTags: [previewTag, ...tags],
  };
}

function reindex(unitId, cards) {
  return cards.map((entry, index) => ({
    ...entry,
    id: `u${pad(unitId)}-c${pad(index + 1)}`,
  }));
}

function makePreviews(unitId, lexicon) {
  const w = (id) => word(lexicon, id);
  const g = grammar;
  const masu = {
    eat: g("\u98df\u3079\u307e\u3059", "\u305f\u3079\u307e\u3059", "eat; will eat"),
    drink: g("\u98f2\u307f\u307e\u3059", "\u306e\u307f\u307e\u3059", "drink; will drink"),
    go: g("\u884c\u304d\u307e\u3059", "\u3044\u304d\u307e\u3059", "go; will go"),
    come: g("\u6765\u307e\u3059", "\u304d\u307e\u3059", "come; will come"),
    read: g("\u8aad\u307f\u307e\u3059", "\u3088\u307f\u307e\u3059", "read; will read"),
    write: g("\u66f8\u304d\u307e\u3059", "\u304b\u304d\u307e\u3059", "write; will write"),
    see: g("\u898b\u307e\u3059", "\u307f\u307e\u3059", "look; see; watch"),
    listen: g("\u805e\u304d\u307e\u3059", "\u304d\u304d\u307e\u3059", "listen; ask"),
    speak: g("\u8a71\u3057\u307e\u3059", "\u306f\u306a\u3057\u307e\u3059", "speak"),
    work: g("\u50cd\u304d\u307e\u3059", "\u306f\u305f\u3089\u304d\u307e\u3059", "work"),
    study: g("\u52c9\u5f37\u3057\u307e\u3059", "\u3079\u3093\u304d\u3087\u3046\u3057\u307e\u3059", "study"),
    returnHome: g("\u5e30\u308a\u307e\u3059", "\u304b\u3048\u308a\u307e\u3059", "return; go home"),
    buy: g("\u8cb7\u3044\u307e\u3059", "\u304b\u3044\u307e\u3059", "buy"),
    use: g("\u4f7f\u3044\u307e\u3059", "\u3064\u304b\u3044\u307e\u3059", "use"),
    wait: g("\u5f85\u3061\u307e\u3059", "\u307e\u3061\u307e\u3059", "wait"),
    ate: g("\u98df\u3079\u307e\u3057\u305f", "\u305f\u3079\u307e\u3057\u305f", "ate"),
    drank: g("\u98f2\u307f\u307e\u3057\u305f", "\u306e\u307f\u307e\u3057\u305f", "drank"),
    went: g("\u884c\u304d\u307e\u3057\u305f", "\u3044\u304d\u307e\u3057\u305f", "went"),
    came: g("\u6765\u307e\u3057\u305f", "\u304d\u307e\u3057\u305f", "came"),
    readPast: g("\u8aad\u307f\u307e\u3057\u305f", "\u3088\u307f\u307e\u3057\u305f", "read"),
    wrote: g("\u66f8\u304d\u307e\u3057\u305f", "\u304b\u304d\u307e\u3057\u305f", "wrote"),
    worked: g("\u50cd\u304d\u307e\u3057\u305f", "\u306f\u305f\u3089\u304d\u307e\u3057\u305f", "worked"),
    studied: g("\u52c9\u5f37\u3057\u307e\u3057\u305f", "\u3079\u3093\u304d\u3087\u3046\u3057\u307e\u3057\u305f", "studied"),
  };
  const p = {
    wa: g("\u306f", "\u308f", "topic marker"),
    ga: g("\u304c", "\u304c", "subject marker"),
    wo: g("\u3092", "\u3092", "direct object marker"),
    ni: g("\u306b", "\u306b", "destination marker"),
    de: g("\u3067", "\u3067", "action location marker"),
    ka: g("\u304b", "\u304b", "question marker"),
    q: g("\uff1f", "\uff1f", "question mark"),
    na: g("\u306a", "\u306a", "links a na-adjective to a noun"),
    no: g("\u306e", "\u306e", "links a noun-like word to a noun"),
  };

  const plans = {
    1: [
      [[w("watashi"), p.wa, masu.eat], "I eat"],
      [[w("sakura"), p.wa, masu.drink], "You drink"],
      [[w("yuki"), p.wa, masu.read], "He reads"],
      [[w("tanaka"), p.wa, masu.write], "She writes"],
      [[w("gakusei"), p.wa, masu.eat], "The student eats"],
      [[w("sensei"), p.wa, masu.read], "The teacher reads"],
      [[w("tomodachi"), p.wa, masu.come], "The friend comes"],
      [[w("watashi"), p.wa, masu.go], "I go"],
      [[w("sakura"), p.wa, masu.listen], "You listen"],
      [[w("yuki"), p.wa, masu.speak], "He speaks"],
      [[w("tanaka"), p.wa, masu.see], "She looks"],
      [[w("sensei"), p.wa, masu.study], "The teacher studies"],
    ],
    2: [
      [[w("sensei"), p.wa, masu.eat], "The teacher eats"],
      [[w("gakusei"), p.wa, masu.read], "The student reads"],
      [[w("neko"), p.wa, masu.eat], "The cat eats"],
      [[w("inu"), p.wa, masu.drink], "The dog drinks"],
      [[w("hon"), p.wo, masu.read], "I read a book"],
      [[w("gakkou"), p.ni, masu.go], "I go to school"],
      [[w("ie"), p.ni, masu.returnHome], "I go home"],
      [[w("isha"), p.wa, masu.work], "The doctor works"],
      [[w("sensei"), p.wa, masu.write], "The teacher writes"],
      [[w("gakusei"), p.wa, masu.study], "The student studies"],
      [[w("neko"), p.wo, masu.see], "I look at the cat"],
      [[w("inu"), p.wo, masu.see], "I look at the dog"],
    ],
    3: [
      [[w("haha"), p.wa, masu.eat], "My mother eats"],
      [[w("chichi"), p.wa, masu.drink], "My father drinks"],
      [[w("ane"), p.wa, masu.read], "My older sister reads"],
      [[w("otouto"), p.wa, masu.write], "My younger brother writes"],
      [[w("kazoku"), p.wa, masu.come], "My family comes"],
      [[w("shashin"), p.wo, masu.see], "I look at the photo"],
      [[w("kaban"), p.wo, masu.use], "I use the bag"],
      [[w("kuruma"), p.wo, masu.see], "I look at the car"],
      [[w("heya"), p.de, masu.study], "I study in the room"],
      [[w("kagi"), p.wo, masu.use], "I use the key"],
      [[w("haha"), p.wa, masu.listen], "My mother listens"],
      [[w("chichi"), p.wa, masu.speak], "My father speaks"],
    ],
    4: [
      [[w("mise"), p.ni, masu.go], "I go to the shop"],
      [[w("byouin"), p.ni, masu.go], "I go to the hospital"],
      [[w("eki"), p.de, masu.wait], "I wait at the station"],
      [[w("kaisha"), p.de, masu.work], "I work at the company"],
      [[w("kaishain"), p.wa, masu.work], "The company employee works"],
      [[w("kodomo"), p.wa, masu.come], "The child comes"],
      [[w("otona"), p.wa, masu.go], "The adult goes"],
      [[w("isu"), p.wo, masu.use], "I use the chair"],
      [[w("tsukue"), p.de, masu.write], "I write at the desk"],
      [[w("jitensha"), p.wo, masu.use], "I use the bicycle"],
      [[w("mise"), p.de, masu.buy], "I buy at the shop"],
      [[w("byouin"), p.de, masu.wait], "I wait at the hospital"],
    ],
    5: [
      [[w("kinou"), masu.ate], "I ate yesterday"],
      [[w("sengetsu"), w("ryokou"), p.ni, masu.went], "I went on a trip last month"],
      [[w("kinou"), masu.drank], "I drank yesterday"],
      [[w("asa"), masu.readPast], "I read in the morning"],
      [[w("yoru"), masu.wrote], "I wrote at night"],
      [[w("kinou"), masu.worked], "I worked yesterday"],
      [[w("sengetsu"), masu.studied], "I studied last month"],
      [[w("kyonen"), masu.came], "I came last year"],
      [[w("yasumi"), p.ni, masu.went], "I went on the day off"],
      [[w("shigoto"), p.ni, masu.went], "I went to work"],
      [[w("tesuto"), p.de, masu.wrote], "I wrote on the test"],
      [[w("tanjoubi"), p.ni, masu.came], "I came on the birthday"],
    ],
    6: [
      [[w("mizu"), p.wo, masu.drink], "I drink water"],
      [[w("ocha"), p.wo, masu.drink], "I drink tea"],
      [[w("enpitsu"), p.de, masu.write], "I write with a pencil"],
      [[w("tokei"), p.wo, masu.see], "I look at the clock"],
      [[w("kore"), p.wo, masu.use], "I use this one"],
      [[w("sore"), p.wo, masu.see], "I look at that one near you"],
      [[w("are"), p.wo, masu.see], "I look at that one over there"],
      [[w("kono"), w("hon"), p.wo, masu.read], "I read this book"],
      [[w("sono"), w("hon"), p.wo, masu.read], "I read that book near you"],
      [[w("ano"), w("hon"), p.wo, masu.read], "I read that book over there"],
      [[w("mizu"), p.wo, masu.buy], "I buy water"],
      [[w("ocha"), p.wo, masu.buy], "I buy tea"],
    ],
    7: [
      [[w("tabemono"), p.wo, masu.eat], "I eat food"],
      [[w("nomimono"), p.wo, masu.drink], "I drink a beverage"],
      [[w("nan"), p.wo, masu.eat, p.ka, p.q], "What do I eat?"],
      [[w("dare"), p.ga, masu.come, p.ka, p.q], "Who comes?"],
      [[w("dore"), p.wo, masu.use, p.ka, p.q], "Which one do I use?"],
      [[w("dono"), w("hon"), p.wo, masu.read, p.ka, p.q], "Which book do I read?"],
      [[w("otokonohito"), p.wa, masu.eat], "The man eats"],
      [[w("onnanohito"), p.wa, masu.drink], "The woman drinks"],
      [[w("tenin"), p.wa, masu.speak], "The shop clerk speaks"],
      [[w("ekiin"), p.wa, masu.listen], "The station attendant listens"],
      [[w("tabemono"), p.wo, masu.buy], "I buy food"],
      [[w("nomimono"), p.wo, masu.buy], "I buy a beverage"],
    ],
    8: [
      [[w("kyou"), masu.go], "I go today"],
      [[w("ashita"), masu.come], "I come tomorrow"],
    ],
    9: [
      [[w("umi"), p.ni, masu.go], "I go to the sea"],
      [[w("yama"), p.ni, masu.go], "I go to the mountain"],
    ],
    10: [
      [[w("ookii"), w("hon"), p.wo, masu.read], "I read a big book"],
      [[w("atarashii"), w("hon"), p.wo, masu.read], "I read a new book"],
    ],
    11: [
      [[w("oishii"), w("tabemono"), p.wo, masu.eat], "I eat delicious food"],
      [[w("muzukashii"), w("hon"), p.wo, masu.read], "I read a difficult book"],
    ],
    12: [
      [[w("shizuka"), p.na, w("heya"), p.de, masu.read], "I read in a quiet room"],
      [[w("nigiyaka"), p.na, w("machi"), p.ni, masu.go], "I go to a lively town"],
    ],
    13: [
      [[w("tokubetsu"), p.na, w("ryokou"), p.ni, masu.go], "I go on a special trip"],
      [[w("futsuu"), p.no, w("mizu"), p.wo, masu.drink], "I drink ordinary water"],
    ],
    14: [
      [[w("sukoshi"), masu.eat], "I eat a little"],
      [[w("chotto"), masu.drink], "I drink a little"],
    ],
  };

  return (plans[unitId] ?? []).map(([parts, english], index) => card(unitId, index + 1, parts, english, ["V\u307e\u3059 preview"]));
}

const index = await readJson("data/jp/curriculum/unit_index.json");
const lexicon = new Map();
const units = [];

for (const entry of index.units) {
  const unit = await readJson(entry.path);
  units.push({ entry, unit });
  for (const wordEntry of unit.newWords) {
    lexicon.set(wordEntry.id, wordEntry);
  }
}

for (const { entry, unit } of units) {
  const previews = makePreviews(unit.id, lexicon);
  if (previews.length === 0) continue;

  const baseCards = unit.cards.filter((existingCard) => !(existingCard.grammarTags ?? []).some((tag) => previewTagsToReplace.has(tag)));
  const insertAt = Math.min(20, baseCards.length);
  const previewBlock = previews.map((preview) => ({ ...preview }));
  const cards = reindex(unit.id, [
    ...baseCards.slice(0, insertAt),
    ...previewBlock,
    ...baseCards.slice(insertAt),
  ]);

  await writeJson(entry.path, {
    ...unit,
    cards,
  });
}

console.log("Added A1 early action preview cards.");
