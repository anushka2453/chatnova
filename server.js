import dotenv from "dotenv";
import express from "express";
import cors from "cors";

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

app.get("/", (req, res) => {
  res.send("ChatNova Server is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Please send a message." });
    }

    const response = await fetch("https://api.cohere.com/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "command-r-plus-08-2024",
        message: userMessage
      })
    });

    const data = await response.json();

    console.log("API RESPONSE:", JSON.stringify(data, null, 2));

    if (data.message) {
      console.error("❌ Cohere API Error:", data.message);
      return res.json({ reply: `Error: ${data.message}` });
    }

    const reply = data.text || "No response from ChatNova";

    console.log("✅ Reply:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.json({ reply: `Error: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});