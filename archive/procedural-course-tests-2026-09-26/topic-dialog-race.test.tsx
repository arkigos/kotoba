import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TopicLessonDialog } from "../src/TopicLessonDialog";
import * as planner from "../src/topic-course";
import { readState } from "../src/state";
import { dictionaryWord } from "../../../packages/dictionary";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("topic preview save consistency", () => {
  it("ignores an older build result and saves only the exact latest valid preview", async () => {
    localStorage.clear();
    const state = readState();
    const template = await planner.buildTopicLesson(state, "food");
    const pending: Array<{ options: planner.TopicLessonOptions; resolve: (value: planner.TopicLesson) => void; reject: (cause: Error) => void }> = [];
    vi.spyOn(planner, "buildTopicLesson").mockImplementation((_state, _topic, _extras, options = {}) =>
      new Promise((resolve, reject) => pending.push({ options, resolve, reject })));
    const onSave = vi.fn();
    const onStart = vi.fn();
    render(<TopicLessonDialog state={state} topicId="food" extras={false} onClose={vi.fn()} onSave={onSave} onStart={onStart} />);
    await waitFor(() => expect(pending).toHaveLength(1));
    expect(pending[0].options.cardCount).toBeUndefined();
    expect(pending[0].options.wordIds).toBeUndefined();
    expect(pending[0].options.wordCount).toBe(12);
    fireEvent.change(screen.getByRole("spinbutton", { name: /Words to practice/ }), { target: { value: "5" } });
    await waitFor(() => expect(pending).toHaveLength(2));
    const result = (index: number): planner.TopicLesson => {
      const { wordIds = planner.selectTopicWords(state, "food", false, Date.now(), (pending[index].options.wordCount ?? 12) + 1).wordIds.slice(1).reverse(), cardCount = wordIds.length === 5 ? 18 : 24 } = pending[index].options;
      const cards = Array.from({ length: cardCount }, (_, position) => template.session.savedCards![position % template.session.savedCards!.length]);
      return { ...template, newWordIds: wordIds, reviewWordIds: [], appearances: Object.fromEntries(wordIds.map(id => [id, 8])),
        session: { ...template.session, id: `preview-${index}`, targetWordIds: wordIds, savedCards: cards,
          lessonPlan: { ...template.session.lessonPlan!, pacing: { appearanceGoal: 8, minimumAppearances: 6, targetDensity: wordIds.length * 8 / cardCount,
            baselineCards: wordIds.length * 4, singleChanges: cardCount - 6, doubleChanges: 3, boundaries: 1, repeats: 1 } },
          items: cards.map(card => ({ cardId: card.id, prompt: "meaning", reason: "Reading" })) } };
    };
    const latest = result(1);
    await act(async () => pending[1].resolve(latest));
    expect(screen.getByRole("button", { name: "Start 18-card lesson" })).toBeEnabled();
    expect(screen.getByRole("spinbutton", { name: /Cards in this lesson/ })).toHaveValue(18);
    expect(pending).toHaveLength(2);
    await act(async () => pending[0].resolve(result(0)));
    expect(screen.getByRole("button", { name: "Start 18-card lesson" })).toBeEnabled();
    fireEvent.change(screen.getByRole("spinbutton", { name: /Cards in this lesson/ }), { target: { value: "20" } });
    expect(screen.getByRole("button", { name: "Save for later" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Save for later" }));
    expect(onSave).not.toHaveBeenCalled();
    await waitFor(() => expect(pending).toHaveLength(3));
    expect(pending[2].options.cardCount).toBe(20);
    await act(async () => pending[2].reject(new Error("These examples need more cards to give each word six appearances.")));
    expect(screen.getByRole("alert")).toHaveTextContent("need more cards");
    expect(screen.getByRole("button", { name: "Save for later" })).toBeDisabled();
    fireEvent.change(screen.getByRole("spinbutton", { name: /Words to practice/ }), { target: { value: "6" } });
    await waitFor(() => expect(pending).toHaveLength(4));
    expect(pending[3].options.cardCount).toBe(20);
    expect(screen.getByRole("spinbutton", { name: /Cards in this lesson/ })).toHaveValue(20);
    fireEvent.click(screen.getByRole("button", { name: "Use recommended size" }));
    await waitFor(() => expect(pending).toHaveLength(5));
    expect(pending[4].options.cardCount).toBeUndefined();
    const finalPreview = result(4);
    await act(async () => pending[4].resolve(finalPreview));
    expect(screen.getByRole("spinbutton", { name: /Cards in this lesson/ })).toHaveValue(24);
    expect(screen.getByRole("button", { name: "Start 24-card lesson" })).toBeEnabled();
    fireEvent.click(screen.getByText("Lesson options"));
    fireEvent.change(screen.getByRole("textbox", { name: "Lesson name" }), { target: { value: "My daily words" } });
    fireEvent.click(screen.getByRole("button", { name: "Save for later" }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0][0]).toEqual({ ...finalPreview.session, title: "My daily words" });
    expect(onStart).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("spinbutton", { name: /Cards in this lesson/ }), { target: { value: "20" } });
    await waitFor(() => expect(pending).toHaveLength(6));
    const customPreview = result(5);
    await act(async () => pending[5].resolve(customPreview));
    expect(screen.getByRole("spinbutton", { name: /Cards in this lesson/ })).toHaveValue(20);
    fireEvent.click(screen.getByRole("button", { name: "Start 20-card lesson" }));
    expect(onStart).toHaveBeenCalledOnce();
    expect(onStart.mock.calls[0][0]).toEqual({ ...customPreview.session, title: "My daily words" });
    fireEvent.click(screen.getByText("Edit words", { exact: false }));
    const removedId = customPreview.session.targetWordIds![0];
    const removed = dictionaryWord(removedId)!;
    fireEvent.click(screen.getByRole("checkbox", { name: name => name.includes(removed.surface) && name.includes(removed.meaning) }));
    await waitFor(() => expect(pending).toHaveLength(7));
    expect(pending[6].options.wordIds).toEqual(customPreview.session.targetWordIds!.filter(id => id !== removedId));
    expect(pending[6].options.wordCount).toBeUndefined();
    expect(pending[6].options.cardCount).toBe(20);
    fireEvent.change(screen.getByRole("spinbutton", { name: /Words to practice/ }), { target: { value: "4" } });
    await waitFor(() => expect(pending).toHaveLength(8));
    expect(pending[7].options.wordIds).toBeUndefined();
    expect(pending[7].options.wordCount).toBe(4);
    expect(state.wordHistory).toEqual({});
  });
});
