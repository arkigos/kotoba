export type NavigationKey = "today" | "course" | "dictionary" | "library" | "me" | "build" | "lesson" | "lessons" | "settings" | "goals" | "games" | "kanji";
export type SessionLength = "quick" | "standard" | "deep";
export type PromptKind = "meaning" | "listening" | "arrange" | "recall" | "explore";
export type ThemeMode = "light" | "dark";
export type ScriptSupport = "adaptive" | "always" | "minimal";
export type AttemptGrade = "again" | "hard" | "good" | "easy";
export type WordRating = "hard" | "learning" | "easy";
export type WordInteractionKind = "reading" | "listening" | "recall" | "arrange" | "token" | "saved";
export type LibraryReviewMode = "mixed" | "listening" | "recall";
export type LessonMode = "reading" | "listening" | "recall" | "rapid" | "mixed";
export type JapaneseDisplayMode = "surface" | "kana" | "romaji";
export type LessonCardFace = "japanese" | "english" | "hidden";
export type AudioLanguage = "japanese" | "english" | "same" | "opposite";
export type AutoAdvanceOrder = "sequential" | "random";

export type UnitIndexEntry = {
  id: number;
  slug: string;
  title: string;
  grammarFocus: string;
  path: string;
  kind?: "standard" | "kana" | "kanji";
};

export type CourseLevel = {
  code: "Kana" | "A1" | "A2" | "B1" | "B2";
  title: string;
  unitStart: number;
  unitEnd: number;
  canDoSummary: string;
  courseStage?: "prelude" | "core";
};

export type WordEntry = {
  id: string;
  surface: string;
  reading: string;
  meaning: string;
  function: string;
  level?: "Kana" | import("../../../packages/learning-engine").ProficiencyLevel;
  introducedInUnit?: number;
  dictionaryEntryId?: string;
  dictionarySenseIds?: string[];
  audioText?: string;
};

export type CardToken = {
  surface: string;
  reading: string;
  explain: string;
  wordId?: string;
  dictionaryEntryId?: string;
  audioRef?: string;
  audioText?: string;
};

