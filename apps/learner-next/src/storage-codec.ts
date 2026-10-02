import type { ActiveSession, LearnerState, PracticeCard } from "./types";

const POOL_KEY = "_materializedPool";
const ROWS_KEY = "_materializedRows";
const COMPACT_AFTER_BYTES = 256 * 1024;
type RecordValue = Record<string, unknown>;
type PackedCard = [body: RecordValue, tokens: number[], derivedArrays: number];
type Pool = { version: 1; cards: PackedCard[]; tokens: RecordValue[]; items: RecordValue[] };
const object = (value: unknown): value is RecordValue => !!value && typeof value === "object" && !Array.isArray(value);
const own = (value: RecordValue, key: string) => Object.prototype.hasOwnProperty.call(value, key);
const wordBody = (value: unknown): value is RecordValue => object(value) && ["surface", "reading", "explain"].every(key => typeof value[key] === "string");

function intern<T>(value: T, values: T[], keys: Map<string, number>): number {
  const key = JSON.stringify(value);
  const existing = keys.get(key);
  if (existing !== undefined) return existing;
  const index = values.length;
  keys.set(key, index); values.push(value); return index;
}

/** Wire format only. Runtime sessions and exported backups remain full cards.
 * Pool identity includes every body field; IDs alone never identify content. */
export function encodeStoredState(state: LearnerState): unknown {
  const pool: Pool = { version: 1, cards: [], tokens: [], items: [] };
  const cardKeys = new Map<string, number>();
  const tokenKeys = new Map<string, number>();
  const itemKeys = new Map<string, number>();
  let encoded = false;
  const pack = (session: ActiveSession) => {
    const cards = session.savedCards;
    if (!Array.isArray(cards) || !cards.length || !Array.isArray(session.items) || cards.length !== session.items.length
      || cards.some((card, index) => !card || typeof card.id !== "string" || !Array.isArray(card.tokens) || !card.tokens.length || card.tokens.some(token => !wordBody(token)) || session.items[index]?.cardId !== card.id)) return session;
    const rows = cards.map((card, index) => {
      const body: RecordValue = { ...card };
      delete body.id; delete body.tokens;
      const tokens = card.tokens.map(token => intern({ ...token }, pool.tokens, tokenKeys));
      let derived = 0;
      for (const [field, tokenField, bit] of [["line", "surface", 1], ["tts", "reading", 2], ["explain", "explain", 4]] as const) {
        if (own(body, field) && JSON.stringify(body[field]) === JSON.stringify(card.tokens.map(token => token[tokenField]))) { delete body[field]; derived |= bit; }
      }
      const bodyIndex = intern<PackedCard>([body, tokens, derived], pool.cards, cardKeys);
      const item: RecordValue = { ...session.items[index] };
      delete item.cardId;
      return [card.id, bodyIndex, intern(item, pool.items, itemKeys)];
    });
    const packed: RecordValue = { ...session };
    delete packed.savedCards; delete packed.items;
    encoded = true;
    return { ...packed, [ROWS_KEY]: rows };
  };
  const history = state.lessonHistory?.map(lesson => ({ ...lesson, session: pack(lesson.session) }));
  const cleared = state.clearedLessons?.map(lesson => ({ ...lesson, session: pack(lesson.session) }));
  const memories = Object.entries(state.reviewCards ?? {});
  const reviewBank = memories.length ? pack({id:"review-bank",startedAt:"",length:"standard",cursor:0,scores:[],
    savedCards:memories.map(([,memory])=>memory.card),items:memories.map(([,memory])=>({cardId:memory.card.id,prompt:"explore",reason:"Review memory"}))}) : undefined;
  const packedBank = reviewBank && own(reviewBank as RecordValue,ROWS_KEY) ? {
    session:reviewBank,memories:memories.map(([key,{card,...metadata}])=>[key,metadata]),
  } : undefined;
  return encoded ? { ...state, lessonHistory: history, clearedLessons: cleared,
    ...(packedBank ? {reviewCards:undefined,_reviewCardBank:packedBank} : {}), [POOL_KEY]: pool } : state;
}

function reference<T>(values: T[], index: unknown, kind: string): T {
  if (!Number.isInteger(index) || (index as number) < 0 || (index as number) >= values.length) throw new Error(`Invalid ${kind} reference.`);
  return values[index as number];
}

/** Invalid references fail only their lesson. The caller must retain the source
 * snapshot and block writes whenever errors exist; never overwrite damage. */
