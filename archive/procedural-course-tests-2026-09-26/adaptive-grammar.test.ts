import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { beforeEach, describe, expect, it } from "vitest";
import { readState, touchWordHistory, writeState } from "../src/state";
import { buildCustomLesson } from "../src/custom-lesson";
import { buildGrammarLesson } from "../src/grammar-lesson";
import { grammarStatus, knownGrammar, recordGrammarPractice } from "../src/grammar-progress";
import { dueReviewAdditions } from "../src/adaptive-lesson";
import { setWordPriority } from "../src/review";
import { assertLessonVocabulary } from "../src/lesson-vocabulary";
import { remakeLessonSession } from "../src/remake-lesson";
import { buildTopicLesson, selectTopicWords } from "../src/topic-course";
import { learningGrammar, learningGrammarCandidates } from "../../../packages/learning-engine/learning-grammar";
import { personalizedCandidates } from "../../../packages/learning-engine/personalized";
import { encodeStoredState, decodeStoredState } from "../src/storage-codec";
import { saveLessonSession } from "../src/session-history";
import type { LearnerState } from "../src/types";

const old = new Date(Date.now() - 10 * 86400000).toISOString();
function practiced(ids: string[]) {
  const state = readState();
  state.wordHistory = touchWordHistory(state, { wordIds: ids, kind: "reading", at: old });
  Object.values(state.wordHistory).forEach(word => { word.review = { occasions: 1, lastPracticedAt: old, lastOccasionAt: old, lastPracticeSequence: 1 }; });
  return state;
}
function consumeGrammar(state: LearnerState, id: typeof learningGrammar[number]["id"], at = old) {
  const session = buildGrammarLesson(state, id);
  let current = { ...state, activeSession: session };
  session.savedCards!.forEach((card, position) => {
    const previous = current;
    const next = { ...current, activeSession: { ...current.activeSession, cursor: position + 1, practicedIndices: [...current.activeSession.practicedIndices!, position] } };
    current = recordGrammarPractice(previous, next, card, position, at) as typeof current;
  });
  return current;
}

