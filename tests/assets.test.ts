import { describe, expect, it } from "vitest";
import { getUnit, unitIndex } from "../src/data";

describe("asset references", () => {
  it("gives every authored card an image ref after asset sync", async () => {
    for (const entry of unitIndex.units) {
      const unit = await getUnit(entry.id);
      expect(unit.cards.length).toBeGreaterThanOrEqual(80);
      expect(unit.cards.length).toBeLessThanOrEqual(150);
      expect(new Set(unit.cards.map((card) => card.imageRef)).size).toBeGreaterThanOrEqual(5);
      for (const card of unit.cards) {
        expect(card.imageRef).toMatch(/^\/media\/jp\/images\/unit_\d{3}\//);
      }
    }
  });
});
