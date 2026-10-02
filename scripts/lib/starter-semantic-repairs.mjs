/**
 * Reviewed corrections for the legacy Starter authoring pipeline.
 * Imported noun/POS labels do not license sentence slots. Keep learning IDs and
 * card positions, and give these senses explicit, ordinary sentence contexts.
 * The runtime procedural engine has its own reviewed lexical-sense contract.
 */
import { repairStarterContent } from "./starter-content-quality.mjs";
const word = (fn, meaning, surface, reading = surface) => ({ function: fn, meaning, ...(surface ? { surface, reading } : {}) });
export const reviewedStarterWords = {
  hai: word("phrase", "yes"),
  ichido: word("adverb", "once"),
  pea: word("noun", "pair"),
  "oshigoto-shigoto": word("noun", "job", "おしごと"),
  kankokugo: word("noun", "Korean", "かんこくご"),
  kankokujin: word("person", "Korean person", "かんこくじん"),
  otto: word("person", "husband", "おっと"),
  tsuma: word("person", "wife", "つま"),
  tookyoo: word("place", "Tokyo", "とうきょう"),
  "asa-gohan": word("noun", "breakfast"),
  "ocha-cha": word("noun", "tea", "おちゃ"),
  koocha: word("noun", "black tea", "こうちゃ"),
  tabemono: word("noun", "food"),
  nomimono: word("noun", "drink"),
  aisu: word("noun", "iced", "アイス", "あいす"),
  hotto: word("noun", "hot", "ホット", "ほっと"),
  "hyaku-byaku-pyaku": word("quantity", "hundred", "ひゃく"),
  "sen-zen": word("quantity", "thousand", "せん"),
  man: word("quantity", "ten thousand", "まん"),
  dame: word("adjective", "not allowed", "だめ"),
  "zannen-na": word("adjective", "disappointing", "ざんねん"),
  "benri-na": word("adjective", "convenient", "べんり"),
  "raku-na": word("adjective", "easy", "らく"),
  "oshare-na": word("adjective", "stylish", "おしゃれ"),
  "nihonteki-na": word("adjective", "typically Japanese", "にほんてき"),
  "maamaa-na": word("adjective", "okay", "まあまあ"),
  "daijoobu-na": word("adjective", "okay", "だいじょうぶ"),
  muryoo: word("adjective", "free of charge", "むりょう"),
  ikura: word("adverb", "how much"),
  "doo-yatte": word("adverb", "how"),
  soto: word("adverb", "outside"),
  tokidoki: word("adverb", "sometimes"),
  ima: word("time", "now"),
  ushiro: word("adverb", "behind"),
  mae: word("adverb", "in front"),
  migi: word("adverb", "right"),
  hidari: word("adverb", "left"),
  soshite: word("adverb", "and then"),
  "uun-uun": word("phrase", "hmm", "うーん"),
  waa: word("phrase", "wow", "わあ"),
  esu: word("noun", "S", "Ｓ", "えす"),
  emu: word("noun", "M", "Ｍ", "えむ"),
  eru: word("noun", "L", "Ｌ", "える"),
  orenji: word("noun", "orange"),
  kiiro: word("noun", "yellow"),
  guree: word("noun", "gray"),
  pinku: word("noun", "pink"),
  midori: word("noun", "green"),
  hoka: word("noun", "other"),
  "osake-sake": word("noun", "sake", "おさけ"),
  kono: word("adverb", "this"), ano: word("adverb", "that"), donna: word("adverb", "what kind of"),
  dare: word("adverb", "who"), doko: word("adverb", "where"), "nani-nan": word("adverb", "what", "何", "なん"),
  ikutsu: word("adverb", "how many"), "nan-ji": word("time", "what time", "何時", "なんじ"), itsu: word("time", "when"),
  chikaku: word("adverb", "nearby"), ue: word("adverb", "above"), shita: word("adverb", "under"), naka: word("adverb", "inside"), yoko: word("adverb", "beside"), tonari: word("adverb", "next to"),
  koko: word("adverb", "here"), kochira: word("adverb", "this way"), kore: word("noun", "this"), are: word("noun", "that"),
  futari: word("quantity", "two people", "二人", "ふたり"),
  doomo: word("adverb", "very much"),
  tenisu: word("noun", "tennis"),
  wanpiisu: word("noun", "dress"),
  okyakusan: word("person", "customer", "おきゃくさん"),
  kinou: word("time", "yesterday"), kinoo: word("time", "yesterday"), senshuu: word("time", "last week"), kyonen: word("time", "last year"),
  tabun: word("adverb", "probably"), mochiron: word("adverb", "of course"),
  dochira: word("adverb", "which"), doo: word("adverb", "how"),
  "massugu-na": word("adverb", "straight", "まっすぐ"),
  jaa: word("adverb", "then"), motto: word("adverb", "more"), tsugi: word("noun", "next"),
};

