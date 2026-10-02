import { existenceVerb, fitsSlot, realizeSentence, requiredGrammar, semanticCompatibility, slots, validateLexicon } from "./grammar";
import { validateCardLevel, validateLevelPool } from "./levels";
import { grammarIds, GenerationError, type GeneratedCard, type GrammarId, type Lexeme, type Lexicon, type Noun, type Phase, type Recipe, type Sentence, type SessionSnapshot, type Transition, type WordAudio } from "./types";

export const ENGINE_VERSION = "0.5.0";
const exposureFloor = (recipe: Recipe, id: string) => recipe.targetExposures?.[id] ?? recipe.minTargetExposures;
export const LIMITS = { pool: 80, candidatesPerPhase: 20_000, totalCards: 300, phases: 30 } as const;

function assertUnique(values: string[], label: string): void {
  if (!Array.isArray(values) || values.some(value => typeof value !== "string" || !value.trim()) || new Set(values).size !== values.length) throw new GenerationError("INVALID_RECIPE", `${label} must be a list of distinct nonempty IDs`);
}
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function rng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function validateRecipe(recipe: Recipe, lexicon: Lexicon, seed: number) {
  if (!recipe || recipe.schemaVersion !== 1 || !recipe.id || !recipe.title || !Number.isSafeInteger(recipe.revision) || recipe.revision < 1) throw new GenerationError("INVALID_RECIPE", "A version-one recipe with ID, title, and positive revision is required");
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) throw new GenerationError("INVALID_SEED", "Seed must be an unsigned 32-bit integer");
  assertUnique(recipe.targetSenseIds, "Targets");
  assertUnique(recipe.helperSenseIds, "Helpers");
  assertUnique(recipe.knownGrammar, "Known grammar");
  if (!recipe.targetSenseIds.length) throw new GenerationError("INVALID_RECIPE", "Choose at least one target sense");
  if (recipe.targetSenseIds.some(id => recipe.helperSenseIds.includes(id))) throw new GenerationError("INVALID_RECIPE", "A sense cannot be both a target and a helper");
  if (![1, 2].includes(recipe.maxChangedSlots) || !Number.isInteger(recipe.minTargetExposures) || recipe.minTargetExposures < 1 || recipe.minTargetExposures > LIMITS.totalCards) throw new GenerationError("INVALID_RECIPE", "Choose a one/two-slot limit and a positive, bounded exposure floor");
  if (!Array.isArray(recipe.phases) || recipe.phases.length < 1 || recipe.phases.length > LIMITS.phases) throw new GenerationError("INVALID_RECIPE", `Choose between 1 and ${LIMITS.phases} phases`);
  assertUnique(recipe.phases.map(phase => phase.id), "Phase IDs");
  if (recipe.phases.some(phase => !Number.isInteger(phase.count) || phase.count < 1) || recipe.phases.reduce((sum, phase) => sum + phase.count, 0) > LIMITS.totalCards) throw new GenerationError("INVALID_RECIPE", `Phase lengths must be positive integers totaling at most ${LIMITS.totalCards} cards`);
  const entries = validateLexicon(lexicon);
  if (recipe.targetExposures && Object.entries(recipe.targetExposures).some(([id, count]) => !recipe.targetSenseIds.includes(id) || !Number.isInteger(count) || count < 1 || count > LIMITS.totalCards)) throw new GenerationError("INVALID_RECIPE", "Exposure overrides must name targets and positive bounded counts.");
  const ids = [...recipe.targetSenseIds, ...recipe.helperSenseIds].sort();
  if (ids.length > LIMITS.pool) throw new GenerationError("POOL_LIMIT", `This slice supports at most ${LIMITS.pool} senses per recipe`);
  const pool = ids.map(id => {
    const entry = entries.get(id);
    if (!entry) throw new GenerationError("UNKNOWN_SENSE", `No reviewed metadata for sense: ${id}`, { id });
    return entry;
  });
  validateLevelPool(recipe, pool);
  const available = new Set<GrammarId>(recipe.knownGrammar);
  for (const phase of recipe.phases) {
    assertUnique(phase.introduceGrammar ?? [], "Introduced grammar");
    for (const id of phase.introduceGrammar ?? []) available.add(id);
    const required = requiredGrammar(phase.construction, phase.features);
    const missing = required.filter(id => !available.has(id));
    if (missing.length) throw new GenerationError("UNAVAILABLE_GRAMMAR", `${phase.id} requires unavailable grammar: ${missing.join(", ")}`, { phaseId: phase.id, missing });
  }
  if ([...available].some(id => !grammarIds.includes(id))) throw new GenerationError("UNKNOWN_GRAMMAR", "Recipe references an unimplemented grammar ID");
  return pool;
}

