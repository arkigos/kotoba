const defaultAxisOrders = [
  ["watashi", "sakura", "yuki", "tanaka"],
  ["watashi", "sakura", "yuki", "tanaka", "sensei", "gakusei", "tomodachi"],
];

function cardLine(card) {
  return Array.isArray(card.line) ? card.line.join("") : "";
}

function cardEnglish(card) {
  return card.english ?? "";
}

function tokenKey(token, index) {
  return token?.wordId ?? token?.surface ?? `slot-${index}`;
}

function tokenWordId(card, index) {
  return card.tokens?.[index]?.wordId;
}

function cardWordIds(card) {
  return new Set((card.tokens ?? []).map((token) => token.wordId).filter(Boolean));
}

function contiguousOrderedRun(values, order) {
  if (values.length < 2) return false;
  const start = order.indexOf(values[0]);
  if (start < 0 || start + values.length > order.length) return false;
  return values.every((value, index) => value === order[start + index]);
}

function sameFrameExcept(cards, varyingIndex) {
  const first = cards[0]?.tokens ?? [];
  return cards.every((card) => {
    const tokens = card.tokens ?? [];
    if (tokens.length !== first.length) return false;
    return tokens.every((token, index) => index === varyingIndex || tokenKey(token, index) === tokenKey(first[index], index));
  });
}

export function exactDuplicateFindings(unit, options = {}) {
  const maxExactLineRepeats = options.maxExactLineRepeats ?? 1;
  const maxExactEnglishRepeats = options.maxExactEnglishRepeats ?? 1;
  const lineCounts = new Map();
  const englishCounts = new Map();

  for (const card of unit.cards ?? []) {
    const line = cardLine(card);
    const english = cardEnglish(card);
    lineCounts.set(line, [...(lineCounts.get(line) ?? []), card.id]);
    englishCounts.set(english, [...(englishCounts.get(english) ?? []), card.id]);
  }

  const lineFindings = [...lineCounts.entries()]
    .filter(([, ids]) => ids.length > maxExactLineRepeats)
    .map(([text, ids]) => ({ kind: "japanese-line", text, count: ids.length, ids }));
  const englishFindings = [...englishCounts.entries()]
    .filter(([, ids]) => ids.length > maxExactEnglishRepeats)
    .map(([text, ids]) => ({ kind: "english", text, count: ids.length, ids }));

  return [...lineFindings, ...englishFindings].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
}

export function lockstepAxisFindings(unit, options = {}) {
  const windowSize = options.windowSize ?? 4;
  const axisOrders = options.axisOrders ?? defaultAxisOrders;
  const findings = [];
  const cards = unit.cards ?? [];

  for (let start = 0; start <= cards.length - windowSize; start += 1) {
    const window = cards.slice(start, start + windowSize);
    const tokenCount = window[0]?.tokens?.length ?? 0;
    if (tokenCount === 0 || !window.every((card) => (card.tokens?.length ?? 0) === tokenCount)) continue;

    for (let slot = 0; slot < tokenCount; slot += 1) {
      const values = window.map((card) => tokenWordId(card, slot));
      if (values.some((value) => !value) || new Set(values).size !== values.length) continue;
      if (!sameFrameExcept(window, slot)) continue;

      const axisOrder = axisOrders.find((order) => contiguousOrderedRun(values, order));
      if (!axisOrder) continue;

      findings.push({
        kind: "lockstep-axis",
        startCard: start + 1,
        endCard: start + windowSize,
        slot,
        values,
        axisOrder,
        ids: window.map((card) => card.id),
      });
    }
  }

  return findings;
}

export function wordExposureGapFindings(unit, options = {}) {
  const maxExposureGap = options.maxExposureGap ?? 24;
  const wordIds = options.wordIds ?? unit.newWords?.map((word) => word.id) ?? [];
  const cards = unit.cards ?? [];
  const positionsByWord = new Map(wordIds.map((wordId) => [wordId, []]));

  for (const [index, card] of cards.entries()) {
    const cardWords = cardWordIds(card);
    for (const wordId of wordIds) {
      if (cardWords.has(wordId)) positionsByWord.get(wordId)?.push(index + 1);
    }
  }

  const findings = [];
  for (const [wordId, positions] of positionsByWord) {
    if (positions.length < 2) continue;

    for (let index = 1; index < positions.length; index += 1) {
      const previous = positions[index - 1];
      const current = positions[index];
      const gap = current - previous;
      if (gap > maxExposureGap) {
        findings.push({
          kind: "word-exposure-gap",
          wordId,
          startCard: previous,
          endCard: current,
          gap,
        });
      }
    }

    const trailingGap = cards.length - positions.at(-1);
    if (trailingGap > maxExposureGap) {
      findings.push({
        kind: "word-exposure-trailing-gap",
        wordId,
        startCard: positions.at(-1),
        endCard: cards.length,
        gap: trailingGap,
      });
    }
  }

  return findings.sort((a, b) => b.gap - a.gap || a.wordId.localeCompare(b.wordId));
}

export function bareDesuStatementFindings(unit, options = {}) {
  const allowedWordIds = new Set(options.allowedBareDesuWordIds ?? []);

  return (unit.cards ?? [])
    .filter((card) => {
      const tokens = card.tokens ?? [];
      if (tokens.length !== 2 && tokens.length !== 4) return false;
      if (!tokens[0]?.wordId || allowedWordIds.has(tokens[0].wordId)) return false;
      if (tokens[1]?.wordId) return false;
      return /identity marker/.test(tokens[1]?.explain ?? "");
    })
    .map((card) => ({
      kind: "bare-desu-statement",
      wordId: card.tokens[0].wordId,
      text: cardLine(card),
      id: card.id,
    }));
}

export function assertUnitVariety(unit, options = {}) {
  const duplicateFindings = exactDuplicateFindings(unit, options);
  const axisFindings = lockstepAxisFindings(unit, options);
  const exposureGapFindings = wordExposureGapFindings(unit, options);
  const bareDesuFindings = bareDesuStatementFindings(unit, options);

  if (duplicateFindings.length > 0 || axisFindings.length > 0 || exposureGapFindings.length > 0 || bareDesuFindings.length > 0) {
    const messages = [
      ...duplicateFindings.map((finding) => {
        return `unit ${unit.id}: ${finding.kind} repeats ${finding.count}x: ${finding.text} [${finding.ids.join(", ")}]`;
      }),
      ...axisFindings.map((finding) => {
        return `unit ${unit.id}: lockstep ${finding.values.join(" -> ")} in slot ${finding.slot + 1}, cards ${finding.startCard}-${finding.endCard} [${finding.ids.join(", ")}]`;
      }),
      ...exposureGapFindings.map((finding) => {
        return `unit ${unit.id}: ${finding.wordId} has ${finding.gap}-card exposure gap from card ${finding.startCard} to ${finding.endCard}`;
      }),
      ...bareDesuFindings.map((finding) => {
        return `unit ${unit.id}: bare noun desu frame ${finding.text} for ${finding.wordId} [${finding.id}]`;
      }),
    ];
    throw new Error(messages.join("\n"));
  }
}
