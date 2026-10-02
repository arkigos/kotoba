import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import { getUnit, loadUnit } from "../src/curriculum";
import { readState, stateKey } from "../src/state";
import { createGeneratedSession, generateLesson, prepareSession, resolveSessionCard } from "../src/generated";
import { savedSentenceSession } from "../src/saved-session";
import { LessonExplorer } from "../src/LessonExplorer";
import type { ActiveSession, CardToken, PracticeCard } from "../src/types";

function materializedCard(id: string, tokens: CardToken[], english: string): PracticeCard {
  return { id, tokens, english, line: tokens.map(token => token.surface), tts: tokens.map(token => token.reading), explain: tokens.map(token => token.explain) };
}
function topicSnapshot(): ActiveSession {
  const cards = [
    materializedCard("alias", [{ wordId: "ikimasu", surface: "いきます", reading: "いきます", explain: "go" }], "go"),
    materializedCard("lemma", [{ wordId: "iku", surface: "行く", reading: "いく", explain: "go" }], "go"),
    materializedCard("context", [
      { wordId: "watashi", surface: "私", reading: "わたし", explain: "I" },
      { surface: "は", reading: "わ", explain: "topic" },
      { wordId: "yomu", surface: "読みます", reading: "よみます", explain: "read" },
    ], "I read"),
  ];
  return { id: "topic-explorer", source: "topic", title: "My focused lesson", targetWordIds: ["iku", "yomu"],
    startedAt: "2026-09-13T12:00:00Z", length: "standard", mode: "reading", cursor: 0, scores: [], savedCards: cards,
    items: cards.map(card => ({ cardId: card.id, prompt: "explore", reason: "Practice" })),
    lessonPlan: { version: 1, cardCount: 3, appearances: { iku: 2, yomu: 1 }, helperWordIds: ["watashi"], newWordIds: ["iku"], reviewWordIds: ["yomu"] } };
}

describe("Lesson explorer", () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = "#lesson/1";
    const state = readState();
    localStorage.setItem(stateKey, JSON.stringify({ ...state, settings: { ...state.settings, autoplay: false, sound: false } }));
  });

  it("deep links to all bilingual sentences and launches the exact selected point", async () => {
    window.location.hash = "#lesson/3";
    const unit = await loadUnit(3);
    render(<App />);
    const sentences = await screen.findByRole("region", { name: "All lesson sentences" });
    expect(within(sentences).getAllByRole("button", { name: /^Practice from sentence/ })).toHaveLength(unit.cards.length);
    expect(within(sentences).getByText(unit.cards[19].english)).toBeInTheDocument();
    fireEvent.click(within(sentences).getByRole("button", { name: `Practice from sentence 20: ${unit.cards[19].english}` }));
    expect(await screen.findByText(`Card 20 of ${unit.cards.length}`)).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(stateKey)!).activeSession.cursor).toBe(19));
  });

  it("saves without launching and filters Japanese, English, and saved sentences", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Save sentence 2" }));
    expect(screen.getByRole("button", { name: "Unsave sentence 2" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Saved" }));
    expect(screen.getAllByRole("button", { name: /^Practice from sentence/ })).toHaveLength(1);
    fireEvent.change(screen.getByRole("textbox", { name: "Search lesson sentences" }), { target: { value: "not-in-this-lesson" } });
    expect(screen.getByRole("heading", { name: "No matching sentences" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show all sentences" }));
    expect(screen.getAllByRole("button", { name: /^Practice from sentence/ })).toHaveLength(getUnit(1).cards.length);
    expect(window.location.hash).toBe("#lesson/1");
  });

  it("keeps the generated snapshot and identity when starting from its list", async () => {
    const state = readState();
    const snapshot = generateLesson("classroom", ["yomu.default", "kaku.default"], 42);
    const session = createGeneratedSession(snapshot, state);
    localStorage.setItem(stateKey, JSON.stringify({ ...state, activeSession: session }));
    window.location.hash = "#lesson/session";
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: `Practice from sentence 5: ${snapshot.cards[4].english}` }));
    expect(await screen.findByText(`Card 5 of ${snapshot.cards.length}`)).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem(stateKey)!);
    expect(saved.activeSession.id).toBe(session.id);
    expect(saved.activeSession.snapshot).toEqual(snapshot);
    expect(saved.currentUnitId).toBe(1);
  });

  it("replays a separately saved generated sentence without generating replacements", async () => {
    const snapshot = generateLesson("classroom", ["yomu.default", "kaku.default"], 42);
    const card = snapshot.cards[5];
    const session = savedSentenceSession({ card, title: snapshot.recipe.title, recipeId: snapshot.recipe.id }, readState());
    await expect(prepareSession(session)).resolves.toBeUndefined();
    expect(resolveSessionCard(session)).toEqual(card);
    expect(session.items).toHaveLength(1);
    expect(session.unitId).toBeUndefined();
  });

  it("shows selected targets and stored exposure counts separately from supporting words, including alias cards in filters", () => {
    const session = topicSnapshot();
    const onStart = vi.fn();
    const onBack = vi.fn();
    render(<LessonExplorer session={session} state={readState()} onStart={onStart} onBack={onBack} onSave={vi.fn()} onToast={vi.fn()} />);
    expect(screen.getByText("2 target words")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "All lesson cards" })).toBeInTheDocument();
    const targets = screen.getByLabelText("Target vocabulary");
    fireEvent.click(within(targets).getByText("Target words"));
    expect(within(targets).getAllByRole("button")).toHaveLength(2);
    expect(within(targets).getByText("2 appearances")).toBeInTheDocument();
    expect(within(targets).getByText("1 appearance")).toBeInTheDocument();
    expect(within(targets).queryByText("私")).not.toBeInTheDocument();
    const helpers = screen.getByLabelText("Supporting vocabulary");
    fireEvent.click(within(helpers).getByText("Supporting words and grammar"));
    expect(within(helpers).getAllByRole("button")).toHaveLength(1);
    expect(within(helpers).getByText("私")).toBeInTheDocument();
    fireEvent.click(within(targets).getByRole("button", { name: /^行く / }));
    expect(screen.getAllByRole("button", { name: /^Practice from card/ })).toHaveLength(2);
    expect(screen.getByText("2 of 3 cards")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Practice from card 1: go" }));
    expect(onStart).toHaveBeenCalledWith(0, "reading");
    fireEvent.click(screen.getByRole("button", { name: "Back to My lessons" }));
    expect(onBack).toHaveBeenCalled();
  });

  it("keeps reference targets visible from the saved snapshot when dictionary metadata has not loaded", () => {
    const session = topicSnapshot();
    const card = materializedCard("reference-card", [{ wordId: "jmdict:999000012", surface: "専門語", reading: "せんもんご", explain: "specialist term" }], "specialist term");
    const reference: ActiveSession = { ...session, source: "vocabulary", lessonPlan: undefined, targetWordIds: ["jmdict:999000012"], savedCards: [card], items: [{ cardId: card.id, prompt: "explore", reason: "Practice" }] };
    render(<LessonExplorer session={reference} state={readState()} onStart={vi.fn()} onBack={vi.fn()} onSave={vi.fn()} onToast={vi.fn()} />);
    const targets = screen.getByLabelText("Target vocabulary");
    fireEvent.click(within(targets).getByText("Target words"));
    expect(within(targets).getByRole("button", { name: "専門語 specialist term 1 appearance" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Supporting vocabulary")).not.toBeInTheDocument();
  });
});
