# Workshop Presentation Plan

**For:** Gamma slide creation
**Duration:** ~60 minutes total
**Format:** Limited slides, heavy on demos and live coding
**Demo environment:** Claude.ai playground (browser) + Google Colab

---

## SLIDE DECK OUTLINE (12 slides)

### Slide 1: Title
**"Build an AI App in 30 Minutes"**
- Subtitle: A Hands-On Workshop on AI-Assisted Coding
- Your name, date, company

### Slide 2: The Hook
**"Who here has customized a resume for a job application?"**
- The pain: reading JDs, guessing keywords, rewriting for every role
- The promise: "You'll build an AI tool that does this automatically today"
- "And you don't need to be a programmer"

### Slide 3: The Wow Demo (screenshot)
**Screenshot of the wow-version app in action**
- Callouts: PDF upload, AI analysis, skill gaps, optimized output, saved library
- "This took ~2 hours. AI wrote 90% of it."
- "But the CORE of this? We'll build it together in 30 minutes with free tools."

### Slide 4: Techniques Over Tools
**"Tools change every 6 months. Techniques last forever."**
- Visual: timeline of tools (GitHub Copilot -> Cursor -> Claude Code -> Windsurf -> Lovable -> ???)
- Counter-visual: techniques that haven't changed (decomposition, context management, iterative refinement, testing)
- Quote: "Learn to direct AI, not memorize tool menus"

### Slide 5: The Vibe Coding Workflow
**Research -> Plan -> Implement -> Review -> Iterate**
- 1. **Brainstorm** - "What am I building? What are the pieces?"
- 2. **Plan** - "Break it into independent sessions"
- 3. **Implement** - "One AI session per piece, feed context forward"
- 4. **Review** - "Test after every session"
- 5. **Iterate** - "Paste the error back to AI, ask it to fix"
- Key stat: "Catching a mistake in planning = 5 min. Catching it in debugging = 50 min."

### Slide 6: The 4 Principles
**The Core Framework for AI-Assisted Coding**
1. **Decompose First** - Break project into pieces BEFORE opening AI
2. **One Session, One Task** - Each AI conversation does ONE thing
3. **Feed Context Forward** - Paste existing code into each new session
4. **Test Between Sessions** - Run code after every session, never stack untested changes

### Slide 7: Good Prompts vs Bad Prompts
**Specificity = Quality**
| Bad Prompt | Good Prompt |
|------------|-------------|
| "Build me a resume app" | "Build a Gradio app in Google Colab with a resume text area (10 lines), a JD text area (10 lines), an Optimize button, and an output area. Use gr.Blocks. Launch with share=True." |
| "Add AI to my app" | "Add Gemini AI using the google-genai package. Use model gemini-2.0-flash. Here is my current code: [paste code]" |

- Tips: Constrain length, format, scope, style
- Always include: what framework, what platform, what you already have

### Slide 8: Live Build Time
**"Let's Build Together - 4 Sessions"**
| Session | What We Build | Time |
|---------|--------------|------|
| 1 | Gradio UI skeleton | ~5 min |
| 2 | Gemini AI integration | ~8 min |
| 3 | Resume optimization | ~8 min |
| 4 | Save to Google Drive | ~8 min |

- "Open Google Colab + Claude.ai in separate tabs"
- "Follow along - prompt guide link in chat"

### Slide 9: Resources Slide
**Everything You Need (share this link)**
- GitHub repo QR code + link
- What's in the repo:
  - `colab-version/` - Complete notebook, ready to run
  - `wow-version/` - Professional React + FastAPI demo
  - `workshop/prompt-guide.md` - Every prompt from today
  - `sample-data/` - Resume + job descriptions to practice with
- Free tools: Claude.ai, ChatGPT, Google AI Studio, Gemini API key

### Slide 10: Bonus - My AI Development Pipeline
**"How I actually build things"**
- Tool: **Claude Code** (CLI-based AI coding agent)
- Why: runs in terminal, reads/writes files directly, understands full codebase
- My power-ups:
  - **Superpowers Skills** - pre-built workflows for brainstorming, debugging, TDD, code review
  - **Superdesign** - AI design agent for UI/UX before writing code
  - **Context7 MCP** - pulls live, up-to-date library docs into AI context (no hallucinated APIs)
- Key insight: "These are techniques wrapped in tools. The techniques are what matter."

### Slide 11: MCP Servers - The Secret Weapon
**"Model Context Protocol = Plugins for AI"**
- What: MCP lets AI tools connect to external services (docs, databases, APIs, browsers)
- Examples I use:
  - **Context7** - Live documentation for any library, version-specific
  - **Browser automation** - AI controls Chrome for testing
  - **Notion/Monday** - AI reads/updates project management
