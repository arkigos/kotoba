import type { PracticeSettings, Progress } from "./types";

const key = "kotoba.progress.v1";

export const defaultSettings: PracticeSettings = {
  defaultDisplay: "japanese",
  japaneseDisplay: "surface",
  autoPlayAudio: true,
  audioLanguage: "japanese",
  autoAdvance: false,
  autoAdvanceOrder: "sequential",
  autoAdvanceDelayMs: 5000,
  theme: "light",
};

export const defaultProgress: Progress = {
  unitId: 1,
  cardIndex: 0,
  cardPositions: { "1": 0 },
  cardCounts: {},
  completedUnits: [],
  settings: defaultSettings,
};

function numberOrDefault(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function cleanCardPositions(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([unitId, cardIndex]) => /^\d+$/.test(unitId) && typeof cardIndex === "number" && Number.isFinite(cardIndex))
      .map(([unitId, cardIndex]) => [unitId, Math.max(0, Math.floor(cardIndex as number))])
  );
}

function cleanCardCounts(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([unitId, cardCount]) => /^\d+$/.test(unitId) && typeof cardCount === "number" && Number.isFinite(cardCount) && cardCount > 0)
      .map(([unitId, cardCount]) => [unitId, Math.max(1, Math.floor(cardCount as number))])
  );
}

type LegacySettings = Partial<PracticeSettings> & {
  cardFront?: unknown;
  showPromptText?: unknown;
};

function cleanSettings(value: unknown, oldShowJapanese: unknown): PracticeSettings {
  const partial = value && typeof value === "object" && !Array.isArray(value) ? (value as LegacySettings) : {};
  const migratedDefaultDisplay =
    partial.defaultDisplay === "japanese" || partial.defaultDisplay === "english" || partial.defaultDisplay === "hidden"
      ? partial.defaultDisplay
      : partial.showPromptText === false
        ? "hidden"
        : partial.cardFront === "english" || oldShowJapanese === false
          ? "english"
          : defaultSettings.defaultDisplay;
  const autoAdvanceDelayMs = Math.min(30000, Math.max(2000, numberOrDefault(partial.autoAdvanceDelayMs, defaultSettings.autoAdvanceDelayMs)));
  const audioLanguage =
    partial.audioLanguage === "english" || partial.audioLanguage === "same" || partial.audioLanguage === "opposite" || partial.audioLanguage === "japanese"
      ? partial.audioLanguage
      : defaultSettings.audioLanguage;

  return {
    defaultDisplay: migratedDefaultDisplay,
    japaneseDisplay:
      partial.japaneseDisplay === "kana" || partial.japaneseDisplay === "romaji" || partial.japaneseDisplay === "surface"
        ? partial.japaneseDisplay
        : defaultSettings.japaneseDisplay,
    autoPlayAudio: typeof partial.autoPlayAudio === "boolean" ? partial.autoPlayAudio : defaultSettings.autoPlayAudio,
    audioLanguage,
    autoAdvance: typeof partial.autoAdvance === "boolean" ? partial.autoAdvance : defaultSettings.autoAdvance,
    autoAdvanceOrder: partial.autoAdvanceOrder === "random" ? "random" : "sequential",
    autoAdvanceDelayMs,
    theme: partial.theme === "dark" ? "dark" : "light",
  };
}

export function readProgress(): Progress {
  const raw = window.localStorage.getItem(key);
  if (!raw) return defaultProgress;

  try {
    const parsed = JSON.parse(raw) as Partial<Progress> & { showJapanese?: boolean };
    const unitId = numberOrDefault(parsed.unitId, defaultProgress.unitId);
    const cardIndex = Math.max(0, Math.floor(numberOrDefault(parsed.cardIndex, defaultProgress.cardIndex)));
    const cardPositions = cleanCardPositions(parsed.cardPositions);
    const cardCounts = cleanCardCounts(parsed.cardCounts);
    cardPositions[String(unitId)] = cardPositions[String(unitId)] ?? cardIndex;

    return {
      unitId,
      cardIndex,
      cardPositions,
      cardCounts,
      completedUnits: Array.isArray(parsed.completedUnits)
        ? parsed.completedUnits.filter((id): id is number => typeof id === "number" && Number.isInteger(id))
        : [],
      settings: cleanSettings(parsed.settings, parsed.showJapanese),
    };
  } catch {
    return defaultProgress;
  }
}

export function writeProgress(progress: Progress) {
  window.localStorage.setItem(key, JSON.stringify(progress));
}
