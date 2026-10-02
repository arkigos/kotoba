import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PracticeSession } from "../src/PracticeSession";
import { LibraryWords } from "../src/LibraryWords";
import { cardExposureCount, cardExposureLabel, recordCardExposures } from "../src/word-exposure";
import { readState, touchWordHistory, writeState } from "../src/state";
import { restartLesson } from "../src/session-history";
import type { LearnerState, PracticeCard } from "../src/types";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const card: PracticeCard = {
  id: "repeated-card", line: ["読む", "読む", "本"], tts: ["よむ", "よむ", "ほん"],
  explain: ["read", "read", "book"], english: "Word practice",
  tokens: [
    { wordId: "yomu", surface: "読む", reading: "よむ", explain: "read" },
    { wordId: "yomu", surface: "読む", reading: "よむ", explain: "read" },
    { wordId: "hon", surface: "本", reading: "ほん", explain: "book" },
  ],
};

function initialState(): LearnerState {
  const state = readState();
  return { ...state, settings: { ...state.settings, sound: false, autoplay: false, autoAdvance: false },
    activeSession: {
      id: "tracked-session", startedAt: "2026-09-13T12:00:00Z", source: "vocabulary", title: "Exposure practice",
      cursor: 0, scores: [], practicedIndices: [], length: "standard", mode: "reading",
      items: [0, 1, 2].map(() => ({ cardId: card.id, prompt: "explore", reason: "Repeated encounter" })),
      savedCards: [card, card, card],
    },
  };
}

function renderPractice(initial: LearnerState) {
  let latest = initial;
  function Harness() {
    const [state, setState] = useState(initial);
    latest = state;
    return <PracticeSession state={state} onState={setState} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()} />;
  }
  return { ...render(<Harness />), state: () => latest };
}

describe("actual word card exposures", () => {
  it("does not infer historical totals from old touches or practice occasions", () => {
    const state = initialState();
    state.wordHistory = touchWordHistory(state, { wordIds: ["yomu"], kind: "reading" });
    state.wordHistory.yomu.encounters = 98;
    state.wordHistory.yomu.review = { occasions: 9, lastPracticedAt: "2025-01-01T00:00:00Z" };
    writeState(state);
    const restored = readState();
    expect(restored.wordHistory.yomu.cardEncounters).toBeUndefined();
    expect(cardExposureCount(restored.wordHistory.yomu)).toBeUndefined();
    expect(cardExposureLabel(restored.wordHistory.yomu)).toBe("Card exposures not tracked yet");
    const ui = renderPractice(restored);
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(ui.state().wordHistory.yomu.cardEncounters).toBe(1);
    expect(ui.state().wordHistory.yomu.encounters).toBe(99);
  });

  it("ignores lookups, bookmarks, priority, and browsing, then deduplicates tokens per consumed card", () => {
    const ui = renderPractice(initialState());
    expect(ui.state().wordHistory).toEqual({});
    fireEvent.click(screen.getAllByRole("button", { name: "読む" })[0]);
    expect(screen.getByText("Card exposures not tracked yet")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save to Dictionary" }));
    fireEvent.click(screen.getByRole("button", { name: "Prioritize 読む" }));
    fireEvent.click(screen.getByRole("button", { name: "Save sentence" }));
    expect(ui.state().wordHistory.yomu.cardEncounters).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: "Go to card 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous card" }));
    expect(ui.state().wordHistory.yomu.cardEncounters).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(ui.state().wordHistory.yomu.cardEncounters).toBe(1);
    expect(ui.state().wordHistory.hon.cardEncounters).toBe(1);
    fireEvent.click(screen.getAllByRole("button", { name: "読む" })[0]);
    expect(screen.getByText("1 recorded card exposure")).toBeInTheDocument();
    expect(ui.state().wordHistory.yomu.cardEncounters).toBe(1);
  });

  it("counts repeated card IDs at new positions, but not a backward revisit to a consumed position", () => {
    const ui = renderPractice(initialState());
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous card" }));
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(ui.state().wordHistory.yomu.cardEncounters).toBe(1);
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    fireEvent.click(screen.getByRole("button", { name: "Complete lesson" }));
    expect(ui.state().wordHistory.yomu.cardEncounters).toBe(3);
    expect(ui.state().wordHistory.hon.cardEncounters).toBe(3);
  });

  it("persists counts and position deduplication through resume, and counts a new practice run", () => {
    const ui = renderPractice(initialState());
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    writeState(ui.state());
    ui.unmount();
    const restored = readState();
    expect(restored.wordHistory.yomu.cardEncounters).toBe(1);
    const resumed = renderPractice(restored);
    fireEvent.click(screen.getByRole("button", { name: "Previous card" }));
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(resumed.state().wordHistory.yomu.cardEncounters).toBe(1);
    const restarted = { ...resumed.state(), activeSession: restartLesson(resumed.state().activeSession!) };
    resumed.unmount();
    const again = renderPractice(restarted);
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(again.state().wordHistory.yomu.cardEncounters).toBe(2);
  });

  it("requires evidence that the current position was consumed before recording", () => {
    const previous = initialState();
    const inspected = { ...previous, wordHistory: touchWordHistory(previous, { wordIds: ["yomu"], kind: "token" }) };
    expect(recordCardExposures(previous, inspected, ["yomu"], 0)).toBe(inspected);
    const jumped = { ...inspected, activeSession: { ...inspected.activeSession!, cursor: 1 } };
    expect(recordCardExposures(previous, jumped, ["yomu"], 0)).toBe(jumped);
    const anotherSession = { ...jumped, activeSession: { ...jumped.activeSession!, id: "another-run", practicedIndices: [0] } };
    expect(recordCardExposures(previous, anotherSession, ["yomu"], 0)).toBe(anotherSession);
  });

  it("shows tracked card totals in the word collection without relabeling legacy touches", () => {
    const state = initialState();
    state.wordHistory = touchWordHistory(state, { wordIds: ["yomu", "hon"], kind: "reading" });
    state.wordHistory.yomu.encounters = 104;
    state.wordHistory.yomu.cardEncounters = 6;
    render(<LibraryWords state={state} query="" onPrioritize={vi.fn()} onBookmark={vi.fn()} onReview={vi.fn()} onBuild={vi.fn()} />);
    expect(screen.getByText("A1 · 6 recorded card exposures")).toBeInTheDocument();
    expect(screen.getByText("A1 · Card exposures not tracked yet")).toBeInTheDocument();
    expect(screen.queryByText(/104 encounters/)).not.toBeInTheDocument();
  });

  it.each(["topic", "vocabulary"] as const)("counts only practiced selected targets in a %s summary, joining reviewed aliases", source => {
    const state = initialState();
    const aliasCard: PracticeCard = { ...card, tokens: [
      { wordId: "iku", surface: "行く", reading: "いく", explain: "go" },
      { wordId: "ikimasu", surface: "いきます", reading: "いきます", explain: "go" },
      { wordId: "hon", surface: "本", reading: "ほん", explain: "book" },
    ] };
    state.activeSession = { ...state.activeSession!, source, cursor: 3, targetWordIds: ["iku", "ikimasu", "mizu"],
      practicedIndices: [0, 0, 1], scores: [true, true, true, true], savedCards: [aliasCard, aliasCard, card] };
    renderPractice(state);
    const targetSummary = screen.getByText("target words practiced").parentElement!;
    expect(within(targetSummary).getByText("1")).toBeInTheDocument();
    const cardSummary = screen.getByText("cards practiced").parentElement!;
    expect(within(cardSummary).getByText("2")).toBeInTheDocument();
  });
});
