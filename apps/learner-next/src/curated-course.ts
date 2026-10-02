import data from "../../../data/jp/curriculum/curated/catalog.json";
import pools from "../../../data/jp/dictionary/study-pools.json";
import { studyEntryIdForWord } from "../../../packages/dictionary";
import { starterComplete, starterLessons, startersComplete } from "./starter-lessons";
import type { ActiveSession, LearnerState, PracticeCard } from "./types";

export type CuratedLevel = keyof typeof pools.pools;
export type CuratedTopic = { id: string; level: CuratedLevel; title: string; description: string; wordIds: string[]; lessonIds: string[] };
type CuratedLessonIdentity = { id: string; topicId: string; version: number; title: string; targets: string[]; kind?: "review"; reviewOf?: string[] };
export type CuratedLesson = CuratedLessonIdentity & { pattern: string; cardIds: string[] };
export const curatedTopics = data.topics as CuratedTopic[];
export const curatedDictionaryTopics = [{ id: "A1-foundations", title: "Foundations", level: "A1", wordIds: data.foundationIds }, ...curatedTopics];
export const curatedOwnedWordIds = new Set(curatedDictionaryTopics.flatMap(t => t.wordIds));
export const curatedLessons = data.lessons as CuratedLesson[];
export const curatedLevels = Object.keys(pools.pools) as CuratedLevel[];
export const independentCuratedLevel = (level?: string) => !!level && (data.independentLevels as string[]).includes(level);
export const curatedWordId = studyEntryIdForWord;
const lessonPosition = new Map(curatedLessons.map((lesson,index) => [lesson.id,index]));
const lessonsById = new Map(curatedLessons.map(lesson => [lesson.id,lesson]));
const topicsById = new Map(curatedTopics.map(topic => [topic.id,topic]));
const lessonsByTopic = new Map(curatedTopics.map(topic => [topic.id,topic.lessonIds.map(id=>lessonsById.get(id)!)]));
const lessonsByLevel = new Map(curatedLevels.map(level => [level,curatedLessons.filter(lesson=>topicsById.get(lesson.topicId)?.level===level)]));
// A fixed checkpoint reuses the original card ID and its single memory record.
const lessonsByCard = new Map(curatedLessons.filter(lesson=>lesson.kind!=="review").flatMap(lesson=>lesson.cardIds.map(id=>[id,lesson] as const)));
export const curatedLesson = (id: string) => lessonsById.get(id);
export type LoadedCuratedLesson = CuratedLessonIdentity & { helpers: string[]; notes: NonNullable<ActiveSession["lessonNotes"]>; cards: PracticeCard[] };
const topicModules = import.meta.glob<{ default: { lessons: LoadedCuratedLesson[] } }>("../../../data/jp/curriculum/curated/topics/*.json");
const loadedLessons = new Map<string, LoadedCuratedLesson>();
const pendingTopics = new Map<string, Promise<LoadedCuratedLesson[]>>();
export async function loadCuratedTopic(topicId: string): Promise<LoadedCuratedLesson[]> {
  let pending = pendingTopics.get(topicId);
  if (!pending) {
    const loader = topicModules[`../../../data/jp/curriculum/curated/topics/${topicId}.json`];
    if (!loader) throw new Error("This topic has not been authored yet.");
    pending = loader().then(module => {
      for (const lesson of module.default.lessons) loadedLessons.set(lesson.id, lesson);
      return module.default.lessons;
    }).catch(error => { pendingTopics.delete(topicId); throw error; });
    pendingTopics.set(topicId, pending);
  }
  return pending;
}
export async function loadCuratedLesson(id: string): Promise<LoadedCuratedLesson> {
  const lesson = curatedLesson(id);
  if (!lesson) throw new Error("This lesson has not been authored yet.");
  await loadCuratedTopic(lesson.topicId);
  return loadedLessons.get(id)!;
}
export function curatedComplete(state: LearnerState, id: string) {
  const lesson = curatedLesson(id);
  return !!lesson && state.curatedProgress?.completions?.[id]?.version === lesson.version;
}
export function curatedLevelProgress(state: LearnerState, level: CuratedLevel) {
  const owned = new Set(curatedTopics.filter(t => t.level === level).flatMap(t => t.wordIds));
  const lessons = lessonsByLevel.get(level) ?? [];
  const learned = new Set(lessons.filter(l => curatedComplete(state, l.id)).flatMap(l => l.targets));
  if (level === "A1") {
    data.foundationIds.forEach(id => owned.add(id));
    for (const lesson of starterLessons) if (starterComplete(state, lesson.id)) lesson.targets.forEach(id => learned.add(curatedWordId(id)));
  }
  const ids: string[] = pools.pools[level];
  const count = ids.filter(id => learned.has(id)).length;
  return { learned: count, total: ids.length, assigned: ids.filter(id => owned.has(id)).length, percent: Math.floor(100 * count / ids.length), complete: (level !== "A1" || startersComplete(state)) && ids.every(id => owned.has(id) && learned.has(id)) && lessons.every(l => curatedComplete(state,l.id)) };
}
export function curatedAvailable(state: LearnerState, id: string): boolean {
  const lesson = curatedLesson(id), topic = lesson && topicsById.get(lesson.topicId);
  if (!lesson || !topic) return false;
  if (curatedComplete(state,id)) return true; // Preserve replay of previously completed lessons.
  if (!startersComplete(state)) return false;
  if (!curatedLevels.slice(0, curatedLevels.indexOf(topic.level)).every(level => curatedLevelProgress(state, level).complete)) return false;
  const sequence = independentCuratedLevel(topic.level) ? lessonsByTopic.get(topic.id)! : curatedLessons;
  return sequence.slice(0, sequence.findIndex(prior=>prior.id===id)).every(prior => curatedComplete(state, prior.id));
}
export const nextCuratedLesson = (state: LearnerState, topicId?: string) => {
  const activeTopic=state.activeSession?.topicId;
  const preferred=topicId??(activeTopic&&independentCuratedLevel(topicsById.get(activeTopic)?.level)?activeTopic:undefined);
  const next=preferred ? (lessonsByTopic.get(preferred)??[]).find(lesson=>!curatedComplete(state,lesson.id)) : undefined;
  return next??(topicId?undefined:curatedLessons.find(lesson=>!curatedComplete(state,lesson.id)));
};
export const curatedPrerequisite = (id: string) => {
  const lesson = lessonsById.get(id), topic = lesson && topicsById.get(lesson.topicId);
  const sequence = topic && independentCuratedLevel(topic.level) ? lessonsByTopic.get(topic.id)! : curatedLessons;
  return sequence[sequence.findIndex(prior=>prior.id===id)-1];
};

