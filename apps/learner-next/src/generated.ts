import { fitsConstructionPool, generateSession, GenerationError, requiredGrammar, withinLevel, type Features, type GeneratedCard, type ProficiencyLevel, type Recipe, type SessionSnapshot } from "../../../packages/learning-engine";
import { exampleLexicon, exampleRecipes } from "../../../packages/learning-engine/examples";
import { getUnit, loadUnit } from "./curriculum";
import type { ActiveSession, CardToken, LearnerState, PracticeCard } from "./types";
import { suggestReviewWords, type ReviewContext } from "./review";
import { assertLessonVocabulary } from "./lesson-vocabulary";
import { assertLessonCardQuality } from "./lesson-card-quality";

export { exampleLexicon as builderLexicon };

const affirmative: Features = { tense: "nonpast", polarity: "positive", question: false };
export const builderRecipes: Record<string, Recipe> = {
  ...exampleRecipes,
  adjectives: { ...exampleRecipes.adjectives, helperSenseIds: [...exampleRecipes.adjectives.helperSenseIds, "watashi.default", "anata.default", "pan.default", "gohan.rice", "shatsu.default"] },
  actions: {
    schemaVersion: 1, level: "A1", id: "builder-actions", revision: 1, title: "Actions",
    targetSenseIds: ["tsukau.default", "erabu.default", "ageru.default", "miseru.default"],
    helperSenseIds: ["watashi.default", "anata.default", "hon.default", "pan.default", "mizu.default", "shatsu.default", "uta.default", "eiga.default", "nihongo.default", "yomu.default", "nomu.default", "taberu.default", "kiru.default", "hanasu.default", "kiku.default", "miru.default"],
    knownGrammar: ["topic-wa", "object-wo", "verb-polite"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [
      { id: "warmup", construction: "action", features: affirmative, count: 12 },
      { id: "negative", construction: "action", features: { ...affirmative, polarity: "negative" }, count: 8, introduceGrammar: ["negative"] },
      { id: "past", construction: "action", features: { ...affirmative, tense: "past" }, count: 8, introduceGrammar: ["past"] },
    ],
  },
  meals: {
    schemaVersion: 1, level: "A1", id: "builder-meals", revision: 1, title: "Eating",
    targetSenseIds: ["taberu.default", "pan.default", "gohan.rice", "yasai.default"], helperSenseIds: ["watashi.default", "anata.default"],
    knownGrammar: ["topic-wa", "object-wo", "verb-polite"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [
      { id: "warmup", construction: "action", features: affirmative, count: 12 },
      { id: "negative", construction: "action", features: { ...affirmative, polarity: "negative" }, count: 8, introduceGrammar: ["negative"] },
      { id: "past", construction: "action", features: { ...affirmative, tense: "past" }, count: 8, introduceGrammar: ["past"] },
    ],
  },
  drinks: {
    schemaVersion: 1, level: "A1", id: "builder-drinks", revision: 1, title: "Drinking",
    targetSenseIds: ["nomu.default", "koohii.default", "gyuunyuu.default"], helperSenseIds: ["watashi.default", "anata.default"],
    knownGrammar: ["topic-wa", "object-wo", "verb-polite"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [
      { id: "warmup", construction: "action", features: affirmative, count: 8 },
      { id: "negative", construction: "action", features: { ...affirmative, polarity: "negative" }, count: 6, introduceGrammar: ["negative"] },
      { id: "questions", construction: "action", features: { ...affirmative, question: true }, count: 6, introduceGrammar: ["question-ka"] },
    ],
  },
  identity: {
    schemaVersion: 1, level: "A1", id: "builder-identity", revision: 1, title: "People and identities",
    targetSenseIds: ["gakusei.default", "sensei.default"], helperSenseIds: ["watashi.default", "anata.default"],
    knownGrammar: ["topic-wa", "copula-polite"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [
      { id: "warmup", construction: "identity", features: affirmative, count: 8 },
      { id: "negative", construction: "identity", features: { ...affirmative, polarity: "negative" }, count: 6, introduceGrammar: ["negative"] },
      { id: "questions", construction: "identity", features: { ...affirmative, question: true }, count: 6, introduceGrammar: ["question-ka"] },
    ],
  },
  places: {
    schemaVersion: 1, level: "A1", id: "builder-places", revision: 2, title: "な-adjectives",
    targetSenseIds: ["gakkou.default", "kouen.default", "ie.default"], helperSenseIds: ["kiree-na.clean", "watashi.default", "anata.default", "shatsu.default", "basu.default"],
    knownGrammar: ["topic-wa", "na-adjective", "copula-polite"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [
      { id: "warmup", construction: "na-predicate", features: affirmative, count: 9 },
      { id: "negative", construction: "na-predicate", features: { ...affirmative, polarity: "negative" }, count: 6, introduceGrammar: ["negative"] },
      { id: "past", construction: "na-predicate", features: { ...affirmative, tense: "past" }, count: 6, introduceGrammar: ["past"] },
    ],
  },
};

export type BuilderLength = "quick" | "standard" | "deep";
export type BuilderFocus = "balanced" | "present" | "negative" | "past" | "questions";
export type BuilderOptions = { length?: BuilderLength; focus?: BuilderFocus; cardCount?: number };

/** Difficulty is derived from the reviewed template, not the requested ceiling. */
export function templatesForLevel(level: ProficiencyLevel, includeEarlier = false): string[] {
  return Object.keys(builderRecipes).filter(key => includeEarlier
    ? withinLevel(builderRecipes[key].level ?? "A1", level)
    : (builderRecipes[key].level ?? "A1") === level);
}

function resizePhases(phases: Recipe["phases"], count: number): Recipe["phases"] {
  const original = phases.reduce((sum, phase) => sum + phase.count, 0);
  const allocation = phases.map(phase => Math.max(1, Math.floor(phase.count / original * count)));
  let remaining = count - allocation.reduce((sum, value) => sum + value, 0);
  for (let index = 0; remaining > 0; index = (index + 1) % allocation.length, remaining -= 1) allocation[index] += 1;
  return phases.map((phase, index) => ({ ...phase, count: allocation[index] }));
}

/** All customization stays inside the reviewed construction. Grammar is introduced
 * after an affirmative warmup, and explicit exposure floors still gate the plan. */
function customizeRecipe(template: Recipe, options: BuilderOptions): Recipe {
  if (options.cardCount !== undefined && (!Number.isInteger(options.cardCount) || options.cardCount < 6 || options.cardCount > 120)) {
    throw new Error("Choose between 6 and 120 cards.");
  }
  const factor = options.cardCount !== undefined
    ? options.cardCount / template.phases.reduce((sum, phase) => sum + phase.count, 0)
    : options.length === "quick" ? 0.65 : options.length === "deep" ? 1.5 : 1;
  let phases = template.phases.map(phase => ({ ...phase, features: { ...phase.features }, count: Math.ceil(phase.count * factor) }));
  let knownGrammar = [...template.knownGrammar];
  if (options.focus && options.focus !== "balanced") {
    const construction = template.phases[0].construction;
    const total = phases.reduce((sum, phase) => sum + phase.count, 0);
    const features: Features = {
      tense: options.focus === "past" ? "past" : "nonpast",
      polarity: options.focus === "negative" ? "negative" : "positive",
      question: options.focus === "questions",
    };
    knownGrammar = requiredGrammar(construction, affirmative);
    const introduceGrammar = requiredGrammar(construction, features).filter(id => !knownGrammar.includes(id));
    const warmup = Math.min(phases[0].count, Math.ceil(total / 3));
    phases = options.focus === "present"
      ? [{ id: "present", construction, features, count: total }]
      : [
        { id: "warmup", construction, features: { ...affirmative }, count: warmup },
        { id: options.focus, construction, features, count: total - warmup, introduceGrammar },
      ];
  }
  if (options.cardCount !== undefined) phases = resizePhases(phases, options.cardCount);
  return { ...template, phases, knownGrammar, minTargetExposures: Math.max(2, Math.floor(template.minTargetExposures * (options.cardCount !== undefined ? Math.min(1, factor) : factor))) };
}

const compatibleCache = new Map<string, string[]>();
export function compatibleSenses(key: string, level: ProficiencyLevel = "A1"): string[] {
  const cacheKey = `${key}:${level}`;
  const cached = compatibleCache.get(cacheKey);
  if (cached) return [...cached];
  const template = builderRecipes[key];
  if (!template) return [];
  const pool = exampleLexicon.entries.filter(entry => [...template.targetSenseIds, ...template.helperSenseIds].includes(entry.id) && withinLevel(entry.level, level));
  const compatible = exampleLexicon.entries.filter(entry => withinLevel(entry.level, level) && template.phases.some(phase =>
    fitsConstructionPool(phase.construction, entry, pool) ||
    phase.construction === "existence" && entry.kind === "verb" && entry.frames.some(frame => frame.startsWith("existence-"))
  )).map(entry => entry.id);
  compatibleCache.set(cacheKey, compatible);
  return [...compatible];
}

const supportedSenseIds = new Set(Object.keys(builderRecipes).flatMap(key => compatibleSenses(key)));
export const builderSupportedSenseCount = supportedSenseIds.size;
export const builderSupportedWordIds = exampleLexicon.entries.filter(entry => supportedSenseIds.has(entry.id)).map(entry => entry.wordId);

export function generateLesson(key: string, targets: string[], seed: number, review = false, options: BuilderOptions & { level?: ProficiencyLevel; additions?: string[] } = {}): SessionSnapshot {
  const original = builderRecipes[key];
  if (!original) throw new Error("Choose a lesson template.");
  const template = customizeRecipe(original, options);
  const level = options.level ?? "A1";
  const permitted = compatibleSenses(key, level);
  const additions = (options.additions ?? []).filter(id => !targets.includes(id));
  if ([...targets, ...additions].some(id => !permitted.includes(id))) throw new Error("Some selected words are not supported by this template and level. Choose another template or adjust the selection.");
  const recipe: Recipe = {
    ...template,
    id: `${review ? "review" : "lesson"}-${key}`,
    level,
    targetSenseIds: [...targets, ...additions],
    helperSenseIds: template.helperSenseIds.filter(id => !targets.includes(id) && !additions.includes(id)),
    targetExposures: Object.fromEntries(additions.map(id => [id, 4])),
  };
  if (review) {
    recipe.helperSenseIds = [...template.targetSenseIds, ...template.helperSenseIds].filter(id => !recipe.targetSenseIds.includes(id));
    // Reviews use already-selected grammar; course examples retain their warmup.
    recipe.knownGrammar = [...new Set([...template.knownGrammar, ...template.phases.flatMap(phase => phase.introduceGrammar ?? [])])];
    recipe.phases = template.phases.map(phase => ({ ...phase, introduceGrammar: [] }));
  }
  // A larger word selection needs more encounters than the small starter preset.
  // Grow declared phases instead of silently omitting targets or lowering coverage.
  const originalCount = recipe.phases.reduce((sum, phase) => sum + phase.count, 0);
  const targetCount = targets.reduce((sum, id) => sum + (recipe.targetExposures?.[id] ?? recipe.minTargetExposures), 0);
  if (options.cardCount === undefined && targetCount > originalCount) {
    recipe.phases = recipe.phases.map(phase => ({ ...phase, count: Math.ceil(phase.count * targetCount / originalCount) }));
  }
  if (recipe.phases.slice(1).some(phase => phase.introduceGrammar?.length)) {
    if (options.cardCount === undefined) recipe.phases[0] = { ...recipe.phases[0], count: Math.max(recipe.phases[0].count, targets.length * 2) };
    else {
      // Reserve early exposure before introducing another form without silently
      // changing an explicit card count. An impossible selection remains an error.
      const warmupCount = Math.min(options.cardCount - recipe.phases.length + 1, Math.max(recipe.phases[0].count, targets.length * 2));
      recipe.phases = [{ ...recipe.phases[0], count: warmupCount }, ...resizePhases(recipe.phases.slice(1), options.cardCount - warmupCount)];
    }
  }
  if (recipe.phases.reduce((sum, phase) => sum + phase.count, 0) > 300) {
    throw new Error("This selection needs more than 300 cards. Select fewer target words or set a card count.");
  }
  return generateSession(recipe, exampleLexicon, seed);
}

/** Build the exact preview, admitting a review addition only if the whole lesson
 * still passes its core exposure/grammar constraints. Deferred words stay due. */
export function buildLessonPlan(key: string, targets: string[], seed: number, context: ReviewContext, options: BuilderOptions & { level: ProficiencyLevel; includeReview: boolean; review?: boolean; now?: number }) {
  let snapshot = generateLesson(key, targets, seed, options.review, options);
  const now = options.now ?? Date.now();
  const additions: NonNullable<SessionSnapshot["reviewSelection"]>["additions"] = [];
  const deferred: NonNullable<SessionSnapshot["reviewSelection"]>["deferred"] = [];
  if (options.includeReview) {
    const permitted = compatibleSenses(key, options.level);
    const targetWords = new Set(exampleLexicon.entries.filter(entry => targets.includes(entry.id)).map(entry => entry.wordId));
    let attempts = 0;
    for (const candidate of suggestReviewWords(context, seed, now)) {
      if (targetWords.has(candidate.wordId)) continue;
      const sense = exampleLexicon.entries.find(entry => entry.wordId === candidate.wordId && permitted.includes(entry.id));
      let reason = !sense ? "Not supported by this template" : additions.length >= 2 || attempts >= 12 ? "Review word limit reached" : "Insufficient practice in this sequence";
      if (sense && additions.length < 2 && attempts < 12) {
        attempts += 1;
        try {
          const next = generateLesson(key, targets, seed, options.review, { ...options, additions: [...additions.map(word => word.senseId), sense.id] });
          snapshot = next;
          additions.push({ wordId: candidate.wordId, senseId: sense.id, reason: candidate.reason });
          continue;
        } catch (error) {
          if (!(error instanceof GenerationError)) throw error;
        }
      }
      if (candidate.due || candidate.priority) deferred.push({ wordId: candidate.wordId, reason });
    }
  }
  snapshot.reviewSelection = { selectedAt: new Date(now).toISOString(), additions, deferred };
  return snapshot;
}

export function generationMessage(error: unknown): string {
  if (!(error instanceof GenerationError)) return error instanceof Error ? error.message : "Could not build this lesson.";
  if (error.code === "EMPTY_SLOT") return "A required word type is missing. Add a compatible word, or use the template's suggested words.";
  if (error.code === "INVALID_RECIPE") return "Choose at least one target word to build a lesson.";
  if (error.code === "NO_NEIGHBOR") return "Add another word so consecutive cards can change.";
  if (error.code === "WORD_LEVEL" || error.code === "GRAMMAR_LEVEL" || error.code === "INVALID_LEVEL") return "These words or grammar exceed the selected lesson level.";
  if (error.code === "COVERAGE_SHORTFALL" || error.code === "NO_TARGET_CANDIDATES" || error.code === "WARMUP_INCOMPLETE") return "The selected words cannot receive enough practice in this sequence. Add more cards, select fewer target words, or change the template.";
  return "These words cannot be combined with this template. Change the template or adjust the selection.";
}

export function createGeneratedSession(snapshot: SessionSnapshot, state: LearnerState): ActiveSession {
  return {
    id: `generated-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`,
    source: "generated", snapshot, title: snapshot.recipe.title, length: "deep",
    startedAt: new Date().toISOString(), cursor: 0, scores: [],
    mode: state.settings.lessonMode,
    items: snapshot.cards.map((card, index) => ({ cardId: card.id, prompt: "explore", reason: snapshot.transitions[index].phaseId })),
  };
}

export function isCourseSession(session: ActiveSession) {
  return session.source === undefined || session.source === "course";
}

/** A missing generated snapshot must never become a different frozen card. */
export function resolveSessionCard(session: ActiveSession, index = session.cursor): PracticeCard {
  const item = session.items[Math.max(0, Math.min(index, session.items.length - 1))];
  if (!item) throw new Error("The saved lesson has no cards.");
  if (session.source === "saved" || session.source === "topic" || session.source === "vocabulary") {
    const card = session.savedCards?.[Math.max(0, Math.min(index, session.items.length - 1))];
    if (!card || card.id !== item.cardId) throw new Error("This saved-sentence review's cards are incomplete.");
    return card;
  }
  if (session.source === "generated") {
    const card = session.snapshot?.cards[Math.max(0, Math.min(index, session.items.length - 1))];
    if (!card || card.id !== item.cardId) throw new Error("This generated lesson's saved cards are incomplete.");
    return card;
  }
  const unitId = item.unitId ?? session.unitId;
  if (unitId === undefined) throw new Error("This lesson is missing its source unit.");
  const card = getUnit(unitId).cards.find(card => card.id === item.cardId);
  if (!card) throw new Error("This saved card could not be found.");
  return card;
}

export async function prepareSession(session: ActiveSession, state?: LearnerState): Promise<void> {
  if (session.source === "saved" || session.source === "topic" || session.source === "vocabulary") {
    if (!Array.isArray(session.savedCards) || !Array.isArray(session.items) || !Array.isArray(session.scores) ||
      session.savedCards.length !== session.items.length || session.items.length === 0 ||
      !Number.isInteger(session.cursor) || session.cursor < 0 || session.cursor > session.items.length ||
      session.unitId !== undefined || session.items.some(item => !item || typeof item.cardId !== "string" || !item.cardId || item.unitId !== undefined)) {
      throw new Error("This saved-sentence review is incomplete.");
    }
    session.items.forEach((_, index) => {
      const card = resolveSessionCard(session, index);
      if (!Array.isArray(card.tokens) || !card.tokens.length ||
        ![card.line, card.tts, card.explain].every(values => Array.isArray(values) && values.length === card.tokens.length) ||
        card.tokens.some((token, index) => !token || typeof token.surface !== "string" || !token.surface.trim() ||
          typeof token.reading !== "string" || !token.reading.trim() || typeof token.explain !== "string" || !token.explain.trim() ||
          token.surface !== card.line[index] || token.reading !== card.tts[index] || token.explain !== card.explain[index]) ||
        typeof card.english !== "string" || !card.english.trim()) throw new Error("The saved review has an incomplete sentence.");
    });
    if (state && (session.source === "topic" || session.source === "vocabulary")) {
      if (session.curatedLessonId || session.curatedReviewTopicId) {
        const { assertCuratedVocabulary, loadCuratedTopic } = await import("./curated-course");
        if (session.topicId) await loadCuratedTopic(session.topicId);
        assertCuratedVocabulary(session.savedCards, session.targetWordIds ?? [], state);
      } else assertLessonVocabulary(session.savedCards, session.targetWordIds ?? [], state);
    }
    try { assertLessonCardQuality(session.savedCards, !!(session.curatedLessonId || session.curatedReviewTopicId)); }
    catch (cause) { throw new Error(`${cause instanceof Error ? cause.message : "Invalid sentence cards."} Remake this lesson to use the current rules. The saved original is kept.`); }
    return;
  }
  if (session.source === "generated") {
    const snapshot = session.snapshot;
    if (!snapshot || snapshot.schemaVersion !== 1 || !snapshot.recipe?.id || !snapshot.recipe.title ||
      !Array.isArray(snapshot.cards) || !Array.isArray(session.items) || !Array.isArray(session.scores) ||
      snapshot.cards.length !== session.items.length || session.items.length === 0 ||
      !Number.isInteger(session.cursor) || session.cursor < 0 || session.cursor > session.items.length ||
      session.unitId !== undefined || session.items.some(item => !item || item.unitId !== undefined)) {
      throw new Error("This generated lesson's snapshot is incomplete.");
    }
    session.items.forEach((_, index) => {
      const card = resolveSessionCard(session, index) as GeneratedCard;
      if (card.audioPolicy !== "words" || !Array.isArray(card.tokens) || !card.tokens.length ||
        ![card.line, card.tts, card.explain].every(values => Array.isArray(values) && values.length === card.tokens.length) ||
        card.tokens.some((token, index) => !token || !token.surface || !token.reading || !token.explain ||
          token.surface !== card.line[index] || token.reading !== card.tts[index] || token.explain !== card.explain[index]) ||
        !card.english) throw new Error("The saved lesson has an incomplete card.");
    });
    return;
  }
  const ids = [...new Set(session.items.map(item => item.unitId ?? session.unitId))];
  if (ids.some(id => id === undefined)) throw new Error("This lesson is missing its source unit.");
  await Promise.all((ids as number[]).map(loadUnit));
}

export function generatedAudioWord(card: PracticeCard, previous?: PracticeCard): CardToken | undefined {
  const changed = previous && card.tokens.find((token, index) => token.wordId && (token.surface !== previous.tokens[index]?.surface || token.reading !== previous.tokens[index]?.reading));
  return changed || [...card.tokens].reverse().find(token => token.wordId);
}

export function toggleSavedSentence(state: LearnerState, card: PracticeCard, session: ActiveSession): LearnerState {
  const saved = state.savedSentenceIds.includes(card.id);
  const savedGeneratedCards = { ...state.savedGeneratedCards };
  const savedMaterializedCards = { ...state.savedMaterializedCards };
  if (saved) delete savedMaterializedCards[card.id];
  else if (["topic", "vocabulary", "saved"].includes(session.source ?? "")) savedMaterializedCards[card.id] = structuredClone(card);
  if (saved) delete savedGeneratedCards[card.id];
  else if (session.source === "generated" && session.snapshot) {
    savedGeneratedCards[card.id] = { card: card as GeneratedCard, title: session.title ?? session.snapshot.recipe.title, recipeId: session.snapshot.recipe.id };
  } else if (session.source === "saved") {
    const generated = card as Partial<GeneratedCard>;
    if (generated.derivation && Array.isArray(generated.senseIds) && generated.audioPolicy === "words") {
      savedGeneratedCards[card.id] = { card: card as GeneratedCard, title: session.title ?? "Saved sentences", recipeId: "saved-sentences" };
    }
  }
  return { ...state, savedMaterializedCards, savedSentenceIds: saved ? state.savedSentenceIds.filter(id => id !== card.id) : [...state.savedSentenceIds, card.id], ...(session.source === "generated" || session.source === "saved" || state.savedGeneratedCards ? { savedGeneratedCards } : {}) };
}
