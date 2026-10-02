// Authored A2 track design. The compiler must not infer ownership from whichever
// chapter happens to use a construction first.
import {a2TrackRevisions} from './curated-a2-track-content.mjs';
import {a2TrackInstruction} from './curated-a2-track-instruction.mjs';
import {a2TrackNotes} from './curated-a2-track-notes.mjs';
import {a2TrackPractice} from './curated-a2-track-practice.mjs';
export const a2SourceChapters=["A2-time", "A2-travel", "A2-places", "A2-home", "A2-cooking", "A2-shopping", "A2-quantity", "A2-study", "A2-people", "A2-nature", "A2-sports", "A2-work", "A2-culture", "A2-technology", "A2-conversation", "A2-feelings", "A2-changes", "A2-practical", "A2-descriptions", "A2-reasoning", "A2-care", "A2-safety", "A2-society"];
export const a2Tracks=[
 {id:'A2-stories',title:'People, stories, and plans',description:'Describe experiences, understand people, and explain thoughts and plans.',chapters:['time','study','people','conversation','feelings','changes','reasoning']},
 {id:'A2-daily',title:'Home, food, and getting things done',description:'Manage everyday tasks, prepare food, and explain how things happen.',chapters:['home','cooking','practical']},
 {id:'A2-choices',title:'Choices and comparisons',description:'Compare options, describe qualities, and explain what is possible or necessary.',chapters:['shopping','quantity','descriptions']},
 {id:'A2-work',title:'Work, interests, and technology',description:'Talk about work and interests, set goals, and describe products and technology.',chapters:['sports','work','culture','technology']},
 {id:'A2-world',title:'Travel, nature, and health',description:'Find your way, explore the natural world, and discuss health and community life.',chapters:['travel','places','nature','care','safety','society']},
];
export const a2GrammarOwners=Object.fromEntries([
 ['A2-stories',['plainClause','plainPast','teSequence','untilClause','about','negativeRequest','ability','nominalThing','benefactive','quote','contrast','plainProgressive','so','reportedSpeech','benefactiveRespect','nominalize','plainNegative','plainPastNegative','explanatoryNo','change','pastDesire','changingDesire','intention','condition','expectation','unchanged']],
 ['A2-daily',['teAfter','simultaneous','regretted','namedTerm','try','concession']],
 ['A2-choices',['comparison','comparisonSide','both','ease','adjectiveFormalNegative','potential','necessity']],
 ['A2-work',['goal','obligation','passive']],
 ['A2-world',['verbAppearance','approaching','purpose','causePurpose']],
].flatMap(([owner,rules])=>rules.map(rule=>[rule,owner])));
export function a2TrackForChapter(id){return a2Tracks.find(track=>track.id===id||track.chapters.includes(id.replace(/^A2-/,'')));}

