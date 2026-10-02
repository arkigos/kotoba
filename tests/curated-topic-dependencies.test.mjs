import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {topicDependencies} from '../scripts/lib/curated-topic-dependencies.mjs';
import {requiredGrammar} from '../scripts/lib/curated-grammar.mjs';
const read=name=>JSON.parse(readFileSync(`data/jp/curriculum/curated/${name}.json`,'utf8'));
it('keeps every B1 original distinct and revisits the science adjective noun pattern',()=>{
 const courses=['a1','a2','b1'].map(read),originals=courses.flatMap(c=>c.lessons).filter(l=>l.kind!=='review');
 const norm=card=>card.tts.join('').normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu,'');
 const seen=new Map();
 for(const lesson of originals)for(const card of lesson.cards){
  const key=norm(card);seen.set(key,[...(seen.get(key)??[]),card.id]);
 }
 for(const lesson of originals.filter(l=>l.topicId.startsWith('B1-')))for(const card of lesson.cards)
  expect(seen.get(norm(card)),card.id).toEqual([card.id]);
 const recurrence=courses[2].lessons.filter(l=>l.topicId==='B1-science').map(lesson=>
  lesson.cards.filter(card=>requiredGrammar(card).required.includes('adjectiveQuantity')).length);
 expect(recurrence.filter(n=>n>0).length).toBeGreaterThanOrEqual(3);
 expect(recurrence.reduce((sum,n)=>sum+n,0)).toBeGreaterThanOrEqual(6);
});
it('detects sibling vocabulary and grammar despite an otherwise valid ordered course',()=>{
 const course={topics:[{id:'one',wordIds:['a'],lessonIds:['a']},{id:'two',wordIds:[],lessonIds:['b']}],lessons:[
  {id:'a',targets:['a'],notes:[{start:1,teaches:['itemRequest']}],cards:[{id:'a1',line:['a','ください'],tokens:[{wordId:'a',surface:'a'},{surface:'ください'}]}]},
  {id:'b',targets:[],notes:[],cards:[{id:'b1',line:['a','ください'],tokens:[{wordId:'a',surface:'a'},{surface:'ください'}]}]},
 ]};
 const rows=topicDependencies(course,new Set(),new Set());
 expect(rows[0].independent).toBe(true);
 expect(rows[1].words).toEqual([{id:'a',owner:'one',lesson:'b',card:'b1',surface:'a'}]);
 expect(rows[1].grammar).toEqual([{rule:'itemRequest',lesson:'b',card:'b1'}]);
 expect(topicDependencies(course,new Set(['a']),new Set(['itemRequest']))[1].independent).toBe(true);
});
 it('keeps every published A1, A2 and B1 track independent',()=>{
 const a1=read('a1'),a2=read('a2'),b1=read('b1'),plan=read('grammar-instruction');
 const words=new Set(a1.foundationIds);
 const grammar=new Set(Object.values(plan.foundations).flatMap(entries=>entries.flatMap(entry=>entry.teaches)));
 expect(topicDependencies(a1,words,grammar).every(topic=>topic.independent)).toBe(true);
 for(const course of [a1,a2,b1]){
  expect(topicDependencies(course,words,grammar).filter(topic=>!topic.independent)).toEqual([]);
  for(const topic of course.topics)for(const id of topic.wordIds)words.add(id);
  for(const lesson of course.lessons)for(const note of lesson.notes)for(const rule of note.teaches??[])grammar.add(rule);
 }
 const science=topicDependencies(b1,words,grammar).find(topic=>topic.topic==='B1-science');
 expect(science.words).toEqual([]);
 expect(science.grammar).toEqual([]);
});
