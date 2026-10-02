import { a1CompletionPolicy, a1CoreWordIds, a1CoreWordIdsForTopic, a1Milestones, a1Topics, a1WordMetadata } from "../../../packages/dictionary/a1";
import { isPrioritized, suggestReviewWords } from "./review";
import { wasPracticed } from "./session-history";
import { coreOccasions } from "./a1-progress";
import { sequenceTopicCards, type TopicCandidate } from "./topic-sequence";
import { selectConnectedTopicWords } from "./topic-word-selection";
import { assertLessonVocabulary, knownLessonWords, unknownLessonWords } from "./lesson-vocabulary";
import { personalizedCandidates, PERSONALIZED_ENGINE_VERSION } from "../../../packages/learning-engine/personalized";
import type { ActiveSession, LearnerState, LibraryReviewMode, PracticeCard } from "./types";
import { knownGrammar } from "./grammar-progress";
import { grammarReviewReport } from "./adaptive-lesson";
import { appendSentenceReviews } from "./sentence-review";

const coreSet = new Set(a1CoreWordIds);
const aliases = new Map<string, string[]>();
for (const [id, metadata] of Object.entries(a1WordMetadata)) {
  const coreId = metadata.coreWordId ?? id;
  aliases.set(coreId, [...(aliases.get(coreId) ?? []), id]);
}

/** Repeated visits in one sitting are exposure, not spaced learning. */
export function coreWordProgress(state: LearnerState, id: string) {
  const records = (aliases.get(id) ?? [id]).map(wordId => state.wordHistory[wordId]).filter(Boolean);
  const occasions = coreOccasions(state, id).occasions;
  const declaredKnown = records.some(record => !!record.declaredKnownAt);
  return { introduced: declaredKnown || records.some(wasPracticed), learned: declaredKnown || occasions >= a1CompletionPolicy.learnedPracticeOccasions, declaredKnown, practiced: records.some(wasPracticed), occasions };
}

export function a1Progress(state: LearnerState, topicId?: string) {
  const ids = topicId ? a1CoreWordIdsForTopic(topicId) : a1CoreWordIds;
  const introduced = ids.filter(id => coreWordProgress(state, id).introduced).length;
  const learned = ids.filter(id => coreWordProgress(state, id).learned).length;
  const milestones = a1Milestones.filter(milestone => !topicId || milestone.topicIds.includes(topicId));
  const checked = milestones.filter(milestone => state.a1Journey?.milestoneChecks[milestone.id]).length;
  return { total: ids.length, introduced, learned, declaredKnown: ids.filter(id => coreWordProgress(state, id).declaredKnown).length, practiced: ids.filter(id => coreWordProgress(state, id).practiced).length, percent: ids.length ? Math.floor(learned / ids.length * 100) : 0,
    checked, milestoneTotal: milestones.length, vocabularyComplete: ids.length > 0 && learned === ids.length,
    complete: ids.length > 0 && learned === ids.length && checked === milestones.length };
}

export function activeTopicIds(state: LearnerState) {
  const valid = new Set(a1Topics.map(topic => topic.id));
  return [...new Set((state.a1Journey?.activeTopicIds ?? [a1Topics[0]?.id]).filter((id): id is string => !!id && valid.has(id)))];
}
export function toggleTopic(state: LearnerState, topicId: string): LearnerState {
  if (!a1Topics.some(topic => topic.id === topicId)) return state;
  const active = activeTopicIds(state);
  return { ...state, a1Journey: { milestoneChecks: state.a1Journey?.milestoneChecks ?? {}, activeTopicIds: active.includes(topicId) ? active.filter(id => id !== topicId) : [...active, topicId] } };
}
export function setMilestone(state: LearnerState, id: string, checked: boolean): LearnerState {
  if (!a1Milestones.some(milestone => milestone.id === id)) return state;
  const checks = { ...state.a1Journey?.milestoneChecks };
  if (checked) checks[id] = new Date().toISOString(); else delete checks[id];
  return { ...state, a1Journey: { activeTopicIds: activeTopicIds(state), milestoneChecks: checks } };
}

export const DEFAULT_TOPIC_WORDS = 12;
export const MAX_TOPIC_WORDS = 30;
export const MAX_TOPIC_CARDS = 48;

