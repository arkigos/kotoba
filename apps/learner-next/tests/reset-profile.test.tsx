import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SettingsView } from "../src/DashboardViews";
import { readState, resetState, stateKey } from "../src/state";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

it("resets the complete profile and removes legacy sources without clearing unrelated storage", () => {
  const fresh = readState();
  const old = { ...fresh, displayName: "Experienced", xp: 300, completedUnits: [1],
    settings: { ...fresh.settings, sound: false },
    wordHistory: { old: { wordId: "old", encounters: 8 } },
    grammarHistory: { desire: { encounters: 8 } },
    reviewCards: { old: { lastPracticedAt: "2026-01-01" } },
    activeSession: { id: "old" }, lessonHistory: [{ id: "old" }], clearedLessons: [{ id: "old" }],
    savedWordIds: ["old"], savedSentenceIds: ["old"], savedGeneratedCards: { old: {} },
    savedMaterializedCards: { old: {} }, dailyPractice: { old: {} }, a1CoreHistory: { old: {} },
    a1Journey: { activeTopicIds: ["food"], milestoneChecks: { old: "done" } },
    activityResults: [{}], kanjiProgress: { old: {} }, learningGoals: [{}], practiceSessionCount: 25,
  };
  localStorage.setItem(stateKey, JSON.stringify(old));
  localStorage.setItem("kotoba.next.state.v2", JSON.stringify({ ...old, version: 2 }));
  localStorage.setItem("kotoba.progress.v1", JSON.stringify({ completedUnits: [1], unitId: 2 }));
  localStorage.setItem("unrelated", "keep");
  const reset = resetState();
  expect({ ...reset, joinedAt: fresh.joinedAt }).toEqual(fresh);
  expect(readState()).toEqual(reset);
  expect(localStorage.getItem("kotoba.next.state.v2")).toBeNull();
  expect(localStorage.getItem("kotoba.progress.v1")).toBeNull();
  expect(localStorage.getItem("unrelated")).toBe("keep");
  localStorage.removeItem(stateKey);
  expect(readState().wordHistory).toEqual({});
  expect(readState().completedUnits).toEqual([]);
});

it("does not delete migration sources when the fresh profile cannot be saved", () => {
  localStorage.setItem("kotoba.next.state.v2", "original");
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("unavailable"); });
  expect(() => resetState()).toThrow(/storage/i);
  expect(localStorage.getItem("kotoba.next.state.v2")).toBe("original");
});

it("requires explicit confirmation and lets the learner cancel", () => {
  const onReset = vi.fn();
  render(<SettingsView state={readState()} onSettings={vi.fn()} onExport={vi.fn()} onReset={onReset} />);
  fireEvent.click(screen.getByRole("button", { name: "Reset all data" }));
  expect(onReset).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("button", { name: "Delete all data and start over" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reset all data" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete all data and start over" }));
  expect(onReset).toHaveBeenCalledOnce();
});
