import { a1WordMetadata } from "../../../packages/dictionary/a1";
import type { LearnerState } from "./types";

const DAY = 86_400_000;
const aliases = new Map<string, string[]>();
for (const [id, metadata] of Object.entries(a1WordMetadata)) {
  if (!metadata.core) continue;
  const coreId = metadata.coreWordId ?? id;
  aliases.set(coreId, [...(aliases.get(coreId) ?? []), id]);
}

/** Old aggregate histories cannot prove which alias occasions were distinct.
 * Seed conservatively, then accumulate future practice across every linked form. */
export function coreOccasions(state: LearnerState, coreId: string) {
  const recorded = state.a1CoreHistory?.[coreId];
  const histories = (aliases.get(coreId) ?? [coreId]).map(id => state.wordHistory[id]?.review).filter(history => !!history && history.occasions > 0);
  const occasions = Math.max(recorded?.occasions ?? 0, 0, ...histories.map(history => history?.occasions ?? 0));
  const anchors = [recorded, ...histories.map(history => ({ lastOccasionAt: history?.lastOccasionAt ?? history?.lastPracticedAt, lastOccasionSessionId: history?.lastOccasionSessionId }))]
    .filter(value => value && Number.isFinite(Date.parse(value.lastOccasionAt ?? "")))
    .sort((a, b) => Date.parse(b!.lastOccasionAt!) - Date.parse(a!.lastOccasionAt!));
  return { occasions, lastOccasionAt: anchors[0]?.lastOccasionAt, lastOccasionSessionId: anchors[0]?.lastOccasionSessionId };
}

export function recordA1Practice(state: LearnerState, wordIds: string[], at: string, sessionId: string): LearnerState {
  const timestamp = Date.parse(at);
  if (!Number.isFinite(timestamp) || !sessionId) return state;
  const ids = [...new Set(wordIds.flatMap(id => a1WordMetadata[id]?.core ? [a1WordMetadata[id].coreWordId ?? id] : []))];
  if (!ids.length) return state;
  const history = { ...state.a1CoreHistory };
  for (const id of ids) {
    const prior = coreOccasions(state, id);
    const newOccasion = !prior.occasions || (sessionId !== prior.lastOccasionSessionId && timestamp - Date.parse(prior.lastOccasionAt ?? "") >= DAY);
    history[id] = { ...prior, occasions: prior.occasions + (newOccasion ? 1 : 0), ...(newOccasion ? { lastOccasionAt: at, lastOccasionSessionId: sessionId } : {}) };
  }
  return { ...state, a1CoreHistory: history };
}
