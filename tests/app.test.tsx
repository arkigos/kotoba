import { act, fireEvent, render, screen, within } from "@testing-library/react";
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

function mediaPlayCalls() {
  return (window.HTMLMediaElement.prototype.play as unknown as { mock: { calls: unknown[][] } }).mock.calls;
}

function expectEnglishMeaning(text: string) {
  expect(screen.getAllByText(text).length).toBeGreaterThan(0);
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
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  it("opens directly into the learner-titled practice experience", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Unit 1: First Sentences" })).toBeInTheDocument();
    expect(screen.getByText(/Aです/)).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[0].line.join(""));
    expect(screen.queryByLabelText(/language/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/image/i)).not.toBeInTheDocument();
  });

  it("groups units under expandable course levels", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Levels")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kana And First Symbols.*0\/3 complete/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Kana 1: Hiragana/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /A1 Survival Foundations/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /A1 Survival Foundations.*0\/20 complete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /A2 Everyday Control.*0\/24 complete/i })).toHaveAttribute("aria-expanded", "false");

    await user.click(screen.getByRole("button", { name: /A2 Everyday Control/i }));

    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Unit 21/i })).not.toBeInTheDocument();
  });

  it("opens pre-A1 kana recognition units from the sidebar", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Kana 1: Hiragana/i }));

    expect(await screen.findByRole("heading", { name: "Kana 1: Hiragana" })).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "あ");
  });

  it("opens an interactive vocabulary panel for new, review, function, grammar, and known words", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Unit 3: People And Possession/i }));
    expect(await screen.findByRole("heading", { name: "Unit 3: People And Possession" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^words$/i }));
    const vocabulary = screen.getByLabelText("Unit vocabulary");

    expect(within(vocabulary).getByRole("tab", { name: /New 10/i })).toHaveAttribute("aria-selected", "true");
    expect(within(vocabulary).getByRole("tab", { name: /Review 10/i })).toBeInTheDocument();
    expect(within(vocabulary).getByRole("tab", { name: /Known 30/i })).toBeInTheDocument();
    expect(within(vocabulary).getByRole("tab", { name: /Function 6/i })).toBeInTheDocument();
    expect(within(vocabulary).getByRole("tab", { name: /Grammar 0/i })).toBeInTheDocument();
    expect(within(vocabulary).queryByText(unit003.newWords[0].meaning)).not.toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("button", { name: /Drill new \+ review/i }));
    expect(within(vocabulary).getByLabelText("Vocabulary drill")).toHaveTextContent(`Word 1 / ${unit003.newWords.length + unit001.newWords.length}`);
    expect(within(vocabulary).getByText("English hidden")).toBeInTheDocument();
    await user.click(within(vocabulary).getByRole("button", { name: /Show English/i }));
    expect(within(vocabulary).getByText(unit003.newWords[0].meaning)).toBeInTheDocument();
    await user.click(within(vocabulary).getByRole("button", { name: "Next" }));
    expect(within(vocabulary).getByText("Word 2 / 20")).toBeInTheDocument();
    await user.click(within(vocabulary).getByRole("button", { name: "Close" }));

    await user.click(within(vocabulary).getByRole("button", { name: `Reveal translation for ${unit003.newWords[0].surface}` }));
    expect(within(vocabulary).getByText(unit003.newWords[0].meaning)).toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: /Review 10/i }));
    expect(within(vocabulary).getByRole("button", { name: `Reveal translation for ${unit001.newWords[0].surface}` })).toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: /Known 30/i }));
    await user.click(within(vocabulary).getByRole("button", { name: /Show translations/i }));
    expect(within(vocabulary).getByText(unit002.newWords[0].meaning)).toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: /Function 6/i }));
    expect(within(vocabulary).getByRole("button", { name: /translation for は/ })).toBeInTheDocument();
    expect(within(vocabulary).queryByRole("button", { name: "Reveal translation for あります" })).not.toBeInTheDocument();
  });

  it("keeps existence verbs out of the function word panel and shows them as SRS vocabulary", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Unit 4: There Is And There Is Not/i }));
    expect(await screen.findByRole("heading", { name: "Unit 4: There Is And There Is Not" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^words$/i }));
    const vocabulary = screen.getByLabelText("Unit vocabulary");
    await user.click(within(vocabulary).getByRole("tab", { name: /Function/i }));

    expect(within(vocabulary).getByRole("button", { name: "Reveal translation for が" })).toBeInTheDocument();
    expect(within(vocabulary).queryByRole("button", { name: "Reveal translation for あります" })).not.toBeInTheDocument();
    expect(within(vocabulary).queryByRole("button", { name: "Reveal translation for います" })).not.toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: /New 12/i }));
    expect(within(vocabulary).getByRole("button", { name: "Reveal translation for ある" })).toBeInTheDocument();
    expect(within(vocabulary).getByRole("button", { name: "Reveal translation for いる" })).toBeInTheDocument();
    expect(within(vocabulary).getByRole("tab", { name: /Grammar 0/i })).toBeInTheDocument();
  });

  it("defaults to Japanese autoplay audio", () => {
    render(<App />);
    expect(mediaPlayCalls()).toHaveLength(1);
    expect(lastSpoken()).toBeUndefined();
  });

  it("supports English and both-language audio modes", () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /settings/i }));
    fireEvent.change(screen.getByRole("combobox", { name: /audio/i }), { target: { value: "english" } });
    fireEvent.click(screen.getByRole("button", { name: /^play audio$/i }));
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].english, lang: "en-US" });

    fireEvent.change(screen.getByRole("combobox", { name: /audio/i }), { target: { value: "both" } });
    fireEvent.click(screen.getByRole("button", { name: /^play audio$/i }));
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].line.join(""), lang: "ja-JP" });
    (lastSpoken() as SpeechSynthesisUtterance & { onend: () => void }).onend();
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].english, lang: "en-US" });
    vi.useRealTimers();
  });

  it("plays the clicked Japanese word piece", async () => {
    const user = userEvent.setup();
    render(<App />);

    const playCount = mediaPlayCalls().length;
    await user.click(screen.getByRole("button", { name: "Play 私" }));
    expect(mediaPlayCalls()).toHaveLength(playCount + 1);
  });

  it("lets Space advance after a mouse-clicked Japanese token", async () => {
    const user = userEvent.setup();
    render(<App />);

    const token = screen.getByRole("button", { name: `Play ${unit001.cards[0].tokens[0].surface}` });
    const playCount = mediaPlayCalls().length;
    await user.click(token);
    expect(mediaPlayCalls()).toHaveLength(playCount + 1);
    expect(document.activeElement).not.toBe(token);

    fireEvent.keyDown(document.activeElement ?? window, { key: " " });
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[1].line.join(""));
  });

  it("keeps practice hotkeys active when a control button has focus", async () => {
    const user = userEvent.setup();
    render(<App />);

    const playButton = screen.getByRole("button", { name: /^play audio$/i });
    await user.click(playButton);
    expect(document.activeElement).toBe(playButton);

    fireEvent.keyDown(document.activeElement ?? window, { key: " " });
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[1].line.join(""));
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
    expect(screen.getByText(unit001.cards[0].english)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[1].line.join(""));
    expect(screen.queryByText(unit001.cards[0].english)).not.toBeInTheDocument();
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
    expect(saved).not.toContain("languageCode");
  });

  it("can start cards revealed by default", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByLabelText(/start revealed/i));
    expectEnglishMeaning(unit001.cards[0].english);

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expectEnglishMeaning(unit001.cards[1].english);
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
    expectEnglishMeaning(unit001.cards[0].english);
    expect(screen.queryByLabelText(/image/i)).not.toBeInTheDocument();
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

    expectEnglishMeaning(unit001.cards[0].english);
    await user.click(screen.getByRole("button", { name: /show japanese/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveTextContent("watashi");
  });

  it("resumes a unit and can restart it explicitly", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByRole("button", { name: /Unit 2: Talking About Things/i }));
    await user.click(screen.getByRole("button", { name: /Unit 1: First Sentences/i }));

    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[1].line.join(""));

    await user.click(screen.getByRole("button", { name: /^restart$/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[0].line.join(""));
  });

  it("jumps with the header card control and toggles completion", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/card number/i), "10");
    expect(screen.getByLabelText(/card number/i)).toHaveValue("10");
    expect(screen.getByRole("progressbar", { name: /unit progress/i })).toHaveAttribute("aria-valuenow", "13");
    expect(screen.getByText(/Card 10 \/ 80 .* 13% complete/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unit 1: First Sentences/i })).toHaveStyle("--unit-progress: 13%; --progress-color: hsl(15 70% 47%)");

    await user.click(screen.getByRole("button", { name: /mark unit complete/i }));
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unit 1: First Sentences.*Complete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /A1 Survival Foundations.*1\/20 complete/i })).toHaveStyle("--level-progress: 5%; --progress-color: hsl(8 70% 47%)");
    expect(screen.getByRole("button", { name: /mark incomplete/i })).toHaveClass("incomplete-action");
    await user.click(screen.getByRole("button", { name: /mark incomplete/i }));
    expect(screen.getByText(/cards left/i)).toBeInTheDocument();
  });

  it("can jump to a random card in any unit", async () => {
    const user = userEvent.setup();
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^randomize$/i }));

    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[40].line.join(""));
    randomSpy.mockRestore();
  });

  it("keeps Next available at the end and reports there is no next card", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/card number/i), String(unit001.cards.length));
    const nextButton = screen.getByRole("button", { name: /^next$/i });
    expect(nextButton).toHaveAttribute("aria-disabled", "true");

    await user.click(nextButton);
    expect(screen.getByText("End of unit")).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards.at(-1)?.line.join(""));
  });

  it("keeps sidebar unit progress stable when switching between different length units", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Unit 5: Talking About The Past/i }));
    expect(await screen.findByRole("heading", { name: "Unit 5: Talking About The Past" })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/card number/i), "49");
    const unitFiveProgress = Math.round((49 / unit005.cards.length) * 100);
    expect(screen.getByRole("button", { name: /Unit 5: Talking About The Past/i })).toHaveStyle(`--unit-progress: ${unitFiveProgress}%`);

    await user.click(screen.getByRole("button", { name: /Unit 7: Asking What And Who/i }));
    expect(await screen.findByRole("heading", { name: "Unit 7: Asking What And Who" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unit 5: Talking About The Past/i })).toHaveStyle(`--unit-progress: ${unitFiveProgress}%`);
  });

  it("persists dark mode from settings", async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByLabelText(/dark mode/i));

    expect(container.querySelector(".app-shell")).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("kotoba.progress.v1")).toContain('"theme":"dark"');

    unmount();
    const rerendered = render(<App />);
    expect(rerendered.container.querySelector(".app-shell")).toHaveAttribute("data-theme", "dark");
  });

  it("keeps footer actions simple and layout slots stable under settings toggles", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("button", { name: /^randomize$/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /hide image/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Media area")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Front card area")).toBeInTheDocument();
    expect(screen.getByLabelText("Reveal card area")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /settings/i }));

    expect(screen.getByLabelText("Front card area")).toBeInTheDocument();
    expect(screen.getByLabelText("Reveal card area")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show english/i })).toBeInTheDocument();
  });

  it("handles hotkeys and autoplay settings", () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[1].line.join(""));

    fireEvent.keyDown(window, { key: " ", shiftKey: true });
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[0].line.join(""));

    fireEvent.keyDown(window, { key: " " });
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[1].line.join(""));

    fireEvent.keyDown(window, { key: "1" });
    expectEnglishMeaning(unit001.cards[1].english);
    expect(screen.getByRole("button", { name: /^play audio$/i })).toBeInTheDocument();

    const playCount = mediaPlayCalls().length;
    fireEvent.keyDown(window, { key: "2" });
    expect(mediaPlayCalls()).toHaveLength(playCount + 1);

    fireEvent.keyDown(window, { key: "s" });
    fireEvent.click(screen.getByLabelText(/auto advance/i));
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[2].line.join(""));
    vi.useRealTimers();
  });
});
