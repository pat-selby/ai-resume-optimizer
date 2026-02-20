import { useState, useCallback } from 'react'
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ClipboardPaste,
  Upload,
  HelpCircle,
  Save,
  RotateCcw,
  CheckCircle2,
  Download,
  Info,
} from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import StepIndicator from '../components/StepIndicator'
import FileUpload from '../components/FileUpload'
import ResumePreview from '../components/ResumePreview'
import ResumePDF from '../components/ResumePDF'
import { analyzeJD, generateQuestions, optimizeResume, saveResume } from '../lib/api'

export default function Optimize() {
  // Wizard state
  const [step, setStep] = useState(1)

  // Step 1: Resume
  const [inputMode, setInputMode] = useState('upload') // 'upload' | 'paste'
  const [resumeText, setResumeText] = useState('')

  // Step 2: Job Description
  const [jobDescription, setJobDescription] = useState('')

  // Step 3: Analysis + Questions
  const [jdAnalysis, setJdAnalysis] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [missingSkills, setMissingSkills] = useState([])
  const [selectedSkills, setSelectedSkills] = useState(new Set())
  const [strengths, setStrengths] = useState([])
  const [skippedQuestions, setSkippedQuestions] = useState(new Set())

  // Step 4: Results
  const [optimizedResume, setOptimizedResume] = useState('')
  const [previewMode, setPreviewMode] = useState('optimized')
  const [category, setCategory] = useState('ML Engineer')
  const [saveStatus, setSaveStatus] = useState(null)

  // Loading states
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  // ------- Step 2 -> Step 3: Analyze JD + Generate Questions -------
  const handleAnalyze = useCallback(async () => {
    setLoading(true)
    setLoadingMessage('Analyzing job description...')
    try {
      const jdRes = await analyzeJD(jobDescription)
      const analysis = jdRes.data.analysis
      setJdAnalysis(analysis)

      setLoadingMessage('Generating tailored questions...')
      const qRes = await generateQuestions(resumeText, analysis)
      const data = qRes.data

      const qs = data.questions || []
      setQuestions(qs)
      setMissingSkills(data.missing_skills || [])
      setStrengths(data.strengths || [])
      setSelectedSkills(new Set())
      setSkippedQuestions(new Set())

      const initial = {}
      qs.forEach((q) => { initial[q.id] = q.suggested_answer || '' })
      setAnswers(initial)

      setStep(3)
    } catch (err) {
      alert(err.response?.data?.detail || 'Analysis failed. Please check your API key and try again.')
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }, [jobDescription, resumeText])

  // ------- Step 3 -> Step 4: Optimize Resume -------
  const handleOptimize = useCallback(async () => {
    setLoading(true)
    setLoadingMessage('Optimizing your resume...')
    try {
      const formattedAnswers = questions
        .filter((q) => !skippedQuestions.has(q.id))
        .map((q) => ({
          id: q.id,
          question: q.question,
          answer: answers[q.id] || '',
        }))
      const res = await optimizeResume(
        resumeText, jdAnalysis, formattedAnswers, [...selectedSkills]
      )
      setOptimizedResume(res.data.optimized_resume)
      setPreviewMode('optimized')
      setStep(4)
    } catch (err) {
      alert(err.response?.data?.detail || 'Optimization failed. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }, [resumeText, jdAnalysis, questions, answers, selectedSkills, skippedQuestions])

  // ------- Save Resume -------
  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      await saveResume({
        category,
        resume_text: optimizedResume,
        job_title: jdAnalysis?.job_title || '',
        company: jdAnalysis?.company || '',
      })
      setSaveStatus('saved')
    } catch (err) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }, [category, optimizedResume, jdAnalysis])

  // ------- Start Over -------
  const handleStartOver = () => {
    setStep(1)
    setInputMode('upload')
    setResumeText('')
    setJobDescription('')
    setJdAnalysis(null)
    setQuestions([])
    setAnswers({})
    setMissingSkills([])
    setSelectedSkills(new Set())
    setStrengths([])
    setSkippedQuestions(new Set())
    setOptimizedResume('')
    setPreviewMode('optimized')
    setCategory('ML Engineer')
    setSaveStatus(null)
  }

  // ------- Skill Toggle -------
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })
  }

  // ------- Skip Question Toggle -------
  const toggleSkipQuestion = (qId) => {
    setSkippedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(qId)) {
        next.delete(qId)
      } else {
        next.add(qId)
        setAnswers((a) => ({ ...a, [qId]: '' }))
      }
      return next
    })
  }

  // ========================= RENDER =========================

  return (
    <>
      <StepIndicator currentStep={step} />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 bg-white border border-slate-200 rounded-2xl px-10 py-8 shadow-2xl">
            <Loader2 size={36} className="text-[#6366f1] animate-spin" />
            <p className="text-sm text-slate-600 font-medium">{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* ======================== STEP 1: Resume Input ======================== */}
      {step === 1 && (
        <main className="flex-1 flex flex-col items-center px-8 py-16">
          <div className="w-full max-w-2xl">
            <header className="text-center mb-12">
              <h2 className="serif-heading text-5xl font-bold text-slate-900 mb-6">Upload Your Resume</h2>
              <p className="text-slate-500 text-xl leading-relaxed max-w-lg mx-auto">
                Let's start by analyzing your current experience to build a foundation for optimization.
              </p>
            </header>

            {/* Mode Toggle */}
            <div className="flex items-center justify-center mb-10">
              <div className="inline-flex bg-slate-100 p-1.5 rounded-full">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    inputMode === 'upload'
                      ? 'bg-white text-[#6366f1] shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload size={15} />
                  Upload PDF
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    inputMode === 'paste'
                      ? 'bg-white text-[#6366f1] shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ClipboardPaste size={15} />
                  Paste Text
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="mb-8">
              {inputMode === 'upload' ? (
                <FileUpload onTextExtracted={(text) => setResumeText(text)} />
              ) : (
                <div className="bg-white p-2 rounded-3xl paper-shadow border border-slate-100">
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    rows={14}
                    className="w-full p-6 text-slate-700 placeholder-slate-300 bg-transparent focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              )}

              {resumeText && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#6366f1] font-medium">
                  <CheckCircle2 size={16} />
                  <span>Resume loaded ({resumeText.length.toLocaleString()} characters)</span>
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                disabled={!resumeText.trim()}
                className={`flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all ${
                  resumeText.trim()
                    ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-xl shadow-indigo-100 hover:-translate-y-0.5'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ======================== STEP 2: Job Description ======================== */}
      {step === 2 && (
        <main className="flex-1 flex flex-col items-center px-8 py-16">
          <div className="w-full max-w-3xl">
            <header className="text-center mb-12">
              <h2 className="serif-heading text-5xl font-bold text-slate-900 mb-4">Job Description</h2>
              <p className="text-slate-500 text-xl">Paste the complete job description below to begin the analysis.</p>
            </header>

            <div className="bg-white p-2 rounded-3xl paper-shadow border border-slate-100 mb-8">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job title, requirements, and responsibilities here..."
                rows={16}
                className="w-full min-h-[400px] p-8 text-lg text-slate-700 placeholder-slate-300 bg-transparent focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-4 rounded-full text-slate-500 font-bold hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <ArrowLeft size={16} />
                Back to Resume
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!jobDescription.trim()}
                className={`flex items-center gap-2 px-10 py-4 rounded-full text-sm font-bold transition-all ${
                  jobDescription.trim()
                    ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-xl shadow-indigo-100 hover:-translate-y-0.5'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Analyze & Personalize
                <Sparkles size={16} />
              </button>
            </div>

            <div className="mt-12 text-center text-sm text-slate-400">
              <p>Our AI will extract key requirements, missing skills, and interview questions based on your provided text.</p>
            </div>
          </div>
        </main>
      )}

      {/* ======================== STEP 3: Analysis + Personalization (SPLIT) ======================== */}
      {step === 3 && jdAnalysis && (
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel: Inputs */}
          <aside className="w-full lg:w-[45%] bg-white border-r border-slate-200 overflow-y-auto no-scrollbar px-8 py-10">
            <div className="max-w-xl ml-auto">
              <header className="mb-10">
                <h2 className="serif-heading text-4xl font-bold text-slate-900 mb-3">Personalize</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Refine the AI's focus by selecting key technical skills and providing context for specific job requirements.
                </p>
              </header>

              {/* Job Summary */}
              <section className="mb-12">
                <div className="bg-[#fafaf9] border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#6366f1]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-1">Target Position</p>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{jdAnalysis.job_title || 'Position'}</h3>
                    <p className="text-sm text-slate-500">
                      {jdAnalysis.company && `${jdAnalysis.company} • `}
                      {jdAnalysis.experience_level || 'Not specified'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Strengths */}
              {strengths.length > 0 && (
                <section className="mb-12">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verified Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {strengths.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Missing Skills */}
              {missingSkills.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skills to Highlight</h4>
                    <span className="text-[10px] text-slate-400">Click tags to include</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((item) => {
                      const isSelected = selectedSkills.has(item.skill)
                      return (
                        <button
                          key={item.skill}
                          onClick={() => toggleSkill(item.skill)}
                          title={item.relevance}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-2 border-[#6366f1] bg-indigo-50 text-[#6366f1] font-bold shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                          }`}
                        >
                          {item.skill}
                        </button>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Questions */}
              {questions.length > 0 && (
                <section className="mb-12 space-y-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clarifying Context</h4>
                  {questions.map((q, idx) => {
                    const isSkipped = skippedQuestions.has(q.id)
                    return (
                      <div
                        key={q.id}
                        className={`bg-white border border-slate-200 rounded-2xl p-6 transition-all ${
                          isSkipped ? 'opacity-40' : 'hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <span className="serif-heading text-2xl text-slate-300 font-bold">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <p className="text-slate-800 font-medium leading-relaxed flex-1">{q.question}</p>
                          {q.why && (
                            <span className="shrink-0 mt-1" title={q.why}>
                              <Info size={14} className="text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
                            </span>
                          )}
                        </div>
                        {!isSkipped && (
                          <textarea
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder="Describe your experience..."
                            rows={3}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] transition-all"
                          />
                        )}
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => toggleSkipQuestion(q.id)}
                            className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                              isSkipped ? 'text-[#6366f1] hover:text-[#4f46e5]' : 'text-slate-400 hover:text-red-500'
                            }`}
                          >
                            {isSkipped ? 'Unskip' : 'Skip'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </section>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </button>
                <button
                  onClick={handleOptimize}
                  className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-indigo-100 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Generate Optimization
                  <Sparkles size={16} />
                </button>
              </div>
            </div>
          </aside>

          {/* Right Panel: Resume Preview */}
          <section className="hidden lg:flex flex-1 bg-[#fafaf9] items-start justify-center overflow-y-auto no-scrollbar py-12 px-12">
            <ResumePreview
              text={resumeText}
              label="Original Document"
              highlights={missingSkills.map(s => s.skill)}
            />
          </section>
        </main>
      )}

      {/* ======================== STEP 4: Results (SPLIT) ======================== */}
      {step === 4 && (
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel: Actions */}
          <aside className="w-full lg:w-[45%] bg-white border-r border-slate-200 overflow-y-auto no-scrollbar px-8 py-12">
            <div className="max-w-xl ml-auto">
              <header className="mb-8">
                <h2 className="serif-heading text-4xl font-bold text-slate-900 mb-3">Your Optimized Resume</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Your resume has been tailored for the {jdAnalysis?.job_title || 'target'} role
                  {jdAnalysis?.company ? ` at ${jdAnalysis.company}` : ''}.
                </p>
              </header>

              {/* Version Toggle */}
              <section className="mb-12">
                <div className="inline-flex bg-slate-100 p-1 rounded-full">
                  <button
                    onClick={() => setPreviewMode('original')}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                      previewMode === 'original'
                        ? 'bg-white text-[#6366f1] shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setPreviewMode('optimized')}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                      previewMode === 'optimized'
                        ? 'bg-white text-[#6366f1] shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Optimized
                  </button>
                </div>
              </section>

              {/* Save to Library */}
              <section className="mb-12 bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100/50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Save to Library</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-[#6366f1] appearance-none cursor-pointer"
                    >
                      {['ML Engineer', 'Data Scientist', 'AI Engineer', 'Computer Vision', 'Software Engineer', 'Custom'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      saveStatus === 'saved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : saveStatus === 'saving'
                          ? 'bg-slate-100 text-slate-400 cursor-wait'
                          : saveStatus === 'error'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-[#6366f1] hover:bg-[#4f46e5] text-white'
                    }`}
                  >
                    {saveStatus === 'saving' ? (
                      <><Loader2 size={18} className="animate-spin" /> Saving...</>
                    ) : saveStatus === 'saved' ? (
                      <><CheckCircle2 size={18} /> Saved!</>
                    ) : saveStatus === 'error' ? (
                      <><Save size={18} /> Save Failed - Retry</>
                    ) : (
                      <><Save size={18} /> Save Optimization</>
                    )}
                  </button>
                </div>
              </section>

              {/* Start Over */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors group"
                >
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                  Start New Optimization
                </button>
              </div>
            </div>
          </aside>

          {/* Right Panel: Resume Preview */}
          <section className="hidden lg:flex flex-1 bg-[#fafaf9] items-start justify-center overflow-y-auto no-scrollbar py-12 px-12 relative">
            {/* Download PDF Button */}
            <div className="absolute top-8 right-12 z-10">
              <PDFDownloadLink
                document={<ResumePDF text={previewMode === 'optimized' ? optimizedResume : resumeText} />}
                fileName={`resume-${previewMode}.pdf`}
              >
                {({ loading: pdfLoading }) => (
                  <button
                    disabled={pdfLoading}
                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-indigo-100 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Download size={18} />
                    {pdfLoading ? 'Preparing...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>

            <ResumePreview
              text={previewMode === 'optimized' ? optimizedResume : resumeText}
              label={previewMode === 'optimized' ? 'Optimized Document' : 'Original Document'}
            />
          </section>
        </main>
      )}
    </>
  )
}
