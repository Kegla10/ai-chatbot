let conversation = [];

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // dodaj user message v zgodovino
    conversation.push({ role: "user", content: userMessage });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation
    });

    const reply = completion.choices[0].message.content;

    // dodaj AI odgovor v zgodovino
    conversation.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Napaka pri AI odgovoru" });
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
