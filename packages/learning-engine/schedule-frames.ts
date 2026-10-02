import { createFrameAuthor } from "./frame-author";

export function scheduleCandidates(available: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  const times = [
    ["mainichi", "every day", ""], ["yoru", "at night", "は"], ["ashita", "tomorrow", "は"],
    ["kin-yoobi", "on Fridays", "は"], ["doyoobi", "on Saturdays", "は"], ["nichiyoobi", "on Sundays", "は"],
  ];
  const actions = [["neru", "寝ます", "ねます", "sleep"], ["yasumu", "休みます", "やすみます", "rest"], ["hataraku", "働きます", "はたらきます", "work"]];
  for (const [time, phrase, particle] of times) for (const [verb, surface, reading, english] of actions) {
    add(`routine-${time}-${verb}`, `${time === "ashita" ? "I'll" : "I"} ${english} ${phrase}`, [lex(time), ...(particle ? [g(particle)] : []), lex(verb, [surface, reading])], "routine");
  }
  for (const [day, name] of [["kin-yoobi", "Friday"], ["doyoobi", "Saturday"], ["nichiyoobi", "Sunday"]]) {
    add(`weekday-${day}`, `It's ${name}`, [lex(day), g("です")], "identity");
    add(`tomorrow-${day}`, `Tomorrow is ${name}`, [lex("ashita"), g("は"), lex(day), g("です")], "calendar");
    add(`night-${day}`, `I sleep on ${name} nights`, [lex(day), g("の"), lex("yoru"), g("は"), lex("neru", ["寝ます", "ねます"])], "night-routine");
  }
  return cards;
}
