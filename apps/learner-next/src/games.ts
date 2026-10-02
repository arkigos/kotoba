import { dictionaryEntry } from "../../../packages/dictionary";
import { getAllWords, wordById } from "./curriculum";
import { isPrioritized, reviewStatus } from "./review";
import type { ActivityResult, LearnerState, WordEntry } from "./types";

export type GameKind = "pairs" | "listening" | "reading";
export type GamePoolSource = "library" | "starter" | "course" | "priority" | "due";
export type GameResult = {
  id: string;
  kind: GameKind;
  correct: number;
  total: number;
  wordIds: string[];
  missedWordIds: string[];
  at: string;
  durationSeconds: number;
};
export type GameWord = WordEntry & { meaningKeys: string[]; readingKey: string; category: string };
export type ListeningQuestion = { word: GameWord; choices: GameWord[] };
export type ReadingQuestion = { word: GameWord; tiles: string[]; reading: string };

const normalize = (value: string) => value.normalize("NFKC").toLowerCase().trim();
const englishKey = (value: string) => normalize(value).replace(/\([^)]*\)/g, "").replace(/^(?:a |an |the |to )/, "").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
export const readingKey = (value: string) => normalize(value).replace(/[ァ-ヶ]/g, letter => String.fromCharCode(letter.charCodeAt(0) - 0x60)).replace(/[\s・、。！？!?]/g, "");
const glossKeys = (value: string) => value.split(/;|,|\s\/\s|\sor\s/).map(englishKey).filter(Boolean);

/** Game eligibility is recognition-only. Dictionary tags never authorize sentence generation. */
export function gameWord(word: WordEntry): GameWord | undefined {
  if (!word.surface || !word.reading || !word.meaning || word.surface.length > 18 || word.meaning.length > 110) return undefined;
  if (!/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(word.surface)) return undefined;
  if (/^(?:fw_|kana_)/.test(word.id) || word.level === "Kana") return undefined;
  const entry = dictionaryEntry(word.id);
  const senses = entry?.senses.filter(sense => !word.dictionarySenseIds?.length || word.dictionarySenseIds.includes(sense.id)) ?? [];
  const parts = senses.flatMap(sense => sense.partsOfSpeech);
  // Context-dependent particles and grammar labels are not stand-alone word questions.
  if (parts.includes("prt") || /particle|grammar|counter|suffix|prefix/i.test(word.function)) return undefined;
  const category = /person/i.test(word.function) ? "people" : /verb/i.test(word.function) || parts.some(part => /^v/.test(part)) ? "verbs"
    : /adjective/i.test(word.function) || parts.some(part => part.startsWith("adj")) ? "adjectives"
      : /adverb/i.test(word.function) || parts.includes("adv") ? "adverbs" : "nouns";
  const meaningKeys = [...new Set([word.meaning, ...senses.flatMap(sense => sense.glosses)].flatMap(glossKeys))];
  return meaningKeys.length ? { ...word, meaningKeys, readingKey: readingKey(word.audioText ?? word.reading), category } : undefined;
}

/** A board or question never asks learners to distinguish synonyms, homophones,
 * spelling variants, or different learning IDs for one dictionary entry. */
export function wordsConflict(a: GameWord, b: GameWord) {
  return a.id === b.id || normalize(a.surface) === normalize(b.surface) || a.readingKey === b.readingKey
    || (!!a.dictionaryEntryId && a.dictionaryEntryId === b.dictionaryEntryId)
    || a.meaningKeys.some(key => b.meaningKeys.includes(key));
}

export function shuffleGameWords<T>(values: readonly T[], seed: number): T[] {
  let value = seed >>> 0;
  const random = () => { value += 0x6D2B79F5; let next = Math.imul(value ^ value >>> 15, 1 | value); next ^= next + Math.imul(next ^ next >>> 7, 61 | next); return ((next ^ next >>> 14) >>> 0) / 4294967296; };
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

export function distinctGameWords(words: readonly GameWord[], limit = Infinity): GameWord[] {
  const selected: GameWord[] = [];
  for (const word of words) {
    if (!selected.some(other => wordsConflict(word, other))) selected.push(word);
    if (selected.length >= limit) break;
  }
  return selected;
}

export function gamePool(state: LearnerState, source: GamePoolSource): GameWord[] {
  const ids = [...new Set([...Object.keys(state.wordHistory), ...state.savedWordIds])];
  const candidates = source === "starter" ? getAllWords().filter(word => word.introducedInUnit! >= 1 && word.introducedInUnit! <= 7)
    : source === "course" ? getAllWords()
      : ids.filter(id => source === "priority" ? isPrioritized(state.wordHistory[id]) : source === "due" ? !!state.wordHistory[id] && reviewStatus(state.wordHistory[id], state).due : true).map(wordById).filter((word): word is WordEntry => !!word);
  return candidates.map(gameWord).filter((word): word is GameWord => !!word);
}

export function makeListeningQuestions(targets: readonly GameWord[], pool: readonly GameWord[], seed: number): ListeningQuestion[] {
  return targets.flatMap((word, index) => {
    const candidates = shuffleGameWords(pool, seed + index * 997).filter(candidate => !wordsConflict(word, candidate));
    // Comparable word types prevent the grammar of an answer from giving it away.
    candidates.sort((a, b) => Number(b.category === word.category) - Number(a.category === word.category));
    const choices = distinctGameWords([word, ...candidates], 4);
    return choices.length === 4 ? [{ word, choices: shuffleGameWords(choices, seed + index * 541 + 73) }] : [];
  });
}

/** Keep small kana with the preceding sound. Separate っ, ん and ー remain
 * intentional tiles: their position changes the reading. Kanji prompts avoid
 * displaying the answer, and no pronunciation is inferred from the spelling. */
export function makeReadingQuestions(words: readonly GameWord[], seed: number): ReadingQuestion[] {
  return words.flatMap((word, index) => {
    const reading = word.reading.normalize("NFKC").trim();
    if (!/[\p{Script=Han}]/u.test(word.surface) || !/^[ぁ-ゖァ-ヺー]+$/u.test(reading)) return [];
    const sounds: string[] = [];
    for (const character of reading) {
      if (/[ゃゅょぁぃぅぇぉゎャュョァィゥェォヮ]/u.test(character) && sounds.length) sounds[sounds.length - 1] += character;
      else sounds.push(character);
    }
    if (sounds.length < 2 || sounds.length > 8 || new Set(sounds).size < 2) return [];
    const tiles = shuffleGameWords(sounds, seed + index * 719);
    // A shuffled question must not arrive already solved.
    while (tiles.join("") === reading) tiles.push(tiles.shift()!);
    return [{ word, tiles, reading }];
  });
}

export function gameDuration(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function activityRecords(results: ActivityResult[] = []) {
  const valid = results.filter(result => ["pairs", "listening", "reading", "kanji"].includes(result.kind) && Number.isFinite(Date.parse(result.at))
    && Number.isInteger(result.total) && result.total > 0 && Number.isInteger(result.correct) && result.correct >= 0 && result.correct <= result.total);
  const recent = [...new Map(valid.map(result => [result.id, result])).values()].sort((a, b) => b.at.localeCompare(a.at));
  const best = (["pairs", "listening", "reading", "kanji"] as const).flatMap(kind => {
    const rounds = recent.filter(result => result.kind === kind).sort((a, b) => b.correct / b.total - a.correct / a.total || b.total - a.total);
    return rounds[0] ? [rounds[0]] : [];
  });
  return { recent, best };
}
