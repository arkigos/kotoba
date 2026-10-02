import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import { LessonBuilder } from "../src/LessonBuilder";
import { builderRecipes, createGeneratedSession, generateLesson, prepareSession, resolveSessionCard, toggleSavedSentence } from "../src/generated";
import { readState, stateKey, writeState } from "../src/state";
import type { ActiveSession } from "../src/types";

const snapshot = () => generateLesson("classroom", builderRecipes.classroom.targetSenseIds, 42);
const stored = () => JSON.parse(localStorage.getItem(stateKey)!);

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/#today");
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("materialized generated lessons", () => {
  it("restores saved cards exactly even when their engine version is no longer current", async () => {
    const state = readState();
    const saved = snapshot();
    saved.engineVersion = "earlier-release";
    const session = { ...createGeneratedSession(saved, state), cursor: 11 };
    writeState({ ...state, activeSession: session });
    const restored = readState().activeSession!;
    await prepareSession(restored);
    expect(restored).toEqual(session);
    expect(resolveSessionCard(restored)).toEqual(saved.cards[11]);
    expect(restored.unitId).toBeUndefined();
  });

  it("rejects broken snapshots without substituting a course card", async () => {
    const session = createGeneratedSession(snapshot(), readState());
    const cases = [
      { ...session, snapshot: undefined },
      { ...session, cursor: -1 },
      { ...session, unitId: 1 },
      { ...session, snapshot: { ...session.snapshot, recipe: undefined } },
      { ...session, items: [{ ...session.items[0], cardId: "u001-c001" }, ...session.items.slice(1)] },
      { ...session, snapshot: { ...session.snapshot, cards: session.snapshot!.cards.map((card, i) => i === 0 ? { ...card, line: [] } : card) } },
    ];
    for (const corrupt of cases) await expect(prepareSession(corrupt as ActiveSession)).rejects.toThrow();
    expect(() => resolveSessionCard({ ...session, snapshot: undefined })).toThrow(/incomplete/);
  });

  it("retains saved generated sentence content after another lesson replaces the session", () => {
    const state = readState();
    const session = createGeneratedSession(snapshot(), state);
    const card = resolveSessionCard(session);
    const next = toggleSavedSentence(state, card, session);
    writeState({ ...next, activeSession: createGeneratedSession(generateLesson("movement", builderRecipes.movement.targetSenseIds, 51), next) });
    expect(readState().savedGeneratedCards?.[card.id].card).toEqual(card);
    expect(toggleSavedSentence(readState(), card, session).savedGeneratedCards).not.toHaveProperty(card.id);
  });

  it("keeps omitted lesson targets out of the pool and supplies explicit review helpers", () => {
    const lesson = generateLesson("classroom", ["yomu.default", "kaku.default"], 42);
    expect(lesson.cards.flatMap(card => card.senseIds)).not.toContain("nihongo.default");
    const review = generateLesson("classroom", ["nihongo.default"], 42, true);
    expect(review.recipe.targetSenseIds).toEqual(["nihongo.default"]);
    expect(review.recipe.helperSenseIds).toContain("yomu.default");
    expect(review.coverage["nihongo.default"]).toBeGreaterThanOrEqual(review.recipe.minTargetExposures);
    expect(() => generateLesson("classroom", ["not-reviewed"], 42, true)).toThrow(/not supported/);
  });
});