- Why it matters: "AI that can read your actual docs doesn't hallucinate API calls"
- Where to find them: smithery.ai, mcp.so, awesome-mcp-servers

### Slide 12: What's Next
**"The skill isn't coding. The skill is directing AI."**
- Practice: rebuild this with a different use case (cover letter, LinkedIn summary, portfolio)
- Level up: try Claude Code, Cursor, or Windsurf for bigger projects
- Stay safe: AI code has ~1.7x more issues - always review, always test
- Connect: your contact info, GitHub link again

---

## LIVE CODING SESSION PROMPTS

These are the exact prompts to use during the live demo. Each session is a **new Claude.ai conversation**. You copy the prompt, paste it into Claude, get code back, paste into Colab.

**Important browser workflow notes:**
- Tab 1: Claude.ai playground
- Tab 2: Google Colab notebook
- Tab 3: The running Gradio app (after first launch)
- For each session: start a NEW Claude.ai conversation
- Copy code blocks from Claude, switch to Colab tab, paste into cells

---

### SESSION 1: Gradio App Skeleton (~5 minutes)

**Goal:** Working web interface with inputs and a button. No AI yet.

**Prompt to paste into Claude.ai:**

```
I want to create a simple Python app using Gradio that runs in Google Colab.

The app should have:
- A title "AI Resume Optimizer" at the top
- Two side-by-side columns:
  - Left column: a text area labeled "Your Resume" (12 lines tall)
  - Right column: a text area labeled "Job Description" (12 lines tall)
- A button labeled "Optimize Resume" (primary style, large)
- An output text area labeled "Optimized Resume" (12 lines tall)

For now, when the button is clicked, just return the message:
"AI optimization coming in Session 2! Your resume has X characters and the JD has Y characters."
(Replace X and Y with actual character counts from the inputs.)

Requirements:
- Use gr.Blocks (NOT gr.Interface) for layout control
- Use gr.themes.Soft() for a clean look
- The launch must use share=True so it works in Colab
- Put the pip install in a separate cell at the top

Give me exactly 2 Colab cells I can copy-paste.
```

**After Claude responds:**
1. Paste Cell 1 (pip install) into Colab, run it
2. Paste Cell 2 (Gradio app) into Colab, run it
3. Click the public URL - show the working app
4. Type something in both boxes, click button, show the placeholder response

**Say:** "We have a working web app. Took 2 minutes. Now let's add AI."

---

### SESSION 2: Add Gemini AI Integration (~8 minutes)

**Goal:** Connect to Gemini so clicking the button actually analyzes the JD.

**Prompt to paste into Claude.ai (NEW conversation):**

```
I have a Gradio app running in Google Colab. I want to add Google Gemini AI.

Here is what I need:

1. Update the pip install cell to also install google-genai

2. Add a Settings section to the Gradio UI:
   - A password text input for the Gemini API key
   - A "Set API Key" button
   - A status text showing whether the key is set

3. When "Optimize Resume" is clicked:
   - Initialize a genai.Client with the API key
   - Send the job description to Gemini (model: "gemini-2.0-flash") with this prompt:
     "Analyze this job description. Extract: job title, company, must-have skills,
     nice-to-have skills, key responsibilities, and important ATS keywords.
     Format as a clear summary."
   - Show the analysis result in the output area

Use the new google-genai package (NOT the deprecated google-generativeai):
- Import: from google import genai
- Client: genai.Client(api_key=key)
- Generate: client.models.generate_content(model="gemini-2.0-flash", contents=prompt)

Here is my current code:

[PASTE YOUR CELL 2 CODE HERE]

Give me the updated cells. Keep the same Gradio theme and layout.
```

**Before pasting:** Replace `[PASTE YOUR CELL 2 CODE HERE]` with actual Cell 2 code from Colab.

**Say while waiting:** "Notice I'm feeding context forward - I pasted my existing code so Claude knows what I already have."

**After Claude responds:**
1. Update Cell 1 with new pip install
2. Replace Cell 2 with updated code
3. Run all cells top to bottom
4. Enter API key, paste a sample JD, click Optimize
5. Show the AI analysis result

**Say:** "We now have AI analyzing job descriptions. Session 3 - let's make it actually optimize the resume."

---

### SESSION 3: Resume Optimization (~8 minutes)

**Goal:** AI analyzes the JD AND rewrites the resume to match.

**Prompt to paste into Claude.ai (NEW conversation):**

