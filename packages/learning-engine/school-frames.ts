import { createFrameAuthor } from "./frame-author";

export function schoolCandidates(available: ReadonlySet<string>) {
  const { cards, lex, g, add } = createFrameAuthor(available);
  for (const [word, meaning] of [["eigo", "English"], ["nihongo", "Japanese"], ["hiragana", "hiragana"], ["katakana", "katakana"], ["kanji", "kanji"]]) {
    add(`script-identify-${word}`, `It's ${meaning}`, [lex(word), g("です")], "identity");
    add(`script-question-${word}`, `Is it ${meaning}?`, [lex(word), g("です"), g("か")], "identity");
  }
  add("response-no", "No", [lex("iie")], "response");
  add("response-yes-understanding", "Yes, I understand", [lex("hai"), g("、"), lex("wakaru", ["分かります", "わかります"])], "understand-response");
  add("response-no-understanding", "No, I don't understand", [lex("iie"), g("、"), lex("wakarimasen")], "understand-negative-response");
  add("class-absence", "I miss class", [lex("jugyou"), g("を"), lex("yasumu", ["休みます", "やすみます"])], "absence");
  add("school-absence", "I take a day off school", [lex("gakkou"), g("を"), lex("yasumu", ["休みます", "やすみます"])], "absence");
  add("class-identity", "It's a class", [lex("jugyou"), g("です")], "identity");
  add("class-question", "Is it a class?", [lex("jugyou"), g("です"), g("か")], "identity");
  for (const [person, english] of [["watashi", "I am"], ["sensei", "The teacher is"], ["gakusei", "The student is"]]) {
    add(`at-school-${person}`, `${english} at school`, [lex(person), g("は"), lex("gakkou"), g("に"), lex("iru", ["います", "います"])], "existence-animate");
  }
  for (const [noun, english] of [["kanji", "kanji"], ["nihongo", "Japanese"], ["eigo", "English"]]) {
    add(`school-yes-understand-${noun}`, `Yes, I understand ${english}`, [lex("hai"), g("、"), lex(noun), g("が"), lex("wakaru", ["分かります", "わかります"])], "understand-response");
    add(`school-understand-negative-${noun}`, `I don't understand ${english}`, [lex(noun), g("が"), lex("wakarimasen")], "understand-negative");
    add(`school-no-understand-${noun}`, `No, I don't understand ${english}`, [lex("iie"), g("、"), lex(noun), g("が"), lex("wakarimasen")], "understand-negative-response");
  }
  for (const [verb, surface, reading, english] of [["kiku", "聞きます", "ききます", "listen"], ["kaku", "書きます", "かきます", "write it"], ["hanasu", "話します", "はなします", "say it"]]) {
    for (const [adverb, phrase] of [["mouichido", "again"], ["moo-ichido", "again"], ["ichido", "once"]]) {
      add(`school-repeat-${adverb}-${verb}`, `I'll ${english} ${phrase}`, [lex(adverb), lex(verb, [surface, reading])], "repeat-action");
      add(`school-yes-repeat-${adverb}-${verb}`, `Yes, I'll ${english} ${phrase}`, [lex("hai"), g("、"), lex(adverb), lex(verb, [surface, reading])], "repeat-action-response");
    }
  }
  add("origin-question", "Where are you from?", [lex("dochira-kara"), g("です"), g("か")], "origin-question");
  return cards;
}
