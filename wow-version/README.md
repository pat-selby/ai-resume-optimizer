# Resume Optimizer - Wow Version

Professional React + FastAPI demo for the AI Workshop.

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your Gemini API key to .env
uvicorn main:app --reload --port 8000
```

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
