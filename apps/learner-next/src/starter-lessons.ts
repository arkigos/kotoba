import content from "../../../data/jp/curriculum/starter_lessons.json";
import { assertLessonCardQuality } from "./lesson-card-quality";
import { assertLessonVocabulary, knownLessonWords, lessonConceptId } from "./lesson-vocabulary";
import { auditLessonWords } from "./lesson-word-audit";
import { measureCardTransition } from "./lesson-transitions";
import type { ActiveSession, LearnerState, PracticeCard } from "./types";

export type StarterLesson = { id: string; version: number; acceptedCompletionVersions?: number[]; title: string; description: string; targets: string[]; helpers: string[]; notes: NonNullable<ActiveSession["lessonNotes"]>; cards: PracticeCard[] };
export const starterLessons = content.lessons as StarterLesson[];
export const starterTrackId = "foundations";
export function starterComplete(state: LearnerState, id: string) {
  const lesson = starterLessons.find(row => row.id === id);
  const version = state.starterCompletions?.[id]?.version;
  return !!lesson && version !== undefined && (version === lesson.version || !!lesson.acceptedCompletionVersions?.includes(version));
}
export function starterNotes(lesson: StarterLesson, state: LearnerState) {
  // The old first starter did not teach questions. Preserve that instruction
  // when a returning learner continues into the revised second starter.
  if (lesson.id === "starter-questions" && state.starterCompletions?.["starter-identity"]?.version === 1) {
    return [...lesson.notes, { start: 10, title: "Questions with か", pattern: "あれ は 車 です か", explanation: "Put か after です to ask a question." }];
  }
  return lesson.notes;
}
export const startersComplete = (state: LearnerState) => starterLessons.every(lesson => starterComplete(state, lesson.id));
export const nextStarter = (state: LearnerState) => starterLessons.find(lesson => !starterComplete(state, lesson.id));
export function starterAvailable(state: LearnerState, id: string) {
  const index = starterLessons.findIndex(lesson => lesson.id === id);
  return index >= 0 && starterLessons.slice(0, index).every(lesson => starterComplete(state, lesson.id));
}

/** Frozen authored content: no candidate generation, shuffling or appended review. */
export function buildStarterLesson(state: LearnerState, id: string): ActiveSession {
  const lesson = starterLessons.find(row => row.id === id);
  if (!lesson || !starterAvailable(state, id)) throw new Error("Complete the preceding starter lesson or mark it as already known first.");
  const cards = structuredClone(lesson.cards);
  assertLessonCardQuality(cards);
  assertLessonVocabulary(cards, lesson.targets, state);
  const known = knownLessonWords(state);
  const session: ActiveSession = { id: `starter-${crypto.randomUUID()}`, starterLessonId: id, starterVersion: lesson.version,
    source: "vocabulary", title: lesson.title, length: "standard", startedAt: new Date().toISOString(), cursor: 0, scores: [], practicedIndices: [],
    mode: state.settings.lessonMode, targetWordIds: [...lesson.targets], savedCards: cards, lessonNotes: structuredClone(starterNotes(lesson, state)),
    items: cards.map(card => ({ cardId: card.id, prompt: "explore", reason: "Curated starter drill", section: "lesson" })) };
  const counts = Object.fromEntries(auditLessonWords(cards, session).filter(row => lesson.targets.includes(row.id)).map(row => [row.id, row.positions.length]));
  const steps = cards.map((card, index) => index ? measureCardTransition(cards[index - 1], card) : { kind: "start" as const, lexicalChanges: 0, grammarChanged: false, basis: "tokens" as const });
  session.lessonPlan = { version: 1, engineVersion: `curated-starters-${lesson.version}`, cardCount: cards.length, appearances: counts,
    helperWordIds: [...lesson.helpers], newWordIds: lesson.targets.filter(word => !known.has(lessonConceptId(word))), reviewWordIds: lesson.targets.filter(word => known.has(lessonConceptId(word))),
    sections: { lesson: cards.length, dueReview: 0, recentReview: 0, cap: cards.length }, transitions: steps,
    pacing: { appearanceGoal: (Object.keys(counts).length ? Math.min(...Object.values(counts)) : 0), minimumAppearances: (Object.keys(counts).length ? Math.min(...Object.values(counts)) : 0), targetDensity: Object.values(counts).reduce((sum, value) => sum + value, 0) / cards.length,
      baselineCards: cards.length, singleChanges: steps.filter(step => step.kind === "neighbor" && step.lexicalChanges === 1).length, doubleChanges: steps.filter(step => step.kind === "neighbor" && step.lexicalChanges === 2).length, boundaries: steps.filter(step => step.kind === "boundary").length, repeats: 0 } };
  return session;
}
