import { GenerationError, proficiencyLevels, type ConstructionId, type GeneratedCard, type GrammarId, type Lexeme, type ProficiencyLevel, type Recipe } from "./types";

// Authored instructional ceilings. Higher ceilings permit simpler material;
// they do not manufacture support for constructions absent from the registry.
export const levelPolicies: Record<ProficiencyLevel, { maxContentWords: number; maxClauses: number; maxClauseDepth: number }> = {
  A1: { maxContentWords: 4, maxClauses: 1, maxClauseDepth: 0 },
  A2: { maxContentWords: 6, maxClauses: 2, maxClauseDepth: 1 },
  B1: { maxContentWords: 9, maxClauses: 3, maxClauseDepth: 1 },
  B2: { maxContentWords: 12, maxClauses: 4, maxClauseDepth: 2 },
  C1: { maxContentWords: 16, maxClauses: 5, maxClauseDepth: 3 },
  C2: { maxContentWords: 20, maxClauses: 6, maxClauseDepth: 3 },
};
export const constructionComplexity: Record<ConstructionId, { level: ProficiencyLevel; clauses: number; depth: number }> = {
  identity: { level: "A1", clauses: 1, depth: 0 },
  "i-predicate": { level: "A1", clauses: 1, depth: 0 },
  "na-predicate": { level: "A1", clauses: 1, depth: 0 },
  action: { level: "A1", clauses: 1, depth: 0 },
  motion: { level: "A1", clauses: 1, depth: 0 },
  existence: { level: "A1", clauses: 1, depth: 0 },
};
export const grammarLevels: Record<GrammarId, ProficiencyLevel> = {
  "topic-wa": "A1", "copula-polite": "A1", "i-adjective": "A1", "na-adjective": "A1",
  "object-wo": "A1", "destination-ni": "A1", existence: "A1", "verb-polite": "A1",
  past: "A1", negative: "A1", "question-ka": "A1",
};
export function withinLevel(level: ProficiencyLevel | undefined, ceiling: ProficiencyLevel) {
  return level !== undefined && proficiencyLevels.includes(level) && proficiencyLevels.indexOf(level) <= proficiencyLevels.indexOf(ceiling);
}
export function validateLevelPool(recipe: Recipe, pool: Lexeme[]) {
  if (recipe.level === undefined) return; // Legacy recipes remain readable; new app recipes always declare a level.
  if (!proficiencyLevels.includes(recipe.level)) throw new GenerationError("INVALID_LEVEL", "Choose a supported lesson level.");
  const disallowed = pool.filter(entry => !withinLevel(entry.level, recipe.level!));
  if (disallowed.length) throw new GenerationError("WORD_LEVEL", "Words need reviewed placement within the lesson's level.", { wordIds: disallowed.map(entry => entry.wordId) });
}
export function validateCardLevel(card: GeneratedCard, level: ProficiencyLevel | undefined) {
  if (level === undefined) return;
  const policy = levelPolicies[level];
  const construction = constructionComplexity[card.derivation.construction];
  if (!policy || !construction || !withinLevel(construction.level, level) ||
    card.grammarTags.some(id => !withinLevel(grammarLevels[id as GrammarId], level)) ||
    card.tokens.filter(token => token.wordId).length > policy.maxContentWords ||
    construction.clauses > policy.maxClauses || construction.depth > policy.maxClauseDepth) {
    throw new GenerationError("GRAMMAR_LEVEL", "This sentence exceeds the lesson's grammar or complexity limits.");
  }
}