describe("on-demand words and grammar", () => {
  beforeEach(() => { localStorage.clear(); });
  it.each(learningGrammar)("builds and freezes a safe $title lesson", async grammar => {
    const state = readState(), before = JSON.stringify(state);
    const session = buildGrammarLesson(state, grammar.id);
    expect(session.savedCards!.length).toBeLessThanOrEqual(24);
    expect(()=>assertLessonCardQuality(session.savedCards!)).not.toThrow();
    expect(session.savedCards!.every(card => card.practiceGrammar?.includes(grammar.id))).toBe(true);
    expect(() => assertLessonVocabulary(session.savedCards!, session.targetWordIds!, state)).not.toThrow();
    for (const word of session.targetWordIds!) expect(session.savedCards!.filter(card => card.tokens.some(token => token.wordId === word)).length).toBeGreaterThanOrEqual(1);
    expect(new Set(session.savedCards!.map(card => card.line.join(""))).size).toBeGreaterThanOrEqual(9);
    const saved = saveLessonSession(state, session);
    expect(knownGrammar(saved).size).toBe(0);
    expect(JSON.stringify(state)).toBe(before);
    const restored = decodeStoredState(encodeStoredState(saved));
    expect(restored.errors).toEqual([]);
    expect((restored.value as LearnerState).lessonHistory![0].session.savedCards).toEqual(session.savedCards);
    const remake = await remakeLessonSession(state, session);
    expect(remake.grammarLessonId).toBe(grammar.id);
    expect(remake.targetWordIds).toEqual(session.targetWordIds);
    expect(remake.lessonId).toBe(session.id);
  });
  it("unlocks only after several distinct actually consumed examples, then schedules review", () => {
    const state = readState(), session = buildGrammarLesson(state, "want-action"), card = session.savedCards![0];
    const opened = { ...state, activeSession: session };
    expect(recordGrammarPractice(opened, opened, card, 0, old)).toBe(opened);
    expect(grammarStatus(opened, "want-action").known).toBe(false);
    let current = consumeGrammar(state, "want-action");
    expect(grammarStatus(current, "want-action")).toMatchObject({ known: true, due: true, occasions: 1, encounters: session.items.length });
    const replay = recordGrammarPractice(current, current, card, 0, old);
    expect(replay.grammarHistory).toEqual(current.grammarHistory);
    current = consumeGrammar(current, "want-action", new Date().toISOString());
    expect(grammarStatus(current, "want-action")).toMatchObject({ known: true, due: false, occasions: 2 });
    writeState(current);
    expect(readState().grammarHistory).toEqual(current.grammarHistory);
  });
  it("never unlocks advanced grammar from known words, saved lessons or an estimated level", async () => {
    const state = practiced(["yomu", "hon", "taberu", "pan", "nomu", "mizu"]);
    const saved = saveLessonSession(state, buildGrammarLesson(state, "want-action"));
    const lesson = await buildCustomLesson(saved, ["hon", "pan", "mizu"]);
    expect(lesson.session.savedCards!.some(card => /たい|たくない|られます/.test(card.line.join("")))).toBe(false);
    expect(knownGrammar(saved).size).toBe(0);
  });
  it("does not turn prioritized or saved unseen words into due helper vocabulary", async () => {
    let state = practiced(["yomu", "hon", "watashi"]);
    state = setWordPriority(state, "anata", true);
    state.wordHistory.anata.review!.lastPracticedAt = old;
    state.savedWordIds = ["pan", "anata"];
    expect(dueReviewAdditions(state, ["shinbun", "manga"])).not.toContain("anata");
    const lesson = await buildCustomLesson(state, ["shinbun", "manga"], { includeReview: true });
    expect(lesson.session.lessonPlan!.reviewWordIds).toEqual([]); // no consumed sentence snapshots
    expect(lesson.session.savedCards!.some(card => card.tokens.some(token => token.wordId === "anata" || token.wordId === "pan"))).toBe(false);
    expect(() => assertLessonVocabulary(lesson.session.savedCards!, lesson.session.targetWordIds!, state)).not.toThrow();
  });
  it("keeps the ranked due review selection during topic pairing", async () => {
    const state = practiced(["taberu", "nomu", "mizu", "pan", "koohii", "hoshii"]);
    const selected = selectTopicWords(state, "food", false, Date.now(), 8);
    const { session } = await buildTopicLesson(state, "food", false, { wordCount: 8 });
    expect(session.lessonPlan!.reviewWordIds).toEqual(selected.reviewWordIds);
  });
  it("reuses and balances due grammar while retaining ordinary contexts and every selected word", async () => {
    let state = practiced(["watashi", "yomu", "hon", "nihongo", "eigo", "hiragana"]);
    for (const grammar of learningGrammar) state = consumeGrammar(state, grammar.id);
    const targets = ["manga", "shinbun", "kanji", "kaku"];
    const before = JSON.stringify(state);
    const { session } = await buildCustomLesson(state, targets, { includeReview: true });
    const cards = session.savedCards!;
    for (const id of ["want-action", "can-action"]) {
      const count = cards.filter(card => card.practiceGrammar?.includes(id)).length;
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(24);
      const modes = new Set(cards.filter(card => card.practiceGrammar?.includes(id)).map(card => card.constructionKey?.split("-").at(-1)));
      expect(modes).toEqual(new Set(["positive", "negative", "question"]));
    }
    expect(cards.filter(card => !card.practiceGrammar?.length).length).toBeGreaterThanOrEqual(1);
    for (const id of session.targetWordIds!) {
      const count = cards.filter(card => card.tokens.some(token => token.wordId === id)).length;
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(24);
    }
    expect(() => assertLessonVocabulary(cards, session.targetWordIds!, state)).not.toThrow();
    expect(JSON.stringify(state)).toBe(before);
  });
  it("keeps exact morphology, senses and translations for wants and ability", () => {
    const cards = learningGrammarCandidates(new Set(["yomu", "hon", "iku", "gakkou", "ie", "kiru", "kutsu", "shatsu", "kaku", "manga", "hanasu", "nihongo", "resutoran", "taberu", "pan"]), new Set(["want-action", "can-action"]));
    expect(cards.find(card => card.line.join("") === "レストランでパンが食べられます")?.english).toBe("I can eat bread at the restaurant");
    expect(cards.find(card => card.line.join("") === "ほんが読めます")?.tts.join("")).toBe("ほんがよめます");
    expect(cards.find(card => card.line.join("") === "家に行きたいです")?.english).toBe("I want to go home");
    expect(cards.some(card => /to at|to in|to home/.test(card.english))).toBe(false);
    expect(cards.some(card => card.tokens.some(t => t.wordId === "kiru") && card.tokens.some(t => t.wordId === "kutsu"))).toBe(false);
    expect(cards.some(card => card.tokens.some(t => t.wordId === "kaku") && card.tokens.some(t => t.wordId === "manga"))).toBe(false);
    expect(cards.find(card => card.line.join("") === "日本語が話せます")?.english).toBe("I can speak Japanese");
    expect(personalizedCandidates(["yomu"], new Set(), new Set(["want-action", "can-action"])).flatMap(card => card.tokens).every(token => !token.wordId || token.wordId === "yomu")).toBe(true);
  });
});
