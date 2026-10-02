import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KanjiActivity } from "../src/KanjiActivity";
import { coreKanji, kanjiGroups, kanjiQuestions } from "../src/kanji-data";
import unit from "../../../data/jp/curriculum/units/unit_103.json";
import teaching from "../../../data/jp/dictionary/teaching_words.json";

vi.mock("../src/audio", () => ({ playWord: vi.fn(), stopAudio: vi.fn() }));

describe("Core kanji content", () => {
  it("shares fifty sourced characters with the expanded course and stable original positions", () => {
    expect(coreKanji).toHaveLength(50);
    expect(new Set(coreKanji.map(item => item.id)).size).toBe(50);
    expect(new Set(coreKanji.map(item => item.character)).size).toBe(50);
    expect(unit.newWords.map(word => word.surface).slice(0, 20).join("")).toBe("人日月火水木金土山川田口目耳手足大小中上");
    expect(unit.cards).toHaveLength(50);
    expect(unit.newWords.map(word => word.id).sort()).toEqual(coreKanji.map(item => item.id).sort());
    for (const group of kanjiGroups) expect(coreKanji.filter(item => item.group === group.id).map(item => item.artIndex)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const entry of coreKanji) {
      expect(entry.origin.source).toMatch(/^https:\/\/www\.kanjipedia\.jp\/kanji\/\d+$/);
      expect(entry.origin.text.length).toBeGreaterThan(20);
      expect(entry.mnemonic).not.toBe(entry.origin.text);
      expect(entry.example.surface).toContain(entry.character);
      expect(teaching.words[entry.id as keyof typeof teaching.words]).toMatchObject({ function: "kanji", introducedInUnit: 103 });
    }
  });

  it("has distinct answers and four choices even for a one-character retry", () => {
    const rounds = kanjiQuestions(coreKanji, 8, () => .4);
    expect(new Set(rounds.map(item => item.entry.id)).size).toBe(8);
    for (const question of [...rounds, ...kanjiQuestions([coreKanji[0]])]) {
      expect(new Set(question.choices.map(item => item.id)).size).toBe(4);
      expect(question.choices.filter(item => item.id === question.entry.id)).toHaveLength(1);
    }
  });
});

describe("Kanji atlas", () => {
  it("only records study explicitly and supports character search", () => {
    const onStudy = vi.fn();
    render(<KanjiActivity visitedIds={[]} onStudy={onStudy} onBack={vi.fn()} />);
    expect(onStudy).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search kanji" }), { target: { value: "forest" } });
    const collection = screen.getByLabelText("Character collection");
    expect(within(collection).getAllByRole("button")).toHaveLength(1);
    fireEvent.click(within(collection).getByRole("button", { name: "Study 森: forest" }));
    expect(onStudy).not.toHaveBeenCalled();
    expect(screen.getByRole("region", { name: "Study 森" })).toHaveTextContent("Three tree characters");
    fireEvent.click(screen.getByRole("button", { name: "Mark studied & next" }));
    expect(onStudy).toHaveBeenCalledTimes(1);
    expect(onStudy).toHaveBeenCalledWith("kanji_mori");
  });

  it("records a completed quiz once and offers targeted retries for misses", () => {
    const onQuizComplete = vi.fn();
    const onStudy = vi.fn();
    const props = { visitedIds: [], onStudy, onBack: vi.fn(), onQuizComplete };
    const { rerender } = render(<KanjiActivity {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Quiz these 50" }));
    for (let index = 0; index < 8; index += 1) {
      const heading = screen.getByRole("heading", { name: /^Which character means/ }).textContent!;
      const answer = coreKanji.find(entry => heading === `Which character means ${entry.meaning.split(";")[0]}?`)!;
      expect(answer).toBeDefined();
      const correct = screen.getByRole("button", { name: `Answer ${answer.character}` });
      const choice = index === 0 ? screen.getAllByRole("button", { name: /^Answer / }).find(button => button !== correct)! : correct;
      fireEvent.click(choice);
      fireEvent.click(screen.getByRole("button", { name: index === 7 ? "See results" : "Next character" }));
    }
    expect(onQuizComplete).toHaveBeenCalledTimes(1);
    expect(onQuizComplete.mock.calls[0][0]).toMatchObject({ kind: "kanji", correct: 7, total: 8, durationSeconds: expect.any(Number) });
    expect(onStudy).not.toHaveBeenCalled();
    rerender(<KanjiActivity {...props} visitedIds={["kanji_hi"]} />);
    expect(onQuizComplete).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Retry missed" }));
    expect(screen.getByText("Question 1 of 1")).toBeInTheDocument();
  });
});
