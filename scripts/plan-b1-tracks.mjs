import fs from 'node:fs';
import {requiredGrammar} from './lib/curated-grammar.mjs';
import {topicDependencies} from './lib/curated-topic-dependencies.mjs';

// Read-only inspection of the explicit published partition; never unlocks tracks.
import {b1Tracks as tracks} from './lib/curated-b1-tracks.mjs';
const dir='data/jp/curriculum/curated',read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}.json`,'utf8'));
const course=read('b1'),lower=['a1','a2'].map(read),plan=read('grammar-instruction');
const grammar=new Set(Object.values(plan.foundations).flatMap(notes=>notes.flatMap(note=>note.teaches)));
const words=new Set(lower.flatMap(c=>[...c.foundationIds,...c.topics.flatMap(t=>t.wordIds)]));
for(const c of lower)for(const lesson of c.lessons)for(const note of lesson.notes)for(const rule of note.teaches??[])grammar.add(rule);
const owner=new Map(tracks.flatMap(track=>track.chapters.map(chapter=>[`B1-${chapter}`,track.id])));
if(owner.size!==tracks.reduce((sum,t)=>sum+t.chapters.length,0))throw new Error('A chapter has two proposed owners.');
const chapters=new Set(course.lessons.filter(l=>l.kind!=='review').map(l=>l.chapterId??l.topicId));
if(chapters.size!==owner.size||[...chapters].some(id=>!owner.has(id)))throw new Error('Assign every existing B1 chapter exactly once.');
const grammarOwners=Object.fromEntries(tracks.flatMap(track=>track.rules.map(rule=>[rule,track.id])));
const introductions=new Set(course.lessons.flatMap(l=>l.notes.flatMap(n=>n.teaches??[])));
if(Object.keys(grammarOwners).length!==tracks.reduce((sum,t)=>sum+t.rules.length,0)||[...introductions].some(rule=>!grammarOwners[rule]))throw new Error('Assign each introduced B1 construction exactly once.');
const originals=course.lessons.filter(l=>l.kind!=='review');
const proposal={progression:'independent-tracks',grammarOwners,topics:[],lessons:[]};
const violations=[];
for(const track of tracks){
 const lessons=track.chapters.flatMap(chapter=>originals.filter(l=>(l.chapterId??l.topicId)===`B1-${chapter}`)).map(lesson=>{
  const copy=structuredClone(lesson);copy.topicId=track.id;
  for(const note of copy.notes)note.teaches=(note.teaches??[]).filter(rule=>grammarOwners[rule]===track.id);
  for(const card of copy.cards){
   const illegal=requiredGrammar(card).required.filter(rule=>grammarOwners[rule]&&grammarOwners[rule]!==track.id);
   if(illegal.length)violations.push({track:track.id,chapter:lesson.chapterId??lesson.topicId,lesson:lesson.id,card:card.id,japanese:card.line.join(''),english:card.english,rules:illegal});
  }
  return copy;
 });
 proposal.topics.push({...track,level:'B1',wordIds:lessons.flatMap(l=>l.targets),lessonIds:lessons.map(l=>l.id)});
 proposal.lessons.push(...lessons);
}
const dependencies=topicDependencies(proposal,words,grammar);
const summary=tracks.map(track=>{
 const topic=proposal.topics.find(t=>t.id===track.id),needs=dependencies.find(t=>t.topic===track.id);
 const outside=violations.filter(v=>v.track===track.id);
 return {...track,words:topic.wordIds.length,lessons:topic.lessonIds.length,unmetWords:needs.words,unmetGrammar:needs.grammar,
  outsideGrammarCards:outside.length,ruleCounts:Object.fromEntries([...new Set(outside.flatMap(v=>v.rules))].map(rule=>[rule,outside.filter(v=>v.rules.includes(rule)).length]))};
});
const out='docs/reviews/2026-09-26-curated-course/b1-track-review';
fs.writeFileSync(`${out}.json`,JSON.stringify({status:'published-independent-tracks',summary,violations},null,2)+'\n');
fs.writeFileSync(`${out}.md`,[
 '# B1 independent-track review','',
 'The published partition assigns every current B1 source chapter and additional grammar rule. Counts concern authored B1 words only; remaining bounded vocabulary still needs lessons. Every track is checked from completed A1/A2 alone. The JSON companion identifies any outstanding dependencies.','',
 '| Proposed track | Existing words | Instructional lessons | Missing helper identities | Cards using another track’s grammar |',
 '|---|---:|---:|---:|---:|',
 ...summary.map(t=>`| ${t.title} | ${t.words} | ${t.lessons} | ${t.unmetWords.length} | ${t.outsideGrammarCards} |`),'',
 ...summary.flatMap(t=>[`## ${t.title}`,'',`Chapters: ${t.chapters.join(', ')}.`,``,
  `Own grammar: ${t.rules.join(', ')}.`,``,
  `Patterns needing replacement elsewhere in this track: ${Object.entries(t.ruleCounts).map(([rule,n])=>`${rule} (${n} cards)`).join(', ')||'None'}.`,``,
  `Missing helper identities: ${t.unmetWords.map(w=>`${w.surface} from ${w.owner}`).join('; ')||'None'}.`,``]),
 '## Ownership policy','',
 'Causal ので and source-attributed reports belong to public discussion. Practical tasks owns conditional と; work owns activity 中 and role として. Completed A1/A2 grammar is inherited. See the independent B1 decision for the editorial conversion, review limits, and remaining coverage.','',
].join('\n'));
console.log(summary.map(t=>`${t.id}: ${t.words} words; ${t.unmetWords.length} helper identities and ${t.outsideGrammarCards} cross-track grammar cards need work.`).join('\n'));
