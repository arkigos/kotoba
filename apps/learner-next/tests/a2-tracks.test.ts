import {readState} from '../src/state';
import {starterLessons,buildStarterLesson} from '../src/starter-lessons';
import {markLessonAlreadyKnown} from '../src/known-lesson';
import {curatedTopics,curatedLessons,buildCuratedLesson,curatedAvailable,loadCuratedLesson,assertCuratedVocabulary,curatedLevelProgress,curatedPrerequisite} from '../src/curated-course';
import {canContinueTopic,nextTopicLesson} from '../src/next-topic-lesson';
import type {LearnerState} from '../src/types';

let completedA1: LearnerState;
beforeAll(async()=>{
 localStorage.clear();
 completedA1=readState();
 for(const lesson of starterLessons)completedA1=markLessonAlreadyKnown(completedA1,buildStarterLesson(completedA1,lesson.id));
 for(const topic of curatedTopics.filter(t=>t.level==='A1'))for(const id of topic.lessonIds)
  completedA1=markLessonAlreadyKnown(completedA1,await buildCuratedLesson(completedA1,id));
 expect(curatedLevelProgress(completedA1,'A1').complete).toBe(true);
});

it('walks each A2 track using only completed A1 and its own preceding lessons',async()=>{
 const b1=curatedTopics.find(t=>t.level==='B1')!;
 for(const topic of curatedTopics.filter(t=>t.level==='A2')){
  let state=structuredClone(completedA1);
  expect(curatedAvailable(state,topic.lessonIds[0]),topic.id).toBe(true);
  expect(curatedPrerequisite(topic.lessonIds[0])).toBeUndefined();
  expect(curatedAvailable(state,topic.lessonIds[1])).toBe(false);
  for(const [index,id] of topic.lessonIds.entries()){
   const session=await buildCuratedLesson(state,id);
   expect(session.savedCards).toEqual((await loadCuratedLesson(id)).cards);
   state=markLessonAlreadyKnown(state,session);
   const completed={...session,cursor:session.items.length,completedByDeclarationAt:new Date().toISOString()};
   if(index<topic.lessonIds.length-1){
    expect(canContinueTopic(state,completed)).toBe(true);
    expect((await nextTopicLesson(state,completed)).curatedLessonId).toBe(topic.lessonIds[index+1]);
   }else{
    expect(canContinueTopic(state,completed)).toBe(false);
    await expect(nextTopicLesson(state,completed)).rejects.toThrow(/choose another topic/);
   }
  }
  expect(curatedLevelProgress(state,'A2').complete).toBe(false);
  expect(curatedAvailable(state,b1.lessonIds[0])).toBe(false);
 }
},30000);

it('does not let another A2 track’s completion or word history license its vocabulary',async()=>{
 const [one,two]=curatedTopics.filter(t=>t.level==='A2');
 const session=await buildCuratedLesson(completedA1,one.lessonIds[0]);
 const state=markLessonAlreadyKnown(completedA1,session);
 expect(()=>assertCuratedVocabulary(session.savedCards!,[],state,one.id)).not.toThrow();
 expect(()=>assertCuratedVocabulary(session.savedCards!,[],state,two.id)).toThrow(/unlearned/);
 expect(curatedAvailable(state,two.lessonIds[0])).toBe(true);
});

it('requires all A2 tracks and recall checkpoints before B1',()=>{
 const state=structuredClone(completedA1);
 for(const topic of curatedTopics.filter(t=>t.level==='A2'))for(const id of topic.lessonIds){
  const lesson=curatedLessons.find(l=>l.id===id)!;
  state.curatedProgress!.completions[id]={version:lesson.version,at:'2026-10-01T12:00:00Z',method:'declared'};
 }
 const b1=curatedTopics.find(t=>t.level==='B1')!;
 expect(curatedLevelProgress(state,'A2')).toMatchObject({learned:1267,total:1267,complete:true});
 expect(curatedAvailable(state,b1.lessonIds[0])).toBe(true);
 const recall=curatedLessons.find(l=>l.topicId==='A2-world'&&l.kind==='review')!;
 delete state.curatedProgress!.completions[recall.id];
 expect(curatedLevelProgress(state,'A2')).toMatchObject({learned:1267,complete:false});
 expect(curatedAvailable(state,b1.lessonIds[0])).toBe(false);
});

it('does not use a superseded A2 completion to skip the revised lesson',()=>{
 const state=structuredClone(completedA1),topic=curatedTopics.find(t=>t.id==='A2-stories')!;
 const first=curatedLessons.find(l=>l.id===topic.lessonIds[0])!;
 state.curatedProgress!.completions[first.id]={version:first.version-1,at:'2026-09-30T12:00:00Z',method:'declared'};
 expect(curatedLevelProgress(state,'A2').learned).toBe(0);
 expect(curatedAvailable(state,first.id)).toBe(true);
 expect(curatedAvailable(state,topic.lessonIds[1])).toBe(false);
});
