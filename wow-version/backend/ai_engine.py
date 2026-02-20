"""
AI Engine for Resume Optimizer - powered by Google Gemini.

Provides three core capabilities:
  1. Analyze a job description into structured data
  2. Generate clarifying questions by comparing resume vs JD
  3. Produce a fully optimized resume
"""

import json
import re
from typing import Any

import google.generativeai as genai


def _strip_code_fences(text: str) -> str:
    """Remove markdown code fences (```json ... ``` or ``` ... ```) from LLM output."""
    text = text.strip()
    # Remove opening fence with optional language tag
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    # Remove closing fence
    text = re.sub(r"\n?```\s*$", "", text)
    return text.strip()


class ResumeAI:
    """Wrapper around Gemini 1.5 Flash for resume-optimization tasks."""

    def __init__(self, api_key: str | None = None):
        self.model = None
        if api_key:
            self.configure(api_key)

    # ------------------------------------------------------------------
    # Configuration
    # ------------------------------------------------------------------

    def configure(self, api_key: str) -> None:
        """Set (or change) the Gemini API key and instantiate the model."""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    @property
    def is_ready(self) -> bool:
        return self.model is not None

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _generate(self, prompt: str) -> str:
        """Send a prompt to Gemini and return the raw text response."""
        if not self.is_ready:
            raise RuntimeError("AI engine is not configured. Set a Gemini API key first.")
        response = self.model.generate_content(prompt)
        return response.text

    def _generate_json(self, prompt: str) -> Any:
        """Send a prompt, strip code fences, and parse the result as JSON."""
        raw = self._generate(prompt)
        cleaned = _strip_code_fences(raw)
        return json.loads(cleaned)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def analyze_job_description(self, jd_text: str) -> dict:
        """Parse a job description into structured fields.

        Returns a dict with keys:
            job_title, company, must_have_skills, nice_to_have_skills,
            key_responsibilities, keywords, experience_level, summary
        """
        prompt = f"""You are an expert recruiter and job-description analyst.

Analyze the following job description and return a JSON object with exactly
these keys (no extra keys):

- "job_title": string - the title of the role
- "company": string - the company name (use "" if not mentioned)
- "must_have_skills": list of strings - required / mandatory skills
- "nice_to_have_skills": list of strings - preferred / bonus skills
- "key_responsibilities": list of strings - primary duties
- "keywords": list of strings - important keywords and phrases a resume
  should contain to rank well for this role
- "experience_level": string - e.g. "Entry", "Mid", "Senior", "Lead", etc.
- "summary": string - a 2-3 sentence plain-English summary of the role

Return ONLY valid JSON. No explanation, no markdown, no extra text.

--- JOB DESCRIPTION ---
{jd_text}
"""
        return self._generate_json(prompt)

    def generate_questions(self, resume_text: str, jd_analysis: dict) -> dict:
        """Compare resume against JD analysis and produce skill gaps, questions, and strengths.

        Returns a dict with keys: missing_skills, questions, strengths
        """
        jd_json = json.dumps(jd_analysis, indent=2)
        prompt = f"""You are a career coach helping someone tailor their resume to a specific job.

Below you will find:
1. The candidate's current resume text.
2. A structured analysis of the target job description.

Your task: analyze the gaps between the resume and the job requirements, then return a JSON object with exactly these three keys:

1. "missing_skills": an array of 3-6 skills/technologies the job requires but the resume does NOT clearly demonstrate. Each item has:
   - "skill": string - the skill or technology name
   - "relevance": string - one sentence explaining why this matters for the job

2. "questions": an array of 2-3 clarifying questions to ask the candidate. Each item has:
   - "id": integer starting at 1
   - "question": string - the question to ask
   - "why": string - brief explanation of why this matters
   - "suggested_answer": string - a plausible draft answer based on what you can infer from the resume (the candidate will edit this)

3. "strengths": an array of 2-3 strings, each a short sentence describing something the resume already does well for this job.

Return ONLY valid JSON. No explanation, no markdown, no extra text.

--- RESUME ---
{resume_text}

--- JOB ANALYSIS ---
{jd_json}
"""
        return self._generate_json(prompt)

    def optimize_resume(
        self,
        resume_text: str,
        jd_analysis: dict,
        answers: list[dict],
        selected_skills: list[str] | None = None,
    ) -> str:
        """Return the full text of an optimized resume.

        Parameters
        ----------
        resume_text : str
            The candidate's original resume.
        jd_analysis : dict
            Structured JD analysis from ``analyze_job_description``.
        answers : list[dict]
            The candidate's answers to the clarifying questions.
            Each dict has keys ``id``, ``question``, ``answer``.
        selected_skills : list[str] | None
            Skills the candidate wants highlighted in the optimized resume.
        """
        jd_json = json.dumps(jd_analysis, indent=2)
        answers_text = "\n".join(
            f"Q{a.get('id', '?')}: {a.get('question', '')}\nA: {a.get('answer', '')}"
            for a in answers
            if a.get('answer', '').strip()
        )

        skills_section = ""
        if selected_skills:
            skills_section = f"""
--- SKILLS TO HIGHLIGHT ---
The candidate wants these skills emphasized (they may have experience not shown in the resume):
{', '.join(selected_skills)}
"""

        prompt = f"""You are a professional resume writer with deep expertise in ATS
optimization and modern hiring practices.

Your task: rewrite the candidate's resume so it is **perfectly tailored**
to the target job description. Incorporate the additional information the
candidate provided in their answers to the clarifying questions.

Guidelines:
- Keep the resume **truthful** - do not fabricate experience.
- Use strong action verbs and quantify achievements where possible.
- Naturally weave in the important keywords from the job description.
- Use a clean, professional format (plain text, clear section headers).
- Aim for 1-2 pages of content.
- Place the most relevant experience and skills prominently.

Return ONLY the final resume text. No commentary, no markdown fences.

--- ORIGINAL RESUME ---
{resume_text}

--- JOB ANALYSIS ---
{jd_json}

--- CANDIDATE'S ADDITIONAL ANSWERS ---
{answers_text}
{skills_section}"""
        return self._generate(prompt).strip()
