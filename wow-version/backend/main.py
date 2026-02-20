"""
FastAPI backend for the Resume Optimizer demo.

Run with:  uvicorn main:app --reload --port 8000
"""

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_engine import ResumeAI

# ---------------------------------------------------------------------------
# Bootstrap
# ---------------------------------------------------------------------------

load_dotenv()

app = FastAPI(title="Resume Optimizer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"
RESUMES_DIR = DATA_DIR / "resumes"
HISTORY_FILE = DATA_DIR / "history.json"

# Ensure data directories exist on startup
RESUMES_DIR.mkdir(parents=True, exist_ok=True)
if not HISTORY_FILE.exists():
    HISTORY_FILE.write_text("[]", encoding="utf-8")

# AI engine singleton - configured when the user supplies a key
ai = ResumeAI(api_key=os.getenv("GEMINI_API_KEY"))

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------


class SetKeyRequest(BaseModel):
    api_key: str


class AnalyzeJDRequest(BaseModel):
    jd_text: str


class GenerateQuestionsRequest(BaseModel):
    resume_text: str
    jd_analysis: dict[str, Any]


class AnswerItem(BaseModel):
    id: int
    question: str
    answer: str


class OptimizeRequest(BaseModel):
    resume_text: str
    jd_analysis: dict[str, Any]
    answers: list[AnswerItem]
    selected_skills: list[str] = []


class SaveResumeRequest(BaseModel):
    category: str
    job_title: str
    company: str
    resume_text: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/api/health")
async def health():
    """Health check - also reports whether the AI engine is configured."""
    return {"status": "ok", "ai_ready": ai.is_ready}


@app.post("/api/set-key")
async def set_key(body: SetKeyRequest):
    """Set or update the Gemini API key at runtime."""
    try:
        ai.configure(body.api_key)
        return {"status": "ok", "message": "API key set successfully"}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    """Accept a PDF upload and return the extracted text."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    contents = await file.read()
    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc)
        doc.close()
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {exc}")

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract any text from the PDF.")

    return {"text": text.strip()}


@app.post("/api/analyze-jd")
async def analyze_jd(body: AnalyzeJDRequest):
    """Send job description text to Gemini for structured analysis."""
    if not ai.is_ready:
        raise HTTPException(status_code=400, detail="AI engine not configured. Set an API key first.")
    try:
        analysis = ai.analyze_job_description(body.jd_text)
        return {"analysis": analysis}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {exc}")


@app.post("/api/generate-questions")
async def generate_questions(body: GenerateQuestionsRequest):
    """Get skill gaps, clarifying questions, and strengths by comparing resume against JD."""
    if not ai.is_ready:
        raise HTTPException(status_code=400, detail="AI engine not configured. Set an API key first.")
    try:
        result = ai.generate_questions(body.resume_text, body.jd_analysis)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {exc}")


@app.post("/api/optimize")
async def optimize(body: OptimizeRequest):
    """Generate an optimized resume from the original, JD analysis, and user answers."""
    if not ai.is_ready:
        raise HTTPException(status_code=400, detail="AI engine not configured. Set an API key first.")
    try:
        answers_dicts = [a.model_dump() for a in body.answers]
        optimized = ai.optimize_resume(
            body.resume_text, body.jd_analysis, answers_dicts, body.selected_skills
        )
        return {"optimized_resume": optimized}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {exc}")


@app.post("/api/save-resume")
async def save_resume(body: SaveResumeRequest):
    """Save an optimized resume to the local filesystem, organized by category."""
    # Create category folder
    category_dir = RESUMES_DIR / _safe_filename(body.category)
    category_dir.mkdir(parents=True, exist_ok=True)

    # Build a unique filename
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    resume_id = uuid.uuid4().hex[:8]
    filename = f"{_safe_filename(body.job_title)}_{timestamp}_{resume_id}.txt"
    filepath = category_dir / filename

    # Write the resume text
    filepath.write_text(body.resume_text, encoding="utf-8")

    # Append to history
    record = {
        "id": resume_id,
        "category": body.category,
        "job_title": body.job_title,
        "company": body.company,
        "filename": str(filepath.relative_to(DATA_DIR)),
        "saved_at": datetime.now(timezone.utc).isoformat(),
    }
    _append_history(record)

    return {"status": "ok", "id": resume_id, "path": str(filepath.relative_to(DATA_DIR))}


@app.get("/api/resumes")
async def list_resumes():
    """List all saved resumes grouped by category."""
    result: dict[str, list[dict]] = {}
    if not RESUMES_DIR.exists():
        return {"resumes": result}

    for category_dir in sorted(RESUMES_DIR.iterdir()):
        if not category_dir.is_dir():
            continue
        category = category_dir.name
        files = []
        for f in sorted(category_dir.iterdir()):
            if f.is_file():
                files.append({
                    "filename": f.name,
                    "path": str(f.relative_to(DATA_DIR)),
                    "size_bytes": f.stat().st_size,
                    "modified": datetime.fromtimestamp(
                        f.stat().st_mtime, tz=timezone.utc
                    ).isoformat(),
                    "content": f.read_text(encoding="utf-8", errors="replace"),
                })
        result[category] = files

    return {"resumes": result}


@app.get("/api/history")
async def get_history():
    """Return the optimization history."""
    history = _read_history()
    return {"history": history}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _safe_filename(name: str) -> str:
    """Sanitize a string for use as a filename or directory name."""
    # Replace spaces with underscores, strip non-alphanumeric chars (except _ and -)
    name = name.strip().replace(" ", "_")
    name = "".join(c for c in name if c.isalnum() or c in ("_", "-"))
    return name or "unnamed"


def _read_history() -> list[dict]:
    """Read the history JSON file."""
    try:
        return json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def _append_history(record: dict) -> None:
    """Append a record to the history JSON file."""
    history = _read_history()
    history.append(record)
    HISTORY_FILE.write_text(json.dumps(history, indent=2), encoding="utf-8")
