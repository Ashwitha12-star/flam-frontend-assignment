# StudySpark AI — Flam Frontend Internship Assignment

StudySpark AI is an AI-powered study assistant that converts a user's topic or study notes into structured interactive flashcards.

## Project Idea

**Study Assistant**

The user enters a topic or notes in a free-form text box. The application sends the request to a backend server, which calls the Gemini API and returns structured JSON containing a study deck.

The generated deck can be used interactively:

- Flip cards to view answers
- Mark cards as "I knew it" or "Didn't know"
- Navigate between cards
- Review missed cards
- Start a new topic

## Tech Stack

- React
- JavaScript
- Vite
- Node.js
- Express
- Gemini API
- CSS
- Lucide React

## Features

### AI Study Deck Generation

Users can enter any study topic or notes and generate a structured flashcard deck using a real LLM API.

### Interactive Flashcards

Each flashcard contains:

- Question
- Answer
- Hint

Users can click a card to flip between the question and answer.

### Progress Tracking

Users can mark cards as:

- I knew it
- Didn't know

The application keeps track of missed cards.

### Review Missed

Users can review only the cards they marked as "Didn't know".

### Loading and Error States

The application handles:

- Empty input
- API failures
- Slow requests
- Invalid JSON
- Invalid response structure
- Empty AI responses
- Backend errors

### Stale Request Protection

The frontend prevents an older API response from replacing a newer request.

## Project Structure

```text
flam-frontend-assignment-js/
│
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx
│   │   ├── ResultView.jsx
│   │   ├── FlashcardDeck.jsx
│   │   ├── ErrorState.jsx
│   │   └── LoadingState.jsx
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── validateResult.js
│   │
│   ├── types/
│   │   └── result.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── server/
│   └── generate.js
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ POST /api/generate
  ▼
Express Backend
  │
  │ Gemini API request
  ▼
Gemini LLM
  │
  │ Structured JSON
  ▼
Express Backend
  │
  ▼
JSON Validation
  │
  ▼
React Frontend
  │
  ▼
Interactive Flashcard Deck
```

The Gemini API key is stored only on the server and is never exposed to the browser.

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_available_gemini_model
PORT=8787
```

Do not commit `.env` to GitHub.

The repository includes `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_available_gemini_model
PORT=8787
```

## Installation

Clone or extract the project and open the project folder in VS Code.

Install dependencies:

```bash
npm install
```

## Run the Application

Start both the frontend and backend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:8787
```

## Build

To create a production build:

```bash
npm run build
```

## AI Output Format

The backend requests structured JSON from the LLM.

Example:

```json
{
  "title": "JavaScript Promises",
  "summary": "An introduction to JavaScript promises.",
  "cards": [
    {
      "question": "What is a JavaScript Promise?",
      "answer": "A Promise represents the eventual completion or failure of an asynchronous operation.",
      "hint": "Think of it as a placeholder for a future value."
    }
  ]
}
```

The frontend validates the response before rendering it.

## Validation and Failure Handling

The application does not directly trust the model response.

The response is:

1. Parsed as JSON.
2. Checked for the required fields.
3. Checked for a valid title and summary.
4. Checked for a non-empty cards array.
5. Checked that every card contains a question, answer, and hint.
6. Rejected if the structure is invalid.

Errors are shown to the user instead of rendering malformed data.

## Security

The Gemini API key is never included in frontend code.

The browser communicates with the local backend:

```text
Browser → Express Backend → Gemini API
```

The `.env` file is ignored by Git using `.gitignore`.

## Responsive Design

The application is designed to work on:

- Desktop
- Tablet
- Mobile devices

The layout and flashcard controls adapt to smaller screens.

## Limitations

- Generated content depends on the quality and availability of the selected Gemini model.
- AI-generated answers may occasionally require verification.
- The application currently stores study progress only during the current session.
- No user authentication or persistent database is included because it is outside the assignment scope.

## Assignment Requirements Covered

- [x] React functional components
- [x] React hooks
- [x] Free-form text input
- [x] Real LLM API
- [x] Backend/API proxy
- [x] API key protected from browser
- [x] Structured JSON output
- [x] JSON validation
- [x] Interactive result view
- [x] Loading state
- [x] Error state
- [x] Malformed response handling
- [x] Empty response handling
- [x] Stale request protection
- [x] Responsive/mobile UI
- [x] README documentation

## Selected Project

**Study Assistant — AI Flashcard Generator**

Built as part of the Flam Frontend Internship Assignment.