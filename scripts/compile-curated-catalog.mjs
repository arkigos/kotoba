import fs from 'node:fs';
const dir='data/jp/curriculum/curated';
const files=fs.readdirSync(dir).filter(name=>/^(a[12]|b[12]|c[12])\.json$/.test(name));
const courses=files.map(file=>JSON.parse(fs.readFileSync(`${dir}/${file}`,'utf8')));
const a1=courses.find(course=>course.topics.some(topic=>topic.level==='A1'));
fs.mkdirSync(`${dir}/topics`,{recursive:true});
const topics=courses.flatMap(course=>course.topics),lessons=courses.flatMap(course=>course.lessons);
// This directory contains compiler outputs only. Retired bundles must not stay
// available to the app's lazy-import glob after a curriculum regrouping.
const currentBundles=new Set(topics.map(topic=>`${topic.id}.json`));
for(const name of fs.readdirSync(`${dir}/topics`))if(/^[ABC][12]-[\w-]+\.json$/.test(name)&&!currentBundles.has(name))fs.unlinkSync(`${dir}/topics/${name}`);
const functionForms=Object.assign({},...courses.map(course=>course.functionForms));
// These local identities belong to authored grammar forms, never lexical words.
// Runtime lookup prefers historical bindings when they exist.
const audioFunctionForms=Object.fromEntries(Object.entries(functionForms)
 .filter(([surface])=>!/^\s*[\p{P}\s]+$/u.test(surface))
 .map(([surface,[reading]])=>[surface,{entryId:`kotoba:curated-form:${surface}`,reading}]));
fs.writeFileSync('data/jp/dictionary/audio_function_forms.json',JSON.stringify({version:1,forms:audioFunctionForms},null,2)+'\n');
for(const topic of topics)fs.writeFileSync(`${dir}/topics/${topic.id}.json`,JSON.stringify({lessons:lessons.filter(lesson=>lesson.topicId===topic.id)})+'\n');
const metadata=lessons.map(({cards,helpers,notes,...lesson})=>({...lesson,pattern:notes[0]?.pattern??'',cardIds:cards.map(card=>card.id)}));
fs.writeFileSync(`${dir}/catalog.json`,JSON.stringify({version:3,progression:"independent-tracks-within-reviewed-levels",independentLevels:[...new Set(courses.filter(course=>course.progression==='independent-tracks').flatMap(course=>course.topics.map(topic=>topic.level)))],foundationIds:a1.foundationIds,functionForms:Object.assign({},...courses.map(course=>course.functionForms)),topics,lessons:metadata},null,2)+'\n');
console.log(`Built lightweight catalog and ${topics.length} topic bundles.`);
