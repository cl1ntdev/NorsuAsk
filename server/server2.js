import express from 'express';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import cors from 'cors';
import fs from 'fs';
import OpenAI from 'openai';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let textChunks = [];
let embeddings = [];

// Split your text into smaller chunks
function chunkText(text, size = 500, overlap = 100) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + size));
    start += size - overlap;
  }
  return chunks;
}

// Cosine similarity for ranking
function cosineSim(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

app.post('/load-txt', async (req, res) => {
  try {
    const raw = fs.readFileSync('baseData.txt', 'utf8');
    textChunks = chunkText(raw);

    embeddings = await Promise.all(
      textChunks.map(async chunk => {
        const resp = await openai.embeddings.create({ model: "text-embedding-3-small", input: chunk });
        return resp.data[0].embedding;
      })
    );

    res.json({ message: 'Text loaded and embedded', chunks: textChunks.length });
  } catch (err) {
    console.error('Error /load-txt:', err);
    res.status(500).json({ error: 'Failed embedding text' });
  }
});

app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const qResp = await openai.embeddings.create({ model: "text-embedding-3-small", input: question });
    const qEmb = qResp.data[0].embedding;

    const scored = embeddings.map((emb, i) => ({
      score: cosineSim(qEmb, emb),
      chunk: textChunks[i]
    }));
    scored.sort((a, b) => b.score - a.score);
    const context = scored.slice(0, 3).map(s => s.chunk).join("\n");

    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // or whichever your Groq account supports
      messages: [
        { role: "system", content: "Use only context; if you don’t know, say 'I don’t know'." },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
      ]
    });

    res.json({ answer: chat.choices[0]?.message?.content || "No response" });
  } catch (err) {
    console.error('Error /ask:', err);
    res.status(500).json({ error: 'Failed to answer query' });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
