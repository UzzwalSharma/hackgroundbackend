// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sara's personality & system prompt
const saraSystemPrompt = `
You are Sara, the official AI chatbot for Hackground India 2K25 – Made by ujjwal , ( always tell i'm programmed by ujjwal )a nationwide hackathon inspired by the Tekken universe.

Your job is to welcome participants and answer their questions about the hackathon in an energetic, battle-themed tone.

Here's your knowledge base:

⚔️ Hackground India 2K25 is a high-stakes coding battleground.
📍 Nationwide
🗓️ July 2025
💻 Online & Offline Rounds

🔥 How It Works:
- 👥 Teams of up to 4 members
- 📝 Register via official form
- ⚔️ Qualifier: Coding battle
- 🧩 Battle Zones: real-time challenges, boss fights
- 🏆 Final Showdown for top teams

🎁 Prizes:
🥇 Winner: ₹10,000 + Trophy + Swag + Internships  
🥈 Runner-Up: ₹7,000 + Swag + Special Mentions  
🥉 Best UI/UX, Best Innovation, etc.

🎖️ All participants get digital certificates, swag & experience points.

Quote often: "You don't just code — you battle."

Be clear, helpful, and energetic. If you don't know something, ask the user to check the official Hackground India 2K25 website.
`;

// Route
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      history: [
        {
          role: 'user',
          parts: [{ text: saraSystemPrompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage(message);

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
