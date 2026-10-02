import { createElement } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PracticeSession } from "../src/PracticeSession";
import { getUnit } from "../src/curriculum";
import { builderRecipes, generateLesson, isCourseSession, prepareSession, resolveSessionCard, toggleSavedSentence } from "../src/generated";
import { savedSentenceSession, savedSentencesSession } from "../src/saved-session";
import { localDay, readState, writeState } from "../src/state";
import type { ActiveSession, LearnerState, PracticeCard } from "../src/types";

const generated = generateLesson("classroom", builderRecipes.classroom.targetSenseIds, 42);
const courseCard = getUnit(1).cards[0];

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("saved-sentence review queues", () => {
  it("replays a handpicked mix of course and built sentences independently of their source lessons", async () => {
    const state = readState();
    const cards = structuredClone([courseCard, generated.cards[7], getUnit(1).cards[3]]);
    const session = savedSentencesSession(cards, state);
    expect(session.source).toBe("saved");
    expect(session.unitId).toBeUndefined();
    expect(session.snapshot).toBeUndefined();
    expect(session.savedCards?.[0]).not.toHaveProperty("derivation");
    expect(isCourseSession(session)).toBe(false);
    expect(session.items.every(item => item.unitId === undefined)).toBe(true);
    expect(session.items.map(item => item.cardId)).toEqual(cards.map(card => card.id));
    await expect(prepareSession(session)).resolves.toBeUndefined();

    const expected = structuredClone(cards);
    cards[0].english = "Changed source text";
    cards[1].tokens[0].reading = "Changed source reading";
    writeState({ ...state, activeSession: { ...session, cursor: 1 } });
    const restored = readState().activeSession!;
    await expect(prepareSession(restored)).resolves.toBeUndefined();
    expect(restored.savedCards).toEqual(expected);
    expect(resolveSessionCard(restored)).toEqual(expected[1]);
    expect(resolveSessionCard(restored, 2)).toEqual(expected[2]);
  });

  it.each(["listening", "recall"] as const)("supports an explicit %s review mode", mode => {
    const session = savedSentencesSession([courseCard, generated.cards[0]], readState(), mode);
    expect(session.mode).toBe(mode);
    expect(session.items.map(item => item.prompt)).toEqual([mode, mode]);
  });

  it("rejects one-word cards and repeated sentences before starting review", () => {
    const oneToken: PracticeCard = { id: "one-token", line: ["本"], tts: ["ほん"], explain: ["book"], tokens: [{ surface: "本", reading: "ほん", explain: "book", wordId: "hon" }], english: "book" };
    expect(()=>savedSentencesSession([oneToken],readState())).toThrow(/One-word/);
    expect(()=>savedSentencesSession([courseCard,courseCard],readState())).toThrow(/Repeated/);
  });

  it("resolves by queue position even when saved cards share an old identifier", () => {
    const different = { ...structuredClone(getUnit(1).cards[1]), id: courseCard.id };
    const session = savedSentencesSession([courseCard, different], readState());
    expect(resolveSessionCard(session, 0)).toEqual(courseCard);
    expect(resolveSessionCard(session, 1)).toEqual(different);
    expect(resolveSessionCard(session, 1)).not.toEqual(courseCard);
  });

  it("rejects an empty queue and corrupted materialized content without substituting course cards", async () => {
    expect(() => savedSentencesSession([], readState())).toThrow(/Save a sentence/);
    const session = savedSentencesSession([courseCard], readState());
    const cases = [
      { ...session, savedCards: undefined },
      { ...session, savedCards: [] },
      { ...session, cursor: -1 },
      { ...session, cursor: 0.5 },
      { ...session, cursor: 2 },
      { ...session, unitId: 1 },
      { ...session, items: [{ ...session.items[0], unitId: 1 }] },
      { ...session, items: [{ ...session.items[0], cardId: "different-card" }] },
      { ...session, savedCards: [{ ...courseCard, tts: [] }] },
      { ...session, savedCards: [{ ...courseCard, english: " " }] },
      { ...session, savedCards: [{ ...courseCard, tokens: courseCard.tokens.map((token, index) => index === 0 ? { ...token, reading: "different reading" } : token) }] },
    ];
    for (const corrupt of cases) await expect(prepareSession(corrupt as ActiveSession)).rejects.toThrow();
    expect(() => resolveSessionCard({ ...session, savedCards: undefined, unitId: 1 })).toThrow(/incomplete/);
  });

  it("records actual review practice without changing course position or completion", () => {
    const initial = readState();
    let state: LearnerState = { ...initial, activeSession: savedSentencesSession([courseCard], initial, "recall"), settings: { ...initial.settings, sound: false, autoplay: false, autoAdvance: false } };
    render(createElement(PracticeSession, { state, onState: update => { state = update(state); }, onExit: vi.fn(), onDone: vi.fn(), onToast: vi.fn() }));
    fireEvent.keyDown(document.body, { key: "ArrowRight" });
    expect(state.activeSession?.cursor).toBe(1);
    expect(state.activeSession?.practicedIndices).toEqual([0]);
    expect(state.unitProgress).toEqual(initial.unitProgress);
    expect(state.completedUnits).toEqual(initial.completedUnits);
    expect(state.currentUnitId).toBe(initial.currentUnitId);
    expect(state.dailyPractice?.[localDay()].cards).toBe(1);
    expect(state.dailyPractice?.[localDay()].completedLessonIds).toEqual([state.activeSession!.id]);
  });

  it("can remove and re-save a generated sentence from its saved review without losing its exact content", () => {
    const card = generated.cards[4];
    const initial = { ...readState(), savedSentenceIds: [card.id], savedGeneratedCards: { [card.id]: { card, title: generated.recipe.title, recipeId: generated.recipe.id } } };
    const session = savedSentencesSession([card], initial);
    const removed = toggleSavedSentence(initial, resolveSessionCard(session), session);
    expect(removed.savedSentenceIds).not.toContain(card.id);
    expect(removed.savedGeneratedCards).not.toHaveProperty(card.id);
    const saved = toggleSavedSentence(removed, resolveSessionCard(session), session);
    expect(saved.savedSentenceIds).toContain(card.id);
    expect(saved.savedGeneratedCards?.[card.id].card).toEqual(card);
    expect(resolveSessionCard(savedSentenceSession(saved.savedGeneratedCards![card.id], saved))).toEqual(card);
  });

  it("keeps course bookmarks as course references without creating generated derivations", () => {
    const initial = readState();
    const session = savedSentencesSession([courseCard], initial);
    const saved = toggleSavedSentence(initial, resolveSessionCard(session), session);
    expect(saved.savedSentenceIds).toContain(courseCard.id);
    expect(saved.savedGeneratedCards).not.toHaveProperty(courseCard.id);
  });
});
