import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createLevelAuthoring} from '../scripts/lib/curated-level-authoring.mjs';

describe('explicit named authoring references',()=>{
 it('rejects a reused lesson address before it can overwrite an existing lesson during ordering',()=>{
  const author=createLevelAuthoring('B1');author.topic('test','Test','Test');
  author.lesson('files','Files',['B1@ファイル'],'N','Explanation',[
   ['B1@ファイル を @保存 @する~します~します','I save the file.'],
  ]);
  const before=structuredClone(author.course);
  expect(()=>author.lesson('files','Different lesson',['B1@互い'],'N','Different explanation',[])).toThrow('Duplicate authored lesson id: B1-test-files');
  expect(author.course).toEqual(before);
 });
 it('produces identical published cards and targets to stable numeric addresses',()=>{
  const ranked=createLevelAuthoring('B1'),named=createLevelAuthoring('B1');
  for(const author of [ranked,named])author.topic('test','Test','Test');
  ranked.lesson('files','Files',[2857],'Nを保存します','Files.',[
   ['2857 を @保存 @する~します~します','I save the file.'],
  ],{2857:'computer file'});
  named.lesson('files','Files',['B1@ファイル'],'Nを保存します','Files.',[
   ['B1@ファイル を @保存 @する~します~します','I save the file.'],
  ],{'B1@ファイル':'computer file'});
  expect(named.course).toEqual(ranked.course);
  expect(named.resolve('B1@互い').id).toBe(named.resolve('747').id);
  expect(named.token('A2@開く~開きました~ひらきました')).toEqual(named.token('A2:1272~開きました~ひらきました'));
 });
 it('rejects ambiguous, missing, higher-level and misplaced target references',()=>{
  const author=createLevelAuthoring('B1');author.topic('test','Test','Test');
  expect(()=>author.resolve('A2@方')).toThrow('2 matches');
  expect(()=>author.resolve('B1@架空の単語')).toThrow('0 matches');
  expect(()=>author.resolve('B2@経験')).toThrow('higher-level');
  expect(()=>author.resolve('@互い')).toThrow('0 matches');
  for(const target of ['A2@開く','99999','252']){
   expect(()=>author.lesson('bad','Bad',[target],'N','Explanation',[])).toThrow();
  }
  expect(author.course.lessons).toEqual([]);
  expect(author.course.topics[0].wordIds).toEqual([]);
 });
});

