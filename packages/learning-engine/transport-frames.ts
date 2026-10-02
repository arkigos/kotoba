import { createFrameAuthor } from "./frame-author";

export function transportCandidates(available: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  // Subway is the train sense here, not a generic destination or physical noun.
  const vehicles = [["basu", "bus"], ["densha", "train"], ["chikatetsu", "subway train"]];
  const stops = [["eki", "station"], ["kuukou", "airport"]];
  for (const [id, english] of vehicles) {
    add(`transport-identity-${id}`, `It's a ${english}`, [lex(id), g("です")], "identity");
    add(`board-${id}`, `I get on the ${english}`, [lex(id), g("に", "vehicle boarded"), lex("noru", ["乗ります", "のります"])], "boarding");
    add(`alight-${id}`, `I get off the ${english}`, [lex(id), g("を", "vehicle left"), lex("oriru", ["降ります", "おります"])], "alighting");
    for (const [stop, name] of stops) {
      add(`board-${id}-${stop}`, `I get on the ${english} at the ${name}`, [lex(stop), g("で", "place of action"), lex(id), g("に", "vehicle boarded"), lex("noru", ["乗ります", "のります"])], "boarding-location");
      add(`alight-${id}-${stop}`, `I get off the ${english} at the ${name}`, [lex(stop), g("で", "place of action"), lex(id), g("を", "vehicle left"), lex("oriru", ["降ります", "おります"])], "alighting-location");
      add(`arrive-by-${id}-${stop}`, `I arrive at the ${name} by ${id === "chikatetsu" ? "subway" : english}`, [lex(id), g("で", "means of transport"), lex(stop), g("に", "arrival destination"), lex("tsuku", ["着きます", "つきます"])], "arrival-transport");
    }
  }
  for (const [stop, name] of stops) {
    add(`arrive-${stop}`, `I arrive at the ${name}`, [lex(stop), g("に", "arrival destination"), lex("tsuku", ["着きます", "つきます"])], "arrival");
    add(`get-off-at-${stop}`, `I get off at the ${name}`, [lex(stop), g("で", "place of action"), lex("oriru", ["降ります", "おります"])], "alighting-location");
  }
  return cards;
}
