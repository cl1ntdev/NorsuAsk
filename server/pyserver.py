from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import uvicorn
from typing import List
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model + FAISS index
model = SentenceTransformer("all-MiniLM-L6-v2")
dimension = 384  # embedding size for MiniLM
index = faiss.IndexFlatL2(dimension)

text_chunks: List[str] = []
embeddings: np.ndarray | None = None


def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks"""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks


@app.post("/load-txt")
async def load_txt(request: Request):
    global text_chunks, embeddings, index

    with open("baseData.txt", "r", encoding="utf-8") as f:
        raw_text = f.read()

    # chunk the text
    text_chunks = chunk_text(raw_text)

    # generate embeddings
    embeddings = model.encode(text_chunks, convert_to_numpy=True)
    embeddings = np.array(embeddings).astype("float32")
    index.reset()
    index.add(embeddings)  # type: ignore

    return {"message": f"TXT loaded successfully with {len(text_chunks)} chunks"}


@app.post("/ask")
async def ask(req: Request):
    global text_chunks, embeddings, index
    
    data = await req.json()
    query = data.get("message", "")

    # embed query
    query_emb = model.encode([query], convert_to_numpy=True)
    query_emb = np.array(query_emb).astype("float32")

    # search top-3 chunks
    D, I = index.search(query_emb, k=3)  # type: ignore
    results = [text_chunks[i] for i in I[0]]

    # Combine retrieved context into a prompt
    context = "\n".join(results)
    prompt = f"Context:\n{context}\n\nUser Question: {query}\n\nAnswer clearly based on the context above."

    # Call Groq API for AI completion
    try:
        chat_completion = groq.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant"
        )
        reply = chat_completion.choices[0].message.content
    except Exception as e:
        print("error in /ask:", e)
        reply = "Error generating response from AI."

    return {
        "query": query,
        "top_chunks": results,
        "reply": reply
    }


port = 8080
if __name__ == "__main__":
    print("localhost is running on port:", port)
    uvicorn.run(app, host="0.0.0.0", port=port)
