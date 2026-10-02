import { rememberCuratedCard } from "./curated-course";
import { assertLessonCardQuality, isContextCard, sentenceIdentity, uniqueContextCards } from "./lesson-card-quality";
import { lessonConceptId, knownLessonWords, unknownLessonWords } from "./lesson-vocabulary";
import { reviewStatus } from "./review";
import { TOTAL_CARD_LIMIT } from "./topic-sequence";
import type { ActiveSession, LearnerState, PracticeCard, ReviewCardMemory, SessionItem } from "./types";

export const DUE_CARD_LIMIT = 16;
export const RECENT_CARD_LIMIT = 8;
const words = (card: PracticeCard) => [...new Set(card.tokens.flatMap(token => token.wordId ? [lessonConceptId(token.wordId)] : []))];

/** Migration requires consumed positions; saving a preview never earns review. */
export function practicedReviewCards(state: LearnerState): ReviewCardMemory[] {
  const bank = new Map(Object.entries(state.reviewCards ?? {}));
  const sessions = [...(state.clearedLessons ?? []).map(row=>row.session), ...(state.lessonHistory ?? []).map(row=>row.session), ...(state.activeSession?[state.activeSession]:[])];
  for (const session of sessions) for (const index of session.practicedIndices ?? []) {
    const card = session.savedCards?.[index];
    if (!card || !isContextCard(card)) continue;
    const key = sentenceIdentity(card);
    if (!bank.has(key)) bank.set(key,{card,sourceLessonId:session.lessonId??session.id,sourceTitle:session.title,lastPracticedAt:session.startedAt,encounters:1});
  }
  const known = knownLessonWords(state);
  return uniqueContextCards([...bank.values()].filter(row => !unknownLessonWords(row.card,new Set(),known).length));
}

export function rememberReviewCard(state: LearnerState, card: PracticeCard, at: string): LearnerState {
  if (!state.activeSession) return state;
  if (state.activeSession.curatedLessonId || state.activeSession.curatedReviewTopicId) {
    return rememberCuratedCard(state, card, at);
  }
  if (!isContextCard(card)) return state;
  const key = sentenceIdentity(card), previous = state.reviewCards?.[key];
  const source = state.activeSession.items.find(item=>item.cardId===card.id)?.reviewSource;
  const memory: ReviewCardMemory = { card: structuredClone(card), sourceLessonId:previous?.sourceLessonId ?? source?.lessonId ?? state.activeSession.lessonId ?? state.activeSession.id,
    sourceTitle:previous?.sourceTitle ?? source?.title ?? state.activeSession.title,lastPracticedAt:at,encounters:(previous?.encounters??0)+1 };
  return {...state,reviewCards:{...state.reviewCards,[key]:memory}};
}

/** Whole review sentences stay separate from the lesson's topic content. */
export function appendSentenceReviews(state: LearnerState, session: ActiveSession, options: { enabled?: boolean; cardLimit?: number } = {}): ActiveSession {
  const core = session.savedCards ?? [];
  assertLessonCardQuality(core);
  const totalLimit = Math.min(TOTAL_CARD_LIMIT, options.cardLimit ?? TOTAL_CARD_LIMIT);
  if (core.length > totalLimit) throw new Error("The lesson exceeds its hard card limit.");
  const known = knownLessonWords(state), now = Date.now();
  const histories = new Map<string, typeof state.wordHistory[string]>();
  for (const row of Object.values(state.wordHistory)) if (known.has(lessonConceptId(row.wordId))) histories.set(lessonConceptId(row.wordId),row);
  const statuses = new Map([...histories].map(([id,row])=>[id,reviewStatus(row,state,now)]));
  const eligible = options.enabled === false ? [] : uniqueContextCards([...core.map(card=>({card})),...practicedReviewCards(state)]).slice(core.length) as ReviewCardMemory[];
  const covered = new Set(core.flatMap(words));
  const additions: {memory:ReviewCardMemory;kind:"due-review"|"recent-review"}[] = [];
  const take = (kind:"due-review"|"recent-review",limit:number) => {
    for(let i=0;i<limit && core.length+additions.length<totalLimit;i++) {
      const scored = eligible.map(memory => {
        const focus = words(memory.card).filter(id=>!covered.has(id) && statuses.has(id) && (kind==="due-review" ? statuses.get(id)!.due : !statuses.get(id)!.due));
        const score = focus.reduce((sum,id)=>sum + (kind==="due-review" ? 1 + statuses.get(id)!.overdue : 1/(1+statuses.get(id)!.occasions) + statuses.get(id)!.overdue),0);
        return {memory,focus,score};
      }).filter(row=>row.focus.length).sort((a,b)=>b.score-a.score || a.memory.lastPracticedAt.localeCompare(b.memory.lastPracticedAt) || sentenceIdentity(a.memory.card).localeCompare(sentenceIdentity(b.memory.card)));
      const winner=scored[0]; if(!winner) break;
      eligible.splice(eligible.indexOf(winner.memory),1);
      words(winner.memory.card).forEach(id=>covered.add(id));
      additions.push({memory:winner.memory,kind});
    }
  };
  take("due-review",DUE_CARD_LIMIT); take("recent-review",RECENT_CARD_LIMIT);
  const cards=[...core,...additions.map(row=>structuredClone(row.memory.card))];
  assertLessonCardQuality(cards);
  const items:SessionItem[]=[...session.items.map(item=>({...item,section:"lesson" as const})),...additions.map(({memory,kind})=>({cardId:memory.card.id,prompt:"explore" as const,reason:kind==="due-review"?"Scheduled review":"Recent practice",section:kind,reviewSource:{lessonId:memory.sourceLessonId,title:memory.sourceTitle}}))];
  const reviewWordIds=[...new Set(additions.flatMap(row=>words(row.memory.card)))];
  const targets=session.targetWordIds??[];
  const appearances=Object.fromEntries(targets.map(id=>[id,cards.filter(card=>card.tokens.some(token=>token.wordId===id || (token.wordId && lessonConceptId(token.wordId)===lessonConceptId(id) && targets.filter(other=>lessonConceptId(other)===lessonConceptId(id)).length===1))).length]));
  return {...session,savedCards:cards,items,lessonPlan:session.lessonPlan?{...session.lessonPlan,cardCount:cards.length,reviewWordIds,appearances,
    sections:{lesson:core.length,dueReview:additions.filter(row=>row.kind==="due-review").length,recentReview:additions.filter(row=>row.kind==="recent-review").length,cap:totalLimit},
    deferredDueWordIds:[...statuses].filter(([id,status])=>status.due&&!covered.has(id)).map(([id])=>id)}:undefined};
}
