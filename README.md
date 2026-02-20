# AI Resume Optimizer

An AI-powered tool that tailors your resume for specific job descriptions. Built as a teaching project for an AI-assisted coding workshop.

## What's In This Repo

### `wow-version/` - Professional Demo (React + FastAPI)
A polished, full-featured version running locally. Demonstrates what's possible with modern AI coding tools.
- React + Tailwind frontend with multi-step wizard
- FastAPI + Gemini backend with PDF parsing
- Resume library with category organization
- Optimization history timeline

**[Setup instructions](wow-version/README.md)**

### `colab-version/` - Google Colab Notebook (Gradio)
A complete version that runs entirely in Google Colab. No installation required.
- Gradio web interface with 3 tabs
- PDF upload + text paste support
- AI-powered JD analysis and resume optimization
- Google Drive storage by category

**[Setup instructions](colab-version/README.md)**

### `workshop/` - Workshop Materials
Everything you need to run or follow the workshop.
- **[prompt-guide.md](workshop/prompt-guide.md)** - 4-session prompt guide for building the app from scratch
- **[lesson-plan.md](workshop/lesson-plan.md)** - Detailed 60-minute instructor script with timing

### `sample-data/` - Demo Data
- Sample resume (Alex Chen - ML/Data professional)
- 3 job descriptions: ML Engineer, Data Scientist, AI Engineer

## How the App Works

```
Upload/paste your base resume
        |
Paste a job description
        |
AI analyzes the JD --> extracts skills, keywords, requirements
        |
AI asks clarifying questions about your experience
        |
You answer the questions
        |
AI generates an optimized resume tailored to that job
        |
Save it under a category (ML Engineer, Data Scientist, etc.)
```

## The 4 Principles of AI-Assisted Coding

These are the core skills taught in the workshop:

1. **Decompose first** - Break your project into independent pieces before opening an AI tool
2. **One session, one task** - Each AI conversation handles ONE focused task
3. **Feed context forward** - When starting a new session, paste your existing code so AI can build on it
4. **Test between sessions** - Run your code after every session. Don't stack unverified changes.

## Building It Yourself (The 4-Session Approach)

Using any free AI tool (Claude.ai, ChatGPT, or Gemini), you can build a working version in 4 sessions:

| Session | What You Build | Time |
|---------|---------------|------|
| 1 | Gradio app skeleton with text inputs | ~8 min |
| 2 | Gemini AI integration for JD analysis | ~8 min |
| 3 | Resume optimization logic | ~8 min |
| 4 | Save to Google Drive by category | ~8 min |

Full prompts for each session are in **[workshop/prompt-guide.md](workshop/prompt-guide.md)**.

## Getting a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Use this key in the app's settings

## Free AI Tools

- [Claude.ai](https://claude.ai) - Strong at code generation and editing
- [ChatGPT](https://chat.openai.com) - Most widely available
- [Google AI Studio](https://aistudio.google.com) - Access to Gemini models

## Tech Stack

| Component | Wow Version | Colab Version |
|-----------|------------|---------------|
| Frontend | React + Tailwind | Gradio |
| Backend | FastAPI | Inline Python |
| AI | Gemini 1.5 Flash | Gemini 1.5 Flash |
| PDF Parsing | PyMuPDF | PyMuPDF |
| Storage | Local filesystem | Google Drive |
| Deployment | localhost | Colab + Gradio share link |
