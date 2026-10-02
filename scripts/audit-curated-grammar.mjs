import fs from 'node:fs';
import {auditGrammarSequence} from './lib/curated-grammar-audit.mjs';
import {grammarRules} from './lib/curated-grammar.mjs';
const dir='data/jp/curriculum/curated',out='docs/reviews/2026-09-26-curated-course';
const plan=JSON.parse(fs.readFileSync(`${dir}/grammar-instruction.json`,'utf8'));
const starters=JSON.parse(fs.readFileSync('data/jp/curriculum/starter_lessons.json','utf8')).lessons;
const errors=[],introductions=[];
for(const lesson of starters)for(const entry of plan.foundations[lesson.id]??[]){
 const note=lesson.notes.find(note=>note.start===entry.start);
 if(!note||note.explanation!==entry.evidence)errors.push(`${lesson.id}: foundation explanation changed; review its grammar declaration`);
 else note.teaches=entry.teaches;
}
let result=auditGrammarSequence({topics:[{id:'foundations',lessonIds:starters.map(l=>l.id)}],lessons:starters});
errors.push(...result.errors);introductions.push(...result.introductions);
let inherited=result.learned;
for(const level of ['a1','a2','b1','b2','c1','c2']){
 const path=`${dir}/${level}.json`;if(!fs.existsSync(path))continue;
 const course=JSON.parse(fs.readFileSync(path,'utf8'));
 result=auditGrammarSequence(course,inherited);errors.push(...result.errors);introductions.push(...result.introductions);inherited=result.learned;
}
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(`${out}/grammar-audit.json`,JSON.stringify({trackedRules:Object.keys(grammarRules),introductions,errors},null,2)+'\n');
fs.writeFileSync(`${out}/grammar-audit.md`,`# Grammar before use\n\nThe audit walks every authored card in order, including recall checkpoints. Shared foundations come first. Each independent A1, A2 or B1 track starts from completed lower levels and shared foundations alone, keeping additional grammar within its owning track. Levels still awaiting restructuring follow their authored order; no later lesson may supply an earlier prerequisite. Saved declarations refer to actual displayed explanations; new explanations are placed before the first card that needs them. A form allowlist alone never counts as instruction.\n\nThis is a regression check for the tracked particles and constructions, not a complete Japanese parser or a substitute for reading every sentence. Lexical identity and inflection approval are checked separately. Counter readings, register, polysemy and idiom still require editorial review.\n\n${introductions.length} topic or foundation introductions; ${errors.length} ordering errors.\n\n| Topic | Lesson | Before card | Construction |\n|---|---|---:|---|\n${introductions.map(row=>`| ${row.topic} | ${row.lesson} | ${row.card} | ${row.pattern} |`).join('\n')}\n\n${errors.map(error=>`- ${error}`).join('\n')}\n`);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Grammar ordering: ${introductions.length} explicit introductions, no tracked construction used before instruction.`);
