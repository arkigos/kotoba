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
    fact: "`ます` makes an action polite. For now, treat this as one complete action sentence.",
    grammarTags: [previewTag, ...tags],
  };
}

function makePreviews(unitId, lexicon) {
  const w = (id) => word(lexicon, id);
  const g = grammar;
  const masu = {
    eat: g("食べます", "たべます", "eat; will eat"),
    drink: g("飲みます", "のみます", "drink; will drink"),
    go: g("行きます", "いきます", "go; will go"),
    come: g("来ます", "きます", "come; will come"),
    read: g("読みます", "よみます", "read; will read"),
    write: g("書きます", "かきます", "write; will write"),
    see: g("見ます", "みます", "look; see; watch"),
    listen: g("聞きます", "ききます", "listen; ask"),
    speak: g("話します", "はなします", "speak"),
    work: g("働きます", "はたらきます", "work"),
    study: g("勉強します", "べんきょうします", "study"),
  };
  const p = {
    wa: g("は", "わ", "topic marker"),
    to: g("と", "と", "and; with"),
    wo: g("を", "を", "direct object marker"),
    ni: g("に", "に", "destination marker"),
    de: g("で", "で", "action location marker"),
    ka: g("か", "か", "question marker"),
    na: g("な", "な", "links a na-adjective to a noun"),
    no: g("の", "の", "links a noun-like word to a noun"),
  };

  const plans = {
    2: [
      [[w("sensei"), p.to, w("gakusei"), p.wa, masu.eat], "The teacher and student eat"],
      [[w("sakura"), p.to, w("yuki"), p.wa, masu.read], "Sakura and Yuki read"],
    ],
    3: [
      [[w("haha"), p.to, w("chichi"), p.wa, masu.come], "Mother and father come"],
      [[w("ane"), p.to, w("otouto"), p.wa, masu.eat], "Older sister and younger brother eat"],
    ],
    4: [
      [[w("isha"), p.wa, masu.come], "The doctor comes"],
      [[w("kaishain"), p.wa, masu.work], "The company employee works"],
    ],
    5: [
      [[w("asa"), masu.eat], "I eat in the morning"],
      [[w("yoru"), masu.drink], "I drink at night"],
    ],
    6: [
      [[w("mizu"), p.wo, masu.drink], "I drink water"],
      [[w("ocha"), p.wo, masu.drink], "I drink tea"],
    ],
    7: [
      [[w("tabemono"), p.wo, masu.eat], "I eat food"],
      [[w("nomimono"), p.wo, masu.drink], "I drink a drink"],
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

  return (plans[unitId] ?? []).map(([parts, english], index) => card(unitId, index + 1, parts, english, ["Vます preview"]));
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
  const appendedPreviews = previews.map((preview, offset) => ({
    ...preview,
    id: `u${pad(unit.id)}-c${pad(baseCards.length + offset + 1)}`,
  }));

  await writeJson(entry.path, {
    ...unit,
    cards: [...baseCards, ...appendedPreviews],
  });
}

console.log("Added A1 early action preview cards.");
