import {grammarRules,requiredGrammar} from './curated-grammar.mjs';

export function auditGrammarSequence(course,inherited=new Set()){
  const errors=[],introductions=[],learned=new Set(inherited);
  const lessons=new Map(course.lessons.map(lesson=>[lesson.id,lesson]));
  for(const topic of course.topics){
    const known=course.progression==="linear" ? learned : new Set(inherited);
    for(const id of topic.lessonIds){
      const lesson=lessons.get(id);if(!lesson){errors.push(`${id}: missing lesson`);continue;}
      for(const [index,card] of lesson.cards.entries()){
        for(const note of lesson.notes.filter(note=>note.start===index+1))for(const rule of note.teaches??[]){
          if(!grammarRules[rule]){errors.push(`${id}: unknown instruction ${rule}`);continue;}
          if(!note.explanation)errors.push(`${id}: empty instruction for ${rule}`);
          if(course.grammarOwners && course.grammarOwners[rule]!==topic.id)errors.push(`${id}: ${rule} may only be introduced in its owning track`);
          if(known.has(rule))errors.push(`${id}: ${rule} is being introduced again`);
          if(!known.has(rule))introductions.push({topic:topic.id,lesson:id,card:index+1,rule,pattern:grammarRules[rule][0]});
          known.add(rule);learned.add(rule);
        }
        const {required,unknown}=requiredGrammar(card);
        for(const form of unknown)errors.push(`${card.id}: unclassified function form ${form}`);
        for(const rule of required)if(!known.has(rule))errors.push(`${card.id}: ${rule} used before instruction in ${topic.id}`);
        for(const rule of required)if(course.grammarOwners && !inherited.has(rule) && course.grammarOwners[rule]!==topic.id)errors.push(`${card.id}: ${rule} used outside its owning track`);
      }
    }
  }
  return {errors,introductions,learned};
}
