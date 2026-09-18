const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = "gemma4:31b-cloud";

app.post("/api/translate", async (req, res) => {
  try {
    const { text, fromLabel, toLabel } = req.body || {};

    if (!text || !fromLabel || !toLabel) {
      return res.status(400).json({ error: "Missing text, fromLabel, or toLabel" });
    }

    if (!OLLAMA_API_KEY) {
      return res.status(500).json({
        error: "Server is missing OLLAMA_API_KEY. Set it in your Render environment variables."
      });
    }

    const prompt =
      `Translate the following ${fromLabel} text into ${toLabel}. ` +
      `Reply with only the translation itself — no explanation, no quotes, no labels.\n\n` +
      `Text: ${text}`;

    const response = await fetch("https://ollama.com/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OLLAMA_API_KEY}`
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Ollama cloud error (${response.status}): ${errText}` });
    }

    const data = await response.json();
    const translation = (data.response || "").trim();

    if (!translation) {
      return res.status(502).json({ error: "Model returned an empty response" });
    }

    res.json({ translation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Translingo server running on port ${PORT}`);
});