export function selectTopicWords(state: LearnerState, topicId: string, extras = false, now = Date.now(), wordCount = DEFAULT_TOPIC_WORDS) {
  if (!Number.isInteger(wordCount) || wordCount < 1 || wordCount > MAX_TOPIC_WORDS) throw new Error(`Choose between 1 and ${MAX_TOPIC_WORDS} words.`);
  const core = a1CoreWordIdsForTopic(topicId);
  const pool = extras ? extraTopicWordIds(topicId) : core;
  const priority = (id: string) => (aliases.get(id) ?? [id]).some(alias => isPrioritized(state.wordHistory[alias]));
  const unseen = pool.filter(id => !coreWordProgress(state, id).introduced).sort((a, b) => Number(priority(b)) - Number(priority(a)));
  const rank = new Map<string, number>();
  suggestReviewWords(state, 0, now).forEach((row, index) => { const id = a1WordMetadata[row.wordId]?.coreWordId ?? row.wordId; if (!rank.has(id)) rank.set(id, index); });
  const review = pool.filter(id => coreWordProgress(state, id).introduced).sort((a, b) => (rank.get(a) ?? Infinity) - (rank.get(b) ?? Infinity));
  // New content selection is independent of scheduled saved-card review.
  const newWordIds = unseen.slice(0, wordCount);
  const reviewWordIds: string[] = [];
  return { wordIds: [...newWordIds, ...reviewWordIds], newWordIds, reviewWordIds, rankedNewWordIds: unseen, rankedReviewWordIds: review, remaining: unseen.length, extras };
}

export function extraTopicWordIds(topicId: string) {
  return Object.entries(a1WordMetadata).filter(([id, value]) => !value.core && !value.coreWordId && value.topicIds.includes(topicId) && !coreSet.has(id)).map(([id]) => id);
}

function materialize(cards: PracticeCard[], title: string, source: "topic" | "vocabulary", wordIds: string[], mode: ActiveSession["mode"]): ActiveSession {
  return { id: `${source}-${crypto.randomUUID()}`, source, title, targetWordIds: wordIds, savedCards: structuredClone(cards),
    startedAt: new Date().toISOString(), length: "standard", mode, cursor: 0, scores: [], practicedIndices: [],
    items: cards.map(card => ({ cardId: card.id, prompt: "explore", reason: "Words in context" })) };
}

/** Reference words require reviewed sentence support; never fabricate grammar. */
export async function vocabularySession(wordIds: string[], state: LearnerState, title = "Priority word practice", mode: LibraryReviewMode = "mixed", count?: number): Promise<ActiveSession> {
  const { buildCustomLesson } = await import("./custom-lesson");
  const result = await buildCustomLesson(state, wordIds, {title, cardCount: count});
  return {...result.session, mode: mode ?? state.settings.lessonMode};
}

export type TopicLesson = { session: ActiveSession; newWordIds: string[]; reviewWordIds: string[]; helperWordIds: string[]; contextCount: number; appearances: Record<string, number> };
export type TopicLessonOptions = { wordCount?: number; cardCount?: number; wordIds?: string[] };

const canonicalId = (id: string) => a1WordMetadata[id]?.coreWordId ?? id;

/** Compose reviewed authored examples around new targets; never invent a sentence
 * for reference entries. Every card contains a target, and every target receives
 * balanced practice. A topic pool is never used directly as the session deck. */
