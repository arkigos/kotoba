import { beforeEach, describe, expect, it } from "vitest";
import { getUnit, loadUnit } from "../src/curriculum";
import { createLibrarySession, createSession, gradeFromResult, lessonPresets } from "../src/engine";
import { readState, stateKey, touchWordHistory, writeState } from "../src/state";
import { practiceFixture } from "./fixtures";
import { cardAudioPath } from "../src/PracticeSession";

describe("learning engine", () => {
  it("opens the complete authored unit at the learner's exact saved card", () => {
    const saved = practiceFixture();
    const state = { ...saved, completedUnits: saved.completedUnits.filter((id) => id !== 1) };
    const unit = getUnit(1);
    const session = createSession(1, "standard", state);

    expect(session.items).toHaveLength(unit.cards.length);
    expect(session.items.map((item) => item.cardId)).toEqual(unit.cards.map((card) => card.id));
    expect(session.items.every((item) => item.prompt === "explore")).toBe(true);
    expect(session.cursor).toBe(state.unitProgress["1"].lastCardIndex);
    expect(session.items[0].reason).toContain(`1 of ${unit.cards.length}`);
    expect(session.mode).toBe("reading");
  });

  it("reopens a completed Course unit from the beginning for a clean replay", () => {
    const state = practiceFixture();
    expect(createSession(1, "deep", state).cursor).toBe(0);
  });

  it("preserves the original lesson preset behavior as editable settings", () => {
    expect(lessonPresets.reading.settings).toMatchObject({ lessonDefaultFace: "japanese", autoplay: true, audioLanguage: "japanese", autoAdvance: false });
    expect(lessonPresets.listening.settings).toMatchObject({ lessonDefaultFace: "hidden", autoplay: true, audioLanguage: "japanese", autoAdvance: false });
    expect(lessonPresets.recall.settings).toMatchObject({ lessonDefaultFace: "english", autoplay: false, autoAdvance: false });
    expect(lessonPresets.rapid.settings).toMatchObject({ lessonDefaultFace: "japanese", autoplay: true, autoAdvance: true, autoAdvanceOrder: "sequential", autoAdvanceDelayMs: 5000 });
  });

  it("does not treat a supported answer as full-strength evidence", () => {
    expect(gradeFromResult(true, false)).toBe("good");
    expect(gradeFromResult(true, true)).toBe("hard");
    expect(gradeFromResult(false, false)).toBe("again");
  });

  it("builds a cross-unit review from a filtered library set", async () => {
    const state = practiceFixture();
    const units = await Promise.all([loadUnit(1), loadUnit(2)]);
    const session = createLibrarySession(units, { wordIds: ["kanji", "kaku", "kaishain", "hataraku"], mode: "listening", count: 6, label: "Hard rewind" }, state);

    expect(session.source).toBe("library");
    expect(session.mode).toBe("listening");
    expect(session.items.length).toBeGreaterThan(0);
    expect(session.items.every((item) => item.prompt === "listening")).toBe(true);
    expect(new Set(session.items.map((item) => item.unitId))).toEqual(new Set([1, 2]));
  });

  it("covers requested words and avoids repeated sentences across course sources", async () => {
    const state = practiceFixture();
    const units = await Promise.all([loadUnit(1), loadUnit(2)]);
    const requested = ["kanji", "kaku", "kaishain", "hataraku"];
    const session = createLibrarySession(units, { wordIds: requested, mode: "mixed", count: 10, label: "Selected words" }, state);
    const cards = session.items.map(item => units.find(unit => unit.id === item.unitId)!.cards.find(card => card.id === item.cardId)!);
    const available = requested.filter(id => units.some(unit => unit.cards.some(card => card.tokens.some(token => token.wordId === id))));
    const practiced = new Set(cards.flatMap(card => card.tokens.map(token => token.wordId)));
    expect(available.every(id => practiced.has(id))).toBe(true);
    expect(new Set(cards.map(card => `${card.line.join("")}\n${card.english}`)).size).toBe(cards.length);
  });

  it("uses recognition prompts rather than sentence building for single-character Kana", async () => {
    const state = practiceFixture();
    const kana = await loadUnit(101);
    const session = createSession(101, "deep", state);
    const librarySession = createLibrarySession([kana], { wordIds: kana.cards.slice(0, 16).flatMap((card) => card.tokens.map((token) => token.wordId).filter((id): id is string => !!id)), mode: "mixed", count: 16, label: "Kana recall" }, state);

    expect(session.items).toHaveLength(kana.cards.length);
    expect(session.items.some((item) => item.prompt === "arrange")).toBe(false);
    expect(librarySession.items.some((item) => item.prompt === "arrange")).toBe(false);
  });

  it("resolves checked-in card audio even before curriculum refs are stamped", () => {
    expect(cardAudioPath(101, "u101-c001")).toBe("/media/jp/audio/unit_101/u101-c001.mp3");
    expect(cardAudioPath(3, "u003-c042")).toBe("/media/jp/audio/unit_003/u003-c042.mp3");
  });

  it("records every kind of word encounter without losing prior history", () => {
    const state = practiceFixture();
    const before = state.wordHistory.kanji;
    const history = touchWordHistory(state, { wordIds: ["kanji"], unitId: 1, kind: "listening", correct: false, grade: "hard" });

    expect(history.kanji.encounters).toBe(before.encounters + 1);
    expect(history.kanji.misses).toBe(before.misses + 1);
    expect(history.kanji.rating).toBe("hard");
    expect(history.kanji.interactionKinds).toContain("listening");
  });

  it("accepts the same explicit hard, learning, and easy statuses used by Library", () => {
    const state = practiceFixture();
    const history = touchWordHistory(state, { wordIds: ["kanji"], unitId: 1, kind: "reading", rating: "learning" });
    expect(history.kanji.rating).toBe("learning");
  });
});