export function decodeStoredState(value: unknown): { value: unknown; errors: string[] } {
  if (!object(value)) return { value, errors: [] };
  const errors: string[] = [];
  const rawPool = value[POOL_KEY];
  const pool = object(rawPool) && rawPool.version === 1 && Array.isArray(rawPool.cards) && Array.isArray(rawPool.tokens) && Array.isArray(rawPool.items) ? rawPool as unknown as Pool : undefined;
  if (own(value, POOL_KEY) && !pool) errors.push("The saved-card pool is missing or has an unsupported format.");
  const restoreCard = (id: string, index: unknown): PracticeCard => {
    const packed = reference(pool!.cards, index, "card");
    if (!Array.isArray(packed) || packed.length !== 3 || !object(packed[0]) || !Array.isArray(packed[1]) || !Number.isInteger(packed[2]) || packed[2] < 0 || packed[2] > 7) throw new Error("Invalid saved-card body.");
    const [body, tokenRefs, derived] = packed;
    if (own(body, "id") || own(body, "tokens")) throw new Error("Invalid saved-card fields.");
    const tokens = tokenRefs.map(index => {
      const token = reference(pool!.tokens, index, "word");
      if (!wordBody(token)) throw new Error("Invalid saved-word body.");
      return structuredClone(token);
    });
    const card: RecordValue = { ...structuredClone(body), id, tokens };
    for (const [field, tokenField, bit] of [["line", "surface", 1], ["tts", "reading", 2], ["explain", "explain", 4]] as const) {
      if (derived & bit) {
        if (own(body, field)) throw new Error("Conflicting saved-card fields.");
        card[field] = tokens.map(token => token[tokenField]);
      }
    }
    return card as unknown as PracticeCard;
  };
  const restore = (raw: unknown, label: string): unknown => {
    if (!object(raw) || !own(raw, ROWS_KEY)) return raw;
    try {
      if (!pool || !Array.isArray(raw[ROWS_KEY]) || !raw[ROWS_KEY].length) throw new Error("Saved-card references have no valid pool.");
      const cards: PracticeCard[] = [];
      const items: RecordValue[] = [];
      for (const row of raw[ROWS_KEY]) {
        if (!Array.isArray(row) || row.length !== 3 || typeof row[0] !== "string" || !row[0]) throw new Error("Invalid saved-card position.");
        const item = reference(pool.items, row[2], "lesson item");
        if (!object(item) || own(item, "cardId")) throw new Error("Invalid lesson-item body.");
        cards.push(restoreCard(row[0], row[1]));
        items.push({ ...structuredClone(item), cardId: row[0] });
      }
      const session: RecordValue = { ...raw, savedCards: cards, items };
      delete session[ROWS_KEY];
      return session;
    } catch (cause) {
      errors.push(`${label}: ${cause instanceof Error ? cause.message : "Saved cards could not be restored."}`);
      // Keep the record and all original references available for recovery, but
      // make it unplayable rather than presenting partial or invented cards.
      return { ...raw, savedCards: [], items: [] };
    }
  };
  const restoreHistory = (field: string) => {
    let history: unknown = value[field];
    if (own(value, field) && value[field] !== undefined) {
      if (!Array.isArray(value[field])) {
        errors.push("The saved-lesson history has an invalid format.");
        history = [];
      } else {
        history = value[field].flatMap((lesson, index) => {
          const label = `Saved lesson ${index + 1}`;
          if (!object(lesson) || typeof lesson.id !== "string" || !object(lesson.session)
            || typeof lesson.session.id !== "string" || typeof lesson.session.cursor !== "number"
            || !Array.isArray(lesson.session.scores)
            || (!own(lesson.session, ROWS_KEY) && !Array.isArray(lesson.session.items))) {
            // A malformed record cannot safely appear in the shelf. Its exact
            // source remains in the caller's recovery snapshot; other records
            // and all unrelated progress remain usable.
            errors.push(`${label}: Invalid saved-lesson record.`);
            return [];
          }
          return [{ ...lesson, session: restore(lesson.session, label) }];
        });
      }
    }
    return history;
  };
  const decoded: RecordValue = { ...value, ...(own(value, "lessonHistory") ? { lessonHistory: restoreHistory("lessonHistory") } : {}), ...(own(value, "clearedLessons") ? { clearedLessons: restoreHistory("clearedLessons") } : {}) };
  if (own(value,"_reviewCardBank")) {
    try {
      const bank = value._reviewCardBank;
      if (!object(bank) || !Array.isArray(bank.memories)) throw new Error("Invalid review memory bank.");
      const session = restore(bank.session,"Review memory") as ActiveSession;
      if (!session?.savedCards || session.savedCards.length !== bank.memories.length) throw new Error("Incomplete review memory cards.");
      decoded.reviewCards=Object.fromEntries(bank.memories.map((entry,index)=>{
        if (!Array.isArray(entry) || typeof entry[0]!=="string" || !object(entry[1]) || typeof entry[1].sourceLessonId!=="string" || typeof entry[1].lastPracticedAt!=="string" || !Number.isSafeInteger(entry[1].encounters) || (entry[1].encounters as number)<1) throw new Error("Invalid review memory entry.");
        return [entry[0],{...entry[1],card:session.savedCards![index]}];
      }));
      delete decoded._reviewCardBank;
    } catch (cause) { errors.push(cause instanceof Error ? cause.message : "Review memory could not be restored."); }
  }
  if (!errors.length) delete decoded[POOL_KEY];
  return { value: decoded, errors };
}

export function serializeStoredState(state: LearnerState): string {
  const plain = JSON.stringify(state);
  if (plain.length * 2 < COMPACT_AFTER_BYTES) return plain;
  const packed = JSON.stringify(encodeStoredState(state));
  return packed.length < plain.length ? packed : plain;
}
