import { wordBindings } from "../../../packages/dictionary";
import { lessonConceptId } from "./lesson-vocabulary";
import type { ActiveSession, PracticeCard } from "./types";

export type WordGroup = { start: number; end: number };
export type LessonWordAudit = {
  id: string; wordId?: string; forms: string[]; reading: string; meaning: string;
  role: string; positions: number[]; occurrences: number; coreCards: number;
  reviewCards: number; groups: WordGroup[]; gaps: number[];
};

const authoredGrammar = new Set(Object.values(wordBindings)
  .filter(binding => typeof binding.introducedInUnit !== "number")
  .flatMap(binding => [binding.reading, binding.audioText].filter(Boolean)
    .map(reading => JSON.stringify([binding.surface, reading]))));

/** A group is a maximal run of consecutive card positions containing a word.
 * Multiple tokens in one card count as one card; review section boundaries do
 * not create gaps. Use saved creation roles, never today's learned-word state. */
export function auditLessonWords(cards: readonly PracticeCard[], session?: ActiveSession): LessonWordAudit[] {
  const targets = new Set((session?.targetWordIds ?? []).map(lessonConceptId));
  const newWords = new Set((session?.lessonPlan?.newWordIds ?? []).map(lessonConceptId));
  const helpers = new Set((session?.lessonPlan?.helperWordIds ?? []).map(lessonConceptId));
  const rows = new Map<string, LessonWordAudit>();
  const targetRole = (id: string) => !session?.lessonPlan ? "Target · prior status unrecorded" : newWords.has(id) ? "New target" : "Existing target";
  for (const wordId of session?.targetWordIds ?? []) {
    const id = lessonConceptId(wordId);
    if (!rows.has(id)) rows.set(id, { id, wordId, forms: [], reading: "", meaning: "", role: targetRole(id), positions: [], occurrences: 0, coreCards: 0, reviewCards: 0, groups: [], gaps: [] });
  }
  cards.forEach((card, index) => {
    const position = index + 1;
    const review = !!session?.items[index]?.section && session.items[index].section !== "lesson";
    for (const token of card.tokens) {
      if (!token.surface.trim() || /^[\p{P}\p{Z}\s]+$/u.test(token.surface)) continue;
      const id = token.wordId ? lessonConceptId(token.wordId) : `form:${JSON.stringify([token.surface, token.reading])}`;
      let row = rows.get(id);
      if (!row) {
        const grammar = authoredGrammar.has(JSON.stringify([token.surface, token.reading]))
          && (!token.wordId || typeof wordBindings[token.wordId]?.introducedInUnit !== "number");
        row = { id, wordId: token.wordId, forms: [], reading: token.reading, meaning: token.explain,
          role: targets.has(id) ? targetRole(id) : grammar ? "Authored grammar" : helpers.has(id) ? "Practiced helper · saved plan" : "Supporting word · prior status unrecorded",
          positions: [], occurrences: 0, coreCards: 0, reviewCards: 0, groups: [], gaps: [] };
        rows.set(id, row);
      }
      if (!row.forms.includes(token.surface)) row.forms.push(token.surface);
      row.reading ||= token.reading;
      row.meaning ||= token.explain;
      row.occurrences++;
      if (row.positions.at(-1) === position) continue;
      row.positions.push(position);
      if (review) row.reviewCards++; else row.coreCards++;
      const last = row.groups.at(-1);
      if (last && last.end === position - 1) last.end = position;
      else {
        if (last) row.gaps.push(position - last.end - 1);
        row.groups.push({ start: position, end: position });
      }
    }
  });
  for (const row of rows.values()) {
    if (!targets.has(row.id) && row.role === "Supporting word · prior status unrecorded" && !row.coreCards && row.reviewCards) row.role = "Review vocabulary · copied card";
  }
  return [...rows.values()];
}

export const wordGroupRanges = (groups: WordGroup[]) => groups.map(group => group.start === group.end ? String(group.start) : `${group.start}–${group.end}`).join(", ");
