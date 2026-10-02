import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GamesView } from "../src/GamesView";
import { activityRecords, distinctGameWords, gamePool, gameWord, makeListeningQuestions, makeReadingQuestions, readingKey, wordsConflict, type GameWord } from "../src/games";
import { readState } from "../src/state";
import { wordById } from "../src/curriculum";
import { playWord, stopAudio } from "../src/audio";

vi.mock("../src/audio", () => ({ stopAudio: vi.fn(), playWord: vi.fn(async (_word, callbacks) => { callbacks?.onPlaying?.(); callbacks?.onEnded?.(); }) }));

function fixture(id: string, surface: string, reading: string, meaning: string): GameWord {
  return gameWord({ id, surface, reading, meaning, function: "noun" })!;
}

describe("game question selection", () => {
  beforeEach(() => localStorage.clear());

  it("keeps homophones, synonyms, and dictionary forms out of answer choices", () => {
    const bridge = fixture("bridge-test", "橋", "はし", "bridge");
    const chopsticks = fixture("chopsticks-test", "箸", "ハシ", "chopsticks");
    const home = fixture("home-test", "家", "いえ", "a house; home");
    const residence = fixture("residence-test", "住宅", "じゅうたく", "home; residence");
    expect(wordsConflict(bridge, chopsticks)).toBe(true);
    expect(wordsConflict(home, residence)).toBe(true);
    expect(wordsConflict({ ...bridge, dictionaryEntryId: "one" }, { ...home, dictionaryEntryId: "one" })).toBe(true);
    expect(readingKey("ハ シ")).toBe("はし");
  });

  it("provides a beginner pool without inventing known words or imposing the generator vocabulary limit", () => {
    const state = readState();
    expect(gamePool(state, "library")).toHaveLength(0);
    const starter = distinctGameWords(gamePool(state, "starter"));
    const course = distinctGameWords(gamePool(state, "course"));
    expect(starter.length).toBeGreaterThan(25);
    expect(course.length).toBeGreaterThan(150);
    const questions = makeListeningQuestions(starter.slice(0, 10), starter, 912);
    expect(questions).toHaveLength(10);
    for (const question of questions) {
      expect(question.choices).toHaveLength(4);
      expect(question.choices.filter(word => word.id === question.word.id)).toHaveLength(1);
      for (let index = 0; index < question.choices.length; index += 1) for (const other of question.choices.slice(index + 1)) expect(wordsConflict(question.choices[index], other)).toBe(false);
    }
  });

  it("builds reading puzzles from exact authored kana, retaining small sounds and repeated tiles", () => {
    const school = fixture("school-test", "学校", "がっこう", "school");
    const dictionary = fixture("dictionary-test", "辞書", "じしょ", "dictionary");
    const teacher = fixture("teacher-test", "先生", "せんせい", "teacher");
    const questions = makeReadingQuestions([school, dictionary, teacher], 101);
    expect(questions).toHaveLength(3);
    expect([...questions[0].tiles].sort()).toEqual(["が", "っ", "こ", "う"].sort());
    expect([...questions[1].tiles].sort()).toEqual(["じ", "しょ"].sort());
    expect(questions[2].tiles.filter(tile => tile === "せ")).toHaveLength(2);
    for (const question of questions) expect(question.tiles.join("")).not.toBe(question.reading);
    expect(makeReadingQuestions([school, dictionary, teacher], 101)).toEqual(questions);
    expect(makeReadingQuestions([
      fixture("kana-test", "ねこ", "ねこ", "cat"),
      fixture("short-test", "木", "き", "tree"),
      fixture("ambiguous-test", "人", "ひと / じん", "person"),
      fixture("same-test", "母", "はは", "mother"),
    ], 101)).toHaveLength(0);
  });
});

