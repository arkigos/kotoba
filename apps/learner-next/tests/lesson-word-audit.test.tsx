import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { auditLessonWords } from "../src/lesson-word-audit";
import { LessonWordAudit } from "../src/LessonWordAudit";
import type { ActiveSession, CardToken, PracticeCard } from "../src/types";

const token = (wordId: string, surface = wordId): CardToken => ({ wordId, surface, reading: surface, explain: wordId });
const card = (tokens: CardToken[]): PracticeCard => ({ id: "card", tokens, line: tokens.map(t => t.surface), tts: tokens.map(t => t.reading), explain: [], english: "Fixture" });
const session = (cards: PracticeCard[]): ActiveSession => ({ id: "test", length: "standard", startedAt: "2026-09-23T12:00:00Z", cursor: 0, scores: [], items: cards.map(c => ({ cardId: c.id, prompt: "explore", reason: "Fixture" })), targetWordIds: ["watashi"], lessonPlan: { version: 1, cardCount: cards.length, appearances: { watashi: 999 }, newWordIds: ["watashi"], helperWordIds: [], reviewWordIds: [] } });

describe("saved lesson word-use groups", () => {
  it("counts the user's ten uses as four groups of 4, 2, 1, 3 with three intervening gaps", () => {
    const positions = [1, 2, 3, 4, 6, 7, 9, 11, 12, 13];
    const cards = Array.from({ length: 15 }, (_, i) => card(positions.includes(i + 1) ? [token("watashi")] : []));
    const row = auditLessonWords(cards, session(cards))[0];
    expect(row.positions).toEqual(positions);
    expect(row.occurrences).toBe(10);
    expect(row.groups.map(g => g.end - g.start + 1)).toEqual([4, 2, 1, 3]);
    expect(row.gaps).toEqual([1, 1, 1]); // excludes the two trailing unused cards
  });

  it("counts token repetitions separately, preserves adjacent review runs, and derives totals from cards", () => {
    const cards = [card([token("watashi"), token("watashi")]), card([token("watashi")]), card([]), card([token("watashi")])];
    const saved = session(cards);
    saved.items[1].section = "recent-review";
    saved.items[3].section = "due-review";
    const before = JSON.stringify(saved);
    const [row] = auditLessonWords(cards, saved);
    expect(row).toMatchObject({ occurrences: 4, positions: [1, 2, 4], coreCards: 1, reviewCards: 2, role: "New target", groups: [{ start: 1, end: 2 }, { start: 4, end: 4 }], gaps: [1] });
    expect(JSON.stringify(saved)).toBe(before);
  });

  it("joins explicitly authored word aliases, not unrelated homophones", () => {
    const rows = auditLessonWords([card([token("au", "会う")]), card([token("aimasu", "会います")]), card([token("other", "会う")])]);
    expect(rows.find(r => r.id === "au")).toMatchObject({ positions: [1, 2], forms: ["会う", "会います"], groups: [{ start: 1, end: 2 }] });
    expect(rows.find(r => r.id === "other")?.positions).toEqual([3]);
  });

  it("keeps grammar, unknown unlinked content, missing targets and review provenance distinct", () => {
    const cards = [card([{ surface: "は", reading: "わ", explain: "topic" }, { surface: "謎", reading: "なぞ", explain: "mystery" }, { surface: "。", reading: "", explain: "" }]), card([token("sensei")])];
    const saved = session(cards);
    saved.items[1].section = "recent-review";
    const rows = auditLessonWords(cards, saved);
    expect(rows[0]).toMatchObject({ id: "watashi", role: "New target", groups: [], occurrences: 0 });
    expect(rows.find(r => r.forms.includes("は"))?.role).toBe("Authored grammar");
    expect(rows.find(r => r.forms.includes("謎"))?.role).toContain("unrecorded");
    expect(rows.some(r => r.forms.includes("。"))).toBe(false);
    expect(rows.find(r => r.id === "sensei")?.role).toBe("Review vocabulary · copied card");
    delete saved.lessonPlan;
    expect(auditLessonWords(cards, saved)[0].role).toContain("unrecorded");
  });

  it("renders an inspectable table from the saved sequence without using stored appearance totals", () => {
    const cards = [card([token("watashi", "私")]), card([]), card([token("watashi", "私")])];
    render(<LessonWordAudit cards={cards} session={session(cards)} />);
    const table = screen.getByRole("table", { hidden: true });
    expect(within(table).getByText("New target")).toBeInTheDocument();
    expect(within(table).getByText("1, 3")).toBeInTheDocument();
    expect(within(table).queryByText("999")).not.toBeInTheDocument();
  });
});
