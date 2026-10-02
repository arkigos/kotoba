import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
const dir='data/jp/curriculum/curated', levels=['A1','A2','B1','B2','C1','C2'];
const courses=fs.readdirSync(dir).filter(name=>/^(a[12]|b[12]|c[12])\.json$/.test(name)).map(name=>read(`${dir}/${name}`));
const course={foundationIds:read(`${dir}/a1.json`).foundationIds,topics:courses.flatMap(c=>c.topics),lessons:courses.flatMap(c=>c.lessons)};
const index=read('public/dictionary/jp/study-index.json');
const wordsByLevel=Object.fromEntries(levels.map(level=>[level,index.filter(r=>r[8]===level).map((r,i)=>({rank:i+1,id:r[0],surface:r[1],reading:r[2],meaning:r[3],level}))]));
const words=new Map(Object.values(wordsByLevel).flat().map(word=>[word.id,word]));
const starters = read('data/jp/curriculum/starter_lessons.json').lessons;
const out = 'docs/reviews/2026-09-26-curated-course';
fs.mkdirSync(out,{recursive:true});
const escape = text => text.replaceAll('|','\\|').replaceAll('\n',' ');
const cards = lesson => lesson.cards.map((card,i)=>`| ${i+1} | ${escape(card.line.join(''))} | ${escape(card.tts.join(''))} | ${escape(card.english)} |`).join('\n');
for (const topic of course.topics) {
 const lessons = topic.lessonIds.map(id=>course.lessons.find(l=>l.id===id));
 const text = `# ${topic.title}\n\n${topic.description}\n\n${topic.wordIds.length} uniquely owned words · ${lessons.length} ordered lessons.\n\n` + lessons.map(lesson=>`## ${lesson.title}\n\nID: \`${lesson.id}\` · version ${lesson.version}\n\nTargets: ${lesson.targets.map(id=>`${words.get(id).surface} (${id})`).join(', ') || (lesson.kind==='review'?'Fixed recall checkpoint; no new words.':'Grammar consolidation; no new words.')}\n\nHelpers: ${lesson.helpers.map(id=>words.get(id)?.surface ?? id).join(', ')}\n\n${lesson.notes.map(note=>`**Card ${note.start}: ${note.pattern}**\n\n${note.explanation}`).join('\n\n')}\n\n| Card | Japanese | Reading | English |\n|---:|---|---|---|\n${cards(lesson)}`).join('\n\n');
 fs.writeFileSync(path.join(out,topic.id+'.md'),text+'\n');
}
fs.writeFileSync(path.join(out,'foundations.md'),'# Shared foundations\n\n'+starters.map(l=>`## ${l.title}\n\n${l.description}\n\n${l.notes.map(n=>`**Card ${n.start}: ${n.pattern}**\n\n${n.explanation}`).join('\n\n')}\n\n| Card | Japanese | Reading | English |\n|---:|---|---|---|\n${cards(l)}`).join('\n\n')+'\n');
const owner = new Map(course.foundationIds.map(id=>[id,{topic:'Foundations',lesson:'Shared foundation lessons'}]));
for(const topic of course.topics)for(const lesson of course.lessons.filter(l=>l.topicId===topic.id))for(const id of lesson.targets)owner.set(id,{topic:topic.title,lesson:lesson.title});
for(const level of levels) {
 const rows=wordsByLevel[level];
 const assigned=rows.filter(w=>owner.has(w.id)).length;
 fs.writeFileSync(path.join(out,`${level}-ownership.md`),`# ${level} vocabulary ownership\n\n${assigned}/${rows.length} bounded entries have authored lessons. Unassigned rows remain explicit work to do. A1 and A2 helpers come from shared starters, completed lower levels and earlier lessons in the same independent track. B1 still uses its authored chapter order. Pool ranks below are not stable authoring addresses; use the level authoring-ID manifest or createLevelAuthoring(level).words when editing source.\n\n| Pool rank | Entry | Japanese | Reading | Course meaning | Topic | Lesson |\n|---:|---|---|---|---|---|---|\n`+rows.map(w=>`| ${w.rank} | ${w.id} | ${w.surface} | ${w.reading} | ${escape(w.meaning)} | ${owner.get(w.id)?.topic ?? 'UNASSIGNED'} | ${owner.get(w.id)?.lesson ?? 'UNASSIGNED'} |`).join('\n')+'\n');
}
const fingerprints = Object.fromEntries([...starters,...course.lessons].map(l=>[l.id,{version:l.version,sha256:createHash('sha256').update(JSON.stringify({targets:l.targets,notes:l.notes,cards:l.cards})).digest('hex')}]));
fs.writeFileSync(path.join(out,'content-fingerprints.json'),JSON.stringify(fingerprints,null,2)+'\n');
const counts=levels.map(level=>{
 const topics=course.topics.filter(t=>t.level===level),lessons=course.lessons.filter(l=>topics.some(t=>t.id===l.topicId));
 return `- ${level}: ${wordsByLevel[level].filter(w=>owner.has(w.id)).length}/${wordsByLevel[level].length} words; ${topics.length} topics; ${lessons.filter(l=>l.kind!=='review').length} instructional lessons + ${lessons.filter(l=>l.kind==='review').length} recall checkpoints; ${new Set(lessons.flatMap(l=>l.cards.map(c=>c.id))).size} distinct cards / ${lessons.reduce((n,l)=>n+l.cards.length,0)} practice placements. [Ownership](${level}-ownership.md)`;
});
fs.writeFileSync(path.join(out,'README.md'),`# Curated course review packet\n\n${counts.join('\n')}\n\nPlus ${starters.length} shared foundations (${starters.reduce((n,l)=>n+l.cards.length,0)} cards).\n\n- [Foundations](foundations.md)\n- [Distributed word exposure](exposure-audit.md)\n- [Grammar before use](grammar-audit.md)\n${course.topics.map(t=>`- [${t.level}: ${t.title}](${t.id}.md)`).join('\n')}\n\nThis packet is an editorial review surface, not a substitute for reading the sentences. Mechanical validation checks identity, prerequisites, coverage, alignment, lexical forms and uniqueness. Unassigned words are not represented as a completed course.\n`);
console.log(`Exported review packet to ${out}`);
