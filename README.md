# Translingo — cross-language chat demo

A two-person chat where each side types in their own language and every
message is translated on the way to the other person, using Ollama Cloud
(`gemma4:31b-cloud`).

## How it's structured

- `server.js` — Express server. Serves the frontend and exposes one route,
  `POST /api/translate`, which calls Ollama's cloud API using a server-side
  API key.
- `public/index.html` — the chat UI. Calls `/api/translate` on its own
  server; never talks to Ollama directly.
- The Ollama API key lives only in an environment variable
  (`OLLAMA_API_KEY`) — it is never committed to the repo and never sent to
  the browser.

## Run it locally

```
npm install
export OLLAMA_API_KEY=your_key_here    # Windows PowerShell: $env:OLLAMA_API_KEY="your_key_here"
npm start
```

Then open http://localhost:3000

## Deploy on Render

1. Push this folder to a GitHub repository.
2. On Render, create a new **Web Service** from that repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add an environment variable: `OLLAMA_API_KEY` = your key from ollama.com.
6. Deploy. Render gives you a public URL — open it and the chat works the
   same way it did locally, for anyone who visits.