describe('reviewed level transfers',()=>{
 it('preserves the original B2 greeting address after its elementary transfer',()=>{
  const a2=createLevelAuthoring('A2'),b2=createLevelAuthoring('B2');
  expect(a2.resolve('1282')).toMatchObject({id:'jmdict:1151120',level:'A2',surface:'挨拶'});
  expect(()=>b2.resolve('2403')).toThrow('now belongs to A2');
  expect(b2.resolve('@挨拶')).toMatchObject({id:'jmdict:1151120',level:'A2'});
 });
 it('preserves the old B1 welcome address while teaching the greeting in A2',()=>{
  const a2=createLevelAuthoring('A2'),b1=createLevelAuthoring('B1');
  expect(a2.resolve('1281')).toMatchObject({id:'jmdict:1000920',level:'A2',surface:'いらっしゃい'});
  expect(()=>b1.resolve('206')).toThrow('now belongs to A2');
  expect(b1.resolve('@いらっしゃい')).toMatchObject({id:'jmdict:1000920',level:'A2'});
 });
 it('separates the polite person from the direction/comparison reading of 方',()=>{
  const a2=createLevelAuthoring('A2'),b1=createLevelAuthoring('B1');
  expect(a2.resolve('1264')).toMatchObject({id:'jmdict:1516930',surface:'方',reading:'ほう'});
  expect(a2.resolve('1273')).toMatchObject({id:'jmdict:1516925',surface:'方',reading:'かた'});
  expect(a2.resolve('1274')).toMatchObject({id:'jmdict:1406050',surface:'それでは',reading:'それでは'});
  expect(()=>b1.resolve('@方')).toThrow('2 matches');
  expect(b1.resolve('A2:1264').reading).toBe('ほう');
  expect(b1.resolve('A2:1273').reading).toBe('かた');
 });
 it('requires an explicit opening-verb identity once both readings are learned',()=>{
  const author=createLevelAuthoring('B1');
  expect(()=>author.resolve('@開く')).toThrow('2 matches');
  expect(author.resolve('A1:578')).toMatchObject({id:'jmdict:1586270',reading:'あく'});
  expect(author.resolve('A2:1272')).toMatchObject({id:'jmdict:1202440',reading:'ひらく'});
  const forms=JSON.parse(readFileSync('data/jp/curriculum/curated/reviewed-forms.json','utf8')).forms;
  expect(forms['jmdict:1586270']).not.toContainEqual(['開きました','ひらきました']);
  expect(forms['jmdict:1202440']).toContainEqual(['開きました','ひらきました']);
  const course=JSON.parse(readFileSync('data/jp/curriculum/curated/b1.json','utf8'));
  for(const id of ['B1-reading-finding','B1-reading-account']){
   const lesson=course.lessons.find(l=>l.id===id);
   expect(lesson.version).toBe(3);
   const tokens=lesson.cards.flatMap(c=>c.tokens).filter(t=>t.reading==='ひらきました');
   expect(tokens).toHaveLength(1);
   expect(tokens[0]).toMatchObject({wordId:'jmdict:1202440',dictionaryEntryId:'jmdict:1202440'});
  }
 });
 it('keeps the appended A1 day and zero identities available as lower-level helpers',()=>{
  const author=createLevelAuthoring('A2');
  expect(author.resolve('A1:751').surface).toBe('弾く');
  expect(author.resolve('A1:752')).toMatchObject({id:'jmdict:1576260',surface:'一日',reading:'いちにち',level:'A1'});
  expect(author.resolve('A1:753')).toMatchObject({id:'jmdict:2839962',surface:'ゼロ',reading:'ゼロ',level:'A1'});
  expect(author.resolve('@一日').id).not.toBe(author.resolve('@１日').id);
 });
 it('appends the missing basic readings without reusing existing A2 addresses',()=>{
  const a2=createLevelAuthoring('A2'),b1=createLevelAuthoring('B1');
  expect(a2.resolve('1267').surface).toBe('キロメートル');
  expect(a2.resolve('1268')).toMatchObject({id:'jmdict:1387210',surface:'先',reading:'さき',level:'A2'});
  expect(a2.resolve('1269')).toMatchObject({id:'jmdict:1382440',surface:'石',reading:'いし',level:'A2'});
  expect(b1.resolve('@先').id).toBe(a2.resolve('1268').id);
  expect(b1.resolve('@石').id).toBe(a2.resolve('1269').id);
 });
 it('reserves the retired standalone car address and resolves musical play from A1',()=>{
  const author=createLevelAuthoring('B1');
  expect(()=>author.resolve('252')).toThrow('now belongs to reference');
  expect(author.resolve('@弾く')).toMatchObject({id:'jmdict:1419370',surface:'弾く',reading:'ひく',level:'A1'});
  expect(author.resolve('@引く').id).not.toBe(author.resolve('@弾く').id);
 });
 it('keeps the old C1 distance address reserved while appending the A2 identity',()=>{
  const a2=createLevelAuthoring('A2'),c1=createLevelAuthoring('C1');
  expect(a2.resolve('153').surface).toBe('メートル');
  expect(a2.resolve('1267')).toMatchObject({id:'jmdict:1042650',level:'A2',surface:'キロメートル'});
  const old=c1.words.find(w=>w.id==='jmdict:1042650');
  expect(old).toBeDefined();
  expect(()=>c1.resolve(String(old.rank))).toThrow('now belongs to A2');
  expect(c1.resolve('@キロメートル').id).toBe(old.id);
  expect(c1.words.filter(w=>w.level==='C1')).toHaveLength(6999);
 });
 it('appends promoted words without reusing old B1 source addresses',()=>{
  const author=createLevelAuthoring('B1');
  expect(author.resolve('3001').surface).toBe('ボール');
  expect(author.resolve('3004').id).toBe('jmdict:1207590');
  expect(author.resolve('3005')).toMatchObject({id:'jmdict:1165960',level:'B1',surface:'一晩'});
  expect(author.resolve('3006')).toMatchObject({id:'jmdict:1143870',level:'B1',surface:'ルームメイト'});
 });
 it('rejects retired C2 target addresses while allowing the reviewed lower-level identity',()=>{
  const author=createLevelAuthoring('C2');
  const transferred=author.words.filter(w=>['jmdict:1165960','jmdict:1143870'].includes(w.id));
  expect(transferred).toHaveLength(2);
  for(const word of transferred){
   expect(()=>author.resolve(String(word.rank))).toThrow('now belongs to B1');
   expect(author.resolve(`@${word.surface}`).id).toBe(word.id);
  }
  expect(author.words.filter(w=>w.level==='C2')).toHaveLength(7998);
 });
});

