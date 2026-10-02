import { createServer } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const server = await createServer({ root, configFile: false, server: { middlewareMode: true }, appType: "custom" });
try {
  const { builderLexicon, builderRecipes, compatibleSenses, generateLesson } = await server.ssrLoadModule("/apps/learner-next/src/generated.ts");
  const { semanticCompatibility } = await server.ssrLoadModule("/packages/learning-engine/index.ts");
  const entries = new Map(builderLexicon.entries.map(entry => [entry.id, entry]));
  const templateWords = Object.fromEntries(Object.keys(builderRecipes).map(key => [key, new Set(compatibleSenses(key))]));
  const supported = [...new Set(Object.values(templateWords).flatMap(ids => [...ids]))];
  const failures = [];
  let cards = 0;
  for (const id of supported) {
    let example;
    const reasons = [];
    for (const [key, ids] of Object.entries(templateWords)) {
      if (!ids.has(id)) continue;
      try {
        const snapshot = generateLesson(key, [id], 42, true, { cardCount: 12 });
        for (const card of snapshot.cards) {
          const bound = Object.fromEntries(Object.entries(card.derivation.bindings).map(([slot, senseId]) => [slot, entries.get(senseId)]));
          const problem = semanticCompatibility(card.derivation.construction, bound);
          if (problem) throw new Error(problem);
        }
        if ((snapshot.coverage[id] ?? 0) < snapshot.recipe.minTargetExposures) throw new Error("Exposure floor missed");
        example = snapshot;
        cards += snapshot.cards.length;
        break;
      } catch (error) { reasons.push(`${key}: ${error.message}`); }
    }
    if (!example) failures.push({ id, reasons });
  }
  console.log(JSON.stringify({ lexiconSenses: builderLexicon.entries.length, supportedSenses: supported.length, generatedCards: cards,
    templates: Object.fromEntries(Object.entries(templateWords).map(([key, ids]) => [key, ids.size])), failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally { await server.close(); }
