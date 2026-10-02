/** Identity belongs to a dictionary entry and exact pronunciation, never a lesson. */
export function pronunciationIdentity({ entryId, reading, text, variant = "default" }) {
  const normalize = (value, name) => {
    if (typeof value !== "string" || !value.trim()) throw new Error(`Pronunciation ${name} is required.`);
    return value.normalize("NFC").trim();
  };
  return JSON.stringify([
    "kotoba-pronunciation-v1",
    normalize(entryId, "entryId"),
    normalize(reading, "reading"),
    normalize(text, "text"),
    normalize(variant, "variant"),
  ]);
}

export async function pronunciationKey(input, cryptoProvider = globalThis.crypto) {
  const bytes = new TextEncoder().encode(pronunciationIdentity(input));
  const digest = await cryptoProvider.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 24);
}
