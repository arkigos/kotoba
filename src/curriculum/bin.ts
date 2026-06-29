export function reviewVocabularyUnitIds(unitId: number): number[] {
  const units: number[] = [];
  for (let offset = 2; unitId - offset >= 1; offset *= 2) {
    units.push(unitId - offset);
  }
  return units;
}

export function knownVocabularyUnitIds(unitId: number): number[] {
  return Array.from({ length: unitId }, (_, index) => index + 1);
}

export const helperVocabularyUnitIds = knownVocabularyUnitIds;

export function vocabularyPoolsForUnit(unitId: number) {
  return {
    current: [unitId],
    reviewDue: reviewVocabularyUnitIds(unitId),
    helpers: helperVocabularyUnitIds(unitId),
  };
}
