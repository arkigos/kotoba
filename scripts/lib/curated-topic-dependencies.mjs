import {requiredGrammar} from './curated-grammar.mjs';

// A diagnostic for converting an ordered level into independent tracks. Lower
// levels may supply helpers; sibling topics in this level may not. Do not use
// a clean vocabulary-only result to unlock a topic whose grammar still depends
// on another one.
export function topicDependencies(course, inheritedWords, inheritedGrammar) {
 const lessons=new Map(course.lessons.map(lesson=>[lesson.id,lesson]));
 const owners=new Map(course.topics.flatMap(topic=>topic.wordIds.map(id=>[id,topic.id])));
 return course.topics.map(topic=>{
  const words=new Set(inheritedWords),grammar=new Set(inheritedGrammar);
  const wordNeeds=new Map(),grammarNeeds=new Map();
  for(const id of topic.lessonIds){
   const lesson=lessons.get(id);
   if(!lesson)throw new Error(`Missing authored lesson ${id}`);
   for(const word of lesson.targets)words.add(word);
   for(const [index,card] of lesson.cards.entries()){
    for(const note of lesson.notes.filter(note=>note.start===index+1))
     for(const rule of note.teaches??[])grammar.add(rule);
    for(const token of card.tokens){
     const word=token.dictionaryEntryId??token.wordId;
     if(word&&!words.has(word)&&!wordNeeds.has(word))
      wordNeeds.set(word,{id:word,owner:owners.get(word)??null,lesson:id,card:card.id,surface:token.surface});
    }
    for(const rule of requiredGrammar(card).required)
     if(!grammar.has(rule)&&!grammarNeeds.has(rule))grammarNeeds.set(rule,{rule,lesson:id,card:card.id});
   }
  }
  return {topic:topic.id,independent:!wordNeeds.size&&!grammarNeeds.size,
   words:[...wordNeeds.values()],grammar:[...grammarNeeds.values()]};
 });
}
