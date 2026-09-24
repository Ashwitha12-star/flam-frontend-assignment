import FlashcardDeck from "./FlashcardDeck";

export default function ResultView({ result, onReset }) {
  return <FlashcardDeck deck={result} onReset={onReset} />;
}