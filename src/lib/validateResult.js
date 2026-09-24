const MAX_CARDS = 20;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseAndValidateResult(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("The AI returned an empty response.");
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("The AI returned malformed JSON. Please retry.");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("The AI response has the wrong structure. Please retry.");
  }

  if (!isNonEmptyString(data.title) || !isNonEmptyString(data.summary)) {
    throw new Error("The AI response is missing a title or summary.");
  }

  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    throw new Error("The AI response contains no flashcards.");
  }

  if (data.cards.length > MAX_CARDS) {
    throw new Error("The AI returned too many cards.");
  }

  const cards = data.cards.map((card, index) => {
    if (
      !card ||
      typeof card !== "object" ||
      !isNonEmptyString(card.question) ||
      !isNonEmptyString(card.answer) ||
      !isNonEmptyString(card.hint)
    ) {
      throw new Error(`Card ${index + 1} has an invalid shape.`);
    }

    return {
      id: `card-${index}-${crypto.randomUUID()}`,
      question: card.question.trim(),
      answer: card.answer.trim(),
      hint: card.hint.trim()
    };
  });

  return {
    title: data.title.trim(),
    summary: data.summary.trim(),
    cards
  };
}