export type DictionaryLevel = "Kana" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type FrequencyBand = "very-common" | "common" | "uncommon" | "rare" | "unranked";
export type WordPlacement = { level: Exclude<DictionaryLevel, "Kana">; method: "reviewed" | "estimated"; basis: string; confidence: "high" | "medium" | "low" };
export type WordFrequency = { band: FrequencyBand; source: string; zipf?: number };
export type DictionarySense = {
  id: string;
  glosses: string[];
  partsOfSpeech: string[];
  appliesToSpellings?: string[];
  appliesToReadings?: string[];
  notes?: string[];
  fields?: string[];
  misc?: string[];
};
export type DictionaryEntry = {
  id: string;
  headword: string;
  reading: string;
  spellings: string[];
  readings: string[];
  senses: DictionarySense[];
  common: boolean;
  source: string;
  placement?: WordPlacement;
  frequency?: WordFrequency;
  studyCollection?: boolean;
  readingForms?: Array<{text: string; appliesToSpellings?: string[]; noKanji?: boolean}>;
};
export type WordBinding = {
  entryId: string;
  surface: string;
  reading: string;
  meaning: string;
  function: string;
  level?: DictionaryLevel;
  introducedInUnit?: number | null;
  audioText?: string;
  senseIds?: string[];
  match?: {method: string; status: string};
};
export type DictionaryWord = {
  id: string;
  dictionaryEntryId: string;
  dictionarySenseIds?: string[];
  surface: string;
  reading: string;
  meaning: string;
  function: string;
  level?: DictionaryLevel;
  introducedInUnit?: number;
  audioText?: string;
  placement?: WordPlacement;
  frequency?: WordFrequency;
};
/** Compact reference metadata is browse-only, never a proficiency or generation grant. */
export type SearchRow = [id: string, headword: string, reading: string, gloss: string, searchText?: string, common?: 0 | 1, partsOfSpeech?: string, fields?: string, level?: DictionaryLevel, placementMethod?: "reviewed" | "estimated", frequencyBand?: FrequencyBand, poolRank?: number, poolStage?: "introductory" | "foundation" | "topic-expansion" | "expansion"];
