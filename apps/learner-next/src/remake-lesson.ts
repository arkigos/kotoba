import { buildCustomLesson } from "./custom-lesson";
import { buildGrammarLesson } from "./grammar-lesson";
import { buildStarterLesson } from "./starter-lessons";
import type { ActiveSession, LearnerState } from "./types";
import { buildCuratedLesson, buildCuratedReview } from "./curated-course";

/** Re-run the engine with the same explicit targets. Old snapshots are never
 * rewritten on load; remaking is an explicit user action and earns no credit. */
export async function remakeLessonSession(state: LearnerState, previous: ActiveSession): Promise<ActiveSession> {
  if (previous.curatedLessonId) return buildCuratedLesson(state, previous.curatedLessonId);
  if (previous.curatedReviewTopicId) return buildCuratedReview(state, previous.curatedReviewTopicId);
  if (!["topic", "vocabulary"].includes(previous.source ?? "") || !previous.targetWordIds?.length) throw new Error("This lesson cannot be remade from vocabulary.");
  const session = previous.starterLessonId ? buildStarterLesson(state, previous.starterLessonId) : previous.grammarLessonId ? buildGrammarLesson(state, previous.grammarLessonId, previous.targetWordIds)
    : (await buildCustomLesson(state, previous.targetWordIds, { title: previous.title })).session;
  return { ...session, title: previous.title, source: previous.source, topicId: previous.topicId, mode: previous.mode,
    lessonId: previous.lessonId ?? previous.id };
}
