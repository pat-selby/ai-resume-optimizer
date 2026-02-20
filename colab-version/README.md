# AI Resume Optimizer - Colab Version

A complete Resume Optimizer running in Google Colab with a Gradio interface.

## Quick Start

1. Open `resume_optimizer.ipynb` in Google Colab:
   [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/)

2. Run all cells in order
3. When prompted, authorize Google Drive access
4. In the Settings tab, enter your Gemini API key
5. Start optimizing resumes!

## Getting a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in the app's Settings tab

## Features

- **PDF Upload** -- Upload your resume as a PDF for automatic text extraction
- **Job Description Analysis** -- AI extracts key skills, requirements, and keywords as structured JSON
- **Smart Questions** -- AI generates 2-3 clarifying questions to better tailor your resume
- **Resume Optimization** -- AI rewrites your resume to match the job description without inventing experience
- **Category Storage** -- Save optimized resumes by role (ML Engineer, Data Scientist, AI Engineer, Computer Vision, Software Engineer, or Custom)
- **Resume Library** -- View all your saved resumes organized by category
- **Optimization History** -- Timestamped log of every optimization you run
- **Google Drive Persistence** -- Everything is saved to your Google Drive automatically

## How the Notebook Is Organized

| Cell | Purpose |
|------|---------|
| 1 | Install dependencies (`gradio`, `google-generativeai`, `PyMuPDF`) |
| 2 | Mount Google Drive and create data directories |
| 3 | Configuration (model name, categories) |
| 4 | PDF parser and AI engine (`ResumeAI` class) |
| 5 | Resume storage manager (`ResumeStorage` class) |
| 6 | Application state |
| 7 | Event handlers for the UI |
| 8 | Gradio UI definition with three tabs (Optimize, Library, Settings) |
| 9 | Launch the app with a public URL |

## Data Storage

Your data is stored at: `Google Drive/AI_Resume_Optimizer/`
- `resumes/` -- Optimized resumes organized by category subfolders
- `history/` -- Optimization history log (`log.json`)

## Troubleshooting

- **"ModuleNotFoundError"** -- Make sure you ran Cell 1 (the pip install cell) first.
- **Drive mount fails** -- This notebook requires Google Colab. It will not work in local Jupyter.
- **403 or PERMISSION_DENIED from Gemini** -- Your API key may be invalid. Generate a new one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
- **Rate limit error** -- The free Gemini tier has a requests-per-minute limit. Wait 30 seconds and try again.
- **Gradio public URL doesn't load** -- Wait 10 seconds and refresh, or re-run the launch cell.
