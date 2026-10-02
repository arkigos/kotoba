import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const output = path.resolve('docs/reviews/2026-09-20-recency');
await fs.mkdir(output,{recursive:true});
const server = await createServer({configFile:false,server:{middlewareMode:true,watch:{ignored:['**/docs/reviews/**','**/public/dictionary/**','**/dist/**']}},appType:'custom'});
const originalFetch=globalThis.fetch, originalNow=Date.now;
globalThis.fetch=async url=>({ok:true,json:async()=>JSON.parse(await fs.readFile(path.join('public',String(url)),'utf8'))});
let now=Date.parse('2026-09-01T12:00:00Z');
Date.now=()=>now;
try {
  const {readState,touchWordHistory}=await server.ssrLoadModule('/apps/learner-next/src/state.ts');
  const {buildCustomLesson}=await server.ssrLoadModule('/apps/learner-next/src/custom-lesson.ts');
  const {recordWordPractice,suggestReviewWords,reviewStatus}=await server.ssrLoadModule('/apps/learner-next/src/review.ts');
  const {recordCardExposures}=await server.ssrLoadModule('/apps/learner-next/src/word-exposure.ts');
  const {recordGrammarPractice}=await server.ssrLoadModule('/apps/learner-next/src/grammar-progress.ts');
  const {saveLessonSession,trackSessionChange,recordDailyPractice,isSessionComplete}=await server.ssrLoadModule('/apps/learner-next/src/session-history.ts');
  const {assertLessonVocabulary,practicedLessonWords}=await server.ssrLoadModule('/apps/learner-next/src/lesson-vocabulary.ts');
  let state=readState();
  const scenarios=[
    {name:'01-first-reading',day:0,targets:['watashi','yomu','hon','nihongo']},
    {name:'02-new-writing',day:9,targets:['kaku','eigo','kanji','shinbun'],includeReview:false},
    {name:'03-old-review',day:10,targets:['manga','hiragana','katakana','gakusei']},
    {name:'04-next-review',day:10.1,targets:['sensei','wakaru','hanasu','tomodachi']},
    {name:'05-clothes',day:10.2,targets:['shatsu','jaketto','kiru','ookii']},
    {name:'06-food',day:10.3,targets:['taberu','pan','nomu','mizu']},
    {name:'07-food-review',day:13,targets:['karee','raamen','ocha','resutoran']},
    {name:'08-fresh-food',day:13.1,targets:['niku','sakana','koohii','gyuunyuu']},
  ];
  const summary=[];
  for (const scenario of scenarios) {
    now=Date.parse('2026-09-01T12:00:00Z')+scenario.day*86400000;
    const before=structuredClone(state), beforeKnown=practicedLessonWords(state);
    const queue=suggestReviewWords(state,0,now).map(row=>({...row,lastPracticedAt:state.wordHistory[row.wordId].review?.lastPracticedAt}));
    const {session}=await buildCustomLesson(state,scenario.targets,{includeReview:scenario.includeReview!==false,title:scenario.name});
    assert.deepEqual(state,before,'Generating must not change review timers');
    assertLessonVocabulary(session.savedCards,session.targetWordIds,state);
    session.savedCards.slice(1).forEach((card,index)=>assert.notDeepEqual([card.line,card.english],[session.savedCards[index].line,session.savedCards[index].english],'Do not place identical cards next to each other'));
    const saved=saveLessonSession(state,session);
    assert.deepEqual(saved.wordHistory,state.wordHistory,'Saving must not change review timers');
    const used=[...new Set(session.savedCards.flatMap(card=>card.tokens.flatMap(token=>token.wordId?[token.wordId]:[])))];
    const helpers=used.filter(id=>!session.targetWordIds.includes(id));
    assert.ok(helpers.every(id=>beforeKnown.has(id)),'All helpers were actually practiced');
    const newCards=session.savedCards.filter(card=>card.tokens.some(token=>session.lessonPlan.newWordIds.includes(token.wordId))).length;
    const reviewOnly=session.items.length-newCards;
    assert.ok(newCards>reviewOnly,'New-word practice must dominate');
    const at=new Date(now).toISOString();
    state={...saved,activeSession:session};
    for(let index=0;index<session.items.length;index++) {
      const previous=state,card=session.savedCards[index];
      const words=card.tokens.flatMap(token=>token.wordId?[token.wordId]:[]);
      let next={...state,wordHistory:touchWordHistory(state,{wordIds:words,kind:'reading',at}),activeSession:{...state.activeSession,cursor:index+1,scores:[...state.activeSession.scores,true],practicedIndices:[...state.activeSession.practicedIndices,index]}};
      next=recordWordPractice(next,words,at);
      next=recordCardExposures(previous,next,words,index);
      next=recordGrammarPractice(previous,next,card,index,at);
      next=recordDailyPractice(previous,next,words,at);
      state=trackSessionChange(previous,next,at);
    }
    assert.ok(isSessionComplete(state.activeSession));
    const untouched=[...beforeKnown].filter(id=>!used.includes(id));
    for(const id of used) {
      assert.equal(state.wordHistory[id].review.lastPracticedAt,at,`Practice must refresh ${id}, including helpers`);
      assert.equal(reviewStatus(state.wordHistory[id],state,now).due,false);
    }
    for(const id of untouched) assert.deepEqual(state.wordHistory[id],before.wordHistory[id],`Unused ${id} must retain its timer`);
    assert.ok([...beforeKnown].every(id=>practicedLessonWords(state).has(id)),'Known words never become unavailable');
    const after=suggestReviewWords(state,0,now);
    for(const old of untouched) for(const recent of used) {
      if (Date.parse(before.wordHistory[old].review.lastPracticedAt)<now)
        assert.ok(after.findIndex(row=>row.wordId===old)<after.findIndex(row=>row.wordId===recent),`Untouched ${old} must precede just-reviewed ${recent}`);
    }
    const result={name:scenario.name,at,cards:session.items.length,new:session.lessonPlan.newWordIds,review:session.lessonPlan.reviewWordIds,helpers,newCards,reviewOnly,untouched,queueBefore:queue,queueAfter:after};
    summary.push(result);
    await fs.writeFile(path.join(output,`${scenario.name}.json`),JSON.stringify({result,session,before,after:state},null,2));
    await fs.writeFile(path.join(output,`${scenario.name}.md`),`# ${scenario.name}\n\n${JSON.stringify(result,null,2)}\n\n`+session.savedCards.map((card,i)=>`${i+1}. ${card.line.join('')} — ${card.english}`).join('\n')+'\n');
    console.log(JSON.stringify({name:result.name,cards:result.cards,new:result.new,review:result.review,helpers,newCards,reviewOnly,untouched}));
  }
  await fs.writeFile(path.join(output,'summary.json'),JSON.stringify(summary,null,2));
} finally { Date.now=originalNow; globalThis.fetch=originalFetch; await server.close(); }