/** Runtime checks remain strict even though authoring validates the whole course. */
export function assertCuratedVocabulary(cards: PracticeCard[], targets: string[], state: LearnerState, topicId?: string) {
  const known = new Set(targets.map(curatedWordId));
  const level = topicId ? topicsById.get(topicId)?.level : undefined;
  const independent = independentCuratedLevel(level);
  const lowerLevels = level ? curatedLevels.slice(0,curatedLevels.indexOf(level)) : [];
  if (!independent) for (const history of Object.values(state.wordHistory)) if (history.declaredKnownAt || history.review?.occasions || history.interactionKinds.some(k => ["reading", "listening", "recall", "arrange"].includes(k))) known.add(curatedWordId(history.wordId));
  for(const [id,completion] of Object.entries(state.curatedProgress?.completions??{})) {
    const lesson=lessonsById.get(id);
    if(lesson?.version===completion.version && (!independent || lesson.topicId===topicId || lowerLevels.includes(topicsById.get(lesson.topicId)!.level)))lesson.targets.forEach(wordId=>known.add(wordId));
  }
  for (const lesson of starterLessons) if (starterComplete(state, lesson.id)) lesson.targets.forEach(id => known.add(curatedWordId(id)));
  // A completed lower level's targets are already present through its durable
  // lesson completions. Recomputing all six level totals here adds no knowledge.
  const forms = data.functionForms as Record<string, string[]>;
  for (const card of cards) for (const token of card.tokens) {
    if (token.wordId ? !known.has(curatedWordId(token.wordId)) : forms[token.surface]?.[0] !== token.reading) throw new Error(`This lesson requires an unlearned word: ${token.surface}. Complete its preceding lessons first.`);
  }
}
function sessionFor(state: LearnerState, topic: CuratedTopic, cards: PracticeCard[], title: string): ActiveSession {
  return { id: `curated-${crypto.randomUUID()}`, source: "topic", topicId: topic.id, title, length: "standard", startedAt: new Date().toISOString(), cursor: 0, scores: [], practicedIndices: [], mode: state.settings.lessonMode,
    savedCards: structuredClone(cards), items: cards.map(card => ({ cardId: card.id, prompt: "explore", reason: "Curated topic practice", section: "lesson" })) };
}
export async function buildCuratedLesson(state: LearnerState, id: string): Promise<ActiveSession> {
  const lesson = await loadCuratedLesson(id);
  if (!lesson || !curatedAvailable(state, id)) throw new Error("Complete the starters and preceding lessons in this track first.");
  assertCuratedVocabulary(lesson.cards, lesson.targets, state, lesson.topicId);
  const topic = curatedTopics.find(t => t.id === lesson.topicId)!;
  return { ...sessionFor(state, topic, lesson.cards, lesson.title), curatedLessonId: id, curatedVersion: lesson.version, targetWordIds: [...lesson.targets], lessonNotes: structuredClone(lesson.notes) };
}
/** Review intervals advance on separate study dates, not repeated taps. */
export function curatedCardDueAt(memory: NonNullable<LearnerState["curatedProgress"]>["cards"][string]) {
  const intervals = [1, 3, 7, 14, 30, 60];
  return Date.parse(memory.at) + intervals[Math.min(intervals.length - 1, Math.max(0, (memory.occasions ?? 1) - 1))] * 86_400_000;
}
/** Exact cards, scoped by authored topic and consumed card IDs. Earliest due first. */
export function curatedReviewCards(state: LearnerState, topicId: string) {
  return (lessonsByTopic.get(topicId) ?? []).filter(lesson=>lesson.kind!=="review").flatMap(lesson => lesson.cardIds.filter(id => {
    const memory = state.curatedProgress?.cards?.[id];
    return memory && (memory.version ?? 1) === lesson.version && Number.isFinite(Date.parse(memory.at));
  })).sort((a, b) => curatedCardDueAt(state.curatedProgress!.cards[a]) - curatedCardDueAt(state.curatedProgress!.cards[b]) || a.localeCompare(b));
}
export function rememberCuratedCard(state: LearnerState, card: PracticeCard, at: string): LearnerState {
  const session = state.activeSession;
  const metadata = lessonsByCard.get(card.id);
  const lesson = metadata && loadedLessons.get(metadata.id);
  const authored = lesson?.cards.find(c => c.id === card.id);
  if (!lesson || !authored || !session || JSON.stringify(card) !== JSON.stringify(authored)) return state;
  if(session.curatedLessonId) {
    const active=loadedLessons.get(session.curatedLessonId);
    if(!active||active.topicId!==lesson.topicId||session.curatedVersion!==active.version||!active.cards.some(item=>item.id===card.id&&JSON.stringify(item)===JSON.stringify(authored)))return state;
  } else if(session.curatedReviewTopicId!==lesson.topicId)return state;
  const progress = state.curatedProgress ?? { completions: {}, cards: {} }, prior = progress.cards?.[card.id];
  const day = (value: string) => { const date = new Date(value); return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; };
  const occasions = (prior?.occasions ?? (prior ? 1 : 0)) + (!prior || day(prior.at) !== day(at) ? 1 : 0);
  return { ...state, curatedProgress: { ...progress, completions: progress.completions ?? {}, cards: { ...progress.cards, [card.id]: { at, version: lesson.version, encounters: (prior?.encounters ?? 0) + 1, occasions } } } };
}

