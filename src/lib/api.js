export async function generateStudyDeck(input, signal) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
    signal
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || `Request failed with status ${response.status}.`
    );
  }

  if (!payload?.raw) {
    throw new Error("The server returned no AI data.");
  }

  return payload.raw;
}

export function getErrorMessage(error) {
  if (error?.name === "AbortError") return "Generation was cancelled.";
  return error?.message || "Something went wrong. Please try again.";
}