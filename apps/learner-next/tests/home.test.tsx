import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { starterLessons, buildStarterLesson } from "../src/starter-lessons";
import { markLessonAlreadyKnown } from "../src/known-lesson";
import { getUnit } from "../src/curriculum";
import { setWordPriority } from "../src/review";
import { daysBack, readState, touchWordHistory } from "../src/state";
import { TodayView } from "../src/TodayView";
import type { ActiveSession, LearnerState } from "../src/types";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function lesson(id: string, cursor = 0): ActiveSession {
  const cards = getUnit(1).cards.slice(0, 4);
  return { id, title: "Family at home", source: "topic", startedAt: "2026-09-13T12:00:00Z", length: "quick", cursor, scores: [], savedCards: cards,
    items: cards.map(card => ({ cardId: card.id, prompt: "explore", reason: "Reading" })) };
}

function showHome(state = readState()) {
  const actions = { onMode: vi.fn(), onStart: vi.fn(), onResume: vi.fn(), onNavigate: vi.fn(), onBuild: vi.fn(), onBrowse: vi.fn(), onReview: vi.fn(),
    onOpenLesson: vi.fn(), onSaveLesson: vi.fn(), onRenameLesson: vi.fn(), onRemoveLesson: vi.fn() };
  return { ...render(<TodayView state={state} unit={getUnit(1)} mode="reading" {...actions} />), actions };
}

describe("Home", () => {
  it("gives a fresh learner one next step and only two secondary destinations", () => {
    const { actions } = showHome();
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
    const next = screen.getByRole("region", { name: "Your next step" });
    expect(within(next).getAllByRole("button")).toHaveLength(1);
    fireEvent.click(within(next).getByRole("button", { name: "Start foundations" }));
    expect(actions.onNavigate).toHaveBeenCalledWith("course");
    const shortcuts = screen.getByRole("navigation", { name: "More ways to practice" });
    expect(within(shortcuts).getAllByRole("button")).toHaveLength(2);
    fireEvent.click(within(shortcuts).getByRole("button", { name: "Activities" }));
    fireEvent.click(within(shortcuts).getByRole("button", { name: "My lessons" }));
    expect(actions.onNavigate.mock.calls.map(call => call[0])).toEqual(["course", "games", "lessons"]);
    expect(screen.getByRole("progressbar", { name: "A1 course words completed" })).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByLabelText("0 day streak")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Start lesson" })).not.toBeInTheDocument();
  });

  it("resumes the exact active lesson using its current cursor rather than a stale saved position", () => {
    const active = lesson("current", 2);
    const state = { ...readState(), activeSession: active, lessonHistory: [{ id: active.id, session: lesson("current", 0), savedAt: active.startedAt, lastOpenedAt: active.startedAt }] };
    const { actions } = showHome(state);
    expect(screen.getByRole("heading", { name: "Family at home" })).toBeInTheDocument();
    expect(screen.getByText("Card 3 of 4")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Resume lesson" }));
    expect(actions.onResume).toHaveBeenCalledOnce();
    expect(actions.onOpenLesson).not.toHaveBeenCalled();
    expect(actions.onStart).not.toHaveBeenCalled();
  });

  it("can resume a saved preview without requiring a previously active session", () => {
    const saved = lesson("saved-preview");
    const state = { ...readState(), lessonHistory: [{ id: saved.id, session: saved, savedAt: saved.startedAt, lastOpenedAt: saved.startedAt }] };
    const { actions } = showHome(state);
    fireEvent.click(screen.getByRole("button", { name: "Resume lesson" }));
    expect(actions.onOpenLesson).toHaveBeenCalledWith("saved-preview");
    expect(actions.onResume).not.toHaveBeenCalled();
  });

  it("offers a new topic after the current lesson ends", () => {
    showHome({ ...readState(), activeSession: lesson("completed", 4) });
    expect(screen.getByRole("button", { name: "Start foundations" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Resume lesson" })).not.toBeInTheDocument();
  });

  it("shows actual learned words and consecutive practice days without counting duplicates or future dates", () => {
    let state = readState();
    state = markLessonAlreadyKnown(state,buildStarterLesson(state,starterLessons[0].id));
    const days = daysBack(3);
    const practiced = { ...state, practiceDays: [days[1], days[2], days[2], "2099-01-01"] } satisfies LearnerState;
    showHome(practiced);
    expect(screen.getByRole("progressbar", { name: "A1 course words completed" })).toHaveAttribute("aria-valuenow", "6");
    expect(screen.getByRole("progressbar", { name: "A1 course words completed" })).toHaveAttribute("aria-valuemax", "753");
    expect(screen.getByLabelText("2 day streak")).toBeInTheDocument();
    const week = screen.getByRole("group", { name: "Last 7 days" });
    expect(within(week).getAllByLabelText(/: Practiced$/)).toHaveLength(2);
    expect(within(week).getAllByLabelText(/: No practice$/)).toHaveLength(5);
  });

  it("keeps word priorities from creating cross-topic review on Home", () => {
    const state = setWordPriority(readState(), "watashi", true);
    const { actions } = showHome(state);
    const shortcuts = screen.getByRole("navigation", { name: "More ways to practice" });
    expect(within(shortcuts).getAllByRole("button")).toHaveLength(2);
    expect(within(shortcuts).queryByRole("button",{name:/Review/})).not.toBeInTheDocument();
    expect(actions.onReview).not.toHaveBeenCalled();
  });
});
