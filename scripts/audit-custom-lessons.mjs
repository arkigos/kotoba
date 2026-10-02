import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { writeCustomLessonReport } from "./lib/custom-lesson-report.mjs";

// Runs the actual browser lesson adapter against isolated profiles, never localStorage.
const root = fileURLToPath(new URL("../", import.meta.url));
const out = path.join(root, "docs/reviews/custom-lessons");
const server = await createServer({ root, configFile: false, server: { middlewareMode: true }, appType: "custom" });
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => {
  if (!/^\/dictionary\/jp\/entries\/[a-f0-9]{2}\.json$/.test(String(url))) throw new Error(`Unexpected audit fetch: ${url}`);
  return { ok: true, json: async () => JSON.parse(await fs.readFile(path.join(root, "public", String(url)), "utf8")) };
};
try {
  const { buildCustomLesson } = await server.ssrLoadModule("/apps/learner-next/src/custom-lesson.ts");
  const { readState, touchWordHistory } = await server.ssrLoadModule("/apps/learner-next/src/state.ts");
  const { prepareSession, resolveSessionCard } = await server.ssrLoadModule("/apps/learner-next/src/generated.ts");
  const { a1Topics, a1CoreWordIdsForTopic, a1WordMetadata } = await server.ssrLoadModule("/packages/dictionary/a1.ts");
  const { wordBindings } = await server.ssrLoadModule("/packages/dictionary/index.ts");
  const { measureCardTransition } = await server.ssrLoadModule("/apps/learner-next/src/lesson-transitions.ts");
  const { personalizedCandidates } = await server.ssrLoadModule("/packages/learning-engine/personalized.ts");
  const canonical = id => a1WordMetadata[id]?.coreWordId ?? id;
  const lexicalIds = Object.keys(wordBindings).filter(id => typeof wordBindings[id].introducedInUnit === "number" && wordBindings[id].introducedInUnit < 100);
  const grammar = Object.values(wordBindings).filter(word => typeof word.introducedInUnit !== "number");
  const isGrammar = token => grammar.some(word => word.surface === token.surface && [word.reading, word.audioText].includes(token.reading));
  const profiles = [
    { name: "fresh", known: [] },
    { name: "practiced-units-1-10", known: lexicalIds.filter(id => wordBindings[id].introducedInUnit <= 10) },
    { name: "practiced-all-a1", known: lexicalIds },
  ];
  const selections = [];
  for (const topic of a1Topics) {
    const ids = a1CoreWordIdsForTopic(topic.id);
    selections.push({ name: `${topic.id}-first`, ids: ids.slice(0, 12) }, { name: `${topic.id}-last`, ids: ids.slice(-12) });
  }
  // Every authored A1 ID, including optional words, gets exercised at least once.
  for (let offset = 0; offset < lexicalIds.length; offset += 12) selections.push({ name: `all-words-${offset}`, ids: lexicalIds.slice(offset, offset + 12) });
  let seed = 913;
  const shuffled = [...lexicalIds];
  for (let i = shuffled.length - 1; i > 0; i--) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; const j = seed % (i + 1); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
  for (const size of [1, 2, 6, 12, 30]) selections.push({ name: `mixed-${size}`, ids: shuffled.slice(0, size) });
  selections.push({ name: "explicit-aliases", ids: ["iku", "ikimasu", "asagohan", "asa-gohan"] },
    { name: "work-short", ids: ["enjinia", "kuni", "sumu", "kaishain", "nihon", "hataraku"], cardCount: 18 },
    { name: "single-book", ids: ["hon"] }, { name: "long-book", ids: ["hon"], cardCount: 480, expectedError: "repeats the same card too often" });
  const index = JSON.parse(await fs.readFile(path.join(root, "public/dictionary/jp/index.json"), "utf8"));
  const boundEntries = new Set(Object.values(wordBindings).map(word => word.entryId));
  const references = index.filter(row => !boundEntries.has(row[0]) && row[5] && row[6] === "n").slice(0, 2).map(row => row[0]);
  if (references.length !== 2) throw new Error("Could not select real unplaced dictionary entries");
  selections.push({ name: "references-only", ids: references }, { name: "reference-and-book", ids: ["hon", ...references] });
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const profile of profiles) {
    const fresh = readState();
    const state = { ...fresh, wordHistory: touchWordHistory(fresh, { wordIds: profile.known, kind: "reading" }) };
    const before = JSON.stringify(state);
    const known = new Set(profile.known.map(canonical));
    for (const selection of selections) {
      const started = performance.now();
      const key = `${profile.name}-${selection.name}`;
      try {
        const result = await buildCustomLesson(state, selection.ids, { cardCount: selection.cardCount, title: key });
        const { session } = result;
        const generatedContent = new Set(personalizedCandidates(selection.ids, known).map(card => JSON.stringify([card.tokens, card.english])));
        const groups = new Map();
        selection.ids.forEach(id => groups.set(canonical(id), [...(groups.get(canonical(id)) ?? []), id]));
        const appearances = Object.fromEntries(selection.ids.map(id => [id, 0]));
        const positions = Object.fromEntries(selection.ids.map(id => [id, []]));
        const unknown = new Set(), unreported = new Set(), unlinked = new Map(), uses = new Map();
        let maxUnknownPerCard = 0, alignmentErrors = 0, targetlessCards = 0, sourceErrors = 0, transitionErrors = 0, unknownCards = 0, run = 0, longestRepeat = 0, last;
        const cards = session.savedCards.map((card, i) => {
          const exact = new Set(card.tokens.flatMap(token => token.wordId ? [token.wordId] : []));
          const concepts = new Set([...exact].map(canonical));
          const targets = selection.ids.filter(id => groups.get(canonical(id)).length > 1 ? exact.has(id) : concepts.has(canonical(id)));
          targets.forEach(id => { appearances[id]++; positions[id].push(i + 1); });
          if (!targets.length) targetlessCards++;
          const extras = [...concepts].filter(id => !groups.has(id) && !known.has(id) && (!wordBindings[id] || typeof wordBindings[id].introducedInUnit === "number"));
          extras.forEach(id => { unknown.add(id); if (!session.lessonPlan.helperWordIds.includes(id)) unreported.add(id); });
          maxUnknownPerCard = Math.max(maxUnknownPerCard, extras.length);
          if (extras.length) unknownCards++;
          for (const token of card.tokens) if (!token.wordId && !isGrammar(token) && !/^[\p{P}\p{Z}\s]+$/u.test(token.surface)) unlinked.set(JSON.stringify([token.surface, token.reading]), { surface: token.surface, reading: token.reading, explain: token.explain });
          if (card.tokens.length > 1 && !generatedContent.has(JSON.stringify([card.tokens, card.english]))) sourceErrors++;
          if (i) {
            const actual = measureCardTransition(session.savedCards[i - 1], card);
            if (["kind", "lexicalChanges", "grammarChanged", "basis"].some(field => actual[field] !== session.lessonPlan.transitions[i][field])) transitionErrors++;
          }
          if (["line", "tts", "explain"].some((field, f) => JSON.stringify(card[field]) !== JSON.stringify(card.tokens.map(token => token[["surface", "reading", "explain"][f]])))) alignmentErrors++;
          const identity = JSON.stringify([card.line, card.tts, card.english]);
          uses.set(identity, (uses.get(identity) ?? 0) + 1);
          run = identity === last ? run + 1 : 1; longestRepeat = Math.max(longestRepeat, run); last = identity;
          return { index: i + 1, id: card.id, japanese: card.line.join(""), english: card.english, targets, unknown: extras, transition: session.lessonPlan.transitions[i] };
        });
        const errors = [];
        const counts = Object.values(appearances);
        if (counts.some(count => count < (selection.cardCount ? 6 : 8))) errors.push("appearance floor");
        if (Math.max(...counts) - Math.min(...counts) > 4) errors.push("coverage imbalance");
        if (JSON.stringify(appearances) !== JSON.stringify(result.appearances)) errors.push("reported appearances");
        if (unreported.size) errors.push("unreported unknown words");
        if (unknown.size || maxUnknownPerCard) errors.push("unselected unfamiliar words");
        if (selection.expectedError) errors.push("expected excessive repetition to be rejected");
        if (Math.max(...uses.values()) > 8) errors.push("excessive exact-card repetition");
        if (selection.name === "work-short" && uses.size < 4) errors.push("repeated two-sentence coverage loop");
        if (Math.max(...Object.values(positions).map(p => p[0])) > selection.ids.length) errors.push("late target introduction");
        if (alignmentErrors) errors.push("token alignment");
        if (targetlessCards) errors.push("targetless cards");
        if (sourceErrors) errors.push("unlicensed generated context");
        if (transitionErrors) errors.push("incorrect transition report");
        if (unlinked.size) errors.push("unclassified unlinked tokens");
        if (selection.cardCount && session.items.length !== selection.cardCount) errors.push("requested card count");
        if (JSON.stringify(state) !== before) errors.push("profile mutated");
        const restored = JSON.parse(JSON.stringify(session));
        await prepareSession(restored, state);
        if (restored.items.some((_, i) => JSON.stringify(resolveSessionCard(restored, i)) !== JSON.stringify(session.savedCards[i]))) errors.push("saved replay mismatch");
        const metric = { key, profile: profile.name, selection, cards: cards.length, contexts: result.contextCount, wordOnlyIds: result.wordOnlyIds,
          unknown: [...unknown], unknownCards, unreported: [...unreported], unlinked: [...unlinked.values()], maxUnknownPerCard,
          appearances, uniqueCards: uses.size, maxExactUses: Math.max(...uses.values()), longestRepeat,
          allIntroducedBy: Math.max(...Object.values(positions).map(p => p[0])),
          minimumSpan: Math.min(...Object.values(positions).map(p => p.at(-1) - p[0])),
          maximumGap: Math.max(0, ...Object.values(positions).flatMap(p => p.slice(1).map((n, i) => n - p[i]))),
          pacing: session.lessonPlan.pacing, errors, milliseconds: Math.round(performance.now() - started) };
        results.push(metric);
        await fs.writeFile(path.join(out, `${key}.json`), JSON.stringify({ ...metric, cardCount: metric.cards, knownIds: profile.known, cards, session }, null, 2) + "\n");
      } catch (error) { results.push({ key, profile: profile.name, selection, error: error.message,
        expectedRejection: !!selection.expectedError && error.message.includes(selection.expectedError) }); }
    }
    console.log(`${profile.name}: ${results.filter(r => r.profile === profile.name).length} lesson attempts`);
  }
  await fs.writeFile(path.join(out, "metrics.json"), JSON.stringify(results, null, 2) + "\n");
  const contentReview = await writeCustomLessonReport(out);
  console.log("Content review:", contentReview);
  const failures = results.filter(r => r.error ? !r.expectedRejection : r.errors.length);
  console.log(JSON.stringify({ attempted: results.length, generated: results.filter(r => !r.error).length, cards: results.reduce((sum, r) => sum + (r.cards ?? 0), 0), failures }, null, 2));
  if (failures.length) process.exitCode = 1;
  if (process.argv.includes("--strict-content") && contentReview.flaggedAppearances) process.exitCode = 1;
} finally { globalThis.fetch = originalFetch; await server.close(); }
