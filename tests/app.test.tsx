import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import unit001 from "../data/jp/curriculum/units/unit_001.json";
import unit003 from "../data/jp/curriculum/units/unit_003.json";
import unit005 from "../data/jp/curriculum/units/unit_005.json";
import unit006 from "../data/jp/curriculum/units/unit_006.json";
import { recordingForToken } from "../packages/dictionary/audio";

function spokenCalls() {
  return (window.speechSynthesis.speak as unknown as { mock: { calls: Array<[SpeechSynthesisUtterance]> } }).mock.calls;
}

function lastSpoken() {
  return spokenCalls().at(-1)?.[0];
}

function expectEnglishMeaning(text: string) {
  expect(screen.getAllByText(text).length).toBeGreaterThan(0);
}

async function openUnitBrowser(user: ReturnType<typeof userEvent.setup>, levelName?: RegExp) {
  await user.click(screen.getByRole("button", { name: /browse units/i }));
  const browser = screen.getByRole("dialog", { name: /choose unit/i });
  if (levelName) {
    await user.click(within(browser).getByRole("tab", { name: levelName }));
  }
  return browser;
}

async function chooseUnit(user: ReturnType<typeof userEvent.setup>, unitName: RegExp, levelName?: RegExp) {
  const browser = await openUnitBrowser(user, levelName);
  await user.click(within(browser).getByRole("button", { name: unitName }));
}

