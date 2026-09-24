import { ArrowUp, Lightbulb } from "lucide-react";

export default function PromptInput({ value, onChange, onSubmit, loading }) {
  const canSubmit = value.trim().length > 0 && !loading;

  return (
    <section className="composer-card">
      <div className="composer-label">
        <span>What do you want to study?</span>
        <span className="char-count">{value.length}/8000</span>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, 8000))}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            if (canSubmit) onSubmit();
          }
        }}
        placeholder="Paste notes or enter a topic, e.g. 'Explain React hooks for a beginner'..."
        rows={7}
        aria-label="Study topic or notes"
      />

      <div className="composer-footer">
        <div className="tip">
          <Lightbulb size={16} />
          <span>Tip: Ctrl/Cmd + Enter to generate</span>
        </div>
        <button className="primary-button" disabled={!canSubmit} onClick={onSubmit}>
          {loading ? "Generating..." : "Generate deck"}
          {!loading && <ArrowUp size={17} />}
        </button>
      </div>
    </section>
  );
}