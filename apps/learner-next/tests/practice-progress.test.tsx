import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PracticeSession } from "../src/PracticeSession";
import { getUnit } from "../src/curriculum";
import { createSession } from "../src/engine";
import { readState } from "../src/state";
import type { LearnerState } from "../src/types";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function initialState() {
  const state = readState();
  const unit = getUnit(1);
  const session = createSession(1, "deep", state);
  return { ...state, completedUnits: [], unitProgress: { "1": { exposure: 0, mastery: 0, lastCardIndex: 0, viewedCardIds: [] } }, settings: { ...state.settings, autoplay: false, autoAdvance: false, sound: false }, activeSession: { ...session, cursor: unit.cards.length - 1 } } satisfies LearnerState;
}

describe("practice coverage after browsing", () => {
  it("counts a jump to the final card as one encounter instead of completing the unit", () => {
    let state: LearnerState = initialState();
    const unit = getUnit(1);
    render(<PracticeSession state={state} onState={update => { state = update(state); }} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Complete lesson" }));
    expect(state.unitProgress["1"].exposure).toBe(1 / unit.cards.length);
    expect(state.unitProgress["1"].viewedCardIds).toEqual([unit.cards.at(-1)!.id]);
    expect(state.completedUnits).not.toContain(1);
    expect(state.activeSession?.cursor).toBe(unit.cards.length);
  });

  it("does not inflate coverage when revisiting a sentence already seen", () => {
    const initial = initialState();
    const unit = getUnit(1);
    let state: LearnerState = { ...initial, unitProgress: { "1": { ...initial.unitProgress["1"], exposure: 1 / unit.cards.length, viewedCardIds: [unit.cards.at(-1)!.id] } } };
    render(<PracticeSession state={state} onState={update => { state = update(state); }} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Complete lesson" }));
    expect(state.unitProgress["1"].exposure).toBe(1 / unit.cards.length);
    expect(state.unitProgress["1"].viewedCardIds).toHaveLength(1);
  });

  it("completes the unit after its final unseen sentence is practiced", () => {
    const initial = initialState();
    const unit = getUnit(1);
    let state: LearnerState = { ...initial, unitProgress: { "1": { ...initial.unitProgress["1"], exposure: (unit.cards.length - 1) / unit.cards.length, viewedCardIds: unit.cards.slice(0, -1).map(card => card.id) } } };
    render(<PracticeSession state={state} onState={update => { state = update(state); }} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Complete lesson" }));
    expect(state.unitProgress["1"].exposure).toBe(1);
    expect(state.completedUnits).toContain(1);
  });
});
