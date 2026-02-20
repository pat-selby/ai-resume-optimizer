# AI Resume Optimizer Workshop - Lesson Plan

**Duration:** 60 minutes
**Audience:** Mixed (beginners to experienced coders)
**Core message:** AI tools let anyone build real, functional apps

## Materials Needed
- Laptop with wow version running (React + FastAPI)
- Google Colab open in browser
- AI tool open (Claude.ai recommended for demo)
- This lesson plan
- prompt-guide.md (share link ready)
- Sample resume and job descriptions (in sample-data/)

## Pre-Workshop Setup (15 min before)
- Start FastAPI backend: `cd wow-version/backend && uvicorn main:app --reload --port 8000`
- Start React frontend: `cd wow-version/frontend && npm run dev`
- Verify the wow app works: upload sample resume (`sample-data/sample_resume.txt`), paste a sample JD (`sample-data/job_descriptions/ml_engineer.txt`), run through the full flow
- Open Google Colab with a blank notebook
- Open Claude.ai in another tab
- Have the repository URL ready to share
- Test that the Gemini API key works
- Have a backup Gemini API key ready in case of quota issues

---

## Segment 1: Hook (0:00 - 0:03) - 3 minutes

**On screen:** Nothing yet / title slide if you have one

**Say:**
- "How many of you have applied for jobs and had to customize your resume? Show of hands."
- "It's painful, right? Reading through the job description, figuring out which keywords to add, rewriting your summary..."
- "What if I told you that by the end of this hour, every single one of you will have built an AI tool that does this automatically?"
- "And you don't need to be a programmer to do it."

**Transition:** "Let me show you what's possible."

---

## Segment 2: Wow Demo (0:03 - 0:08) - 5 minutes

**On screen:** Switch to React app at localhost:5173

**Do:**
1. Show the clean UI briefly -- "This is a Resume Optimizer built with AI tools"
2. Click "Set API Key" -- enter your key
3. Upload the sample resume PDF (from sample-data/) -- show instant text extraction
4. Paste the ML Engineer job description (from `sample-data/job_descriptions/ml_engineer.txt`)
5. Click through the steps -- show the JD analysis (skills extracted, keywords identified)
6. Answer the AI's clarifying questions briefly
7. Show the optimized resume -- point out how keywords were woven in, summary was rewritten
8. Save to "ML Engineer" category
9. Quick peek at the Library -- "It organizes your resumes by role"

**Say:**
- "This took me about 2 hours to build. I'm not a frontend developer -- AI tools built 90% of this."
- "But here's the thing -- this uses some paid AI tools. The React framework, the professional design..."
- "What if I told you we can build the CORE of this -- the AI part that actually optimizes resumes -- using completely FREE tools, in about 30 minutes?"

**Transition:** "Let's do it together. But first, let me share the ONE skill that makes this possible."

---

## Segment 3: AI-Assisted Coding Principles (0:08 - 0:18) - 10 minutes

**On screen:** Can show this as bullet points or just talk through them

**The 4 Principles:**

**Principle 1: Decompose First (2 min)**
- "Before you even open an AI tool, break your project into pieces."
- "Our resume optimizer has 4 independent parts: the UI, the AI connection, the optimization logic, and the save feature."
- "Each of these is one conversation with AI."
- "This is the most important skill -- AI works best when you give it a focused task."

**Principle 2: One Session, One Task (2 min)**
- "Each AI conversation should do ONE thing."
- "Don't say 'build me an entire app.' Say 'build me a form with these 3 fields.'"
- "This is called session-based development. New task? New conversation."
- "Why? Because AI loses track if you pile too much into one conversation."

**Principle 3: Feed Context Forward (3 min)**
- "When you start session 2, you tell the AI what you already built."
- "You paste your existing code and say 'here's what I have, now add this feature.'"
- "The AI needs to see your code to build on it correctly."
- Demo quickly: "Watch -- I'll show you how this works in a moment."

**Principle 4: Test Between Sessions (3 min)**
- "After every session, you RUN your code."
- "Don't stack 3 sessions of code without testing."
- "If something breaks, you fix it in that session before moving on."
- "This is how professionals work too -- small increments, test often."

**Transition:** "Okay, enough theory. Let's build. Open Google Colab -- I'm sharing the link in chat."

---

## Segment 4: Live Build - Session 1 (0:18 - 0:26) - 8 minutes

**On screen:** Google Colab (blank notebook) + Claude.ai side by side

**Goal:** Get a working Gradio web interface with text inputs and a button.

**Do:**
1. "Session 1: We're building the skeleton -- just the UI, no AI yet."
2. Open Claude.ai (or your chosen AI tool)
3. Show the Session 1 prompt from the prompt guide -- read it aloud briefly
4. Paste the prompt into Claude
5. Wait for response
6. "See? It gave us the code. Let's paste it in."
7. Create Cell 1 in Colab -- paste the pip install command
8. Create Cell 2 -- paste the Gradio app code
9. Run both cells
10. "Look -- we have a working web app! In 3 minutes!"
11. Show the public Gradio URL -- click it, show it works in a new tab

**Say to students:**
- "Now it's your turn. The prompt is in the guide I shared. Paste it into YOUR AI tool."
- "It doesn't matter if you use Claude, ChatGPT, or Gemini -- the prompt works with all of them."
- Give them 3-4 minutes to do it themselves
- "Raise your hand if you see a Gradio interface!" (celebrate)

