import "dotenv/config";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 8787);
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

app.use(express.json({ limit: "100kb" }));

const resultSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    summary: { type: "STRING" },
    cards: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          answer: { type: "STRING" },
          hint: { type: "STRING" }
        },
        required: ["question", "answer", "hint"]
      }
    }
  },
  required: ["title", "summary", "cards"]
};

function buildPrompt(input) {
  return `You are a study assistant. Turn the user's notes/topic into a useful flashcard deck.

Return ONLY JSON matching this exact structure:
{
  "title": "short deck title",
  "summary": "one or two sentence overview",
  "cards": [
    {
      "question": "clear question",
      "answer": "accurate concise answer",
      "hint": "short hint"
    }
  ]
}

Rules:
- Generate 6 to 10 cards.
- Cover the most important concepts.
- Do not invent facts that are not reasonably supported by the input.
- Keep questions focused on one concept.
- Keep answers concise but useful.
- No markdown, no code fences, no extra prose outside the JSON.
- If the input is a broad topic, use standard factual knowledge and make the deck beginner-friendly.

User input:
${input}`;
}

function extractText(data) {
  return data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "")
    .join("")
    .trim();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate", async (req, res) => {
  const input =
    typeof req.body?.input === "string"
      ? req.body.input.trim()
      : "";

  if (!input) {
    return res.status(400).json({
      error: {
        code: "EMPTY_INPUT",
        message: "Please enter a topic or some notes."
      }
    });
  }

  if (input.length > 8000) {
    return res.status(400).json({
      error: {
        code: "INPUT_TOO_LONG",
        message: "Please keep the input under 8,000 characters."
      }
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: {
        code: "MISSING_API_KEY",
        message:
          "GEMINI_API_KEY is missing. Add it to .env and restart the server."
      }
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
      `?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildPrompt(input)
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: resultSchema
        }
      })
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(502).json({
        error: {
          code: "PROVIDER_ERROR",
          message:
            payload?.error?.message ||
            `The AI provider returned HTTP ${response.status}.`
        }
      });
    }

    const raw = extractText(payload);

    if (!raw) {
      return res.status(502).json({
        error: {
          code: "EMPTY_MODEL_RESPONSE",
          message: "The AI returned an empty response."
        }
      });
    }

    return res.json({ raw });
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({
        error: {
          code: "TIMEOUT",
          message: "The AI request took too long. Please try again."
        }
      });
    }

    console.error("Generation error:", error);

    return res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while generating the deck."
      }
    });
  } finally {
    clearTimeout(timeout);
  }
});

// Render requires the server to listen on the public interface.
app.listen(port, "0.0.0.0", () => {
  console.log(
    `StudySpark backend running on http://0.0.0.0:${port}`
  );
});