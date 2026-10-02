import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GrammarLessons } from "../src/GrammarLessons";
import { PracticeSession } from "../src/PracticeSession";
import { buildGrammarLesson } from "../src/grammar-lesson";
import { grammarStatus } from "../src/grammar-progress";
import { readState } from "../src/state";
import type { LearnerState } from "../src/types";

beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe("grammar learning UI", () => {
  it("previews and saves explicit vocabulary without credit and switches cleanly", () => {
    const state = readState(), save = vi.fn();
    render(<GrammarLessons state={state} onStart={vi.fn()} onSave={save} />);
    fireEvent.click(screen.getByRole("button", { name: /Wanting something/ }));
    expect(screen.getByText("Preview 12 cards")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save grammar lesson" }));
    expect(save.mock.calls[0][0].grammarLessonId).toBe("want-object");
    expect(state.grammarHistory).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: /Wanting to do something/ }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save grammar lesson" }));
    expect(save.mock.calls[1][0].grammarLessonId).toBe("want-action");
  });
  it("credits actual player consumption and deduplicates a backward revisit", () => {
    let latest: LearnerState;
    function Harness() {
      const seed = readState();
      const [state, setState] = useState<LearnerState>({ ...seed, settings: { ...seed.settings, sound: false, autoplay: false, autoAdvance: false }, activeSession: buildGrammarLesson(seed, "want-action") });
      latest = state;
      return <PracticeSession state={state} onState={setState} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()} />;
    }
    render(<Harness />);
    expect(latest!.grammarHistory).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: "Go to card 2" }));
    expect(latest!.grammarHistory).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: "Previous card" }));
    for(let i = 0; i < 5; i++) fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(grammarStatus(latest!, "want-action").known).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(grammarStatus(latest!, "want-action")).toMatchObject({ known: true, due: false, encounters: 6 });
    fireEvent.click(screen.getByRole("button", { name: "Previous card" }));
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(grammarStatus(latest!, "want-action").encounters).toBe(6);
  });
});
