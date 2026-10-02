import {expect,it} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,relative,isAbsolute} from 'node:path';
import {spawnSync} from 'node:child_process';

it('replans word exposure while preserving authored checkpoints and unrelated tracks',()=>{
 const root=mkdtempSync(join(tmpdir(),'kotoba-revisit-planner-'));
 try {
  const folder=join(root,'data/jp/curriculum/curated');mkdirSync(folder,{recursive:true});
  const card=(id,wordId)=>({id,tts:[id],tokens:[{wordId}]});
  const cards=[card('a1','a'),card('a2','a'),card('b1','b'),card('b2','b')];
  const cardIds=cards.map(c=>c.id);
  const lessons=['one','two','three','four'].map((name,i)=>({id:`T-${name}`,topicId:'T',targets:i?[]:['a','b'],cards:i?[]:cards}));
  const source={topics:[{id:'T',title:'Test track',wordIds:['a','b'],lessonIds:lessons.map(l=>l.id)}],lessons};
  const authored=['T-grammar-recall-1','T-variant-recall-1','T-authored-consolidation'].map((id,i)=>({id,title:id,afterLessonId:'T-four',cardIds:[...cardIds].reverse(),version:i+6}));
  const unrelated=[{id:'U-revisit-01',afterLessonId:'U-one',cardIds:['u1'],version:3}];
  const previous={version:1,policy:{},topics:{T:[
   {id:'T-revisit-01',title:'Old review',afterLessonId:'T-one',cardIds,version:3},
   ...authored,
  ],U:unrelated}};
  const planPath=join(folder,'topic-revisits.json');
  writeFileSync(planPath,JSON.stringify(previous));writeFileSync(join(root,'draft.json'),JSON.stringify(source));
  const script=resolve('scripts/plan-curated-revisits.mjs');
  const run=()=>{
   const result=spawnSync(process.execPath,[script,'--source=draft.json','--topics=T'],{cwd:root,encoding:'utf8',timeout:10000,windowsHide:true});
   expect(result.status,result.stderr).toBe(0);
   return JSON.parse(readFileSync(planPath,'utf8'));
  };
  const next=run();
  expect(next.topics.T.slice(2)).toEqual(authored);
  expect(next.topics.U).toEqual(unrelated);
  expect(next.topics.T.slice(0,2)).toEqual([
   {id:'T-revisit-01',title:'Review 1 · Test track',afterLessonId:'T-three',cardIds,version:4},
   {id:'T-revisit-02',title:'Review 2 · Test track',afterLessonId:'T-four',cardIds,version:1},
  ]);
  expect(run()).toEqual(next);
 } finally {
  const withinTemp=relative(resolve(tmpdir()),resolve(root));
  if(!withinTemp||withinTemp.startsWith('..')||isAbsolute(withinTemp))throw new Error('Unsafe temporary cleanup path');
  rmSync(root,{recursive:true,force:true});
 }
});
