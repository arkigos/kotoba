import fs from 'node:fs';
import {topicDependencies} from './lib/curated-topic-dependencies.mjs';
const dir='data/jp/curriculum/curated',out='docs/reviews/2026-09-26-curated-course';
const read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}.json`,'utf8'));
const plan=read('grammar-instruction');
const words=new Set(read('a1').foundationIds);
const grammar=new Set(Object.values(plan.foundations).flatMap(entries=>entries.flatMap(entry=>entry.teaches)));
const levels=[];
for(const level of ['a1','a2','b1','b2','c1','c2']){
 if(!fs.existsSync(`${dir}/${level}.json`))continue;
 const course=read(level),topics=topicDependencies(course,words,grammar);
 levels.push({level:level.toUpperCase(),progression:course.progression,topics});
 for(const topic of course.topics)for(const id of topic.wordIds)words.add(id);
 for(const lesson of course.lessons)for(const note of lesson.notes)for(const rule of note.teaches??[])grammar.add(rule);
 console.log(`${level.toUpperCase()}: ${topics.filter(topic=>topic.independent).length}/${topics.length} topics self-contained after completed lower levels.`);
}
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(`${out}/topic-dependencies.json`,JSON.stringify({levels},null,2)+'\n');
fs.writeFileSync(`${out}/topic-dependencies.md`,[
 '# Independent-topic prerequisites','',
 'This diagnostic starts each topic with completed lower levels only. Each unmet word or tracked grammar rule includes its first affected card in the JSON companion. It does not change progression or certify sentence quality. A1 and A2 use independent tracks; B1 remains ordered until its dependencies are resolved.','',
 '| Level | Topic | Unmet word identities | Unmet grammar rules | Independent |',
 '|---|---|---:|---:|---|',
 ...levels.flatMap(level=>level.topics.map(topic=>`| ${level.level} | ${topic.topic} | ${topic.words.length} | ${topic.grammar.map(entry=>entry.rule).join(', ')||'None'} | ${topic.independent?'Yes':'No'} |`)),
 '',
].join('\n'));
