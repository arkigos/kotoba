import fs from "node:fs/promises";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const server = await createServer({root, configFile: false, server: {middlewareMode: true}, appType: "custom"});
try {
  const { exampleLexicon } = await server.ssrLoadModule("/packages/learning-engine/examples.ts");
  const { inflectVerb, inflectAdjective, politeCopula } = await server.ssrLoadModule("/packages/learning-engine/morphology.ts");
  const { wordBindings } = await server.ssrLoadModule("/packages/dictionary/index.ts");
  const forms = [];
  const add = (wordId, form) => forms.push({wordId, ...form, text: form.reading});
  for (const word of exampleLexicon.entries) {
    add(word.wordId, word.lemma);
    if (word.kind === "verb") for (const form of ["polite", "polite-negative", "polite-past", "polite-negative-past"]) add(word.wordId, inflectVerb(word, form));
    if (word.kind === "i-adjective") for (const form of ["nonpast", "negative", "past", "negative-past"]) add(word.wordId, inflectAdjective(word, form));
  }
  for (const tense of ["nonpast", "past"]) for (const polarity of ["positive", "negative"]) {
    const form = politeCopula({tense, polarity, question: false});
    const binding = Object.entries(wordBindings).find(([, word]) => word.surface === form.surface && !word.introducedInUnit);
    if (binding) add(binding[0], form);
  }
  const objectParticle = Object.entries(wordBindings).find(([, word]) => word.surface === "を" && !word.introducedInUnit);
  if (objectParticle) add(objectParticle[0], {surface: "を", reading: "お"});
  const unique = [...new Map(forms.map(form => [JSON.stringify([form.wordId, form.reading, form.text]), form])).values()];
  await fs.writeFile(new URL("../data/jp/dictionary/audio_forms.json", import.meta.url), JSON.stringify({schemaVersion:1, generatedFrom:"reviewed procedural grammar forms",forms:unique},null,2)+"\n");
  console.log(`Synced ${unique.length} reviewed procedural pronunciations.`);
} finally { await server.close(); }
