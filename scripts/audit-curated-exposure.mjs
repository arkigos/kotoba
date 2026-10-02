import fs from 'node:fs';

const dir='data/jp/curriculum/curated';
const courses=fs.readdirSync(dir).filter(name=>/^[abc][12]\.json$/.test(name)).map(name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8')));
const words=new Map(JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8')).map(row=>[row[0],{surface:row[1],level:row[8]}]));
const rows=[];
const a1=courses.find(course=>course.topics.some(topic=>topic.level==='A1'));
const starters=JSON.parse(fs.readFileSync('data/jp/curriculum/starter_lessons.json','utf8')).lessons;
const aliases=JSON.parse(fs.readFileSync('data/jp/dictionary/curated-course-aliases.json','utf8')).aliases;
for(const wordId of a1.foundationIds) {
  const uses=[...starters,...a1.lessons].map(lesson=>({lesson:lesson.id,cards:lesson.cards.filter(card=>card.tokens.some(token=>(aliases[token.dictionaryEntryId]??token.dictionaryEntryId??token.wordId)===wordId)).length})).filter(use=>use.cards);
  const appearances=uses.reduce((sum,use)=>sum+use.cards,0);
  rows.push({wordId,word:words.get(wordId)?.surface,level:'A1',topic:'A1-foundations',introduced:uses[0]?.lesson,lessonCount:uses.length,laterLessonCount:uses.length-1,appearances,lessons:uses.map(use=>use.lesson),passes:uses.length>=3&&appearances>=6});
}
for(const course of courses)for(const topic of course.topics) {
  const lessons=topic.lessonIds.map(id=>course.lessons.find(lesson=>lesson.id===id));
  for(const wordId of topic.wordIds) {
    const introduced=lessons.findIndex(lesson=>lesson.targets.includes(wordId));
    const uses=lessons.map((lesson,index)=>({lesson:lesson.id,index,cards:lesson.cards.filter(card=>card.tokens.some(token=>token.wordId===wordId)).length})).filter(use=>use.cards);
    const later=uses.filter(use=>use.index>introduced);
    const appearances=uses.reduce((sum,use)=>sum+use.cards,0);
    rows.push({wordId,word:words.get(wordId)?.surface,level:topic.level,topic:topic.id,introduced:lessons[introduced]?.id,lessonCount:uses.length,laterLessonCount:later.length,appearances,lessons:uses.map(use=>use.lesson),passes:uses.length>=3&&later.length>=2&&appearances>=6});
  }
}
const out='docs/reviews/2026-09-26-curated-course';fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(`${out}/exposure-audit.json`,JSON.stringify({policy:{minimumLessons:3,minimumLaterLessons:2,minimumAppearances:6},rows},null,2)+'\n');
const failed=rows.filter(row=>!row.passes);
const counts=['A1','A2','B1','B2','C1','C2'].map(level=>{const group=rows.filter(row=>row.level===level);return `| ${level} | ${group.length} | ${group.filter(row=>row.passes).length} | ${group.filter(row=>!row.passes).length} |`;});
fs.writeFileSync(`${out}/exposure-audit.md`,`# Distributed vocabulary exposure\n\nEach topic target needs at least six card appearances in three distinct lessons, including two after its introduction. Counts include fixed review checkpoints and ordinary later use. They measure opportunities for practice, not demonstrated retention or separate study days; the topic SRS manages the latter. Frequent helper words can naturally occur more often. Shared foundation words are also checked across their introductory lessons and the later A1 course.\n\n| Level | Authored words | Pass | Need repair |\n|---|---:|---:|---:|\n${counts.join('\n')}\n\n${failed.length?failed.map(row=>`- ${row.topic}: ${row.word} — ${row.appearances} appearances, ${row.laterLessonCount} later lessons`).join('\n'):'All currently authored words meet the exposure floor.'}\n`);
console.log(`Distributed exposure: ${rows.length-failed.length}/${rows.length} words pass. Report: ${out}/exposure-audit.md`);
if(failed.length)process.exitCode=1;
