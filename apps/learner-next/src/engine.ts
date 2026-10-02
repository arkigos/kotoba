import { getUnit } from "./curriculum";
import { isPrioritized, reviewStatus } from "./review";
import type { ActiveSession, AttemptGrade, CurriculumUnit, LearnerSettings, LearnerState, LessonMode, LibraryReviewRequest, PromptKind, SessionLength } from "./types";

type CourseLessonMode = Exclude<LessonMode, "mixed">;

export const lessonPresets: Record<CourseLessonMode, { label: string; detail: string; settings: Partial<LearnerSettings> }> = {
  reading: {
    label: "Reading",
    detail: "Japanese first",
    settings: { lessonMode: "reading", lessonDefaultFace: "japanese", autoplay: true, audioLanguage: "japanese", autoAdvance: false },
  },
  listening: {
    label: "Listening",
    detail: "Audio first",
    settings: { lessonMode: "listening", lessonDefaultFace: "hidden", autoplay: true, audioLanguage: "japanese", autoAdvance: false },
  },
  recall: {
    label: "Recall",
    detail: "English first",
    settings: { lessonMode: "recall", lessonDefaultFace: "english", autoplay: false, audioLanguage: "japanese", autoAdvance: false },
  },
  rapid: {
    label: "Rapid",
    detail: "Auto advance",
    settings: { lessonMode: "rapid", lessonDefaultFace: "japanese", autoplay: true, audioLanguage: "japanese", autoAdvance: true, autoAdvanceOrder: "sequential", autoAdvanceDelayMs: 5000 },
  },
};

export function createSession(unitId: number, length: SessionLength, state: LearnerState): ActiveSession {
  const unit = getUnit(unitId);
  const savedCard = state.completedUnits.includes(unitId) ? 0 : state.unitProgress[String(unitId)]?.lastCardIndex ?? 0;
  const start = Math.min(savedCard, Math.max(0, unit.cards.length - 1));
  const items = unit.cards.map((card, index) => ({
    cardId: card.id,
    prompt: "explore" as const,
    reason: `Authored encounter ${index + 1} of ${unit.cards.length}`,
    unitId,
  }));
  return {
    id: `session-${Date.now()}`,
    unitId,
    length,
    startedAt: new Date().toISOString(),
    cursor: start,
    items,
    scores: [],
    source: "course",
    title: unit.title,
    mode: state.settings.lessonMode ?? "reading",
  };
}

const reviewPromptPattern: PromptKind[] = ["listening", "meaning", "recall", "arrange", "listening", "recall"];

export function createLibrarySession(units: CurriculumUnit[], request: LibraryReviewRequest, state: LearnerState): ActiveSession {
  const wanted = new Set(request.wordIds);
  const now = Date.now();
  const candidates = units.flatMap((unit) => unit.cards.map((card) => {
    const wordIds = [...new Set(card.tokens.map((token) => token.wordId).filter((wordId): wordId is string => !!wordId && wanted.has(wordId)))];
    const priority = wordIds.reduce((score, wordId) => {
      const history = state.wordHistory[wordId];
      if (!history) return score;
      const status = reviewStatus(history, state, now);
      return score + status.daysAgo + (status.due ? 100 : 0) + (isPrioritized(history) ? 45 : 0);
    }, 0);
    return { unitId: unit.id, card, wordIds, priority };
  })).filter((candidate) => candidate.wordIds.length > 0)
    .sort((a, b) => b.priority - a.priority || b.wordIds.length - a.wordIds.length);

  const seenCards = new Set<string>();
  const unique = candidates.filter((candidate) => {
    const key = `${candidate.card.line.join("")}\n${candidate.card.english}`;
    if (seenCards.has(key)) return false;
    seenCards.add(key);
    return true;
  });
  // Cover the selected vocabulary before spending the whole review on many
  // near-identical appearances of the single most overdue word.
  const covered = new Set<string>();
  const chosen: typeof unique = [];
  const remaining = [...unique];
  const maxPriority = Math.max(1, ...unique.map(candidate => candidate.priority));
  while (chosen.length < request.count && remaining.length) {
    let best = 0;
    let bestScore = -Infinity;
    remaining.forEach((candidate, index) => {
      const score = candidate.wordIds.filter(id => !covered.has(id)).length * 1000 + candidate.priority / maxPriority * 100;
      if (score > bestScore) { bestScore = score; best = index; }
    });
    const [candidate] = remaining.splice(best, 1);
    chosen.push(candidate);
    candidate.wordIds.forEach(id => covered.add(id));
  }
  const first = chosen[0];
  if (!first) throw new Error("No review cards match this library selection.");

  const items = chosen.map((candidate, index) => {
    const mixedPrompt = reviewPromptPattern[index % reviewPromptPattern.length];
    const candidateKind = units.find((unit) => unit.id === candidate.unitId)?.kind;
    const isSymbolCard = candidate.card.line.length === 1 && (candidateKind === "kana" || candidateKind === "kanji");
    const prompt = request.mode === "listening" ? "listening" : request.mode === "recall" ? "recall" : isSymbolCard && mixedPrompt === "arrange" ? "meaning" : mixedPrompt;
    const reason = `${request.label} · ${candidate.wordIds.some(id => isPrioritized(state.wordHistory[id])) ? "prioritized word" : "selected words"}`;
    return { cardId: candidate.card.id, unitId: candidate.unitId, prompt, reason };
  });

  const length: SessionLength = items.length <= 6 ? "quick" : items.length <= 10 ? "standard" : "deep";
  return {
    id: `library-${Date.now()}`,
    unitId: first.unitId,
    length,
    startedAt: new Date().toISOString(),
    cursor: 0,
    items,
    scores: [],
    source: "library",
    title: request.label,
    mode: request.mode === "mixed" ? "mixed" : request.mode,
  };
}

export function gradeFromResult(correct: boolean, usedHint: boolean): AttemptGrade {
  if (!correct) return "again";
  return usedHint ? "hard" : "good";
}

export function gradeWeight(grade: AttemptGrade) {
  if (grade === "again") return 0;
  if (grade === "hard") return 0.45;
  if (grade === "easy") return 1;
  return 0.78;
}

