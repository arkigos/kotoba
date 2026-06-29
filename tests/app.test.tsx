import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import unit001 from "../data/jp/curriculum/units/unit_001.json";
import unit002 from "../data/jp/curriculum/units/unit_002.json";
import unit003 from "../data/jp/curriculum/units/unit_003.json";
import unit004 from "../data/jp/curriculum/units/unit_004.json";
import unit005 from "../data/jp/curriculum/units/unit_005.json";
import unit006 from "../data/jp/curriculum/units/unit_006.json";
import unit007 from "../data/jp/curriculum/units/unit_007.json";

function spokenCalls() {
  return (window.speechSynthesis.speak as unknown as { mock: { calls: Array<[SpeechSynthesisUtterance]> } }).mock.calls;
}

function lastSpoken() {
  return spokenCalls().at(-1)?.[0];
}

describe("practice player", () => {
  beforeEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    Object.assign(window, {
      speechSynthesis: {
        cancel: vi.fn(),
        speak: vi.fn(),
      },
    });
  });

  it("opens directly into the learner-titled practice experience", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Unit 1: First Sentences" })).toBeInTheDocument();
    expect(screen.getByText(/Aです/)).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "私です。");
  });

  it("groups units under expandable course levels", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Levels")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /A1 Survival Foundations/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /A2 Everyday Control/i })).toHaveAttribute("aria-expanded", "false");

    await user.click(screen.getByRole("button", { name: /A2 Everyday Control/i }));
    await user.click(screen.getByRole("button", { name: /Unit 21: Polite Verbs/i }));

    expect(await screen.findByRole("heading", { name: "Unit 21: Polite Verbs, Non-Past" })).toBeInTheDocument();
    expect(screen.getByText(/Vます/)).toBeInTheDocument();
  });

  it("defaults to Japanese autoplay audio", () => {
    render(<App />);
    expect(lastSpoken()).toMatchObject({ text: "私です。", lang: "ja-JP" });
  });

  it("supports English and both-language audio modes", () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /settings/i }));
    fireEvent.change(screen.getByRole("combobox", { name: /audio/i }), { target: { value: "english" } });
    fireEvent.click(screen.getByRole("button", { name: /^audio$/i }));
    expect(lastSpoken()).toMatchObject({ text: "It's me.", lang: "en-US" });

    fireEvent.change(screen.getByRole("combobox", { name: /audio/i }), { target: { value: "both" } });
    fireEvent.click(screen.getByRole("button", { name: /^audio$/i }));
    expect(lastSpoken()).toMatchObject({ text: "私です。", lang: "ja-JP" });
    (lastSpoken() as SpeechSynthesisUtterance & { onend: () => void }).onend();
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(lastSpoken()).toMatchObject({ text: "It's me.", lang: "en-US" });
    vi.useRealTimers();
  });

  it("plays the clicked Japanese word piece", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Play 私" }));
    expect(lastSpoken()).toMatchObject({ text: "わたし", lang: "ja-JP" });
  });

  it("shows Japanese, romaji, and English meaning in token tooltips", () => {
    render(<App />);

    const token = screen.getByRole("button", { name: "Play 私" });
    expect(token).toHaveTextContent("私");
    expect(token).toHaveTextContent("watashi");
    expect(token).toHaveTextContent("I; me");
    expect(token).not.toHaveTextContent("わたし");
  });

  it("reveals English and navigates cards", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /show english/i }));
    expect(screen.getByText("It's me.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "学生です。");
    expect(screen.queryByText("It's me.")).not.toBeInTheDocument();
  });

  it("persists settings, display mode, and per-unit card position", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.selectOptions(screen.getByRole("combobox", { name: /japanese display/i }), "kana");
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    const saved = window.localStorage.getItem("kotoba.progress.v1");
    expect(saved).toContain('"japaneseDisplay":"kana"');
    expect(saved).toContain('"cardPositions":{"1":1}');
  });

  it("can start cards revealed by default", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByLabelText(/start revealed/i));
    expect(screen.getByText("It's me.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByText("I'm a student.")).toBeInTheDocument();
  });

  it("applies study mode presets without adding footer clutter", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByRole("button", { name: "Listening" }));
    expect(screen.getByLabelText("Prompt text hidden")).toBeInTheDocument();
    expect(screen.getByText("Listening mode")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /hide image/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Recall" }));
    expect(screen.getByText("It's me.")).toBeInTheDocument();
    expect(screen.getByLabelText("Image prompt")).toHaveAttribute("hidden");
    expect(screen.getByRole("button", { name: /show japanese/i })).toBeInTheDocument();
  });

  it("supports English-first cards and romaji readings", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.getByRole("option", { name: "Kanji/kana" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Hiragana" })).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: /front side/i }), "english");
    await user.selectOptions(screen.getByRole("combobox", { name: /japanese display/i }), "romaji");

    expect(screen.getByText("It's me.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /show japanese/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveTextContent("watashi");
  });

  it("resumes a unit and can restart it explicitly", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByRole("button", { name: /Unit 2: Talking About Things/i }));
    await user.click(screen.getByRole("button", { name: /Unit 1: First Sentences/i }));

    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "学生です。");

    await user.click(screen.getByRole("button", { name: /restart/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "私です。");
  });

  it("jumps with the header card control and toggles completion", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/card number/i), "10");
    expect(screen.getByLabelText(/card number/i)).toHaveValue("10");

    await user.click(screen.getByRole("button", { name: /mark unit complete/i }));
    expect(screen.getByText("Completed")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /mark incomplete/i }));
    expect(screen.getByText(/cards left/i)).toBeInTheDocument();
  });

  it("keeps footer actions simple and layout slots stable under settings toggles", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByRole("button", { name: /random/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /hide image/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Media area")).toBeInTheDocument();
    expect(screen.getByLabelText("Front card area")).toBeInTheDocument();
    expect(screen.getByLabelText("Reveal card area")).toBeInTheDocument();
    expect(screen.getByLabelText("Card note area")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByLabelText(/^image$/i));
    await user.click(screen.getByLabelText(/^notes$/i));

    expect(screen.getByLabelText("Media area")).toBeInTheDocument();
    expect(screen.getByLabelText("Front card area")).toBeInTheDocument();
    expect(screen.getByLabelText("Reveal card area")).toBeInTheDocument();
    expect(screen.getByLabelText("Card note area")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show english/i })).toBeInTheDocument();
  });

  it("handles hotkeys and autoplay settings", () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "学生です。");

    fireEvent.keyDown(window, { key: "r" });
    expect(screen.getByText("I'm a student.")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "s" });
    fireEvent.click(screen.getByLabelText(/auto advance/i));
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "先生です。");
    vi.useRealTimers();
  });

  it("keeps card notes learner-facing", () => {
    const banned = /Known units|Review due|warm up|late cards|generator|authoring|bare substitutions/i;
    for (const unit of [unit001, unit002, unit003, unit004, unit005, unit006, unit007]) {
      for (const card of unit.cards) {
        expect(card.fact).not.toMatch(banned);
      }
    }
  });
});
