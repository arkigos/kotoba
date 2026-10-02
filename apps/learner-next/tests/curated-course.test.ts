import { readState, writeState } from "../src/state";
import { starterLessons, buildStarterLesson } from "../src/starter-lessons";
import { markLessonAlreadyKnown } from "../src/known-lesson";
import { buildCuratedLesson, curatedLessons, curatedTopics, curatedAvailable, curatedComplete, curatedLevelProgress, buildCuratedReview, curatedWordId, curatedCardDueAt, curatedReviewCards, loadCuratedLesson, assertCuratedVocabulary } from "../src/curated-course";
import { trackSessionChange, clearLessonShelf } from "../src/session-history";
import { rememberReviewCard } from "../src/sentence-review";
import { prepareSession } from "../src/generated";
import { canContinueTopic, nextTopicLesson } from "../src/next-topic-lesson";

beforeEach(() => localStorage.clear());
function ready() {
  let state = readState();
  for (const lesson of starterLessons) state = markLessonAlreadyKnown(state, buildStarterLesson(state, lesson.id));
  return state;
}
it("resolves historical foundation aliases to the bounded dictionary", () => {
  expect(curatedWordId("kore")).toBe("jmdict:1628530");
  expect(curatedWordId("are")).toBe("jmdict:1000580");
  expect(curatedWordId("koohii")).toBe("jmdict:1049180");
  expect(curatedWordId("kotoba:koohii")).toBe("jmdict:1049180");
  expect(curatedLevelProgress(ready(),"A1")).toMatchObject({ learned: 28, total: 753, complete: false });
});
it("opens independent A1 tracks and keeps next-lesson navigation within a track", async () => {
  let state=ready();const [first,second]=curatedTopics;
  expect(curatedAvailable(state,second.lessonIds[0])).toBe(true);
  expect(curatedAvailable(state,second.lessonIds[1])).toBe(false);
  let completed;
  for(const id of first.lessonIds){
    completed=await buildCuratedLesson(state,id);
    completed={...completed,practicedIndices:completed.items.map((_,i)=>i),cursor:completed.items.length};
    state=trackSessionChange(state,{...state,activeSession:completed});
  }
  expect(curatedAvailable(state,second.lessonIds[0])).toBe(true);
  expect(canContinueTopic(state,completed)).toBe(false);
  await expect(nextTopicLesson(state,completed!)).rejects.toThrow(/choose another topic/);
  const completions={...state.curatedProgress!.completions};delete completions[first.lessonIds[0]];
  const migrated={...state,curatedProgress:{...state.curatedProgress!,completions}};
  expect(curatedAvailable(migrated,first.lessonIds[1])).toBe(true);
  expect(curatedAvailable(migrated,second.lessonIds[0])).toBe(true);
});
it("keeps previews inert, gates topic steps, and stores completion independently of the shelf", async () => {
  const state = ready(), topic = curatedTopics[0], session = await buildCuratedLesson(state,topic.lessonIds[0]);
  expect(curatedAvailable(state,topic.lessonIds[1])).toBe(false);
  expect(curatedComplete(state,session.curatedLessonId!)).toBe(false);
  await expect(prepareSession(session,state)).resolves.toBeUndefined();
  const jumped = { ...session, cursor: session.items.length, practicedIndices:[0] };
  expect(curatedComplete(trackSessionChange(state,{ ...state,activeSession:jumped }),session.curatedLessonId!)).toBe(false);
  const completed = { ...session, practicedIndices:session.items.map((_,i)=>i) };
  const next = trackSessionChange(state,{ ...state,activeSession:completed });
  expect(curatedAvailable(next,topic.lessonIds[1])).toBe(true);
  writeState(clearLessonShelf(next));
  expect(curatedComplete(readState(),session.curatedLessonId!)).toBe(true);
});
it("walks the authored chapter order without unknown helpers and never synthesizes new cards", async () => {
  let state = ready();
  for (const topic of curatedTopics.filter(t=>t.level==="A1")) {
    for (const id of topic.lessonIds) {
      const session = await buildCuratedLesson(state,id);
      expect(session.savedCards).toEqual((await loadCuratedLesson(id)).cards);
      await expect(prepareSession(session,state)).resolves.toBeUndefined();
      state = markLessonAlreadyKnown(state,session);
      expect(curatedComplete(state,id)).toBe(true);
    }
    expect(state.curatedProgress?.cards).toEqual({});
    await expect(buildCuratedReview(state,topic.id)).rejects.toThrow(/Practice/);
  }
}, 20000);
it("reviews only consumed cards in the requested topic", async () => {
  let state = ready();
  const lesson = await loadCuratedLesson(curatedLessons[0].id), session = await buildCuratedLesson(state,lesson.id);
  state = markLessonAlreadyKnown(state,session);
  state = { ...state, activeSession:session };
  state = rememberReviewCard(state,session.savedCards![0],"2026-09-26T10:00:00Z");
  const review = await buildCuratedReview(state,lesson.topicId);
  expect(review.savedCards).toEqual([lesson.cards[0]]);
  expect(review.curatedLessonId).toBeUndefined();
  await expect(buildCuratedReview(state,"another-topic")).rejects.toThrow();
});
it("finishes A1 only after all foundations and topics, and preserves expression cards on reload", async () => {
  let state = ready();
  for (const topic of curatedTopics.filter(t=>t.level==="A1")) for (const id of topic.lessonIds) {
    expect(curatedLevelProgress(state,"A1").complete).toBe(false);
    state = markLessonAlreadyKnown(state,await buildCuratedLesson(state,id));
  }
  expect(curatedLevelProgress(state,"A1")).toMatchObject({learned:753,total:753,assigned:753,complete:true});
  expect(curatedLevelProgress(state,"A2").complete).toBe(false);
  const session = await buildCuratedLesson(state,"A1-conversation-hello");
  state = { ...state,activeSession:session };
  state = rememberReviewCard(state,session.savedCards![0],"2026-09-26T10:00:00Z");
  writeState(state);
  const restored = readState();
  expect(restored.activeSession!.savedCards![0].kind).toBe("social-expression");
  await expect(prepareSession(restored.activeSession!,restored)).resolves.toBeUndefined();
  expect((await buildCuratedReview(restored,"A1-people-communication")).savedCards).toEqual([session.savedCards![0]]);
  expect(restored.xp).toBe(0);
});

