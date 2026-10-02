import { buildTopicLesson, coreWordProgress, extraTopicWordIds } from "./topic-course";
import { a1CoreWordIdsForTopic } from "../../../packages/dictionary/a1";
import { isSessionComplete, lessonId, recentLessons } from "./session-history";
import type { ActiveSession, LearnerState } from "./types";
import { buildCuratedLesson, nextCuratedLesson, curatedAvailable, curatedTopics, independentCuratedLevel } from "./curated-course";

const nextInSequence = (state: LearnerState, session: ActiveSession) => nextCuratedLesson(state, independentCuratedLevel(curatedTopics.find(t=>t.id===session.topicId)?.level) ? session.topicId : undefined);

function usesExtras(session: ActiveSession) {
  const core = new Set(a1CoreWordIdsForTopic(session.topicId!));
  return !!session.targetWordIds?.some(id => !core.has(id));
}

export function canContinueTopic(state: LearnerState, session?: ActiveSession) {
  if (session?.curatedReviewTopicId) return false;
  if (session?.curatedLessonId) {
    const next = nextInSequence(state, session);
    return isSessionComplete(session) && !!next && next.id !== session.curatedLessonId && curatedAvailable(state, next.id);
  }
  if (!session?.topicId || session.source !== "topic" || !isSessionComplete(session)) return false;
  const pool = usesExtras(session) ? extraTopicWordIds(session.topicId) : a1CoreWordIdsForTopic(session.topicId);
  return pool.some(id => !coreWordProgress(state, id).introduced);
}

/** Start a new lesson in the same topic using current practice history. Replay
 * and Remake keep their existing meaning and never silently advance a series. */
export async function nextTopicLesson(state: LearnerState, previous: ActiveSession) {
  if (!canContinueTopic(state, previous)) throw new Error("Complete this lesson first, or choose another topic if all its words have been introduced.");
  if (previous.curatedLessonId) return buildCuratedLesson(state, nextInSequence(state, previous)!.id);
  const rootId = previous.topicSeries?.rootId ?? lessonId(previous);
  const baseTitle = previous.topicSeries?.baseTitle ?? previous.title ?? "Topic lesson";
  const family = [...recentLessons(state), ...(state.clearedLessons ?? [])].map(row => row.session);
  const number = Math.max(previous.topicSeries?.number ?? 1, ...family.filter(session => session.topicSeries?.rootId === rootId).map(session => session.topicSeries!.number)) + 1;
  const { session } = await buildTopicLesson(state, previous.topicId!, usesExtras(previous), { wordCount: previous.targetWordIds?.length ?? 12 });
  if (!session.lessonPlan?.newWordIds.length) throw new Error("All words in this topic have been introduced. Choose another topic or replay for review.");
  return { ...session, title: `${baseTitle} ${number}`, topicSeries: { rootId, baseTitle, number } };
}
