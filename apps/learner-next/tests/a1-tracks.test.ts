import {readState} from '../src/state';
import {starterLessons,buildStarterLesson} from '../src/starter-lessons';
import {markLessonAlreadyKnown} from '../src/known-lesson';
import {knownLessonWords,lessonConceptId,unknownLessonWords} from '../src/lesson-vocabulary';
import {curatedTopics,buildCuratedLesson,curatedAvailable,loadCuratedLesson,assertCuratedVocabulary,curatedLevelProgress} from '../src/curated-course';
import {canContinueTopic,nextTopicLesson} from '../src/next-topic-lesson';

function foundations(){
 let state=readState();
 for(const l of starterLessons){
  const unknown=l.cards.flatMap(c=>unknownLessonWords(c,new Set(l.targets.map(lessonConceptId)),knownLessonWords(state)));
  expect([...new Set(unknown)],l.id).toEqual([]);
  state=markLessonAlreadyKnown(state,buildStarterLesson(state,l.id));
 }
 return state;
}
beforeEach(()=>localStorage.clear());
it('opens and completes every A1 track independently from only the starters',async()=>{
 for(const topic of curatedTopics.filter(t=>t.level==='A1')){
  let state=foundations();
  expect(curatedAvailable(state,topic.lessonIds[0])).toBe(true);
  for(const id of topic.lessonIds){
   const session=await buildCuratedLesson(state,id);
   expect(session.savedCards).toEqual((await loadCuratedLesson(id)).cards);
   state=markLessonAlreadyKnown(state,session);
   const completed={...session,cursor:session.items.length,completedByDeclarationAt:new Date().toISOString()};
   if(canContinueTopic(state,completed))expect((await nextTopicLesson(state,completed)).topicId).toBe(topic.id);
  }
  expect(curatedLevelProgress(state,'A1').complete).toBe(false);
  expect(curatedAvailable(state,curatedTopics.find(t=>t.level==='A2')!.lessonIds[0])).toBe(false);
 }
},30000);
it('does not license another A1 track’s words through unrelated practice history',async()=>{
 const state=foundations();
 const food=await loadCuratedLesson('A1-food-first-meal');
 const learned=markLessonAlreadyKnown(state,await buildCuratedLesson(state,food.id));
 expect(()=>assertCuratedVocabulary(food.cards,[],learned,'A1-people-communication')).toThrow(/unlearned/);
});