describe("practice player", () => {
  beforeEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    class MockSpeechSynthesisUtterance {
      text: string;
      lang = "";
      onend: (() => void) | null = null;

      constructor(text: string) {
        this.text = text;
      }
    }
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        speak: vi.fn(),
      },
    });
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  it("opens directly into the learner-titled practice experience", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Unit 1: Classroom Japanese" })).toBeInTheDocument();
    expect(screen.getByText(unit001.grammarFocus)).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[0].line.join(""));
    expect(screen.queryByLabelText(/language/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/image/i)).not.toBeInTheDocument();
  });

  it("opens a modern unit browser from compact course levels", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Course")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Current unit.*001.*Unit 1: Classroom Japanese/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kana And First Symbols.*0\/3/i })).not.toHaveAttribute("aria-expanded");
    expect(screen.getByRole("button", { name: /A1 Marugoto Starter Foundations.*0\/49/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Kana 1: Hiragana/i })).not.toBeInTheDocument();

    const browser = await openUnitBrowser(user);
    expect(within(browser).getByRole("tab", { name: /A1.*0\/49/i })).toHaveAttribute("aria-selected", "true");
    expect(within(browser).getByRole("button", { name: /Unit 1: Classroom Japanese/i })).toBeInTheDocument();

    await user.click(within(browser).getByRole("tab", { name: /A2.*0\/19/i }));

    expect(within(browser).getByText("Planned")).toBeInTheDocument();
    expect(within(browser).queryByRole("button", { name: /Unit 50/i })).not.toBeInTheDocument();
  });

  it("opens pre-A1 kana recognition units from the unit browser", async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseUnit(user, /Kana 1: Hiragana/i, /Kana.*0\/3/i);

    expect(await screen.findByRole("heading", { name: "Kana 1: Hiragana" })).toBeInTheDocument();
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", "あ");
  });

  it("opens a visible unit dictionary for new, review, known-here, and function words", async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseUnit(user, /Unit 3: Family And People/i);
    expect(await screen.findByRole("heading", { name: "Unit 3: Family And People" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^words$/i }));
    const vocabulary = screen.getByLabelText("Unit vocabulary");

    expect(within(vocabulary).getByRole("tab", { name: /Dictionary \d+/i })).toHaveAttribute("aria-selected", "true");
    expect(within(vocabulary).getByText(unit003.newWords[0].meaning)).toBeInTheDocument();
    expect(within(vocabulary).getByRole("tab", { name: new RegExp(`Review ${unit003.reviewWordIds.length}`, "i") })).toBeInTheDocument();
    expect(within(vocabulary).getByRole("tab", { name: /Known \d+/i })).toBeInTheDocument();
    expect(within(vocabulary).getByRole("tab", { name: /Function 6/i })).toBeInTheDocument();
    expect(within(vocabulary).queryByRole("tab", { name: /Grammar/i })).not.toBeInTheDocument();
    expect(within(vocabulary).queryByRole("button", { name: /Show translations/i })).not.toBeInTheDocument();
    expect(within(vocabulary).queryByRole("button", { name: /Drill new \+ review/i })).not.toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("button", { name: `Open ${unit003.newWords[0].surface}` }));
    expect(screen.getByRole("dialog", { name: `${unit003.newWords[0].surface} dictionary entry` })).toHaveTextContent(unit003.newWords[0].meaning);
    fireEvent.click(screen.getByRole("dialog", { name: `${unit003.newWords[0].surface} dictionary entry` }).parentElement as HTMLElement);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: new RegExp(`Review ${unit003.reviewWordIds.length}`, "i") }));
    expect(within(vocabulary).getByText(unit001.newWords[0].meaning)).toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: /Known \d+/i }));
    expect(within(vocabulary).getByText("homemaker")).toBeInTheDocument();
    expect(within(vocabulary).getByText("work")).toBeInTheDocument();
    expect(within(vocabulary).queryByText(unit001.newWords[0].meaning)).not.toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: /Function 6/i }));
    expect(within(vocabulary).getByText("topic marker")).toBeInTheDocument();
    expect(within(vocabulary).queryByText("polite copula: is/am/are")).not.toBeInTheDocument();
  });

  it("keeps existence verbs out of the function word panel and shows them as SRS vocabulary", async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseUnit(user, /Unit 6: Home And Rooms/i);
    expect(await screen.findByRole("heading", { name: unit006.title })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^words$/i }));
    const vocabulary = screen.getByLabelText("Unit vocabulary");
    await user.click(within(vocabulary).getByRole("tab", { name: /Function/i }));

    expect(within(vocabulary).getByText("subject marker")).toBeInTheDocument();
    expect(within(vocabulary).queryByText("to exist; to have (inanimate)")).not.toBeInTheDocument();
    expect(within(vocabulary).queryByText("to exist; to be (animate)")).not.toBeInTheDocument();

    await user.click(within(vocabulary).getByRole("tab", { name: /New 12/i }));
    expect(within(vocabulary).getByText("exist; there is for things")).toBeInTheDocument();
    expect(within(vocabulary).getByText("exist; there is for living things")).toBeInTheDocument();
    expect(within(vocabulary).queryByRole("tab", { name: /Grammar/i })).not.toBeInTheDocument();
  });

  it("defaults to Japanese autoplay audio", () => {
    render(<App />);
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].line.join(""), lang: "ja-JP" });
  });

  it("supports English and contextual audio modes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByRole("button", { name: /audio: japanese/i }));
    fireEvent.click(screen.getByRole("button", { name: /^play audio$/i }));
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].english, lang: "en-US" });

    await user.click(screen.getByRole("button", { name: /audio: english/i }));
    await user.click(screen.getByRole("button", { name: /audio: same/i }));
    fireEvent.click(screen.getByRole("button", { name: /^play audio$/i }));
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].english, lang: "en-US" });

    await user.click(screen.getByRole("button", { name: /show english/i }));
    await user.click(screen.getByRole("button", { name: /audio: opposite/i }));
    await user.click(screen.getByRole("button", { name: /audio: japanese/i }));
    await user.click(screen.getByRole("button", { name: /audio: english/i }));
    fireEvent.click(screen.getByRole("button", { name: /^play audio$/i }));
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].english, lang: "en-US" });

    await user.click(screen.getByRole("button", { name: /default shown: japanese/i }));
    await user.click(screen.getByRole("button", { name: /default shown: english/i }));
    const playCount = spokenCalls().length;
    fireEvent.click(screen.getByRole("button", { name: /^play audio$/i }));
    expect(spokenCalls()).toHaveLength(playCount + 1);
    expect(lastSpoken()).toMatchObject({ text: unit001.cards[0].line.join(""), lang: "ja-JP" });
  });

  it("plays the clicked Japanese word from its shared dictionary recording", async () => {
    const user = userEvent.setup();
    render(<App />);

    const playCount = spokenCalls().length;
    const mediaPlay = vi.mocked(HTMLMediaElement.prototype.play);
    const recordedCount = mediaPlay.mock.calls.length;
    await user.click(screen.getByRole("button", { name: "Play 私" }));
    expect(mediaPlay).toHaveBeenCalledTimes(recordedCount + 1);
    expect((mediaPlay.mock.contexts.at(-1) as HTMLAudioElement).src).toContain(recordingForToken(unit001.cards[0].tokens[0]));
    expect(spokenCalls()).toHaveLength(playCount);
  });

  it("lets Space advance after a mouse-clicked Japanese token", async () => {
    const user = userEvent.setup();
    render(<App />);

    const token = screen.getByRole("button", { name: `Play ${unit001.cards[0].tokens[0].surface}` });
    await user.click(token);
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
    await user.click(screen.getByRole("button", { name: /japanese display: kanji\/kana/i }));
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    const saved = window.localStorage.getItem("kotoba.progress.v1");
    expect(saved).toContain('"japaneseDisplay":"kana"');
    expect(saved).toContain('"cardPositions":{"1":1}');
    expect(saved).not.toContain("languageCode");
  });

  it("can default cards to English", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByRole("button", { name: /default shown: japanese/i }));
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
    await user.click(screen.getByRole("button", { name: /show japanese/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[0].line.join(""));
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByLabelText("Prompt text hidden")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Recall" }));
    expectEnglishMeaning(unit001.cards[1].english);
    expect(screen.queryByLabelText(/image/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show japanese/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Rapid" }));
    expect(screen.getByRole("button", { name: /auto advance on/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /default shown: japanese/i })).toBeInTheDocument();
  });

  it("swaps the main card display between English, Japanese, and romaji readings", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.getByRole("button", { name: /japanese display: kanji\/kana/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /default shown: japanese/i }));
    await user.click(screen.getByRole("button", { name: /japanese display: kanji\/kana/i }));
    await user.click(screen.getByRole("button", { name: /japanese display: hiragana/i }));

    expectEnglishMeaning(unit001.cards[0].english);
    await user.click(screen.getByRole("button", { name: /show japanese/i }));
    expect(screen.getByLabelText("Japanese sentence")).toHaveTextContent("watashi");
  });

  it("resumes a unit and can restart it explicitly", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await chooseUnit(user, /Unit 2: Countries And Jobs/i);
    await chooseUnit(user, /Unit 1: Classroom Japanese/i);

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
    let browser = await openUnitBrowser(user);
    expect(within(browser).getByRole("button", { name: /Unit 1: Classroom Japanese/i })).toHaveStyle("--unit-progress: 13%; --progress-color: hsl(15 70% 47%)");
    await user.click(within(browser).getByRole("button", { name: /close/i }));

    await user.click(screen.getByRole("button", { name: /mark unit complete/i }));
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /A1 Marugoto Starter Foundations.*1\/49/i })).toHaveStyle("--level-progress: 2%; --progress-color: hsl(6 70% 47%)");
    browser = await openUnitBrowser(user);
    expect(within(browser).getByRole("button", { name: /Unit 1: Classroom Japanese.*Complete/i })).toBeInTheDocument();
    await user.click(within(browser).getByRole("button", { name: /close/i }));
    expect(screen.getByRole("button", { name: /mark incomplete/i })).toHaveClass("incomplete-action");
    await user.click(screen.getByRole("button", { name: /mark incomplete/i }));
    expect(screen.getByText(/cards left/i)).toBeInTheDocument();
  });

  it("can use random order for card movement", async () => {
    const user = userEvent.setup();
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
    render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByRole("button", { name: /order: sequential/i }));
    await user.click(screen.getByRole("button", { name: /^next$/i }));

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

  it("keeps unit browser progress stable when switching between different length units", async () => {
    const user = userEvent.setup();
    render(<App />);

    await chooseUnit(user, /Unit 5: Restaurants And Taste/i);
    expect(await screen.findByRole("heading", { name: "Unit 5: Restaurants And Taste" })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/card number/i), "49");
    const unitFiveProgress = Math.round((49 / unit005.cards.length) * 100);
    let browser = await openUnitBrowser(user);
    expect(within(browser).getByRole("button", { name: /Unit 5: Restaurants And Taste/i })).toHaveStyle(`--unit-progress: ${unitFiveProgress}%`);

    await user.click(within(browser).getByRole("button", { name: /Unit 7: Neighborhood Places/i }));
    expect(await screen.findByRole("heading", { name: "Unit 7: Neighborhood Places" })).toBeInTheDocument();
    browser = await openUnitBrowser(user);
    expect(within(browser).getByRole("button", { name: /Unit 5: Restaurants And Taste/i })).toHaveStyle(`--unit-progress: ${unitFiveProgress}%`);
  });

  it("persists dark mode from settings", async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    await user.click(screen.getByRole("button", { name: /dark mode off/i }));

    expect(container.querySelector(".app-shell")).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("kotoba.progress.v1")).toContain('"theme":"dark"');

    unmount();
    const rerendered = render(<App />);
    expect(rerendered.container.querySelector(".app-shell")).toHaveAttribute("data-theme", "dark");
  });

  it("keeps footer actions simple and layout slots stable under settings toggles", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByRole("button", { name: /^randomize$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /hide image/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Media area")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Card display area")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /settings/i }));

    expect(screen.queryByRole("button", { name: /^randomize$/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Card display area")).toBeInTheDocument();
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

    const playCount = spokenCalls().length;
    fireEvent.keyDown(window, { key: "2" });
    expect(spokenCalls()).toHaveLength(playCount + 1);

    fireEvent.keyDown(window, { key: "s" });
    fireEvent.click(screen.getByRole("button", { name: /auto advance off/i }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByLabelText("Japanese sentence")).toHaveAttribute("data-sentence", unit001.cards[2].line.join(""));
    vi.useRealTimers();
  });
});
