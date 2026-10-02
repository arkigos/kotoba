import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const starters=read('data/jp/curriculum/starter_lessons.json').lessons;
const course=read('data/jp/curriculum/curated/a1.json');
const bindings=read('data/jp/dictionary/course_bindings.json').words;
const canonical=id=>course.aliases[bindings[id]?.entryId??id]??bindings[id]?.entryId??id;
const words=new Map(read('public/dictionary/jp/study-index.json').map(row=>[row[0],row]));
const forms=read('data/jp/curriculum/curated/reviewed-forms.json').forms;
const known=new Set(),errors=[];
for(const lesson of starters){
 const targets=lesson.targets.map(canonical),allowed=new Set([...known,...targets]);
 for(const id of targets){
  if(known.has(id))errors.push(`${lesson.id}: repeated target ${id}`);
  if(words.get(id)?.[8]!=='A1')errors.push(`${lesson.id}: target outside A1 ${id}`);
  if(lesson.cards.filter(c=>c.tokens.some(t=>t.wordId&&canonical(t.wordId)===id)).length<3)errors.push(`${lesson.id}: insufficient target practice ${id}`);
 }
 const seen=new Set();
 for(const card of lesson.cards){
  const sentence=card.tts.join('').normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu,'');
  if(seen.has(sentence))errors.push(`${card.id}: repeated sentence`);seen.add(sentence);
  for(const [i,t] of card.tokens.entries()){
   if(card.line[i]!==t.surface||card.tts[i]!==t.reading||card.explain[i]!==t.explain)errors.push(`${card.id}: token alignment`);
   if(t.wordId){
    const id=canonical(t.wordId),word=words.get(id);
    if(!allowed.has(id))errors.push(`${card.id}: untaught helper ${t.surface}`);
    if(!word || !((word[1]===t.surface&&word[2]===t.reading)||forms[id]?.some(([s,r])=>s===t.surface&&r===t.reading)))errors.push(`${card.id}: unreviewed lexical form ${t.surface}/${t.reading}`);
   }else if(course.functionForms[t.surface]?.[0]!==t.reading)errors.push(`${card.id}: untracked function form ${t.surface}`);
  }
 }
 targets.forEach(id=>known.add(id));
}
if(JSON.stringify([...known].sort())!==JSON.stringify([...course.foundationIds].sort()))errors.push('Starter targets and course foundations disagree');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Foundations: ${starters.length} lessons, ${known.size} words; aligned forms, prior knowledge and distinct practice verified.`);
