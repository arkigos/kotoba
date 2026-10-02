import fs from 'node:fs';
import { token, word, aliases } from './lib/curated-course-authoring.mjs';
const path='data/jp/curriculum/starter_lessons.json';
const data=JSON.parse(fs.readFileSync(path,'utf8'));
data.lessons=data.lessons.slice(0,5);
const legacy=new Map(data.lessons.flatMap(l=>l.cards.flatMap(c=>c.tokens.filter(t=>t.wordId).map(t=>[aliases[t.dictionaryEntryId]??t.dictionaryEntryId,t.wordId]))));
function add(id,title,description,targets,notes,rows){
 const cards=rows.map(([jp,english],i)=>{
  const tokens=jp.split(' ').map(token).map(t=>t.wordId?{...t,wordId:legacy.get(t.wordId)??t.wordId}:t);
  const block=notes.findLast(n=>n.start<=i+1);
  return {id:`${id}-v1-${String(i+1).padStart(3,'0')}`,tokens,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),english,constructionKey:`${id}-${block.start}`,grammarTags:[block.pattern]};
 });
 const ids=targets.map(n=>word(n).id);
 data.lessons.push({id,version:1,title,description,targets:ids,helpers:[...new Set(cards.flatMap(c=>c.tokens.flatMap(t=>t.wordId&&!ids.includes(t.wordId)?[t.wordId]:[])))],notes,cards});
}
add('starter-actions','Starter 6 · Actions and objects','Read, write, and study. Use を with the thing you act on.',[2,42,43,171,45],[
 {start:1,title:'The object of an action',pattern:'本 を 読みます',explanation:'を (pronounced o) marks the object of an action. Put it after the thing being acted on and before the verb.',teaches:['object']},
 {start:13,title:'An activity and its verb',pattern:'勉強 します',explanation:'勉強 (benkyō) means “studying.” します (shimasu) means “do.” Together, they describe doing that activity: studying.',teaches:['suru']},
 ],[
 ['32 を 42~読みます~よみます','I read a book.'],['71 は 32 を 42~読みます~よみます','My friend reads a book.'],['4 は 32 を 42~読みます~よみます','The teacher reads a book.'],
 ['1 は 2 を 43~書きます~かきます','I write my name.'],['4 は 2 を 43~書きます~かきます','The teacher writes a name.'],['71 は 2 を 43~書きます~かきます','My friend writes a name.'],
 ['295 は 32 を 42~読みます~よみます か','Do you read books?'],['295 は 2 を 43~書きます~かきます か','Will you write your name?'],['4 は 2 を 43~書きます~かきます か','Will the teacher write a name?'],
 ['1 は 2 を 43~書きません~かきません','I will not write my name.'],['71 は 2 を 43~書きません~かきません','My friend will not write a name.'],['71 は 32 を 42~読みません~よみません','My friend does not read books.'],
 ['1 は 171 45~します~します','I study.'],['71 は 171 45~します~します','My friend studies.'],['5 は 171 45~します~します','The student studies.'],
 ['1 は 171 を 45~します~します','I do some studying.'],['71 も 171 を 45~します~します','My friend studies too.'],['4 も 171 を 45~します~します','The teacher studies too.'],
 ['171 を 45~します~します か','Will you study?'],['71 も 171 45~します~します か','Will your friend study too?'],['4 も 171 45~します~します か','Will the teacher study too?'],
 ['1 は 171 45~しません~しません','I will not study.'],['71 は 171 45~しません~しません','My friend will not study.'],['4 は 171 45~しません~しません','The teacher will not study.'],
 ]);
add('starter-places','Starter 7 · Where and with whom','Locate people and things, say where an action happens, and include a companion.',[51,55,507],[
 {start:1,title:'Where someone or something is',pattern:'学校 に 先生 が います',explanation:'Start with the place, followed by に (ni), then say who or what is there with が (ga) and います or あります.',teaches:['ni']},
 {start:7,title:'Where you do something',pattern:'家 で 本 を 読みます',explanation:'Use で for the place where you read, write, or study.',teaches:['de']},
 {start:13,title:'Doing something with someone',pattern:'友達 と 勉強 します',explanation:'と after a person means with that person. Between two nouns, it joins them: 私と友達.',teaches:['to']},
 {start:19,title:'Ask for an impression',pattern:'学校 は どう です か',explanation:'どうですか asks how something is or what someone thinks of it.'},
 ],[
 ['55 に 4 が 50~います~います','There is a teacher at school.'],['55 に 5 が 50~います~います','There is a student at school.'],['51 に 71 が 50~います~います','My friend is at home.'],
 ['51 に 32 が 49~あります~あります','There is a book at home.'],['55 に 53 が 49~あります~あります','There is a chair at school.'],['51 に 53 が 49~あります~あります','There is a chair at home.'],
 ['51 で 32 を 42~読みます~よみます','I read a book at home.'],['55 で 32 を 42~読みます~よみます','I read a book at school.'],['55 で 2 を 43~書きます~かきます','I write my name at school.'],
 ['51 で 171 45~します~します','I study at home.'],['55 で 171 45~します~します','I study at school.'],['55 で 171 45~します~します か','Will you study at school?'],
 ['71 と 171 45~します~します','I study with my friend.'],['4 と 171 45~します~します','I study with the teacher.'],['71 と 32 を 42~読みます~よみます','I read a book with my friend.'],
 ['1 と 71 は 5 です','My friend and I are students.'],['4 と 71 は 55 に 50~います~います','The teacher and my friend are at school.'],['55 で 71 と 171 45~します~します','I study with my friend at school.'],
 ['55 は 507 です か','How is school?'],['171 は 507 です か','How is your studying going?'],['295 の 55 は 507 です か','What is your school like?'],
 ['4 の 32 は 507 です か','What do you think of the teacher’s book?'],['23 は 507 です か','What do you think of this?'],['71 の 51 は 507 です か','What is your friend’s home like?'],
 ]);