describe("builder and player integration", () => {
  it("explains automatic review additions and uses the available A1 grammar", () => {
    const state = readState();
    state.wordHistory.gakusei = { wordId: "gakusei", firstSeenAt: "2020-01-01T00:00:00Z", lastSeenAt: "2020-01-01T00:00:00Z", unitIds: [], encounters: 1, correct: 0, misses: 0, rating: "learning", prioritized: true, interactionKinds: ["reading"] };
    const start = vi.fn();
    render(<LessonBuilder state={state} onStart={start} onBack={vi.fn()} />);
    const additions = within(screen.getByRole("region", { name: "Review additions" }));
    expect(additions.getByText("学生")).toBeInTheDocument();
    expect(additions.getByText(/Due ·.*at least 4 appearances/)).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Include review words" }));
    fireEvent.click(screen.getByRole("button", { name: "Start this lesson" }));
    expect(start.mock.calls[0][0].recipe.level).toBe("A1");
    expect(start.mock.calls[0][0].reviewSelection.additions).toEqual([]);
    expect(start.mock.calls[0][0].cards.flatMap((card: { senseIds: string[] }) => card.senseIds)).not.toContain("gakusei.default");
  });

  it("shows due words and one priority control without learner difficulty ratings", () => {
    const state = readState();
    state.wordHistory.yomu = { wordId: "yomu", firstSeenAt: "2020-01-01T00:00:00Z", lastSeenAt: "2020-01-01T00:00:00Z", unitIds: [], encounters: 1, correct: 0, misses: 0, rating: "learning", interactionKinds: ["reading"] };
    writeState(state);
    window.history.replaceState(null, "", "/#library");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^My words ·/ }));
    fireEvent.click(within(screen.getByRole("group", { name: "Filter words" })).getByRole("button", { name: /^Due/ }));
    expect(screen.getByRole("heading", { name: "Due for review" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Prioritize 読む" }));
    expect(stored().wordHistory.yomu.prioritized).toBe(true);
    expect(stored().wordHistory.yomu.lastSeenAt).toBe("2020-01-01T00:00:00Z");
    expect(screen.queryByRole("button", { name: "Hard" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Easy" })).not.toBeInTheDocument();
  });

  it("launches a saved generated preview exactly, persists next/previous, and resumes after a reload", async () => {
    const state = readState();
    const saved = snapshot();
    saved.engineVersion = "earlier-release";
    writeState({ ...state, activeSession: createGeneratedSession(saved, state) });
    window.history.replaceState(null, "", "/#lesson/session");
    const app = render(<App />);
    expect(await screen.findByRole("button", { name: `Practice from sentence 1: ${saved.cards[0].english}` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start lesson" }));
    await screen.findByRole("button", { name: "Next card" });
    expect(stored().activeSession.snapshot.cards).toEqual(saved.cards);
    expect(stored().activeSession.snapshot.engineVersion).toBe("earlier-release");
    const savedCards = stored().activeSession.snapshot.cards;
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous card" }));
    expect(await screen.findByText(`Card 2 of ${saved.cards.length}`)).toBeInTheDocument();
    app.unmount();
    render(<App />);
    await screen.findByRole("button", { name: "Next card" });
    expect(await screen.findByText(`Card 2 of ${saved.cards.length}`)).toBeInTheDocument();
    expect(stored().activeSession.snapshot.cards).toEqual(savedCards);
    fireEvent.click(screen.getByRole("button", { name: "Pause and leave lesson" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Home" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /Resume lesson/ }));
    await screen.findByRole("button", { name: "Next card" });
    expect(await screen.findByText(`Card 2 of ${saved.cards.length}`)).toBeInTheDocument();
  });

  it("ends a skipped generated deck without claiming completion and keeps saved cards in Dictionary", async () => {
    const state = readState();
    const session = createGeneratedSession(snapshot(), state);
    session.cursor = session.items.length - 1;
    writeState({ ...state, activeSession: session, settings: { ...state.settings, sound: false } });
    window.history.replaceState(null, "", "/#practice");
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Save sentence" }));
    const card = session.snapshot!.cards.at(-1)!;
    const word = card.tokens.find(token => token.wordId)!;
    fireEvent.click(screen.getByRole("button", { name: word.surface }));
    fireEvent.click(screen.getByRole("button", { name: `Prioritize ${word.surface}` }));
    fireEvent.click(screen.getByRole("button", { name: "Complete lesson" }));
    expect(await screen.findByRole("heading", { name: "End of lesson" })).toBeInTheDocument();
    expect(stored().currentUnitId).toBe(state.currentUnitId);
    expect(stored().unitProgress).toEqual(state.unitProgress);
    expect(stored().completedUnits).toEqual(state.completedUnits);
    expect(stored().wordHistory[word.wordId!]).toMatchObject({ unitIds: [], recipeIds: [session.snapshot!.recipe.id], prioritized: true });
    fireEvent.click(screen.getByRole("button", { name: "Back to Home" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Dictionary" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /^My words ·/ }));
    expect(screen.queryByText("No words yet")).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Filter words" })).getByRole("button", { name: /^Prioritized/ }));
    fireEvent.click(screen.getByRole("button", { name: "Find lessons" }));
    expect(screen.getByRole("heading", { name: "Learn Japanese" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Custom" })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "A1 topics" })).toBeInTheDocument();
    expect(readState().wordHistory[word.wordId!]).toBeDefined();
    fireEvent.click(screen.getAllByRole("button", { name: "Dictionary" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /^Sentences ·/ }));
    expect(screen.getByText(card.line.join(""))).toBeInTheDocument();
    expect(stored().activeSession).toBeUndefined();
  });

  it("supports full-sentence listening for generated lessons without rewriting saved settings", async () => {
    const state = readState();
    state.settings = { ...state.settings, lessonMode: "listening", lessonDefaultFace: "hidden", audioLanguage: "english", autoplay: false };
    writeState({ ...state, activeSession: createGeneratedSession(snapshot(), state) });
    window.history.replaceState(null, "", "/#practice");
    render(<App />);
    expect(await screen.findByRole("button", { name: "Play card audio" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reveal Japanese" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Lesson settings" }));
    const dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByRole("button", { name: /Listening Audio first/ })).toBeInTheDocument();
    expect(dialog.getByRole("group", { name: "Audio language" })).toBeInTheDocument();
    expect(stored().settings).toMatchObject({ lessonMode: "listening", lessonDefaultFace: "hidden", audioLanguage: "english" });
  });

  it("shows unsupported review targets instead of quietly dropping them", () => {
    render(<LessonBuilder reviewWords={["yomu", "not-reviewed"]} onStart={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/not supported/);
    expect(screen.queryByRole("button", { name: "Start this lesson" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Practice unsupported:not-reviewed" })).toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: "Practice unsupported:not-reviewed" }));
    expect(screen.getByRole("button", { name: "Start this lesson" })).toBeInTheDocument();
  });

  it("preserves a broken saved lesson and shows a recovery message", async () => {
    const state = readState();
    const session = { ...createGeneratedSession(snapshot(), state), snapshot: undefined };
    writeState({ ...state, activeSession: session });
    window.history.replaceState(null, "", "/#practice");
    render(<App />);
    await waitFor(() => expect(screen.getByText(/could not be restored.*data has been kept/)).toBeInTheDocument());
    expect(stored().activeSession).toEqual(session);
    expect(screen.queryByRole("button", { name: "Next card" })).not.toBeInTheDocument();
  });
});