it("keeps grammar consolidation required even after all vocabulary is covered", async () => {
  let state=ready();
  for(const topic of curatedTopics.filter(t=>t.level==="A1")) for(const id of topic.lessonIds) {
    state=markLessonAlreadyKnown(state,await buildCuratedLesson(state,id));
  }
  const grammar=curatedLessons.find(lesson=>lesson.topicId.startsWith("A1-")&&!lesson.targets.length&&lesson.kind!=="review")!;
  const completions={...state.curatedProgress!.completions};delete completions[grammar.id];
  state={...state,curatedProgress:{...state.curatedProgress!,completions}};
  expect(curatedLevelProgress(state,"A1")).toMatchObject({learned:753,complete:false});
});
it("revisits exact earlier cards without creating a second SRS memory", async () => {
  let state=ready();const topic=curatedTopics[0];
  const checkpoint=curatedLessons.find(lesson=>lesson.topicId===topic.id&&lesson.kind==="review")!;
  for(const id of topic.lessonIds.slice(0,topic.lessonIds.indexOf(checkpoint.id)))state=markLessonAlreadyKnown(state,await buildCuratedLesson(state,id));
  const revisited=await loadCuratedLesson(checkpoint.id),card=revisited.cards[0];
  const origin=curatedLessons.find(lesson=>lesson.kind!=="review"&&lesson.cardIds.includes(card.id))!;
  const original=await buildCuratedLesson(state,origin.id);
  state=rememberReviewCard({...state,activeSession:original},card,"2026-09-20T12:00:00Z");
  const review=await buildCuratedLesson(state,checkpoint.id);
  expect(review.targetWordIds).toEqual([]);
  expect(review.savedCards).toEqual(revisited.cards);
  state=rememberReviewCard({...state,activeSession:review},card,"2026-09-22T12:00:00Z");
  expect(Object.keys(state.curatedProgress!.cards)).toEqual([card.id]);
  expect(state.curatedProgress!.cards[card.id]).toMatchObject({encounters:2,occasions:2});
  expect(curatedReviewCards(state,topic.id)).toEqual([card.id]);
  expect((await buildCuratedReview(state,topic.id)).savedCards).toEqual([card]);
  expect(curatedComplete(state,checkpoint.id)).toBe(false);
  const skipped={...review,practicedIndices:[0]};
  expect(curatedComplete(trackSessionChange(state,{...state,activeSession:skipped}),checkpoint.id)).toBe(false);
  const finished={...review,practicedIndices:review.items.map((_,i)=>i)};
  expect(curatedComplete(trackSessionChange(state,{...state,activeSession:finished}),checkpoint.id)).toBe(true);
});
it("spaces topic review by separate dates and ignores altered or mismatched cards", async () => {
  let state=ready(); const lesson=await loadCuratedLesson(curatedLessons[0].id),session=await buildCuratedLesson(state,lesson.id),card=lesson.cards[0];
  state={...markLessonAlreadyKnown(state,session),activeSession:session};
  state=rememberReviewCard(state,card,"2026-09-20T12:00:00Z");
  state=rememberReviewCard(state,card,"2026-09-20T13:00:00Z");
  expect(state.curatedProgress!.cards[card.id].occasions).toBe(1);
  state=rememberReviewCard(state,card,"2026-09-22T12:00:00Z");
  expect(state.curatedProgress!.cards[card.id].occasions).toBe(2);
  expect(curatedCardDueAt(state.curatedProgress!.cards[card.id])).toBe(Date.parse("2026-09-25T12:00:00Z"));
  expect(rememberReviewCard(state,{...card,english:"Changed content"},"2026-09-23T12:00:00Z")).toBe(state);
  expect(curatedReviewCards({...state,curatedProgress:{...state.curatedProgress!,cards:{[card.id]:{...state.curatedProgress!.cards[card.id],version:99}}}},lesson.topicId)).toEqual([]);
});

