import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App";
import { PracticeSession } from "../src/PracticeSession";
import { readState, writeState, touchWordHistory } from "../src/state";
import { buildStarterLesson, starterLessons, startersComplete, starterComplete } from "../src/starter-lessons";
import { curatedLevelProgress } from "../src/curated-course";
import { markLessonAlreadyKnown } from "../src/known-lesson";
import { knownLessonWords, practicedLessonWords, assertLessonVocabulary } from "../src/lesson-vocabulary";
import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { measureCardTransition } from "../src/lesson-transitions";
import { recordWordPractice, reviewStatus, suggestReviewWords } from "../src/review";
import { recordCardExposures } from "../src/word-exposure";
import { isSessionComplete, restartLesson, trackSessionChange, wasPracticed } from "../src/session-history";
import { practicedReviewCards } from "../src/sentence-review";
import { a1Progress } from "../src/topic-course";
import type { LearnerState } from "../src/types";

beforeEach(() => { localStorage.clear(); window.location.hash = "learn"; });

describe("curated starter foundations", () => {
  it("shows dictionary romaji and meanings on hover, including the corrected entry for saved です tokens", () => {
    const state = readState(), session = buildStarterLesson(state, starterLessons[0].id);
    // Old saved snapshots keep their cards, but shared dictionary corrections apply.
    session.savedCards![0].tokens.find(token => token.surface === "です")!.explain = "polite sentence ending";
    render(<PracticeSession state={{ ...state, settings: { ...state.settings, sound: false, autoplay: false }, activeSession: session }} onState={() => {}} onExit={() => {}} onDone={() => {}} onToast={() => {}} />);
    fireEvent.mouseEnter(screen.getByRole("button", { name: "私" }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("watashi");
    expect(screen.getByRole("tooltip")).toHaveTextContent("I; me");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.focus(screen.getByRole("button", { name: "は" }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("wa");
    expect(screen.getByRole("tooltip")).toHaveTextContent("topic marker");
    fireEvent.blur(screen.getByRole("button", { name: "は" }));
    const desu = screen.getByRole("button", { name: "です" });
    fireEvent.mouseEnter(desu);
    expect(screen.getByRole("tooltip")).toHaveTextContent("desu");
    expect(screen.getByRole("tooltip")).toHaveTextContent("am; is; are (polite)");
    expect(desu).toHaveAttribute("aria-describedby", screen.getByRole("tooltip").id);
    fireEvent.click(desu);
    expect(screen.getByRole("tooltip")).toHaveTextContent("desu");
    expect(screen.getByRole("button", { name: "Close word detail" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close word detail" })).toBeInTheDocument();
    expect(screen.getAllByText("am; is; are (polite)").length).toBeGreaterThan(0);
    expect(screen.queryByText("polite sentence ending")).not.toBeInTheDocument();
  });
  it("removes redundant question cues from an already saved Starter 3 without changing its cards", () => {
    let state = readState();
    for (const lesson of starterLessons.slice(0, 2)) state = markLessonAlreadyKnown(state, buildStarterLesson(state, lesson.id));
    const session = buildStarterLesson(state, starterLessons[2].id);
    session.cursor = 12;
    session.lessonNotes = [...session.lessonNotes!, { start: 13, title: "Ask about the description", pattern: "本 は 古い です か", explanation: "Old question reminder" }];
    state = { ...state, activeSession: session };
    const before = structuredClone(state);
    render(<PracticeSession state={state} onState={() => {}} onExit={() => {}} onDone={() => {}} onToast={() => {}} />);
    expect(screen.getByRole("button", { name: "か" })).toBeInTheDocument();
    expect(screen.queryByText("Ask about the description")).not.toBeInTheDocument();
    expect(screen.queryByText("New pattern / phrase")).not.toBeInTheDocument();
    expect(state).toEqual(before);
  });

  it("uses sustained target practice, unique sentences and single-change runs", () => {
    let state = readState();
    expect(() => buildStarterLesson(state, starterLessons[1].id)).toThrow(/preceding/);
    for (const [index, lesson] of starterLessons.entries()) {
      const before = structuredClone(state), session = buildStarterLesson(state, lesson.id);
      expect(state).toEqual(before);
      expect(session.savedCards).toEqual(lesson.cards);
      expect(() => assertLessonCardQuality(lesson.cards)).not.toThrow();
      expect(() => assertLessonVocabulary(lesson.cards, lesson.targets, state)).not.toThrow();
      if (index === 0) expect(session.lessonPlan!.appearances).toEqual({ watashi: 3, anata: 6, tomodachi: 6, gakusei: 5, sensei: 5, kaishain: 5 });
      else if(index<5) expect(new Set(Object.values(session.lessonPlan!.appearances))).toEqual(new Set(lesson.targets.length ? [index === 3 ? 9 : 6] : []));
      else {
        expect(lesson.targets.length).toBeLessThanOrEqual(5);
        for(const target of lesson.targets)expect(session.lessonPlan!.appearances[target]).toBeGreaterThanOrEqual(3);
      }
      for (let i = 1; i < lesson.cards.length; i++) {
        const step = measureCardTransition(lesson.cards[i - 1], lesson.cards[i]);
        if(index>=5)continue; // Bridge lessons combine familiar sentence patterns.
        if (lesson.cards[i - 1].constructionKey !== lesson.cards[i].constructionKey) expect(step.grammarChanged).toBe(true);
        else expect(step).toMatchObject({ kind: "neighbor", lexicalChanges: 1, grammarChanged: false });
      }
      state = markLessonAlreadyKnown(state, session);
    }
    expect(startersComplete(state)).toBe(true);
    expect(knownLessonWords(state).size).toBe(28);
  });

  it("marks knowledge/completion explicitly without manufacturing practice, review timers, cards or streaks", () => {
    const state = readState(), session = buildStarterLesson(state, starterLessons[0].id);
    const next = markLessonAlreadyKnown(state, session);
    expect(practicedLessonWords(next).size).toBe(0);
    expect(knownLessonWords(next).size).toBe(6);
    expect(next.practiceDays).toEqual(state.practiceDays);
    expect(next.dailyPractice).toEqual(state.dailyPractice);
    expect(next.reviewCards).toEqual(state.reviewCards);
    expect(practicedReviewCards(next)).toEqual([]);
    expect(suggestReviewWords(next, 0, Date.now() + 100 * 86400000)).toEqual([]);
    expect(a1Progress(next)).toMatchObject({ learned: 6, introduced: 6, declaredKnown: 6, practiced: 0 });
    for (const history of Object.values(next.wordHistory)) {
      expect(history.encounters).toBe(0); expect(history.cardEncounters).toBe(0);
      expect(history.review).toBeUndefined(); expect(wasPracticed(history)).toBe(false);
      expect(reviewStatus(history, next).due).toBe(false);
    }
    expect(isSessionComplete(next.lessonHistory![0].session)).toBe(true);
    expect(isSessionComplete(restartLesson(next.lessonHistory![0].session))).toBe(false);
    writeState(next);
    expect(readState().starterCompletions).toEqual(next.starterCompletions);
    expect(readState().wordHistory).toEqual(next.wordHistory);
  });

  it("unlocks by actual consumed positions, never by jumping to the end or saving", () => {
    let state = readState();
    const session = buildStarterLesson(state, starterLessons[0].id);
    const jump = trackSessionChange(state, { ...state, activeSession: { ...session, cursor: session.items.length } });
    expect(jump.starterCompletions?.[session.starterLessonId!]).toBeUndefined();
    state = { ...state, activeSession: session };
    for (let index = 0; index < session.items.length; index++) {
      const before = state, card = session.savedCards![index], ids = card.tokens.flatMap(token => token.wordId ? [token.wordId] : []), at = new Date().toISOString();
      let next: LearnerState = { ...state, wordHistory: touchWordHistory(state, { wordIds: ids, kind: "reading", at }), activeSession: { ...state.activeSession!, cursor: index + 1, practicedIndices: [...(state.activeSession!.practicedIndices ?? []), index] } };
      next = recordCardExposures(before, recordWordPractice(next, ids, at), ids, index, card);
      state = trackSessionChange(before, next, at);
    }
    expect(state.starterCompletions?.[session.starterLessonId!].method).toBe("practiced");
    expect(practicedLessonWords(state).size).toBe(6);
    expect(() => buildStarterLesson(state, starterLessons[1].id)).not.toThrow();
  });

  it("requires starters in Learn, allows explicit skips in order, and keeps declarations out of actual practice", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: /Start here Foundations/ }));
    expect(screen.getByRole("region", { name: "Foundations" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Topics" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: `Start ${starterLessons[1].title}` })).toBeDisabled();
    for (let i = 1; i <= starterLessons.length; i++) {
      fireEvent.click(screen.getByRole("button", { name: `Mark Starter ${i} as already known` }));
      await waitFor(() => expect(readState().starterCompletions?.[starterLessons[i - 1].id]?.method).toBe("declared"));
    }
    fireEvent.click(screen.getByRole("button", { name: "All A1 tracks" }));
    expect(await screen.findByRole("region", { name: "A1 topics" })).toBeInTheDocument();
    expect(knownLessonWords(readState()).size).toBe(28);
    expect(practicedLessonWords(readState()).size).toBe(0);
    expect(readState().practiceDays).toEqual([]);
  });

  it("plays the exact first starter, shows its explanation and completes it through the player", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: /Start here Foundations/ }));
    fireEvent.click(screen.getByRole("button", { name: `Start ${starterLessons[0].title}` }));
    expect(await screen.findByText("Statements with は and です")).toBeInTheDocument();
    await waitFor(() => expect(readState().activeSession?.starterLessonId).toBe(starterLessons[0].id));
    for (let i = 0; i < starterLessons[0].cards.length - 1; i++) fireEvent.click(screen.getByRole("button", { name: "Next card" }));
    fireEvent.click(screen.getByRole("button", { name: "Complete lesson" }));
    await waitFor(() => expect(readState().starterCompletions?.[starterLessons[0].id]?.method).toBe("practiced"));
    const state = readState();
    expect(state.activeSession?.savedCards).toEqual(starterLessons[0].cards);
    expect(practicedLessonWords(state).size).toBe(6);
    expect(state.wordHistory.watashi.cardEncounters).toBe(3);
    fireEvent.click(screen.getByRole("button", { name: "Next lesson" }));
    await waitFor(() => expect(readState().activeSession?.starterLessonId).toBe(starterLessons[1].id));
    expect(readState().activeSession?.savedCards).toEqual(starterLessons[1].cards);
    expect(readState().activeSession?.cursor).toBe(0);
  });

  it("shows one starter stack, retains a paused position after refresh, and keeps other tracks locked", async () => {
    render(<App />);
    const stack = await screen.findByRole("button", { name: /Start here Foundations/ });
    expect(screen.queryByRole("button", { name: `Start ${starterLessons[0].title}` })).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Foundations lessons completed" })).toHaveAttribute("aria-valuenow", "0");
    fireEvent.click(stack);
    const foundations = screen.getByRole("region", { name: "Foundations" });
    fireEvent.click(within(foundations).getAllByText("Grammar and lesson preview")[0]);
    expect(readState().starterCompletions).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: `Start ${starterLessons[0].title}` }));
    fireEvent.click(await screen.findByRole("button", { name: "Next card" }));
    await waitFor(() => expect(readState().activeSession?.cursor).toBe(1));
    const sessionId = readState().activeSession!.id;
    cleanup(); window.location.hash = "practice"; render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Pause and leave lesson" }));
    expect(await screen.findByRole("region", { name: "Foundations" })).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("region", { name: "Foundations" })).getByRole("button", { name: `Resume ${starterLessons[0].title}` }));
    await screen.findByRole("button", { name: "Pause and leave lesson" });
    expect(readState().activeSession).toMatchObject({ id: sessionId, cursor: 1 });
    fireEvent.click(screen.getByRole("button", { name: "Pause and leave lesson" }));
    fireEvent.click(await screen.findByRole("button", { name: "All A1 tracks" }));
    fireEvent.click(screen.getByRole("button", { name: /People and communication Meet people/ }));
    expect(await screen.findByRole("button", { name: "Start Greetings and introductions" })).toBeDisabled();
  });

  it("opens the track chooser after the final foundation and retains the completed stack", async () => {
    let state = readState();
    for (const lesson of starterLessons.slice(0, -1)) state = markLessonAlreadyKnown(state, buildStarterLesson(state, lesson.id));
    const last = starterLessons.at(-1)!;
    writeState({ ...state, activeSession: buildStarterLesson(state, last.id), settings: { ...state.settings, autoplay: false, sound: false } });
    window.location.hash = "practice"; render(<App />);
    for (let i = 0; i < last.cards.length; i++) fireEvent.click(await screen.findByRole("button", { name: i === last.cards.length - 1 ? "Complete lesson" : "Next card" }));
    fireEvent.click(await screen.findByRole("button", { name: "Choose a track" }));
    expect(await screen.findByRole("progressbar", { name: "Foundations lessons completed" })).toHaveAttribute("aria-valuenow", "8");
    fireEvent.click(screen.getByRole("button", { name: /People and communication Meet people/ }));
    expect(await screen.findByRole("button", { name: "Start Greetings and introductions" })).toBeEnabled();
  });

  it("preserves the old first starter and teaches questions when an old learner continues", () => {
    let state = readState();
    const current = buildStarterLesson(state, starterLessons[0].id);
    const old = { ...current, starterVersion: 1, savedCards: current.savedCards!.slice(0, 9), items: current.items.slice(0, 9), lessonNotes: [{ start: 1, title: "Old statement note", pattern: "私 は 学生 です", explanation: "Saved explanation" }] };
    state = markLessonAlreadyKnown(state, old);
    writeState(state);
    state = readState();
    expect(starterComplete(state, starterLessons[0].id)).toBe(true);
    expect(curatedLevelProgress(state, "A1").learned).toBe(6);
    expect(state.lessonHistory![0].session.savedCards).toEqual(old.savedCards);
    expect(state.lessonHistory![0].session.lessonNotes).toEqual(old.lessonNotes);
    expect(buildStarterLesson(state, starterLessons[1].id).lessonNotes?.some(note => note.start === 10)).toBe(true);
    const finished = { ...current, cursor: current.items.length, practicedIndices: current.items.map((_, index) => index) };
    const practiced = trackSessionChange(state, { ...state, activeSession: finished });
    expect(practiced.starterCompletions?.[starterLessons[0].id]).toMatchObject({ version: 2, method: "practiced" });
    state = markLessonAlreadyKnown(state, buildStarterLesson(state, starterLessons[0].id));
    expect(state.starterCompletions?.[starterLessons[0].id].version).toBe(2);
    expect(buildStarterLesson(state, starterLessons[1].id).lessonNotes).toHaveLength(1);
    state = markLessonAlreadyKnown(state, old);
    expect(state.starterCompletions?.[starterLessons[0].id].version).toBe(2);
  });
});
