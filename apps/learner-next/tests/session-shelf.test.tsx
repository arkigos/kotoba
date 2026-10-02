import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LessonRows, LessonsView, RecentLessonShelf } from "../src/SessionShelf";
import { readState } from "../src/state";
import type { StoredLesson } from "../src/types";

const lesson: StoredLesson = {
  id: "custom-shelf", lastOpenedAt: "2026-09-13T12:00:00Z", savedAt: "2026-09-13T12:00:00Z",
  session: { id: "custom-shelf", source: "vocabulary", title: "Coffee words", length: "standard", startedAt: "2026-09-13T12:00:00Z", cursor: 1, scores: [true], practicedIndices: [0],
    items: [{ cardId: "a", prompt: "explore", reason: "Word practice" }, { cardId: "b", prompt: "explore", reason: "Word practice" }] },
};
const actions = () => ({ onOpenLesson: vi.fn(), onSaveLesson: vi.fn(), onRenameLesson: vi.fn(), onRemoveLesson: vi.fn() });

describe("visual lesson shelf", () => {
  beforeEach(() => localStorage.clear());

  it("keeps the empty page short and points to topic selection", () => {
    const onBuild = vi.fn();
    render(<LessonsView state={readState()} onBuild={onBuild} {...actions()} />);
    expect(screen.getByRole("heading", { name: "No lessons yet" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Filter lessons" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open the course" }));
    expect(onBuild).toHaveBeenCalledOnce();
  });

  it("keeps resume, save, browse, rename, and remove accessible", () => {
    const callbacks = actions();
    render(<LessonRows lessons={[lesson]} {...callbacks} />);
    fireEvent.click(screen.getByRole("button", { name: "Resume Coffee words" }));
    expect(callbacks.onOpenLesson).toHaveBeenCalledWith(lesson.id);
    fireEvent.click(screen.getByRole("button", { name: "Unsave lesson: Coffee words" }));
    expect(callbacks.onSaveLesson).toHaveBeenCalledWith(lesson.id, false);
    expect(screen.getByRole("progressbar", { name: "Coffee words cards practiced" })).toHaveAttribute("aria-valuenow", "1");
    expect(screen.queryByRole("button", { name: "Rename Coffee words" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "More options for Coffee words" }));
    fireEvent.click(screen.getByRole("button", { name: "Browse Coffee words" }));
    expect(callbacks.onOpenLesson).toHaveBeenLastCalledWith(lesson.id, true);
    fireEvent.click(screen.getByRole("button", { name: "More options for Coffee words" }));
    fireEvent.click(screen.getByRole("button", { name: "Rename Coffee words" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Lesson name" }), { target: { value: "Café Japanese" } });
    fireEvent.click(screen.getByRole("button", { name: /^Save$/ }));
    expect(callbacks.onRenameLesson).toHaveBeenCalledWith(lesson.id, "Café Japanese");
    fireEvent.click(screen.getByRole("button", { name: "More options for Coffee words" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove lesson: Coffee words" }));
    expect(callbacks.onRemoveLesson).toHaveBeenCalledWith(lesson.id);
  });

  it("shows the recent shelf only when there is a lesson to resume", () => {
    const state = readState();
    const view = render(<RecentLessonShelf state={state} {...actions()} onAllLessons={vi.fn()} />);
    expect(screen.queryByRole("region", { name: "Saved and recent lessons" })).not.toBeInTheDocument();
    view.rerender(<RecentLessonShelf state={{ ...state, lessonHistory: [lesson] }} {...actions()} onAllLessons={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Resume Coffee words" })).toBeInTheDocument();
    expect(screen.queryByText(/saved automatically/i)).not.toBeInTheDocument();
  });
});
