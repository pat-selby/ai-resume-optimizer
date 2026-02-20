# Resume Optimizer - Wow Version

Professional React + FastAPI demo for the AI Workshop.

## Prerequisites

- Python 3.10+
- Node.js 18+
- A Gemini API key (free tier works) -- get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Set up your `.env` file with your Gemini API key:

```bash
cp .env.example .env
```

Then edit `.env` and add your key:

```
GEMINI_API_KEY=your_key_here
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

> **Tip:** You can also skip the `.env` file and set the API key at runtime through the app's UI (a modal will prompt you on first use).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Features

- PDF resume upload with instant text extraction
- AI-powered job description analysis
- Smart clarifying questions
- Resume optimization with side-by-side comparison
- Resume library organized by category
- Optimization history timeline