export const colorSenseIds = new Set(["orenji", "kiiro", "guree", "pinku", "midori"]);
const sizeIds = new Set(["esu", "emu", "eru"]);
const numberIds = new Set(["hyaku-byaku-pyaku", "sen-zen", "man"]);
const directionEnglish = { migi: "on the right", hidari: "on the left", mae: "in front", ushiro: "at the back", soto: "outside" };
const relativeLocations = { ue: "on", shita: "under", naka: "inside", yoko: "beside", tonari: "next to", chikaku: "near" };
const adjectiveSubjects = {
  "zannen-na": ["eiga", "paatii"], "benri-na": ["basu", "densha", "jitensha"],
  "raku-na": ["shigoto", "jugyou", "sanpo"], "oshare-na": ["baggu", "shatsu", "kimono"],
  "nihonteki-na": ["niwa", "ie"], "maamaa-na": ["ryoori", "eiga", "shigoto"],
  muryoo: ["konsaato", "ibento", "paatii", "matsuri"], "daijoobu-na": ["watashi", "kodomo"],
};
const foodIds = new Set(["asa-gohan", "tabemono"]);
const drinkIds = new Set(["ocha-cha", "koocha", "nomimono", "osake-sake"]);
const physicalIds = new Set([
  "isu", "teeburu", "beddo", "eakon", "piano", "gitaa", "taiko", "nimotsu", "iro", "saizu",
  "zasshi", "shinbun", "meeshi", "ankeeto", "sofa", "kappu", "tana", "ningyoo", "hako", "nikki", "burogu", "e_2", "shoosetsu", "haiku", "karendaa", "kuusha", "norimono", "baiku", "mimikaki", "risuto", "kooto", "pantsu", "hikooki", "omiyage-miyage", "thii-shatsu",
]);

export function reviewedSelectableObject(word) {
  return Boolean(word && physicalIds.has(word.id));
}

const particle = (surface, reading = surface, explain = "grammar") => ({ surface, reading, explain });
const wa = () => particle("は", "わ", "topic marker");
const wo = () => particle("を", "を", "object marker");
const ni = () => particle("に", "に", "location or destination marker");
const no = () => particle("の", "の", "noun modifier");
const desu = () => particle("です", "です", "polite ending");
const ka = () => particle("か", "か", "question marker");
const comma = () => particle("、", "、", "pause");
const cap = text => text.charAt(0).toUpperCase() + text.slice(1);
const plainMeaning = word => word.meaning.split(/[;,/]/)[0].trim();
const english = word => ({ watashi: "I", anata: "you", watashitachi: "we", boku: "I" })[word.id] ?? `the ${plainMeaning(word)}`;
const be = word => english(word) === "I" ? "am" : ["you", "we"].includes(english(word)) ? "are" : "is";
const third = word => !["I", "you", "we"].includes(english(word));
const token = (word, form) => ({ surface: form?.[0] ?? word.surface, reading: form?.[1] ?? word.reading, explain: word.meaning, wordId: word.id });
const realize = (card, tokens, english) => {
  const { audioRef, audioText, ...content } = card;
  return { ...content, tokens, line: tokens.map(t => t.surface), tts: tokens.map(t => t.reading), explain: tokens.map(t => t.explain), english: cap(english), grammarTags: [...new Set([...(card.grammarTags ?? []).filter(tag => tag !== "set phrase"), "reviewed context"])] };
};

