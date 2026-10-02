import {beforeEach,afterEach,expect,it,vi} from "vitest";
import {readState,touchWordHistory,writeState} from "../src/state";
import {buildTopicLesson} from "../src/topic-course";
import {buildCustomLesson} from "../src/custom-lesson";
import {buildGrammarLesson} from "../src/grammar-lesson";
import {assertLessonCardQuality,sentenceIdentity} from "../src/lesson-card-quality";
import {appendSentenceReviews,practicedReviewCards} from "../src/sentence-review";
import {recordWordPractice,reviewStatus,suggestReviewWords} from "../src/review";
import {recordCardExposures} from "../src/word-exposure";
import {saveLessonSession} from "../src/session-history";
import type {LearnerState,ActiveSession} from "../src/types";
const DAY=86400000, start=Date.parse("2026-08-01T12:00:00Z");
beforeEach(()=>{localStorage.clear();vi.useFakeTimers({toFake:["Date"]});vi.setSystemTime(start);});
afterEach(()=>vi.useRealTimers());
function consume(seed:LearnerState,session:ActiveSession) {
 let state={...seed,activeSession:session} as LearnerState;
 for(let i=0;i<session.items.length;i++) {
  const before=state,ids=session.savedCards![i].tokens.flatMap(t=>t.wordId?[t.wordId]:[]),at=new Date().toISOString();
  let next={...state,wordHistory:touchWordHistory(state,{wordIds:ids,kind:"reading",at}),activeSession:{...state.activeSession!,cursor:i+1,practicedIndices:[...state.activeSession!.practicedIndices!,i]}};
  state=recordCardExposures(before,recordWordPractice(next,ids,at),ids,i);
 }
 return saveLessonSession(state,state.activeSession!);
}
it("rejects duplicates anywhere, including alternate IDs, English, punctuation and spelling",async()=>{
 const {session}=await buildTopicLesson(readState(),"food",false,{wordCount:6});
 const cards=session.savedCards!;
 expect(()=>assertLessonCardQuality(cards)).not.toThrow();
 expect(()=>assertLessonCardQuality([...cards,{...cards[0],id:"different",english:"another gloss"}])).toThrow(/Repeated/);
 const duplicate={...cards[0],line:[cards[0].line.join("")+"。"]};
 expect(()=>assertLessonCardQuality([...cards,duplicate])).toThrow(/Repeated/);
 const word={...cards[0],tokens:[cards[0].tokens[0]],line:[cards[0].tokens[0].surface]};
 expect(()=>assertLessonCardQuality([word])).toThrow(/One-word/);
});
it("shortens sparse lessons, treats requested size as a ceiling and never pads unsupported words",async()=>{
 const {session}=await buildCustomLesson(readState(),["koohii"],{cardCount:48});
 expect(session.items.length).toBeLessThan(24);expect(session.items.length).toBeGreaterThan(0);
 expect(()=>assertLessonCardQuality(session.savedCards!)).not.toThrow();
 await expect(buildCustomLesson(readState(),["fw_desu"])).rejects.toThrow(/No supported sentence/);
 await expect(buildCustomLesson(readState(),["koohii"],{cardCount:49})).rejects.toThrow(/between 1 and 48/);
 for(const id of ["want-object","want-action","can-action"] as const)expect(()=>assertLessonCardQuality(buildGrammarLesson(readState(),id).savedCards!)).not.toThrow();
});
it("copies consumed sentences unchanged, retains origin, excludes previews and keeps core selection independent",async()=>{
 let state=readState();const first=(await buildTopicLesson(state,"food",false,{wordCount:6})).session;
 const saved=saveLessonSession(state,first);expect(practicedReviewCards(saved)).toEqual([]);
 state=consume(state,first);vi.setSystemTime(start+3*DAY);
 const before=structuredClone(state),next=(await buildTopicLesson(state,"school",false,{wordCount:6})).session;
 expect(state).toEqual(before);expect(next.targetWordIds).toHaveLength(6);
 expect(next.lessonPlan!.newWordIds).toHaveLength(6);
 const review=next.items.flatMap((item,i)=>item.section!=="lesson"?[{item,card:next.savedCards![i]}]:[]);
 expect(review.length).toBeGreaterThan(0);
 for(const {item,card} of review){expect(first.savedCards).toContainEqual(card);expect(item.reviewSource?.lessonId).toBe(first.id);}
 expect(next.lessonPlan!.sections!.dueReview).toBeGreaterThan(0);
 expect(()=>assertLessonCardQuality(next.savedCards!)).not.toThrow();
 // Every core card is identical with review switched off; no review-word injection.
 const bare={...next,savedCards:next.savedCards!.slice(0,next.lessonPlan!.sections!.lesson),items:next.items.slice(0,next.lessonPlan!.sections!.lesson)};
 expect(appendSentenceReviews(state,bare,{enabled:false}).savedCards).toEqual(bare.savedCards);
});
it("provides recent review before due dates and does not count preview or revisiting a position",async()=>{
 let state=readState();const first=(await buildTopicLesson(state,"food",false,{wordCount:6})).session;
 state=consume(state,first);vi.setSystemTime(start+DAY);
 const next=(await buildTopicLesson(state,"school",false,{wordCount:6})).session;
 expect(next.lessonPlan!.sections!.recentReview).toBeGreaterThan(0);
 const before=structuredClone(state.wordHistory);saveLessonSession(state,next);expect(state.wordHistory).toEqual(before);
 const completed=consume(state,next),reviewIndex=next.items.findIndex(i=>i.section==="recent-review");
 const ids=next.savedCards![reviewIndex].tokens.flatMap(t=>t.wordId?[t.wordId]:[]);
 for(const id of ids){expect(completed.wordHistory[id].cardEncounters).toBeGreaterThan(state.wordHistory[id].cardEncounters!);expect(completed.wordHistory[id].review!.lastPracticedAt).toBe(new Date().toISOString());}
 expect(recordCardExposures(completed,completed,ids,reviewIndex)).toBe(completed);
 writeState(completed);expect(readState().reviewCards).toEqual(completed.reviewCards);
 const withoutShelf={...completed,lessonHistory:[],activeSession:undefined,clearedLessons:[]};
 expect(practicedReviewCards(withoutShelf).length).toBeGreaterThan(0);
});
it("uses exposure and spaced occasions for intervals and urgency rather than raw age",()=>{
 const seed=readState();const history=touchWordHistory(seed,{wordIds:["gohan","mizu"],kind:"reading",at:new Date(start-10*DAY).toISOString()});
 history.gohan={...history.gohan,cardEncounters:40,review:{occasions:5,lastPracticedAt:new Date(start-10*DAY).toISOString()}};
 history.mizu={...history.mizu,cardEncounters:1,review:{occasions:1,lastPracticedAt:new Date(start-3*DAY).toISOString()}};
 const state={...seed,wordHistory:history};
 expect(reviewStatus(history.gohan,state).interval).toBeGreaterThan(reviewStatus(history.mizu,state).interval);
 expect(suggestReviewWords(state,0)[0].wordId).toBe("mizu");
 const more={...history.mizu,cardEncounters:16};expect(reviewStatus(more,{...state,wordHistory:{mizu:more}}).interval).toBeGreaterThan(reviewStatus(history.mizu,state).interval);
});
it("enforces all section caps and suppresses cross-section duplicates",async()=>{
 let state=readState();const first=(await buildTopicLesson(state,"food",false,{wordCount:6})).session;
 state=consume(state,first);vi.setSystemTime(start+5*DAY);
 const lesson=(await buildTopicLesson(state,"school",false,{wordCount:6,cardCount:15})).session;
 expect(lesson.items.length).toBeLessThanOrEqual(15);
 expect(lesson.lessonPlan!.sections!.lesson).toBeLessThanOrEqual(24);
 expect(lesson.lessonPlan!.sections!.dueReview).toBeLessThanOrEqual(16);
 expect(lesson.lessonPlan!.sections!.recentReview).toBeLessThanOrEqual(8);
 const repeated=appendSentenceReviews(state,first);
 expect(new Set(repeated.savedCards!.map(sentenceIdentity)).size).toBe(repeated.items.length);
});