```
My Gradio app connects to Gemini AI and analyzes job descriptions. Now I want it to actually optimize the resume.

When the user clicks "Optimize Resume", the app should do TWO AI calls:

1. First call - Analyze the JD:
   Send the job description to Gemini and ask it to extract key skills, requirements,
   and ATS keywords as JSON.

2. Second call - Optimize the resume:
   Send BOTH the original resume AND the JD analysis to Gemini with this instruction:
   "You are a professional resume writer. Rewrite this resume to be perfectly tailored
   to the target job. Rules:
   - Keep all information truthful - do NOT invent experience
   - Naturally weave in keywords from the job description
   - Rewrite the professional summary to match the target role
   - Emphasize relevant skills and achievements
   - Use strong action verbs and quantify where possible
   - Output the COMPLETE rewritten resume as clean text"

3. Show the optimized resume in the output area.

Use the google-genai package:
- from google import genai
- client.models.generate_content(model="gemini-2.0-flash", contents=prompt)

Here is my current code:

[PASTE ALL YOUR CURRENT CODE HERE]

Update the code. Keep the same theme and layout.
```

**After Claude responds:**
1. Replace the app cell with updated code
2. Run all cells
3. Paste sample resume + sample JD, click Optimize
4. Show the optimized resume side by side with original
5. Point out: keywords woven in, summary rewritten, relevant experience highlighted

**Say:** "This is the magic moment. Compare the original to the optimized version - see how it pulled in the keywords?"

---

### SESSION 4: Save to Google Drive (~8 minutes)

**Goal:** Save optimized resumes to Drive, organized by category.

**Prompt to paste into Claude.ai (NEW conversation):**

```
My resume optimizer works. Now I want to add two features: save to Google Drive and a resume library.

Add these features:

1. A Google Drive mount cell (separate cell, runs before the app):
   - Mount Google Drive
   - Create folder at "/content/drive/MyDrive/AI_Resume_Optimizer/resumes"

2. In the Gradio UI, add below the optimized resume output:
   - A dropdown to select job category: "ML Engineer", "Data Scientist",
     "AI Engineer", "Computer Vision", "Software Engineer"
   - A "Save Resume" button
   - A status message showing save result

3. A second tab called "Resume Library":
   - A "Load Saved Resumes" button
   - Shows all saved resumes grouped by category with file previews

4. Save logic:
   - Save as text file in a subfolder named after the category
   - Filename: YYYYMMDD_HHMMSS_jobtitle.txt
   - Show success message with filename

Use the google-genai package (from google import genai).

Here is my current code:

[PASTE ALL YOUR CURRENT CODE HERE]

Give me all cells including the Drive mount cell.
```

**After Claude responds:**
1. Add Drive mount cell near top, run it (authorize Drive)
2. Replace app cell with updated code
3. Run all cells
4. Optimize a resume, select "ML Engineer", click Save
5. Switch to Library tab, click Load - show it appears
6. Open Google Drive in browser - show the file is there

**Say:** "You just built a complete AI application. Four sessions, four principles, one working app."

---

## TIMING BREAKDOWN

| Segment | Duration | Content |
|---------|----------|---------|
| Hook + Wow Demo | 0:00 - 0:08 | Slides 1-3, live wow-version demo |
| Principles + Techniques | 0:08 - 0:18 | Slides 4-7 |
| Session 1 (UI) | 0:18 - 0:23 | Live code + students follow |
| Session 2 (AI) | 0:23 - 0:31 | Live code + students follow |
| Session 3 (Optimize) | 0:31 - 0:39 | Live code + students follow |
| Session 4 (Save) | 0:39 - 0:47 | Live code + students follow |
| Bonus Pipeline + MCP | 0:47 - 0:53 | Slides 10-11 |
| Resources + Q&A | 0:53 - 1:00 | Slides 9, 12 |

---

## PRESENTER NOTES

### Key things to say during live coding:
- Before Session 1: "Notice how specific this prompt is. Not 'build me an app' but exactly what inputs, what layout, what framework."
- Before Session 2: "NEW conversation. One session, one task. And I'm pasting my existing code - feeding context forward."
- Before Session 3: "Same pattern. New conversation, paste existing code, one focused ask."
- After Session 4: "Four sessions, four principles. This is how professionals build with AI too."

### If something breaks during live demo:
- "This is normal! This happens in real development. Let's fix it together."
- Copy the error, paste it back to Claude: "I got this error: [error]. Please fix it."
- "See? Iterating with AI to fix problems IS the workflow."

### For the MCP/Pipeline bonus section:
- Keep it aspirational, not tutorial - "This is where you go AFTER today"
- Show a quick screenshot of Claude Code in terminal if possible
- Context7: "Instead of AI hallucinating an API that doesn't exist, it pulls the actual current docs"
- Superpowers: "Pre-built workflows so you don't reinvent brainstorming, debugging, TDD every time"
- Superdesign: "Design the UI before writing code - AI generates visual mockups first"
