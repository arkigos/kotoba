import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LessonBuilder } from "../src/LessonBuilder";
import { builderRecipes, compatibleSenses, generateLesson, templatesForLevel, type BuilderFocus, type BuilderLength } from "../src/generated";
import { requiredGrammar } from "../../../packages/learning-engine";
import { readState } from "../src/state";

afterEach(cleanup);

describe("lesson builder customization", () => {
  it("keeps every preset, length and focus inside grammar and coverage constraints", () => {
    for (const [key, template] of Object.entries(builderRecipes)) {
      for (const length of ["quick", "standard", "deep"] as BuilderLength[]) {
        for (const focus of ["balanced", "present", "negative", "past", "questions"] as BuilderFocus[]) {
          for (const seed of [42, 73]) {
            const snapshot = generateLesson(key, template.targetSenseIds, seed, false, { length, focus });
            const available = new Set(snapshot.recipe.knownGrammar);
            for (const phase of snapshot.recipe.phases) {
              phase.introduceGrammar?.forEach(grammar => available.add(grammar));
              expect(requiredGrammar(phase.construction, phase.features).every(grammar => available.has(grammar))).toBe(true);
            }
            for (const id of template.targetSenseIds) expect(snapshot.coverage[id]).toBeGreaterThanOrEqual(snapshot.recipe.minTargetExposures);
            expect(snapshot.cards.every(card => card.english && card.tokens.every(token => token.surface && token.reading))).toBe(true);
            if (focus === "present") expect(snapshot.cards.every(card => card.derivation.features.tense === "nonpast" && card.derivation.features.polarity === "positive" && !card.derivation.features.question)).toBe(true);
            if (focus === "questions") expect(snapshot.cards.at(-1)?.english).toMatch(/\?$/);
          }
        }
      }
    }
  });

  it("shortens or extends the actual materialized sequence without editing the preset", () => {
    const template = structuredClone(builderRecipes.classroom);
    const build = (length: BuilderLength) => generateLesson("classroom", template.targetSenseIds, 42, false, { length });
    expect(build("quick").cards.length).toBeLessThan(build("standard").cards.length);
    expect(build("deep").cards.length).toBeGreaterThan(build("standard").cards.length);
    expect(builderRecipes.classroom).toEqual(template);
  });

  it("searches words without losing selections and launches a selected preview position", () => {
    const start = vi.fn();
    render(<LessonBuilder onStart={start} onBack={vi.fn()} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search compatible words" }), { target: { value: "student" } });
    fireEvent.click(screen.getByRole("checkbox", { name: "Practice 学生" }));
    expect(screen.getByRole("button", { name: "Remove 日本語" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear word search" }));
    expect(screen.getByRole("checkbox", { name: "Practice 学生" })).toBeChecked();
    const preview = within(screen.getByRole("region", { name: "Lesson preview" }));
    expect(preview.getAllByRole("button", { name: /^Start at sentence/ }).length).toBeGreaterThanOrEqual(36);
    fireEvent.click(preview.getByRole("button", { name: /^Start at sentence 12:/ }));
    expect(start.mock.calls[0][1]).toBe(11);
    expect(start.mock.calls[0][0].recipe.targetSenseIds).toContain("gakusei.default");
  });

  it("sizes larger word pools to meet their practice requirements", () => {
    const targets = ["taberu.default", "pan.default", "gohan.rice", "yasai.default", "tamago.default", "niku.default", "kudamono.default", "gakusei.default", "sensei.default", "tomodachi.default"];
    const snapshot = generateLesson("meals", targets, 42);
    expect(snapshot.cards.length).toBeGreaterThan(builderRecipes.meals.phases.reduce((sum, phase) => sum + phase.count, 0));
    for (const target of targets) expect(snapshot.coverage[target]).toBeGreaterThanOrEqual(snapshot.recipe.minTargetExposures);
  });

  it("honors explicit card counts across templates instead of growing the lesson", () => {
    for (const [key, template] of Object.entries(builderRecipes)) {
      for (const cardCount of [12, 24, 36, 60]) {
        const snapshot = generateLesson(key, template.targetSenseIds, 42, false, { cardCount });
        expect(snapshot.cards).toHaveLength(cardCount);
        for (const target of template.targetSenseIds) expect(snapshot.coverage[target]).toBeGreaterThanOrEqual(snapshot.recipe.minTargetExposures);
      }
    }
    expect(() => generateLesson("classroom", builderRecipes.classroom.targetSenseIds, 42, false, { cardCount: 2 })).toThrow("Choose between 6 and 120 cards");
  });

  it("filters templates by their real grammar level", () => {
    expect(templatesForLevel("B2")).toEqual([]);
    expect(templatesForLevel("B2", true)).toContain("classroom");
    render(<LessonBuilder onStart={vi.fn()} onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "B2" }));
    expect(screen.getByText("No B2 templates yet")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Lesson preview" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show earlier templates" }));
    expect(screen.getByRole("region", { name: "Lesson preview" })).toBeInTheDocument();
    expect(screen.getByText("A1 · Actions · を")).toBeInTheDocument();
  });

  it("offers words that can participate in the selected template", () => {
    expect(compatibleSenses("classroom")).toContain("gakusei.default");
    expect(compatibleSenses("classroom")).not.toContain("pan.default");
    expect(compatibleSenses("meals")).not.toContain("nomu.default");
    expect(compatibleSenses("drinks")).toContain("mizu.default");
  });

  it("saves a named preview without starting and keeps the requested card count", () => {
    const onSave = vi.fn();
    const onStart = vi.fn();
    render(<LessonBuilder onStart={onStart} onSave={onSave} onBack={vi.fn()} initialCount={24} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Lesson name" }), { target: { value: "Reading practice" } });
    fireEvent.click(screen.getByRole("button", { name: "Save lesson" }));
    expect(onSave.mock.calls[0][0].cards).toHaveLength(24);
    expect(onSave.mock.calls[0][0].recipe.title).toBe("Reading practice");
    expect(onStart).not.toHaveBeenCalled();
  });

  it("allows new vocabulary by default and keeps target selections when filtering known words", () => {
    const state = readState();
    state.wordHistory = {};
    state.savedWordIds = ["yomu"];
    render(<LessonBuilder state={state} onStart={vi.fn()} onBack={vi.fn()} />);
    const pool = within(screen.getByRole("group", { name: "Word pool" }));
    expect(pool.getByRole("button", { name: /^All compatible words/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("checkbox", { name: "Practice 日本語" })).toBeInTheDocument();
    fireEvent.click(pool.getByRole("button", { name: /^My words/ }));
    expect(screen.getByRole("checkbox", { name: "Practice 読む" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Practice 日本語" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove 日本語" })).toBeInTheDocument();
    fireEvent.click(pool.getByRole("button", { name: /^New words/ }));
    expect(screen.queryByRole("checkbox", { name: "Practice 読む" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Practice 日本語" })).toBeInTheDocument();
  });
});
