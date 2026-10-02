import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { beforeEach, describe, expect, it } from "vitest";
import { personalizedCandidates, PERSONALIZED_ENGINE_VERSION } from "../../../packages/learning-engine/personalized";
import { buildTopicLesson } from "../src/topic-course";
import { a1Topics } from "../../../packages/dictionary/a1";
import { buildCustomLesson } from "../src/custom-lesson";
import { assertLessonVocabulary } from "../src/lesson-vocabulary";
import { remakeLessonSession } from "../src/remake-lesson";
import { readState, touchWordHistory } from "../src/state";

const family = ["dare", "kakkoii", "kawaii", "kiree-na", "kono", "otto", "tsuma", "futari", "wakai", "ane", "hanasu", "otouto"];
const familiar = ["watashitachi", "watashi", "au", "anata", "gakusei", "ureshii", "chichi", "hankachi", "hito", "kazoku", "tomodachi", "shufu", "koomuin"];

describe("lesson quality regressions from reading real saved lessons", () => {
  beforeEach(() => localStorage.clear());
  it.each([
    { topic: "Home & surroundings", ids: ["hairu", "apaato", "aru", "beddo", "eakon", "heya", "ie", "iru", "isu", "manshon", "sumu", "shashin"], known: ["watashi", "gakusei", "sensei", "hito", "nihon", "roshia"] },
    { topic: "School & learning", ids: ["iru", "gakkou", "jugyou", "yasumu", "kiku", "mouichido", "wakarimasen", "hai", "ichido", "kaku", "kanji", "hanasu"], known: ["watashi", "gakusei", "sensei", "nihongo", "eigo", "shashin"] },
  ])("teaches every target in $topic without glossary loops", async ({ topic, ids, known }) => {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: known, kind: "reading" });
    const topicId = a1Topics.find(row => row.title === topic)!.id;
    for (const session of [(await buildTopicLesson(state, topicId, false, { wordIds: ids })).session, (await buildCustomLesson(state, ids)).session]) {
      const cards = session.savedCards!;
      expect(() => assertLessonCardQuality(cards)).not.toThrow();
      expect(cards.length).toBeLessThan(70);
      expect(() => assertLessonVocabulary(cards, ids, state)).not.toThrow();
      for (const id of ids) {
        const positions = cards.flatMap((card, index) => card.tokens.some(t => t.wordId === id) ? [index] : []);
        expect(positions.length, id).toBeGreaterThanOrEqual(1);
        expect(positions.every(index => cards[index].tokens.length > 1), id).toBe(true);
        expect(Math.max(...positions.slice(1).map((p, i) => p - positions[i])), id).toBeLessThanOrEqual(24);
      }
      if (topic.startsWith("Home")) {
        expect(cards.some(card => card.tokens.some(t => t.wordId === "aru") && card.english.startsWith("There is "))).toBe(true);
        expect(cards.filter(card => card.tokens.some(t => t.wordId === "iru")).every(card => /student|teacher|person/.test(card.english))).toBe(true);
      } else {
        expect(cards.some(card => card.english === "I miss class")).toBe(true);
        expect(cards.some(card => card.english.includes("again"))).toBe(true);
        expect(cards.some(card => card.english.includes("once"))).toBe(true);
        expect(cards.some(card => card.english === "I don't understand kanji")).toBe(true);
      }
    }
  });
  it("does not supply unknown nouns to fill existence or classroom frames", () => {
    for (const ids of [["iru", "aru"], ["mouichido", "ichido", "hai"]]) {
      const cards = personalizedCandidates(ids, new Set());
      expect(cards.flatMap(card => card.tokens).every(token => !token.wordId || ids.includes(token.wordId))).toBe(true);
    }
  });
  it("gives every daily-life target contextual practice, including entry, noon, birthday and getting up", async () => {
    const ids = ["asagohan", "hairu", "hayai", "gakkou", "iku", "kuru", "asa", "gogo", "gozen", "hiru", "tanjoubi", "okiru"];
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: ["gakusei", "kaimasu", "watashi", "nihon", "anata", "oosutoraria", "sensei", "supein", "hoshii", "hataraku", "roshia"], kind: "reading" });
    const topicId = a1Topics.find(topic => topic.title === "Daily life & plans")!.id;
    for (const session of [(await buildTopicLesson(state, topicId, false, { wordIds: ids })).session, (await buildCustomLesson(state, ids)).session]) {
      const cards = session.savedCards!;
      expect(() => assertLessonCardQuality(cards)).not.toThrow();
      expect(() => assertLessonVocabulary(cards, ids, state)).not.toThrow();
      for (const id of ids) {
        const practice = cards.filter(card => card.tokens.some(t => t.wordId === id));
        expect(practice.length, id).toBeGreaterThanOrEqual(1);
        expect(practice.every(card => card.tokens.length > 1), id).toBe(true);
      }
      expect(cards.some(card => card.line.join("") === "早く起きます")).toBe(true);
      expect(cards.some(card => card.line.join("").includes("入ります"))).toBe(true);
      expect(cards.some(card => card.line.join("").includes("昼に"))).toBe(true);
    }
  });
  it("connects travel landmarks and photographs without treating a country as a nearby landmark", async () => {
    const ids = ["byouin", "chikai", "depaato", "eki", "gakkou", "ginkou", "iku", "kouen", "kuru", "machi", "shashin", "kuni"];
    const state = readState();
    const known = ["watashi", "nihon", "oosutoraria", "supein", "tai", "firipin", "roshia"];
    state.wordHistory = touchWordHistory(state, { wordIds: known, kind: "reading" });
    const topicId = a1Topics.find(topic => topic.title === "Around town & travel")!.id;
    const candidates = personalizedCandidates(ids, new Set(known));
    expect(candidates.some(card => card.english === "The country is nearby")).toBe(false);
    expect(candidates.some(card => card.english === "Is the station nearby?")).toBe(true);
    for (const session of [(await buildTopicLesson(state, topicId, false, { wordIds: ids })).session, (await buildCustomLesson(state, ids)).session]) {
      expect(session.targetWordIds).toEqual(ids);
      expect(session.savedCards!.length).toBeLessThan(72);
      expect(session.savedCards!.every(card => card.tokens.length > 1)).toBe(true);
      expect(session.savedCards!.some(card => card.english.startsWith("It's a photograph of"))).toBe(true);
      expect(session.savedCards!.some(card => card.english.startsWith("My country is "))).toBe(true);
      expect(Object.values(session.lessonPlan!.appearances).every(count => count >= 1)).toBe(true);
      expect(() => assertLessonVocabulary(session.savedCards!, ids, state)).not.toThrow();
    }
  });
  it("teaches the food selection without glossary loops or exhausting drink early", async () => {
    const ids = ["asagohan", "gohan", "gyuunyuu", "koohii", "mizu", "niku", "ocha", "pan", "sakana", "nomu", "juusu", "hashi"];
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: ["watashi", "anata", "gakusei", "hoshii", "kaimasu", "jmdict:1053280"], kind: "reading" });
    const topicId = a1Topics.find(topic => topic.title === "Food & eating out")!.id;
    for (const session of [(await buildTopicLesson(state, topicId, false, { wordIds: ids })).session, (await buildCustomLesson(state, ids)).session]) {
      const cards = session.savedCards!;
      expect(() => assertLessonCardQuality(cards)).not.toThrow();
      expect(cards.every(card => card.tokens.length > 1)).toBe(true);
      expect(cards.some(card => card.english.startsWith("I want "))).toBe(true);
      expect(cards.some(card => card.english.endsWith("?"))).toBe(true);
      const positions = cards.flatMap((card, index) => card.tokens.some(t => t.wordId === "nomu") ? [index] : []);
      expect(positions.at(-1)).toBeGreaterThan(cards.length * .8);
      expect(Math.max(...positions.slice(1).map((p, i) => p - positions[i]))).toBeLessThanOrEqual(22);
      expect(() => assertLessonVocabulary(cards, ids, state)).not.toThrow();
    }
  });
  it("uses times and days in work/rest sentences with the same work selection", async () => {
    const ids = ["asa", "gogo", "gozen", "kaeru", "shigoto", "getsuyoubi", "kayoubi", "yasumi", "yasumu", "hataraku", "kaishain", "kaku"];
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: ["watashi", "anata", "gakusei", "nihon", "oosutoraria", "supein", "roshia", "eigo", "nihongo", "kanji", "hiragana", "kuni"], kind: "reading" });
    const topicId = a1Topics.find(topic => topic.title === "Work & introductions")!.id;
    for (const session of [(await buildTopicLesson(state, topicId, false, { wordIds: ids })).session, (await buildCustomLesson(state, ids)).session]) {
      expect(session.savedCards!.length).toBeLessThan(88);
      expect(session.savedCards!.every(card => card.tokens.length > 1)).toBe(true);
      expect(session.savedCards!.some(card => card.english === "I have work on Mondays")).toBe(true);
      expect(session.savedCards!.some(card => card.english === "I have the afternoon off")).toBe(true);
      expect(session.savedCards!.some(card => card.english.includes("to the country"))).toBe(false);
      expect(() => assertLessonVocabulary(session.savedCards!, ids, state)).not.toThrow();
    }
  });
  it("remakes the family selection as spaced sentences without dictionary fragments or repeat blocks", async () => {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: familiar, kind: "reading" });
    const { session } = await buildCustomLesson(state, family);
    const cards = session.savedCards!;
      expect(() => assertLessonCardQuality(cards)).not.toThrow();
    expect(cards.length).toBeLessThan(83);
    expect(cards.every(card => card.tokens.length > 1)).toBe(true);
    expect(cards.some(card => card.line.join("").startsWith("この人"))).toBe(true);
    expect(cards.some(card => card.line.join("").includes("ふたりで話します"))).toBe(true);
    expect(cards.every(card => !/[（(]な[）)]|\//.test(card.line.join("") + card.english))).toBe(true);
    expect(cards.every(card => !card.english.includes("Who are you?"))).toBe(true);
    for (const id of family) {
      const positions = cards.flatMap((card, i) => card.tokens.some(token => token.wordId === id) ? [i] : []);
      expect(positions.length).toBeGreaterThanOrEqual(1);
      expect(positions[0]).toBeLessThan(family.length);
      expect(Math.max(...positions.slice(1).map((position, i) => position - positions[i]))).toBeLessThanOrEqual(20);
    }
    cards.slice(1).forEach((card, i) => expect([card.line, card.english]).not.toEqual([cards[i].line, cards[i].english]));
    expect(() => assertLessonVocabulary(cards, family, state)).not.toThrow();
  });
  it("uses verb arguments and adjective sense constraints instead of generic word slots", () => {
    const cards = personalizedCandidates(["wakaru", "oosutoraria", "raku", "kiree-na"], new Set(["sensei", "eigo", "hankachi", "juusu", "pan", "hanbaagaa", "shashin"]));
    expect(cards.some(card => card.english === "The teacher understands English")).toBe(true);
    expect(cards.some(card => card.english.includes("understands in"))).toBe(false);
    expect(cards.some(card => /Australia is (easy|comfortable)|teacher is clean|tidy\/clean/.test(card.english))).toBe(false);
    expect(cards.some(card => card.english === "The handkerchief is clean")).toBe(true);
    expect(cards.some(card => /juice|bread|hamburger|photograph/i.test(card.english))).toBe(false);
    expect(cards.every(card => !card.id.startsWith("u0"))).toBe(true);
  });
  it("keeps simple writing contexts available beside denser target combinations", async () => {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: ["watashi", "eigo", "sensei"], kind: "reading" });
    const result = await buildCustomLesson(state, ["kaku", "kanji", "ane", "wakaru"]);
    expect(result.session.savedCards!.filter(card => card.tokens.some(token => token.wordId === "kaku")).every(card => card.tokens.length > 1)).toBe(true);
  });
  it("remakes through generation while preserving selection, title, shelf identity, and practice history", async () => {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: familiar, kind: "reading" });
    const previous = (await buildCustomLesson(state, family)).session;
    previous.source = "topic"; previous.topicId = "family"; previous.title = "Family & people · A1";
    previous.cursor = 10;
    const before = JSON.stringify({ state, previous });
    const remade = await remakeLessonSession(state, previous);
    expect(remade.id).not.toBe(previous.id);
    expect(remade.lessonId).toBe(previous.id);
    expect(remade.targetWordIds).toEqual(family);
    expect(remade.title).toBe(previous.title);
    expect(remade.source).toBe("topic");
    expect(remade.cursor).toBe(0);
    expect(remade.practicedIndices).toEqual([]);
    expect(remade.lessonPlan?.engineVersion).toBe(PERSONALIZED_ENGINE_VERSION);
    expect(JSON.stringify({ state, previous })).toBe(before);
  });
  it("handles the newly added family selection without bare where cards or tight phrase loops", async () => {
    const ids = family.map(id => id === "futari" ? "dochira-kara" : id === "wakai" ? "doko" : id);
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: familiar, kind: "reading" });
    const sessions = [(await buildTopicLesson(state, "family", false, { wordIds: ids })).session,
      (await buildCustomLesson(state, ids)).session];
    for (const session of sessions) {
      expect(session.targetWordIds).toEqual(ids);
      expect(() => assertLessonVocabulary(session.savedCards!, ids, state)).not.toThrow();
      expect(session.savedCards!.some(card => card.tokens.some(token=>token.wordId === "doko"))).toBe(true);
      expect(session.savedCards!.some(card => card.tokens.length === 1 && card.tokens[0].wordId === "doko")).toBe(false);
      const last = new Map<string, number>();
      session.savedCards!.forEach((card, index) => {
        const key = JSON.stringify([card.line, card.english]);
        if (last.has(key)) expect(index - last.get(key)!).toBeGreaterThanOrEqual(4);
        last.set(key, index);
      });
      expect(Object.values(session.lessonPlan!.appearances).every(count => count >= 1)).toBe(true);
    }
  });
});