describe('authored contextual vocabulary meanings',()=>{
 it('keeps own-husband and respectful other-husband hints distinct under the shared learning identity',()=>{
  const course=JSON.parse(readFileSync('data/jp/curriculum/curated/b1.json','utf8'));
  const own=course.lessons.find(l=>l.id==='B1-relationships-spouse-words');
  const other=course.lessons.find(l=>l.id==='B1-relationships-polite-spouse');
  expect(other.targets).toEqual([]);
  for(const [lesson,surface,reading,gloss] of [
   [own,'主人','しゅじん','my husband (traditional usage here)'],
   [other,'ご主人','ごしゅじん','someone else’s husband (respectful reference)'],
  ]){
   const cards=lesson.cards.filter(c=>c.tokens.some(t=>t.wordId==='jmdict:1579780'));
   expect(cards.length).toBeGreaterThanOrEqual(2);
   for(const card of cards){
    expect(card.tokens.find(t=>t.wordId==='jmdict:1579780')).toMatchObject({dictionaryEntryId:'jmdict:1579780',surface,reading,explain:gloss});
    expect(card.explain).toEqual(card.tokens.map(t=>t.explain));
   }
  }
 });
 it('keeps dictionary identity and aligned hints while selecting a lesson sense',()=>{
  const author=createLevelAuthoring('B1');
  author.topic('test','Files','Computer files');
  const original=author.words.find(w=>w.id==='jmdict:1107800').meaning;
  author.lesson('files','Files',[2857],'Nを保存します','Use the computer-file sense.',[
   ['2857 を @保存 @する~します~します','I save the file.'],
   ['2857 の @名前 を @変える~変えます~かえます','I change the file name.'],
  ],{2857:'computer file'});
  for(const card of author.course.lessons[0].cards){
   expect(card.tokens[0]).toMatchObject({wordId:'jmdict:1107800',dictionaryEntryId:'jmdict:1107800',surface:'ファイル',reading:'ファイル',explain:'computer file'});
   expect(card.explain).toEqual(card.tokens.map(t=>t.explain));
  }
  expect(author.words.find(w=>w.id==='jmdict:1107800').meaning).toBe(original);
 });
 it('rejects a contextual gloss that cannot resolve to a dictionary identity',()=>{
  const author=createLevelAuthoring('B1');author.topic('test','Test','Test');
  expect(()=>author.lesson('bad','Bad',[2857],'N','Explanation',[],{'invented-word':'file'})).toThrow('Invalid contextual gloss');
  expect(author.course.lessons).toHaveLength(0);
 });
});

describe('reviewed planning vocabulary placement',()=>{
 it('reserves the old B2 address and appends the A2 planning identity',()=>{
  const a2=createLevelAuthoring('A2'),b2=createLevelAuthoring('B2');
  expect(a2.resolve('1283')).toMatchObject({id:'jmdict:1252090',surface:'計画',level:'A2'});
  expect(()=>b2.resolve('2207')).toThrow('now belongs to A2');
  expect(b2.resolve('@計画').id).toBe(a2.resolve('1283').id);
 });
});