**Troubleshooting:**
- If someone gets an error: "Try running the cells again" or "Make sure the pip install cell ran first"
- If Gradio doesn't launch: "Make sure `share=True` is in the launch command"
- If someone gets `gr.Interface` layout issues: Tell them to ask their AI to rewrite using `gr.Blocks`

---

## Segment 5: Live Build - Session 2 (0:26 - 0:34) - 8 minutes

**On screen:** Claude.ai with new conversation

**Goal:** Connect to Gemini AI so the app can analyze job descriptions.

**Do:**
1. "Session 2: Adding Gemini AI. Notice -- NEW conversation. One session, one task."
2. Explain briefly: "We need a Gemini API key -- it's free. Link is in the guide."
3. Show the Session 2 prompt -- highlight: "See how I'm pasting my existing code? That's 'feed context forward.'"
4. Paste prompt into Claude
5. Get response, update the Colab cells
6. Run all cells from top to bottom
7. Test: enter API key, paste a job description, click optimize
8. "We now have AI analyzing job descriptions!"

**Say to students:**
- "Your turn. Start a NEW conversation in your AI tool."
- "Copy the Session 2 prompt, but paste YOUR code where it says `[PASTE YOUR CURRENT GRADIO CODE FROM CELL 2 HERE]`"
- Give them 4 minutes
- Walk around, help anyone stuck

**Troubleshooting:**
- 403/PERMISSION_DENIED: API key may be invalid -- have them regenerate at aistudio.google.com/apikey
- Wrong import: Make sure it's `google.generativeai`, not something else
- Rate limit: Wait 30 seconds, try again

---

## Segment 6: Live Build - Session 3 (0:34 - 0:42) - 8 minutes

**On screen:** Claude.ai with new conversation

**Goal:** Make the AI rewrite and optimize the resume for the target job.

**Do:**
1. "Session 3: The actual resume optimization."
2. Same pattern: new conversation, paste Session 3 prompt with existing code
3. Get updated code, paste in Colab
4. Run all cells from top to bottom
5. Test with sample resume (`sample-data/sample_resume.txt`) + ML Engineer JD
6. Show the optimized resume -- compare with original
7. "This is the magic moment -- AI is rewriting the resume to match the job!"

**Students follow along** (4 min)

**Troubleshooting:**
- Output is suggestions instead of a full resume: Tell the AI to instruct Gemini to output the COMPLETE rewritten resume
- Output invents fake experience: Add the "do not fabricate" instruction to the prompt
- Output is cut off: Set `max_output_tokens` to 4096

---

## Segment 7: Live Build - Session 4 (0:42 - 0:50) - 8 minutes

**On screen:** Claude.ai with new conversation

**Goal:** Save optimized resumes to Google Drive by category.

**Do:**
1. "Final session: Saving resumes to Google Drive by category."
2. Same pattern: new conversation, paste Session 4 prompt with existing code
3. Show Drive mount cell, category dropdown, save functionality
4. Run all cells -- authorize Google Drive when prompted
5. Test: optimize a resume, select "ML Engineer" category, click save, verify success message
6. Click "View Saved Resumes" -- show it appears in the library
7. Open Google Drive in browser -- navigate to `My Drive > AI_Resume_Optimizer > resumes`

**Students follow along** (4 min)

**Celebrate:** "Everyone launch your app! You just built an AI-powered Resume Optimizer from scratch!"

---

## Segment 8: Wrap Up (0:50 - 0:60) - 10 minutes

**On screen:** Show the GitHub repository

**Do:**
1. Share the repository link
2. "Everything we built today is in this repo -- plus the wow version you saw at the start."
3. Walk through what's in the repo:
   - `colab-version/` -- The full Colab notebook with all features (PDF upload, clarifying questions, history log)
   - `wow-version/` -- The React + FastAPI version from the opening demo
   - `workshop/prompt-guide.md` -- The prompt guide they used today
   - `sample-data/` -- Sample resume and job descriptions for practice
4. Recap the 4 principles (quick -- 30 seconds each):
   - Decompose first
   - One session, one task
   - Feed context forward
   - Test between sessions

**Say:**
- "The skill isn't coding. The skill is knowing how to break a problem down and direct AI."
- "Whether you use Claude, ChatGPT, Gemini, or whatever comes next -- these principles work."
- "The prompt guide is yours to keep. Use it as a template for your own projects."

**Q&A:** Open floor for remaining time.

---

## Emergency Backup Plans

**If the live demo breaks:**
- Have the completed Colab notebook (`colab-version/resume_optimizer.ipynb`) ready to show
- "This happens in real development too -- let me show you the finished version and we'll debug together"

**If running behind on time:**
- Skip Session 4 (save/categorize) -- the core experience is Sessions 1-3
- Share the prompt guide and let students finish Session 4 on their own
- The 4 principles segment can be shortened to 5 minutes if needed

**If API key issues:**
- Have a backup API key ready
- Can demonstrate without live AI by showing pre-recorded results or the completed notebook output

**If Colab is slow or down:**
- Fallback: walk through the completed notebook (`colab-version/resume_optimizer.ipynb`) as a read-along
- Focus on the principles and prompt engineering aspects
- Students can run the notebook later on their own

**If a student's AI tool gives very different code:**
- This is expected and normal -- different AI tools produce different code
- The key is that the structure matches: a Gradio app with the right inputs and outputs
- If their code doesn't work, suggest: "Tell the AI: 'This code gives me an error. Here is the error message: [paste error]. Please fix it.'"
- This itself is an important lesson: iterating with AI to fix problems is part of the workflow
