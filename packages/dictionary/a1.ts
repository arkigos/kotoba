import scopeJson from "../../data/jp/dictionary/a1_scope.json";

export interface A1Topic {
  id: string;
  title: string;
  description: string;
  milestoneIds: string[];
  /** Reviewed opening order for this scenario; global core identity stays fixed. */
  introductionWordIds?: string[];
}

export type A1Skill = "listening" | "reading" | "spoken-interaction" | "spoken-production" | "writing";

export interface A1Milestone {
  id: string;
  title: string;
  description: string;
  task: string;
  topicIds: string[];
  skills: A1Skill[];
  sourceUrl: string;
  sourceCanDoIds: number[];
  practiceUnitIds: number[];
  evidenceNote: string;
}

export interface A1WordMetadata {
  level: "A1";
  /** True for a core teaching item and its explicitly reviewed form aliases. */
  core: boolean;
  topicIds: string[];
  /** Shared progress identity; never replaces the word's learning/audio ID. */
  coreWordId?: string;
}

export const a1Topics = scopeJson.topics as A1Topic[];
export const a1Milestones = scopeJson.milestones as A1Milestone[];
export const a1WordMetadata = scopeJson.words as Record<string, A1WordMetadata>;
/** Explicit unique representatives, so polite and dictionary forms count once. */
export const a1CoreWordIds: string[] = scopeJson.coreWordIds;
export const a1ScopeVersion = scopeJson.version;
export const a1CompletionPolicy = scopeJson.completion;

export function a1MetadataForWord(wordId: string): A1WordMetadata | undefined {
  return a1WordMetadata[wordId];
}

export function a1CoreWordIdsForTopic(topicId: string): string[] {
  const pool = a1CoreWordIds.filter(wordId => a1WordMetadata[wordId].topicIds.includes(topicId));
  const introductions = a1Topics.find(topic => topic.id === topicId)?.introductionWordIds ?? [];
  const opening = introductions.filter(id => pool.includes(id));
  return [...new Set([...opening, ...pool])];
}

export function a1LearningIdsForCoreWord(coreWordId: string): string[] {
  return Object.entries(a1WordMetadata).filter(([, metadata]) => metadata.coreWordId === coreWordId).map(([id]) => id);
}
