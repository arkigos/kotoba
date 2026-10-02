import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PracticeSession } from "../src/PracticeSession";
import { buildCustomLesson } from "../src/custom-lesson";
import { clearLessonShelf, recentLessons, restoreClearedLessons, saveLessonSession, isSessionComplete } from "../src/session-history";
import { decodeStoredState, encodeStoredState } from "../src/storage-codec";
import { readState, touchWordHistory } from "../src/state";
import { reviewStatus, suggestReviewWords } from "../src/review";
import { practicedLessonWords } from "../src/lesson-vocabulary";
import { preferOlderContexts } from "../src/review-context-selection";
import { knownHelperRanks } from "../src/adaptive-lesson";
import { personalizedCandidates } from "../../../packages/learning-engine/personalized";
import type { LearnerState } from "../src/types";

beforeEach(()=>localStorage.clear());
afterEach(()=>{cleanup();vi.useRealTimers();});

it("clears every snapshot durably, keeps learning, and restores alongside new lessons", async()=>{
  const state=readState(), lesson=(await buildCustomLesson(state,["watashi","yomu","hon"])).session;
  const saved=saveLessonSession({...state,activeSession:lesson},lesson);
  const cleared=clearLessonShelf(saved);
  expect(recentLessons(cleared)).toEqual([]);
  expect(cleared.wordHistory).toBe(saved.wordHistory);
  const decoded=decodeStoredState(encodeStoredState(cleared));
  expect(decoded.errors).toEqual([]);
  const recovered=decoded.value as LearnerState;
  const newLesson={...(await buildCustomLesson(recovered,["mizu","nomu"])).session,id:"after-clear"};
  const restored=restoreClearedLessons(saveLessonSession(recovered,newLesson));
  expect(recentLessons(restored)).toHaveLength(2);
  expect(recentLessons(restored).find(row=>row.id===lesson.id)!.session.savedCards).toEqual(lesson.savedCards);
  expect(restored.clearedLessons).toEqual([]);
});

it("refreshes target and incidental helper timers through the actual player, without credit for previews", async()=>{
  vi.useFakeTimers({toFake:["Date"]});
  const old="2026-09-01T12:00:00.000Z", at="2026-09-10T12:00:00.000Z";
  vi.setSystemTime(new Date(at));
  let seed=readState();
  seed={...seed,wordHistory:touchWordHistory(seed,{wordIds:["watashi","yomu","hon"],kind:"reading",at:old})};
  for(const word of Object.values(seed.wordHistory)) word.review={occasions:1,lastPracticedAt:old,lastOccasionAt:old,lastPracticeSequence:1};
  seed.practiceSessionCount=1;
  const before=structuredClone(seed.wordHistory);
  const session=(await buildCustomLesson(seed,["shinbun","manga"],{includeReview:false})).session;
  expect(seed.wordHistory).toEqual(before);
  expect(session.savedCards!.some(card=>card.tokens.some(token=>token.wordId==="yomu"))).toBe(true);
  let latest: LearnerState=seed;
  function Harness(){const [state,setState]=useState<LearnerState>({...seed,settings:{...seed.settings,sound:false,autoplay:false,autoAdvance:false},activeSession:session});latest=state;return <PracticeSession state={state} onState={setState} onExit={vi.fn()} onDone={vi.fn()} onToast={vi.fn()}/>;}
  render(<Harness/>);
  expect(latest.wordHistory).toEqual(before);
  for(let i=0;i<session.items.length-1;i++)fireEvent.click(screen.getByRole("button",{name:"Next card"}));
  fireEvent.click(screen.getByRole("button",{name:"Complete lesson"}));
  expect(isSessionComplete(latest.activeSession!)).toBe(true);
  for(const id of ["watashi","yomu","shinbun","manga"]){
    expect(latest.wordHistory[id].review?.lastPracticedAt).toBe(at);
    expect(reviewStatus(latest.wordHistory[id],latest)).toMatchObject({due:false,sessionsAgo:0});
  }
  expect(latest.wordHistory.hon).toEqual(before.hon);
  expect(suggestReviewWords(latest,0)[0].wordId).toBe("hon");
  expect([...practicedLessonWords(latest)]).toEqual(expect.arrayContaining(["hon","watashi","yomu","shinbun","manga"]));
});

it("prefers older interchangeable helpers without making recent helpers unavailable",()=>{
  const cards=personalizedCandidates(["yomu","hon"],new Set(["watashi","sensei"]));
  const candidates=cards.filter(card=>card.constructionKey==="action").map(card=>({card,targets:["yomu","hon"],unknown:[]}));
  const teacher=candidates.find(row=>row.card.tokens.some(token=>token.wordId==="sensei"))!;
  const first=preferOlderContexts([teacher],candidates,{watashi:0,sensei:1});
  expect(first[0].card.tokens.some(token=>token.wordId==="watashi")).toBe(true);
  const only=preferOlderContexts([teacher],[teacher],{watashi:0,sensei:1});
  expect(only[0]).toBe(teacher);
  expect(preferOlderContexts([teacher],candidates,{watashi:0,sensei:0})[0]).toBe(teacher);
  const seed=readState();
  const ranks=knownHelperRanks({...seed,wordHistory:touchWordHistory(seed,{wordIds:["watashi","sensei"],kind:"reading",at:"2026-09-10T12:00:00.000Z"})});
  expect(ranks.watashi).toBe(ranks.sensei);
});

it("uses a frequent sentence once and shortens the lesson instead of repeating it",async()=>{
  const seed=readState();
  const state={...seed,wordHistory:touchWordHistory(seed,{wordIds:["watashi","yomu","hon","nihongo"],kind:"reading"})};
  const {session}=await buildCustomLesson(state,["kaku","eigo","kanji","shinbun"],{includeReview:false});
  const cards=session.savedCards!;
  expect(cards.length).toBeLessThanOrEqual(24);
  expect(new Set(cards.map(card=>card.line.join(""))).size).toBe(cards.length);
  cards.slice(1).forEach((card,i)=>expect([card.line,card.english]).not.toEqual([cards[i].line,cards[i].english]));
  expect(cards.some(card=>card.tokens.some(token=>token.wordId==="shinbun"))).toBe(true);
});
