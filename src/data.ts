import languagesJson from "../data/languages.json";
import courseLevelsJson from "../data/jp/curriculum/course_levels.json";
import unitIndexJson from "../data/jp/curriculum/unit_index.json";
import unit001Json from "../data/jp/curriculum/units/unit_001.json";
import type { CourseLevels, CurriculumUnit, Language, UnitIndex } from "./types";

type UnitModule = { default: CurriculumUnit };

const unitModules = import.meta.glob<UnitModule>([
  "../data/jp/curriculum/units/unit_*.json",
  "!../data/jp/curriculum/units/unit_001.json",
]);
const unitCache = new Map<number, CurriculumUnit>([[1, unit001Json as CurriculumUnit]]);

export const languages = languagesJson as Language[];
export const courseLevels = courseLevelsJson as CourseLevels;
export const unitIndex = unitIndexJson as UnitIndex;
export const initialUnit = unit001Json as CurriculumUnit;

function padUnitId(unitId: number) {
  return String(unitId).padStart(3, "0");
}

export function authoredUnitIds() {
  return unitIndex.units.map((unit) => unit.id);
}

export function isAuthoredUnit(unitId: number) {
  return unitIndex.units.some((unit) => unit.id === unitId);
}

export async function getUnit(unitId: number): Promise<CurriculumUnit> {
  const cached = unitCache.get(unitId);
  if (cached) return cached;

  const modulePath = `../data/jp/curriculum/units/unit_${padUnitId(unitId)}.json`;
  const loadModule = unitModules[modulePath];
  if (!loadModule) {
    throw new Error(`Unknown unit: ${unitId}`);
  }

  const module = await loadModule();
  unitCache.set(unitId, module.default);
  return module.default;
}
