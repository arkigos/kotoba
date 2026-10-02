import type { PracticeCard, CardToken } from "../../src/types";

export type Form = { surface: string; reading: string };
export type Features = { tense: "nonpast" | "past"; polarity: "positive" | "negative"; question: boolean };
export type Agreement = "first-singular" | "third-singular" | "other";
export const proficiencyLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type ProficiencyLevel = typeof proficiencyLevels[number];
/** Reviewed sense properties. These must never be inferred from imported POS. */
export const semanticTags = ["person", "physical", "countable", "text", "writing", "language", "food", "drink", "place", "clothing", "upper-body-clothing", "audio", "visual", "event", "transport"] as const;
export type SemanticTag = typeof semanticTags[number];
type LexemeBase = { id: string; wordId: string; dictionaryEntryId?: string; lemma: Form; meaning: string; level?: ProficiencyLevel };

export type Noun = LexemeBase & {
  kind: "noun";
  roles: Array<"subject" | "actor" | "identity" | "object" | "place" | "entity">;
  semanticTags?: SemanticTag[];
  existence?: "animate" | "inanimate";
  english: { subject: string; object: string; predicate: string; agreement: Agreement; location?: string; existential?: string; existentialNegative?: string; existentialSubject?: boolean };
};
export type VerbForm = "dictionary" | "negative" | "past" | "negative-past" | "te" | "polite" | "polite-negative" | "polite-past" | "polite-negative-past";
export type Verb = LexemeBase & {
  kind: "verb";
  conjugation: "godan" | "ichidan" | "suru" | "kuru";
  exception?: "iku" | "aru";
  frames: Array<"object-wo" | "destination-ni" | "existence-animate" | "existence-inanimate">;
  /** At least one of these properties is required of the を-object. */
  objectTags?: SemanticTag[];
  english: { base: string; third: string; past: string };
};
export type Adjective = LexemeBase & {
  kind: "i-adjective" | "na-adjective";
  // The complete inflecting stem; e.g. いい -> よ, not guessed from its ending.
  inflectionStem?: Form;
  /** Restricts ordinary literal uses; metaphors need a separate reviewed sense. */
  subjectTags?: SemanticTag[];
  /** Exclusions refine broad categories, e.g. a countable food is not a cleanable object. */
  excludedSubjectTags?: SemanticTag[];
  /** Optional exact sense domain when category tags are too broad. */
  subjectWordIds?: string[];
  english: string;
};
export type Lexeme = Noun | Verb | Adjective;
export type Lexicon = { version: string; entries: Lexeme[] };

export const constructionIds = ["identity", "i-predicate", "na-predicate", "action", "motion", "existence"] as const;
export type ConstructionId = typeof constructionIds[number];
export const grammarIds = ["topic-wa", "copula-polite", "i-adjective", "na-adjective", "object-wo", "destination-ni", "existence", "verb-polite", "past", "negative", "question-ka"] as const;
export type GrammarId = typeof grammarIds[number];
export type Sentence = { construction: ConstructionId; bindings: Record<string, string>; features: Features };
export type Phase = {
  id: string;
  construction: ConstructionId;
  features: Features;
  count: number;
  introduceGrammar?: GrammarId[];
};
export type Recipe = {
  schemaVersion: 1;
  id: string;
  revision: number;
  title: string;
  targetSenseIds: string[];
  helperSenseIds: string[];
  knownGrammar: GrammarId[];
  phases: Phase[];
  maxChangedSlots: 1 | 2;
  minTargetExposures: number;
  /** Kotoba's JF/CEFR-inspired ceiling, not a proficiency certification. */
  level?: ProficiencyLevel;
  targetExposures?: Record<string, number>;
};
export type GeneratedCard = PracticeCard & {
  derivation: Sentence;
  senseIds: string[];
  audioPolicy: "words";
};
export type Transition = { kind: "start" | "phase" | "substitution"; changedSlots: string[]; phaseId: string };
export type SessionSnapshot = {
  schemaVersion: 1;
  engineVersion: string;
  lexiconVersion: string;
  seed: number;
  recipe: Recipe;
  cards: GeneratedCard[];
  transitions: Transition[];
  coverage: Record<string, number>;
  wordCoverage: Record<string, number>;
  reviewSelection?: {
    selectedAt: string;
    additions: Array<{ wordId: string; senseId: string; reason: string }>;
    deferred: Array<{ wordId: string; reason: string }>;
  };
};
export type WordAudio = { tokenIndex: number; wordId: string; surface: string; reading: string; speech: string; cacheKey: string; audioRef?: string };
export type { PracticeCard, CardToken };

export class GenerationError extends Error {
  constructor(public code: string, message: string, public details: Record<string, unknown> = {}) {
    super(message);
    this.name = "GenerationError";
  }
}
