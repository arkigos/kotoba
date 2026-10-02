import { useMemo } from "react";
import { wordById } from "./curriculum";
import { auditLessonWords, wordGroupRanges } from "./lesson-word-audit";
import type { ActiveSession, PracticeCard } from "./types";

export function LessonWordAudit({ cards, session }: { cards: PracticeCard[]; session?: ActiveSession }) {
  const rows = useMemo(() => auditLessonWords(cards, session), [cards, session]);
  const reviewSources = [...new Set((session?.items ?? []).flatMap(item => item.reviewSource ? [item.reviewSource.title ?? item.reviewSource.lessonId] : []))];
  return <details className="explorer-vocabulary explorer-word-audit" aria-label="Word use and groups">
    <summary>Word use and groups<span>{rows.length} words and forms · complete saved sequence</span></summary>
    <p>Uses counts cards containing the word. A group is consecutive cards containing it; gaps are the numbers of cards without it between groups. Repeated tokens within one card do not add a group. Counts cover the complete saved sequence, including review cards, regardless of browse filters or how many cards you have practiced.</p>
    <p>Roles come from the saved lesson plan, not your current word history. Grammar is listed separately from lexical targets. Missing provenance is marked unrecorded.</p>
    {session?.startedAt && <p>Lesson created: {session.startedAt}. {session.lessonPlan?.engineVersion && `Engine: ${session.lessonPlan.engineVersion}.`} {reviewSources.length > 0 && `Review source: ${reviewSources.join("; ")}.`}</p>}
    <div className="explorer-audit-scroll" role="region" aria-label="Word usage table" tabIndex={0}>
      <table><caption>All words and forms in saved card order</caption><thead><tr><th>Word / forms</th><th>Meaning / library tag</th><th>Why included</th><th>Uses</th><th>Tokens</th><th>Lesson / review</th><th>Groups</th><th>Card ranges</th><th>Gap sizes</th></tr></thead>
        <tbody>{rows.map(row => { const entry = row.wordId ? wordById(row.wordId) : undefined; const display = entry?.surface ?? row.forms[0] ?? row.id; return <tr key={row.id}><th scope="row" lang="ja">{display}{row.forms.length > 0 && row.forms.join(" / ") !== display && <small>{row.forms.join(" / ")}</small>}</th><td>{entry?.meaning ?? row.meaning}<small>{entry ? `Library tag: ${entry.function}` : row.role === "Authored grammar" ? "grammar form" : "unclassified form"}</small></td><td>{row.role}</td><td>{row.positions.length}</td><td>{row.occurrences}</td><td>{row.coreCards} / {row.reviewCards}</td><td>{row.groups.length}</td><td>{wordGroupRanges(row.groups) || "None"}</td><td>{row.gaps.join(", ") || "None"}</td></tr>; })}</tbody>
      </table>
    </div>
  </details>;
}
