import { describe, expect, it } from "vitest";
import { webcrypto } from "node:crypto";
import { pronunciationIdentity, pronunciationKey } from "../packages/dictionary/audio-key.mjs";
import { deduplicatePronunciations, estimatedCredits, pronunciationKeySync, selectWithinBudget, spokenIdentity, unambiguousLegacyRefs, uniqueSpeechRequests, unresolvedSpeechIdentities } from "../scripts/lib/dictionary-audio.mjs";

const word = { entryId: "jmdict:1", reading: "はし", text: "はし" };

describe("canonical dictionary audio", () => {
  it("protects unresolved speech across reading aliases but permits distinct inflections", () => {
    const forms = deduplicatePronunciations([
      word, { ...word, reading: 'はし（橋）' },
      { ...word, reading: 'はしだった', text: 'はしだった' },
      { ...word, entryId: 'jmdict:2' },
    ]);
    const pending = forms.find(form => form.reading === 'はし（橋）');
    const protectedSpeech = unresolvedSpeechIdentities(forms, { requests: { [pending.key]: {status:'needs-reconciliation'} } });
    expect(forms.filter(form => protectedSpeech.has(spokenIdentity(form)))).toHaveLength(2);
    expect(unresolvedSpeechIdentities(forms, { requests: { [pending.key]: {status:'complete'} } }).size).toBe(0);
    const currentForms = forms.filter(form => form.key !== pending.key);
    expect(unresolvedSpeechIdentities(currentForms, {requests:{[pending.key]:{status:'needs-reconciliation'}}}, {[pending.key]:pending}).has(spokenIdentity(word))).toBe(true);
    expect(unresolvedSpeechIdentities(currentForms, {requests:{[pending.key]:{...pending,status:'needs-reconciliation'}}}).has(spokenIdentity(word))).toBe(true);
  });
  it("shares spelling aliases, while keeping different entries, readings, prompts and accents separate", () => {
    const forms = deduplicatePronunciations([
      { ...word, surface: "橋", wordId: "hashi", existingRefs: ["/first.mp3"] },
      { ...word, surface: "はし", wordId: "hashi_alias", existingRefs: ["/second.mp3"] },
      { ...word, entryId: "jmdict:2" }, { ...word, reading: "ばし" }, { ...word, text: "はしです" }, { ...word, variant: "accent-1" },
    ]);
    expect(forms).toHaveLength(5);
    expect(forms.find((form) => form.wordIds.includes("hashi"))).toMatchObject({ wordIds: ["hashi", "hashi_alias"], existingRefs: ["/first.mp3", "/second.mp3"] });
  });

  it("uses exactly the same normalized identity in the browser and offline tool", async () => {
    expect(pronunciationIdentity({ ...word, reading: "か\u3099" })).toEqual(pronunciationIdentity({ ...word, reading: "が" }));
    expect(await pronunciationKey(word, webcrypto)).toBe(pronunciationKeySync(word));
    expect(() => pronunciationIdentity({ ...word, entryId: "" })).toThrow("entryId");
  });

  it("does not migrate an ambiguous shared legacy recording between dictionary entries", () => {
    const reusable = unambiguousLegacyRefs([
      { ...word, existingRefs: ["/shared.mp3", "/bridge.mp3"] },
      { ...word, entryId: "jmdict:2", existingRefs: ["/shared.mp3"] },
    ]);
    expect([...reusable]).toEqual(["/bridge.mp3"]);
  });

  it("shares explicit display-reading aliases only within one dictionary entry and accent variant", () => {
    const forms = uniqueSpeechRequests([
      { ...word, reading: "はし（橋）" }, word, { ...word, entryId: "jmdict:2" }, { ...word, variant: "accent-1" },
    ]);
    expect(forms).toHaveLength(3);
    expect(forms[0]).toBe(word);
  });

  it("cannot exceed either hard budget and leaves deferred words available for a later run", () => {
    const forms = [{ text: "にほんご" }, { text: "がくせい" }, { text: "ほん" }];
    const result = selectWithinBudget(forms, { maxCharacters: 6, maxRequests: 2 });
    expect(result).toMatchObject({ characters: 6, requests: 2, selected: [forms[0], forms[2]], deferred: [forms[1]] });
    expect(selectWithinBudget(forms, { maxCharacters: 100, maxRequests: 1 }).requests).toBe(1);
    expect(() => selectWithinBudget(forms, { maxCharacters: -1 })).toThrow();
    expect(estimatedCredits(101, "eleven_flash_v2_5")).toBe(51);
    expect(estimatedCredits(101, "eleven_multilingual_v2")).toBe(101);
  });
});
