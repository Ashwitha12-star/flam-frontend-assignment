import { useRef, useState } from "react";
import { BookOpenCheck, ShieldCheck, Sparkles } from "lucide-react";
import PromptInput from "./components/PromptInput";
import ResultView from "./components/ResultView";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import { generateStudyDeck, getErrorMessage } from "./lib/api";
import { parseAndValidateResult } from "./lib/validateResult";

const EXAMPLE = "React hooks: useState, useEffect, useMemo, useRef, and common mistakes.";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("empty");
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const abortRef = useRef(null);
  const lastInput = useRef("");

  async function generate(value = input) {
    const trimmed = value.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const id = ++requestId.current;
    lastInput.current = trimmed;
    setStatus("loading");
    setError("");

    try {
      const raw = await generateStudyDeck(trimmed, controller.signal);

      if (id !== requestId.current) return;

      const parsed = parseAndValidateResult(raw);
      setResult(parsed);
      setStatus("success");
    } catch (err) {
      if (id !== requestId.current || err?.name === "AbortError") return;
      setError(getErrorMessage(err));
      setStatus("error");
    }
  }

  function reset() {
    abortRef.current?.abort();
    requestId.current += 1;
    setResult(null);
    setError("");
    setStatus("empty");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <span>StudySpark</span>
        </div>
        <div className="header-note">
          <ShieldCheck size={16} />
          <span>Your API key stays on the server</span>
        </div>
      </header>

      <main className="main-content">
        {status === "empty" && (
          <section className="hero">
            <div className="hero-icon"><BookOpenCheck size={30} /></div>
            <span className="eyebrow">AI STUDY ASSISTANT</span>
            <h1>Turn notes into a<br /><span>study session.</span></h1>
            <p>
              Paste your notes or name a topic. StudySpark creates structured
              flashcards you can flip, mark, and review.
            </p>

            <PromptInput
              value={input}
              onChange={setInput}
              onSubmit={() => generate()}
              loading={false}
            />

            <button className="example-button" onClick={() => setInput(EXAMPLE)}>
              Try an example
            </button>
          </section>
        )}

        {status === "loading" && (
          <section className="workspace">
            <PromptInput value={input} onChange={setInput} onSubmit={() => generate()} loading />
            <LoadingState />
          </section>
        )}

        {status === "error" && (
          <section className="workspace">
            <PromptInput value={input} onChange={setInput} onSubmit={() => generate()} loading={false} />
            <ErrorState message={error} onRetry={() => generate(lastInput.current)} />
          </section>
        )}

        {status === "success" && result && (
          <section className="workspace">
            <ResultView result={result} onReset={reset} />
          </section>
        )}
      </main>

      <footer className="footer">
        <span>Structured AI output · defensive validation · React hooks</span>
        <span>Built for the Flam frontend internship assignment</span>
      </footer>
    </div>
  );
}