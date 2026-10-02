import courseLevelsJson from "../../../data/jp/curriculum/course_levels.json";
import unitIndexJson from "../../../data/jp/curriculum/unit_index.json";
import unitOneJson from "../../../data/jp/curriculum/units/unit_001.json";
import { courseDictionaryWords, dictionaryWord, hydrateUnitWords } from "../../../packages/dictionary";
import type { CourseLevel, CurriculumUnit, PracticeCard, UnitIndexEntry, WordEntry, WordHistory } from "./types";

const unitLoaders = import.meta.glob(["../../../data/jp/curriculum/units/unit_*.json", "!../../../data/jp/curriculum/units/unit_001.json"], {
  import: "default",
}) as Record<string, () => Promise<CurriculumUnit>>;

export const unitIndex = (unitIndexJson as { units: UnitIndexEntry[] }).units;
export const courseLevels = (courseLevelsJson as { levels: CourseLevel[] }).levels;

// Cache within this module version only. Carrying this map through HMR kept old
// card text alive after curriculum edits, even in newly created lessons.
const unitsById = new Map<number, CurriculumUnit>([[1, hydrateUnitWords(unitOneJson as CurriculumUnit)]]);

function loaderFor(id: number) {
  const suffix = `unit_${String(id).padStart(3, "0")}.json`;
  return Object.entries(unitLoaders).find(([path]) => path.endsWith(suffix))?.[1];
}

export const availableUnits = unitIndex.filter((entry) => entry.id === 1 || !!loaderFor(entry.id));
export const standardUnits = availableUnits.filter((entry) => !entry.kind || entry.kind === "standard");

export function getUnit(id: number): CurriculumUnit {
  const unit = unitsById.get(id);
  if (!unit) throw new Error(`Unit ${id} is not available yet.`);
  return unit;
}

export async function loadUnit(id: number): Promise<CurriculumUnit> {
  const cached = unitsById.get(id);
  if (cached) return cached;
  const loader = loaderFor(id);
  if (!loader) throw new Error(`Unit ${id} is not available yet.`);
  const unit = hydrateUnitWords(await loader());
  unitsById.set(id, unit);
  return unit;
}

export function findCard(unitId: number, cardId: string): PracticeCard {
  const unit = getUnit(unitId);
  return unit.cards.find((card) => card.id === cardId) ?? unit.cards[0];
}

export function levelForUnit(unitId: number): CourseLevel {
  return courseLevels.find((level) => unitId >= level.unitStart && unitId <= level.unitEnd) ?? courseLevels[1];
}

export function cleanUnitTitle(title: string) {
  return title.replace(/^Unit\s+\d+:\s*/i, "").replace(/^Kana\s+\d+:\s*/i, "");
}

export function unitNumberLabel(unit: Pick<UnitIndexEntry, "id" | "kind">) {
  if (unit.kind === "kana" || unit.kind === "kanji" || unit.id >= 100) return `Prelude ${Math.max(1, unit.id - 100)}`;
  return `Unit ${unit.id}`;
}

export function topicGlyph(unit: UnitIndexEntry | CurriculumUnit) {
  const topic = unit.title.toLowerCase();
  if (topic.includes("classroom")) return "学";
  if (topic.includes("food") || topic.includes("restaurant")) return "食";
  if (topic.includes("family") || topic.includes("people")) return "人";
  if (topic.includes("home") || topic.includes("room")) return "家";
  if (topic.includes("travel") || topic.includes("transport")) return "旅";
  if (topic.includes("shopping") || topic.includes("money")) return "買";
  if (topic.includes("time") || topic.includes("calendar")) return "時";
  if (topic.includes("weather")) return "天";
  if (topic.includes("kana")) return "あ";
  return "言";
}

export function getAllWords() {
  return courseDictionaryWords();
}

export function wordById(id: string) {
  return dictionaryWord(id) as WordEntry | undefined;
}

/** Saving an authored word makes its existing course sentences reviewable even
 * before an encounter has put that unit in the learner's history. */
export function reviewSourceUnitIds(wordId: string, history?: WordHistory): number[] {
  const known = history?.unitIds.filter(id => availableUnits.some(unit => unit.id === id)) ?? [];
  if (known.length) return known;
  const source = wordById(wordId)?.introducedInUnit;
  return source !== undefined && availableUnits.some(unit => unit.id === source) ? [source] : [];
}

export function allCards() {
  return [...unitsById.values()].flatMap((unit) => unit.cards.map((card) => ({ ...card, unitId: unit.id })));
}

export function unitForCard(cardId: string) {
  for (const unit of unitsById.values()) if (unit.cards.some((card) => card.id === cardId)) return unit;
  return undefined;
}