export type PracticeCard = {
  kind?: "social-expression";
  id: string;
  line: string[];
  tts: string[];
  explain: string[];
  tokens: CardToken[];
  english: string;
  audioRef?: string;
  audioText?: string;
  grammarTags?: string[];
  constructionKey?: string;
  practiceGrammar?: string[];
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

export type UnitProgress = {
  viewedCardIds?: string[];
  exposure: number;
  mastery: number;
  lastCardIndex: number;
  lastStudiedAt?: string;
};

export type AttemptEvent = {
  id: string;
  at: string;
  unitId: number;
  cardId: string;
  prompt: PromptKind;
  grade: AttemptGrade;
  correct: boolean;
  elapsedMs: number;
};

export type WordHistory = {
  declaredKnownAt?: string;
  declaredKnownLessonId?: string;
  wordId: string;
  unitIds: number[];
  recipeIds?: string[];
  firstSeenAt: string;
  lastSeenAt: string;
  encounters: number;
  /** Actual consumed card positions since tracking began; absent history is unknown. */
  cardEncounters?: number;
  correct: number;
  misses: number;
  rating: WordRating;
  interactionKinds: WordInteractionKind[];
  prioritized?: boolean;
  review?: {
    lastPracticedAt: string;
    lastOccasionAt?: string;
    lastOccasionSessionId?: string;
    occasions: number;
    lastPracticeSequence?: number;
  };
};

export type LibraryReviewRequest = {
  wordIds: string[];
  mode: LibraryReviewMode;
  count: number;
  label: string;
};

export type SessionItem = {
  cardId: string;
  prompt: PromptKind;
  reason: string;
  unitId?: number;
  section?: "lesson" | "due-review" | "recent-review";
  reviewSource?: { lessonId: string; title?: string };
};

export type ReviewCardMemory = { card: PracticeCard; sourceLessonId: string; sourceTitle?: string; lastPracticedAt: string; encounters: number };

export type ActiveSession = {
  curatedLessonId?: string;
  curatedVersion?: number;
  curatedReviewTopicId?: string;
  starterLessonId?: string;
  starterVersion?: number;
  completedByDeclarationAt?: string;
  lessonNotes?: { start: number; title: string; pattern: string; explanation: string }[];
  id: string;
  lessonId?: string;
  practicedIndices?: number[];
  unitId?: number;
  length: SessionLength;
  startedAt: string;
  cursor: number;
  items: SessionItem[];
  scores: boolean[];
  source?: "course" | "library" | "generated" | "saved" | "topic" | "vocabulary";
  topicId?: string;
  topicSeries?: { rootId: string; baseTitle: string; number: number };
  grammarLessonId?: import("../../../packages/learning-engine/learning-grammar").LearningGrammarId;
  targetWordIds?: string[];
  lessonPlan?: { version: 1; engineVersion?: string; cardCount: number; appearances: Record<string, number>; helperWordIds: string[]; newWordIds: string[]; reviewWordIds: string[];
    grammarReview?: { requested: string[]; practiced: string[]; deferred: string[] };
    sections?: { lesson: number; dueReview: number; recentReview: number; cap: number };
    deferredDueWordIds?: string[];
    pacing?: import("./topic-sequence").TopicPacing; transitions?: import("./topic-sequence").TopicStep[] };
  snapshot?: SessionSnapshot;
  savedCards?: PracticeCard[];
  title?: string;
  mode?: LessonMode;
  practiceSequence?: number;
};

export type StoredLesson = {
  id: string;
  session: ActiveSession;
  lastOpenedAt: string;
  savedAt?: string;
  completedAt?: string;
};

export type DailyPractice = {
  cards: number;
  newWordIds: string[];
  reviewedWordIds: string[];
  completedLessonIds: string[];
};

export type GoalMetric = "cards" | "words" | "reviews" | "lessons" | "days" | "kanji" | "activities";
export type GoalPeriod = "daily" | "weekly" | "total";
export type LearningGoal = { id: string; metric: GoalMetric; period: GoalPeriod; target: number; createdAt: string };
export type ActivityResult = { id: string; kind: "pairs" | "listening" | "reading" | "kanji"; correct: number; total: number; wordIds?: string[]; missedWordIds?: string[]; kanjiIds?: string[]; at: string; durationSeconds: number };
export type ActivityDay = { rounds: number; roundIds?: string[]; correct: number; questions: number; seconds: number; newWordIds: string[]; reviewedWordIds: string[]; kanjiIds: string[] };

export type LearnerSettings = {
  theme: ThemeMode;
  scriptSupport: ScriptSupport;
  autoplay: boolean;
  sound: boolean;
  haptics: boolean;
  quietMode: boolean;
  dailyMinutes: number;
  lessonMode: Exclude<LessonMode, "mixed">;
  japaneseDisplay: JapaneseDisplayMode;
  lessonDefaultFace: LessonCardFace;
  audioLanguage: AudioLanguage;
  autoAdvance: boolean;
  autoAdvanceOrder: AutoAdvanceOrder;
  autoAdvanceDelayMs: number;
  reviewMixins?: boolean;
};

export type LearnerState = {
  curatedProgress?: {
    completions: Record<string, { version: number; at: string; method: "practiced" | "declared" }>;
    cards: Record<string, { at: string; encounters: number; version?: number; occasions?: number }>;
  };
  starterCompletions?: Record<string, { version: number; at: string; method: "practiced" | "declared" }>;
  declaredGrammar?: Record<string, string>;
  version: 3;
  displayName: string;
  joinedAt: string;
  onboardingComplete: boolean;
  currentUnitId: number;
  completedUnits: number[];
  unitProgress: Record<string, UnitProgress>;
  savedWordIds: string[];
  savedSentenceIds: string[];
  savedGeneratedCards?: Record<string, { card: GeneratedCard; title: string; recipeId: string }>;
  savedMaterializedCards?: Record<string, PracticeCard>;
  a1Journey?: {
    activeTopicIds: string[];
    milestoneChecks: Record<string, string>;
  };
  a1CoreHistory?: Record<string, { occasions: number; lastOccasionAt?: string; lastOccasionSessionId?: string }>;
  xp: number;
  practiceDays: string[];
  attempts: AttemptEvent[];
  wordHistory: Record<string, WordHistory>;
  grammarHistory?: Record<string, { encounters: number; practicedForms: string[]; occasions: number; lastPracticedAt: string; lastOccasionAt: string; lastOccasionSessionId: string; lastPracticeSequence: number }>;
  activeSession?: ActiveSession;
  settings: LearnerSettings;
  practiceSessionCount?: number;
  lessonHistory?: StoredLesson[];
  reviewCards?: Record<string, ReviewCardMemory>;
  clearedLessons?: StoredLesson[];
  dailyPractice?: Record<string, DailyPractice>;
  learningGoals?: LearningGoal[];
  courseRevisions?: Record<string, number>;
  activityResults?: ActivityResult[];
  activityDays?: Record<string, ActivityDay>;
  kanjiProgress?: Record<string, { firstStudiedAt: string; lastStudiedAt: string; visits: number }>;
};

export type ToastMessage = {
  id: number;
  tone: "default" | "success" | "warning";
  message: string;
};
import type { GeneratedCard, SessionSnapshot } from "../../../packages/learning-engine";