it("fills a saturated queue only to 24 lesson, 16 due and 8 recent cards", async () => {
 const {a1CoreWordIds}=await import("../../../packages/dictionary/a1");
 const {session}=await buildTopicLesson(readState(),"food",false,{wordCount:6});
 const ids=a1CoreWordIds.filter(id=>!session.savedCards!.some(card=>card.tokens.some(t=>t.wordId===id))).slice(0,32);
 let state=readState();
 state.wordHistory=touchWordHistory(state,{wordIds:ids,kind:"reading"});
 const card=(id:string,index:number)=>({...session.savedCards![0],id:`fixture-${index}`,line:[`fixture ${index}`,"です"],tts:[`fixture ${index}`,"です"],tokens:[{wordId:id,surface:`fixture ${index}`,reading:`fixture ${index}`,explain:id},{surface:"です",reading:"です",explain:"is"}]});
 state.reviewCards=Object.fromEntries(ids.map((id,i)=>{
  const at=new Date(start-(i<20?10:0)*DAY).toISOString();
  state.wordHistory[id]={...state.wordHistory[id],cardEncounters:1,review:{occasions:1,lastPracticedAt:at}};
  const value=card(id,i);return [sentenceIdentity(value),{card:value,sourceLessonId:"old",lastPracticedAt:at,encounters:1}];
 }));
 const core=Array.from({length:24},(_,i)=>card("koohii",i+100));
 const result=appendSentenceReviews(state,{...session,savedCards:core,items:core.map(c=>({cardId:c.id,prompt:"explore",reason:"Fixture"}))});
 expect(result.lessonPlan!.sections).toEqual({lesson:24,dueReview:16,recentReview:8,cap:48});
 expect(result.items).toHaveLength(48);
 expect(result.lessonPlan!.deferredDueWordIds).toHaveLength(4);
});
it("roundtrips the pooled review bank and reports corrupted references",async()=>{
 const {encodeStoredState,decodeStoredState}=await import("../src/storage-codec");
 const state=consume(readState(),(await buildTopicLesson(readState(),"food",false,{wordCount:6})).session);
 const encoded=encodeStoredState(state) as any;
 expect(encoded._reviewCardBank).toBeDefined();
 expect((decodeStoredState(encoded).value as LearnerState).reviewCards).toEqual(state.reviewCards);
 encoded._reviewCardBank.session._materializedRows[0][1]=999999;
 expect(decodeStoredState(encoded).errors.join(" ")).toMatch(/Review memory|Incomplete review/);
});
it("blocks invalid saved snapshots at the player boundary without altering them",async()=>{
 const {prepareSession}=await import("../src/generated");
 const {session}=await buildTopicLesson(readState(),"food",false,{wordCount:6});
 const invalid={...session,items:[...session.items,session.items[0]],savedCards:[...session.savedCards!,session.savedCards![0]]};
 const before=structuredClone(invalid);
 await expect(prepareSession(invalid,readState())).rejects.toThrow(/Repeated sentences.*Remake/);
 expect(invalid).toEqual(before);
});
it("keeps unrelated familiar food and adjectives out of new topic cores",async()=>{
 let state=readState();state.wordHistory=touchWordHistory(state,{wordIds:["mizu","gohan","misoshiru","chiisai","hayai","sensei","gakusei","kaku","yomu","eigo","nihongo"],kind:"reading"});
 const shopping=(await buildTopicLesson(state,"shopping",false,{wordIds:["hoshii","kasa","kaado"]})).session;
 expect(shopping.savedCards!.flatMap(c=>c.tokens).some(t=>["mizu","gohan","misoshiru"].includes(t.wordId??""))).toBe(false);
 const school=(await buildTopicLesson(state,"school",false,{wordIds:["kyooshi","roomaji"]})).session;
 expect(school.savedCards!.flatMap(c=>c.tokens).some(t=>["chiisai","hayai"].includes(t.wordId??""))).toBe(false);
 const {personalizedCandidates}=await import("../../../packages/learning-engine/personalized");
 const soup=personalizedCandidates(["misoshiru"],new Set(["nomu","taberu","resutoran","watashi"]));
 expect(soup.some(c=>c.tokens.some(t=>t.wordId==="nomu"))).toBe(true);
 expect(soup.some(c=>c.tokens.some(t=>t.wordId==="taberu"))).toBe(false);
});