describe("playable game rounds", () => {
  beforeEach(() => {
    localStorage.clear(); vi.clearAllMocks();
    vi.mocked(playWord).mockImplementation(async (_word, callbacks) => { callbacks?.onPlaying?.(); callbacks?.onEnded?.(); });
  });

  it("completes pair boards, preserves first-try errors, retries misses, and records completion once", () => {
    const state = readState();
    state.settings = { ...state.settings, sound: false };
    const onComplete = vi.fn();
    const props = { state, onComplete, onToast: vi.fn(), onOpenKanji: vi.fn() };
    const { rerender } = render(<GamesView {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Play word pairs" }));
    expect(onComplete).not.toHaveBeenCalled();
    const pool = gamePool(state, "starter");
    const firstJapanese = screen.getAllByRole("button", { name: /^Japanese / })[0];
    const firstWord = pool.find(word => firstJapanese.getAttribute("aria-label") === `Japanese ${word.surface}`)!;
    fireEvent.click(firstJapanese);
    fireEvent.click(screen.getAllByRole("button", { name: /^Meaning / }).find(button => button.getAttribute("aria-label") !== `Meaning ${firstWord.meaning}`)!);
    expect(screen.getByText("Not a match. Try another meaning.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: `Meaning ${firstWord.meaning}` }));
    for (let board = 0; board < 2; board += 1) {
      for (const button of screen.getAllByRole("button", { name: /^Japanese / }).filter(button => !(button as HTMLButtonElement).disabled)) {
        const word = pool.find(item => button.getAttribute("aria-label") === `Japanese ${item.surface}`)!;
        fireEvent.click(button); fireEvent.click(screen.getByRole("button", { name: `Meaning ${word.meaning}` }));
      }
      fireEvent.click(screen.getByRole("button", { name: board === 0 ? "Next board" : "See results" }));
    }
    expect(screen.getByText("9 of 10 words correct on the first try.")).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({ kind: "pairs", total: 10, correct: 9, missedWordIds: [firstWord.id] });
    expect(new Set(onComplete.mock.calls[0][0].wordIds).size).toBe(10);
    rerender(<GamesView {...props} state={{ ...state, xp: 50 }} />);
    expect(onComplete).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Retry missed words" }));
    expect(screen.getByText("Retry 1 missed word + 3 review words")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: `Japanese ${firstWord.surface}` })).toBeInTheDocument();
  });

  it("uses the heard learning form, reveals corrections, and completes a listening round", () => {
    const onComplete = vi.fn();
    render(<GamesView state={readState()} onComplete={onComplete} onToast={vi.fn()} onOpenKanji={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Play listening" }));
    for (let index = 0; index < 10; index += 1) {
      const token = vi.mocked(playWord).mock.calls.at(-1)![0];
      const word = wordById(token.wordId!)!;
      expect(token.surface).toBe(word.surface); expect(token.reading).toBe(word.reading);
      const choices = within(screen.getByRole("group", { name: "Choose the word meaning" })).getAllByRole("button");
      const answer = index === 0 ? choices.find(button => button.querySelector("span")?.textContent !== word.meaning)! : choices.find(button => button.querySelector("span")?.textContent === word.meaning)!;
      fireEvent.click(answer);
      if (index === 0) expect(screen.getByText("Added to your retry list")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: index === 9 ? "See results" : "Next word" }));
    }
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({ kind: "listening", total: 10, correct: 9 });
    expect(onComplete.mock.calls[0][0].missedWordIds).toHaveLength(1);
  });

  it("does not give credit for unavailable audio or count an unplayed activity", () => {
    vi.mocked(playWord).mockImplementation(async (_word, callbacks) => callbacks?.onUnavailable?.());
    const onComplete = vi.fn();
    render(<GamesView state={readState()} onComplete={onComplete} onToast={vi.fn()} onOpenKanji={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Play listening" }));
    for (let index = 0; index < 10; index += 1) fireEvent.click(screen.getByRole("button", { name: "Skip unavailable audio" }));
    expect(screen.getByRole("heading", { name: "Audio unavailable" })).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("completes kana puzzles, preserves incorrect attempts and reveals, and retries exactly the missed words", () => {
    const state = readState();
    state.settings = { ...state.settings, sound: false };
    const onComplete = vi.fn();
    render(<GamesView state={state} onComplete={onComplete} onToast={vi.fn()} onOpenKanji={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Play kana builder" }));
    expect(playWord).not.toHaveBeenCalled();
    const pool = gamePool(state, "starter");
    const misses: string[] = [];
    for (let index = 0; index < 10; index += 1) {
      const round = screen.getByRole("region", { name: "Build the kana reading" });
      const word = pool.find(item => within(round).getByRole("heading").textContent === item.surface)!;
      if (index === 1) {
        fireEvent.click(screen.getByRole("button", { name: "Show reading" }));
        misses.push(word.id);
      } else {
        const bank = screen.getByRole("group", { name: "Available kana tiles" });
        if (index === 0) {
          for (const tile of within(bank).getAllByRole("button")) fireEvent.click(tile);
          fireEvent.click(screen.getByRole("button", { name: "Check reading" }));
          expect(screen.getByText("Not quite. Reorder the tiles and try again.")).toBeInTheDocument();
          fireEvent.click(screen.getByRole("button", { name: "Clear" }));
          misses.push(word.id);
        }
        let remaining = word.reading;
        while (remaining) {
          const tile = within(bank).getAllByRole("button").filter(button => !(button as HTMLButtonElement).disabled && remaining.startsWith(button.querySelector("span")!.textContent!)).sort((a, b) => b.querySelector("span")!.textContent!.length - a.querySelector("span")!.textContent!.length)[0];
          remaining = remaining.slice(tile.querySelector("span")!.textContent!.length);
          fireEvent.click(tile);
        }
        fireEvent.click(screen.getByRole("button", { name: "Check reading" }));
      }
      fireEvent.click(screen.getByRole("button", { name: index === 9 ? "See results" : "Next word" }));
    }
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({ kind: "reading", correct: 8, total: 10, missedWordIds: misses });
    expect(screen.getByText("8 of 10 words correct on the first try.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry missed words" }));
    expect(screen.getByText("Retry 2 missed words")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Reading progress" })).toHaveAttribute("aria-valuemax", "2");
    expect(playWord).not.toHaveBeenCalled();
  });

  it("supports kana tile keyboard controls, ignores paused input, and cancels audio on exit without recording", () => {
    const onComplete = vi.fn();
    const state = readState();
    state.settings = { ...state.settings, sound: true, quietMode: false };
    const { unmount } = render(<GamesView state={state} onComplete={onComplete} onToast={vi.fn()} onOpenKanji={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Play kana builder" }));
    fireEvent.keyDown(window, { key: "1" });
    expect(within(screen.getByRole("group", { name: "Your reading" })).getAllByRole("button")).toHaveLength(1);
    fireEvent.keyDown(window, { key: "Backspace" });
    expect(within(screen.getByRole("group", { name: "Your reading" })).queryAllByRole("button")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    expect(within(screen.getByRole("group", { name: "Your reading" })).queryAllByRole("button")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Show reading" }));
    expect(playWord).toHaveBeenCalledTimes(1);
    vi.mocked(stopAudio).mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Exit activity" }));
    expect(stopAudio).toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
    unmount();
  });

  it("shows persisted results and best recent accuracy without comparing round speeds", () => {
    const state = readState();
    state.activityResults = [
      { id: "old", kind: "pairs", at: "2026-09-12T10:00:00Z", total: 10, correct: 10, durationSeconds: 20 },
      { id: "larger", kind: "pairs", at: "2026-09-12T11:00:00Z", total: 20, correct: 20, durationSeconds: 100 },
      { id: "latest", kind: "listening", at: "2026-09-13T10:00:00Z", total: 10, correct: 7, durationSeconds: 60 },
    ];
    const records = activityRecords(state.activityResults);
    expect(records.recent.map(result => result.id)).toEqual(["latest", "larger", "old"]);
    expect(records.best.find(result => result.kind === "pairs")?.id).toBe("larger");
    const onComplete = vi.fn();
    render(<GamesView state={state} onComplete={onComplete} onToast={vi.fn()} onOpenKanji={vi.fn()} />);
    const history = screen.getByRole("region", { name: "Activity results" });
    expect(within(history).getByText("3 rounds completed")).toBeInTheDocument();
    expect(within(history).getByText("20/20 correct")).toBeInTheDocument();
    expect(within(history).getByText("7/10 correct")).toBeInTheDocument();
    expect(within(history).queryByText("0:20")).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
