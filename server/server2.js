import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import cors from "cors";
import fs from "fs";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let textChunks = [];
let embeddings = [];

// ---- Split text into chunks ----
function chunkText(text, size = 500, overlap = 100) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + size;
    chunks.push(text.slice(start, end));
    start += size - overlap;
  }
  return chunks;
}

// ---- Cosine similarity ----
function cosineSim(A, B) {
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < A.length; i++) {
    dot += A[i] * B[i];
    normA += A[i] * A[i];
    normB += B[i] * B[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---- Load .txt file and create embeddings ----
app.post("/load-txt", async (req, res) => {
  try {
    const rawText = fs.readFileSync("baseData.txt", "utf-8");
    textChunks = chunkText(rawText);

    // Generate embeddings for all chunks
    embeddings = [];
    for (const chunk of textChunks) {
      const emb = await groq.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      embeddings.push(emb.data[0].embedding);
    }

    res.json({ message: "TXT loaded and embedded successfully" });
  } catch (err) {
    console.error("Error in /load-txt:", err);
    res.status(500).json({ error: "Failed to process text file" });
  }
});

// ---- Ask a question ----
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // Get embedding for the question
    const qEmb = await groq.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const qVec = qEmb.data[0].embedding;

    // Find top 3 most relevant chunks
    const scored = embeddings.map((emb, i) => ({
      score: cosineSim(qVec, emb),
      chunk: textChunks[i],
    }));
    scored.sort((a, b) => b.score - a.score);
    const context = scored.slice(0, 3).map(s => s.chunk).join("\n");

    // Ask Groq with context
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Answer the user’s question using ONLY the provided context. If unsure, reply with 'I don’t know'.",
        },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
      ],
    });

    res.json({ answer: completion.choices[0]?.message?.content || "" });
  } catch (err) {
    console.error("Error in /ask:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

const port = 8080;
app.listen(port, () => {
  console.log("Listening on port:", port);
  console.log("API Key:", process.env.GROQ_API_KEY ? "Loaded" : "Missing");
});
