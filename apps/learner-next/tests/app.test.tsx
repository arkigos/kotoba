import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { practiceFixture } from "./fixtures";
import { App } from "../src/App";
import { getUnit, loadUnit } from "../src/curriculum";
import { readState, stateKey, writeState } from "../src/state";
import { createSession } from "../src/engine";
import { vocabularySession } from "../src/topic-course";

describe("Kotoba Next shell", () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = "#today";
  });

  it("opens the legacy today link as a focused Home experience", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start foundations" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Lesson mode" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("navigation", { name: "Primary navigation" })).toHaveLength(2);
    expect(screen.getByRole("progressbar", { name: "A1 course words completed" })).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("group", { name: "Last 7 days" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Notifications" })).not.toBeInTheDocument();
  });

  it("keeps My words empty until practice and disables empty reviews", async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Dictionary" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /^My words/ }));
    expect(screen.getByRole("heading", { name: "No words yet" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Topic review"));
    expect(screen.getByRole("button", { name: "Find review topic" })).toBeDisabled();
    fireEvent.click(screen.getAllByRole("button", { name: "Home" })[0]);
    const shortcuts = within(screen.getByRole("navigation", { name: "More ways to practice" }));
    expect(shortcuts.queryByRole("button", { name: /^Review/ })).not.toBeInTheDocument();
    expect(shortcuts.getByRole("button", { name: "Activities" })).toBeInTheDocument();
  });

  it("offers curated topics and foundations without a free-form builder", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Learn" })[0]);
    expect(screen.getByRole("heading", { name: "Learn Japanese" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "A1 topics" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Things, food, and choices Describe your surroundings/ })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Custom" })).not.toBeInTheDocument();
    expect(screen.queryByRole("searchbox", { name: "Find words for your lesson" })).not.toBeInTheDocument();
  });

  it("opens the same topic from search again after its preview is closed", async () => {
    render(<App />);
    for (let visit = 0; visit < 2; visit += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Search Kotoba" }));
      fireEvent.change(screen.getByRole("textbox", { name: "Search topics and lessons" }), { target: { value: "food" } });
      fireEvent.click(screen.getByRole("button", { name: "Things, food, and choices" }));
      const dialog = await screen.findByRole("region", { name: "Things, food, and choices" });
      expect(within(dialog).getByRole("heading", { name: "Things, food, and choices" })).toBeInTheDocument();
      fireEvent.click(within(dialog).getByRole("button", { name: "All A1 tracks" }));
      expect(screen.queryByRole("region", { name: "Things, food, and choices" })).not.toBeInTheDocument();
    }
  });

  it("changes the preset inside the player and resumes without restarting", async () => {
    const state = readState();
    const session = await vocabularySession(["koohii", "mizu"], state, "Everyday phrases");
    session.mode = "reading";
    writeState({ ...state, activeSession: session });
    window.location.hash = "#practice";
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Next card" }));
    fireEvent.click(screen.getByRole("button", { name: "Lesson settings" }));
    fireEvent.click(screen.getByRole("button", { name: /Recall English first/ }));
    fireEvent.click(screen.getByRole("button", { name: "Return to card" }));
    fireEvent.click(screen.getByRole("button", { name: "Pause and leave lesson" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Home" })[0]);
    expect(screen.queryByRole("group", { name: "Lesson mode" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Resume lesson" }));
    await screen.findByRole("button", { name: "Show Japanese" });
    expect(screen.getByText(`Card 2 of ${session.items.length}`)).toBeInTheDocument();
    expect(screen.getByText(session.savedCards![1].english)).toBeInTheDocument();
  });

  it("navigates across the full product shell", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Learn" })[0]);
    expect(screen.getByRole("heading", { name: "Learn Japanese" })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Progress" })[0]);
    expect(screen.getByRole("heading", { name: "Progress" })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Dictionary" })[0]);
    expect(screen.getByRole("heading", { name: "Dictionary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Browse" })).toHaveClass("active");
    fireEvent.click(screen.getAllByRole("button", { name: "Settings" })[0]);
    expect(screen.getByText("Practice settings")).toBeInTheDocument();
  });

  it("shares the header theme setting between a lesson and the app without moving the card", async () => {
    const state = readState();
    const session = await vocabularySession(["koohii", "mizu"], state, "Theme check");
    writeState({ ...state, settings: { ...state.settings, theme: "light", autoplay: false }, activeSession: session });
    window.location.hash = "#practice";
    render(<App />);
    await screen.findByRole("button", { name: "Pause and leave lesson" });
    fireEvent.click(await screen.findByRole("button", { name: "Use dark theme" }));
    expect(screen.getByRole("main")).toHaveAttribute("data-theme", "dark");
    expect(readState().activeSession?.cursor).toBe(session.cursor);
    fireEvent.click(screen.getByRole("button", { name: "Pause and leave lesson" }));
    fireEvent.click(await screen.findByRole("button", { name: "Use light theme" }));
    expect(readState().settings.theme).toBe("light");
    expect(readState().activeSession?.cursor).toBe(session.cursor);
  });

  it("starts the complete authored deck at the exact saved card", async () => {
    const unit = await loadUnit(3);
    const state = practiceFixture();
    state.activeSession = createSession(3, "deep", state);
    localStorage.setItem(stateKey, JSON.stringify(state));
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Resume lesson" }));

    await screen.findByRole("button", { name: "Next card" });
    expect(screen.getByText(`Card ${state.unitProgress["3"].lastCardIndex + 1} of ${unit.cards.length}`)).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveClass("lesson-shell");
    await waitFor(() => expect(JSON.parse(localStorage.getItem(stateKey) ?? "null")?.activeSession?.items).toHaveLength(unit.cards.length));
  });

  it("persists card-by-card navigation and resumes at that exact position", async () => {
    const unit = getUnit(1);
    const state = readState();
    localStorage.setItem(stateKey, JSON.stringify({
      ...state,
      currentUnitId: 1,
      activeSession: createSession(1, "deep", state),
      unitProgress: { ...state.unitProgress, "1": { exposure: 0, mastery: 0, lastCardIndex: 0 } },
    }));
    window.location.hash = "#practice";
    render(<App />);
    await screen.findByRole("button", { name: "Next card" });
    expect(screen.getByText(`Card 1 of ${unit.cards.length}`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    expect(await screen.findByText(`Card 2 of ${unit.cards.length}`)).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(stateKey) ?? "null").unitProgress["1"].lastCardIndex).toBe(1));

    fireEvent.click(screen.getByRole("button", { name: "Pause and leave lesson" }));
    fireEvent.click(screen.getAllByRole("button", { name: "Home" })[0]);
    fireEvent.click(await screen.findByRole("button", { name: /Resume lesson/i }));
    await screen.findByRole("button", { name: "Next card" });
    expect(await screen.findByText(`Card 2 of ${unit.cards.length}`)).toBeInTheDocument();
  });

  it("routes encountered-word review to its authored topic", async () => {
    localStorage.setItem(stateKey, JSON.stringify(practiceFixture()));
    const { unmount } = render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Dictionary" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /^My words/ }));
    await screen.findByText("36 words");
    fireEvent.click(within(screen.getByRole("group", { name: "Filter words" })).getByRole("button", { name: /^Prioritized/ }));
    expect(screen.getByRole("heading", { name: "Prioritized words" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Topic review"));
    const schedule = vi.spyOn(window, "setTimeout");
    const cancel = vi.spyOn(window, "clearTimeout");
    try {
      fireEvent.click(screen.getByRole("button", { name: "Find review topic" }));
      expect(await screen.findByRole("heading", { name: "Learn Japanese" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Review this track" })).toBeInTheDocument();
      expect(screen.queryByText(/Card 1 of/)).not.toBeInTheDocument();
      const toastCall = schedule.mock.calls.findIndex(([, delay]) => delay === 3300);
      expect(toastCall).toBeGreaterThanOrEqual(0);
      const timer = schedule.mock.results[toastCall].value;
      unmount();
      expect(cancel).toHaveBeenCalledWith(timer);
    } finally {
      schedule.mockRestore();
      cancel.mockRestore();
    }
  });

  it("keeps word audio and priority controls inside the token inspector", async () => {
    const state = readState();
    const kana = await loadUnit(101);
    localStorage.setItem(stateKey, JSON.stringify({
      ...state,
      currentUnitId: 101,
      activeSession: undefined,
      unitProgress: { ...state.unitProgress, "101": { exposure: 0, mastery: 0, lastCardIndex: 0 } },
    }));
    const playAudio = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    window.location.hash = "#lesson/101";
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: /Start lesson/i }));
    await screen.findByRole("button", { name: "Next card" });
    expect(screen.getByText(`Card 1 of ${kana.cards.length}`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play card audio" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "あ" }));
    expect(screen.getByRole("button", { name: "Play pronunciation for あ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Prioritize あ" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Prioritize あ" }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem(stateKey) ?? "null").wordHistory.hiragana_a.prioritized).toBe(true));
    playAudio.mockRestore();
  });

  it("flips a card, changes the Japanese display, and never asks for typed Japanese", async () => {
    const state = readState();
    localStorage.setItem(stateKey, JSON.stringify({
      ...state,
      currentUnitId: 1,
      activeSession: createSession(1, "deep", state),
      unitProgress: { ...state.unitProgress, "1": { exposure: 0, mastery: 0, lastCardIndex: 0 } },
    }));
    window.location.hash = "#practice";
    render(<App />);
    await screen.findByRole("button", { name: "Next card" });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show English" }));
    expect(screen.getByText(getUnit(1).cards[0].english)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Lesson settings" }));
    fireEvent.click(screen.getByRole("button", { name: /Romaji/i }));
    fireEvent.click(screen.getByRole("button", { name: "Return to card" }));
    fireEvent.click(screen.getByRole("button", { name: "Show Japanese" }));
    expect(screen.getByText("watashi")).toBeInTheDocument();
  });

  it("keeps the original lesson settings inside the active lesson and persists them", async () => {
    const state = readState();
    localStorage.setItem(stateKey, JSON.stringify({
      ...state,
      settings: { ...state.settings, autoplay: false, autoAdvance: false, audioLanguage: "japanese", lessonDefaultFace: "japanese", autoAdvanceOrder: "sequential", autoAdvanceDelayMs: 5000 },
      activeSession: {
        id: "settings-test",
        unitId: 1,
        length: "quick",
        startedAt: new Date().toISOString(),
        cursor: 0,
        items: [{ cardId: "u001-c001", unitId: 1, prompt: "explore", reason: "Settings" }],
        scores: [],
        source: "library",
        title: "Settings test",
        mode: "reading",
      },
    }));
    window.location.hash = "#practice";
    const playAudio = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: "Lesson settings" }));
    expect(screen.getByRole("dialog", { name: "Lesson settings" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("switch", { name: "Auto play audio" }));
    await waitFor(() => expect(playAudio).toHaveBeenCalled());
    fireEvent.click(within(screen.getByRole("group", { name: "Audio language" })).getByRole("button", { name: /English Always play English/i }));
    fireEvent.click(within(screen.getByRole("group", { name: "Default card face" })).getByRole("button", { name: /Audio only Listen first/i }));
    fireEvent.click(screen.getByRole("switch", { name: "Auto advance" }));
    fireEvent.click(within(screen.getByRole("group", { name: "Auto advance order" })).getByRole("button", { name: "Random" }));
    fireEvent.click(screen.getByRole("button", { name: "Increase auto advance delay" }));

    expect(screen.getByRole("button", { name: "Play english audio" })).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(stateKey) ?? "null").settings).toMatchObject({
      autoplay: true,
      audioLanguage: "english",
      lessonDefaultFace: "hidden",
      autoAdvance: true,
      autoAdvanceOrder: "random",
      autoAdvanceDelayMs: 6000,
    }));
    playAudio.mockRestore();
  });

  it("finishes a flashcard deck without quiz grading", async () => {
    const state = readState();
    localStorage.setItem(stateKey, JSON.stringify({
      ...state,
      activeSession: {
        id: "one-card-review",
        unitId: 1,
        length: "quick",
        startedAt: new Date().toISOString(),
        cursor: 0,
        items: [{ cardId: "u001-c001", unitId: 1, prompt: "explore", reason: "One card" }],
        scores: [],
        source: "library",
        title: "One card review",
        mode: "reading",
      },
    }));
    window.location.hash = "#practice";
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Complete lesson" }));
    expect(await screen.findByRole("heading", { name: "Review complete" })).toBeInTheDocument();
    expect(screen.queryByText(/accuracy|correct|wrong/i)).not.toBeInTheDocument();
  });
});
