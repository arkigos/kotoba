import { createFrameAuthor } from "./frame-author";
import { exampleLexicon } from "./examples";
import { nearbyLandmarkWordIds } from "./reviewed-vocabulary";
import type { PracticeCard } from "./types";

// These exact senses and constructions were read as bilingual teaching content.
// This is an explicit, small authoring overlay, never an imported-POS template.
// Admission still checks every lexical token against the learner's vocabulary.
export function personalConstructionCandidates(available: ReadonlySet<string>): PracticeCard[] {
  const { cards, lex, g, add } = createFrameAuthor(available);
  const people = [
    ["ane", "my older sister"], ["otouto", "my younger brother"], ["otto", "my husband"], ["tsuma", "my wife"],
  ] as const;
  const adjectives = [["wakai", "young"], ["kakkoii", "good-looking"], ["kawaii", "cute"], ["kiree-na", "beautiful"]] as const;
  const talk = () => lex("hanasu", ["話します", "はなします"]);
  add("who-is-this-person", "Who is this person?", [lex("kono"), lex("hito"), g("は"), lex("dare"), g("です"), g("か")]);
  add("who-is-it", "Who is it?", [lex("dare"), g("です"), g("か")]);
  add("where-is-it", "Where is it?", [lex("doko"), g("です"), g("か")]);
  add("this-person", "It's this person", [lex("kono"), lex("hito"), g("です")]);
  add("two-of-us", "There are two of us", [lex("futari"), g("です")]);
  add("two-of-you", "Are there two of you?", [lex("futari"), g("です"), g("か")]);
  add("two-talk", "The two of us talk", [lex("futari"), g("で"), talk()]);
  for (const [person, noun] of people) {
    add(`where-${person}`, `Where is ${noun}?`, [lex(person), g("は"), lex("doko"), g("です"), g("か")]);
    add(`introduce-${person}`, `This is ${noun}`, [lex("kono"), lex("hito"), g("は"), lex(person), g("です")]);
    add(`talk-with-${person}`, `I talk with ${noun}`, [lex(person), g("と"), talk()]);
    add(`two-with-${person}`, `I talk with ${noun}, just the two of us`, [lex(person), g("と"), lex("futari"), g("で"), talk()]);
    add(`who-with-${person}`, `Who does ${noun} talk with?`, [lex(person), g("は"), lex("dare"), g("と"), talk(), g("か")]);
    for (const [adjective, meaning] of adjectives) {
      // Use attractive appearance for kirei with people, clean for possessions.
      add(`${person}-${adjective}`, `${noun[0].toUpperCase()}${noun.slice(1)} is ${meaning}`, [lex(person), g("は"), lex(adjective), g("です")]);
    }
  }
  add("this-handkerchief-clean", "This handkerchief is clean", [lex("kono"), lex("hankachi"), g("は"), lex("kiree-na"), g("です")]);
  add("this-person-young", "This person is young", [lex("kono"), lex("hito"), g("は"), lex("wakai"), g("です")]);

  // Landmark identification works without consuming a scarce shared motion
  // verb on every noun appearance. These are explicitly reviewed place senses.
  for (const place of exampleLexicon.entries) {
    if (place.kind !== "noun" || !nearbyLandmarkWordIds.includes(place.wordId)) continue;
    add(`identify-place-${place.wordId}`, `It's ${place.english.subject}`, [lex(place.wordId), g("です")], "identity");
    add(`identify-place-question-${place.wordId}`, `Is it ${place.english.subject}?`, [lex(place.wordId), g("です"), g("か")], "identity");
    add(`where-place-${place.wordId}`, `Where is ${place.english.subject}?`, [lex(place.wordId), g("は"), lex("doko"), g("です"), g("か")], "location-question");
    add(`near-place-question-${place.wordId}`, `Is ${place.english.subject} nearby?`, [lex(place.wordId), g("は"), lex("chikai"), g("です"), g("か")], "i-predicate");
    add(`photograph-of-${place.wordId}`, `It's a photograph of ${place.english.subject}`, [lex(place.wordId), g("の"), lex("shashin"), g("です")], "photograph-of-place");
  }
  add("nearby", "It's nearby", [lex("chikai"), g("です")], "i-predicate");
  add("nearby-question", "Is it nearby?", [lex("chikai"), g("です"), g("か")], "i-predicate");
  add("photograph", "It's a photograph", [lex("shashin"), g("です")], "identity");
  add("photograph-question", "Is it a photograph?", [lex("shashin"), g("です"), g("か")], "identity");
  add("show-photograph", "I show a photograph", [lex("shashin"), g("を"), lex("miseru", ["見せます", "みせます"])], "action");

  // Reference-entry use is licensed here by explicit sense review, not noun POS.
  // The ambiguous 曹達 entry is deliberately not treated as a beverage.
  const objects = [["jmdict:1055790", "soda pop"], ["jmdict:1124170", "a bottle"], ["hon", "a book"], ["hashi", "chopsticks"]] as const;
  for (const [id, english] of objects) {
    add(`want-${id}`, `I want ${english}`, [lex(id), g("が"), lex("hoshii"), g("です")]);
    add(`buy-${id}`, `I buy ${english}`, [lex(id), g("を"), lex("kaimasu")]);
    add(`shop-buy-${id}`, `I buy ${english} at the convenience store`, [lex("jmdict:1053280"), g("で"), lex(id), g("を"), lex("kaimasu")]);
  }
  // Reviewed food senses supply a clean count/mass/plural phrase. Identification
  // and purchase/want frames do not require an unselected eat/drink helper.
  for (const food of exampleLexicon.entries) {
    if (food.kind !== "noun" || !food.semanticTags?.some(tag => tag === "food" || tag === "drink")) continue;
    const phrase = food.english.predicate, plural = food.english.agreement === "other";
    add(`identify-food-${food.wordId}`, `${plural ? "These are" : "It's"} ${phrase}`, [lex(food.wordId), g("です")]);
    add(`identify-food-question-${food.wordId}`, `${plural ? "Are these" : "Is it"} ${phrase}?`, [lex(food.wordId), g("です"), g("か")]);
    add(`want-food-${food.wordId}`, `I want ${phrase}`, [lex(food.wordId), g("が"), lex("hoshii"), g("です")]);
    add(`buy-food-${food.wordId}`, `I buy ${phrase}`, [lex(food.wordId), g("を"), lex("kaimasu")]);
  }
  // Temporal nouns have authored adverbials, not guessed English prepositions.
  const times = [
    ["asa", "morning", "in the morning", "the morning"],
    ["gozen", "morning", "in the morning", "the morning"],
    ["gogo", "afternoon", "in the afternoon", "the afternoon"],
    ["getsuyoubi", "Monday", "on Mondays", "Mondays"],
    ["kayoubi", "Tuesday", "on Tuesdays", "Tuesdays"],
  ] as const;
  const activities = [
    ["hataraku", "働きます", "はたらきます", "work"],
    ["yasumu", "休みます", "やすみます", "rest"],
    ["kaeru", "帰ります", "かえります", "go home"],
  ] as const;
  for (const [id, surface, reading, english] of activities) {
    add(`implicit-${id}`, `I ${english}`, [lex(id, [surface, reading])]);
    for (const [time, , adverbial] of times) add(`time-${time}-${id}`, `I ${english} ${adverbial}`,
      [lex(time), g("は"), lex(id, [surface, reading])]);
  }
  add("day-off", "It's my day off", [lex("yasumi"), g("です")]);
  add("work-commitment", "I have work", [lex("shigoto"), g("です")]);
  for (const [time, name, adverbial, off] of times) {
    add(`identify-time-${time}`, `It's ${name}`, [lex(time), g("です")]);
    add(`time-off-${time}`, `I have ${off} off`, [lex(time), g("は"), lex("yasumi"), g("です")]);
    add(`work-time-${time}`, `I have work ${adverbial}`, [lex(time), g("は"), lex("shigoto"), g("です")]);
  }
  // Argument frames: understand takes a language/script marked が; working and
  // living take a location with different particles. Never swap these verbs in
  // a generic actor/location slot (the old 'understands in Australia' defect).
  const actors = exampleLexicon.entries.filter(entry => entry.kind === "noun" && entry.roles.includes("actor") && entry.semanticTags?.includes("person"));
  const places = [["nihon", "Japan"], ["oosutoraria", "Australia"], ["supein", "Spain"], ["tai", "Thailand"], ["firipin", "the Philippines"], ["roshia", "Russia"]] as const;
  const languages = [["nihongo", "Japanese"], ["eigo", "English"], ["hiragana", "hiragana"], ["katakana", "katakana"], ["kanji", "kanji"]] as const;
  for (const actor of actors) {
    if (actor.kind !== "noun" || !available.has(actor.wordId)) continue;
    const subject = actor.english.subject, third = actor.english.agreement === "third-singular";
    const start = subject[0].toUpperCase() + subject.slice(1);
    for (const [language, name] of languages) add(`understand-${actor.wordId}-${language}`, `${start} ${third ? "understands" : "understand"} ${name}`,
      [lex(actor.wordId), g("は"), lex(language), g("が"), lex("wakaru", ["分かります", "わかります"])]);
    for (const [place, name] of places) {
      add(`live-${actor.wordId}-${place}`, `${start} ${third ? "lives" : "live"} in ${name}`, [lex(actor.wordId), g("は"), lex(place), g("に"), lex("sumu", ["住んでいます", "すんでいます"])]);
      add(`work-${actor.wordId}-${place}`, `${start} ${third ? "works" : "work"} in ${name}`, [lex(actor.wordId), g("は"), lex(place), g("で"), lex("hataraku", ["働きます", "はたらきます"])]);
    }
    add(`work-${actor.wordId}`, `${start} ${third ? "works" : "work"}`, [lex(actor.wordId), g("は"), lex("hataraku", ["働きます", "はたらきます"])]);
  }
  for (const [place, name] of places) {
    if (available.has("watashi")) {
      add(`my-country-${place}`, `My country is ${name}`, [lex("watashi"), g("の"), lex("kuni"), g("は"), lex(place), g("です")], "identity");
    } else {
      add(`country-${place}`, `${name[0].toUpperCase()}${name.slice(1)} is a country`, [lex(place), g("は"), lex("kuni"), g("です")], "identity");
    }
    add(`your-country-${place}`, `Is your country ${name}?`, [lex("anata"), g("の"), lex("kuni"), g("は"), lex(place), g("です"), g("か")], "identity");
  }
  return cards;
}
