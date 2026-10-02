import { createFrameAuthor } from "./frame-author";

export function leisureCandidates(available: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  const events = [["konsaato", "the concert", "a concert"], ["paatii", "the party", "a party"], ["matsuri", "the festival", "a festival"]];
  for (const [event, name, indefinite] of events) {
    add(`event-identify-${event}`, `It's ${indefinite}`, [lex(event), g("です")], "identity");
    add(`event-question-${event}`, `Is it ${indefinite}?`, [lex(event), g("です"), g("か")], "identity");
    add(`event-photo-${event}`, `It's a photograph of ${name}`, [lex(event), g("の"), lex("shashin"), g("です")], "photograph-of-event");
    add(`event-meet-${event}`, `We'll meet at ${name}`, [lex(event), g("で"), lex("au", ["会います", "あいます"])], "meeting");
    add(`event-sing-${event}`, `I sing at ${name}`, [lex(event), g("で"), lex("utau", ["歌います", "うたいます"])], "performance");
    add(`event-take-photo-${event}`, `I take a photograph at ${name}`, [lex(event), g("で"), lex("shashin"), g("を"), lex("toru", ["撮ります", "とります"])], "photography");
  }
  for (const [person, name] of [["tomodachi", "my friend"], ["ane", "my older sister"], ["otouto", "my younger brother"], ["sensei", "the teacher"]]) {
    add(`meet-${person}`, `I meet ${name}`, [lex(person), g("に"), lex("au", ["会います", "あいます"])], "meeting-person");
    add(`day-off-meet-${person}`, `I meet ${name} on my day off`, [lex("yasumi"), g("は"), lex(person), g("に"), lex("au", ["会います", "あいます"])], "day-off-meeting");
  }
  const media = [["anime", "anime"], ["eiga", "a movie"], ["hanabi", "fireworks"]];
  for (const [id, english] of media) {
    add(`watch-${id}`, `I watch ${english}`, [lex(id), g("を"), lex("miru", ["見ます", "みます"])], "watching");
    add(`day-off-watch-${id}`, `I watch ${english} on my day off`, [lex("yasumi"), g("は"), lex(id), g("を"), lex("miru", ["見ます", "みます"])], "day-off-watching");
    add(`media-identity-${id}`, `${id === "hanabi" ? "These are" : "It's"} ${english}`, [lex(id), g("です")], "identity");
  }
  add("day-off-read-manga", "I read manga on my day off", [lex("yasumi"), g("は"), lex("manga"), g("を"), lex("yomu", ["読みます", "よみます"])], "day-off-reading");
  // Listening to an instrument means its sound/performance, distinct from
  // playing it. Do not smuggle an unfamiliar play verb into the lesson.
  add("concert-guitar-listening", "I listen to the guitar at the concert", [lex("konsaato"), g("で"), lex("gitaa"), g("を"), lex("kiku", ["聞きます", "ききます"])], "concert-listening");
  add("guitar-listening", "I listen to the guitar", [lex("gitaa"), g("を"), lex("kiku", ["聞きます", "ききます"])], "instrument-listening");
  add("manga-identify", "It's a manga book", [lex("manga"), g("です")], "identity");
  add("okay-question", "Are you okay?", [lex("daijoubu"), g("です"), g("か")], "wellbeing-question");
  add("happy", "I'm happy", [lex("ureshii"), g("です")], "feeling");
  add("happy-question", "Are you happy?", [lex("ureshii"), g("です"), g("か")], "feeling-question");
  add("sing-subject", "I sing", [lex("watashi"), g("は"), lex("utau", ["歌います", "うたいます"])], "singing");
  add("sing-question", "Will you sing?", [lex("utau", ["歌います", "うたいます"]), g("か")], "singing-question");
  add("sing-in-japan", "I sing in Japan", [lex("nihon"), g("で"), lex("utau", ["歌います", "うたいます"])], "performance");
  add("photograph-in-japan", "I take a photograph in Japan", [lex("nihon"), g("で"), lex("shashin"), g("を"), lex("toru", ["撮ります", "とります"])], "photography");
  add("japanese-festival", "It's a Japanese festival", [lex("nihon"), g("の"), lex("matsuri"), g("です")], "origin");
  add("japanese-souvenir", "It's a souvenir from Japan", [lex("nihon"), g("の"), lex("omiyage"), g("です")], "origin");
  for (const [id, english] of [["jinja", "the shrine"], ["hanabi", "the fireworks"], ["kimono", "the kimono"]]) {
    add(`take-picture-${id}`, `I photograph ${english}`, [lex(id), g("を"), lex("toru", ["撮ります", "とります"])], "photography-object");
  }
  for (const [id, english] of [["jinja", "The shrine"], ["matsuri", "The festival"], ["anime", "The anime"], ["manga", "The manga"], ["konsaato", "The concert"]]) {
    add(`famous-${id}`, `${english} is famous`, [lex(id), g("は"), lex("yuumei"), g("です")], "na-predicate");
  }
  return cards;
}
