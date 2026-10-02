import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { App } from "../src/App";
import { PracticeSession } from "../src/PracticeSession";
import { buildTopicLesson } from "../src/topic-course";
import { canContinueTopic, nextTopicLesson } from "../src/next-topic-lesson";
import { readState, writeState, touchWordHistory } from "../src/state";
import { isSessionComplete, saveLessonSession, trackSessionChange } from "../src/session-history";
import { recordWordPractice } from "../src/review";
import { assertLessonVocabulary, practicedLessonWords } from "../src/lesson-vocabulary";
import { a1CoreWordIdsForTopic } from "../../../packages/dictionary/a1";
import type { ActiveSession, LearnerState } from "../src/types";

beforeEach(() => { localStorage.clear(); window.history.replaceState(null, "", "/#lessons"); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

function markCompleted(seed: LearnerState, session: ActiveSession) {
  const at = new Date().toISOString();
  const ids = [...new Set(session.savedCards!.flatMap(card => card.tokens.flatMap(token => token.wordId ? [token.wordId] : [])))];
  const completed = { ...session, cursor: session.items.length, scores: session.items.map(() => true), practicedIndices: session.items.map((_, i) => i) };
  const state = recordWordPractice({ ...seed, activeSession: completed, wordHistory: touchWordHistory(seed, {wordIds:ids,kind:"reading",at}) }, ids, at);
  return saveLessonSession(state, state.activeSession!);
}

it("creates numbered new selections without changing old snapshots, including branching from the first lesson", async () => {
  let state = readState();
  const first = { ...(await buildTopicLesson(state,"food",false,{wordCount:6})).session, title:"Food" };
  expect(canContinueTopic(state, first)).toBe(false);
  await expect(nextTopicLesson(state,first)).rejects.toThrow(/Complete/);
  state = markCompleted(state, first);
  const original = structuredClone(state);
  const second = await nextTopicLesson(state,state.activeSession!);
  expect(second.title).toBe("Food 2");
  expect(second.id).not.toBe(first.id);
  expect(second.lessonPlan!.newWordIds.length).toBeGreaterThan(0);
  expect(second.lessonPlan!.newWordIds.some(id => first.targetWordIds!.includes(id))).toBe(false);
  expect(second.targetWordIds).toHaveLength(6);
  expect(state).toEqual(original);
  state = markCompleted(state,second);
  const third = await nextTopicLesson(state,state.lessonHistory!.find(row=>row.id===first.id)!.session);
  expect(third.title).toBe("Food 3");
  expect(third.topicSeries?.number).toBe(3);
  const beforeWords=practicedLessonWords(state);
  expect(third.lessonPlan!.newWordIds.every(id=>!beforeWords.has(id))).toBe(true);
  const exhausted={...state,wordHistory:touchWordHistory(state,{wordIds:a1CoreWordIdsForTopic("food"),kind:"reading"})};
  expect(canContinueTopic(exhausted, state.activeSession)).toBe(false);
});

it("opens a fresh numbered preview from My lessons and persists both lessons", async () => {
  let state=readState();
  const first={...(await buildTopicLesson(state,"food",false,{wordCount:6})).session,title:"Food"};
  state=markCompleted(state,first); state.activeSession=undefined;
  writeState(state); render(<App/>);
  fireEvent.click(screen.getByRole("button",{name:"Next lesson after Food"}));
  expect(await screen.findByRole("heading",{name:"Food 2"})).toBeInTheDocument();
  const saved=readState();
  expect(saved.lessonHistory).toHaveLength(2);
  expect(saved.wordHistory).toEqual(state.wordHistory);
  expect(saved.activeSession?.cursor).toBe(0);
  expect(saved.activeSession?.title).toBe("Food 2");
});

it("completes the ten-lesson, four-week schedule through the actual player", async () => {
  vi.useFakeTimers({toFake:["Date"]});
  const base=Date.parse("2026-08-03T18:00:00Z");
  const days=[0,1,3,6,9,12,16,19,24,28];
  const topics=["food","school","food","school","shopping","food","school","shopping","food","school"];
  let state=readState();
  state.settings={...state.settings,sound:false,autoplay:false,autoAdvance:false};
  const prior=new Map<string,ActiveSession>();
  for(let lesson=0;lesson<days.length;lesson++) {
    const start=base+days[lesson]*86400000;
    vi.setSystemTime(start);
    const topic=topics[lesson], previous=prior.get(topic);
    const session=previous?await nextTopicLesson(state,previous):(await buildTopicLesson(state,topic,false,{wordCount:6})).session;
    const before=structuredClone(state.wordHistory);
    assertLessonVocabulary(session.savedCards!,session.targetWordIds!,state);
    const initial={...saveLessonSession(state,session),activeSession:session};
    let latest=initial as LearnerState;
    function Player() { const [current,setCurrent]=useState<LearnerState>(initial); latest=current;
      return <PracticeSession state={current} onState={update=>setCurrent(old=>trackSessionChange(old,update(old)))} onExit={()=>{}} onDone={()=>{}} onToast={()=>{}}/>; }
    render(<Player/>);
    expect(latest.wordHistory).toEqual(before);
    const lastUse=new Map<string,string>();
    for(let index=0;index<session.items.length;index++) {
      vi.setSystemTime(start+(index+1)*18000);
      for(const token of session.savedCards![index].tokens) if(token.wordId)lastUse.set(token.wordId,new Date().toISOString());
      fireEvent.click(screen.getByRole("button",{name:index===session.items.length-1?"Complete lesson":"Next card"}));
    }
    expect(screen.getByRole("heading",{name:"Lesson complete"})).toBeInTheDocument();
    expect(isSessionComplete(latest.activeSession!)).toBe(true);
    for(const [id,at] of lastUse)expect(latest.wordHistory[id].review?.lastPracticedAt,id).toBe(at);
    for(const [id,row] of Object.entries(before))if(!lastUse.has(id))expect(latest.wordHistory[id]).toEqual(row);
    state=latest; prior.set(topic,latest.activeSession!); cleanup();
  }
  expect(state.lessonHistory).toHaveLength(10);
  expect(state.practiceSessionCount).toBe(10);
},20000);

it("keeps cold-start school practice contextual and connects yes/no to a response",async()=>{
  const school=(await buildTopicLesson(readState(),"school",false,{wordCount:6})).session;
  expect(school.savedCards!.every(card=>card.tokens.length>1)).toBe(true);
  const state=readState();
  state.wordHistory=touchWordHistory(state,{wordIds:["hai","iie","wakaru","wakarimasen","eigo","kanji"],kind:"reading"});
  const {personalizedCandidates}=await import("../../../packages/learning-engine/personalized");
  const candidates=personalizedCandidates(["hai","iie"],new Set(Object.keys(state.wordHistory)));
  expect(candidates.some(card=>card.english==="Yes, I understand English")).toBe(true);
  expect(candidates.some(card=>card.english==="No, I don't understand kanji")).toBe(true);
});
