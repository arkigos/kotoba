import { createFrameAuthor } from "./frame-author";
import { exampleLexicon } from "./examples";

export function dailyLifeCandidates(available: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  const actions = [
    ["okiru", "起きます", "おきます", "get up", "getting up"],
    ["iku", "行きます", "いきます", "go", "going"],
    ["kuru", "来ます", "きます", "come", "coming"],
  ] as const;
  for (const [id, surface, reading, english, planned] of actions) {
    add(`daily-question-${id}`, `Are you ${planned}?`, [lex(id, [surface, reading]), g("か")], "intransitive-question");
    add(`daily-early-${id}`, `I ${english} early`, [lex("hayai", ["早く", "はやく"]), lex(id, [surface, reading])], "early-action");
    for (const [time, phrase] of [["asa", "in the morning"], ["gozen", "in the morning"], ["gogo", "in the afternoon"]]) {
      add(`daily-${time}-${id}`, `I ${english} ${phrase}`, [lex(time), g("は"), lex(id, [surface, reading])], "time-action");
    }
    add(`daily-noon-${id}`, `I ${english} at noon`, [lex("hiru"), g("に"), lex(id, [surface, reading])], "time-action");
  }
  add("noon-identify", "It's noon", [lex("hiru"), g("です")], "identity");
  add("noon-question", "Is it noon?", [lex("hiru"), g("です"), g("か")], "identity");
  add("enter-question", "Are you going in?", [lex("hairu", ["入ります", "はいります"]), g("か")], "entry-question");
  add("enter-with-subject", "I go in", [lex("watashi"), g("は"), lex("hairu", ["入ります", "はいります"])], "entry");
  // Entering an interior is distinct from arriving in a country or open park.
  const interiors = ["gakkou", "heya", "ie", "mise", "byouin", "depaato", "ginkou", "hoteru", "kyooshitsu"];
  for (const place of exampleLexicon.entries) {
    if (place.kind !== "noun" || !interiors.includes(place.wordId)) continue;
    add(`enter-${place.wordId}`, `I enter ${place.english.subject}`, [lex(place.wordId), g("に"), lex("hairu", ["入ります", "はいります"])], "entry");
  }
  for (const birthday of ["tanjoubi", "tanjoobi"]) {
    add(`birthday-${birthday}`, "It's my birthday", [lex(birthday), g("です")], "identity");
    add(`birthday-question-${birthday}`, "Is it your birthday?", [lex(birthday), g("です"), g("か")], "identity");
    add(`my-birthday-${birthday}`, "It's my birthday", [lex("watashi"), g("の"), lex(birthday), g("です")], "identity");
    add(`your-birthday-${birthday}`, "Is it your birthday?", [lex("anata"), g("の"), lex(birthday), g("です"), g("か")], "identity");
    add(`birthday-work-${birthday}`, "I work on my birthday", [lex(birthday), g("は"), lex("hataraku", ["働きます", "はたらきます"])], "time-action");
  }
  return cards;
}
