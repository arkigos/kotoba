import type {
  AttemptGrade,
  LearnerState,
  UnitProgress,
  WordHistory,
  WordInteractionKind,
  WordRating,
} from "./types";
import { migrateExpandedCourses } from "./expanded-course";
import { decodeStoredState, serializeStoredState } from "./storage-codec";

export const stateKey = "kotoba.next.state.v3";
const previousStateKey = "kotoba.next.state.v2";
const legacyKey = "kotoba.progress.v1";
let storageMessage = "";
type RecoveryState = LearnerState & { _storageRecovery?: { kind: "materialized-cards"; original: string; message: string } };
export const stateStorageMessage = () => storageMessage || "Browser storage is full or unavailable. Recent changes are only in memory.";

export function localDay(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const defaultSettings = {
  theme: "light" as const,
  scriptSupport: "adaptive" as const,
  autoplay: true,
  sound: true,
  haptics: true,
  quietMode: false,
  dailyMinutes: 10,
  lessonMode: "reading" as const,
  japaneseDisplay: "surface" as const,
  lessonDefaultFace: "japanese" as const,
  audioLanguage: "japanese" as const,
  autoAdvance: false,
  autoAdvanceOrder: "sequential" as const,
  autoAdvanceDelayMs: 5000,
};

function freshState(): LearnerState {
  return {
    version: 3,
    displayName: "Learner",
    joinedAt: new Date().toISOString(),
    onboardingComplete: false,
    currentUnitId: 1,
    completedUnits: [],
    unitProgress: { "1": { exposure: 0, mastery: 0, lastCardIndex: 0 } },
    savedWordIds: [],
    savedSentenceIds: [],
    xp: 0,
    practiceDays: [],
    attempts: [],
    wordHistory: {},
    settings: defaultSettings,
  };
}

type PreviousState = Omit<LearnerState, "version" | "wordHistory"> & { version: 2 };

function mergeProgress(seed: UnitProgress | undefined, previous: UnitProgress | undefined): UnitProgress | undefined {
  if (!seed) return previous;
  if (!previous) return seed;
  return {
    exposure: Math.max(seed.exposure, previous.exposure),
    mastery: Math.max(seed.mastery, previous.mastery),
    lastCardIndex: Math.max(seed.lastCardIndex, previous.lastCardIndex),
    lastStudiedAt: previous.lastStudiedAt ?? seed.lastStudiedAt,
  };
}

function migratePrevious(previous: PreviousState): LearnerState {
  const seed = freshState();
  const unitIds = new Set([...Object.keys(seed.unitProgress), ...Object.keys(previous.unitProgress ?? {})]);
  const unitProgress: Record<string, UnitProgress> = {};
  for (const id of unitIds) {
    const progress = mergeProgress(seed.unitProgress[id], previous.unitProgress?.[id]);
    if (progress) unitProgress[id] = progress;
  }
  return {
    ...seed,
    displayName: previous.displayName ?? seed.displayName,
    onboardingComplete: true,
    currentUnitId: Math.max(1, previous.currentUnitId ?? 1),
    completedUnits: [...new Set(previous.completedUnits ?? [])].sort((a, b) => a - b),
    unitProgress,
    savedWordIds: [...new Set([...seed.savedWordIds, ...(previous.savedWordIds ?? [])])],
    savedSentenceIds: previous.savedSentenceIds ?? [],
    xp: Math.max(seed.xp, previous.xp ?? 0),
    practiceDays: [...new Set([...seed.practiceDays, ...(previous.practiceDays ?? [])])].sort(),
    attempts: previous.attempts?.length ? previous.attempts : seed.attempts,
    activeSession: previous.activeSession,
    settings: { ...defaultSettings, ...previous.settings },
  };
}

function migrateLegacy(base: LearnerState): LearnerState {
  try {
    const raw = localStorage.getItem(legacyKey);
    if (!raw) return base;
    const legacy = JSON.parse(raw) as {
      unitId?: number;
      cardIndex?: number;
      cardPositions?: Record<string, number>;
      completedUnits?: number[];
      settings?: { theme?: "light" | "dark"; autoPlayAudio?: boolean };
    };
    const currentUnitId = Math.max(1, typeof legacy.unitId === "number" ? legacy.unitId : 1);
    const positions = legacy.cardPositions ?? { [String(currentUnitId)]: legacy.cardIndex ?? 0 };
    const unitProgress: Record<string, UnitProgress> = { ...base.unitProgress };
    for (const [id, index] of Object.entries(positions)) {
      const previous = unitProgress[id];
      unitProgress[id] = {
        exposure: Math.max(previous?.exposure ?? 0, Math.min(1, Math.max(0, index / 80))),
        mastery: previous?.mastery ?? 0,
        lastCardIndex: Math.max(previous?.lastCardIndex ?? 0, index),
        lastStudiedAt: previous?.lastStudiedAt,
      };
    }
    return {
      ...base,
      currentUnitId,
      completedUnits: [...new Set(legacy.completedUnits ?? [])].sort((a, b) => a - b),
      unitProgress,
      xp: Math.max(base.xp, (legacy.completedUnits?.length ?? 0) * 120 + Object.values(positions).reduce((sum, value) => sum + Math.max(0, value), 0) * 4),
      settings: {
        ...base.settings,
        theme: legacy.settings?.theme === "dark" ? "dark" : "light",
        autoplay: legacy.settings?.autoPlayAudio ?? false,
      },
    };
  } catch {
    return base;
  }
}

function validState(value: unknown): value is LearnerState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LearnerState>;
  return candidate.version === 3 && typeof candidate.currentUnitId === "number" && !!candidate.settings && !!candidate.wordHistory;
}

