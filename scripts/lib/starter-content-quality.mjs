// Reviewed teaching metadata and deterministic fixes for source defects exposed
// by the real Custom audit. No model calls, imported-POS guesses, or new IDs.
export const starterTeachingCorrections = {
  tokee: { function: "noun" },
  jugyoo: { function: "noun", meaning: "class" },
  "kiree-na": { surface: "きれい", reading: "きれい", meaning: "beautiful" },
  "suki-na": { surface: "すき", reading: "すき", meaning: "like" },
  "yuumee-na": { surface: "ゆうめい", reading: "ゆうめい", meaning: "famous" },
  "nigiyaka-na": { surface: "にぎやか", reading: "にぎやか", meaning: "lively" },
  "taihen-na": { surface: "たいへん", reading: "たいへん", meaning: "tough" },
  imooto: { meaning: "younger sister" }, otooto: { meaning: "younger brother" },
  kakkoii: { meaning: "cool" }, yasui: { meaning: "inexpensive" },
  ryoori: { meaning: "food" }, semai: { meaning: "cramped" }, hiroi: { meaning: "spacious" },
  tanoshii: { meaning: "fun" }, kaimonoshimasu: { meaning: "go shopping" },
  hajimemasu: { meaning: "start" },
};
export const funSubjectIds = new Set(["konsaato", "ibento", "paatii", "matsuri", "ryokoo", "sanpo", "shigoto", "jugyou", "jugyoo", "asobu", "hobi", "shumi", "eiga", "anime", "tenisu", "dansu", "karaoke", "kaimono", "supootsu", "sadou", "ikebana", "origami"]);
const personIds = new Set(["watashi", "anata", "watashitachi", "boku"]);
const cap = text => text.charAt(0).toUpperCase() + text.slice(1);
const grammar = (surface, reading = surface) => ({ surface, reading, explain: ({ は: "topic marker", が: "subject marker", を: "object marker", の: "possession marker", です: "polite ending" })[surface] ?? "grammar" });
const lexical = (word, form) => ({ wordId: word.id, surface: form?.[0] ?? word.surface, reading: form?.[1] ?? word.reading, explain: word.meaning });
const noun = word => word.meaning.split(/[;/,]/)[0].trim();
const subjectEnglish = word => ({ watashi: "I", boku: "I", anata: "you", watashitachi: "we" })[word.id] ?? `the ${noun(word)}`;

