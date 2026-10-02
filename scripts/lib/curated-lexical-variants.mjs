// A lexical form approval establishes a valid identity/reading pair, not that a
// learner has been taught its usage. These explicit variants need both checks.
export function lexicalVariantErrors(course, variants, poolIds, reviewedForms) {
  const errors = [], keys = new Set();
  const position = new Map(course.lessons.map((lesson, index) => [lesson.id, index]));
  for (const variant of variants) {
    const {wordId, referenceEntryId, surface, reading, lessonId, evidence} = variant;
    const key = `${surface}|${reading}`;
    const fail = message => errors.push(`${lessonId}: ${surface}: ${message}`);
    if (keys.has(key)) fail('duplicate variant declaration');
    keys.add(key);
    if (!poolIds.has(wordId) || poolIds.has(referenceEntryId) || wordId === referenceEntryId)
      fail('expected one functional learning identity and a separate reference-only entry');
    if (!reviewedForms[wordId]?.some(([s,r]) => s === surface && r === reading))
      fail('variant lacks an explicit form approval');
    const intro = course.lessons.find(lesson => lesson.id === lessonId);
    if (!intro || intro.kind === 'review') { fail('missing instructional lesson'); continue; }
    const introducedBefore = course.foundationIds.includes(wordId) || course.lessons
      .slice(0, position.get(lessonId)).some(lesson => lesson.targets.includes(wordId));
    if (!introducedBefore) fail('base word must be taught before its variant');
    const matches = token => token.surface === surface && token.reading === reading;
    const firstCard = intro.cards.findIndex(card => card.tokens.some(matches));
    if (firstCard < 0 || !evidence || !intro.notes.some(note => note.start <= firstCard + 1 && note.explanation.includes(evidence)))
      fail('missing explicit instruction before first use');
    const originals = new Set(), lessons = new Set();
    let appearances = 0, laterRecalls = 0;
    for (const [index, lesson] of course.lessons.entries()) {
      const cards = lesson.cards.filter(card => card.tokens.some(matches));
      if (!cards.length) continue;
      if (index < position.get(lessonId)) fail(`used before instruction in ${lesson.id}`);
      for (const card of cards) for (const token of card.tokens.filter(matches))
        if (token.wordId !== wordId || token.dictionaryEntryId !== wordId) fail(`wrong identity in ${card.id}`);
      if (lesson.topicId !== intro.topicId) continue;
      appearances += cards.length;
      lessons.add(lesson.id);
      if (lesson.kind === 'review' && index > position.get(lessonId)) laterRecalls++;
      else for (const card of cards) originals.add(card.id);
    }
    if (originals.size < 2 || appearances < 6 || lessons.size < 3 || laterRecalls < 2)
      fail('needs two original examples and six placements across instruction and two later chapter recalls');
  }
  return errors;
}
