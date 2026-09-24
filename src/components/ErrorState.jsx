import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card error-card" role="alert">
      <div className="error-icon"><AlertCircle size={25} /></div>
      <div className="state-content">
        <h3>We couldn't build that deck</h3>
        <p>{message}</p>
        <button className="secondary-button" onClick={onRetry}>
          <RotateCcw size={17} />
          Try again
        </button>
      </div>
    </div>
  );
}