export function repairStarterContent(unit, availableWords) {
  const byId = new Map(availableWords.map(word => [word.id, { ...word, ...starterTeachingCorrections[word.id] }]));
  const choose = (ids, index) => { const words = ids.map(id => byId.get(id)).filter(Boolean); return words[index % words.length]; };
  const seen = new Set();
  return { ...unit, cards: unit.cards.map((card, index) => {
    let english = card.english;
    let tokens = card.tokens.map(token => {
      const correction = starterTeachingCorrections[token.wordId];
      if (!correction) return token;
      // Only dictionary notation is removed from realized forms. Never replace
      // an inflected token with a lemma from the dictionary.
      const surface = token.surface.replace(/[（(]な[）)]/g, "");
      const reading = token.reading.replace(/[（(]な[）)]/g, "");
      if (correction.meaning && token.explain.includes("/")) english = english.replaceAll(token.explain, correction.meaning);
      return { ...token, surface, reading, ...(correction.meaning ? { explain: correction.meaning } : {}) };
    });
    let tags = card.grammarTags;
    const wa = tokens.findIndex(token => token.surface === "は");
    const predicate = tokens.at(-2);
    if (tokens.at(-1)?.surface === "です" && predicate?.wordId === "tokee" && wa === 1) {
      const clock = tokens.at(-2);
      const owner = choose(["watashi", "anata", "sensei"], index);
      if (owner) {
        tokens = [lexical(owner), grammar("の"), clock, grammar("です")];
        const possessive = owner.id === "watashi" ? "my" : owner.id === "anata" ? "your" : `${subjectEnglish(owner)}'s`;
        english = `It is ${possessive} clock`;
        tags = [unit.grammarFocus, "NのNです", "validated content"];
      }
    } else if (tokens.at(-1)?.surface === "です" && predicate?.wordId === "suki-na" && wa === 1) {
      const object = byId.get(tokens[0].wordId);
      if (object) {
        tokens[1] = grammar("が");
        english = `I like ${noun(object)}`;
        tags = [unit.grammarFocus, "Nが好きです", "validated content"];
      }
    } else if (tokens.at(-1)?.surface === "です" && predicate?.wordId === "tanoshii" && wa === 1 && !funSubjectIds.has(tokens[0].wordId)) {
      const event = choose(["konsaato", "matsuri", "eiga", "shigoto"], index);
      if (event) { tokens[0] = lexical(event); english = `${cap(subjectEnglish(event))} is fun`; }
    } else if (tokens.at(-1)?.surface === "です" && predicate?.wordId === "kiree-na" && wa === 1 && ["konsaato", "ibento", "paatii"].includes(tokens[0].wordId)) {
      const thing = choose(["kimono", "shatsu", "niwa"], index);
      if (thing) { tokens[0] = lexical(thing); english = `${cap(subjectEnglish(thing))} is beautiful`; }
    }
    const verb = tokens.at(-1);
    if (verb?.wordId === "kaimonoshimasu") {
      const person = tokens.find(token => byId.get(token.wordId)?.function === "person");
      const plural = personIds.has(person?.wordId);
      english = english.replace(/\b(?:do shoppings|do shopping|go shoppings|go shopping)\b/g, plural ? "go shopping" : "goes shopping");
    }
    if (verb?.wordId === "hajimemasu") english = english.replace(/start\/to begin/g, "start");
    if (verb?.wordId === "tsukau" && !tokens.some(token => token.surface === "を")) {
      const tool = choose(["pen", "enpitsu", "pasokon"], index);
      if (tool) { tokens.splice(tokens.length - 1, 0, lexical(tool), grammar("を")); english = english.replace(/\b(use|uses)$/, `$1 the ${noun(tool)}`); }
    }
    // An imported "class/school lessons" gloss was incorrectly treated as a
    // physical destination. Practice the class with the reviewed start verb.
    if (tokens.some(token => token.wordId === "jugyoo") && tokens.some(token => ["tomaru", "kuru", "iku", "matsu"].includes(token.wordId))) {
      const lesson = byId.get("jugyoo"), start = byId.get("hajimemasu");
      const person = tokens.find(token => byId.get(token.wordId)?.function === "person");
      if (lesson && start && person) {
        tokens = [person, grammar("は", "わ"), lexical(lesson), grammar("を"), lexical(start)];
        english = `${cap(subjectEnglish(byId.get(person.wordId)))} ${personIds.has(person.wordId) ? "start" : "starts"} the class`;
      }
    }
    if (seen.has(tokens.map(token => token.surface).join(""))) {
      if (tokens.some(token => token.wordId === "tokee") && tags?.includes("validated content")) {
        const clock = tokens.find(token => token.wordId === "tokee");
        for (const id of ["watashi", "anata", "sensei", "gakusei"]) {
          const owner = byId.get(id);
          if (!owner) continue;
          const candidate = [lexical(owner), grammar("の"), clock, grammar("です")];
          if (seen.has(candidate.map(token => token.surface).join(""))) continue;
          tokens = candidate;
          const possessive = id === "watashi" ? "my" : id === "anata" ? "your" : `${subjectEnglish(owner)}'s`;
          english = `It is ${possessive} clock`;
          break;
        }
      } else if (tokens.at(-2)?.wordId === "tanoshii") {
        for (const id of ["konsaato", "matsuri", "eiga", "shigoto", "sanpo", "shumi"]) {
          const event = byId.get(id);
          if (!event) continue;
          const candidate = [lexical(event), ...tokens.slice(1)];
          if (seen.has(candidate.map(token => token.surface).join(""))) continue;
          tokens = candidate; english = `${cap(subjectEnglish(event))} is fun`; break;
        }
      }
    }
    seen.add(tokens.map(token => token.surface).join(""));
    if (JSON.stringify(tokens) === JSON.stringify(card.tokens) && english === card.english) return card;
    const { audioRef, audioText, ...rest } = card;
    return { ...rest, tokens, line: tokens.map(token => token.surface), tts: tokens.map(token => token.reading), explain: tokens.map(token => token.explain), english, grammarTags: tags };
  }) };
}
