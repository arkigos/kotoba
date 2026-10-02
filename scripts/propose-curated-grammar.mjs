import fs from 'node:fs';
import {requiredGrammar,grammarRules} from './lib/curated-grammar.mjs';
const dir='data/jp/curriculum/curated';
const courses=fs.readdirSync(dir).filter(name=>/^[abc][12]\.json$/.test(name)).map(name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8')));
const starters=JSON.parse(fs.readFileSync('data/jp/curriculum/starter_lessons.json','utf8')).lessons;
const foundation={
 'starter-belongings-also':[{start:1,teaches:['nounLink']},{start:7,teaches:['also']}],
 'starter-identity':[{start:1,teaches:['topic','copula']},{start:10,teaches:['question']}],
 'starter-descriptions':[{start:1,teaches:['adjective']}],
 'starter-existence':[{start:1,teaches:['subject','polite']},{start:7,teaches:['politeNegative']}],
};
const plan={version:1,scope:'Explicit grammar instruction in fixed lessons. Foundations and chapters follow one authored sequence; earlier instruction carries forward.',foundations:foundation,lessons:{}};
const lower=new Set(Object.values(foundation).flatMap(entries=>entries.flatMap(entry=>entry.teaches)));
for(const course of courses){
 const learnedThisLevel=new Set();
 for(const topic of course.topics){
  const known=lower;
  for(const lesson of topic.lessonIds.map(id=>course.lessons.find(lesson=>lesson.id===id)).filter(lesson=>!lesson.kind)){
   for(const [index,card] of lesson.cards.entries()){
    const {required,unknown}=requiredGrammar(card);if(unknown.length)throw new Error(`${card.id}: ${unknown}`);
    const newIds=required.filter(id=>!known.has(id));
    if(newIds.length){(plan.lessons[lesson.id]??=[]).push({start:index+1,cardId:card.id,teaches:newIds});for(const id of newIds){known.add(id);learnedThisLevel.add(id);}}
   }
  }
 }
 for(const id of learnedThisLevel)lower.add(id);
}
fs.writeFileSync(`${dir}/grammar-instruction.proposal.json`,JSON.stringify(plan,null,2)+'\n');
for(const [id,entries] of Object.entries(plan.lessons))console.log(id,entries.map(entry=>`${entry.start}: ${entry.teaches.join(',')}`).join('; '));
console.log(Object.keys(plan.lessons).length,'lessons with grammar introductions');