export async function buildCuratedReview(state: LearnerState, topicId: string): Promise<ActiveSession> {
  const topic = curatedTopics.find(t => t.id === topicId), ids = curatedReviewCards(state, topicId).slice(0, 24);
  if (!topic || !ids.length) throw new Error("Practice a lesson in this topic before reviewing it.");
  const pool = (await loadCuratedTopic(topicId)).flatMap(lesson => lesson.cards);
  const cards = ids.map(id => pool.find(card => card.id === id)!);
  assertCuratedVocabulary(cards, [], state, topicId);
  return { ...sessionFor(state, topic, cards, `${topic.title} · Review`), curatedReviewTopicId: topicId, targetWordIds: [] };
}

/** Only a complete, matching frozen sequence can advance the curriculum. */
export function recordCuratedCompletion(state: LearnerState, session: ActiveSession, at: string): LearnerState {
  const lesson = session.curatedLessonId && loadedLessons.get(session.curatedLessonId);
  if (!lesson || session.curatedVersion !== lesson.version || session.curatedReviewTopicId || session.items.length !== lesson.cards.length || session.items.some((item,i) => item.cardId !== lesson.cards[i].id)) return state;
  if (JSON.stringify(session.savedCards) !== JSON.stringify(lesson.cards)) return state;
  const consumed = new Set((session.practicedIndices ?? []).filter(i => Number.isInteger(i) && i >= 0 && i < session.items.length));
  if (!session.completedByDeclarationAt && consumed.size !== session.items.length) return state;
  if (!curatedAvailable(state, lesson.id)) return state;
  const progress = state.curatedProgress ?? { completions: {}, cards: {} };
  if (progress.completions?.[lesson.id]?.version === lesson.version) return state;
  return { ...state, curatedProgress: { ...progress, completions: { ...progress.completions, [lesson.id]: { version: lesson.version, at, method: session.completedByDeclarationAt ? "declared" : "practiced" } } } };
}
