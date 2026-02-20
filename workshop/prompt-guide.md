# AI Resume Optimizer - Workshop Prompt Guide

Build a working Resume Optimizer in 4 AI sessions using Google Colab and any free AI tool.

## Before You Start

1. Open [Google Colab](https://colab.research.google.com) and create a new notebook.
2. Open one of these free AI tools in a separate browser tab:
   - [Claude.ai](https://claude.ai) (recommended)
   - [ChatGPT](https://chat.openai.com)
   - [Google AI Studio](https://aistudio.google.com)
3. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey). You will need this in Session 2.

> **How this works:** You will copy each prompt below, paste it into your AI tool, and receive code back. Then you paste that code into your Colab notebook and run it. No prior coding experience required.

## The 4 Principles of AI-Assisted Coding

1. **Decompose first** -- Break your project into small, manageable pieces before asking the AI anything.
2. **One session, one task** -- Each AI conversation should accomplish exactly one thing.
3. **Feed context forward** -- Always tell the AI what you have already built so it can build on top of it.
4. **Test between sessions** -- Run your code after every session. Never stack untested changes.

---

## Session 1: Basic Gradio App Skeleton (8 minutes)

**Goal:** Get a working Gradio web interface with text inputs and a button running in Colab.

### Prompt to paste into your AI tool

Copy everything inside the box below and paste it into Claude, ChatGPT, or Google AI Studio:

> I want to create a simple Python app using Gradio that runs in Google Colab.
>
> The app should have:
> - A text area to paste a resume (label: "Your Resume", 10 lines tall)
> - A text area to paste a job description (label: "Job Description", 10 lines tall)
> - A button labeled "Optimize Resume"
> - An output text area to show the result (label: "Optimized Resume", 10 lines tall)
>
> For now, when the button is clicked, just show a placeholder message: "Optimization will happen here!" in the output area.
>
> Put the pip install for gradio at the very top as a separate cell.
> The app launch should use share=True so it works in Colab.
>
> Give me the code as separate Colab cells I can paste in.

### What to do with the AI's response

1. **Cell 1** in Colab -- Paste the `pip install` cell the AI gives you.
2. **Cell 2** in Colab -- Paste the Gradio app code.
3. Run both cells in order (click the play button on each, or use Shift+Enter).

### How to verify it works

You should see a Gradio interface appear below Cell 2 with two text areas, a button, and an output area. Clicking "Optimize Resume" should display the placeholder message. Colab will also provide a public URL you can open in a new tab.

### Troubleshooting

- **"ModuleNotFoundError: No module named 'gradio'"** -- Make sure you ran the pip install cell first and that it finished without errors.
- **The AI used `gr.Interface` and the layout looks wrong** -- Tell the AI: *"Please rewrite this using gr.Blocks instead of gr.Interface so I can control the layout."*
- **The public URL does not load** -- This occasionally happens with Colab's tunneling. Wait 10 seconds and refresh, or re-run the app cell.

---

## Session 2: Add Gemini AI Integration (8 minutes)

**Goal:** Connect to Gemini AI so the app can analyze job descriptions using real AI.

### Prompt to paste into your AI tool

> I have a Gradio app running in Google Colab. Now I want to add Google Gemini AI to analyze job descriptions.
>
> Here is what I need:
>
> 1. A setup cell that:
>    - Installs the google-genai package (NOT the deprecated google-generativeai)
>    - Imports with: from google import genai
>    - Creates a client with: genai.Client(api_key=key)
>    - Uses the model "gemini-2.0-flash"
>
> 2. Update my Gradio app to:
>    - Add a text input at the top for the Gemini API key (use type="password" so it is hidden)
>    - Add a "Set API Key" button next to it
>    - When "Optimize Resume" is clicked, send both the resume and job description to Gemini with this prompt:
>      "Analyze this job description and identify the key skills, requirements, and keywords that a resume should highlight: [JD TEXT]"
>    - Show the Gemini analysis result in the output area
>
> Here is my current Gradio app code:
> [PASTE YOUR CURRENT GRADIO CODE FROM CELL 2 HERE]
>
> Give me the updated code as separate Colab cells.

**Important:** Before pasting the prompt, replace the placeholder `[PASTE YOUR CURRENT GRADIO CODE FROM CELL 2 HERE]` with your actual code from Cell 2. This is the "feed context forward" principle in action -- the AI needs to see what you already built.

### What to do with the AI's response

1. **New Cell 2** -- Paste the Gemini setup code (this goes between the pip install cell and the app cell).
2. **Replace your existing app cell** with the updated version the AI gives you.
3. Run all cells in order from top to bottom.

### How to verify it works

1. Paste your Gemini API key into the key field and click "Set API Key." You should see a confirmation message.
2. Paste any job description into the "Job Description" box.
3. Click "Optimize Resume."
4. You should see an AI-generated analysis of the job's key skills, requirements, and keywords in the output area.

### Troubleshooting

- **403 or PERMISSION_DENIED error** -- Your API key may be invalid or expired. Generate a new one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
- **"API key not set" or similar message** -- Make sure you clicked the "Set API Key" button and saw a confirmation before clicking "Optimize Resume."
- **Rate limit error** -- The free Gemini tier has a requests-per-minute limit. Wait 30 seconds and try again.
- **The AI gave code that imports the wrong package** -- Make sure it uses `from google import genai` (the google-genai package), NOT the deprecated `google.generativeai`.

---

## Session 3: Resume Optimization (8 minutes)

**Goal:** Make the AI actually rewrite and optimize the resume based on the job description.

### Prompt to paste into your AI tool

> My Gradio app now connects to Gemini and analyzes job descriptions. Now I want it to actually optimize the resume.
>
> When the user clicks "Optimize Resume", the app should:
>
> 1. First, analyze the job description to extract key skills and keywords.
> 2. Then, send a second prompt to Gemini asking it to rewrite the resume, incorporating:
>    - Keywords from the job description
>    - Emphasis on relevant skills and experience
>    - A tailored professional summary that matches the target role
>    - The strict instruction to NOT invent any fake experience or credentials
> 3. Show the fully rewritten, optimized resume in the output area.
>
> Here is my current code:
> [PASTE YOUR CURRENT CODE HERE]
>
> Update the code so the optimize function does both steps (analyze the job description, then rewrite the resume). Give me the updated cell.

**Important:** Replace `[PASTE YOUR CURRENT CODE HERE]` with all of your current code cells. The more context you give the AI, the better the result.

### What to do with the AI's response

1. Replace your Gradio app cell with the updated version.
2. Run all cells from top to bottom.

### How to verify it works

1. Paste a real resume (yours or a sample) into "Your Resume."
2. Paste a real job description into "Job Description."
3. Click "Optimize Resume."
4. You should receive a complete, rewritten resume in the output area. Compare it to the original -- you should see job-specific keywords woven in, a tailored summary, and reorganized bullet points that emphasize relevant experience.

### Troubleshooting

- **The output is just a list of suggestions instead of a full resume** -- Tell the AI: *"The optimization prompt needs to be more specific. Tell Gemini to output the COMPLETE rewritten resume as formatted text, not just a list of suggestions or bullet points."*
- **The output invents fake experience** -- Add this to your Gemini prompt in the code: *"IMPORTANT: Only use information that exists in the original resume. Do not fabricate any experience, skills, or credentials."*
- **The output is cut off or very short** -- The Gemini API may have hit a token limit. Tell the AI: *"Set max_output_tokens to 4096 in the generate_content call."*

---

## Session 4: Save and Categorize Resumes (8 minutes)

**Goal:** Save optimized resumes to Google Drive, organized by job category.

### Prompt to paste into your AI tool

> My resume optimizer app works. Now I want to save optimized resumes to Google Drive, organized by category.
>
> Add these features:
>
> 1. A Google Drive mount cell that:
>    - Mounts Google Drive in Colab
>    - Creates a folder at "/content/drive/MyDrive/AI_Resume_Optimizer/resumes"
>
> 2. A dropdown in the Gradio UI to select a job category. The options should be:
>    "ML Engineer", "Data Scientist", "AI Engineer", "Computer Vision", "Software Engineer"
>
> 3. A "Save Resume" button that:
>    - Saves the optimized resume as a text file in a subfolder named after the selected category
>    - Uses the filename format: YYYYMMDD_HHMMSS_category.txt
>    - Shows a success message with the full saved file path
>
> 4. A "View Saved Resumes" button that:
>    - Lists all saved resumes grouped by category
>    - Shows the filename and date for each saved resume
>
> Here is my current code:
> [PASTE YOUR CURRENT CODE HERE]
>
> Give me all updated cells, including the Drive mount cell.

### What to do with the AI's response

1. **New cell near the top** (after imports, before the app) -- Paste the Google Drive mount cell.
2. **Replace your Gradio app cell** with the updated version.
3. Run all cells in order. When the Drive mount cell runs, Colab will ask you to authorize access to your Google Drive -- click "Allow."

### How to verify it works

1. Optimize a resume as you did before.
2. Select a category from the dropdown (e.g., "ML Engineer").
3. Click "Save Resume." You should see a success message with the file path.
4. Click "View Saved Resumes." Your saved resume should appear in the list under its category.
5. Open Google Drive in your browser and navigate to `My Drive > AI_Resume_Optimizer > resumes`. You should see a subfolder with your saved file.

### Troubleshooting

- **"Drive not mounted" or mount fails** -- This only works in Google Colab, not in local Jupyter notebooks. Make sure you are running in Colab.
- **"Permission denied" when saving** -- Re-run the Drive mount cell. If it still fails, try `Runtime > Disconnect and delete runtime` in Colab, then reconnect and run all cells again.
- **Save button does nothing** -- Make sure you have run the optimize step first. The save button should only work when there is optimized text in the output area.

---

## You Did It!

You just built a working AI-powered Resume Optimizer from scratch using free tools. Here is what you created across the four sessions:

- **Session 1:** A Gradio web interface running in Google Colab
- **Session 2:** Gemini AI integration for job description analysis
- **Session 3:** AI-powered resume rewriting and optimization
- **Session 4:** Google Drive storage with category-based organization

All in about 30 minutes, using only copy-paste prompts and free AI tools.

### What You Practiced

- **Decomposing** a project into four independent sessions
- **Feeding context forward** by pasting your existing code into each new prompt
- **Testing between sessions** to catch issues early
- **Iterating with AI** by using troubleshooting prompts to fix problems

### Explore the Full Version

Check out the `colab-version/` folder in this repository for a more advanced version that includes:

- PDF resume upload (not just text paste)
- AI-powered clarifying questions before optimization
- Resume history log with timestamps
- Additional job categories

### Free Tools Reference

| Tool | URL | What It Does |
|------|-----|--------------|
| Google Colab | [colab.research.google.com](https://colab.research.google.com) | Free Python notebook in the cloud |
| Claude.ai | [claude.ai](https://claude.ai) | AI coding assistant (recommended) |
| ChatGPT | [chat.openai.com](https://chat.openai.com) | AI coding assistant |
| Google AI Studio | [aistudio.google.com](https://aistudio.google.com) | AI coding assistant + API key portal |
| Gemini API Key | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Free API key for Gemini AI |
