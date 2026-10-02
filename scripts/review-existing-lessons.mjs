import fs from "node:fs/promises";
import { createServer } from "vite";
import path from "node:path";
const out = path.resolve("docs/reviews/engine-remake");
await fs.mkdir(out, { recursive: true });
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => ({ ok: true, json: async () => JSON.parse(await fs.readFile(path.join("public", String(url)), "utf8")) });
try {
  const { buildCustomLesson } = await server.ssrLoadModule("/apps/learner-next/src/custom-lesson.ts");
  const { buildTopicLesson } = await server.ssrLoadModule("/apps/learner-next/src/topic-course.ts");
  const { readState, touchWordHistory } = await server.ssrLoadModule("/apps/learner-next/src/state.ts");
  const { lessonConceptId, assertLessonVocabulary } = await server.ssrLoadModule("/apps/learner-next/src/lesson-vocabulary.ts");
  const cases = [
    { name: "restaurant", targets: ["taberu", "erabu", "karee", "menyuu", "oishii", "raamen", "resutoran", "onegaishimasu"], known: ["watashi", "anata", "sensei", "gakusei", "yomu", "kaku", "hoshii", "kaimasu", "hankachi", "hashi", "shashin"] },
    { name: "routines", targets: ["mainichi", "neru", "yoru", "ashita", "yasumu", "kin-yoobi", "doyoobi", "nichiyoobi"], known: ["watashi", "hataraku"] },
    { name: "transport", targets: ["basu", "chikatetsu", "densha", "noru", "oriru", "eki", "kuukou", "tsuku"], known: ["watashi", "shashin"] },
    { name: "clothing", targets: ["kiru", "shatsu", "jaketto", "kutsu", "kutsushita", "saizu", "ookii", "chiisai"], known: ["watashi", "anata", "sensei", "gakusei", "hoshii", "kaimasu"] },
    { name: "shopping", targets: ["erabu", "mise", "depaato", "ehagaki", "kaado", "kasa", "omiyage", "tiishatsu", "aka", "ageru", "hashi", "kaimasu"], known: ["watashi", "anata", "sensei", "gakusei", "ane", "otouto", "hoshii", "yomu", "kaku", "shashin"] },
    { name: "hobbies", targets: ["daijoubu", "konsaato", "paatii", "yasumi", "anime", "eiga", "gitaa", "kiku", "manga", "au", "ureshii", "miru"], known: ["watashi", "anata", "sensei", "gakusei", "ane", "otouto", "hoshii", "kaimasu", "nihongo", "eigo", "yomu", "kaku", "shashin"] },
    { name: "culture", targets: ["anime", "manga", "hanabi", "kimono", "matsuri", "toru", "utau", "yuumei", "jinja", "omiyage", "nihon", "hashi"], known: ["watashi", "anata", "sensei", "gakusei", "ane", "otouto", "hoshii", "kaimasu", "yomu", "kaku", "miru", "shashin"] },
    { name: "objects", targets: ["erabu", "beddo", "eakon", "isu", "teeburu", "terebi", "gitaa", "piano", "nimotsu", "shashin", "hankachi", "hashi"], known: ["watashi", "hoshii", "kaimasu"] },
    { name: "school", targets: ["iru", "gakkou", "jugyou", "yasumu", "kiku", "mouichido", "wakarimasen", "hai", "ichido", "kaku", "kanji", "hanasu"],
      known: ["watashi", "gakusei", "sensei", "nihongo", "eigo", "shashin"] },
    { name: "home", targets: ["hairu", "apaato", "aru", "beddo", "eakon", "heya", "ie", "iru", "isu", "manshon", "sumu", "shashin"],
      known: ["watashi", "gakusei", "sensei", "hito", "nihon", "roshia"] },
    { name: "daily", targets: ["asagohan", "hairu", "hayai", "gakkou", "iku", "kuru", "asa", "gogo", "gozen", "hiru", "tanjoubi", "okiru"],
      known: ["gakusei", "kaimasu", "watashi", "nihon", "anata", "oosutoraria", "sensei", "supein", "hoshii", "hataraku", "roshia"] },
    { name: "travel", targets: ["byouin", "chikai", "depaato", "eki", "gakkou", "ginkou", "iku", "kouen", "kuru", "machi", "shashin", "kuni"],
      known: ["watashi", "nihon", "oosutoraria", "supein", "tai", "firipin", "roshia"] },
    { name: "food", targets: ["asagohan", "gohan", "gyuunyuu", "koohii", "mizu", "niku", "ocha", "pan", "sakana", "nomu", "juusu", "hashi"],
      known: ["watashi", "anata", "gakusei", "hoshii", "kaimasu", "jmdict:1053280"] },
    { name: "work", targets: ["asa", "gogo", "gozen", "kaeru", "shigoto", "getsuyoubi", "kayoubi", "yasumi", "yasumu", "hataraku", "kaishain", "kaku"],
      known: ["watashi", "anata", "gakusei", "nihon", "oosutoraria", "supein", "roshia", "eigo", "nihongo", "kanji", "hiragana", "kuni"] },
    { name: "family-added", targets: ["dare", "kakkoii", "kawaii", "kiree-na", "kono", "otto", "tsuma", "dochira-kara", "doko", "ane", "hanasu", "otouto"],
      known: ["watashitachi", "watashi", "au", "anata", "gakusei", "ureshii", "chichi", "hankachi", "hito", "kazoku", "tomodachi", "shufu", "koomuin"] },
    { name: "family", targets: ["dare", "kakkoii", "kawaii", "kiree-na", "kono", "otto", "tsuma", "futari", "wakai", "ane", "hanasu", "otouto"],
      known: ["watashitachi", "watashi", "au", "anata", "gakusei", "ureshii", "chichi", "hankachi", "hito", "kazoku", "tomodachi", "shufu", "koomuin"] },
    { name: "custom", targets: ["kanji", "kaku", "wakaru", "oosutoraria", "kaishain", "hataraku", "ane", "otouto", "hanasu", "jmdict:1889610", "jmdict:1055790", "jmdict:1124170", "jmdict:1053280", "kaimasu", "hoshii"],
      known: ["firipin", "watashitachi", "sensei", "hashi", "shufu", "hankachi", "enjinia", "ageru", "eigo", "watashi", "katakana", "kazoku", "gakusei", "namae", "hito", "yomu"] },
  ];
  for (const fixture of cases) {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: fixture.known, kind: "reading" });
    const { session } = fixture.name === "family-added" ? await buildTopicLesson(state, "family", false, { wordIds: fixture.targets }) : await buildCustomLesson(state, fixture.targets);
    assertLessonVocabulary(session.savedCards, fixture.targets, state);
    const positions = fixture.targets.map(id => session.savedCards.flatMap((card, index) => card.tokens.some(t => t.wordId && lessonConceptId(t.wordId) === lessonConceptId(id)) ? [index + 1] : []));
    const report = { cards: session.items.length, standalone: session.savedCards.filter(card => card.tokens.length === 1).length,
      maxGap: Math.max(...positions.flatMap(p => p.slice(1).map((v, i) => v - p[i]))),
      targets: fixture.targets.map((id, i) => ({ id, positions: positions[i] })) };
    await fs.writeFile(path.join(out, `${fixture.name}.json`), JSON.stringify({ fixture, report, session }, null, 2));
    await fs.writeFile(path.join(out, `${fixture.name}.md`), `# ${fixture.name}\n\n${JSON.stringify(report)}\n\n` + session.savedCards.map((card, index) => `${index + 1}. ${card.line.join("")} — ${card.english}`).join("\n"));
    console.log(fixture.name, JSON.stringify(report));
  }
} finally { globalThis.fetch = originalFetch; await server.close(); }
