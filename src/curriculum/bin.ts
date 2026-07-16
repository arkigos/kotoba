function isPreludeUnitId(unitId: number) {
  return unitId >= 100;
}

export function reviewVocabularyUnitIds(unitId: number): number[] {
  if (isPreludeUnitId(unitId)) return [];
  const units: number[] = [];
  for (let offset = 2; unitId - offset >= 1; offset *= 2) {
    units.push(unitId - offset);
  }
  return units;
}

export function knownVocabularyUnitIds(unitId: number): number[] {
  if (isPreludeUnitId(unitId)) return [unitId];
  return Array.from({ length: unitId }, (_, index) => index + 1);
}

export function lexiconVocabularyUnitIds(unitId: number): number[] {
  if (isPreludeUnitId(unitId)) return [];
  const reviewDue = new Set(reviewVocabularyUnitIds(unitId));
  return Array.from({ length: Math.max(0, unitId - 1) }, (_, index) => index + 1).filter((knownUnitId) => !reviewDue.has(knownUnitId));
}

export const helperVocabularyUnitIds = knownVocabularyUnitIds;

export function vocabularyPoolsForUnit(unitId: number) {
  return {
    current: [unitId],
    reviewDue: reviewVocabularyUnitIds(unitId),
    lexicon: lexiconVocabularyUnitIds(unitId),
    helpers: helperVocabularyUnitIds(unitId),
  };
}
