import {it,expect} from 'vitest';
import {auditGrammarSequence} from '../scripts/lib/curated-grammar-audit.mjs';
import {grammarFormErrors,requiredGrammar} from '../scripts/lib/curated-grammar.mjs';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(`data/jp/curriculum/curated/${name}.json`,'utf8'));
it.each(['a1','a2','b1'])('returns to every %s track-owned grammar concept in later lessons',level=>{
 const course=read(level);
 for(const [pattern,owner] of Object.entries(course.grammarOwners)){
  const lessonIds=new Set(course.topics.find(t=>t.id===owner).lessonIds);
  const appearances=course.lessons.filter(l=>lessonIds.has(l.id)).map(lesson=>
   lesson.cards.filter(card=>requiredGrammar(card).required.includes(pattern)).length);
  expect(appearances.filter(n=>n>0).length,`${pattern}: lessons`).toBeGreaterThanOrEqual(3);
  expect(appearances.reduce((sum,n)=>sum+n,0),`${pattern}: cards`).toBeGreaterThanOrEqual(6);
 }
});
it('rejects cross-track grammar even after another track has taught it',()=>{
 const course={progression:'independent-tracks',grammarOwners:{itemRequest:'one'},topics:[{id:'one',lessonIds:['a']},{id:'two',lessonIds:['b']}],lessons:[
  {id:'a',notes:[{start:1,teaches:['itemRequest'],explanation:'Ask for an item.'}],cards:[{id:'a-1',tokens:[{surface:'ください'}],line:['ください']}]},
  {id:'b',notes:[],cards:[{id:'b-1',tokens:[{surface:'ください'}],line:['ください']}]},
 ]};
 expect(auditGrammarSequence(course).errors).toContain('b-1: itemRequest used outside its owning track');
 course.lessons[1].notes=[{start:1,teaches:['itemRequest'],explanation:'Ask for an item again.'}];
 expect(auditGrammarSequence(course).errors).toContain('b: itemRequest may only be introduced in its owning track');
});
it('requires an amount before the ten-thousand-yen unit',()=>{
 const bad={tokens:[{surface:'は'},{surface:'万'},{surface:'円'}]};
 expect(grammarFormErrors(bad)).toHaveLength(1);
 const lesson=read('a1').lessons.find(l=>l.id==='A1-shopping-prices');
 for(const card of lesson.cards.slice(4,6)){
  expect(card.line.join('')).toContain('一万円');
  expect(card.tts.join('')).toContain('いちまんえん');
  expect(grammarFormErrors(card)).toEqual([]);
 }
});