add('starter-time-forms','Starter 8 · Now and before','Change familiar statements into negatives and talk about completed actions.',[10,11],[
 {start:1,title:'Answer yes or no',pattern:'いいえ、私 は 先生 ではありません',explanation:'はい means yes; いいえ means no. After a noun, use ではありません for am not, is not, or are not. は in this ending is pronounced wa.',teaches:['copulaNegative']},
 {start:7,title:'A role in the past',pattern:'私 は 学生 でした',explanation:'Use でした after a noun to describe the past. Its negative is ではありませんでした.',teaches:['copulaPast','copulaPastNegative']},
 {start:13,title:'A completed action',pattern:'本 を 読みました',explanation:'Change ます to ました for a completed action. Change ません to ませんでした for an action you did not do.',teaches:['past']},
 ],[
 ['11 、 1 は 4 ではありません','No, I am not a teacher.'],['11 、 71 は 4 ではありません','No, my friend is not a teacher.'],['11 、 71 は 5 ではありません','No, my friend is not a student.'],
 ['23 は 1 の 32 ではありません','This is not my book.'],['24 は 1 の 53 ではありません','That is not my chair.'],['25 は 1 の 136 ではありません','That over there is not my car.'],
 ['10 、 1 は 5 でした','Yes, I was a student.'],['10 、 71 は 5 でした','Yes, my friend was a student.'],['10 、 71 は 299 でした','Yes, my friend was a company employee.'],
 ['1 は 4 ではありませんでした','I was not a teacher.'],['71 は 4 ではありませんでした','My friend was not a teacher.'],['71 は 299 ではありませんでした','My friend was not a company employee.'],
 ['32 を 42~読みました~よみました','I read a book. (Past.)'],['51 で 32 を 42~読みました~よみました','I read a book at home. (Past.)'],['55 で 32 を 42~読みました~よみました','I read a book at school. (Past.)'],
 ['51 で 171 45~しました~しました','I studied at home.'],['55 で 171 45~しました~しました','I studied at school.'],['71 と 171 45~しました~しました','I studied with my friend.'],
 ['32 を 42~読みませんでした~よみませんでした','I did not read the book.'],['51 で 171 45~しませんでした~しませんでした','I did not study at home.'],['55 で 171 45~しませんでした~しませんでした','I did not study at school.'],
 ['32 を 42~読みました~よみました か','Did you read the book?'],['55 で 171 45~しました~しました か','Did you study at school?'],['71 と 171 45~しました~しました か','Did you study with your friend?'],
 ]);
// A brief reminder does not change the card's authored grammar block.
data.lessons.find(lesson=>lesson.id==='starter-actions').notes.splice(1,0,{"start": 10, "title": "A negative verb ending", "pattern": "ます → ません", "explanation": "The ending ません (masen) makes the verb negative. Here, 書きません (kakimasen) means “do not write” or “will not write.”"});
data.lessons.find(lesson=>lesson.id==='starter-actions').notes.push({"start": 16, "title": "The same activity with を", "pattern": "勉強 を します", "explanation": "You can also say 勉強をします (benkyō o shimasu). Here, を marks studying as the activity you do. Both forms mean “study.”"});
// Clarify the location pattern without changing the authored card blocks.
const places=data.lessons.find(lesson=>lesson.id==='starter-places');
places.notes.push({"start": 17, "title": "Say where someone is", "pattern": "先生 と 友達 は 学校 に います", "explanation": "When you are talking about particular people, put them before は (wa), then give their location with に (ni). This answers “Where are they?” The earlier place-first pattern tells you who is there."});
places.notes.sort((a,b)=>a.start-b.start);
fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
const gp='data/jp/curriculum/curated/grammar-instruction.json';const g=JSON.parse(fs.readFileSync(gp,'utf8'));
for(const l of data.lessons.slice(5))g.foundations[l.id]=l.notes.filter(n=>n.teaches).map(n=>({start:n.start,teaches:n.teaches,evidence:n.explanation}));
fs.writeFileSync(gp,JSON.stringify(g,null,2)+'\n');
console.log('Eight starters, '+data.lessons.reduce((n,l)=>n+l.cards.length,0)+' cards.');
