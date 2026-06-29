export type Language = {
  code: string;
  language: string;
};

export type UnitIndexEntry = {
  id: number;
  slug: string;
  title: string;
  grammarFocus: string;
  path: string;
};

export type UnitIndex = {
  language: string;
  units: UnitIndexEntry[];
};

export type CourseLevel = {
  code: "A1" | "A2" | "B1" | "B2";
  title: string;
  unitStart: number;
  unitEnd: number;
  canDoSummary: string;
};

export type CourseLevels = {
  language: string;
  framework: string;
  certificationClaim: false;
  plannedUnitCount: number;
  levels: CourseLevel[];
};

export type WordEntry = {
  id: string;
  surface: string;
  reading: string;
  meaning: string;
  function: string;
};

export type CardToken = {
  surface: string;
  reading: string;
  explain: string;
  wordId?: string;
};

export type PracticeCard = {
  id: string;
  line: string[];
  tts: string[];
  explain: string[];
  tokens: CardToken[];
  english: string;
  imagePrompt?: string;
  imageRef?: string;
  audioRef?: string;
  fact: string;
  grammarTags: string[];
};

export type CurriculumUnit = {
  id: number;
  slug: string;
  title: string;
  grammarFocus: string;
  newWords: WordEntry[];
  cards: PracticeCard[];
};

export type CardFront = "japanese" | "english";

export type JapaneseDisplayMode = "surface" | "kana" | "romaji";

export type AutoAdvanceOrder = "sequential" | "random";

export type AudioLanguage = "japanese" | "english" | "both";

export type PracticeSettings = {
  showImage: boolean;
  showPromptText: boolean;
  cardFront: CardFront;
  japaneseDisplay: JapaneseDisplayMode;
  showFact: boolean;
  revealByDefault: boolean;
  autoPlayAudio: boolean;
  audioLanguage: AudioLanguage;
  autoAdvance: boolean;
  autoAdvanceOrder: AutoAdvanceOrder;
  autoAdvanceLoop: boolean;
  autoAdvanceDelayMs: number;
};

export type Progress = {
  languageCode: string;
  unitId: number;
  cardIndex: number;
  cardPositions: Record<string, number>;
  completedUnits: number[];
  settings: PracticeSettings;
};
