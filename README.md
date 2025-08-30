# NORSU-Ask: AI-Powered University Assistant

This AI-powered chatbot is designed to serve the Negros Oriental State University (NORSU) community. Built with a Next.js frontend and a Python backend, it acts as an intelligent virtual assistant for students and faculty. The chatbot uses a dedicated knowledge base of NORSU-related information, leveraging vector search and the Groq API to provide quick and accurate answers to common inquiries. The project's purpose is to make university information more accessible and provide immediate assistance to the NORSU community.

## Features

*   **AI-Powered Chat:** A simple and intuitive chat interface for asking questions.
*   **Context-Aware Responses:** Uses a local knowledge base (`baseData.txt`) to provide relevant answers.
*   **Vector Search:** Employs FAISS for efficient and accurate similarity search.
*   **LLM Integration:** Leverages the Groq API with the Llama 3.1 model for natural language understanding and generation.

## Tech Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/)
    *   [React](https://reactjs.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **Backend:**
    *   [Python](https://www.python.org/)
    *   [FastAPI](https://fastapi.tiangolo.com/)
    *   [SentenceTransformers](https://www.sbert.net/)
    *   [Faiss](https://faiss.ai/)
    *   [Groq API](https://wow.groq.com/)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20 or later)
*   [Python](https://www.python.org/downloads/) (v3.9 or later)
*   `pip` for Python package management

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/norsuask.git
    cd norsuask
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    pip install -r server/requirements.txt
    ```

4.  **Set up environment variables:**
    *   Create a `.env` file in the `server` directory.
    *   Add your Groq API key to the `.env` file:
        ```
        GROQ_API_KEY=your_api_key_here
        ```

5.  **Add knowledge base:**
    *   Create a file named `baseData.txt` in the `server` directory.
    *   Populate this file with the information you want the chatbot to know.

### Running the Application

To run both the frontend and backend servers concurrently, use the following command:

```bash
npm run norsuask # Still need to be fixed
```

To run separateley the frontend and backend servers following command:
```bash
# Front End /root
npm run dev

# Backend /root/server
py pyserver.py
```

This will start:
*   The Next.js frontend on `http://localhost:3000`
*   The Python backend on `http://localhost:8080`

## Project Structure

```
norsuask/
├── public/              # Static assets
├── server/              # Backend FastAPI application
│   ├── pyserver.py      # Main backend logic
│   ├── requirements.txt # Backend dependencies
│   ├── baseData.txt     # Knowledge base for the chatbot
│   └── .env             # Environment variables (Groq API key)
├── src/                 # Frontend Next.js application
│   └── app/
│       ├── page.tsx     # Main application page
│       └── utils/
│           └── _Components/
│               └── Chat.tsx # The chat component
├── next.config.ts       # Next.js configuration
├── package.json         # Project scripts and dependencies
└── README.md            # This file
```