import type { TopicCandidate } from "./topic-sequence";

/** Grammar swaps preserve coverage. Ordinary contexts may add a selected verb
 * within the lesson's exposure ceiling, but never drop a target or add helpers. */
export function preferGrammarPractice(chosen: TopicCandidate[], candidates: TopicCandidate[], goals: Record<string, number>, ceiling = 12): TopicCandidate[] {
  const output = [...chosen];
  const key = (card: TopicCandidate) => [...card.targets].sort().join("|");
  const uses = (candidate: TopicCandidate) => output.filter(row => row.card.id === candidate.card.id).length;
  // Availability is not a request to turn the entire vocabulary lesson into a
  // grammar drill. Leave room for ordinary contexts after the review quota.
  for (const [grammar, goal] of Object.entries(goals)) {
    let present = output.filter(row => row.card.practiceGrammar?.includes(grammar)).length;
    for (let index = output.length - 1; index >= 0 && present > goal + 2; index--) {
      if (!output[index].card.practiceGrammar?.includes(grammar)) continue;
      const alternative = candidates.filter(row => !row.card.practiceGrammar?.length && row.card.tokens.length > 1 && key(row) === key(output[index]) && !row.unknown.length)
        .sort((a, b) => uses(a) - uses(b))[0];
      if (alternative && uses(alternative) < 4) { output[index] = alternative; present--; }
    }
  }
  for (const [grammar, goal] of Object.entries(goals).sort((a, b) => b[1] - a[1])) {
    let present = output.filter(row => row.card.practiceGrammar?.includes(grammar)).length;
    const alternatives = candidates.filter(row => row.card.practiceGrammar?.includes(grammar));
    for (let step = 0; step < output.length && present < goal; step++) {
      const index = step;
      const previous = output[index];
      if (previous.card.practiceGrammar?.includes(grammar)) continue;
      if (previous.card.practiceGrammar?.some(id => output.filter(row => row.card.practiceGrammar?.includes(id)).length <= (goals[id] ?? 0))) continue;
      const options = alternatives.filter(row => key(row) === key(previous) && !row.unknown.length)
        .sort((a, b) => output.filter(row => row.card.id === a.card.id).length - output.filter(row => row.card.id === b.card.id).length);
      const replacement = options.find(row => output.filter(item => item.card.id === row.card.id).length < 3);
      if (replacement) { output[index] = replacement; present++; }
    }
  }
  // A quota of six different nouns in one positive pattern is weak grammar
  // review. Spread equivalent coverage across statements, negatives and questions.
  for (const grammar of Object.keys(goals)) {
    const frames = new Map<string, number>();
    const seen = new Map<string, number>();
    for (let index = 0; index < output.length; index++) {
      const previous = output[index];
      if (!previous.card.practiceGrammar?.includes(grammar)) continue;
      const options = candidates.filter(row => row.card.practiceGrammar?.includes(grammar) && key(row) === key(previous) && !row.unknown.length);
      options.sort((a, b) => (frames.get(a.card.constructionKey ?? "") ?? 0) - (frames.get(b.card.constructionKey ?? "") ?? 0)
        || (seen.get(a.card.id) ?? 0) - (seen.get(b.card.id) ?? 0));
      const replacement = options.find(row => (seen.get(row.card.id) ?? 0) < 3) ?? previous;
      output[index] = replacement;
      const frame = replacement.card.constructionKey ?? "";
      frames.set(frame, (frames.get(frame) ?? 0) + 1);
      seen.set(replacement.card.id, (seen.get(replacement.card.id) ?? 0) + 1);
    }
  }
  if (Object.keys(goals).length) {
    for (let index = 0; index < output.length; index++) {
      const previous = output[index];
      if (previous.card.practiceGrammar?.length || previous.card.tokens.filter(token => token.wordId).length > 1) continue;
      const alternative = candidates.filter(row => !row.card.practiceGrammar?.length && !row.unknown.length
        && previous.targets.every(id => row.targets.includes(id))
        && row.targets.filter(id => !previous.targets.includes(id)).every(id => output.filter(item => item.targets.includes(id)).length < ceiling)
        && row.card.tokens.filter(token => token.wordId).length > 1 && uses(row) < 3)
        .sort((a, b) => Number(key(a) !== key(previous)) - Number(key(b) !== key(previous)) || uses(a) - uses(b))[0];
      if (alternative) output[index] = alternative;
    }
  }
  return output;
}
