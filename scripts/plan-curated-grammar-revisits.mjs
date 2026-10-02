import fs from 'node:fs';
import {requiredGrammar} from './lib/curated-grammar.mjs';
import {applyCuratedRevisits} from './lib/curated-revisits.mjs';

// Offline proposal only. Persist actual card references, inspect the expanded
// course, and validate before publishing. Playback never chooses these cards.
const source=process.argv.find(arg=>arg.startsWith('--source='))?.slice(9);
if(!source)throw new Error('Provide an instructional course with --source=PATH.');
const course=JSON.parse(fs.readFileSync(source,'utf8'));
if(!course.grammarOwners)throw new Error('Assign explicit grammar owners first.');
const path='data/jp/curriculum/curated/topic-revisits.json';
const plan=JSON.parse(fs.readFileSync(path,'utf8'));
for(const topic of course.topics)plan.topics[topic.id]=(plan.topics[topic.id]??[]).filter(p=>!p.id.startsWith(`${topic.id}-grammar-recall-`));
const withWords=structuredClone(course);applyCuratedRevisits(withWords,plan);
const norm=card=>card.tts.join('').normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu,'');
let added=0;
for(const topic of course.topics){
 const originals=topic.lessonIds.map(id=>course.lessons.find(l=>l.id===id));
 const slots=new Map();
 for(const [rule,owner] of Object.entries(course.grammarOwners)){
  if(owner!==topic.id)continue;
  const counts=withWords.lessons.filter(l=>l.topicId===owner).map(l=>l.cards.filter(c=>requiredGrammar(c).required.includes(rule)).length);
  if(counts.filter(n=>n>0).length>=3&&counts.reduce((a,b)=>a+b,0)>=6)continue;
  const occurrences=originals.flatMap((lesson,index)=>lesson.cards.filter(c=>requiredGrammar(c).required.includes(rule)).map(card=>({card,index})));
  const distinct=[...new Map(occurrences.map(row=>[norm(row.card),row])).values()].slice(0,2);
  if(distinct.length<2)throw new Error(`${rule}: author at least two distinct contexts before scheduling grammar recall.`);
  const lastSource=Math.max(...distinct.map(row=>row.index));
  for(const gap of [2,5]){
   const slot=Math.min(lastSource+gap,originals.length-1);
   if(slot<=lastSource)throw new Error(`${rule}: leave room after instruction for spaced practice.`);
   const entry=slots.get(slot)??{cards:new Map(),rules:new Set()};
   for(const {card} of distinct)entry.cards.set(card.id,card);
   entry.rules.add(rule);slots.set(slot,entry);
  }
 }
 let serial=0;
 for(const [slot,entry] of [...slots].sort(([a],[b])=>a-b)){
  const unique=[...new Map([...entry.cards.values()].map(card=>[norm(card),card])).values()];
  const batches=[];for(let i=0;i<unique.length;i+=12)batches.push(unique.slice(i,i+12));
  for(const batch of batches){
   const used=new Set(batch.map(norm));
   const familiar=originals.slice(0,slot+1).reverse().flatMap(l=>l.cards);
   while(batch.length<4){const card=familiar.find(c=>!used.has(norm(c)));if(!card)throw new Error('Not enough prior contexts.');batch.push(card);used.add(norm(card));}
   serial++;
   plan.topics[topic.id].push({id:`${topic.id}-grammar-recall-${serial}`,title:'Recall · Patterns in use',afterLessonId:originals[slot].id,cardIds:batch.map(c=>c.id),grammarRules:[...entry.rules]});
   added++;
  }
 }
}
fs.writeFileSync(path,JSON.stringify(plan,null,2)+'\n');
console.log(`Saved ${added} grammar recall checkpoints. Inspect the fixed references and rerun the course audits.`);
