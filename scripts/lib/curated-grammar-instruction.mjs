import fs from 'node:fs';
import {grammarRules} from './curated-grammar.mjs';

// Explicit, saved instructional placements. Rebuilding content never decides
// which grammar to teach or where; an author must edit the manifest.
export function applyGrammarInstruction(course){
  const plan=JSON.parse(fs.readFileSync('data/jp/curriculum/curated/grammar-instruction.json','utf8'));
  for(const lesson of course.lessons){
    for(const entry of plan.lessons[lesson.id]??[]){
      if(!lesson.cards[entry.start-1]||lesson.cards[entry.start-1].id!==entry.cardId)throw new Error(`${lesson.id}: grammar placement needs editorial review`);
      for(const id of entry.teaches)if(!grammarRules[id])throw new Error(`Unknown grammar ${id}`);
      let note=lesson.notes.find(note=>note.start===entry.start);
      if(entry.existing){
        if(!note||!note.explanation.includes(entry.evidence))throw new Error(`${lesson.id}: grammar explanation changed; review its declaration`);
      }else{
        const explanation=entry.explanation??entry.teaches.map(id=>grammarRules[id][1]).join(' ');
        if(note)note.explanation+=' '+explanation;
        else {note={start:entry.start,title:entry.title??'A new sentence pattern',pattern:entry.pattern??entry.teaches.map(id=>grammarRules[id][0]).join(' / '),explanation};lesson.notes.push(note);}
      }
      note.teaches=[...new Set([...(note.teaches??[]),...entry.teaches])];
    }
    lesson.notes.sort((a,b)=>a.start-b.start);
  }
}
