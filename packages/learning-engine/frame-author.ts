import { dictionaryWord } from "../dictionary";
import type { CardToken, PracticeCard } from "./types";

/** Materialize authored frames only when every lexical identity is available. */
export function createFrameAuthor(available: ReadonlySet<string>) {
  const cards: PracticeCard[] = [];
  const lex = (id: string, form?: [string, string]): CardToken | undefined => {
    const word = available.has(id) ? dictionaryWord(id) : undefined;
    return word && { wordId: id, surface: form?.[0] ?? word.surface, reading: form?.[1] ?? word.reading,
      explain: word.meaning, dictionaryEntryId: word.dictionaryEntryId };
  };
  const g = (surface: string, explanation?: string): CardToken => ({ surface, reading: surface === "は" ? "わ" : surface,
    explain: explanation ?? ({ は: "topic marker", が: "subject marker", の: "possession / description marker", と: "with", で: "in / as a group", に: "location / time marker", を: "object marker", です: "polite ending", か: "question marker" } as Record<string, string>)[surface] ?? "grammar" });
  const add = (id: string, english: string, tokens: (CardToken | undefined)[], constructionKey?: string) => {
    if (tokens.some(token => !token)) return;
    const complete = tokens as CardToken[];
    cards.push({ id: `reviewed-${id}`, tokens: complete, line: complete.map(t => t.surface), tts: complete.map(t => t.reading),
      explain: complete.map(t => t.explain), english, grammarTags: ["reviewed personal context"], ...(constructionKey ? { constructionKey } : {}) });
  };
  return { cards, lex, g, add };
}
