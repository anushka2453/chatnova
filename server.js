import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { CohereClient } from "cohere-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.COHERE_API_KEY;

if (!API_KEY) {
  console.log("❌ API KEY NOT FOUND - Check your .env file");
} else {
  console.log("✅ API KEY LOADED");
}

const cohere = new CohereClient({ token: API_KEY });

app.get("/", (req, res) => {
  res.send("ChatNova Server is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Please send a message." });
    }

    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: userMessage
    });

    const reply = response.text || "No response from ChatNova";

    console.log("✅ Reply:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.json({ reply: `Error: ${error.message}` });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});