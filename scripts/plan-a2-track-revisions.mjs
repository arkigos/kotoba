import fs from 'node:fs';
import {requiredGrammar} from './lib/curated-grammar.mjs';
import {a2Tracks,a2GrammarOwners,a2TrackForChapter} from './lib/curated-a2-tracks.mjs';
const dir='data/jp/curriculum/curated';
const read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}.json`,'utf8'));
const course=read('a2');
const inherited=new Set([...Object.values(read('grammar-instruction').foundations).flatMap(e=>e.flatMap(n=>n.teaches)),...read('a1').lessons.flatMap(l=>l.notes.flatMap(n=>n.teaches??[]))]);
const owners=new Map(course.topics.flatMap(topic=>topic.wordIds.map(id=>[id,a2TrackForChapter(topic.id).id])));
const revisions=[];
for(const lesson of course.lessons.filter(l=>l.kind!=='review')){
 const track=a2TrackForChapter(lesson.topicId).id;
 for(const [offset,card] of lesson.cards.entries()){
  const grammar=requiredGrammar(card).required.filter(rule=>!inherited.has(rule)&&a2GrammarOwners[rule]!==track);
  const words=[...new Set(card.tokens.map(t=>t.wordId).filter(id=>owners.has(id)&&owners.get(id)!==track))];
  if(grammar.length||words.length)revisions.push({lesson:lesson.id,card:offset+1,track,grammar,words,line:card.line.join(''),english:card.english});
 }
}
fs.writeFileSync('.codex-a2-track-revisions.json',JSON.stringify({tracks:a2Tracks,revisions},null,2)+'\n');
for(const track of a2Tracks)console.log(`${track.id}: ${course.topics.filter(t=>a2TrackForChapter(t.id).id===track.id).reduce((n,t)=>n+t.wordIds.length,0)} words; ${revisions.filter(r=>r.track===track.id).length} original cards need revision.`);
