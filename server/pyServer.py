import os
import fitz  # PyMuPDF
import faiss
import numpy as np
from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

# Load API key
load_dotenv()
client = OpenAI(api_key=os.getenv("GROQ_API_KEY"))

app = Flask(__name__)

pdf_index = None
pdf_chunks = []

# ---- Extract text from PDF ----
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# ---- Split text into chunks ----
def chunk_text(text, size=500, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end])
        start += size - overlap
    return chunks

# ---- Create embeddings + FAISS index ----
def create_vector_store(text):
    global pdf_index, pdf_chunks
    pdf_chunks = chunk_text(text)

    # Create FAISS index
    dimension = 1536  # embedding size for text-embedding-3-small
    pdf_index = faiss.IndexFlatL2(dimension)

    vectors = []
    for chunk in pdf_chunks:
        emb = client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        ).data[0].embedding
        vectors.append(emb)

    vectors = np.array(vectors).astype("float32")
    pdf_index.add(vectors)

# ---- Search + answer ----
def get_answer(question):
    q_emb = client.embeddings.create(
        model="text-embedding-3-small",
        input=question
    ).data[0].embedding
    q_emb = np.array([q_emb]).astype("float32")

    # Search top 3 matches
    D, I = pdf_index.search(q_emb, 3)
    context = "\n".join([pdf_chunks[i] for i in I[0]])

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Answer only using the provided context. If unsure, say 'I don’t know'."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
        ]
    )
    return completion.choices[0].message.content

# ---- API Routes ----
@app.route("/load-pdf", methods=["POST"])
def load_pdf():
    text = extract_text_from_pdf("baseData.txt")
    create_vector_store(text)
    return jsonify({"message": "PDF loaded successfully"})

@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.json
    question = data.get("question")
    answer = get_answer(question)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