function candidatesForPhase(phase: Phase, recipe: Recipe, pool: Lexeme[], lexicon: Lexicon, grammar: GrammarId[]): GeneratedCard[] {
  const slotNames = slots[phase.construction];
  const choices = slotNames.map(slot => pool.filter(entry => fitsSlot(phase.construction, slot, entry)));
  const missingSlots = slotNames.filter((_, index) => choices[index].length === 0);
  if (missingSlots.length) throw new GenerationError("EMPTY_SLOT", `${phase.id} has no eligible words for: ${missingSlots.join(", ")}`, { phaseId: phase.id, missingSlots });
  const product = choices.reduce((count, options) => count * options.length, 1);
  if (product > LIMITS.candidatesPerPhase) throw new GenerationError("SEARCH_LIMIT", `${phase.id} needs ${product} candidates; narrow the pool or split the recipe`, { phaseId: phase.id, candidateCount: product, limit: LIMITS.candidatesPerPhase });
  if (phase.construction === "existence") for (const entity of choices[slotNames.indexOf("entity")]) existenceVerb(entity as Noun, pool);
  const candidates: GeneratedCard[] = [];
  const bound: Record<string, Lexeme> = {};
  const bindings: Record<string, string> = {};
  const visit = (index: number) => {
    if (index === slotNames.length) {
      if (semanticCompatibility(phase.construction, bound)) return;
      const card = realizeSentence({ construction: phase.construction, features: phase.features, bindings }, lexicon, pool.map(entry => entry.id), grammar);
      validateCardLevel(card, recipe.level);
      if (card.senseIds.some(id => recipe.targetSenseIds.includes(id))) candidates.push(card);
      return;
    }
    for (const entry of choices[index]) {
      bindings[slotNames[index]] = entry.id;
      bound[slotNames[index]] = entry;
      visit(index + 1);
    }
  };
  visit(0);
  if (!candidates.length) throw new GenerationError("NO_TARGET_CANDIDATES", `${phase.id} has no semantically compatible sentences for the selected targets`, { phaseId: phase.id, targets: recipe.targetSenseIds });
  return candidates;
}

export function changedSlots(previous: Sentence, next: Sentence): string[] {
  const names = new Set([...Object.keys(previous.bindings), ...Object.keys(next.bindings)]);
  return [...names].filter(slot => previous.bindings[slot] !== next.bindings[slot]);
}
function sentenceId(card: GeneratedCard, lexiconVersion: string) {
  const { construction, features, bindings } = card.derivation;
  // Lossless components avoid hash collisions. Identity is independent of recipe/seed.
  return ["generated", ENGINE_VERSION, lexiconVersion, construction, features.tense, features.polarity, String(features.question), ...slots[construction].map(slot => bindings[slot])].map(encodeURIComponent).join(":");
}