export function readState(): LearnerState {
  storageMessage = "";
  if (typeof window === "undefined") return migrateExpandedCourses(freshState());
  try {
    const original = localStorage.getItem(stateKey) ?? "null";
    const parsed = JSON.parse(original) as unknown;
    if (validState(parsed)) {
      const decoded = decodeStoredState(parsed);
      const hydrated = decoded.value as LearnerState;
      if (decoded.errors.length) storageMessage = "Some saved lesson cards could not be restored. Your original data has been kept and saving is paused. Export the original snapshot for recovery.";
      const restored: RecoveryState = { ...hydrated, settings: { ...defaultSettings, ...hydrated.settings },
        lessonHistory: hydrated.lessonHistory?.map(lesson => lesson.savedAt && !["topic", "vocabulary"].includes(lesson.session.source ?? "") && (lesson.session.source !== "generated" || lesson.session.snapshot?.engineVersion === "saved-replay") ? { ...lesson, savedAt: undefined } : lesson),
        ...(decoded.errors.length ? { _storageRecovery: { kind: "materialized-cards" as const, original, message: storageMessage } } : {}),
      };
      return migrateExpandedCourses(restored);
    }
  } catch {
    // A damaged local snapshot should never stop the learner from opening Kotoba.
  }
  try {
    const previous = JSON.parse(localStorage.getItem(previousStateKey) ?? "null") as PreviousState | null;
    if (previous?.version === 2) return migrateExpandedCourses(migratePrevious(previous));
  } catch {
    // Fall through to the older prototype migration or a fresh local profile.
  }
  return migrateExpandedCourses(migrateLegacy(freshState()));
}

export function touchWordHistory(
  state: LearnerState,
  input: {
    wordIds: string[];
    unitId?: number;
    recipeId?: string;
    kind: WordInteractionKind;
    at?: string;
    correct?: boolean;
    grade?: AttemptGrade;
    rating?: WordRating;
  },
) {
  const next = { ...state.wordHistory };
  const at = input.at ?? new Date().toISOString();
  for (const wordId of new Set(input.wordIds.filter(Boolean))) {
    const previous = next[wordId];
    const autoRating: WordRating | undefined =
      input.grade === "again" || input.grade === "hard" ? "hard" : input.grade === "easy" ? "easy" : undefined;
    next[wordId] = {
      ...previous,
      wordId,
      unitIds: [...new Set([...(previous?.unitIds ?? []), ...(input.unitId === undefined ? [] : [input.unitId])])].sort((a, b) => a - b),
      ...(input.recipeId || previous?.recipeIds ? { recipeIds: [...new Set([...(previous?.recipeIds ?? []), ...(input.recipeId ? [input.recipeId] : [])])] } : {}),
      firstSeenAt: previous?.firstSeenAt ?? at,
      lastSeenAt: at,
      encounters: (previous?.encounters ?? 0) + 1,
      correct: (previous?.correct ?? 0) + (input.correct === true ? 1 : 0),
      misses: (previous?.misses ?? 0) + (input.correct === false ? 1 : 0),
      rating: input.rating ?? autoRating ?? previous?.rating ?? "learning",
      interactionKinds: [...new Set([...(previous?.interactionKinds ?? []), input.kind])],
      // Freeze legacy recency before detail views update lastSeenAt. Only card
      // practice advances this anchor through recordWordPractice.
      review: previous?.review ?? { lastPracticedAt: previous?.lastSeenAt ?? at, occasions: 0 },
    };
  }
  return next;
}

export function rateWordHistory(state: LearnerState, wordId: string, rating: WordRating) {
  const previous = state.wordHistory[wordId];
  if (!previous) return state.wordHistory;
  return { ...state.wordHistory, [wordId]: { ...previous, rating } };
}

export function writeState(state: LearnerState) {
  const recovery = (state as RecoveryState)._storageRecovery;
  if (recovery?.kind === "materialized-cards") { storageMessage = recovery.message; return false; }
  try { localStorage.setItem(stateKey, serializeStoredState(state)); storageMessage = ""; return true; }
  catch { storageMessage = "Browser storage is full or unavailable. Recent changes are only in memory."; return false; }
}

/** Replace the entire profile so no lesson, grammar, or review state survives.
 * Remove migration sources too, otherwise an older profile could reappear. */
export function resetState() {
  const state = migrateExpandedCourses(freshState());
  if (!writeState(state)) throw new Error(stateStorageMessage());
  localStorage.removeItem(previousStateKey);
  localStorage.removeItem(legacyKey);
  return state;
}

export function exportState(state: LearnerState) {
  const recovery = (state as RecoveryState)._storageRecovery;
  const blob = new Blob([recovery?.original ?? JSON.stringify(state, null, 2)], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `${recovery ? "kotoba-recovery" : "kotoba-progress"}-${localDay()}.json`;
  link.click();
  URL.revokeObjectURL(href);
}

export function daysBack(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return localDay(date);
  });
}