describe("local state", () => {
  beforeEach(() => localStorage.clear());
  it("starts without invented history, including in development", () => {
    const state = readState();
    expect(state.currentUnitId).toBe(1);
    expect(state.completedUnits).toEqual([]);
    expect(state.practiceDays).toEqual([]);
    expect(state.savedWordIds).toEqual([]);
    expect(state.wordHistory).toEqual({});
    expect(state.attempts).toEqual([]);
    expect(state.xp).toBe(0);
  });

  it("preserves an existing profile instead of erasing mixed sample and user data", () => {
    const state = practiceFixture();
    state.displayName = "Mika";
    writeState(state);
    expect(readState()).toEqual({ ...state, courseRevisions: { "103": 2 } });
  });

  it("persists learner state", () => {
    const state = readState();
    writeState({ ...state, displayName: "Mika", xp: 42 });
    expect(readState()).toMatchObject({ displayName: "Mika", xp: 42 });
    localStorage.removeItem(stateKey);
  });

  it("recovers from damaged storage", () => {
    localStorage.setItem(stateKey, "not-json");
    const recovered = readState();
    expect(recovered.version).toBe(3);
    expect(recovered.completedUnits).toEqual([]);
    expect(Object.keys(recovered.wordHistory)).toHaveLength(0);
    localStorage.removeItem(stateKey);
  });

  it("migrates previous progress without adding sample practice", () => {
    const current = readState();
    const { wordHistory: _wordHistory, ...previous } = current;
    localStorage.removeItem(stateKey);
    localStorage.setItem("kotoba.next.state.v2", JSON.stringify({ ...previous, version: 2, currentUnitId: 1, completedUnits: [], attempts: [] }));

    const migrated = readState();
    expect(migrated.version).toBe(3);
    expect(migrated.currentUnitId).toBe(1);
    expect(migrated.completedUnits).toEqual([]);
    expect(Object.values(migrated.wordHistory).every((history) => new Date(history.firstSeenAt) <= new Date(history.lastSeenAt))).toBe(true);
    expect(migrated.attempts).toEqual([]);
    expect(migrated.wordHistory).toEqual({});
    localStorage.removeItem("kotoba.next.state.v2");
  });
});
