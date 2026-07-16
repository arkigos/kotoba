export type UnitIndexEntry = {
  id: number;
  slug: string;
  title: string;
  grammarFocus: string;
  path: string;
  kind?: "standard" | "kana" | "kanji";
};

export type UnitIndex = {
  language: string;
  units: UnitIndexEntry[];
};

export type CourseLevel = {
  code: "Kana" | "A1" | "A2" | "B1" | "B2";
  title: string;
  unitStart: number;
  unitEnd: number;
  canDoSummary: string;
  courseStage?: "prelude" | "core";
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

export type FunctionWordEntry = WordEntry;

export type GrammarTokenEntry = WordEntry;

export type CardToken = {
  surface: string;
  reading: string;
  explain: string;
  wordId?: string;
  audioRef?: string;
  audioText?: string;
};

export type PracticeCard = {
  id: string;
  line: string[];
  tts: string[];
  explain: string[];
  tokens: CardToken[];
  english: string;
  audioRef?: string;
  audioText?: string;
  grammarTags: string[];
};

export type CurriculumUnit = {
  id: number;
  slug: string;
  title: string;
  grammarFocus: string;
  kind?: "standard" | "kana" | "kanji";
  newWords: WordEntry[];
  reviewWordIds: string[];
  lexiconWordIds: string[];
  cards: PracticeCard[];
};

export type CardFront = "japanese" | "english";

export type JapaneseDisplayMode = "surface" | "kana" | "romaji";

export type AutoAdvanceOrder = "sequential" | "random";

export type AudioLanguage = "japanese" | "english" | "both";

export type ThemeMode = "light" | "dark";

export type PracticeSettings = {
  showPromptText: boolean;
  cardFront: CardFront;
  japaneseDisplay: JapaneseDisplayMode;
  revealByDefault: boolean;
  autoPlayAudio: boolean;
  audioLanguage: AudioLanguage;
  autoAdvance: boolean;
  autoAdvanceOrder: AutoAdvanceOrder;
  autoAdvanceLoop: boolean;
  autoAdvanceDelayMs: number;
  theme: ThemeMode;
};

export type Progress = {
  unitId: number;
  cardIndex: number;
  cardPositions: Record<string, number>;
  cardCounts: Record<string, number>;
  completedUnits: number[];
  settings: PracticeSettings;
};
