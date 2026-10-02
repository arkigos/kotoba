import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const out = path.resolve('docs/reviews/2026-09-20-adaptive');
await fs.mkdir(out, { recursive: true });
const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: { ignored: ['**/public/dictionary/**', '**/docs/reviews/**'] } }, appType: 'custom' });
const oldFetch = globalThis.fetch;
globalThis.fetch = async url => ({ ok: true, json: async () => JSON.parse(await fs.readFile(path.join('public', String(url)), 'utf8')) });
try {
  const { readState, touchWordHistory } = await server.ssrLoadModule('/apps/learner-next/src/state.ts');
  const { buildCustomLesson } = await server.ssrLoadModule('/apps/learner-next/src/custom-lesson.ts');
  const { buildGrammarLesson } = await server.ssrLoadModule('/apps/learner-next/src/grammar-lesson.ts');
  const { buildTopicLesson } = await server.ssrLoadModule('/apps/learner-next/src/topic-course.ts');
  const { assertLessonVocabulary } = await server.ssrLoadModule('/apps/learner-next/src/lesson-vocabulary.ts');
  const { recordGrammarPractice } = await server.ssrLoadModule('/apps/learner-next/src/grammar-progress.ts');
  const at = new Date(Date.now() - 8 * 86400000).toISOString();
  const make = known => {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: known, kind: 'reading', at });
    for (const word of Object.values(state.wordHistory)) word.review = { occasions: 1, lastPracticedAt: at, lastOccasionAt: at, lastPracticeSequence: 1 };
    state.practiceSessionCount = 4;
    return state;
  };
  const report = async (name, session, state) => {
    assertLessonVocabulary(session.savedCards, session.targetWordIds, state);
    for (const id of session.targetWordIds) {
      const actual = session.savedCards.filter(card => card.tokens.some(token => token.wordId === id)).length;
      assert.equal(actual, session.lessonPlan.appearances[id], `${name}: stale appearance count for ${id}`);
      assert.ok(actual >= 6, `${name}: insufficient practice for ${id}`);
      if (!session.grammarLessonId) assert.ok(actual <= 12, `${name}: excessive target exposure for ${id}`);
    }
    const counts = Object.fromEntries(['want-object','want-action','can-action'].map(id => [id,session.savedCards.filter(card=>card.practiceGrammar?.includes(id)).length]));
    const record = { name, cards:session.items.length, targets:session.targetWordIds, new:session.lessonPlan.newWordIds, review:session.lessonPlan.reviewWordIds, grammar:counts,
      standalone:session.savedCards.filter(card=>card.tokens.length===1).length };
    await fs.writeFile(path.join(out, `${name}.json`),JSON.stringify({record,session},null,2));
    await fs.writeFile(path.join(out, `${name}.md`),`# ${name}\n\n${JSON.stringify(record,null,2)}\n\n`+session.savedCards.map((card,i)=>`${i+1}. ${card.line.join('')} — ${card.english}`).join('\n')+'\n');
    console.log(JSON.stringify(record));
  };
  let grammarState = make([]);
  for (const id of ['want-object','want-action','can-action']) {
    const lesson = buildGrammarLesson(grammarState,id);
    await report(`grammar-${id}`,lesson,grammarState);
    grammarState.activeSession = lesson;
    for(let position=0;position<lesson.items.length;position++) {
      const previous = {...grammarState,activeSession:{...grammarState.activeSession,cursor:position}};
      const next = {...previous,activeSession:{...previous.activeSession,cursor:position+1,practicedIndices:[...previous.activeSession.practicedIndices,position]}};
      grammarState=recordGrammarPractice(previous,next,lesson.savedCards[position],position,at);
    }
  }
  const fixtures=[
    {name:'mixed-reading',targets:['manga','shinbun','kanji','kaku'],known:['watashi','yomu','hon','nihongo','eigo','hiragana']},
    {name:'mixed-meals',targets:['karee','raamen','ocha','resutoran'],known:['watashi','taberu','nomu','mizu','pan','koohii','hoshii']},
    {name:'mixed-outings',targets:['eki','kouen','resutoran','iku'],known:['watashi','gakkou','ie','mise','taberu','pan']},
    {name:'mixed-clothes',targets:['shatsu','jaketto','ookii','chiisai'],known:['watashi','kiru','kutsu','kutsushita','hoshii','kaimasu']},
  ];
  for(const fixture of fixtures) {
    const state=make(fixture.known);
    state.grammarHistory=structuredClone(grammarState.grammarHistory);
    const {session}=await buildCustomLesson(state,fixture.targets,{includeReview:true,title:fixture.name});
    await report(fixture.name,session,state);
  }
  const topicState=make(['taberu','nomu','mizu','pan','koohii','hoshii','yomu','hon','nihongo','eigo','kaku','kanji','watashi']);
  topicState.grammarHistory=structuredClone(grammarState.grammarHistory);
  for(const id of ['food','school']) {
    const {session}=await buildTopicLesson(topicState,id,false,{wordCount:8});
    await report(`automatic-${id}`,session,topicState);
  }
  const recent=make(['watashi','taberu','nomu','mizu','pan','koohii','hoshii']);
  recent.grammarHistory=structuredClone(grammarState.grammarHistory);
  for (const record of Object.values(recent.wordHistory)) record.review.lastPracticedAt=new Date().toISOString();
  for (const record of Object.values(recent.grammarHistory)) { record.lastPracticedAt=new Date().toISOString(); record.lastPracticeSequence=recent.practiceSessionCount; }
  for (const record of Object.values(recent.wordHistory)) record.review.lastPracticeSequence=recent.practiceSessionCount;
  const maintenance=await buildCustomLesson(recent,['karee','raamen','ocha','resutoran'],{includeReview:true});
  assert.equal(maintenance.session.lessonPlan.reviewWordIds.length,0);
  await report('mixed-recent-maintenance',maintenance.session,recent);
  const partial=make(['watashi','yomu','hon','nihongo','eigo','hiragana']);
  partial.grammarHistory={'want-action':structuredClone(grammarState.grammarHistory['want-action'])};
  const desireOnly=await buildCustomLesson(partial,['manga','shinbun','kanji','kaku'],{includeReview:true});
  assert.ok(desireOnly.session.savedCards.every(card=>!card.practiceGrammar?.includes('can-action')));
  await report('mixed-partial-grammar',desireOnly.session,partial);
} finally { globalThis.fetch=oldFetch; await server.close(); }
