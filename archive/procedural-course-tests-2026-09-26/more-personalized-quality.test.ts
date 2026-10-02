import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { beforeEach, describe, expect, it } from "vitest";
import { a1Topics } from "../../../packages/dictionary/a1";
import { personalizedCandidates } from "../../../packages/learning-engine/personalized";
import { buildCustomLesson } from "../src/custom-lesson";
import { buildTopicLesson } from "../src/topic-course";
import { assertLessonVocabulary } from "../src/lesson-vocabulary";
import { cardFrame } from "../src/lesson-transitions";
import { readState, touchWordHistory } from "../src/state";

const common = ["watashi", "anata", "sensei", "gakusei", "ane", "otouto", "hoshii", "kaimasu", "yomu", "kaku", "shashin"];
const cases = [
  { topic: "Shopping & clothes", ids: ["erabu", "mise", "depaato", "ehagaki", "kaado", "kasa", "omiyage", "tiishatsu", "aka", "ageru", "hashi", "kaimasu"], known: common },
  { topic: "Hobbies & time off", ids: ["daijoubu", "konsaato", "paatii", "yasumi", "anime", "eiga", "gitaa", "kiku", "manga", "au", "ureshii", "miru"], known: [...common, "nihongo", "eigo"] },
  { topic: "Culture & events", ids: ["anime", "manga", "hanabi", "kimono", "matsuri", "toru", "utau", "yuumei", "jinja", "omiyage", "nihon", "hashi"], known: [...common, "miru"] },
  { topic: "Everyday objects", ids: ["erabu", "beddo", "eakon", "isu", "teeburu", "terebi", "gitaa", "piano", "nimotsu", "shashin", "hankachi", "hashi"], known: ["watashi", "hoshii", "kaimasu"] },
];

describe("four topic selections personally reviewed on September 20", () => {
  beforeEach(() => localStorage.clear());
  it.each(cases)("keeps $topic contextual, varied, spaced and vocabulary-safe", async ({ topic, ids, known }) => {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: known, kind: "reading" });
    const before = JSON.stringify(state);
    const topicId = a1Topics.find(row => row.title === topic)!.id;
    for (const session of [(await buildTopicLesson(state, topicId, false, { wordIds: ids })).session, (await buildCustomLesson(state, ids)).session]) {
      const cards = session.savedCards!;
      expect(() => assertLessonCardQuality(cards)).not.toThrow();
      expect(cards.length).toBeLessThanOrEqual(80);
      expect(session.targetWordIds).toEqual(ids);
      expect(() => assertLessonVocabulary(cards, ids, state)).not.toThrow();
      for (const id of ids) {
        const positions = cards.flatMap((card, index) => card.tokens.some(token => token.wordId === id) ? [index] : []);
        expect(positions.length, id).toBeGreaterThanOrEqual(1);
        expect(positions.length, id).toBeLessThanOrEqual(24);
        expect(positions.every(index => cards[index].tokens.length > 1), id).toBe(true);
        expect(new Set(positions.map(index => cards[index].line.join(""))).size, id).toBeGreaterThanOrEqual(1);
        expect(Math.max(...positions.slice(1).map((p, i) => p - positions[i])), id).toBeLessThanOrEqual(24);
      }
      let run = 0, previous = "";
      for (const card of cards) {
        const frame = cardFrame(card);
        run = frame === previous ? run + 1 : 1;
        expect(run, card.line.join("")).toBeLessThanOrEqual(4);
        previous = frame;
      }
      expect(new Set(cards.slice(-12).map(cardFrame)).size).toBeGreaterThanOrEqual(3);
      const english = cards.map(card => card.english).join("\n");
      expect(english).not.toMatch(/Japan is famous|write[s]? the manga|buy luggage|want luggage/);
      expect(english).not.toMatch(/(?:teacher|student) is happy|You are happy/);
      if (topic.startsWith("Shopping")) expect(english).toMatch(/give .* to my|choose .* at the/);
      if (topic.startsWith("Hobbies")) expect(english).toContain("listen to the guitar at the concert");
      if (topic.startsWith("Culture")) expect(english).toMatch(/sing at the festival/);
      if (topic === "Everyday objects") {
        const pairs = cards.filter(card => card.constructionKey === "choice-pair");
        expect(pairs.length).toBeGreaterThan(0);
        expect(pairs.every(card => card.tokens.find(token => token.surface === "と")?.explain === "and")).toBe(true);
      }
    }
    expect(JSON.stringify(state)).toBe(before);
  });
  it("does not infer shopping, playing or writing permissions from a word's noun class", () => {
    const ids = ["manga", "nimotsu", "gitaa", "yuumei", "nihon"];
    const cards = personalizedCandidates(ids, new Set(["watashi", "kaku", "kaimasu", "hoshii", "kiku"]));
    expect(cards.every(card => !/writes? the manga|buy luggage|want luggage|play|Japan is famous/.test(card.english))).toBe(true);
    expect(cards.flatMap(card => card.tokens).every(token => !token.wordId || [...ids, "watashi", "kaku", "kaimasu", "hoshii", "kiku"].includes(token.wordId))).toBe(true);
  });
});
