import type { AttemptEvent, LearnerState, PromptKind, WordHistory, WordRating } from "../src/types";
import { daysBack, readState } from "../src/state";

// Explicit sample data for tests; never seeded into the application.
function isoDaysAgo(days: number, hour = 18) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

const demoUnits = [
  {
    unitId: 1,
    first: 76,
    ids: ["watashi", "anata", "gakusei", "sensei", "nihongo", "eigo", "hiragana", "katakana", "kanji", "yomu", "kaku", "wakaru"],
    last: [3, 18, 7, 24, 4, 34, 12, 28, 43, 21, 39, 31],
    hard: ["kanji", "kaku", "wakaru"],
    easy: ["watashi", "anata", "gakusei", "nihongo"],
  },
  {
    unitId: 2,
    first: 48,
    ids: ["kuni", "nihon", "oosutoraria", "supein", "tai", "firipin", "roshia", "kaishain", "enjinia", "shufu", "hataraku", "sumu"],
    last: [8, 5, 29, 22, 15, 25, 18, 33, 13, 19, 27, 11],
    hard: ["oosutoraria", "kaishain", "hataraku"],
    easy: ["kuni", "nihon"],
  },
  {
    unitId: 3,
    first: 28,
    ids: ["kazoku", "chichi", "haha", "ani", "ane", "otouto", "imouto", "kodomo", "tomodachi", "hito", "au", "hanasu"],
    last: [2, 6, 5, 9, 12, 14, 10, 7, 1, 4, 8, 11],
    hard: ["ane", "otouto", "hanasu"],
    easy: ["kazoku", "tomodachi"],
  },
] as const;

function demoWordHistory(): Record<string, WordHistory> {
  const history: Record<string, WordHistory> = {};
  for (const unit of demoUnits) {
    unit.ids.forEach((wordId, index) => {
      const rating: WordRating = unit.hard.includes(wordId as never)
        ? "hard"
        : unit.easy.includes(wordId as never)
          ? "easy"
          : "learning";
      const encounters = Math.max(3, 18 - index + unit.unitId * 2);
      const misses = rating === "hard" ? Math.ceil(encounters * 0.38) : rating === "easy" ? 1 : Math.ceil(encounters * 0.2);
      history[wordId] = {
        wordId,
        unitIds: [unit.unitId],
        firstSeenAt: isoDaysAgo(unit.first - Math.min(index, 5)),
        lastSeenAt: isoDaysAgo(unit.last[index]),
        encounters,
        correct: encounters - misses,
        misses,
        rating,
        interactionKinds:
          index % 3 === 0
            ? ["reading", "listening", "recall", "token"]
            : index % 3 === 1
              ? ["reading", "arrange", "listening"]
              : ["reading", "recall"],
      };
    });
  }
  for (const wordId of ["kanji", "chichi", "hataraku"]) {
    history[wordId].interactionKinds = [...history[wordId].interactionKinds, "saved"];
  }
  return history;
}

function demoAttempts(): AttemptEvent[] {
  const prompts: PromptKind[] = ["meaning", "listening", "arrange", "recall"];
  return Array.from({ length: 26 }, (_, index) => {
    const unitId = index < 10 ? 1 : index < 19 ? 2 : 3;
    const cardNumber = index % 8 + 1;
    const correct = ![3, 8, 12, 17, 21, 24].includes(index);
    return {
      id: `demo-attempt-${index + 1}`,
      at: isoDaysAgo(39 - index, 17 + index % 3),
      unitId,
      cardId: `u${String(unitId).padStart(3, "0")}-c${String(cardNumber).padStart(3, "0")}`,
      prompt: prompts[index % prompts.length],
      grade: correct ? index % 7 === 0 ? "easy" : "good" : "again",
      correct,
      elapsedMs: 2600 + index * 137,
    };
  });
}

export function practiceFixture(): LearnerState {
  return {
    version: 3,
    displayName: "Learner",
    joinedAt: isoDaysAgo(78, 10),
    onboardingComplete: true,
    currentUnitId: 3,
    completedUnits: [1, 2],
    unitProgress: {
      "1": { exposure: 1, mastery: 0.82, lastCardIndex: 38, lastStudiedAt: isoDaysAgo(3) },
      "2": { exposure: 1, mastery: 0.67, lastCardIndex: 32, lastStudiedAt: isoDaysAgo(8) },
      "3": { exposure: 0.34, mastery: 0.29, lastCardIndex: 11, lastStudiedAt: isoDaysAgo(1) },
    },
    savedWordIds: ["kanji", "chichi", "hataraku"],
    savedSentenceIds: [],
    xp: 2380,
    practiceDays: daysBack(35).filter((_, index) => ![2, 6, 13, 14, 21, 29].includes(index)),
    attempts: demoAttempts(),
    wordHistory: demoWordHistory(),
    settings: readState().settings,
  };
}

