import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getUnit } from "../src/curriculum";
import { LessonExplorer } from "../src/LessonExplorer";
import { PracticeSession } from "../src/PracticeSession";
import { TopicLessonDialog } from "../src/TopicLessonDialog";
import * as planner from "../src/topic-course";
import { readState } from "../src/state";
import type { ActiveSession, LearnerState } from "../src/types";

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function topicSession(): ActiveSession {
  const cards = getUnit(1).cards.slice(0, 3);
  const targetWordIds = [...new Set(cards.flatMap(card => card.tokens.flatMap(token => token.wordId ? [token.wordId] : [])))];
  const appearances = Object.fromEntries(targetWordIds.map(id => [id, cards.filter(card => card.tokens.some(token => token.wordId === id)).length]));
  return { id: "topic-boundaries", source: "topic", title: "A few patterns", length: "quick", mode: "reading",
    startedAt: "2026-09-13T12:00:00Z", cursor: 0, scores: [], savedCards: cards, targetWordIds,
    items: cards.map((card, index) => ({ cardId: card.id, prompt: "explore", reason: index === 2 ? "New sentence pattern or phrase" : "Words in context" })),
    lessonPlan: { version: 1, cardCount: 3, appearances, helperWordIds: [], newWordIds: targetWordIds, reviewWordIds: [],
      transitions: [
        { kind: "start", lexicalChanges: 0, grammarChanged: false, basis: "tokens" },
        { kind: "boundary", lexicalChanges: 3, grammarChanged: true, basis: "tokens" },
        { kind: "neighbor", lexicalChanges: 1, grammarChanged: false, basis: "tokens" },
      ] },
  };
}

function practiceState(session: ActiveSession): LearnerState {
  const state = readState();
  return { ...state, activeSession: session, settings: { ...state.settings, sound: false, autoplay: false, autoAdvance: false } };
}

describe("planned topic boundaries", () => {
  it.each(["topic", "vocabulary"] as const)("announces a planned %s boundary and clears the cue on the next small change", source => {
    function Harness() {
      const [state, setState] = useState(() => practiceState({ ...topicSession(), source }));
      return <PracticeSession state={state} onState={setState} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()} />;
    }
    render(<Harness />);
    expect(screen.queryByText("New pattern / phrase")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByRole("status")).toHaveTextContent("New pattern / phrase");
    expect(screen.getByText("Card 2 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.queryByText("New pattern / phrase")).not.toBeInTheDocument();
    expect(screen.getByText("Card 3 of 3")).toBeInTheDocument();
  });

  it.each([
    ["topic", "Reading", false],
    ["topic", "New sentence pattern or phrase", true],
    ["vocabulary", "New sentence pattern or phrase", false],
  ] as const)("keeps legacy %s rendering compatible with reason %s", (source, reason, visible) => {
    const session = topicSession();
    session.source = source; session.cursor = 1; session.lessonPlan = undefined; session.items[1].reason = reason;
    render(<PracticeSession state={practiceState(session)} onState={vi.fn()} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()} />);
    expect(!!screen.queryByText("New pattern / phrase")).toBe(visible);
  });

  it("keeps a boundary attached to its original card when browsing or filtering a saved lesson", () => {
    const session = topicSession();
    const onStart = vi.fn();
    render(<LessonExplorer session={session} state={readState()} onStart={onStart} onBack={vi.fn()} onSave={vi.fn()} onToast={vi.fn()} />);
    const boundary = screen.getByRole("button", { name: `Practice from card 2: ${session.savedCards![1].english}` });
    expect(within(boundary).getByText("New pattern / phrase")).toBeInTheDocument();
    expect(boundary).toHaveAttribute("aria-description", "New pattern or phrase");
    expect(screen.getAllByText("New pattern / phrase")).toHaveLength(1);
    fireEvent.change(screen.getByRole("textbox", { name: "Search lesson cards" }), { target: { value: "2" } });
    expect(screen.getAllByRole("button", { name: /^Practice from card/ })).toHaveLength(1);
    expect(screen.getByText("New pattern / phrase")).toBeInTheDocument();
    fireEvent.click(boundary);
    expect(onStart).toHaveBeenCalledWith(1, "reading");
  });

  it("marks the same planned boundary in the topic preview", async () => {
    const session = topicSession();
    vi.spyOn(planner, "buildTopicLesson").mockResolvedValue({ session, newWordIds: session.targetWordIds!, reviewWordIds: [], helperWordIds: [], appearances: session.lessonPlan!.appearances, contextCount: 3 });
    render(<TopicLessonDialog state={readState()} topicId="greetings" extras={false} onClose={vi.fn()} onStart={vi.fn()} />);
    fireEvent.click(screen.getByText("Lesson options"));
    fireEvent.click(await screen.findByText("Preview 3 cards"));
    const boundary = screen.getByText(session.savedCards![1].english).closest("li")!;
    expect(within(boundary).getByText("New pattern / phrase")).toBeInTheDocument();
    expect(screen.getAllByText("New pattern / phrase")).toHaveLength(1);
  });
});
