import {describe,expect,it} from "vitest";
import {a1CoreWordIds,a1CoreWordIdsForTopic,a1Topics} from "../../../packages/dictionary/a1";
import {buildTopicLesson,extraTopicWordIds} from "../src/topic-course";
import {readState,touchWordHistory} from "../src/state";
import {assertLessonCardQuality} from "../src/lesson-card-quality";
import {assertLessonVocabulary} from "../src/lesson-vocabulary";
import {saveLessonSession} from "../src/session-history";
import {decodeStoredState,serializeStoredState} from "../src/storage-codec";
import type {LearnerState} from "../src/types";
function check(session:Awaited<ReturnType<typeof buildTopicLesson>>["session"],state:LearnerState) {
 expect(()=>assertLessonCardQuality(session.savedCards!)).not.toThrow();
 expect(()=>assertLessonVocabulary(session.savedCards!,session.targetWordIds!,state)).not.toThrow();
 expect(session.items.length).toBeLessThanOrEqual(48);
 expect(session.lessonPlan!.sections!.lesson).toBeLessThanOrEqual(24);
 expect(Object.values(session.lessonPlan!.appearances).every(n=>n>=1)).toBe(true);
 expect(session.lessonPlan!.pacing!.repeats).toBe(0);
}
describe("strict sentence planning across the authored scope",()=>{
 it("audits all default topics, failing closed where authored sentence coverage is missing",async()=>{
  localStorage.clear();const state=readState();let supported=0;const blocked:string[]=[];
  for(const topic of a1Topics) {
   try {const plan=await buildTopicLesson(state,topic.id);check(plan.session,state);supported++;}
   catch(error) {expect(String(error)).toMatch(/No supported sentence context|Not every selected word/);blocked.push(topic.id);}
  }
  expect(supported).toBeGreaterThanOrEqual(8);expect(blocked).toContain("greetings");
 });
 it("never silently drops an explicit target or supplies a one-word fallback in any core/extra batch",async()=>{
  localStorage.clear();const state=readState();let supported=0,blocked=0;
  for(const topic of a1Topics)for(const extras of [false,true]) {
   const pool=extras?extraTopicWordIds(topic.id):a1CoreWordIdsForTopic(topic.id);
   for(let i=0;i<pool.length;i+=12){const ids=pool.slice(i,i+12),before=JSON.stringify(state);
    try{const plan=await buildTopicLesson(state,topic.id,extras,{wordIds:ids});check(plan.session,state);expect(plan.session.targetWordIds).toEqual(ids);supported++;}
    catch(error){expect(String(error)).toMatch(/No supported sentence context|Not every selected word/);blocked++;}
    expect(JSON.stringify(state)).toBe(before);
   }
  }
  expect(supported).toBeGreaterThan(0);expect(blocked).toBeGreaterThan(0);
 });
 it("keeps late explicit selections unique with cumulative familiar vocabulary",async()=>{
  localStorage.clear();const state=readState();state.wordHistory=touchWordHistory(state,{wordIds:a1CoreWordIds,kind:"reading"});
  for(const topic of ["food","school","shopping"]){const ids=a1CoreWordIdsForTopic(topic).slice(-6);try {check((await buildTopicLesson(state,topic,false,{wordIds:ids})).session,state);} catch(error) {expect(String(error)).toMatch(/No supported sentence context/);}}
 });
 it("preserves 150 independently saved unique-sentence lessons within browser storage",async()=>{
  localStorage.clear();let state=readState();
  const template=(await buildTopicLesson(state,"food",false,{wordCount:6})).session;
  for(let i=0;i<150;i++)state=saveLessonSession(state,{...template,id:`lesson-${i}`,title:`Food ${i+1}`});
  const encoded=serializeStoredState(state);expect(encoded.length*2).toBeLessThan(4_000_000);
  const restored=decodeStoredState(JSON.parse(encoded));expect(restored.errors).toEqual([]);
  expect((restored.value as LearnerState).lessonHistory).toEqual(state.lessonHistory);
  expect(state.wordHistory).toEqual({});
 });
});