export function applyA2Tracks(course,token,words){
 // Cross-level @ helpers remain handled by the ordinary resolver. A unique
 // current-level surface in an explicit revision resolves to its stable rank;
 // validation still requires that target to be taught earlier in this track.
 const resolve=spec=>{
  const [key,...rest]=spec.split('~');
  if(key.startsWith('@')){
   const matches=words.filter(word=>word.surface===key.slice(1));
   if(matches.length===1)return token([String(matches[0].rank),...rest].join('~'));
  }
  return token(spec);
 };
 const makeCard=(lesson,line,english)=>{
  const tokens=line.split(' ').map(resolve);
  return {id:`${lesson.id}-track-${lesson.cards.length+1}`,tokens,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),english,constructionKey:lesson.id,grammarTags:['Practice']};
 };
 const context=course.lessons.find(lesson=>lesson.id==='A2-descriptions-context');
 const recovery=course.lessons.find(lesson=>lesson.id==='A2-care-recovery');
 const tame=words[216].id;
 context.targets=context.targets.filter(id=>id!==tame);
 const purposeCards=context.cards.filter(card=>card.tokens.some(t=>t.wordId===tame));
 context.cards=context.cards.filter(card=>!purposeCards.includes(card));
 recovery.targets.push(tame);
 recovery.cards.push(...purposeCards);
 // Resolve the formerly standalone helper through the same lexical identity.
 for(const lesson of course.lessons)if(['A2-care','A2-society'].includes(lesson.topicId))for(const card of lesson.cards){
  card.tokens=card.tokens.flatMap(t=>t.surface==='ために'?[token('217'),token('に')]:[t]);
  card.line=card.tokens.map(t=>t.surface);card.tts=card.tokens.map(t=>t.reading);card.explain=card.tokens.map(t=>t.explain);
 }
 for(const lesson of course.lessons){
  lesson.chapterId=lesson.topicId;
  lesson.topicId=a2TrackForChapter(lesson.topicId).id;
  for(const [position,[line,english]] of Object.entries(a2TrackRevisions[lesson.id]??{})){
   const card=lesson.cards.find(card=>card.id.endsWith(`-${String(position).padStart(3,'0')}`));
   if(!card)throw new Error(`${lesson.id}: no card ${position}`);
   const tokens=line.split(' ').map(resolve);
   Object.assign(card,{tokens,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),english});
  }
  for(const [line,english] of a2TrackPractice[lesson.id]??[])lesson.cards.push(makeCard(lesson,line,english));
  lesson.notes=lesson.notes.filter(note=>note.start===1||!note.teaches?.length||note.teaches.some(rule=>a2GrammarOwners[rule]===lesson.topicId));
  for(const note of lesson.notes){
   note.teaches=(note.teaches??[]).filter(rule=>a2GrammarOwners[rule]===lesson.topicId);
   if(note.title==='A new sentence pattern')note.title='Grammar in this lesson';
  }
  const revision=a2TrackNotes[lesson.id];
  if(revision){const note=lesson.notes.find(note=>note.start===1);if(!note)throw new Error(`${lesson.id}: no opening note`);[note.pattern,note.explanation]=revision;}
  if(lesson.id==='A2-care-recovery')lesson.notes.find(note=>note.start===1).teaches.push('purpose','causePurpose');
  if(lesson.id==='A2-cooking-food-words')lesson.notes=lesson.notes.filter(note=>note.start!==7);
  for(const note of a2TrackInstruction[lesson.id]??[])lesson.notes.push(structuredClone(note));
  lesson.notes.sort((a,b)=>a.start-b.start);
  lesson.helpers=[...new Set(lesson.cards.flatMap(c=>c.tokens.flatMap(t=>t.wordId&&!lesson.targets.includes(t.wordId)?[t.wordId]:[])))];
 }
 const luggage=course.lessons.find(lesson=>lesson.id==='A2-travel-luggage');
 const companion=words[623].id;
 luggage.targets=luggage.targets.filter(id=>id!==companion);
 const cards=luggage.cards.filter(card=>card.tokens.some(token=>token.wordId===companion));
 luggage.cards=luggage.cards.filter(card=>!cards.includes(card));
 luggage.helpers=[...new Set(luggage.cards.flatMap(card=>card.tokens.flatMap(t=>t.wordId&&!luggage.targets.includes(t.wordId)?[t.wordId]:[])))];
 course.lessons.push({id:'A2-stories-companions',topicId:'A2-stories',chapterId:'A2-people',version:2,title:'Taking someone with you',targets:[companion],helpers:[...new Set(cards.flatMap(card=>card.tokens.flatMap(t=>t.wordId!==companion&&t.wordId?[t.wordId]:[])))],notes:[{start:1,title:'Taking someone with you',pattern:'人を連れて行きます / 人を連れて来ます',explanation:'連れる is used for taking a person or animal along. 行く and 来る specify whether you take them away or bring them here.'}],cards});
 const companionLesson=course.lessons.at(-1);
 for(const [line,english] of [
  ['@弟 を @学校 に 624~連れて~つれて @行く~行きます~いきます','I will take my younger brother to school.'],
  ['@犬 を @公園 に 624~連れて~つれて @行く~行きました~いきました','I took my dog to the park.'],
  ['@妹 を 624~連れて~つれて @来る~来てください~きてください','Please bring your younger sister along.'],
  ['@先生 を @教室 に 624~連れて~つれて @来る~来ました~きました','I brought the teacher to the classroom.'],
 ])companionLesson.cards.push(makeCard(companionLesson,line,english));
 companionLesson.helpers=[...new Set(companionLesson.cards.flatMap(card=>card.tokens.flatMap(t=>t.wordId&&t.wordId!==companion?[t.wordId]:[])))];
 course.topics=a2Tracks.map(({chapters,...track})=>{
  const lessons=course.lessons.filter(lesson=>lesson.topicId===track.id);
  lessons.sort((a,b)=>chapters.indexOf(a.chapterId.slice(3))-chapters.indexOf(b.chapterId.slice(3)));
  return {...track,level:'A2',wordIds:lessons.flatMap(lesson=>lesson.targets),lessonIds:lessons.map(lesson=>lesson.id)};
 });
 const byId=new Map(course.lessons.map(lesson=>[lesson.id,lesson]));
 course.lessons=course.topics.flatMap(topic=>topic.lessonIds.map(id=>byId.get(id)));
 course.progression='independent-tracks';course.grammarOwners=a2GrammarOwners;
}
