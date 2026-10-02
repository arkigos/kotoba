import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { a1CoreWordIds, a1CoreWordIdsForTopic, a1Milestones, a1Topics, a1WordMetadata } from "../../../packages/dictionary/a1";
import { dictionaryWord } from "../../../packages/dictionary";
import { App } from "../src/App";
import { a1Progress, activeTopicIds, buildTopicLesson, coreWordProgress, selectTopicWords, setMilestone, toggleTopic, vocabularySession } from "../src/topic-course";
import { prepareSession, resolveSessionCard, toggleSavedSentence } from "../src/generated";
import { isPrioritized, recordWordPractice, setWordPriority } from "../src/review";
import { readState, stateKey, touchWordHistory, writeState } from "../src/state";
import { canSaveLesson, saveLesson, trackSessionChange } from "../src/session-history";
import { recordActivity } from "../src/goals";
import type { LearnerState } from "../src/types";

const day = (number: number) => new Date(Date.UTC(2026, 8, number, 12)).toISOString();
function practiced(state: LearnerState, id: string, occasions = 1) {
  const wordHistory = touchWordHistory(state, { wordIds: [id], kind: "reading", at: day(1) });
  wordHistory[id].review = { lastPracticedAt: day(1), occasions, lastOccasionAt: day(1), lastOccasionSessionId: "earlier" };
  return { ...state, wordHistory };
}

