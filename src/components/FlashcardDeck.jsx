import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";

function Card({ card, flipped, onFlip }) {
  return (
    <button
      className={`flashcard ${flipped ? "is-flipped" : ""}`}
      onClick={onFlip}
      aria-label={flipped ? "Show question" : "Show answer"}
    >
      <span className="card-badge">{flipped ? "ANSWER" : "QUESTION"}</span>
      <span className="card-text">{flipped ? card.answer : card.question}</span>
      <span className="card-hint">
        {flipped ? "Tap to see the question" : `Hint: ${card.hint}`}
      </span>
    </button>
  );
}

export default function FlashcardDeck({ deck, onReset }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [missed, setMissed] = useState([]);
  const [mode, setMode] = useState("all");

  const visibleCards = useMemo(
    () => mode === "missed"
      ? deck.cards.filter((card) => missed.includes(card.id))
      : deck.cards,
    [deck.cards, missed, mode]
  );

  const safeCurrent = Math.min(current, Math.max(visibleCards.length - 1, 0));
  const card = visibleCards[safeCurrent];

  function move(direction) {
    if (!visibleCards.length) return;
    setFlipped(false);
    setCurrent((value) => {
      const next = value + direction;
      if (next < 0) return visibleCards.length - 1;
      if (next >= visibleCards.length) return 0;
      return next;
    });
  }

  function mark(known) {
    if (!card) return;
    if (known) {
      setMissed((items) => items.filter((id) => id !== card.id));
    } else {
      setMissed((items) => items.includes(card.id) ? items : [...items, card.id]);
    }
    move(1);
  }

  if (mode === "missed" && visibleCards.length === 0) {
    return (
      <section className="deck-panel">
        <div className="deck-topbar">
          <div>
            <span className="eyebrow">REVIEW</span>
            <h2>No missed cards</h2>
          </div>
          <button className="ghost-button" onClick={() => setMode("all")}>
            Back to all cards
          </button>
        </div>
        <div className="empty-review">
          <div className="success-mark"><Check size={26} /></div>
          <h3>Nice work!</h3>
          <p>You haven't marked any cards as missed yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="deck-panel">
      <div className="deck-topbar">
        <div>
          <span className="eyebrow">YOUR DECK</span>
          <h2>{deck.title}</h2>
          <p>{deck.summary}</p>
        </div>
        <div className="deck-actions">
          <button
            className={`ghost-button ${mode === "missed" ? "active" : ""}`}
            onClick={() => {
              setMode(mode === "all" ? "missed" : "all");
              setCurrent(0);
              setFlipped(false);
            }}
            disabled={missed.length === 0}
          >
            <RotateCcw size={16} />
            Review missed ({missed.length})
          </button>
          <button className="ghost-button" onClick={onReset}>New topic</button>
        </div>
      </div>

      <div className="progress-row">
        <span>Card {safeCurrent + 1} of {visibleCards.length}</span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((safeCurrent + 1) / visibleCards.length) * 100}%` }}
          />
        </div>
      </div>

      {card && (
        <>
          <div className="card-stage">
            <Card
              card={card}
              flipped={flipped}
              onFlip={() => setFlipped((value) => !value)}
            />
          </div>

          <div className="deck-controls">
            <button className="control-button wrong" onClick={() => mark(false)}>
              <X size={19} /> Didn't know
            </button>
            <div className="nav-controls">
              <button className="icon-button" onClick={() => move(-1)} aria-label="Previous card">
                <ChevronLeft />
              </button>
              <button className="icon-button" onClick={() => move(1)} aria-label="Next card">
                <ChevronRight />
              </button>
            </div>
            <button className="control-button right" onClick={() => mark(true)}>
              <Check size={19} /> I knew it
            </button>
          </div>
        </>
      )}
    </section>
  );
}