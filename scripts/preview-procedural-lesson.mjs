import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
};
const recipeName = option("--recipe", "classroom");
const seed = Number(option("--seed", "42"));
// Vite runs the same browser-safe TypeScript; no additional runtime dependency.
const server = await createServer({ root, configFile: false, server: { middlewareMode: true }, appType: "custom" });
try {
  const { generateSession, wordAudioPlan } = await server.ssrLoadModule("/packages/learning-engine/index.ts");
  const { exampleLexicon, exampleRecipes, exampleReviewRecipe } = await server.ssrLoadModule("/packages/learning-engine/examples.ts");
  const selected = option("--words", "yomu,kaku").split(",");
  const recipe = recipeName === "review" ? exampleReviewRecipe(selected) : exampleRecipes[recipeName];
  if (!recipe) throw new Error(`Choose a recipe: ${Object.keys(exampleRecipes).join(", ")}, review`);
  const snapshot = generateSession(recipe, exampleLexicon, seed);
  const outputDir = path.join(root, "docs", "reviews", "procedural");
  await fs.mkdir(outputDir, { recursive: true });
  const stem = path.join(outputDir, recipeName);
  await fs.writeFile(`${stem}.json`, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  const rows = snapshot.cards.map((card, index) => `| ${index + 1} | ${card.line.join("")} | ${card.english} | ${snapshot.transitions[index].kind}: ${snapshot.transitions[index].changedSlots.join(", ") || "—"} |`);
  const report = [`# ${recipe.title}`, "", `Seed: ${seed}; engine ${snapshot.engineVersion}; lexicon ${snapshot.lexiconVersion}.`, "", "Generated engine preview, not a migrated course unit. Audio plans contain individual realized words only.", "", "## Target exposure", "", ...recipe.targetSenseIds.map(id => `- ${id}: ${snapshot.coverage[id]}`), "", "## Cards", "", "| Card | Japanese | English | Change |", "| --- | --- | --- | --- |", ...rows, "", "## First-card word audio", "", "```json", JSON.stringify(wordAudioPlan(snapshot.cards[0]), null, 2), "```", ""].join("\n");
  await fs.writeFile(`${stem}.md`, report, "utf8");
  console.log(`${snapshot.cards.length} generated cards; every target reached its exposure floor.`);
  console.log(`Report: ${stem}.md`);
  console.log(`Snapshot: ${stem}.json`);
} catch (error) {
  console.error(error.code ? `${error.code}: ${error.message}` : error.message);
  if (error.details) console.error(JSON.stringify(error.details, null, 2));
  process.exitCode = 1;
} finally {
  await server.close();
}