it("requires A1 completion before A2 and shares only completed lower-level vocabulary", async () => {
  let base=ready();
  const topics=curatedTopics.filter(t=>t.level==="A2");
  expect(topics.length).toBeGreaterThan(0);
  expect(curatedAvailable(base,topics[0].lessonIds[0])).toBe(false);
  await expect(buildCuratedLesson(base,topics[0].lessonIds[0])).rejects.toThrow();
  for(const topic of curatedTopics.filter(t=>t.level==="A1"))for(const id of topic.lessonIds)base=markLessonAlreadyKnown(base,await buildCuratedLesson(base,id));
  expect(curatedLevelProgress(base,"A1").complete).toBe(true);
  let allTopics=base;
  for(const topic of topics){
    let state=allTopics;
    for(const id of topic.lessonIds){
      const session=await buildCuratedLesson(state,id);
      await expect(prepareSession(session,state)).resolves.toBeUndefined();
      state=markLessonAlreadyKnown(state,session);
      expect(curatedLevelProgress(allTopics,"A2").complete).toBe(false);
      allTopics=markLessonAlreadyKnown(allTopics,session);
    }
    await expect(buildCuratedReview(state,topic.id)).rejects.toThrow(/Practice/);
  }
  expect(curatedLevelProgress(allTopics,"A2")).toMatchObject({learned:1267,total:1267,assigned:1267,complete:true});
  expect(curatedLevelProgress(allTopics,"B1").complete).toBe(false);
}, 20000);

it("walks every B1 track independently after completing both lower levels", async () => {
  let base=ready();
  const topics=curatedTopics.filter(t=>t.level==="B1");
  expect(topics.length).toBeGreaterThan(0);
  expect(curatedAvailable(base,topics[0].lessonIds[0])).toBe(false);
  for(const level of ["A1","A2"] as const) {
    for(const topic of curatedTopics.filter(t=>t.level===level)) for(const id of topic.lessonIds) base=markLessonAlreadyKnown(base,await buildCuratedLesson(base,id));
    expect(curatedLevelProgress(base,level).complete).toBe(true);
    if(level==="A1") expect(curatedAvailable(base,topics[0].lessonIds[0])).toBe(false);
  }
  for(const topic of topics) {
    let state=structuredClone(base);
    expect(curatedAvailable(state,topic.lessonIds[0])).toBe(true);
    expect(curatedAvailable(state,topic.lessonIds[1])).toBe(false);
    for(const id of topic.lessonIds) {
      const session=await buildCuratedLesson(state,id);
      await expect(prepareSession(session,state)).resolves.toBeUndefined();
      state=markLessonAlreadyKnown(state,session);
      if(id===topic.lessonIds[0]){
        const sibling=topics.find(t=>t.id!==topic.id)!;
        expect(()=>assertCuratedVocabulary(session.savedCards!,[],state,sibling.id)).toThrow(/unlearned/);
        const completed={...session,cursor:session.items.length,completedByDeclarationAt:'2026-10-01T12:00:00Z'};
        expect((await nextTopicLesson(state,completed)).curatedLessonId).toBe(topic.lessonIds[1]);
      }
      if(id===topic.lessonIds.at(-1)){
        const completed={...session,cursor:session.items.length,completedByDeclarationAt:'2026-10-01T12:00:00Z'};
        expect(canContinueTopic(state,completed)).toBe(false);
        await expect(nextTopicLesson(state,completed)).rejects.toThrow(/choose another topic/);
      }
    }
    await expect(buildCuratedReview(state,topic.id)).rejects.toThrow(/Practice/);
    expect(curatedLevelProgress(state,"B1").complete).toBe(false);
  }
// Every B1 track starts from A1/A2 completion with no sibling B1 history.
}, 60000);

it("ignores obsolete B1 completions and keeps unfinished coverage incomplete",()=>{
  const state=ready();
  state.curatedProgress ??= {completions:{},cards:{}};
  for(const topic of curatedTopics)for(const id of topic.lessonIds){
    const lesson=curatedLessons.find(l=>l.id===id)!;
    state.curatedProgress.completions[id]={version:lesson.version,at:'2026-10-01T12:00:00Z',method:'declared'};
  }
  expect(curatedLevelProgress(state,'B1')).toMatchObject({learned:2319,assigned:2319,total:3004,complete:false});
  const topic=curatedTopics.find(t=>t.id==='B1-daily')!,first=curatedLessons.find(l=>l.id===topic.lessonIds[0])!;
  state.curatedProgress.completions[first.id].version=first.version-1;
  expect(curatedComplete(state,first.id)).toBe(false);
  delete state.curatedProgress.completions[topic.lessonIds[1]];
  expect(curatedAvailable(state,topic.lessonIds[1])).toBe(false);
});
