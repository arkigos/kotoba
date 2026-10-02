import { createServer } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const server = await createServer({ root, configFile: false, server: { middlewareMode: true }, appType: "custom" });
try {
  const { generateSession, semanticCompatibility } = await server.ssrLoadModule("/packages/learning-engine/index.ts");
  const { exampleLexicon } = await server.ssrLoadModule("/packages/learning-engine/examples.ts");
  const { builderRecipes } = await server.ssrLoadModule("/apps/learner-next/src/generated.ts");
  const entries = new Map(exampleLexicon.entries.map(entry => [entry.id, entry]));
  const rows = [];
  for (const [name, recipe] of Object.entries(builderRecipes)) {
    const unique = new Map();
    let cards = 0;
    for (const seed of [0, 1, 2, 7, 17, 42, 91, 123, 2026, 65535, 999999, 4294967295]) {
      const snapshot = generateSession(recipe, exampleLexicon, seed);
      for (const card of snapshot.cards) {
        const bound = Object.fromEntries(Object.entries(card.derivation.bindings).map(([slot, id]) => [slot, entries.get(id)]));
        const problem = semanticCompatibility(card.derivation.construction, bound);
        if (problem) throw new Error(`${name}/${seed}: ${problem}`);
        if (card.tokens.filter(token => token.wordId).length < 2) throw new Error(`${name}/${seed}: isolated vocabulary fragment`);
        if (/\b(read|reads|write|writes|eat|eats|drink|drinks) (you|me|the teacher|the student)\b/i.test(card.english)) throw new Error(`${name}/${seed}: suspicious literal object: ${card.english}`);
        if (card.derivation.construction === "identity" && card.derivation.bindings.subject === card.derivation.bindings.predicate) throw new Error(`${name}/${seed}: tautological identity`);
        unique.set(card.id, { japanese: card.line.join(""), english: card.english });
      }
      cards += snapshot.cards.length;
    }
    rows.push({ template: name, seeds: 12, cards, distinctSentences: unique.size, examples: [...unique.values()].slice(0, 2) });
  }
  console.log(JSON.stringify({ sessions: rows.length * 12, cards: rows.reduce((count, row) => count + row.cards, 0), scope: "Reviewed literal compatibility and fragment/identity checks, not a universal Japanese grammar proof", templates: rows }, null, 2));
} finally {
  await server.close();
}
