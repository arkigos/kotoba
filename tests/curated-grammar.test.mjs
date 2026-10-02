import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {auditGrammarSequence} from '../scripts/lib/curated-grammar-audit.mjs';
import {requiredGrammar,grammarRules,grammarFormErrors} from '../scripts/lib/curated-grammar.mjs';
import {auditA1Scope} from '../scripts/lib/curated-a1-scope.mjs';
const a1=JSON.parse(fs.readFileSync('data/jp/curriculum/curated/a1.json','utf8'));
const a2=JSON.parse(fs.readFileSync('data/jp/curriculum/curated/a2.json','utf8'));
const b1=JSON.parse(fs.readFileSync('data/jp/curriculum/curated/b1.json','utf8'));
const scope=JSON.parse(fs.readFileSync('data/jp/curriculum/curated/a1-grammar-scope.json','utf8'));
const foundation=new Set(['topic','copula','question','subject','adjective','polite','politeNegative','nounLink','also']);
// A synthetic placement fixture: object marking now belongs to the starters,
// while these unit tests intentionally exercise first-use ordering in isolation.
const first=()=>({...structuredClone(a1.lessons.find(l=>l.id==='A1-food-first-meal')),notes:[
 {start:1,teaches:['object'],explanation:'を marks the object.'},
 {start:4,teaches:[],explanation:'A later cue.'},
]});
const one=lesson=>({topics:[{id:lesson.topicId,lessonIds:[lesson.id]}],lessons:[lesson]});
describe('curated grammar instruction order',()=>{
 it('requires without-doing instruction for both joined and split ずに',()=>{
  const wordId='jmdict:1471200';
  for(const tokens of [
   [{wordId,surface:'破らずに'}],
   [{wordId,surface:'破らず'},{surface:'に'}],
  ]){
   const card={id:'without-teaching',tokens,line:tokens.map(t=>t.surface)};
   const lesson={id:'without-teaching',topicId:'B1-daily',notes:[],cards:[card]};
   const known=new Set(Object.keys(grammarRules).filter(rule=>rule!=='withoutDoing'));
   expect(requiredGrammar(card).required).toContain('withoutDoing');
   expect(auditGrammarSequence(one(lesson),known).errors).toContain('without-teaching: withoutDoing used before instruction in B1-daily');
   lesson.notes=[{start:1,teaches:['withoutDoing'],explanation:'Use ずに for without doing.'}];
   expect(auditGrammarSequence(one(lesson),known).errors).toEqual([]);
  }
  expect(requiredGrammar({tokens:[{wordId,surface:'破りました'}],line:['破りました']}).required).not.toContain('withoutDoing');
 });
 it('recognizes a polite quoted reply without treating every answer as quotation',()=>{
  const card=structuredClone(b1.lessons.find(l=>l.id==='B1-post-information-for-a-meeting-account').cards[4]);
  expect(requiredGrammar(card).required).toContain('reportedSpeech');
  expect(requiredGrammar(card).required).not.toContain('conditionalTo');
  const answer=card.tokens.at(-1);
  const together={tokens:[{wordId:'jmdict:1540150',surface:'友人'},{surface:'と'},answer],line:['友人','と',answer.surface]};
  expect(requiredGrammar(together).required).toContain('to');
  expect(requiredGrammar(together).required).not.toContain('reportedSpeech');
 });
 it('tracks excessive actions and qualities independently of approved word forms',()=>{
  const make=(wordId,surface)=>({tokens:[{wordId,dictionaryEntryId:wordId,surface}],line:[surface]});
  for(const [id,surface] of [
   ['jmdict:1465610','入れすぎて'],['jmdict:1473740','買いすぎました'],
   ['jmdict:1588880','大きすぎます'],['jmdict:1214330','簡単すぎます'],
  ])expect(requiredGrammar(make(id,surface)).required,surface).toContain('excess');
  for(const [id,surface] of [
   ['jmdict:1465610','入れました'],['jmdict:1588880','大きい'],['jmdict:1214330','簡単'],
   ['jmdict:1195970','過ぎました'],['jmdict:1432980','通り過ぎました'],
  ])expect(requiredGrammar(make(id,surface)).required,surface).not.toContain('excess');
 });
 it('requires the excess lesson before using すぎる in the practical track',()=>{
  const lesson=structuredClone(b1.lessons.find(l=>l.id==='B1-household-too-much'));
  expect(lesson).toBeDefined();
  const known=new Set(Object.keys(grammarRules).filter(rule=>rule!=='excess'));
  expect(auditGrammarSequence(one(lesson),known).errors).toEqual([]);
  lesson.notes=lesson.notes.map(n=>({...n,teaches:[]}));
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('excess used before instruction'))).toBe(true);
 });
 it('reads 中 after a linked verb clause as inside, not an activity suffix',()=>{
  const tokens=[{wordId:'jmdict:1558610',dictionaryEntryId:'jmdict:1558610',surface:'裂けて'},
   {wordId:'jmdict:1423310',dictionaryEntryId:'jmdict:1423310',surface:'中',reading:'なか'},
   {surface:'の'}];
  const card={tokens,line:tokens.map(t=>t.surface)};
  expect(grammarFormErrors(card)).toEqual([]);
  expect(requiredGrammar(card).required).not.toContain('duringActivity');
 });
 it('rejects a clause particle hidden inside a lexical verb form',()=>{
  const lexical=surface=>({wordId:'jmdict:1465590',dictionaryEntryId:'jmdict:1465590',surface});
  expect(grammarFormErrors({tokens:[lexical('入ると')]})).toHaveLength(1);
  expect(grammarFormErrors({tokens:[lexical('入る'),{surface:'と'}]})).toEqual([]);
  expect(requiredGrammar({tokens:[lexical('入る'),{surface:'と'}],line:['入る','と']}).required).toContain('conditionalTo');
  expect(grammarFormErrors({tokens:[lexical('入りました')]})).toEqual([]);
 });
 it('rejects a second に after an adverb that already includes it',()=>{
  for(const [wordId,surface] of [['jmdict:1595480','徐々に'],['jmdict:1454670','特に']]){
   const adverb={wordId,surface};
   expect(grammarFormErrors({tokens:[adverb,{surface:'に'}]})).toHaveLength(1);
   expect(grammarFormErrors({tokens:[adverb,{surface:'増えました'}]})).toEqual([]);
  }
  expect(grammarFormErrors({tokens:[{wordId:'jmdict:1484920',surface:'非常'},{surface:'に'}]})).toEqual([]);
 });
 it('distinguishes a felt or reflected thought from a conditional sensory result',()=>{
  const lexical=(wordId,surface)=>({wordId,dictionaryEntryId:wordId,surface});
  const feel=lexical('jmdict:1212260','感じました');
  const reflect=lexical('jmdict:1480540','反省');
  const make=tokens=>({tokens,line:tokens.map(t=>t.surface)});
  for(const predicate of [feel,reflect]){
   const thought=make([lexical('jmdict:1221270','帰った'),{surface:'と'},predicate]);
   expect(requiredGrammar(thought).required).toContain('quote');
   expect(requiredGrammar(thought).required).not.toContain('conditionalTo');
  }
  const result=make([lexical('jmdict:1202450','開ける'),{surface:'と'},lexical('jmdict:1499720','風'),{surface:'を'},feel]);
  expect(requiredGrammar(result).required).toContain('conditionalTo');
  expect(requiredGrammar(result).required).not.toContain('quote');
  const together=make([lexical('jmdict:1540150','友人'),{surface:'と'},reflect]);
  expect(requiredGrammar(together).required).not.toContain('quote');
 });
 it('distinguishes the content of a conviction from a condition that leads to conviction',()=>{
  const index=JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8'));
  const lex=(base,surface=base)=>({wordId:index.find(w=>w[1]===base)[0],surface});
  const card=tokens=>({tokens,line:tokens.map(t=>t.surface)});
  const thought=card([lex('成功'),lex('する'),{surface:'と'},lex('確信'),lex('する','しています')]);
  expect(requiredGrammar(thought).required).toContain('quote');
  expect(requiredGrammar(thought).required).not.toContain('conditionalTo');
  const condition=card([lex('情報'),{surface:'を'},lex('見る'),{surface:'と'},lex('成功'),{surface:'を'},lex('確信'),lex('する','します')]);
  expect(requiredGrammar(condition).required).toContain('conditionalTo');
  expect(requiredGrammar(condition).required).not.toContain('quote');
  const together=card([lex('友人'),{surface:'と'},lex('成功'),{surface:'を'},lex('確信'),lex('する','しました')]);
  expect(requiredGrammar(together).required).not.toContain('quote');
 });
 it('recognizes hearsay after inflected plain predicates, not their appearance stems',()=>{
  const make=(id,surface)=>({tokens:[{wordId:id,dictionaryEntryId:id,surface},{surface:'そうです'}],line:[surface,'そうです']});
  for(const [id,surface] of [['jmdict:1202440','開かれる'],['jmdict:1456360','読める'],['jmdict:1202440','開かせる']]){
   const rules=requiredGrammar(make(id,surface)).required;
   expect(rules,surface).toContain('hearsay');
   expect(rules,surface).not.toContain('appearance');
   expect(rules,surface).not.toContain('verbAppearance');
  }
  for(const [id,surface] of [['jmdict:1202440','開かれ'],['jmdict:1456360','読め']])
   expect(requiredGrammar(make(id,surface)).required,surface).not.toContain('hearsay');
 });
 it('recognizes a reporting clause with its own subject and written quotation',()=>{
  for(const id of ['B1-post-renewing-contact','B1-language-familiar-you','B1-news-predictions-main']){
   const lesson=b1.lessons.find(l=>l.id===id);
   const card=lesson.cards.find(c=>c.line.includes('と'));
   expect(requiredGrammar(card).required,card.id).not.toContain('conditionalTo');
   expect(requiredGrammar(card).required,card.id).toContain('reportedSpeech');
  }
  const conditional=structuredClone(b1.lessons.find(l=>l.id==='B1-household-power').cards[0]);
  const written=b1.lessons.find(l=>l.id==='B1-post-renewing-contact').cards[2].tokens.find(t=>t.surface==='書きました');
  conditional.tokens.push(written);conditional.line=conditional.tokens.map(t=>t.surface);
  expect(requiredGrammar(conditional).required).toContain('conditionalTo');
 });
 it('keeps subject の before a verb inside a noun description track-owned',()=>{
  const card=structuredClone(b1.lessons.find(l=>l.id==='B1-health-body').cards[8]);
  expect(requiredGrammar(card).required).not.toContain('relativeSubjectNo');
  card.tokens.find(t=>t.surface==='が').surface='の';card.line=card.tokens.map(t=>t.surface);
  expect(requiredGrammar(card).required).toContain('relativeSubjectNo');
 });
 it('distinguishes sentence-initial でも from noun concession',()=>{
  const card=b1.lessons.find(l=>l.id==='B1-discussion-decision-account').cards[5];
  expect(requiredGrammar(card).required).toContain('contrast');
  expect(requiredGrammar(card).required).not.toContain('nounConcession');
  const concession=b1.lessons.find(l=>l.id==='B1-housing-comparison').cards[8];
  expect(requiredGrammar(concession).required).toContain('nounConcession');
 });

 it('distinguishes この中 from an activity followed by 中',()=>{
  const selection=b1.lessons.find(l=>l.id==='B1-science-even-rounding').cards[2];
  expect(selection.tts.join('')).toContain('このなか');
  expect(grammarFormErrors(selection)).toEqual([]);
  expect(requiredGrammar(selection).required).not.toContain('duringActivity');
  const inside=selection.tokens.find(t=>t.surface==='中');
  const work={wordId:'jmdict:1311110',surface:'仕事',reading:'しごと'};
  const activity={tokens:[work,inside],line:['仕事','中']};
  expect(grammarFormErrors(activity)).toHaveLength(1);
  expect(requiredGrammar(activity).required).toContain('duringActivity');
 });
 it('distinguishes a fused respectful favor from a request',()=>{
  const favor=b1.lessons.find(l=>l.id==='B1-science-motion').cards[8];
  expect(requiredGrammar(favor).required).toContain('benefactiveRespect');
  expect(requiredGrammar(favor).required).not.toContain('request');
  const request=b1.lessons.find(l=>l.id==='B1-science-gases').cards[5];
  expect(requiredGrammar(request).required).toContain('request');
  expect(requiredGrammar(request).required).not.toContain('benefactiveRespect');
 });
 it('recognizes compound する potential forms even when できる is a separate lexical token',()=>{
  const understanding=a2.lessons.find(l=>l.id==='A2-reasoning-opinions').cards[12].tokens.find(t=>t.surface==='理解しました');
  const can=a2.lessons.find(l=>l.id==='A2-study-ability').cards[0].tokens.find(t=>t.surface==='できます');
  const noun={...understanding,surface:'理解',reading:'りかい'};
  const split={line:['理解','できます'],tokens:[noun,can]};
  const fused={line:['理解できます'],tokens:[{...noun,surface:'理解できます',reading:'りかいできます'}]};
  expect(requiredGrammar(split).required).toContain('potential');
  expect(requiredGrammar(fused).required).toContain('potential');
  const nounAbility={line:['理解','が','できます'],tokens:[noun,{surface:'が'},can]};
  expect(requiredGrammar(nounAbility).required).not.toContain('potential');
  expect(requiredGrammar(nounAbility).required).toContain('nounAbility');
 });
 it('tracks lexical ため as grammar and introduces both uses in the owning A2 track',()=>{
  const recovery=structuredClone(a2.lessons.find(l=>l.id==='A2-care-recovery'));
  const purpose=recovery.cards.find(c=>c.tokens.some((t,i)=>t.surface==='ため'&&c.tokens[i+1]?.surface==='に'));
  const cause=recovery.cards.find(c=>c.tokens.some((t,i)=>t.surface==='ため'&&c.tokens[i+1]?.surface!=='に'));
  expect(requiredGrammar(purpose).required).toContain('purpose');
  expect(requiredGrammar(cause).required).toContain('causePurpose');
  const known=new Set(Object.keys(grammarRules).filter(r=>!['purpose','causePurpose','approaching'].includes(r)));
  expect(auditGrammarSequence(one(recovery),known).errors).toEqual([]);
  recovery.notes=[];
  for(const rule of ['purpose','causePurpose'])
   expect(auditGrammarSequence(one(recovery),known).errors.some(e=>e.includes(`${rule} used before instruction`))).toBe(true);
  expect(a2.grammarOwners.causePurpose).toBe('A2-world');
  expect(b1.lessons.flatMap(l=>l.notes.flatMap(n=>n.teaches??[]))).not.toContain('causePurpose');
 });
 it('teaches measurable adjective nouns before depth and size are used',()=>{
  const lesson=structuredClone(b1.lessons.find(l=>l.id==='B1-science-measurement'));
  expect(requiredGrammar(lesson.cards[0]).required).toContain('adjectiveQuantity');
  const known=new Set(Object.keys(grammarRules).filter(rule=>rule!=='adjectiveQuantity'));
  expect(auditGrammarSequence(one(lesson),known).errors).toEqual([]);
  lesson.notes=[];
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('adjectiveQuantity used before instruction'))).toBe(true);
  const source=b1.lessons.find(l=>l.id==='B1-science-space').cards[5];
  expect(requiredGrammar(source).required).toContain('adjectiveQuantity');
  expect(requiredGrammar({...source,tokens:source.tokens.map(t=>t.surface==='大きさ'?{...t,surface:'大きい'}:t)}).required).not.toContain('adjectiveQuantity');
 });
 it('rejects reintroduction of inherited grammar in a later level',()=>{
  const lesson={id:'A2-test',topicId:'A2-test',notes:[
   {start:1,teaches:['permission'],explanation:'Ask permission.'},
  ],cards:[{id:'A2-test-1',line:['です'],tokens:[{surface:'です'}]}]};
  const result=auditGrammarSequence({...one(lesson),progression:'linear'},new Set(['permission','copula']));
  expect(result.errors).toContain('A2-test: permission is being introduced again');
  lesson.notes=[];
  expect(auditGrammarSequence({...one(lesson),progression:'linear'},new Set(['permission','copula'])).errors).toEqual([]);
 });
 it('requires A2 naming instruction before reusing the pattern for B1 word labels',()=>{
  const lesson=structuredClone(a2.lessons.find(l=>l.id==='A2-cooking-naming-food'));
  for(const card of lesson.cards) expect(requiredGrammar(card).required).toContain('namedTerm');
  lesson.notes=[];
  const known=new Set(Object.keys(grammarRules).filter(k=>k!=='namedTerm'));
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('namedTerm used before instruction'))).toBe(true);
  const beginner={...lesson,id:'A1-test-naming',topicId:'A1-test'};
  expect(auditA1Scope([beginner],scope).some(e=>e.includes('namedTerm'))).toBe(true);
  const quotedVerb=b1.lessons.find(l=>l.id==='B1-language-nouns-verbs').cards[3];
  const rules=requiredGrammar(quotedVerb).required;
  expect(rules).toContain('namedTerm');
  expect(rules).not.toContain('reportedSpeech');
  expect(rules).not.toContain('conditionalTo');
 });
 it('checks the contextual reading of nine before the clock counter',()=>{
  const nine={wordId:'jmdict:1578150',surface:'九',reading:'きゅう'};
  const clock={surface:'時',reading:'じ'};
  expect(grammarFormErrors({tokens:[nine,clock]})).toHaveLength(1);
  expect(grammarFormErrors({tokens:[{...nine,reading:'く'},clock]})).toEqual([]);
  // An independently valid dictionary reading remains valid outside this counter.
  expect(grammarFormErrors({tokens:[nine,{surface:'です',reading:'です'}]})).toEqual([]);
  const actual=b1.lessons.find(l=>l.id==='B1-travel-meeting-approaching').cards[0];
  expect(grammarFormErrors(actual)).toEqual([]);
  expect(actual.tts.join('')).toContain('くじ');
 });
 it('distinguishes the standalone home greeting from respectful verbs and auxiliaries',()=>{
  const greeting={wordId:'jmdict:1000920',surface:'いらっしゃい'};
  for(const card of a2.lessons.find(l=>l.id==='A2-conversation-home-welcome').cards){
   expect(requiredGrammar(card).required).not.toContain('respectfulPresence');
   expect(requiredGrammar(card).required).not.toContain('respectfulAuxiliary');
  }
  for(const token of [{surface:'いらっしゃい'},{...greeting,wordId:'jmdict:1000940'},
    {...greeting,surface:'いらっしゃいます'}]){
   expect(requiredGrammar({tokens:[token],line:[token.surface]}).required).toContain('respectfulPresence');
  }
  expect(requiredGrammar({tokens:[{surface:'で'},greeting],line:['で',greeting.surface]}).required).toContain('respectfulAuxiliary');
 });
 it('requires respectful presence instruction and keeps it beyond A1',()=>{
  const lesson=structuredClone(b1.lessons.find(l=>l.id==='B1-visits-respectful-presence'));
  for(const card of [...lesson.cards,...b1.lessons.find(l=>l.id==='B1-visits-respectful-arrival').cards]){
   expect(requiredGrammar(card).required).toContain('respectfulPresence');
   expect(requiredGrammar(card).required).not.toContain('respectfulAuxiliary');
  }
  lesson.notes=[];
  const known=new Set(Object.keys(grammarRules).filter(k=>k!=='respectfulPresence'));
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('respectfulPresence used before instruction'))).toBe(true);
  const beginner={...lesson,id:'A1-test-respect',topicId:'A1-test'};
  expect(auditA1Scope([beginner],scope).some(e=>e.includes('respectfulPresence'))).toBe(true);
 });
 it('does not unlock respectful auxiliary constructions through the main verb',()=>{
  const irassharu={wordId:'jmdict:1000940',surface:'いらっしゃいます'};
  const oide={wordId:'jmdict:1001180',surface:'おいでになります'};
  const wait={wordId:JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8')).find(r=>r[1]==='待つ')[0],surface:'待って'};
  for(const tokens of [[wait,irassharu],[wait,oide],[{surface:'で'},irassharu],
    [{...wait,surface:'待っていらっしゃいます'}]]){
   const card={id:'test-respect-aux',tokens,line:tokens.map(t=>t.surface)};
   expect(requiredGrammar(card).required).toContain('respectfulAuxiliary');
   const lesson={id:'B1-test',topicId:'B1-test',notes:[],cards:[card]};
   const known=new Set(Object.keys(grammarRules).filter(k=>k!=='respectfulAuxiliary'));
   expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('respectfulAuxiliary used before instruction'))).toBe(true);
  }
 });
 it('distinguishes sudden sequencing from immediate timing and keeps both beyond A1',()=>{
  const lesson=b1.lessons.find(l=>l.id==='B1-time-sudden');
  for(const card of lesson.cards.slice(0,2)){
   expect(requiredGrammar(card).required).toContain('suddenSequence');
   expect(requiredGrammar(card).required).not.toContain('immediateAfter');
  }
  for(const card of lesson.cards.slice(2)){
   expect(requiredGrammar(card).required).toContain('immediateAfter');
   expect(requiredGrammar(card).required).not.toContain('suddenSequence');
  }
  const beginner={...structuredClone(lesson),id:'A1-test-timing',topicId:'A1-test'};
  expect(auditA1Scope([beginner],scope).some(e=>e.includes('suddenSequence'))).toBe(true);
  expect(auditA1Scope([beginner],scope).some(e=>e.includes('immediateAfter'))).toBe(true);
  for(const card of b1.lessons.find(l=>l.id==='B1-time-imminent').cards){
   expect(requiredGrammar(card).required).toContain('verbAppearance');
   expect(requiredGrammar(card).required).not.toContain('hearsay');
  }
 });
 it('distinguishes a verb endpoint from the beginner noun endpoint with まで',()=>{
  const lesson=structuredClone(a2.lessons.find(l=>l.id==='A2-time-until'));
  expect(requiredGrammar(lesson.cards[0]).required).toContain('untilClause');
  lesson.notes=[];
  const known=new Set(Object.keys(grammarRules).filter(k=>k!=='untilClause'));
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('untilClause used before instruction'))).toBe(true);
  expect(requiredGrammar(b1.lessons.find(l=>l.id==='B1-sports-progress').cards[3]).required).toContain('untilClause');
  const distance=a2.lessons.find(l=>l.id==='A2-quantity-distance');
  for(const card of distance.cards)expect(requiredGrammar(card).required).not.toContain('untilClause');
 });
 it('recognizes passive calling and plain prepared-state modifiers in paperwork',()=>{
  const counter=b1.lessons.find(l=>l.id==='B1-paperwork-counter').cards[2];
  expect(requiredGrammar(counter).required).toEqual(expect.arrayContaining(['passive','untilClause']));
  const note=b1.lessons.find(l=>l.id==='B1-paperwork-applications').cards[6];
  expect(requiredGrammar(note).required).toContain('preparedState');
 });
 it('detects simultaneous actions inside a reviewed lexical token',()=>{
  const lesson=structuredClone(b1.lessons.find(l=>l.id==='B1-discussion-understanding'));
  expect(requiredGrammar(lesson.cards[5]).required).toContain('simultaneous');
  const known=new Set(Object.keys(grammarRules).filter(k=>k!=='simultaneous'));
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('simultaneous used before instruction'))).toBe(true);
 });
 it('requires A2 ease and wish instruction before the B1 arts uses',()=>{
  const cases=[['A2-shopping-ease',0,'ease'],['A2-changes-changing-wishes',0,'pastDesire'],['A2-changes-changing-wishes',3,'changingDesire']];
  for(const [id,offset,rule] of cases){
   const lesson=structuredClone(a2.lessons.find(l=>l.id===id));
   expect(requiredGrammar(lesson.cards[offset]).required).toContain(rule);
   lesson.notes=lesson.notes.filter(n=>!n.teaches?.includes(rule));
   const known=new Set(Object.keys(grammarRules).filter(k=>k!==rule));
   expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes(`${rule} used before instruction`))).toBe(true);
  }
  expect(requiredGrammar(b1.lessons.find(l=>l.id==='B1-theatre-plays').cards[5]).required).toContain('pastDesire');
  expect(requiredGrammar(b1.lessons.find(l=>l.id==='B1-art-exhibiting').cards[3]).required).toContain('changingDesire');
  expect(requiredGrammar(b1.lessons.find(l=>l.id==='B1-art-crafts').cards[3]).required).toContain('ease');
  expect(requiredGrammar(b1.lessons.find(l=>l.id==='B1-feelings-account').cards[2]).required).not.toContain('pastDesire');
 });
 it('tracks reading and irregular する passives in publication contexts',()=>{
  expect(requiredGrammar(b1.lessons.find(l=>l.id==='B1-reading-literature').cards[3]).required).toContain('passive');
  const cards=b1.lessons.find(l=>l.id==='B1-reading-publishing').cards;
  expect(requiredGrammar(cards[3]).required).toContain('passive');
  expect(requiredGrammar(cards[5]).required).toContain('passive');
  expect(requiredGrammar(cards[2]).required).not.toContain('passive');
 });
 it('rejects past copula after an い-adjective even when each token is valid',()=>{
  const card=structuredClone(b1.lessons.find(l=>l.id==='B1-feelings-account').cards[2]);
  expect(grammarFormErrors(card)).toEqual([]);
  card.tokens.find(t=>t.surface==='ありがたかった').surface='ありがたい';
  card.tokens.at(-1).surface='でした';
  expect(grammarFormErrors(card)).toHaveLength(1);
  card.tokens.find(t=>t.surface==='ありがたい').surface='ありがたかった';
  expect(grammarFormErrors(card)).toHaveLength(1);
 });
 it('allows past copula after a な-adjective and a noun derived from an adjective',()=>{
  const words=JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8'));
  const word=(lemma,surface=lemma)=>({wordId:words.find(r=>r[1]===lemma)[0],surface});
  expect(grammarFormErrors({tokens:[word('嫌い'),{surface:'でした'}]})).toEqual([]);
  expect(grammarFormErrors({tokens:[word('高い','高さ'),{surface:'でした'}]})).toEqual([]);
  expect(grammarFormErrors({tokens:[word('高い','高かった'),{surface:'です'}]})).toEqual([]);
 });
 it('keeps the activity suffix 中 distinct from the lexical location noun',()=>{
  const cards=[a1,a2,b1].flatMap(c=>c.lessons.flatMap(l=>l.cards));
  const words=new Map(JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8')).map(r=>[r[0],r]));
  // Activity suffixes follow nominal forms, not a preceding clause such as 裂けて.
  const suffixes=cards.flatMap(card=>card.tokens.filter((t,i)=>{
   const previous=card.tokens[i-1],word=words.get(previous?.wordId);
   return t.surface==='中'&&word&&/(^|\|)(?:n|vs)(?:\||$)/.test(word[6])&&previous.surface===word[1]&&!['この','その','あの','どの'].includes(previous.surface);
  }));
  expect(suffixes.length).toBeGreaterThan(0);
  for(const token of suffixes){expect(token.reading).toBe('ちゅう');expect(token.wordId).toBeUndefined();}
  const location=a1.lessons.find(l=>l.id==='A1-home-locations').cards[4];
  expect(location.tokens.find(t=>t.surface==='中').reading).toBe('なか');
  expect(requiredGrammar(location).required).not.toContain('duringActivity');
  expect(grammarFormErrors(location)).toEqual([]);
  const travel=structuredClone(b1.lessons.find(l=>l.id==='B1-education-university').cards[8]);
  expect(grammarFormErrors(travel)).toEqual([]);
  travel.tokens.find(t=>t.surface==='中').reading='なか';
  expect(grammarFormErrors(travel).some(error=>error.includes('suffix reading'))).toBe(true);
 });
 it('requires activity-suffix instruction even when it is incorrectly bound as lexical なか',()=>{
  const lesson=structuredClone(b1.lessons.find(l=>l.id==='B1-education-university'));
  const card=lesson.cards[8];
  expect(requiredGrammar(card).required).toContain('duringActivity');
  const known=new Set(Object.keys(grammarRules).filter(id=>id!=='duringActivity'));
  lesson.notes=lesson.notes.filter(n=>!n.teaches?.includes('duringActivity'));
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes('duringActivity used before instruction'))).toBe(true);
  const suffix=card.tokens.find(t=>t.surface==='中');
  suffix.wordId='jmdict:1423310';suffix.dictionaryEntryId='jmdict:1423310';suffix.reading='なか';
  expect(requiredGrammar(card).required).toContain('duringActivity');
 });
 it('tracks the potential and passive forms used in road accounts',()=>{
  const route=b1.lessons.find(l=>l.id==='B1-directions-account').cards[1];
  const speed=b1.lessons.find(l=>l.id==='B1-driving-speed');
  expect(requiredGrammar(route).required).toContain('potential');
  expect(requiredGrammar(speed.cards[5]).required).toContain('passive');
  expect(requiredGrammar(speed.cards[4]).required).not.toContain('passive');
  const clothing=b1.lessons.find(l=>l.id==='B1-clothing-materials').cards[5];
  const shopping=b1.lessons.find(l=>l.id==='B1-shopping-buying').cards[4];
  expect(requiredGrammar(clothing).required).toContain('passive');
  expect(requiredGrammar(shopping).required).toContain('potential');
 });
 it('keeps the reviewed A1 boundary distinct from legal vocabulary and prior instruction',()=>{
  expect(auditA1Scope(a1.lessons,scope)).toEqual([]);
  const thought=a2.lessons.find(l=>l.id==='A2-conversation-humble');
  expect(auditA1Scope([thought],scope).some(e=>e.includes('quote exceeds'))).toBe(true);
  const classroom=a2.lessons.find(l=>l.id==='A2-people-selves');
  expect(auditA1Scope([classroom],scope).some(e=>e.includes('negativeRequest exceeds'))).toBe(true);
  const roads=a2.lessons.find(l=>l.id==='A2-travel-roads');
  expect(auditA1Scope([roads],scope).some(e=>e.includes('permission is limited'))).toBe(true);
 });
 it('requires the explanation by the exact first card that uses a construction',()=>{
  const lesson=first();expect(auditGrammarSequence(one(lesson),foundation).errors).toEqual([]);
  lesson.notes[0].teaches=[];lesson.notes[1].teaches=['object'];
  const result=auditGrammarSequence(one(lesson),foundation);
  expect(result.errors).toContain(`${lesson.cards[0].id}: object used before instruction in ${lesson.topicId}`);
 });
 it('does not inherit grammar from a freely selectable sibling topic',()=>{
  const firstTopic=first(),secondTopic=first();secondTopic.id='independent';secondTopic.topicId='independent';secondTopic.notes[0].teaches=[];
  const course={topics:[{id:firstTopic.topicId,lessonIds:[firstTopic.id]},{id:secondTopic.topicId,lessonIds:[secondTopic.id]}],lessons:[firstTopic,secondTopic]};
  expect(auditGrammarSequence(course,foundation).errors.some(e=>e.includes('in independent'))).toBe(true);
  expect(auditGrammarSequence(one(secondTopic),new Set([...foundation,'object'])).errors).toEqual([]);
 });
 it('carries instruction forward in the linear course but never borrows from a later chapter',()=>{
  const earlier=first(),later=first();later.id='later';later.topicId='later';later.notes[0].teaches=[];
  const course={progression:'linear',topics:[{id:earlier.topicId,lessonIds:[earlier.id]},{id:later.topicId,lessonIds:[later.id]}],lessons:[earlier,later]};
  expect(auditGrammarSequence(course,foundation).errors).toEqual([]);
  course.topics.reverse();
  expect(auditGrammarSequence(course,foundation).errors.some(e=>e.includes('object used before instruction in later'))).toBe(true);
 });
 it('rejects a new function form until it has its own audit classification',()=>{
  const lesson=first();lesson.cards[0].tokens.push({surface:'unknown-form',reading:'unknown-form'});
  expect(auditGrammarSequence(one(lesson),foundation).errors.some(e=>e.includes('unclassified function form'))).toBe(true);
 });
 it('distinguishes after doing from the starting-point particle and from a reason',()=>{
  const card=a2.lessons.find(l=>l.id==='A2-cooking-cutting').cards[0];
  expect(requiredGrammar(card).required).toContain('teAfter');
  expect(requiredGrammar(card).required).not.toContain('origin');
  expect(requiredGrammar(card).required).not.toContain('reason');
 });
 it('does not mistake lexical adverbs or ability verbs for unrelated constructions',()=>{
  const slowly=a1.lessons.find(l=>l.id==='A1-conversation-repair').cards[1];
  const ability=a1.lessons.find(l=>l.id==='A1-routine-shower-shopping').cards[5];
  expect(requiredGrammar(slowly).required).not.toContain('plainClause');
  expect(requiredGrammar(ability).required).not.toContain('approaching');
  expect(requiredGrammar(ability).required).toContain('nounAbility');
 });
 it('distinguishes a bring request from a respectful favor',()=>{
  const bring=a2.lessons.find(l=>l.id==='A2-study-materials').cards[11];
  const favor=a2.lessons.find(l=>l.id==='A2-conversation-respect').cards[7];
  expect(requiredGrammar(bring).required).toContain('teSequence');
  expect(requiredGrammar(bring).required).not.toContain('benefactiveRespect');
  expect(requiredGrammar(favor).required).toContain('benefactiveRespect');
 });
 it('distinguishes plain past, plain negatives, and polite or desire endings',()=>{
  const card=(id,n)=>a2.lessons.find(l=>l.id===id).cards[n-1];
  expect(requiredGrammar(card('A2-time-recent',8)).required).toContain('plainPast');
  expect(requiredGrammar(card('A2-conversation-apologies',6)).required).toContain('plainNegative');
  expect(requiredGrammar(card('A2-conversation-register',4)).required).toContain('plainPastNegative');
  const desire=a1.lessons.find(l=>l.id==='A1-food-grammar-wants').cards[4];
  expect(requiredGrammar(desire).required).toContain('desire');
  expect(requiredGrammar(desire).required).not.toContain('plainNegative');
  const polite=a2.lessons.find(l=>l.id==='A2-study-qualifications').cards[0];
  expect(requiredGrammar(polite).required).not.toContain('plainPast');
 });
 it('recognizes nominalizing lexical こと while leaving referential こと alone',()=>{
  const action=a2.lessons.find(l=>l.id==='A2-study-ability').cards[0];
  const fact=a2.lessons.find(l=>l.id==='A2-study-research').cards[3];
  expect(requiredGrammar(action).required).toContain('nominalThing');
  expect(requiredGrammar(fact).required).toContain('nominalThing');
  const noun=structuredClone(action);
  noun.tokens=[a2.lessons.flatMap(l=>l.cards).flatMap(c=>c.tokens).find(t=>t.surface==='この'),action.tokens.find(t=>t.surface==='こと')];
  noun.line=noun.tokens.map(t=>t.surface);
  expect(requiredGrammar(noun).required).not.toContain('nominalThing');
 });
 it('keeps verb appearance distinct from adjective appearance',()=>{
  const verb=a2.lessons.find(l=>l.id==='A2-nature-weather').cards[1];
  const tasty=a1.lessons.flatMap(l=>l.cards).flatMap(c=>c.tokens).find(t=>t.surface==='おいしい');
  const adjective={tokens:[{...tasty,surface:'おいし'},{surface:'そうです'}],line:['おいし','そうです']};
  expect(requiredGrammar(verb).required).toContain('verbAppearance');
  expect(requiredGrammar(verb).required).not.toContain('appearance');
  expect(requiredGrammar(adjective).required).toContain('appearance');
  expect(requiredGrammar(adjective).required).not.toContain('verbAppearance');
 });
 it.each([
  ['A2-conversation-introductions','contrast'],
  ['A2-conversation-respect','reportedSpeech'],
  ['A2-conversation-introductions','plainProgressive'],
  ['A2-conversation-apologies','plainNegative'],
  ['A2-conversation-register','explanatoryNo'],
  ['A2-practical-problems','concession'],
  ['A2-changes-intention','intention'],
  ['A2-changes-expectations','expectation'],
  ['A2-changes-unchanged','unchanged'],
  ['A2-quantity-comparison','adjectiveFormalNegative'],
  ['A2-work-obligations','obligation'],
 ])('requires the saved explanation in %s for %s',(id,rule)=>{
  const lesson=structuredClone(a2.lessons.find(l=>l.id===id));
  const introduced=new Set(lesson.notes.flatMap(note=>note.teaches??[]));
  const known=new Set(Object.keys(grammarRules).filter(r=>!introduced.has(r)));
  expect(auditGrammarSequence(one(lesson),known).errors).toEqual([]);
  for(const note of lesson.notes)note.teaches=(note.teaches??[]).filter(r=>r!==rule);
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes(`${rule} used before instruction`))).toBe(true);
 });

 it.each([
  ['B1-household-laundry','resourceFor'],
  ['B1-household-repairs','withoutDoing'],
  ['B1-household-power','conditionalTo'],
  ['B1-housing-agreement','standingArrangement'],
  ['B1-housing-comparison','nounConcession'],
  ['B1-language-examples','relativeSubjectNo'],
  ['B1-health-rest','recommendation'],
  ['B1-technology-printing','preparedState'],
  ['B1-news-sources','hearsay'],
  ['B1-news-sources','informationSource'],
  ['B1-time-sudden','suddenSequence'],
  ['B1-time-sudden','immediateAfter'],
 ])('requires the B1 explanation in %s for %s',(id,rule)=>{
  const lesson=structuredClone(b1.lessons.find(l=>l.id===id));
  const introduced=new Set(lesson.notes.flatMap(note=>note.teaches??[]));
  const known=new Set(Object.keys(grammarRules).filter(r=>!introduced.has(r)));
  expect(auditGrammarSequence(one(lesson),known).errors).toEqual([]);
  for(const note of lesson.notes)note.teaches=(note.teaches??[]).filter(r=>r!==rule);
  expect(auditGrammarSequence(one(lesson),known).errors.some(e=>e.includes(`${rule} used before instruction`))).toBe(true);
 });
 it('distinguishes conditional と from noun lists and quotation',()=>{
  const result=b1.lessons.find(l=>l.id==='B1-household-power').cards[0];
  expect(requiredGrammar(result).required).toContain('conditionalTo');
  expect(requiredGrammar(result).required).not.toContain('to');
  const thought=a2.lessons.find(l=>l.id==='A2-conversation-humble').cards[1];
  expect(requiredGrammar(thought).required).toContain('quote');
  expect(requiredGrammar(thought).required).not.toContain('conditionalTo');
  const research=a2.lessons.flatMap(l=>l.cards).flatMap(c=>c.tokens).find(t=>t.surface==='研究');
  const technology=a2.lessons.flatMap(l=>l.cards).flatMap(c=>c.tokens).find(t=>t.surface==='技術');
  const list={tokens:[research,{surface:'と'},technology],line:['研究','と','技術']};
  expect(requiredGrammar(list).required).toContain('to');
  expect(requiredGrammar(list).required).not.toContain('conditionalTo');
 });
 it('recognizes the same verb appearance whether です is split or joined',()=>{
  const joined=a2.lessons.find(l=>l.id==='A2-nature-weather').cards[1];
  const split=b1.lessons.find(l=>l.id==='B1-household-repairs').cards[5];
  expect(requiredGrammar(joined).required).toContain('verbAppearance');
  expect(requiredGrammar(split).required).toContain('verbAppearance');
 });

 it('distinguishes a deliberately prepared state from an action in progress',()=>{
  const prepared=b1.lessons.find(l=>l.id==='B1-technology-printing').cards[3];
  const ongoing=b1.lessons.find(l=>l.id==='B1-technology-editing').cards[0];
  expect(requiredGrammar(prepared).required).toContain('preparedState');
  expect(requiredGrammar(prepared).required).not.toContain('progressive');
  expect(requiredGrammar(ongoing).required).toContain('progressive');
  expect(requiredGrammar(ongoing).required).not.toContain('preparedState');
 });

 it('distinguishes reported information from appearance for verbs, nouns and adjectives',()=>{
  const sources=b1.lessons.find(l=>l.id==='B1-news-sources');
  const verb=b1.lessons.find(l=>l.id==='B1-news-coverage').cards[1];
  for(const card of [verb,...sources.cards.slice(-2)]){
   expect(requiredGrammar(card).required).toContain('hearsay');
   expect(requiredGrammar(card).required).toContain('informationSource');
   expect(requiredGrammar(card).required).not.toContain('appearance');
   expect(requiredGrammar(card).required).not.toContain('verbAppearance');
  }
  const appearance=b1.lessons.find(l=>l.id==='B1-weather-snow').cards[4];
  expect(requiredGrammar(appearance).required).toContain('verbAppearance');
  expect(requiredGrammar(appearance).required).not.toContain('hearsay');
 });

 it('recognizes positive obligation across godan, ichidan and suru forms',()=>{
  const lesson=a2.lessons.find(l=>l.id==='A2-work-obligations');
  expect(lesson.cards).toHaveLength(6);
  for(const card of lesson.cards){
   expect(requiredGrammar(card).required).toContain('obligation');
   expect(requiredGrammar(card).required).not.toContain('necessity');
   expect(requiredGrammar(card).required).not.toContain('negativeRequest');
  }
  const ordinaryNegative=a1.lessons.flatMap(l=>l.cards).find(c=>c.tokens.some(t=>t.surface==='飲みません'));
  expect(requiredGrammar(ordinaryNegative).required).not.toContain('obligation');
 });

 it('recognizes split hearsay without changing referential そうです into a report',()=>{
  const joined=b1.lessons.find(l=>l.id==='B1-news-coverage').cards[1];
  const tokens=joined.tokens.flatMap(t=>t.surface==='そうです'?[{surface:'そう'},{surface:'です'}]:[t]);
  expect(requiredGrammar({tokens,line:tokens.map(t=>t.surface)}).required).toContain('hearsay');
  const response={tokens:[{surface:'そう'},{surface:'です'}],line:['そう','です']};
  expect(requiredGrammar(response).required).toContain('so');
  expect(requiredGrammar(response).required).not.toContain('hearsay');
 });

});
