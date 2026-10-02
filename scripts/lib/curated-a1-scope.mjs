import {requiredGrammar} from './curated-grammar.mjs';

export function auditA1Scope(lessons,policy){
 const allowed=new Set(policy.allowedRules),errors=[];
 for(const lesson of lessons){
 if(lesson.targets.length>policy.maximumNewWords)errors.push(`${lesson.id}: ${lesson.targets.length} new words exceed the reviewed A1 lesson budget`);
 for(const card of lesson.cards){
  const {required}=requiredGrammar(card),sentence=card.tokens.map(t=>t.surface).join('');
  for(const rule of required)if(!allowed.has(rule))errors.push(`${card.id}: ${rule} exceeds the reviewed A1 grammar scope`);
  if(required.includes('permission')&&!sentence.includes('借りてもいいですか'))errors.push(`${card.id}: A1 permission is limited to the borrowing question`);
  if(card.tokens.some(t=>t.wordId==='jmdict:1589350')&&!sentence.includes('どう思いますか'))errors.push(`${card.id}: productive thought clauses belong in A2`);
 }
 }
 return errors;
}
