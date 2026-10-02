import { GenerationError, type SessionSnapshot } from "../../../packages/learning-engine";
import { builderLexicon, builderRecipes, compatibleSenses, generateLesson } from "./generated";
import type { LibraryReviewRequest } from "./types";

export type QuickReviewPlan = {
  snapshot: SessionSnapshot;
  includedWordIds: string[];
  excludedWordIds: string[];
};

/** A bounded review of explicit requested words. Callers must disclose exclusions.
 * The materialized snapshot preserves the resulting words and sequence on resume. */
export function buildQuickReview(request: LibraryReviewRequest, seed = Date.now() >>> 0): QuickReviewPlan | undefined {
  if (!Number.isInteger(request.count) || request.count < 6 || request.count > 120) return undefined;
  const requested = [...new Set(request.wordIds)];
  const candidates = requested.flatMap((wordId, priority) => {
    const senses = builderLexicon.entries.filter(entry => entry.wordId === wordId);
    return senses.length === 1 ? [{ wordId, senseId: senses[0].id, priority }] : [];
  });
  const targetLimit = Math.max(1, Math.min(6, Math.floor(request.count / 3)));
  const templates = Object.entries(builderRecipes).map(([key, recipe]) => {
    const permitted = new Set(compatibleSenses(key, recipe.level ?? "A1"));
    const words = candidates.filter(candidate => permitted.has(candidate.senseId)).slice(0, targetLimit);
    return { key, recipe, words };
  }).filter(template => template.words.length).sort((a, b) =>
    b.words.length - a.words.length ||
    a.words.reduce((sum, word) => sum + word.priority, 0) - b.words.reduce((sum, word) => sum + word.priority, 0));

  // Try every template at a given size before reducing the number of targets.
  // Small decks cannot guarantee useful repetition for an entire word library.
  for (let size = targetLimit; size > 0; size -= 1) {
    for (const template of templates) {
      if (template.words.length < size) continue;
      const targets = template.words.slice(0, size);
      try {
        const snapshot = generateLesson(template.key, targets.map(word => word.senseId), seed, true, {
          level: template.recipe.level ?? "A1", cardCount: request.count,
        });
        snapshot.recipe.title = request.label.trim() || `${template.recipe.title} review`;
        const includedWordIds = targets.map(word => word.wordId);
        const included = new Set(includedWordIds);
        return { snapshot, includedWordIds, excludedWordIds: requested.filter(wordId => !included.has(wordId)) };
      } catch (error) {
        if (!(error instanceof GenerationError)) throw error;
      }
    }
  }
  return undefined;
}
