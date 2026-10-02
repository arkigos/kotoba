import { dictionaryWord } from "../../../packages/dictionary";
import { learningGrammar, learningGrammarCandidates, type LearningGrammarId } from "../../../packages/learning-engine/learning-grammar";
import { PERSONALIZED_ENGINE_VERSION } from "../../../packages/learning-engine/personalized";
import { assertLessonVocabulary, knownLessonWords } from "./lesson-vocabulary";
import { appendSentenceReviews } from "./sentence-review";
import { uniqueContextCards, assertLessonCardQuality } from "./lesson-card-quality";
import type { ActiveSession, LearnerState } from "./types";

export function grammarWordChoices(state: LearnerState, id: LearningGrammarId) {
  const grammar = learningGrammar.find(row => row.id === id)!;
  // Grammar vocabulary is explicitly authored; scheduled review is appended as
  // previously consumed whole cards, independently of this selection.
  return { selected: [...grammar.defaults], choices: [...grammar.defaults] };
}

export function buildGrammarLesson(state: LearnerState, id: LearningGrammarId, requested?: string[]): ActiveSession {
  const grammar = learningGrammar.find(row => row.id === id);
  if (!grammar) throw new Error("Choose an available grammar lesson.");
  const wordIds = [...new Set(requested ?? grammarWordChoices(state, id).selected)];
  if (wordIds.length < 2 || wordIds.length > 12) throw new Error("Choose 2–12 words that work with this pattern.");
  if (id === "want-object" && !wordIds.includes("hoshii") && !knownLessonWords(state).has("hoshii")) throw new Error("Add ほしい to the selected words for this lesson.");
  // Grammar lessons focus their examples on the displayed selection. Practiced
  // helpers are allowed only if actually needed for the explicit pattern.
  const available = new Set(wordIds);
  if (id === "want-object" && knownLessonWords(state).has("hoshii")) available.add("hoshii");
  const candidates = uniqueContextCards(learningGrammarCandidates(available, new Set([id])).map(card=>({card}))).map(row=>row.card);
  const missing = wordIds.filter(word => !candidates.some(card => card.tokens.some(token => token.wordId === word)));
  if (missing.length) throw new Error(`These words need a matching action or object: ${missing.map(word => dictionaryWord(word)?.surface ?? word).join("、")}. Adjust the selection.`);
  if (candidates.length < 6) throw new Error("Add another compatible word pair for varied grammar practice.");
  const counts: Record<string, number> = Object.fromEntries(wordIds.map(word => [word, 0]));
  const uses = new Map<string, number>();
  const cards: typeof candidates = [];
  const length = Math.min(24, candidates.length);
  for (let index = 0; index < length; index++) {
    const phase = index < 6 ? "positive" : index < 12 ? "negative" : index < 18 ? "question" : ["positive", "negative", "question"][index % 3];
    const remaining = candidates.filter(card => !uses.has(card.id));
    const phased = remaining.filter(card => card.constructionKey?.endsWith(phase));
    const pool = phased.length ? phased : remaining;
    const score = (card: typeof candidates[number]) => card.tokens.reduce((sum, token) => sum + (token.wordId && token.wordId !== "hoshii" ? 30 / (1 + (counts[token.wordId] ?? 0)) : 0), 0) - (uses.get(card.id) ?? 0) * 4 - (cards.at(-1)?.id === card.id ? 100 : 0);
    const card = [...pool].sort((a, b) => score(b) - score(a))[0];
    cards.push(card); uses.set(card.id, (uses.get(card.id) ?? 0) + 1);
    for (const token of card.tokens) if (token.wordId && token.wordId in counts) counts[token.wordId]++;
  }
  assertLessonCardQuality(cards);
  assertLessonVocabulary(cards, wordIds, state);
  const known = knownLessonWords(state);
  const session: ActiveSession = { id: `grammar-${crypto.randomUUID()}`, grammarLessonId: id, source: "vocabulary", title: grammar.title,
    targetWordIds: wordIds, savedCards: structuredClone(cards), startedAt: new Date().toISOString(), length: "standard", mode: state.settings.lessonMode,
    cursor: 0, scores: [], practicedIndices: [], items: cards.map(card => ({ cardId: card.id, prompt: "explore", reason: grammar.pattern })),
    lessonPlan: { version: 1, engineVersion: PERSONALIZED_ENGINE_VERSION, cardCount: cards.length, appearances: counts,
      helperWordIds: [...available].filter(word => !wordIds.includes(word)), newWordIds: wordIds.filter(word => !known.has(word)), reviewWordIds: wordIds.filter(word => known.has(word)),
      grammarReview: { requested: [id], practiced: [id], deferred: [] } } };
  return appendSentenceReviews(state, session);
}
