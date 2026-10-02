import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { courseDictionaryWords, dictionaryWord, loadDictionaryIndex } from "../../../packages/dictionary";
import { CustomLessonBuilder } from "../src/CustomLessonBuilder";
import { buildCustomLesson, type CustomLesson } from "../src/custom-lesson";
import { readState } from "../src/state";
import { setWordPriority } from "../src/review";

vi.mock("../src/custom-lesson", async original => ({ ...await original<typeof import("../src/custom-lesson")>(), buildCustomLesson: vi.fn() }));
vi.mock("../../../packages/dictionary", async original => ({ ...await original<typeof import("../../../packages/dictionary")>(), loadDictionaryIndex: vi.fn() }));

function preview(ids: string[]): CustomLesson {
  const cards = ids.flatMap(id => Array.from({ length: 8 }, (_, index) => {
    const word = dictionaryWord(id)!;
    const token = { wordId: id, surface: word.surface, reading: word.reading, explain: word.meaning };
    return { id: `${id}-${index}`, tokens: [token], line: [token.surface], tts: [token.reading], explain: [token.explain], english: word.meaning };
  }));
  return { contextCount: 0, wordOnlyIds: ids, appearances: Object.fromEntries(ids.map(id => [id, 8])),
    session: { id: `custom-${ids.join("-")}`, source: "vocabulary", targetWordIds: ids, title: "My custom lesson", startedAt: "2026-09-13", length: "standard", cursor: 0, scores: [], savedCards: cards,
      items: cards.map(card => ({ cardId: card.id, prompt: "explore", reason: "Word practice" })) } };
}

describe("compact custom lesson builder", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(loadDictionaryIndex).mockResolvedValue([]);
    vi.mocked(buildCustomLesson).mockImplementation(async (_state, ids) => preview(ids));
    vi.clearAllMocks();
  });

  it("starts empty, adds a searched word, and launches the exact prepared snapshot", async () => {
    const onStart = vi.fn();
    render(<CustomLessonBuilder state={readState()} onStart={onStart} />);
    expect(screen.getByRole("button", { name: "Start lesson" })).toBeDisabled();
    expect(screen.queryByText(/template/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Find words for your lesson" }), { target: { value: "book" } });
    fireEvent.click(await screen.findByRole("button", { name: `Add ${dictionaryWord("hon")!.surface}` }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Start lesson" })).toBeEnabled());
    expect(screen.getByRole("button", { name: `Remove ${dictionaryWord("hon")!.surface}` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start lesson" }));
    expect(onStart.mock.calls[0][0]).toEqual(preview(["hon"]).session);
  });

  it("uses Priority, supports removal, and keeps naming and saving under options", async () => {
    const state = setWordPriority(setWordPriority(readState(), "hon", true), "isu", true);
    const onSave = vi.fn();
    render(<CustomLessonBuilder state={state} onStart={vi.fn()} onSave={onSave} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Start lesson" })).toBeEnabled());
    expect(screen.getByText("Lesson options").closest("details")).not.toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: `Remove ${dictionaryWord("isu")!.surface}` }));
    await waitFor(() => expect(screen.getByRole("spinbutton", { name: "Card limit" })).toHaveValue(8));
    fireEvent.click(screen.getByText("Lesson options"));
    fireEvent.change(screen.getByRole("textbox", { name: "Lesson name" }), { target: { value: "My reading words" } });
    fireEvent.click(screen.getByRole("button", { name: "Save for later" }));
    expect(onSave.mock.calls[0][0]).toMatchObject({ title: "My reading words", targetWordIds: ["hon"] });
  });

  it("ignores an obsolete preview while the current word selection is loading", async () => {
    const pending = new Map<string, (value: CustomLesson) => void>();
    vi.mocked(buildCustomLesson).mockImplementation((_state, ids) => new Promise(resolve => pending.set(ids.join(","), resolve)));
    const onStart = vi.fn();
    const state = readState();
    const view = render(<CustomLessonBuilder state={state} initialWordIds={["hon"]} onStart={onStart} />);
    await waitFor(() => expect(pending.has("hon")).toBe(true));
    view.rerender(<CustomLessonBuilder state={state} initialWordIds={["isu"]} onStart={onStart} />);
    await waitFor(() => expect(pending.has("isu")).toBe(true));
    await act(async () => pending.get("hon")!(preview(["hon"])));
    expect(screen.getByRole("button", { name: "Start lesson" })).toBeDisabled();
    await act(async () => pending.get("isu")!(preview(["isu"])));
    fireEvent.click(screen.getByRole("button", { name: "Start lesson" }));
    expect(onStart.mock.calls[0][0].targetWordIds).toEqual(["isu"]);
  });

  it("shows an oversized explicit selection instead of dropping words", async () => {
    const ids = courseDictionaryWords().slice(0, 31).map(word => word.id);
    render(<CustomLessonBuilder state={readState()} initialWordIds={ids} onStart={vi.fn()} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Choose up to 30 words");
    expect(screen.getAllByRole("button", { name: /^Remove / })).toHaveLength(31);
    expect(buildCustomLesson).not.toHaveBeenCalled();
  });
});
