import fs from 'node:fs';
import {grammarFormErrors} from './lib/curated-grammar.mjs';
import {lexicalVariantErrors} from './lib/curated-lexical-variants.mjs';
const dir = 'data/jp/curriculum/curated';
const levels = ['A1','A2','B1','B2','C1','C2'];
const courses = fs.readdirSync(dir).filter(name=>/^(a[12]|b[12]|c[12])\.json$/.test(name)).map(name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8')));
const independentLevels=new Set(courses.filter(c=>c.progression==='independent-tracks').flatMap(c=>c.topics.map(t=>t.level)));
const course = { foundationIds: courses.find(c=>c.topics.some(t=>t.level==='A1')).foundationIds, topics:courses.flatMap(c=>c.topics), lessons:courses.flatMap(c=>c.lessons), functionForms:Object.assign({},...courses.map(c=>c.functionForms)) };
const pools = JSON.parse(fs.readFileSync('data/jp/dictionary/study-pools.json', 'utf8'));
const words = new Map(JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8')).map(r=>[r[0],{id:r[0],surface:r[1],reading:r[2],level:r[8]}]));
const reviewedForms = JSON.parse(fs.readFileSync('data/jp/curriculum/curated/reviewed-forms.json','utf8')).forms;
const errors = [], ids = new Set(), owner = new Map(course.foundationIds.map(id => [id,'foundations']));
const lexicalVariants = JSON.parse(fs.readFileSync(`${dir}/lexical-variant-instruction.json`, 'utf8')).variants;
errors.push(...lexicalVariantErrors(course, lexicalVariants, new Set(words.keys()), reviewedForms));
const cardSources=new Map();
const norm = s => s.normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu,'');
const fail = (id, message) => errors.push(`${id}: ${message}`);
let known = new Set(course.foundationIds);
for (const topic of course.topics) {
  if(independentLevels.has(topic.level))known=new Set(course.foundationIds);
  for(const level of levels.slice(0,levels.indexOf(topic.level)))for(const id of pools.pools[level])known.add(id);
  const owned = [];
  for (const id of topic.lessonIds) {
    const lesson = course.lessons.find(l => l.id === id);
    if (!lesson || lesson.topicId !== topic.id) { fail(id,'missing lesson / wrong topic'); continue; }
    if (ids.has(id)) fail(id,'duplicate lesson'); ids.add(id);
    if(lesson.kind==='review'&&lesson.targets.length)fail(id,'review introduces new targets');
    if(lesson.kind==='review'&&(lesson.cards.length<4||lesson.cards.length>12))fail(id,'recall checkpoint must contain 4–12 cards');
    if (lesson.notes.some(n => !n.pattern || !n.explanation || n.start < 1 || n.start > lesson.cards.length)) fail(id,'invalid grammar instruction');
    for (const target of lesson.targets) {
      if (!words.has(target)) fail(id,`unknown target ${target}`);
      if (!pools.pools[topic.level]?.includes(target)) fail(id,`target belongs to a different level: ${target}`);
      if (owner.has(target)) fail(id,`target already owned by ${owner.get(target)}: ${target}`);
      owner.set(target,topic.id); known.add(target); owned.push(target);
      if (lesson.cards.filter(c => c.tokens.some(t => t.wordId === target)).length < 2) fail(id,`target needs at least two contextual appearances: ${words.get(target)?.surface}`);
    }
    const seen = new Set(), helpers = new Set();
    const reviewSources=new Set();
    for (const card of lesson.cards) {
      for(const error of grammarFormErrors(card))fail(card.id,error);
      const source=cardSources.get(card.id);
      if(lesson.kind==='review') {
        if(!source||source.topicId!==topic.id||source.serialized!==JSON.stringify(card))fail(id,`review must reuse an earlier exact card in this topic: ${card.id}`);
        else reviewSources.add(source.lessonId);
      } else {
        if(ids.has(card.id))fail(id,`duplicate original card ID ${card.id}`);
        cardSources.set(card.id,{topicId:topic.id,lessonId:id,serialized:JSON.stringify(card)});
      }
      ids.add(card.id);
      if ((card.tokens.length < 2 && card.kind !== 'social-expression') || !card.english) fail(card.id,'empty or isolated word card');
      if (/\b(?:the|a|an) (?:a|an|the)\b/i.test(card.english)) fail(card.id,`broken English article: ${card.english}`);
      const identity = norm(card.tts.join(''));
      if (seen.has(identity)) fail(card.id,'duplicate sentence'); seen.add(identity);
      for (const [i,t] of card.tokens.entries()) {
        if (!t.surface || !t.reading || !t.explain || card.line[i] !== t.surface || card.tts[i] !== t.reading || card.explain[i] !== t.explain) fail(card.id,'unaligned token');
        if (t.wordId) {
          if (!known.has(t.wordId)) fail(card.id,`unlearned helper: ${words.get(t.wordId)?.surface ?? t.wordId}`);
          if (!lesson.targets.includes(t.wordId)) helpers.add(t.wordId);
          if (t.dictionaryEntryId !== t.wordId) fail(card.id,'dictionary identity mismatch');
          const word = words.get(t.wordId);
          if (word && (t.surface !== word.surface || t.reading !== word.reading) && !reviewedForms[t.wordId]?.some(([surface,reading])=>surface===t.surface && reading===t.reading)) fail(card.id,`unreviewed lexical form: ${t.surface} / ${t.reading} for ${word.surface}`);
        } else if (course.functionForms[t.surface]?.[0] !== t.reading) fail(card.id,`untracked form ${t.surface}`);
      }
    }
    if (JSON.stringify([...helpers].sort()) !== JSON.stringify([...lesson.helpers].sort())) fail(id,'incorrect helper manifest');
    if(lesson.kind==='review'&&JSON.stringify([...reviewSources])!==JSON.stringify(lesson.reviewOf))fail(id,'incorrect review-source manifest');
  }
  if (JSON.stringify(owned) !== JSON.stringify(topic.wordIds)) fail(topic.id,'ownership and lesson targets disagree');
}
for (const lesson of course.lessons) if (!ids.has(lesson.id)) fail(lesson.id,'orphan lesson');
const order = JSON.parse(fs.readFileSync(`${dir}/course-order.json`, 'utf8'));
if(JSON.stringify(course.topics.map(t=>t.id))!==JSON.stringify(Object.values(order.levels).flat()))fail('course','chapter order disagrees with the authored course sequence');
const catalog = JSON.parse(fs.readFileSync('data/jp/curriculum/curated/catalog.json','utf8'));
if(JSON.stringify(catalog.independentLevels)!==JSON.stringify([...independentLevels]))fail('catalog','independent level metadata is stale');
for (const topic of course.topics) {
  const bundle = JSON.parse(fs.readFileSync(`data/jp/curriculum/curated/topics/${topic.id}.json`,'utf8'));
  const expected = course.lessons.filter(l=>l.topicId===topic.id);
  if(JSON.stringify(bundle.lessons)!==JSON.stringify(expected)) fail(topic.id,'stale topic bundle');
  for(const {cards,helpers,notes,...lesson} of expected) if(JSON.stringify(catalog.lessons.find(l=>l.id===lesson.id))!==JSON.stringify({...lesson,pattern:notes[0]?.pattern??'',cardIds:cards.map(c=>c.id)})) fail(lesson.id,'stale catalog metadata');
}
const completeArg=process.argv.find(arg=>arg.startsWith('--complete='));
const requireComplete=process.argv.includes('--complete') ? levels : completeArg ? completeArg.split('=')[1].split(',') : [];
for(const level of requireComplete) if(!levels.includes(level)) fail(level,'unknown requested complete level');
const coverage=levels.map(level=>{
 const missing=pools.pools[level].filter(id=>!owner.has(id));
 if(requireComplete.includes(level)&&missing.length)fail(level,`${missing.length} words lack authored lessons`);
 return `${level}: ${pools.pools[level].length-missing.length}/${pools.pools[level].length}`;
});
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`Validated ${course.topics.length} topics / ${course.lessons.length} lessons. ${coverage.join('; ')}.`);
