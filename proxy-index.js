const express = require("express");
const axios   = require("axios");
const cors    = require("cors");

const app = express();
app.use(express.json());

// Permite peticiones desde cualquier origen (tu página de Netlify)
app.use(cors());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.get("/", (req, res) => {
  res.json({ status: "✅ Proxy Santa Salud activo" });
});

app.post("/chat", async (req, res) => {
  const { messages, system } = req.body;

  if (!messages || !system) {
    return res.status(400).json({ error: "Faltan parámetros: messages y system son requeridos" });
  }

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system,
        messages,
      },
      {
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.content[0].text });
  } catch (error) {
    console.error("Error Claude:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al contactar Claude API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy corriendo en puerto ${PORT}`));
