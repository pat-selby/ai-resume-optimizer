# Live Demo Prompts - Claude.ai Playground

Build a Resume Optimizer from scratch using Claude.ai + Google Colab in 5 sessions.

**Setup:** Open two browser tabs:
- **Tab 1:** [Claude.ai](https://claude.ai)
- **Tab 2:** [Google Colab](https://colab.research.google.com) (new blank notebook)

**Workflow:** Prompt Claude -> Copy code -> Paste into Colab -> Run -> Test

---

## Session 0: Brainstorming & Project Brief (~3 minutes)

**Why this matters:** This creates the project context you'll paste into every future session. Professional developers always start here.

**Start a new Claude.ai conversation. Paste this:**

> I want to build an AI-powered Resume Optimizer that runs in Google Colab using Gradio for the UI and Google Gemini for the AI.
>
> The app should:
> 1. Let users paste their resume and a job description
> 2. Use Gemini AI to analyze the job description (extract skills, keywords, requirements)
> 3. Use Gemini AI to rewrite the resume tailored to that specific job
> 4. Save optimized resumes to Google Drive organized by job category
>
> Tech constraints:
> - Python only, runs in Google Colab
> - Gradio for the web interface (use gr.Blocks, not gr.Interface)
> - google-genai package for Gemini (NOT the deprecated google-generativeai)
> - Model: gemini-2.0-flash
> - Google Drive for storage
>
> Help me break this into 4 independent build sessions, where each session produces working, testable code. List what each session builds and what I should test after each one.

**What you get back:** A project brief and 4-session breakdown. **Save this response** — you'll reference it in every future session.

**Say to audience:** "This is the most important step. 3 minutes of planning saves 30 minutes of debugging. Now we have a roadmap AND context to feed forward."

---

## Session 1: Gradio UI Skeleton (~5 minutes)

**Start a NEW Claude.ai conversation. Paste this:**

> I'm building an AI Resume Optimizer in Google Colab. Here's my project plan:
>
> - Session 1 (now): Gradio UI skeleton
> - Session 2: Gemini AI integration
> - Session 3: Resume optimization logic
> - Session 4: Google Drive save + resume library
>
> For Session 1, build me a Gradio app with:
> - Title: "AI Resume Optimizer"
> - Two side-by-side columns using gr.Row and gr.Column:
>   - Left: text area "Your Resume" (12 lines)
>   - Right: text area "Job Description" (14 lines)
> - A large primary button: "Analyze & Optimize"
> - An output text area: "Optimized Resume" (12 lines, interactive so user can edit)
> - Use gr.themes.Soft() for a clean look
>
> For now, the button should return a placeholder:
> "Resume: {X} chars | JD: {Y} chars — AI optimization coming in Session 2!"
>
> Requirements:
> - Use gr.Blocks layout (NOT gr.Interface)
> - Put pip install in a separate first cell
> - App launch with share=True for Colab
>
> Give me exactly 2 Colab cells.

**Paste into Colab:** Cell 1 (pip install), Cell 2 (app code). Run both.

**Test:** Click the public Gradio URL. Type in both boxes. Click button. See placeholder message.

---

## Session 2: Gemini AI Integration (~8 minutes)

**Start a NEW Claude.ai conversation. Paste this:**

> I'm building an AI Resume Optimizer in Google Colab. Session 1 is done — I have a working Gradio UI.
>
> For Session 2, I need to connect Google Gemini AI.
>
> Add to my app:
> 1. A Settings section with:
>    - Password input for Gemini API key
>    - "Set API Key" button
>    - Status text showing if key is set
>
> 2. When the main button is clicked, call Gemini to analyze the job description:
>    - Extract: job title, company, must-have skills, nice-to-have skills, key responsibilities, ATS keywords
>    - Show a formatted analysis in the output area
>
> Technical requirements:
> - Use the google-genai package: pip install google-genai
> - Import: from google import genai
> - Client: client = genai.Client(api_key=key)
> - Generate: client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
> - Add google-genai to the pip install cell
>
> Here is my current working code:
>
> ```python
> [PASTE YOUR CELL 2 CODE HERE]
> ```
>
> Give me the updated cells. Keep the same theme.

**Before pasting:** Copy your Cell 2 code from Colab and replace the placeholder.

**Paste into Colab:** Update Cell 1, replace Cell 2. Run all cells.

**Test:** Set API key. Paste a job description. Click button. See AI analysis.

---

## Session 3: Resume Optimization (~8 minutes)

**Start a NEW Claude.ai conversation. Paste this:**

> I'm building an AI Resume Optimizer in Google Colab. Sessions 1-2 are done — I have a Gradio UI that connects to Gemini and analyzes job descriptions.
>
> For Session 3, I want the app to actually OPTIMIZE the resume.
>
> When the button is clicked, do TWO Gemini calls:
>
> 1. First call — Analyze the JD (already working, keep this)
>
> 2. Second call — Optimize the resume:
>    - Send the original resume + the JD analysis to Gemini
>    - Prompt: "You are a professional resume writer with ATS expertise. Rewrite this resume tailored to the target job. Rules:
>      - Keep all information truthful, do NOT invent experience
>      - Weave in keywords from the job description naturally
>      - Rewrite the professional summary for this specific role
>      - Emphasize relevant skills and quantify achievements
>      - Use clean plain text formatting
>      - Output the COMPLETE rewritten resume"
>    - Show the optimized resume in the output
>
> Use google-genai (from google import genai, client.models.generate_content).
>
> Here is my current working code:
>
> ```python
> [PASTE ALL YOUR CURRENT CODE HERE]
> ```
>
> Give me the updated code.

**Test:** Paste resume + JD. Click button. Compare original vs optimized — keywords should be woven in, summary rewritten.

**Say to audience:** "This is the magic moment. Look at the before and after."

---

## Session 4: Save to Google Drive (~8 minutes)

**Start a NEW Claude.ai conversation. Paste this:**

> I'm building an AI Resume Optimizer in Google Colab. Sessions 1-3 are done — the app analyzes JDs and optimizes resumes using Gemini AI.
>
> For Session 4, add save functionality and a resume library.
>
> 1. New cell (before the app): Mount Google Drive and create folder "/content/drive/MyDrive/AI_Resume_Optimizer/resumes"
>
> 2. Add to the Gradio UI after the optimized resume output:
>    - Dropdown for job category: "ML Engineer", "Data Scientist", "AI Engineer", "Computer Vision", "Software Engineer"
>    - "Save Resume" button
>    - Status message for save result
>
> 3. New tab "Resume Library":
>    - "Load Saved Resumes" button
>    - Shows saved resumes grouped by category with previews
>
> 4. Save logic:
>    - Save to subfolder named after category
>    - Filename: YYYYMMDD_HHMMSS_jobtitle.txt
>    - Show success message
>
> Use google-genai (from google import genai).
>
> Here is my current working code:
>
> ```python
> [PASTE ALL YOUR CURRENT CODE HERE]
> ```
>
> Give me all cells including the Drive mount cell.

**Paste into Colab:** Add Drive mount cell, update app cell. Run all. Authorize Drive.

**Test:** Optimize a resume. Select "ML Engineer". Save. Check Library tab. Check Google Drive.

---

## Quick Reference: The Pattern

Every session follows the same pattern:

```
1. NEW Claude conversation (one session, one task)
2. State what's already done (context)
3. State what you want to build (specific ask)
4. Paste your current code (feed context forward)
5. Get code -> paste in Colab -> run -> test
```

## Troubleshooting Prompt

If anything breaks, paste this into the SAME Claude conversation:

> I got this error when running the code:
>
> ```
> [PASTE THE ERROR MESSAGE HERE]
> ```
>
> Please fix it. Show me only the changed code.

This itself is an important lesson: **iterating with AI to fix problems IS the workflow.**

---

## Free Tools

| Tool | URL | Purpose |
|------|-----|---------|
| Claude.ai | claude.ai | AI coding assistant |
| Google Colab | colab.research.google.com | Free Python notebook |
| Gemini API Key | aistudio.google.com/apikey | Free AI API key |
| ChatGPT | chat.openai.com | Alternative AI assistant |
| Google AI Studio | aistudio.google.com | Alternative AI assistant |
