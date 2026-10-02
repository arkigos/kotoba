import { requiredGrammar } from './curated-grammar.mjs';
import { trackRevisions, trackNoteRevisions, trackExtraCards } from './curated-a1-track-content.mjs';
import { trackInstruction } from './curated-a1-track-instruction.mjs';
import { trackLexicalNotes } from './curated-a1-track-notes.mjs';

export const a1Tracks = [
  { id: 'A1-people-communication', title: 'People and communication', description: 'Meet people, learn together, ask for help, and explain simple needs.', chapters: ['greetings','people','learning','conversation'] },
  { id: 'A1-things-choices', title: 'Things, food, and choices', description: 'Describe your surroundings, choose food and clothing, and say what you want.', chapters: ['food','home','nature','shopping','health','quantity'] },
  { id: 'A1-actions-time', title: 'Everyday actions and time', description: 'Talk about your day, make plans, and describe trips and past activities.', chapters: ['time','routine','leisure','travel'] },
];
export const sharedA1Grammar = new Set(['topic','copula','question','adjective','subject','polite','politeNegative','nounLink','also','object','ni','de','to','suru','past','copulaPast','copulaPastNegative','copulaNegative']);
export const a1GrammarOwners = Object.fromEntries([
  ['A1-people-communication', ['progressive','request','permission','reason','agreement','information']],
  ['A1-things-choices', ['itemRequest','desire','adjectivePast','adjectiveNegative','iAttribute','naAttribute']],
  ['A1-actions-time', ['origin','until','invitation','suggestion','adjectiveAdverb','adverbNi','nounAbility']],
].flatMap(([track,rules])=>rules.map(rule=>[rule,track])));
export const trackForChapter = id => a1Tracks.find(t=>t.id===id || t.chapters.some(chapter=>`A1-${chapter}`===id));
export function a1TrackGrammarErrors(course) {
  return course.lessons.flatMap(lesson=>lesson.cards.flatMap(card=>[...requiredGrammar(card).required]
    .filter(rule=>!sharedA1Grammar.has(rule) && a1GrammarOwners[rule]!==lesson.topicId)
    .map(rule=>`${card.id}: ${rule} belongs to ${a1GrammarOwners[rule]??'no track'}, not ${lesson.topicId}`)));
}

export function applyA1Tracks(course, token) {
 const moves={'A1-quantity-sharing':'A1-people-communication','A1-quantity-grammar-borrowing':'A1-people-communication','A1-conversation-zero':'A1-actions-time'};
 const foundations=new Set(course.foundationIds);
 for(const lesson of course.lessons){
  lesson.chapterId=lesson.topicId;
  lesson.topicId=moves[lesson.id]??trackForChapter(lesson.topicId).id;
  lesson.targets=lesson.targets.filter(id=>!foundations.has(id));
  for(const [position,[line,english]] of Object.entries(trackRevisions[lesson.id]??{})){
   const card=lesson.cards[Number(position)-1];if(!card)throw new Error(`${lesson.id}: no card ${position}`);
   const tokens=line.split(' ').map(token);
   Object.assign(card,{tokens,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),english});
  }
  for(const [line,english] of trackExtraCards[lesson.id]??[]){
   const tokens=line.split(' ').map(token);
   lesson.cards.push({id:`${lesson.id}-track-${lesson.cards.length+1}`,tokens,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),english,constructionKey:lesson.id,grammarTags:['Short exchanges']});
  }
  if(trackNoteRevisions[lesson.id]){
   const [title,pattern,explanation]=trackNoteRevisions[lesson.id];
   lesson.title=title;lesson.notes=[{start:1,title,pattern,explanation}];
  }
  lesson.helpers=[...new Set(lesson.cards.flatMap(c=>c.tokens.flatMap(t=>t.wordId&&!lesson.targets.includes(t.wordId)?[t.wordId]:[])))];
  for(const note of lesson.notes)delete note.teaches;
  if(Object.hasOwn(trackLexicalNotes,lesson.id)){
   const explanation=trackLexicalNotes[lesson.id];
   lesson.notes=explanation?[{start:1,title:lesson.title,pattern:lesson.cards[0].line.join(' '),explanation}]:[];
  }
  for(const instruction of trackInstruction[lesson.id]??[]){
   const existing=lesson.notes.findIndex(n=>n.start===instruction.start);
   if(existing>=0)lesson.notes[existing]=structuredClone(instruction);
   else lesson.notes.push(structuredClone(instruction));
  }
  lesson.notes.sort((a,b)=>a.start-b.start);
 }
 course.topics=a1Tracks.map(({chapters,...track})=>{
  const lessons=course.lessons.filter(l=>l.topicId===track.id);
  // Preserve the progression inside the original subject blocks. Moved blocks
  // follow the track's own chapters and only use that track or starter helpers.
  lessons.sort((a,b)=>(chapters.indexOf(a.chapterId.slice(3))<0?999:chapters.indexOf(a.chapterId.slice(3)))-(chapters.indexOf(b.chapterId.slice(3))<0?999:chapters.indexOf(b.chapterId.slice(3))));
  if(track.id==='A1-people-communication'){
   const borrowing=lessons.filter(l=>['A1-quantity-sharing','A1-quantity-grammar-borrowing'].includes(l.id));
   for(const l of borrowing)lessons.splice(lessons.indexOf(l),1);
   lessons.splice(lessons.findIndex(l=>l.id==='A1-learning-grammar-classroom')+1,0,...borrowing);
   const reason=lessons.find(l=>l.id==='A1-conversation-grammar-reasons');
   const why=lessons.find(l=>l.id==='A1-conversation-why');
   lessons.splice(lessons.indexOf(why),1);lessons.splice(lessons.indexOf(reason)+1,0,why);
   const sending=lessons.find(l=>l.id==='A1-conversation-sending');
   lessons.splice(lessons.indexOf(sending),1);lessons.push(sending);
  }
  return {...track,level:'A1',wordIds:lessons.flatMap(l=>l.targets),lessonIds:lessons.map(l=>l.id)};
 });
 const byId=new Map(course.lessons.map(l=>[l.id,l]));
 course.lessons=course.topics.flatMap(t=>t.lessonIds.map(id=>byId.get(id)));
 course.progression='independent-tracks';
 course.grammarOwners=a1GrammarOwners;
}
