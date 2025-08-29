from fastapi import FastAPI, Request
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import uvicorn

app = FastAPI()

# Initialize model + FAISS index
model = SentenceTransformer("all-MiniLM-L6-v2")
dimension = 384  # embedding size for MiniLM
index = faiss.IndexFlatL2(dimension)

text_chunks = []
embeddings = None


def chunk_text(text, chunk_size=300, overlap=50):
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
    index.add(embeddings)

    return {"message": f"TXT loaded successfully with {len(text_chunks)} chunks"}


@app.post("/ask")
async def ask(req: Request):
    global text_chunks, embeddings, index

    data = await req.json()
    query = data.get("message", "")

    # embed query
    query_emb = model.encode([query], convert_to_numpy=True)

    # search top-3 chunks
    D, I = index.search(query_emb, k=3)
    results = [text_chunks[i] for i in I[0]]

    return {
        "query": query,
        "top_chunks": results
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