describe("finite topic-driven A1", () => {
  beforeEach(() => { localStorage.clear(); window.location.hash = "#course"; });

  it("uses shared core identity for overlap and form aliases without doubling progress", () => {
    const id = a1CoreWordIds.find(id => a1WordMetadata[id].topicIds.length > 1)!;
    let state = practiced(readState(), id, 3);
    for (const topic of a1WordMetadata[id].topicIds) expect(a1Progress(state, topic).learned).toBe(1);
    expect(a1Progress(state)).toMatchObject({ learned: 1, total: 450 });
    const alias = Object.entries(a1WordMetadata).find(([key, metadata]) => key !== metadata.coreWordId && !!metadata.coreWordId)!;
    state = practiced(readState(), alias[0], 3);
    expect(coreWordProgress(state, alias[1].coreWordId!)).toMatchObject({ learned: true });
    state = practiced(state, alias[1].coreWordId!, 3);
    expect(a1Progress(state).learned).toBe(1);
  });

  it("keeps saves and Priority separate from learning; requires spaced occasions", async () => {
    const id = "koohii";
    let state = setWordPriority(readState(), id, true);
    expect(isPrioritized(state.wordHistory[id])).toBe(true);
    expect(state.wordHistory[id].encounters).toBe(0);
    expect(a1Progress(state).introduced).toBe(0);
    state.activeSession = await vocabularySession([id], state);
    state = { ...state, wordHistory: touchWordHistory(state, { wordIds: [id], kind: "reading", at: day(1) }) };
    state = recordWordPractice(state, [id], day(1));
    state.activeSession = { ...state.activeSession!, id: "second-session-same-day" };
    state = recordWordPractice(state, [id], day(1));
    expect(coreWordProgress(state, id)).toMatchObject({ introduced: true, learned: false, occasions: 1 });
    state.activeSession = { ...state.activeSession!, id: "second-day" };
    state = recordWordPractice(state, [id], day(2));
    state.activeSession = { ...state.activeSession!, id: "third-day" };
    state = recordWordPractice(state, [id], day(3));
    expect(coreWordProgress(state, id).learned).toBe(true);
  });

  it("lets multiple topics persist and makes completion depend on both core and can-do checks", () => {
    let state = toggleTopic(readState(), "family");
    state = toggleTopic(state, "work");
    expect(activeTopicIds(state)).toEqual(expect.arrayContaining(["family", "work"]));
    state = toggleTopic(state, "family");
    expect(activeTopicIds(state)).not.toContain("family");
    for (const id of a1CoreWordIds) state = practiced(state, id, 3);
    expect(a1Progress(state)).toMatchObject({ percent: 100, vocabularyComplete: true, complete: false });
    for (const milestone of a1Milestones) state = setMilestone(state, milestone.id, true);
    expect(a1Progress(state).complete).toBe(true);
    writeState(state);
    expect(readState().a1Journey).toEqual(state.a1Journey);
    state = setMilestone(state, a1Milestones[0].id, false);
    expect(a1Progress(state).complete).toBe(false);
  });

  it("combines alternating forms across lessons and activities, counting same-day aliases once", async () => {
    const [alias, metadata] = Object.entries(a1WordMetadata).find(([id, value]) => value.core && value.coreWordId && value.coreWordId !== id)!;
    const core = metadata.coreWordId!;
    let state = readState();
    const run = async (wordId: string, date: string, sessionId: string) => {
      state.activeSession = { ...await vocabularySession(["koohii"], state), id: sessionId };
      state = { ...state, wordHistory: touchWordHistory(state, { wordIds: [wordId], kind: "reading", at: date }) };
      state = recordWordPractice(state, [wordId], date);
    };
    await run(core, day(1), "one");
    await run(alias, day(1), "one-alias");
    expect(coreWordProgress(state, core).occasions).toBe(1);
    await run(alias, day(2), "two");
    state = recordActivity(state, { id: "activity-three", kind: "reading", at: day(3), correct: 1, total: 1, wordIds: [core], missedWordIds: [], durationSeconds: 10 });
    expect(coreWordProgress(state, core)).toMatchObject({ learned: true, occasions: 3 });
    expect(state.wordHistory[core].review?.occasions).toBe(2);
    expect(state.wordHistory[alias].review?.occasions).toBe(2);
    writeState(state);
    expect(coreWordProgress(readState(), core).occasions).toBe(3);
  });

  it("introduces every core word in every topic without repeating already introduced targets as new", () => {
    for (const topic of a1Topics) {
      let state = readState();
      const introduced = new Set<string>();
      for (let turn = 0; turn < 100; turn += 1) {
        const selection = selectTopicWords(state, topic.id);
        expect(selection.newWordIds.length).toBeLessThanOrEqual(12);
        expect(selection.wordIds.length).toBeLessThanOrEqual(12);
        if (!selection.newWordIds.length) break;
        for (const id of selection.newWordIds) { expect(introduced.has(id)).toBe(false); introduced.add(id); state = practiced(state, id); }
      }
      expect([...introduced].sort()).toEqual([...a1CoreWordIdsForTopic(topic.id)].sort());
    }
  });

  it("builds valid materialized sentence lessons and rejects an unsupported greetings batch", async () => {
    const state=readState();
    for(const topic of ["food","school","shopping"]){
      const plan=await buildTopicLesson(state,topic,false,{wordCount:6});
      expect(plan.session.targetWordIds).toHaveLength(6);
      expect(plan.session.items.length).toBeLessThanOrEqual(24);
      expect(()=>assertLessonCardQuality(plan.session.savedCards!)).not.toThrow();
      expect(Object.values(plan.appearances).every(n=>n>=1)).toBe(true);
      await expect(prepareSession(plan.session,state)).resolves.toBeUndefined();
    }
    await expect(buildTopicLesson(state,"greetings")).rejects.toThrow(/One-word/);
  });

  it("honors exact targets and a length ceiling, leaving exhausted new pools short", async () => {
    const state=readState(),ids=["koohii","mizu"];
    const plan=await buildTopicLesson(state,"food",false,{wordIds:ids,cardCount:37});
    expect(plan.session.targetWordIds).toEqual(ids);expect(plan.session.items.length).toBeLessThan(37);
    await expect(buildTopicLesson(state,"food",false,{wordIds:ids,cardCount:1})).rejects.toThrow(/Not every selected/);
    await expect(buildTopicLesson(state,"food",false,{wordIds:ids,cardCount:37.5})).rejects.toThrow(/whole number/);
    await expect(buildTopicLesson(state,"food",false,{wordIds:[]})).rejects.toThrow(/no words/);
    await expect(buildTopicLesson(state,"food",false,{wordIds:["not-in-topic"]})).rejects.toThrow(/from this topic/);
    let progressed=state;const pool=a1CoreWordIdsForTopic("food");pool.slice(0,-2).forEach(id=>{progressed=practiced(progressed,id);});
    const next=selectTopicWords(progressed,"food");expect(next.newWordIds).toEqual(pool.slice(-2));expect(next.wordIds).toHaveLength(2);expect(next.reviewWordIds).toEqual([]);
  });

  it("edits word and card limits before saving the exact lesson", async () => {
    writeState({...readState(),a1Journey:{activeTopicIds:["food"],milestoneChecks:{}}});
    render(<App />);
    fireEvent.click(within(screen.getByRole("region", { name: "Active A1 topics" })).getByRole("button", { name: /^Practice / }));
    await waitFor(() => expect(screen.getByRole("button", { name: /^Start \d+-card lesson/ })).toBeEnabled());
    fireEvent.change(screen.getByRole("spinbutton", { name: /Words to practice/ }), { target: { value: "5" } });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^Start \d+-card lesson/ })).toBeEnabled();
      expect(Number((screen.getByRole("spinbutton", { name: /Cards in this lesson/ }) as HTMLInputElement).value)).toBeLessThanOrEqual(40);
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: /Cards in this lesson/ }), { target: { value: "1" } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Not every selected word");
    expect(screen.getByRole("button", { name: /Start .*card lesson/ })).toBeDisabled();
    fireEvent.change(screen.getByRole("spinbutton", { name: /Cards in this lesson/ }), { target: { value: "45" } });
    await waitFor(() => expect(screen.getByRole("button", { name: /^Start \d+-card lesson/ })).toBeEnabled());
    expect(a1Progress(readState()).introduced).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Save for later" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    const saved = readState().lessonHistory!.find(lesson => lesson.savedAt)!;
    expect(saved.session.targetWordIds).toHaveLength(5);
    expect(saved.session.items.length).toBeLessThanOrEqual(24);
    expect(readState().activeSession).toBeUndefined();
    expect(a1Progress(readState()).introduced).toBe(0);
  });

  it("preserves exact custom word lessons and saved cards with no generation eligibility requirement", async () => {
    const state = readState();
    const ids = ["koohii", "mizu"];
    const session = await vocabularySession(ids, state, "My family needs");
    expect(session.targetWordIds).toEqual(ids);
    expect(()=>assertLessonCardQuality(session.savedCards!)).not.toThrow();
    expect(canSaveLesson(session)).toBe(true);
    let next = trackSessionChange(state, { ...state, activeSession: { ...session, cursor: 2 } });
    next = saveLesson(next, session.id, true);
    next = toggleSavedSentence(next, session.savedCards![2], session);
    writeState(next);
    const restored = readState();
    await expect(prepareSession(restored.activeSession!)).resolves.toBeUndefined();
    expect(resolveSessionCard(restored.activeSession!)).toEqual(session.savedCards![2]);
    expect(restored.savedMaterializedCards?.[session.savedCards![2].id]).toEqual(session.savedCards![2]);
    expect(restored.lessonHistory?.[0].savedAt).toBeTruthy();
    expect(restored.currentUnitId).toBe(state.currentUnitId);
    await expect(vocabularySession(a1CoreWordIds.slice(0, 121), state)).rejects.toThrow("between 1 and 30");
  });

  it("opens a topic preview, launches the exact deck, saves progress, and resumes", async () => {
    const state = readState();
    writeState({ ...state, a1Journey:{activeTopicIds:["food"],milestoneChecks:{}}, settings: { ...state.settings, autoplay: false, sound: false } });
    render(<App />);
    expect(screen.getByRole("button", { name: "View A1 progress" })).toHaveTextContent("A10%");
    const active = screen.getByRole("region", { name: "Active A1 topics" });
    fireEvent.click(within(active).getByRole("button", { name: /^Practice / }));
    const start = await screen.findByRole("button", { name: /^Start \d+-card lesson/ });
    const preview = screen.getByRole("dialog");
    expect(within(preview).getByText(/12 new/)).toBeInTheDocument();
    fireEvent.click(start);
    fireEvent.click(await screen.findByRole("button", { name: "Next card" }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem(stateKey)!).activeSession.cursor).toBe(1));
    const cards = JSON.parse(localStorage.getItem(stateKey)!).activeSession.savedCards;
    expect(readState().lessonHistory?.find(lesson => lesson.session.id === readState().activeSession?.id)?.savedAt).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(stateKey)!).unitProgress["1"].exposure).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Pause and leave lesson" }));
    fireEvent.click(await screen.findByRole("button", { name: /^Resume/ }));
    await screen.findByRole("button", { name: "Next card" });
    expect(JSON.parse(localStorage.getItem(stateKey)!).activeSession.savedCards).toEqual(cards);
  });

  it("reviews a dictionary-only priority word from Home", async () => {
    window.location.hash = "#today";
    const id = dictionaryWord("kazoku")!.dictionaryEntryId;
    const state = setWordPriority(readState(), id, true);
    writeState({ ...state, settings: { ...state.settings, sound: false, autoplay: false, lessonDefaultFace: "japanese" } });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Review/ }));
    await screen.findByText(/No supported sentence context/);
    expect(readState().activeSession).toBeUndefined();
  });
});
