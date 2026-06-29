import { describe, expect, it } from "vitest";
import { getUnit, unitIndex } from "../src/data";
import unit001Manifest from "../data/jp/media/manifests/unit_001.assets.json";

type AudioManifestEntry = {
  cardId: string;
  status: string;
  path: string;
  text: string;
};

describe("asset manifests", () => {
  it("keeps every authored card covered by audio fallback metadata", async () => {
    for (const entry of unitIndex.units) {
      const unit = await getUnit(entry.id);
      const manifest =
        entry.id === 1
          ? unit001Manifest
          : (await import(`../data/jp/media/manifests/unit_${String(entry.id).padStart(3, "0")}.assets.json`)).default;
      const audioByCard = new Map((manifest.audio as AudioManifestEntry[]).map((asset) => [asset.cardId, asset]));
      expect(unit.cards.length).toBeGreaterThanOrEqual(80);
      expect(unit.cards.length).toBeLessThanOrEqual(150);
      for (const card of unit.cards) {
        expect(audioByCard.get(card.id)).toMatchObject({
          status: expect.stringMatching(/queued|complete/),
          text: expect.any(String),
        });
      }
    }
  });
});
