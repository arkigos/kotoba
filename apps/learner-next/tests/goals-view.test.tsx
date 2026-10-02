import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { a1Milestones } from "../../../packages/dictionary/a1";
import { GoalsView } from "../src/GoalsView";
import { readState } from "../src/state";
import { setMilestone } from "../src/topic-course";
import type { LearnerState } from "../src/types";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function showProgress(state = readState()) {
  const actions = { onSave: vi.fn(), onRemove: vi.fn(), onNavigate: vi.fn(), onMilestone: vi.fn() };
  return { ...render(<GoalsView state={state} {...actions} />), actions };
}

describe("Progress", () => {
  it("keeps milestones and standards collapsed until requested", () => {
    const { actions } = showProgress();
    expect(screen.getByRole("heading", { name: "Progress" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Meet someone achieved" })).not.toBeVisible();
    expect(screen.getByRole("link", { name: "JF Can-do levels" })).not.toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Learn" }));
    expect(actions.onNavigate).toHaveBeenCalledWith("course");
    fireEvent.click(screen.getByText("About this progress"));
    expect(screen.getByRole("link", { name: "JF Can-do levels" })).toHaveAttribute("href", "https://www.jfstandard.jpf.go.jp/pdf/CEFR_Cando_Level_list.pdf");
    expect(screen.getByRole("link", { name: "Marugoto Starter A1 checks" })).toHaveAttribute("href", a1Milestones[0].sourceUrl);
    expect(screen.getByText(/do not certify proficiency/)).toBeVisible();
  });

  it("retains all ten A1 self-checks and updates only the learner-selected milestone", () => {
    let latest: LearnerState = readState();
    const initial = latest;
    function Harness() {
      const [state, setState] = useState(initial);
      latest = state;
      return <GoalsView state={state} onSave={vi.fn()} onRemove={vi.fn()} onNavigate={vi.fn()} onMilestone={(id, checked) => setState(current => setMilestone(current, id, checked))} />;
    }
    render(<Harness />);
    fireEvent.click(screen.getByText("A1 milestones"));
    expect(screen.getAllByRole("checkbox", { hidden: true })).toHaveLength(10);
    fireEvent.click(screen.getByText("Meet someone"));
    expect(screen.getByText(a1Milestones[0].task)).toBeVisible();
    const checkbox = screen.getByRole("checkbox", { name: "Meet someone achieved" });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(Object.keys(latest.a1Journey!.milestoneChecks)).toEqual(["introductions"]);
    expect(latest.wordHistory).toEqual(initial.wordHistory);
    expect(latest.unitProgress).toEqual(initial.unitProgress);
    expect(screen.getByRole("progressbar", { name: "A1 course words completed" })).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("link", { name: "Marugoto Can-do 1, 5" })).toHaveAttribute("href", a1Milestones[0].sourceUrl);
    expect(screen.getAllByRole("link").some(link => link.getAttribute("href")?.startsWith("#lesson/"))).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(latest.a1Journey!.milestoneChecks).toEqual({});
  });

  it("preserves adding, editing, removing, and practicing custom goals", () => {
    const state = { ...readState(), learningGoals: [{ id: "daily", metric: "cards" as const, period: "daily" as const, target: 20, createdAt: "2026-09-13T12:00:00Z" }] };
    const { actions } = showProgress(state);
    fireEvent.click(screen.getByRole("button", { name: "Edit 20 cards a day" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Goal target" }), { target: { value: "30" } });
    fireEvent.click(screen.getByRole("button", { name: "Save goal" }));
    expect(actions.onSave).toHaveBeenLastCalledWith(expect.objectContaining({ id: "daily", metric: "cards", period: "daily", target: 30 }));
    fireEvent.click(screen.getByRole("button", { name: "Add goal" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Goal measure" }), { target: { value: "reviews" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Goal period" }), { target: { value: "weekly" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Goal target" }), { target: { value: "12" } });
    fireEvent.click(screen.getByRole("button", { name: "Save goal" }));
    expect(actions.onSave).toHaveBeenLastCalledWith({ metric: "reviews", period: "weekly", target: 12 });
    fireEvent.click(screen.getByRole("button", { name: "Practice" }));
    expect(actions.onNavigate).toHaveBeenCalledWith("today");
    fireEvent.click(screen.getByRole("button", { name: "Remove 20 cards a day" }));
    expect(actions.onRemove).toHaveBeenCalledWith("daily");
  });

  it("enforces calendar-day target bounds and retains quick presets", () => {
    const { actions } = showProgress();
    fireEvent.click(screen.getByText("Quick goals"));
    fireEvent.click(screen.getByRole("button", { name: "20 cards a day" }));
    expect(actions.onSave).toHaveBeenCalledWith({ metric: "cards", period: "daily", target: 20 });
    actions.onSave.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Add goal" }));
    const form = screen.getByRole("form", { name: "New goal" });
    fireEvent.change(within(form).getByRole("combobox", { name: "Goal measure" }), { target: { value: "days" } });
    fireEvent.change(within(form).getByRole("combobox", { name: "Goal period" }), { target: { value: "weekly" } });
    const target = within(form).getByRole("spinbutton", { name: "Goal target" });
    expect(target).toHaveAttribute("max", "7");
    fireEvent.change(target, { target: { value: "8" } });
    fireEvent.click(within(form).getByRole("button", { name: "Save goal" }));
    expect(screen.getByRole("alert")).toHaveTextContent("within the shown range");
    expect(actions.onSave).not.toHaveBeenCalled();
    fireEvent.change(target, { target: { value: "7" } });
    fireEvent.click(within(form).getByRole("button", { name: "Save goal" }));
    expect(actions.onSave).toHaveBeenCalledWith({ metric: "days", period: "weekly", target: 7 });
  });
});
