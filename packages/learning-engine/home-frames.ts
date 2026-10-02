import { createFrameAuthor } from "./frame-author";
import { exampleLexicon } from "./examples";

/** Reviewed indoor settings and entities; imported POS cannot grant admission. */
export function homeCandidates(available: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  const interiors = ["heya", "ie", "apaato", "manshon", "kyooshitsu"];
  const objects = ["beddo", "eakon", "isu", "shashin", "teeburu", "tana", "sofa", "hon"];
  for (const object of exampleLexicon.entries) {
    if (object.kind !== "noun" || !objects.includes(object.wordId)) continue;
    add(`home-object-identity-${object.wordId}`, `It's ${object.english.predicate}`, [lex(object.wordId), g("です")], "identity");
    add(`home-object-question-${object.wordId}`, `Is it ${object.english.predicate}?`, [lex(object.wordId), g("です"), g("か")], "identity");
    add(`home-object-mine-${object.wordId}`, `It's my ${object.english.subject.replace(/^the /, "")}`, [lex("watashi"), g("の"), lex(object.wordId), g("です")], "possession");
  }
  for (const place of exampleLexicon.entries) {
    if (place.kind !== "noun" || !interiors.includes(place.wordId)) continue;
    const id = place.wordId;
    add(`home-identity-${id}`, `It's ${place.english.predicate}`, [lex(id), g("です")], "identity");
    add(`home-enter-question-${id}`, `Are you going into ${place.english.subject}?`, [lex(id), g("に"), lex("hairu", ["入ります", "はいります"]), g("か")], "entry-question");
    if (["ie", "apaato", "manshon"].includes(id)) {
      add(`home-residence-${id}`, `I live ${place.english.location}`, [lex(id), g("に"), lex("sumu", ["住んでいます", "すんでいます"])], "residence");
    }
    for (const entity of exampleLexicon.entries) {
      if (entity.kind !== "noun") continue;
      if (objects.includes(entity.wordId)) {
        add(`home-object-${id}-${entity.wordId}`, `There is ${entity.english.existential} ${place.english.location}`,
          [lex(id), g("に"), lex(entity.wordId), g("が"), lex("aru", ["あります", "あります"])], "existence-inanimate");
      }
      if (["sensei", "gakusei", "hito", "haha", "chichi", "ane", "otouto"].includes(entity.wordId)) {
        const subject = entity.english.subject;
        add(`home-person-${id}-${entity.wordId}`, `${subject[0].toUpperCase()}${subject.slice(1)} is ${place.english.location}`,
          [lex(entity.wordId), g("は"), lex(id), g("に"), lex("iru", ["います", "います"])], "existence-animate");
      }
    }
  }
  return cards;
}
