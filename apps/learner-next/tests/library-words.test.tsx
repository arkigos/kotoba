import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LibraryWords } from "../src/LibraryWords";
import { DictionaryEntryPanel } from "../src/DictionaryView";
import { readState } from "../src/state";
import type { LearnerState, WordHistory } from "../src/types";

function history(wordId: string, unitIds: number[]): WordHistory {
  return { wordId, unitIds, firstSeenAt: "2020-01-01T00:00:00Z", lastSeenAt: "2020-01-01T00:00:00Z", encounters: 1, correct: 0, misses: 0, rating: "learning", interactionKinds: ["reading"] };
}
function pool(): LearnerState {
  const state = readState();
  state.wordHistory = { watashi: history("watashi", [1]), yomu: history("yomu", []) };
  return state;
}

describe("word collection actions", () => {
  beforeEach(() => localStorage.clear());

  it("keeps course reviews usable when a collection also has words outside the course", () => {
    const onReview = vi.fn();
    const onBuild = vi.fn();
    const state = pool();
    state.wordHistory = { watashi: history("watashi", [1]), fw_desu: history("fw_desu", []) };
    render(<LibraryWords state={state} query="" onPrioritize={vi.fn()} onBookmark={vi.fn()} onReview={onReview} onBuild={onBuild} />);
    fireEvent.click(screen.getByText("Topic review"));
    fireEvent.click(screen.getByRole("button", { name: "Find review topic" }));
    expect(onReview).toHaveBeenCalledWith({ wordIds: ["watashi"], mode: "mixed", count: 10, label: "All words" });
    fireEvent.click(screen.getByRole("button", { name: "Find lessons" }));
    expect(new Set(onBuild.mock.calls[0][0])).toEqual(new Set(["watashi", "fw_desu"]));
  });

  it("keeps an explicit selection across filters and acts only on those words", () => {
    const onPrioritize = vi.fn();
    const onBuild = vi.fn();
    const props = { state: pool(), onPrioritize, onBookmark: vi.fn(), onReview: vi.fn(), onBuild };
    const { rerender } = render(<LibraryWords {...props} query="" />);
    fireEvent.click(screen.getByRole("button", { name: "Select words" }));
    expect(screen.getByRole("button", { name: "Find lessons" })).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select 読む" }));
    rerender(<LibraryWords {...props} query="私" />);
    fireEvent.click(screen.getByRole("button", { name: "Prioritize" }));
    expect(onPrioritize.mock.calls).toEqual([["yomu"]]);
    fireEvent.click(screen.getByRole("button", { name: "Find lessons" }));
    expect(onBuild.mock.calls).toEqual([[["yomu"]]]);
    fireEvent.click(screen.getByText("Topic review"));
    fireEvent.click(screen.getByRole("button", { name: "Find review topic" }));
    expect(props.onReview.mock.calls[0][0].wordIds).toEqual(["yomu"]);
  });

  it("offers course sentences for saved course words before their first practice", () => {
    const onReview = vi.fn();
    const state = pool();
    state.wordHistory = { yomu: { ...history("yomu", []), encounters: 0, interactionKinds: ["saved"] } };
    render(<LibraryWords state={state} query="" onPrioritize={vi.fn()} onBookmark={vi.fn()} onReview={onReview} onBuild={vi.fn()} />);
    fireEvent.click(screen.getByText("Topic review"));
    fireEvent.click(screen.getByRole("button", { name: "Find review topic" }));
    expect(onReview.mock.calls[0][0].wordIds).toEqual(["yomu"]);
    expect(state.wordHistory.yomu.unitIds).toEqual([]);
  });

  it("creates a lesson from any selected word without sentence eligibility", () => {
    const onBuild = vi.fn();
    const state = pool();
    state.wordHistory = { fw_desu: history("fw_desu", []) };
    render(<LibraryWords state={state} query="" onPrioritize={vi.fn()} onBookmark={vi.fn()} onReview={vi.fn()} onBuild={onBuild} />);
    fireEvent.click(screen.getByRole("button", { name: "Find lessons" }));
    expect(onBuild).toHaveBeenCalledWith(["fw_desu"]);
  });

  it("preserves the chosen learning form when saving from dictionary details", async () => {
    const onAddWord = vi.fn();
    render(<DictionaryEntryPanel entryId="ikimasu" onAddWord={onAddWord} onClose={vi.fn()} />);
    const formChoices = await screen.findByRole("group", { name: "Learning word form" });
    expect(within(formChoices).getByRole("button", { pressed: true })).toHaveTextContent("いきます");
    fireEvent.click(screen.getByRole("button", { name: "Save to my words" }));
    expect(onAddWord.mock.calls).toEqual([["ikimasu"]]);
  });

  it("filters the practice selection using word type and reviewed topic metadata", () => {
    const state = pool();
    state.wordHistory.pan = history("pan", [2]);
    const onBuild = vi.fn();
    render(<LibraryWords state={state} query="" onPrioritize={vi.fn()} onBookmark={vi.fn()} onReview={vi.fn()} onBuild={onBuild} />);
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.click(within(screen.getByRole("group", { name: "Word type" })).getByRole("button", { name: "Verbs" }));
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 私" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Find lessons" }));
    expect(onBuild.mock.calls[0][0]).toEqual(["yomu"]);
    fireEvent.click(screen.getByRole("button", { name: "Reset extra filters" }));
    fireEvent.click(screen.getByText("Dictionary tags & topics"));
    fireEvent.click(within(screen.getByRole("group", { name: "Word tags" })).getByRole("button", { name: "Food" }));
    fireEvent.click(screen.getByRole("button", { name: "Find lessons" }));
    expect(onBuild.mock.calls[1][0]).toEqual(["pan"]);
  });
});