// Alternatives change reviewed lexical bindings, not punctuation or filler.
// Only previously introduced helpers may be used. The target itself is retained.
function contextVariants(card, known) {
  const byId = new Map(known.map(entry => [entry.id, entry]));
  const options = ids => ids.map(id => byId.get(id)).filter(Boolean);
  const targetPart = card.tokens.find(part => directionEnglish[part.wordId] || relativeLocations[part.wordId] || adjectiveSubjects[part.wordId]);
  const variants = [];
  const add = (tokens, english) => variants.push(realize(card, tokens, english));
  if (targetPart) {
    const target = targetPart.wordId;
    if (relativeLocations[target]) {
      for (const location of options(target === "naka" ? ["hako", "ie", "heya"] : ["teeburu", "isu", "ie"])) {
        const thing = byId.get("kasa");
        if (thing) add([token(thing), wa(), token(location), no(), targetPart, desu()], `${english(thing)} is ${relativeLocations[target]} ${english(location)}`);
      }
    } else {
      for (const subject of options(adjectiveSubjects[target] ?? ["eki", "gakkou", "byouin", "resutoran"])) {
        add([token(subject), wa(), targetPart, desu()], `${english(subject)} ${be(subject)} ${directionEnglish[target] ?? reviewedStarterWords[target].meaning}`);
      }
    }
  }
  const wordIds = new Set(card.tokens.map(part => part.wordId));
  if (wordIds.has("doo-yatte") && wordIds.has("iku")) {
    const how = card.tokens.find(part => part.wordId === "doo-yatte");
    const verb = card.tokens.find(part => part.wordId === "iku");
    for (const actor of options(["anata", "sensei", "gakusei", "tomodachi"])) for (const destination of options(["eki", "gakkou", "byouin", "resutoran", "kouen"])) {
      add([token(actor), wa(), how, token(destination), ni(), verb, ka()], `How ${third(actor) ? "does" : "do"} ${english(actor)} go to ${english(destination)}?`);
    }
  }
  if (wordIds.has("en") && [...numberIds].some(id => wordIds.has(id)) && card.english.includes(" costs ")) {
    const choices = wordIds.has("hyaku-byaku-pyaku") ? ["pan", "koohii", "ocha", "mizu", "ehagaki", "hankachi"] : ["shatsu", "baggu", "kimono", "kasa", "jaketto"];
    for (const item of options(choices)) add([token(item), ...card.tokens.slice(1)], `${english(item)} costs ${card.english.split(" costs ")[1]}`);
  }
  if (wordIds.has("yomu") && ["ima", "tokidoki", "ichido"].some(id => wordIds.has(id))) {
    const time = card.tokens.find(part => ["ima", "tokidoki", "ichido"].includes(part.wordId));
    const verb = card.tokens.find(part => part.wordId === "yomu");
    for (const actor of options(["watashi", "anata", "gakusei", "sensei", "tomodachi"])) {
      for (const language of options(["nihongo", "eigo", "hiragana", "katakana", "kanji"])) {
        const name = ({ nihongo: "Japanese", eigo: "English" })[language.id] ?? plainMeaning(language);
        const meaning = time.wordId === "tokidoki" ? `${english(actor)} sometimes ${third(actor) ? "reads" : "read"} ${name}`
          : `${english(actor)} will read ${name} ${time.wordId === "ima" ? "now" : "once"}`;
        add([token(actor), wa(), time, token(language), wo(), verb], meaning);
      }
    }
  }
  if ((wordIds.has("hai") || wordIds.has("uun-uun")) && wordIds.has("wakaru")) {
    const response = card.tokens.find(part => ["hai", "uun-uun"].includes(part.wordId));
    const first = byId.get("watashi");
    const verb = card.tokens.find(part => part.wordId === "wakaru");
    for (const language of options(["nihongo", "eigo", "hiragana", "katakana", "kanji"])) {
      const languageName = ({ nihongo: "Japanese", eigo: "English" })[language.id] ?? plainMeaning(language);
      add([response, comma(), token(first), wa(), token(language), particle("が", "が", "subject marker"), verb], `${response.wordId === "hai" ? "Yes, I understand" : "Hmm, I do not understand"} ${languageName}`);
    }
  }
  if (wordIds.has("pea") && wordIds.has("hanasu")) {
    const pair = card.tokens.find(part => part.wordId === "pea");
    const verb = card.tokens.find(part => part.wordId === "hanasu");
    for (const language of options(["nihongo", "eigo"])) add([pair, particle("で", "で", "group arrangement"), token(language), wo(), verb], `We speak ${language.id === "nihongo" ? "Japanese" : "English"} in pairs`);
  }
  if (wordIds.has("oshigoto-shigoto")) {
    const job = card.tokens.find(part => part.wordId === "oshigoto-shigoto");
    for (const owner of options(["watashi", "anata", "gakusei", "sensei"])) {
      const possessive = owner.id === "watashi" ? "my" : owner.id === "anata" ? "your" : `${english(owner)}'s`;
      add([token(owner), no(), job, desu()], `It is ${possessive} job`);
    }
  }
  if (wordIds.has("au")) {
    const at = card.tokens.findIndex(part => part.surface === "に");
    const partner = card.tokens[at - 1];
    const verb = card.tokens.find(part => part.wordId === "au");
    const person = byId.get(partner?.wordId);
    if (person) for (const actor of options(["watashi", "anata", "gakusei", "sensei", "tomodachi"]).filter(actor => actor.id !== person.id)) add([token(actor), wa(), partner, ni(), verb], `${english(actor)} ${third(actor) ? "meets" : "meet"} ${english(person)}`);
  }
  if (wordIds.has("futari")) {
    const count = card.tokens.find(part => part.wordId === "futari");
    const verb = card.tokens.find(part => part.wordId === "iru");
    for (const person of options(["gakusei", "sensei", "kodomo"])) add([token(person), particle("が", "が", "subject marker"), count, verb], `There are two ${({ gakusei: "students", sensei: "teachers", kodomo: "children" })[person.id]}`);
  }
  if (wordIds.has("soshite")) {
    const conjunction = card.tokens.find(part => part.wordId === "soshite");
    const read = card.tokens.find(part => part.wordId === "yomu");
    const write = card.tokens.find(part => part.wordId === "kaku");
    for (const language of options(["nihongo", "eigo"])) for (const script of options(["hiragana", "katakana", "kanji"])) add([token(language), wo(), read, comma(), conjunction, token(script), wo(), write], `I read ${language.id === "nihongo" ? "Japanese" : "English"}. Then I write ${plainMeaning(script)}`);
  }
  return variants;
}

