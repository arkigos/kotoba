import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const run = process.argv[2] ?? 'baseline';
if (!/^[a-z0-9-]+$/.test(run)) throw new Error('Use a simple run name.');
const output = path.resolve('docs/reviews/2026-09-20-ten-lessons', run);
await fs.mkdir(output, { recursive: true });
const server = await createServer({ configFile: false, server: { middlewareMode: true, watch: { ignored: ['**/docs/reviews/**', '**/public/dictionary/**', '**/dist/**'] } }, appType: 'custom' });
const RealDate = Date, originalFetch = globalThis.fetch;
const DAY = 86400000, base = RealDate.parse('2026-08-03T18:00:00Z');
let now = base;
globalThis.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } };
globalThis.fetch = async url => ({ ok: true, json: async () => JSON.parse(await fs.readFile(path.join('public', String(url)), 'utf8')) });
const schedule = [
  { day: 0, topic: 'food' }, { day: 1, topic: 'school' },
  { day: 3, topic: 'food' }, { day: 6, topic: 'school' },
  { day: 9, topic: 'shopping' }, { day: 12, topic: 'food' },
  { day: 16, topic: 'school' }, { day: 19, topic: 'shopping' },
  { day: 24, topic: 'food' }, { day: 28, topic: 'school' },
];
try {
  const { readState, touchWordHistory } = await server.ssrLoadModule('/apps/learner-next/src/state.ts');
  const { buildTopicLesson } = await server.ssrLoadModule('/apps/learner-next/src/topic-course.ts');
  const { nextTopicLesson } = await server.ssrLoadModule('/apps/learner-next/src/next-topic-lesson.ts');
  const { recordWordPractice, suggestReviewWords, reviewStatus } = await server.ssrLoadModule('/apps/learner-next/src/review.ts');
  const { recordCardExposures } = await server.ssrLoadModule('/apps/learner-next/src/word-exposure.ts');
  const { recordGrammarPractice } = await server.ssrLoadModule('/apps/learner-next/src/grammar-progress.ts');
  const { saveLessonSession, trackSessionChange, recordDailyPractice, isSessionComplete } = await server.ssrLoadModule('/apps/learner-next/src/session-history.ts');
  const { encodeStoredState, decodeStoredState } = await server.ssrLoadModule('/apps/learner-next/src/storage-codec.ts');
  const { assertLessonVocabulary, practicedLessonWords, lessonConceptId } = await server.ssrLoadModule('/apps/learner-next/src/lesson-vocabulary.ts');
  const { assertLessonCardQuality } = await server.ssrLoadModule('/apps/learner-next/src/lesson-card-quality.ts');
  const { practicedReviewCards } = await server.ssrLoadModule('/apps/learner-next/src/sentence-review.ts');
  const { dictionaryWord } = await server.ssrLoadModule('/packages/dictionary/index.ts');
  const { a1Topics } = await server.ssrLoadModule('/packages/dictionary/a1.ts');
  let state = readState();
  const lessons = [], firstLessons = {}, allExposures = [];
  const topicPrevious = new Map();
  const round = n => Math.round(n * 100) / 100;
  for (let index = 0; index < schedule.length; index++) {
    const step = schedule[index], number = index + 1;
    now = base + step.day * DAY;
    const start = now, before = structuredClone(state), known = practicedLessonWords(state);
    const topic = a1Topics.find(row => row.id === step.topic);
    assert.ok(topic, `Unknown topic ${step.topic}: ${a1Topics.map(x=>x.id)}`);
    const queue = suggestReviewWords(state, 0, now);
    const previousTopic = topicPrevious.get(step.topic);
    const session = previousTopic ? await nextTopicLesson(state, previousTopic)
      : (await buildTopicLesson(state, step.topic, false, { wordCount: 6 })).session;
    if (!previousTopic) session.title = topic.title;
    if (previousTopic) {
      assert.equal(session.topicSeries.number, (previousTopic.topicSeries?.number ?? 1) + 1);
      assert.ok(session.lessonPlan.newWordIds.every(id => !known.has(lessonConceptId(id))), 'Continuation requires genuinely new targets');
    }
    assert.deepEqual(state, before, 'Generation cannot change learning');
    assertLessonVocabulary(session.savedCards, session.targetWordIds, state);
    assertLessonCardQuality(session.savedCards);
    assert.ok(session.items.length <= 48);
    assert.ok(session.lessonPlan.sections.lesson <= 24 && session.lessonPlan.sections.dueReview <= 16 && session.lessonPlan.sections.recentReview <= 8);
    const bank = practicedReviewCards(state);
    session.items.forEach((item,index) => {
      if (item.section !== 'lesson') assert.ok(bank.some(row => JSON.stringify(row.card) === JSON.stringify(session.savedCards[index])), 'Review sentence must be copied unchanged from actual practice');
    });
    const rows = new Map(), mixes = { newOnly: 0, mixed: 0, reviewOnly: 0 };
    const lexical = { new: 0, older: 0, recent: 0 }, roleCounts = { newTarget: 0, reviewTarget: 0, helper: 0 };
    const reviewTargets = new Set(session.lessonPlan.reviewWordIds.map(lessonConceptId));
    const newTargets = new Set(session.lessonPlan.newWordIds.map(lessonConceptId));
    const histories = new Map(Object.values(before.wordHistory).map(row => [lessonConceptId(row.wordId), row]));
    let adjacentDuplicates = 0;
    const identityCounts = new Map();
    const cards = session.savedCards.map((card, i) => {
      const ids = [...new Set(card.tokens.flatMap(token => token.wordId ? [lessonConceptId(token.wordId)] : []))];
      const fresh = ids.filter(id => !known.has(id));
      assert.ok(fresh.every(id => newTargets.has(id)), 'Unknown helpers forbidden');
      const familiar = ids.filter(id => known.has(id));
      const kind = fresh.length ? familiar.length ? 'mixed' : 'newOnly' : 'reviewOnly';
      mixes[kind]++;
      const identity = JSON.stringify([card.line, card.english]);
      identityCounts.set(identity, (identityCounts.get(identity) ?? 0) + 1);
      if (i && identity === JSON.stringify([session.savedCards[i-1].line, session.savedCards[i-1].english])) adjacentDuplicates++;
      for (const id of ids) {
        const history = histories.get(id), status = history ? reviewStatus(history, before, start) : undefined;
        const age = status ? (start - status.practicedAt) / DAY : undefined;
        const group = !known.has(id) ? 'new' : age >= 7 ? 'older' : 'recent';
        const role = newTargets.has(id) ? 'newTarget' : reviewTargets.has(id) ? 'reviewTarget' : 'helper';
        lexical[group]++; roleCounts[role]++;
        if (!rows.has(id)) {
          const word = dictionaryWord(id);
          rows.set(id, { id, japanese: word?.surface ?? id, english: word?.meaning ?? id, group, role,
            due: status?.due ?? false, daysSincePractice: age === undefined ? null : round(age),
            firstLesson: firstLessons[id] ?? number, appearances: 0, positions: [], contexts: new Set() });
        }
        const row = rows.get(id); row.appearances++; row.positions.push(i+1); row.contexts.add(identity);
      }
      return { number: i+1, japanese: card.line.join(''), english: card.english, kind, section: session.items[i].section, source: session.items[i].reviewSource, new: fresh, known: familiar, standalone: card.tokens.length === 1 };
    });
    const words = [...rows.values()].map(row => ({ ...row, contexts: row.contexts.size, percentCards: round(row.appearances / cards.length * 100) }));
    const saved = saveLessonSession(state, session);
    assert.deepEqual(saved.wordHistory, before.wordHistory, 'Saving cannot refresh timers');
    state = { ...saved, activeSession: session };
    const lastUse = {};
    for (let i = 0; i < session.items.length; i++) {
      now = start + (i+1) * 18000;
      const at = new Date().toISOString(), previous = state, card = session.savedCards[i];
      const ids = [...new Set(card.tokens.flatMap(token => token.wordId ? [token.wordId] : []))];
      for (const id of ids) { lastUse[id] = at; firstLessons[lessonConceptId(id)] ??= number; }
      let next = { ...state, wordHistory: touchWordHistory(state, { wordIds: ids, kind: 'reading', at }),
        activeSession: { ...state.activeSession, cursor: i+1, scores: [...state.activeSession.scores, true], practicedIndices: [...state.activeSession.practicedIndices, i] } };
      next = recordWordPractice(next, ids, at);
      next = recordCardExposures(previous, next, ids, i);
      next = recordGrammarPractice(previous, next, card, i, at);
      next = recordDailyPractice(previous, next, ids, at);
      state = trackSessionChange(previous, next, at);
    }
    assert.ok(isSessionComplete(state.activeSession));
    for (const [id, at] of Object.entries(lastUse)) assert.equal(state.wordHistory[id].review.lastPracticedAt, at);
    const untouched = Object.keys(before.wordHistory).filter(id => !(id in lastUse));
    untouched.forEach(id => assert.deepEqual(state.wordHistory[id], before.wordHistory[id]));
    assert.ok([...known].every(id => practicedLessonWords(state).has(id)), 'Previous words remain eligible');
    const decoded = decodeStoredState(JSON.parse(JSON.stringify(encodeStoredState(state))));
    assert.deepEqual(decoded.errors, []);
    assert.deepEqual(decoded.value.wordHistory, state.wordHistory);
    assert.deepEqual(decoded.value.lessonHistory, state.lessonHistory);
    assert.deepEqual(decoded.value.reviewCards, state.reviewCards);
    state = decoded.value;
    topicPrevious.set(step.topic, state.activeSession);
    const dueBefore = queue.filter(row => row.due && known.has(lessonConceptId(row.wordId))).map(row => lessonConceptId(row.wordId));
    const deferredDue = [...new Set(dueBefore)].filter(id => !rows.has(id));
    const dueAfter = [...new Set(suggestReviewWords(state,0,now).filter(row=>row.due).map(row=>lessonConceptId(row.wordId)))];
    const result = { number, day: step.day, date: new Date(start).toISOString(), title: session.title, topic: topic.title, engine: session.lessonPlan.engineVersion,
      newTargets: [...newTargets], reviewTargets: [...reviewTargets], cards: cards.length, estimatedMinutes: round(cards.length * .3),
      cardMix: mixes, sections:session.lessonPlan.sections, lexicalAppearances: lexical, roleAppearances: roleCounts,
      newCardPercent: round((mixes.newOnly + mixes.mixed) / cards.length * 100),
      reviewOnlyPercent: round(mixes.reviewOnly / cards.length * 100),
      dueBefore: [...new Set(dueBefore)], deferredDue, dueAfter, knownAfter: new Set(Object.keys(state.wordHistory).map(lessonConceptId)).size,
      standaloneCards: cards.filter(row => row.standalone).length, adjacentDuplicates,
      maxIdenticalSentenceCopies: Math.max(...identityCounts.values()), words };
    lessons.push(result); allExposures.push(...words.map(row=>({lesson:number,day:step.day,...row})));
    const prefix = String(number).padStart(2, '0');
    await fs.writeFile(path.join(output, `${prefix}.json`), JSON.stringify({result, cards, session, before:before.wordHistory, after:state.wordHistory}, null, 2));
    await fs.writeFile(path.join(output, `${prefix}.md`), `# Lesson ${number}: ${topic.title}, day ${step.day}\n\n`+
      `New targets: ${[...newTargets].join(', ')}\nReview targets: ${[...reviewTargets].join(', ') || 'none'}\n\n`+
      '| Word | Role | Age group | Days since practice | Cards |\n|---|---|---|---:|---:|\n'+words.map(row=>`| ${row.japanese} (${row.id}) | ${row.role} | ${row.group} | ${row.daysSincePractice??'new'} | ${row.appearances} |`).join('\n')+
      '\n\n'+cards.map(card=>`${card.number}. ${card.japanese} — ${card.english} [${card.section}; ${card.kind}]`).join('\n')+'\n');
    console.log(JSON.stringify({...result,words:undefined,dueBefore:dueBefore.length,deferredDue:deferredDue.length}));
  }
  const totals = lessons.reduce((sum,row)=>{sum.cards+=row.cards;for(const group in sum.lexicalAppearances)sum.lexicalAppearances[group]+=row.lexicalAppearances[group];for(const group in sum.cardMix)sum.cardMix[group]+=row.cardMix[group];return sum;},{cards:0,lexicalAppearances:{new:0,older:0,recent:0},cardMix:{newOnly:0,mixed:0,reviewOnly:0}});
  const summary = { run, assumptions:{initialKnownWords:0,lessonCount:10,spanDays:28,secondsPerCard:18,olderThresholdDays:7,wordCount:6,mode:'automatic topic selection, reading exposure',perfectCompletion:true}, totals, lessons };
  await fs.writeFile(path.join(output,'summary.json'),JSON.stringify(summary,null,2));
  await fs.writeFile(path.join(output,'final-profile.json'),JSON.stringify(state,null,2));
  const columns=['lesson','day','id','japanese','english','group','role','due','daysSincePractice','firstLesson','appearances','percentCards','contexts'];
  const csv = value => '"'+String(value??'').replaceAll('"','""')+'"';
  await fs.writeFile(path.join(output,'word-appearances.csv'),'\uFEFF'+columns.join(',')+'\n'+allExposures.map(row=>columns.map(key=>csv(row[key])).join(',')).join('\n'));
  console.log(JSON.stringify({totals,knownWords:lessons.at(-1).knownAfter}));
} finally { globalThis.Date = RealDate; globalThis.fetch = originalFetch; await server.close(); }