function planTopicLesson(state: LearnerState, topicId: string, extras = false, options: TopicLessonOptions = {}) {
  const topic = a1Topics.find(item => item.id === topicId);
  if (!topic) throw new Error("Choose an available topic.");
  const automatic = selectTopicWords(state, topicId, extras, Date.now(), options.wordCount);
  const pool = new Set(extras ? extraTopicWordIds(topicId) : a1CoreWordIdsForTopic(topicId));
  const known = knownLessonWords(state);
  // Keep familiar scaffolding within the scenario. Review urgency never adds
  // vocabulary to new-topic sentences. Pronouns and learned grammar remain usable.
  const grammar = knownGrammar(state);
  const scenarioScaffolds: Record<string, string[]> = {
    food: ["yomu", "hoshii"], // Reading a menu and asking for food.
    home: ["sensei", "gakusei", "hito", "haha", "chichi", "ane", "otouto"],
    work: ["eigo", "nihongo", "kanji", "hiragana", "katakana"],
  };
  const scaffolds = new Set(["watashi", "anata", ...(grammar.has("want-object") ? ["hoshii"] : []), ...(scenarioScaffolds[topicId] ?? [])]);
  const topicKnown = new Set([...known].filter(id => scaffolds.has(canonicalId(id)) || a1WordMetadata[canonicalId(id)]?.topicIds.includes(topicId)));
  // Pairing must see alternatives beyond the initial quota. Using only the
  // first six nouns made later compatible actions invisible to the selector.
  const selectionPool = automatic.rankedNewWordIds.slice(0, 30);
  const sourceCards = personalizedCandidates(selectionPool, topicKnown, grammar);
  const wordIds = options.wordIds ? [...new Set(options.wordIds)] : selectConnectedTopicWords({
    rankedNewWordIds: automatic.rankedNewWordIds, rankedReviewWordIds: automatic.rankedReviewWordIds,
    newCount: automatic.newWordIds.length, reviewCount: automatic.reviewWordIds.length,
    priorityWordIds: [...automatic.reviewWordIds, ...[...pool].filter(id => (aliases.get(id) ?? [id]).some(alias => isPrioritized(state.wordHistory[alias])))], cards: sourceCards,
  });
  if (wordIds.length > MAX_TOPIC_WORDS || wordIds.some(id => !pool.has(id))) throw new Error(`Choose up to ${MAX_TOPIC_WORDS} words from this topic.`);
  const selection = { wordIds, newWordIds: wordIds.filter(id => !coreWordProgress(state, id).introduced), reviewWordIds: wordIds.filter(id => coreWordProgress(state, id).introduced) };
  if (!selection.wordIds.length) throw new Error("There are no words in this topic pool.");
  const selected = new Set(selection.wordIds);
  const cardWords = (card: PracticeCard) => [...new Set(card.tokens.flatMap(token => token.wordId ? [canonicalId(token.wordId)] : []))];
  const candidates: TopicCandidate[] = personalizedCandidates(wordIds, topicKnown, grammar)
    .map(card => ({ card, targets: cardWords(card).filter(id => selected.has(id)), unknown: unknownLessonWords(card, selected, known) }))
    .filter(item => item.targets.length && item.unknown.length === 0);
  const plan = sequenceTopicCards(wordIds, candidates, { cardCount: options.cardCount });
  assertLessonVocabulary(plan.cards, wordIds, state);
  return { topic, wordIds, selection, plan };
}

// State updates are immutable. Eligibility creates no sessions, timestamps or
// practice credit, and uses precisely the planner used by the launch path.
const availability = new WeakMap<LearnerState, Map<string, boolean>>();
export function canBuildTopicLesson(state: LearnerState, topicId: string, extras = false, wordCount = DEFAULT_TOPIC_WORDS): boolean {
  let cached = availability.get(state);
  if (!cached) { cached = new Map(); availability.set(state, cached); }
  const key = `${topicId}:${extras}:${wordCount}`;
  if (!cached.has(key)) {
    try { planTopicLesson(state, topicId, extras, {wordCount}); cached.set(key, true); }
    catch { cached.set(key, false); }
  }
  return cached.get(key)!;
}

/** Keep the existing learned-core gate for exploring extra vocabulary. */
export function availableTopicMode(state: LearnerState, topicId: string): "core" | "extras" | undefined {
  if (canBuildTopicLesson(state, topicId)) return "core";
  const progress = a1Progress(state, topicId);
  if (progress.vocabularyComplete && canBuildTopicLesson(state, topicId, true)) return "extras";
  return undefined;
}

export async function buildTopicLesson(state: LearnerState, topicId: string, extras = false, options: TopicLessonOptions = {}): Promise<TopicLesson> {
  const {topic, wordIds, selection, plan} = planTopicLesson(state, topicId, extras, options);
  let session = materialize(plan.cards, `${topic.title} · ${extras ? "Explore more" : "A1"}`, "topic", wordIds, state.settings.lessonMode);
  session.topicId = topicId;
  session.items = session.items.map((item, index) => ({ ...item, reason: plan.steps[index].kind === "boundary" ? "New sentence pattern or phrase" : plan.steps[index].kind === "neighbor" ? `${plan.steps[index].lexicalChanges} word change${plan.steps[index].lexicalChanges === 1 ? "" : "s"}` : item.reason }));
  session.lessonPlan = { version: 1, engineVersion: PERSONALIZED_ENGINE_VERSION, cardCount: plan.cards.length, appearances: plan.appearances,
    helperWordIds: plan.helperWordIds, newWordIds: selection.newWordIds, reviewWordIds: selection.reviewWordIds,
    grammarReview: grammarReviewReport(state, plan.cards), pacing: plan.pacing, transitions: plan.steps };
  session = appendSentenceReviews(state, session, {cardLimit:options.cardCount});
  return { session, newWordIds: selection.newWordIds, reviewWordIds: session.lessonPlan!.reviewWordIds,
    helperWordIds: plan.helperWordIds, contextCount: session.items.length, appearances: session.lessonPlan!.appearances };
}
