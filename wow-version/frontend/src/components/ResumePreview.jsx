import { useMemo } from 'react'

/**
 * Renders resume plain text as a styled HTML document resembling a real resume.
 *
 * Props:
 *  - text: string — raw resume text
 *  - label: string — badge text ("Original Document" / "Optimized Document")
 *  - highlights: string[] — skill names to highlight with amber bg
 */
export default function ResumePreview({ text, label = 'Original Document', highlights = [] }) {
  const sections = useMemo(() => parseResume(text || ''), [text])

  // Build a regex to highlight skill mentions
  const highlightRegex = useMemo(() => {
    if (!highlights.length) return null
    const escaped = highlights.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    return new RegExp(`(${escaped.join('|')})`, 'gi')
  }, [highlights])

  const renderText = (line) => {
    if (!highlightRegex) return line
    const parts = line.split(highlightRegex)
    return parts.map((part, i) => {
      if (highlightRegex.test(part)) {
        highlightRegex.lastIndex = 0
        return (
          <mark key={i} className="bg-amber-100 text-amber-800 px-0.5 rounded-sm">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  return (
    <div className="w-full max-w-[800px] bg-white paper-shadow min-h-[600px] p-16 relative border border-slate-100">
      {/* Badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
        {label}
      </div>

      {/* Resume Content */}
      <div className="space-y-6">
        {sections.map((section, idx) => {
          if (section.type === 'name') {
            return (
              <div key={idx} className="text-center mb-8">
                <h2 className="serif-heading text-3xl font-bold text-slate-900 uppercase tracking-tight mb-1">
                  {renderText(section.content)}
                </h2>
              </div>
            )
          }

          if (section.type === 'contact') {
            return (
              <div key={idx} className="text-center -mt-6 mb-6">
                <p className="text-sm text-slate-500 uppercase tracking-[0.2em] font-medium">
                  {renderText(section.content)}
                </p>
                <div className="w-12 h-1 bg-[#6366f1] mx-auto mt-4" />
              </div>
            )
          }

          if (section.type === 'heading') {
            return (
              <h3 key={idx} className="serif-heading text-lg font-bold border-b border-slate-200 pb-1 mt-8 mb-4 text-slate-900">
                {section.content}
              </h3>
            )
          }

          if (section.type === 'subheading') {
            return (
              <div key={idx} className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-slate-900 text-sm">{renderText(section.content)}</h4>
                {section.date && (
                  <span className="text-xs text-slate-500 font-medium italic">{section.date}</span>
                )}
              </div>
            )
          }

          if (section.type === 'bullet') {
            return (
              <ul key={idx} className="text-sm text-slate-600 space-y-1.5 ml-4 list-disc marker:text-slate-300">
                {section.items.map((item, i) => (
                  <li key={i}>{renderText(item)}</li>
                ))}
              </ul>
            )
          }

          if (section.type === 'text') {
            return (
              <p key={idx} className="text-sm text-slate-600 leading-relaxed">
                {renderText(section.content)}
              </p>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

// --- Resume text parser ---

const SECTION_HEADERS = /^(EXPERIENCE|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS|SUMMARY|OBJECTIVE|PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|PUBLICATIONS|AWARDS|LANGUAGES|INTERESTS|VOLUNTEER|PROFILE|EXPERTISE|QUALIFICATIONS|CORE COMPETENCIES|PROFESSIONAL SUMMARY)/i

function parseResume(text) {
  const lines = text.split('\n').map(l => l.trimEnd())
  const sections = []
  let i = 0

  // First non-empty line = name
  while (i < lines.length && !lines[i].trim()) i++
  if (i < lines.length) {
    sections.push({ type: 'name', content: lines[i].trim() })
    i++
  }

  // Second non-empty line = contact info (if it looks like contact: has @, |, phone, etc.)
  while (i < lines.length && !lines[i].trim()) i++
  if (i < lines.length) {
    const line = lines[i].trim()
    if (line.includes('@') || line.includes('|') || line.includes('linkedin') || /\d{3}[-.\s]?\d{3}/.test(line) || line.includes(',')) {
      sections.push({ type: 'contact', content: line })
      i++
    }
  }

  // Process remaining lines
  let bulletBuffer = []

  const flushBullets = () => {
    if (bulletBuffer.length) {
      sections.push({ type: 'bullet', items: [...bulletBuffer] })
      bulletBuffer = []
    }
  }

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) {
      flushBullets()
      i++
      continue
    }

    // Section header
    if (SECTION_HEADERS.test(line)) {
      flushBullets()
      sections.push({ type: 'heading', content: line.toUpperCase() })
      i++
      continue
    }

    // Bullet point
    if (/^[-•●▪*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      bulletBuffer.push(line.replace(/^[-•●▪*]\s+/, '').replace(/^\d+\.\s+/, ''))
      i++
      continue
    }

    // Line with date pattern on next line or same line — treat as subheading
    const dateMatch = line.match(/(.+?)\s*[|–—-]\s*((?:\d{4}|Present|Current).*)$/i)
    if (dateMatch) {
      flushBullets()
      sections.push({ type: 'subheading', content: dateMatch[1].trim(), date: dateMatch[2].trim() })
      i++
      continue
    }

    // Regular text
    flushBullets()
    sections.push({ type: 'text', content: line })
    i++
  }

  flushBullets()
  return sections
}
