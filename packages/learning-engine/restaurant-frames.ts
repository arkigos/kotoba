import { createFrameAuthor } from "./frame-author";
import { exampleLexicon } from "./examples";

export function restaurantCandidates(available: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  add("enter-restaurant", "I enter the restaurant", [lex("resutoran"), g("に"), lex("hairu", ["入ります", "はいります"])], "entry");
  add("early-breakfast", "Breakfast is early", [lex("asagohan"), g("は"), lex("hayai"), g("です")], "i-predicate");
  add("early-breakfast-question", "Is breakfast early?", [lex("asagohan"), g("は"), lex("hayai"), g("です"), g("か")], "i-predicate");
  add("restaurant-menu", "It's the restaurant's menu", [lex("resutoran"), g("の"), lex("menyuu"), g("です")], "possession");
  add("menu-request", "A menu, please", [lex("menyuu"), g("を"), lex("onegaishimasu")], "request");
  add("menu-read", "I read the menu", [lex("menyuu"), g("を"), lex("yomu", ["読みます", "よみます"])], "reading");
  add("restaurant-identify", "It's a restaurant", [lex("resutoran"), g("です")], "identity");
  add("restaurant-question", "Is it a restaurant?", [lex("resutoran"), g("です"), g("か")], "identity");
  add("choose-restaurant", "I choose a restaurant", [lex("resutoran"), g("を"), lex("erabu", ["選びます", "えらびます"])], "choice");
  add("delicious", "It's delicious", [lex("oishii"), g("です")], "i-predicate");
  add("delicious-question", "Is it delicious?", [lex("oishii"), g("です"), g("か")], "i-predicate");
  add("eat-question", "Are you going to eat?", [lex("taberu", ["食べます", "たべます"]), g("か")], "eating-question");
  add("drink-question", "Are you going to drink?", [lex("nomu", ["飲みます", "のみます"]), g("か")], "drinking-question");
  for (const food of exampleLexicon.entries) {
    if (food.kind !== "noun" || !food.semanticTags?.some(tag => tag === "food" || tag === "drink")) continue;
    const phrase = food.english.predicate;
    if (food.semanticTags.includes("drink")) {
      add(`drink-${food.wordId}`, `I drink ${phrase}`, [lex(food.wordId), g("を"), lex("nomu", ["飲みます", "のみます"])], "drinking");
      add(`drink-question-${food.wordId}`, `Do you drink ${phrase}?`, [lex(food.wordId), g("を"), lex("nomu", ["飲みます", "のみます"]), g("か")], "drinking-question");
    }
    add(`request-${food.wordId}`, `${phrase[0].toUpperCase()}${phrase.slice(1)}, please`, [lex(food.wordId), g("を"), lex("onegaishimasu")], "request");
    add(`choose-food-${food.wordId}`, `I choose ${phrase}`, [lex(food.wordId), g("を"), lex("erabu", ["選びます", "えらびます"])], "choice");
    if (food.semanticTags.includes("food")) {
      add(`restaurant-eat-${food.wordId}`, `I eat ${phrase} at the restaurant`, [lex("resutoran"), g("で", "place of action"), lex(food.wordId), g("を"), lex("taberu", ["食べます", "たべます"])], "dining");
    }
  }
  return cards;
}
