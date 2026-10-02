import fs from 'node:fs';
const path='data/jp/curriculum/starter_lessons.json',data=JSON.parse(fs.readFileSync(path,'utf8'));
const tokens=new Map(data.lessons.flatMap(l=>l.cards.flatMap(c=>c.tokens)).map(t=>[t.surface,t]));
tokens.set('本',tokens.get('ほん'));
tokens.set('椅子',tokens.get('いす'));
tokens.set('の',{surface:'の',reading:'の',explain:'links an owner to a thing; my, your, or someone’s'});
tokens.set('も',{surface:'も',reading:'も',explain:'also; too'});
const groups=[
 {key:'possession',examples:[['これ は 私 の 本 です','This is my book.'],['これ は あなた の 本 です','This is your book.'],['これ は あなた の 車 です','This is your car.'],['これ は 私 の 車 です','This is my car.'],['これ は 私 の 椅子 です','This is my chair.'],['これ は あなた の 椅子 です','This is your chair.']]},
 {key:'also',examples:[['私 も 学生 です','I am a student too.'],['あなた も 学生 です','You are a student too.'],['友達 も 学生 です','My friend is a student too.'],['友達 も 先生 です','My friend is a teacher too.'],['あなた も 先生 です','You are a teacher too.'],['私 も 先生 です','I am a teacher too.']]},
 {key:'possession-also',examples:[['私 の 本 も 新しい です','My book is new too.'],['私 の 車 も 新しい です','My car is new too.'],['私 の 椅子 も 新しい です','My chair is new too.']]},
];
const id='starter-belongings-also',cards=[];
for(const group of groups)for(const [line,english] of group.examples){const ts=line.split(' ').map(surface=>{if(!tokens.has(surface))throw new Error(surface);return structuredClone(tokens.get(surface));});cards.push({id:`${id}-v1-${String(cards.length+1).padStart(2,'0')}`,line:ts.map(t=>t.surface),tts:ts.map(t=>t.reading),explain:ts.map(t=>t.explain),tokens:ts,english,constructionKey:`${id}-${group.key}`,grammarTags:group.key==='possession'?['の','は','です']:group.key==='also'?['も','です']:['の','も','です']});}
const lesson={id,version:1,title:'Starter 5 · Possession and “also”: の・も',description:'Link an owner to a thing with の, and add another matching person or thing with も.',targets:[],helpers:[...new Set(cards.flatMap(c=>c.tokens.flatMap(t=>t.wordId?[t.wordId]:[])))],notes:[
 {start:1,title:'Whose is it?',pattern:'私の本 / あなたの本',explanation:'Put の between the owner and the thing: 私の本 is my book; あなたの本 is your book. Keep this phrase together in the familiar これは…です sentence.'},
 {start:7,title:'Say “also”',pattern:'私も学生です',explanation:'Use も when the same description applies to another person. Put it directly after the person you are talking about, in place of は.'},
 {start:13,title:'も after an ownership phrase',pattern:'私の本も新しいです',explanation:'Keep the owner and the thing together as one phrase. Put も after that whole phrase when the same description applies to it too.'},
],cards};
data.lessons=data.lessons.filter(l=>l.id!==id);data.lessons.push(lesson);fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
const p='data/jp/curriculum/curated/grammar-instruction.json',plan=JSON.parse(fs.readFileSync(p,'utf8'));
plan.foundations[id]=[{start:1,teaches:['nounLink'],evidence:lesson.notes[0].explanation},{start:7,teaches:['also'],evidence:lesson.notes[1].explanation}];
for(const [key,entries] of Object.entries(plan.lessons)){plan.lessons[key]=entries.map(entry=>({...entry,teaches:entry.teaches.filter(rule=>!['nounLink','also'].includes(rule))})).filter(entry=>entry.teaches.length);if(!plan.lessons[key].length)delete plan.lessons[key];}
fs.writeFileSync(p,JSON.stringify(plan,null,2)+'\n');
