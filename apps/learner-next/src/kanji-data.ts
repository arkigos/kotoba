import data from "../../../data/jp/kanji/core_kanji.json";

export type KanjiEntry = (typeof data.entries)[number];
export type KanjiGroup = (typeof data.groups)[number];
export const coreKanji = data.entries;
export const kanjiGroups = data.groups;
export const kanjiSourceNote = data.sourceNote;

export const originLabels: Record<string, string> = {
  picture: "Pictograph",
  sign: "Sign",
  "combined-meaning": "Combined meanings",
  "sound-and-meaning": "Sound + meaning",
  "combined-and-sound": "Meaning + sound",
};

/** The images carry no text. Characters and readings remain accessible text. */
export function kanjiArtStyle(entry: KanjiEntry) {
  const group = kanjiGroups.find(item => item.id === entry.group)!;
  return {
    backgroundImage: `url(${import.meta.env.BASE_URL}${group.art.replace(/^\//, "")})`,
    backgroundSize: "500% 200%",
    backgroundPosition: `${(entry.artIndex % 5) * 25}% ${Math.floor(entry.artIndex / 5) * 100}%`,
  };
}

export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export type KanjiQuestion = { entry: KanjiEntry; choices: KanjiEntry[] };
export function kanjiQuestions(pool: KanjiEntry[], count = 8, random = Math.random): KanjiQuestion[] {
  return shuffled(pool, random).slice(0, Math.min(count, pool.length)).map(entry => {
    // Same-group distractors make the image and meaning matter; still use a
    // complete four-choice question when retrying one missed character.
    const others = coreKanji.filter(item => item.id !== entry.id);
    const same = shuffled(others.filter(item => item.group === entry.group), random);
    const choices = same.slice(0, 3);
    if (choices.length < 3) choices.push(...shuffled(others.filter(item => !choices.includes(item)), random).slice(0, 3 - choices.length));
    return { entry, choices: shuffled([entry, ...choices], random) };
  });
}
