import { LoaderCircle } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <div className="spinner-wrap">
        <LoaderCircle className="spinner" size={26} />
      </div>
      <div>
        <h3>Building your deck...</h3>
        <p>The AI is creating and structuring your flashcards.</p>
      </div>
    </div>
  );
}