export function generateSession(recipe: Recipe, lexicon: Lexicon, seed: number): SessionSnapshot {
  const pool = validateRecipe(recipe, lexicon, seed);
  const random = rng(seed);
  const coverage: Record<string, number> = Object.fromEntries(pool.map(entry => [entry.id, 0]));
  const wordCoverage: Record<string, number> = Object.fromEntries(pool.map(entry => [entry.wordId, 0]));
  const cards: GeneratedCard[] = [];
  const transitions: Transition[] = [];
  const available = new Set<GrammarId>(recipe.knownGrammar);
  for (const phase of recipe.phases) {
    const newGrammar = (phase.introduceGrammar ?? []).filter(id => !available.has(id));
    if (newGrammar.length) {
      const unseen = recipe.targetSenseIds.filter(id => coverage[id] === 0);
      if (unseen.length) throw new GenerationError("WARMUP_INCOMPLETE", `Before ${phase.id}, warm up: ${unseen.join(", ")}`, { phaseId: phase.id, unseen });
    }
    for (const id of newGrammar) available.add(id);
    const candidates = candidatesForPhase(phase, recipe, pool, lexicon, [...available]);
    const counts = new Map<GeneratedCard, number>();
    let previous: GeneratedCard | undefined;
    for (let index = 0; index < phase.count; index += 1) {
      let eligible = candidates;
      if (previous) {
        const distances = candidates.map(card => ({ card, count: changedSlots(previous!.derivation, card.derivation).length }));
        const single = distances.filter(entry => entry.count === 1);
        eligible = (single.length ? single : distances.filter(entry => entry.count === 2 && recipe.maxChangedSlots === 2)).map(entry => entry.card);
      } else if (cards.length) {
        // Isolate a grammar transition by keeping the preceding lexical choices
        // wherever the next construction permits them.
        const prior = cards[cards.length - 1].derivation;
        const unchangedGrammar = prior.construction === phase.construction && prior.features.tense === phase.features.tense && prior.features.polarity === phase.features.polarity && prior.features.question === phase.features.question;
        const distances = candidates.map(card => ({ card, count: changedSlots(prior, card.derivation).length }))
          .filter(entry => !unchangedGrammar || (entry.count >= 1 && entry.count <= recipe.maxChangedSlots));
        const smallest = distances.reduce((minimum, entry) => Math.min(minimum, entry.count), Infinity);
        eligible = distances.filter(entry => entry.count === smallest).map(entry => entry.card);
      }
      if (!eligible.length) throw new GenerationError("NO_NEIGHBOR", `${phase.id} cannot make the next ${recipe.maxChangedSlots}-slot substitution; expand the pool or shorten this phase`, { phaseId: phase.id, cardIndex: index });
      // Prefer unmet target exposure, then balanced target coverage, then less repeated
      // sentences. A seed decides equal scores without a predictable slot cycle.
      const score = (card: GeneratedCard) => card.senseIds.reduce((total, id) => total + (recipe.targetSenseIds.includes(id) ? Math.max(0, exposureFloor(recipe, id) - coverage[id]) * 1000 + 100 / (1 + coverage[id]) : 0), 0) - (counts.get(card) ?? 0) * 10 - (Object.values(card.derivation.bindings).length - new Set(Object.values(card.derivation.bindings)).size) * 5;
      let best = -Infinity;
      let tied: GeneratedCard[] = [];
      for (const candidate of eligible) {
        const candidateScore = score(candidate);
        if (candidateScore > best) { best = candidateScore; tied = [candidate]; }
        else if (candidateScore === best) tied.push(candidate);
      }
      const selected = tied[Math.floor(random() * tied.length)];
      const prior = cards[cards.length - 1];
      transitions.push({ kind: index === 0 ? cards.length ? "phase" : "start" : "substitution", changedSlots: prior ? changedSlots(prior.derivation, selected.derivation) : [], phaseId: phase.id });
      const card = clone(selected);
      card.id = sentenceId(card, lexicon.version);
      cards.push(card);
      for (const id of card.senseIds) coverage[id] += 1;
      for (const wordId of new Set(card.tokens.flatMap(token => token.wordId ? [token.wordId] : []))) wordCoverage[wordId] += 1;
      counts.set(selected, (counts.get(selected) ?? 0) + 1);
      previous = selected;
    }
  }
  const missing = recipe.targetSenseIds.filter(id => coverage[id] < exposureFloor(recipe, id));
  if (missing.length) throw new GenerationError("COVERAGE_SHORTFALL", `This plan did not reach the requested exposure floor for: ${missing.join(", ")}. Adjust phases, length, or pool.`, { missing, coverage, required: recipe.minTargetExposures });
  return { schemaVersion: 1, engineVersion: ENGINE_VERSION, lexiconVersion: lexicon.version, seed, recipe: clone(recipe), cards, transitions, coverage, wordCoverage };
}

/** Review/custom adapters resolve existing word IDs to explicitly reviewed senses. */
export function resolveWordPool(wordIds: string[], lexicon: Lexicon): string[] {
  validateLexicon(lexicon);
  assertUnique(wordIds, "Selected word IDs");
  return wordIds.map(wordId => {
    const senses = lexicon.entries.filter(entry => entry.wordId === wordId);
    if (senses.length !== 1) throw new GenerationError(senses.length ? "AMBIGUOUS_WORD" : "UNKNOWN_WORD", `${wordId}: ${senses.length ? "select an explicit sense" : "reviewed grammar metadata is not available"}`, { wordId, senses: senses.map(entry => entry.id) });
    return senses[0].id;
  });
}

/** Only individual lexical tokens. A caller must not fall back to sentence TTS. */
export function wordAudioPlan(card: GeneratedCard): WordAudio[] {
  return card.tokens.flatMap((token, tokenIndex) => {
    if (!token.wordId) return [];
    const speech = token.audioText ?? token.reading;
    return [{ tokenIndex, wordId: token.wordId, surface: token.surface, reading: token.reading, speech, cacheKey: `${token.surface}|${token.reading}|${speech}`, ...(token.audioRef ? { audioRef: token.audioRef } : {}) }];
  });
}