function preserveContextPacing(unit, cards, byId) {
  const currentIds = new Set((unit.newWords ?? []).map(word => word.id));
  const seenWords = new Set([...byId.keys()].filter(id => !currentIds.has(id)));
  const seenLines = new Set();
  const newIds = card => [...new Set(card.tokens.map(part => part.wordId).filter(id => id && currentIds.has(id) && !seenWords.has(id)))];
  return cards.map(card => {
    let selected = card;
    if (card.grammarTags?.includes("reviewed context") && (seenLines.has(card.line.join("")) || newIds(card).length > 1)) {
      const known = [...byId.values()].filter(word => seenWords.has(word.id));
      selected = contextVariants(card, known).find(candidate => !seenLines.has(candidate.line.join("")) && newIds(candidate).length <= 1) ?? card;
      if (selected === card) throw new Error(`Reviewed context ${card.id} needs another licensed variation or an earlier helper introduction`);
    }
    for (const part of selected.tokens) if (part.wordId) seenWords.add(part.wordId);
    seenLines.add(selected.line.join(""));
    return selected;
  });
}

/** Shared post-processing for rebuilds and the one-time repair of existing cards. */
export function repairStarterUnit(unit, availableWords) {
  const byId = new Map(availableWords.map(entry => [entry.id, { ...entry, ...reviewedStarterWords[entry.id] }]));
  const choose = (ids, index) => { const choices = ids.map(id => byId.get(id)).filter(Boolean); return choices[index % choices.length]; };
  let cards = unit.cards.map((card, index) => {
    if (card.grammarTags?.includes("reviewed context")) return card;
    const woIndex = card.tokens.findIndex(t => t.surface === "を");
    const object = card.tokens[woIndex - 1];
    const lexical = card.tokens.filter(t => t.wordId);
    // A stricter verb filter may expose the old noun-existence fallback. It must
    // not turn the same misclassified word into “there is yes/yellow/now”.
    const gaIndex = card.tokens.findIndex(t => t.surface === "が");
    const entity = card.tokens[gaIndex - 1];
    const reviewedEntity = reviewedStarterWords[entity?.wordId];
    const badEntity = reviewedEntity && (["person", "adverb", "time", "quantity", "adjective", "phrase"].includes(reviewedEntity.function) || colorSenseIds.has(entity.wordId) || sizeIds.has(entity.wordId));
    const suspicious = object && reviewedStarterWords[object.wordId] ? object : lexical.length === 1 && reviewedStarterWords[lexical[0].wordId] ? lexical[0] : badEntity ? entity : undefined;
    if (!suspicious) return card;
    const target = byId.get(suspicious.wordId);
    if (!target) return card;
    const subject = byId.get(card.tokens[0]?.wordId);
    const person = subject?.function === "person" ? subject : choose(["watashi", "anata", "gakusei", "sensei"], index);
    const shirt = choose(["shatsu", "baggu", "kimono", "tiishatsu", "kasa"], index);
    const place = choose(["eki", "gakkou", "byouin", "resutoran"], index);
    let next;
    if (colorSenseIds.has(target.id) && shirt) {
      const predicate = card.tokens.find(t => ["erabu", "miseru"].includes(t.wordId));
      if (predicate && person) {
        const action = predicate.wordId === "erabu" ? third(person) ? "chooses" : "choose" : third(person) ? "shows" : "show";
        next = realize(card, [token(person), wa(), token(target), no(), token(shirt), wo(), predicate], `${english(person)} ${action} the ${plainMeaning(target)} ${plainMeaning(shirt)}`);
      } else next = realize(card, [token(shirt), wa(), token(target), desu()], `${english(shirt)} is ${plainMeaning(target)}`);
    } else if (sizeIds.has(target.id) && shirt && byId.has("saizu")) {
      next = realize(card, [token(shirt), wa(), token(target), token(byId.get("saizu")), desu()], `${english(shirt)} is size ${target.meaning}`);
    } else if (numberIds.has(target.id) && shirt && byId.has("en")) {
      const amount = { "hyaku-byaku-pyaku": "100", "sen-zen": "1,000", man: "10,000" }[target.id];
      const amountTokens = target.id === "man" ? [token(byId.get("ichi")), token(target)] : [token(target)];
      const pricedItem = target.id === "hyaku-byaku-pyaku" ? choose(["pan", "koohii", "ocha"], index) ?? shirt : shirt;
      next = realize(card, [token(pricedItem), wa(), ...amountTokens, token(byId.get("en")), desu()], `${english(pricedItem)} costs ${amount} yen`);
    } else if (directionEnglish[target.id] && place) {
      next = realize(card, [token(place), wa(), token(target), desu()], `${english(place)} is ${directionEnglish[target.id]}`);
    } else if (relativeLocations[target.id] && byId.has("teeburu") && byId.has("hako") && byId.has("kasa")) {
      const location = byId.get(target.id === "naka" ? "hako" : "teeburu");
      const thing = byId.get("kasa");
      next = realize(card, [token(thing), wa(), token(location), no(), token(target), desu()], `${english(thing)} is ${relativeLocations[target.id]} ${english(location)}`);
    } else if (["kono", "ano"].includes(target.id) && shirt && byId.has("ii")) {
      next = realize(card, [token(target), token(shirt), wa(), token(byId.get("ii")), desu()], `${target.meaning} ${plainMeaning(shirt)} is good`);
    } else if (target.id === "dare" && byId.has("anata")) {
      next = realize(card, [token(byId.get("anata")), wa(), token(target), desu(), ka()], "Who are you?");
    } else if (target.id === "doko" && place) {
      next = realize(card, [token(place), wa(), token(target), desu(), ka()], `Where is ${english(place)}?`);
    } else if (target.id === "nani-nan" && byId.has("kore")) {
      next = realize(card, [token(byId.get("kore")), wa(), token(target), desu(), ka()], "What is this?");
    } else if (target.id === "ikutsu" && byId.has("isu") && byId.has("aru")) {
      next = realize(card, [token(byId.get("isu")), wa(), token(target), token(byId.get("aru"), ["あります", "あります"]), ka()], "How many chairs are there?");
    } else if (target.id === "futari" && byId.has("gakusei") && byId.has("iru")) {
      next = realize(card, [token(byId.get("gakusei")), particle("が", "が", "subject marker"), token(target), token(byId.get("iru"), ["います", "います"])], "There are two students");
    } else if (["koko", "kochira"].includes(target.id) && place) {
      next = realize(card, [token(place), wa(), token(target), desu()], `${english(place)} is ${target.id === "koko" ? "here" : "this way"}`);
    } else if (["kore", "are"].includes(target.id) && shirt) {
      next = realize(card, [token(target), wa(), token(shirt), desu()], `${target.meaning} is a ${plainMeaning(shirt)}`);
    } else if (["itsu", "nan-ji"].includes(target.id) && byId.has("konsaato")) {
      next = realize(card, [token(byId.get("konsaato")), wa(), token(target), desu(), ka()], `${target.id === "itsu" ? "When" : "What time"} is the concert?`);
    } else if (["kinou", "kinoo", "senshuu", "kyonen"].includes(target.id) && unit.id >= 18 && byId.has("yomu") && byId.has("nihongo")) {
      next = realize(card, [token(target), token(byId.get("nihongo")), wo(), token(byId.get("yomu"), ["読みました", "よみました"])], `I read Japanese ${target.meaning}`);
    } else if (target.id === "donna" && byId.has("hon") && byId.has("yomu")) {
      next = realize(card, [token(target), token(byId.get("hon")), wo(), token(byId.get("yomu"), ["読みます", "よみます"]), ka()], "What kind of books do you read?");
    } else if (["tabun", "mochiron", "jaa"].includes(target.id) && byId.has("iku") && place) {
      next = realize(card, [token(target), comma(), token(place), ni(), token(byId.get("iku"), ["行きます", "いきます"])], `${target.id === "tabun" ? "I will probably go" : target.id === "mochiron" ? "Of course, I will go" : "Then I will go"} to ${english(place)}`);
    } else if (target.id === "massugu-na" && byId.has("iku")) {
      next = realize(card, [token(target), token(byId.get("iku"), ["行きます", "いきます"])], "I go straight ahead");
    } else if (target.id === "tenisu" && byId.has("suru")) {
      next = realize(card, [token(target), wo(), token(byId.get("suru"), ["します", "します"])], "I play tennis");
    } else if (target.id === "wanpiisu" && person && byId.has("erabu")) {
      next = realize(card, [token(person), wa(), token(target), wo(), token(byId.get("erabu"), ["選びます", "えらびます"])], `${english(person)} ${third(person) ? "chooses" : "choose"} the dress`);
    } else if (target.id === "motto" && byId.has("nomu") && byId.has("mizu")) {
      next = realize(card, [token(target), token(byId.get("mizu")), wo(), token(byId.get("nomu"), ["飲みます", "のみます"])], "I drink more water");
    } else if (target.id === "dochira" && place) {
      next = realize(card, [token(place), wa(), token(target), desu(), ka()], `Which way is ${english(place)}?`);
    } else if (target.id === "doo" && byId.has("shigoto")) {
      next = realize(card, [token(byId.get("shigoto")), wa(), token(target), desu(), ka()], "How is work?");
    } else if (target.id === "doomo" && byId.has("arigatou")) {
      next = realize(card, [token(target), token(byId.get("arigatou"))], "Thank you very much");
    } else if (target.id === "tsugi" && byId.has("eki")) {
      next = realize(card, [token(target), no(), token(byId.get("eki")), desu()], "It is the next station");
    } else if (target.id === "ikura" && shirt) {
      next = realize(card, [token(shirt), wa(), token(target), desu(), ka()], `How much is ${english(shirt)}?`);
    } else if (target.id === "doo-yatte" && place && person && byId.has("iku")) {
      next = realize(card, [token(person), wa(), token(target), token(place), ni(), token(byId.get("iku"), ["行きます", "いきます"]), ka()], `How ${third(person) ? "does" : "do"} ${english(person)} go to ${english(place)}?`);
    } else if (["ima", "tokidoki", "ichido"].includes(target.id) && person && byId.has("yomu") && byId.has("nihongo")) {
      const verb = token(byId.get("yomu"), ["読みます", "よみます"]);
      const meaning = target.id === "ima" ? `${english(person)} will read Japanese now` : target.id === "tokidoki" ? `${english(person)} sometimes ${third(person) ? "reads" : "read"} Japanese` : `${english(person)} will read Japanese once`;
      next = realize(card, [token(person), wa(), token(target), token(byId.get("nihongo")), wo(), verb], meaning);
    } else if (["hai", "uun-uun"].includes(target.id) && person && byId.has("wakaru") && byId.has("nihongo")) {
      const first = byId.get("watashi");
      const understood = target.id === "hai";
      next = realize(card, [token(target), comma(), token(first), wa(), token(byId.get("nihongo")), particle("が", "が", "subject marker"), token(byId.get("wakaru"), understood ? ["分かります", "わかります"] : ["分かりません", "わかりません"])], `${understood ? "Yes" : "Hmm"}, I ${understood ? "understand" : "do not understand"} Japanese`);
    } else if (adjectiveSubjects[target.id]) {
      const described = choose(adjectiveSubjects[target.id], index);
      if (described) next = realize(card, [token(described), wa(), token(target), desu()], `${english(described)} ${be(described)} ${target.meaning}`);
    } else if (["aisu", "hotto"].includes(target.id) && person && byId.has("koohii") && byId.has("nomu")) {
      next = realize(card, [token(person), wa(), token(target), token(byId.get("koohii")), wo(), token(byId.get("nomu"), ["飲みます", "のみます"])], `${english(person)} ${third(person) ? "drinks" : "drink"} ${target.meaning} coffee`);
    } else if (target.id === "hoka" && person && shirt && byId.has("erabu")) {
      next = realize(card, [token(person), wa(), token(target), no(), token(shirt), wo(), token(byId.get("erabu"), ["選びます", "えらびます"])], `${english(person)} ${third(person) ? "chooses" : "choose"} another ${plainMeaning(shirt)}`);
    } else if ((foodIds.has(target.id) || drinkIds.has(target.id)) && person) {
      const drink = drinkIds.has(target.id);
      const verb = byId.get(drink ? "nomu" : "taberu");
      if (verb) next = realize(card, [token(person), wa(), token(target), wo(), token(verb, drink ? ["飲みます", "のみます"] : ["食べます", "たべます"])], `${english(person)} ${drink ? third(person) ? "drinks" : "drink" : third(person) ? "eats" : "eat"} ${target.meaning}`);
    } else if (target.function === "person" && person && byId.has("au")) {
      const speaker = byId.get("watashi");
      next = realize(card, [token(speaker), wa(), token(target), ni(), token(byId.get("au"), ["会います", "あいます"])], `I meet ${english(target)}`);
    } else if (target.id === "kankokugo" && person && byId.has("hanasu")) {
      next = realize(card, [token(person), wa(), token(target), wo(), token(byId.get("hanasu"), ["話します", "はなします"])], `${english(person)} ${third(person) ? "speaks" : "speak"} Korean`);
    } else if (target.id === "tookyoo" && person && byId.has("iku")) {
      next = realize(card, [token(person), wa(), token(target), ni(), token(byId.get("iku"), ["行きます", "いきます"])], `${english(person)} ${third(person) ? "goes" : "go"} to Tokyo`);
    } else if (target.id === "soshite" && byId.has("yomu") && byId.has("kaku") && byId.has("nihongo") && byId.has("hiragana")) {
      next = realize(card, [token(byId.get("nihongo")), wo(), token(byId.get("yomu"), ["読みます", "よみます"]), comma(), token(target), token(byId.get("hiragana")), wo(), token(byId.get("kaku"), ["書きます", "かきます"])], "I read Japanese. Then I write hiragana");
    } else if (target.id === "waa" && shirt && byId.has("oshare-na")) {
      next = realize(card, [token(target), comma(), token(shirt), wa(), token(byId.get("oshare-na")), desu()], `Wow, ${english(shirt)} is stylish`);
    } else if (target.id === "dame" && byId.has("koko")) {
      next = realize(card, [token(byId.get("koko")), wa(), token(target), desu()], "This place is not allowed");
    } else if (target.id === "pea" && byId.has("hanasu")) {
      next = realize(card, [token(target), particle("で", "で", "group arrangement"), token(byId.get("hanasu"), ["話します", "はなします"])], "We talk in pairs");
    } else if (target.id === "oshigoto-shigoto" && byId.has("watashi")) {
      next = realize(card, [token(byId.get("watashi")), no(), token(target), desu()], "It is my job");
    }
    return next ?? card;
  }).map(card => {
    if (!card.grammarTags?.includes("reviewed context")) return card;
    const tokens = card.tokens.map(part => !part.wordId && part.surface === "を" ? wo() : part.surface === "。" ? comma() : !part.wordId && part.surface === "一" && byId.has("ichi") ? token(byId.get("ichi")) : part);
    return { ...card, tokens, line: tokens.map(part => part.surface), tts: tokens.map(part => part.reading), explain: tokens.map(part => part.explain) };
  });
  cards = preserveContextPacing(unit, cards, byId);
  cards = repairStarterContent({ ...unit, cards }, availableWords).cards;
  const changes = cards.flatMap((card, index) => JSON.stringify(card) === JSON.stringify(unit.cards[index]) ? [] : [{ id: card.id, before: unit.cards[index].english, after: card.english }]);
  return { unit: { ...unit, cards }, repaired: changes.length, changes };
}
