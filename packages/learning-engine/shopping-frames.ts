import { createFrameAuthor } from "./frame-author";
import { exampleLexicon } from "./examples";

// Concrete, reviewed purchasable senses. This list is not inferred from POS.
export const shoppingObjects = ["ehagaki", "kaado", "kasa", "omiyage", "tiishatsu", "hashi", "hankachi", "beddo", "eakon", "isu", "teeburu", "terebi", "gitaa", "piano", "nimotsu", "shashin", "kimono", "shatsu", "jaketto", "kutsu", "kutsushita"];
export function shoppingCandidates(available: ReadonlySet<string>, selected?: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  add("offer-to-choose", "I'll choose", [lex("watashi"), g("が"), lex("erabu", ["選びます", "えらびます"])], "choice-offer");
  add("choose-question", "Will you choose?", [lex("erabu", ["選びます", "えらびます"]), g("か")], "choice-question");
  // When the learner selected things to choose, practice choosing those things.
  // Familiar unrelated objects should not consume the verb's exposure budget.
  const focusedChoice = exampleLexicon.entries.some(entry => entry.kind === "noun" && entry.roles.includes("object") && selected?.has(entry.wordId));
  for (const object of exampleLexicon.entries) {
    if (object.kind !== "noun" || !shoppingObjects.includes(object.wordId)) continue;
    const id = object.wordId, phrase = object.english.predicate;
    const plural = object.english.agreement === "other";
    const subject = object.english.subject.replace(/^the /, "");
    add(`object-identify-${id}`, `${plural ? "These are" : "It's"} ${phrase}`, [lex(id), g("です")], "identity");
    add(`object-question-${id}`, `${plural ? "Are these" : "Is it"} ${phrase}?`, [lex(id), g("です"), g("か")], "identity");
    add(`object-mine-${id}`, `${plural ? "These are" : "It's"} my ${subject}`, [lex("watashi"), g("の"), lex(id), g("です")], "possession");
    // 荷物 is someone's luggage, not a product noun for buying luggage equipment.
    if (id === "nimotsu") continue;
    add(`object-want-${id}`, `I want ${phrase}`, [lex(id), g("が"), lex("hoshii"), g("です")], "want");
    if (!focusedChoice || selected?.has(id)) add(`object-choose-${id}`, `I choose ${phrase}`, [lex(id), g("を"), lex("erabu", ["選びます", "えらびます"])], "choice");
    add(`object-buy-${id}`, `I buy ${phrase}`, [lex(id), g("を"), lex("kaimasu")], "purchase");
    for (const [place, english] of [["mise", "the shop"], ["depaato", "the department store"]]) {
      add(`object-buy-${place}-${id}`, `I buy ${phrase} at ${english}`, [lex(place), g("で"), lex(id), g("を"), lex("kaimasu")], "purchase-place");
      if (!focusedChoice || selected?.has(id)) add(`object-choose-${place}-${id}`, `I choose ${phrase} at ${english}`, [lex(place), g("で"), lex(id), g("を"), lex("erabu", ["選びます", "えらびます"])], "choice-place");
    }
    if (["omiyage", "ehagaki", "kaado", "hashi", "hankachi"].includes(id)) {
      add(`object-give-${id}`, `I give ${phrase}`, [lex(id), g("を"), lex("ageru", ["あげます", "あげます"])], "gift");
      for (const [person, english] of [["ane", "my older sister"], ["otouto", "my younger brother"], ["tomodachi", "my friend"]]) {
        add(`object-give-${person}-${id}`, `I give ${phrase} to ${english}`, [lex(person), g("に"), lex(id), g("を"), lex("ageru", ["あげます", "あげます"])], "gift-recipient");
      }
    }
    if (["tiishatsu", "kasa", "hankachi", "kaado", "kimono"].includes(id)) {
      for (const [color, english] of [["aka", "red"], ["ao", "blue"], ["shiro", "white"]]) {
        const colored = `${/^[aeiou]/.test(english) ? "an" : "a"} ${english} ${subject}`;
        add(`color-object-${color}-${id}`, `It's ${colored}`, [lex(color), g("の"), lex(id), g("です")], "color-object");
        if (!focusedChoice || selected?.has(id)) add(`choose-color-${color}-${id}`, `I choose ${colored}`, [lex(color), g("の"), lex(id), g("を"), lex("erabu", ["選びます", "えらびます"])], "choice");
      }
    }
  }
  for (const [size, english] of [["ookii", "large"], ["chiisai", "small"]]) {
    add(`size-${size}`, `It's a ${english} size`, [lex(size), lex("saizu"), g("です")], "size");
    for (const [item, name] of [["shatsu", "shirt"], ["jaketto", "jacket"]]) {
      add(`size-${size}-${item}`, `It's a ${name} in a ${english} size`, [lex(size), lex("saizu"), g("の"), lex(item), g("です")], "garment-size");
    }
  }
  // Small, reviewed shopping pairs, not an arbitrary noun Cartesian product.
  for (const [left, right, phrase] of [["isu", "teeburu", "a chair and a table"], ["beddo", "eakon", "a bed and an air conditioner"], ["gitaa", "piano", "a guitar and a piano"], ["hankachi", "hashi", "a handkerchief and chopsticks"]]) {
    if (focusedChoice && !selected?.has(left) && !selected?.has(right)) continue;
    add(`choose-pair-${left}-${right}`, `I choose ${phrase}`, [lex(left), g("と", "and"), lex(right), g("を"), lex("erabu", ["選びます", "えらびます"])], "choice-pair");
  }
  return cards;
}
