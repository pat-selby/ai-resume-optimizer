import { useState, useEffect } from 'react'
import { getResumes } from '../lib/api'
import { FolderOpen, ChevronDown, ChevronUp, Loader2, FileText } from 'lucide-react'

const CATEGORY_COLORS = {
  ml_engineer:       { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20',    pill: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  data_scientist:    { bg: 'bg-purple-500/10',   text: 'text-purple-400',  border: 'border-purple-500/20',  pill: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
  ai_engineer:       { bg: 'bg-emerald-500/10',  text: 'text-emerald-400', border: 'border-emerald-500/20', pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  computer_vision:   { bg: 'bg-amber-500/10',    text: 'text-amber-400',   border: 'border-amber-500/20',   pill: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  software_engineer: { bg: 'bg-cyan-500/10',     text: 'text-cyan-400',    border: 'border-cyan-500/20',    pill: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
}

const DEFAULT_COLOR = { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', pill: 'bg-teal-500/15 text-teal-400 border-teal-500/25' }

function formatCategoryName(key) {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function parseFilename(filename) {
  // Try to extract a timestamp prefix like "20250615_143022_" or "2025-06-15T14-30-22_"
  const isoMatch = filename.match(/^(\d{4}-\d{2}-\d{2}T[\d-]+)_(.+)$/)
  if (isoMatch) {
    const dateStr = isoMatch[1].replace(/-/g, (m, offset) => (offset > 9 ? ':' : m))
    const date = new Date(dateStr)
    const name = isoMatch[2].replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')
    return { date: isNaN(date) ? null : date, name }
  }

  const tsMatch = filename.match(/^(\d{8})[_-]?(\d{6})?[_-]?(.+)$/)
  if (tsMatch) {
    const d = tsMatch[1]
    const t = tsMatch[2] || '000000'
    const date = new Date(
      `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}`
    )
    const name = tsMatch[3].replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')
    return { date: isNaN(date) ? null : date, name }
  }

  // No timestamp prefix
  const name = filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')
  return { date: null, name }
}

function formatDate(dateObj) {
  if (!dateObj || isNaN(dateObj)) return null
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ResumeCard({ resume, colorScheme }) {
  const [expanded, setExpanded] = useState(false)
  const { date, name } = parseFilename(resume.filename)
  const displayDate = formatDate(date) || (resume.modified ? formatDate(new Date(resume.modified)) : null)
  const content = resume.content || ''
  const preview = content.slice(0, 300)
  const hasMore = content.length > 300

  return (
    <div className={`bg-gray-900 border ${colorScheme.border} rounded-2xl overflow-hidden transition-all duration-200`}>
      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={18} className={colorScheme.text + ' shrink-0'} />
            <h3 className="text-sm font-semibold text-gray-100 truncate capitalize">{name}</h3>
          </div>
          {displayDate && (
            <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{displayDate}</span>
          )}
        </div>

        {/* Content preview / full */}
        <div className="text-xs text-gray-400 leading-relaxed">
          {expanded ? (
            <pre className="whitespace-pre-wrap break-words font-mono bg-gray-800/50 rounded-xl p-4 max-h-[500px] overflow-y-auto">
              {content}
            </pre>
          ) : (
            <p className="line-clamp-4">
              {preview}
              {hasMore && '...'}
            </p>
          )}
        </div>

        {/* Toggle */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1.5 text-xs font-medium ${colorScheme.text} hover:opacity-80 transition-opacity`}
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Show More
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Library() {
  const [categories, setCategories] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getResumes()
      .then((res) => {
        const cats = res.data.categories || {}
        setCategories(cats)
        const keys = Object.keys(cats)
        if (keys.length > 0) setActiveCategory(keys[0])
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Failed to load resumes.')
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryKeys = Object.keys(categories)
  const activeResumes = activeCategory ? categories[activeCategory] || [] : []

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={32} className="text-teal-400 animate-spin" />
        <p className="text-sm text-gray-400">Loading resumes...</p>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  // Empty state
  if (categoryKeys.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <FolderOpen size={48} className="mx-auto text-gray-600" />
        <h2 className="text-xl font-bold text-gray-300">Resume Library</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          No saved resumes yet. Optimize a resume and save it to see it here.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold mb-2">Resume Library</h2>
        <p className="text-gray-400 text-sm">Browse your saved resumes by category</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categoryKeys.map((key) => {
          const colors = CATEGORY_COLORS[key] || DEFAULT_COLOR
          const isActive = key === activeCategory
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                ${isActive
                  ? colors.pill + ' shadow-sm'
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-200 hover:border-gray-700'
                }
              `}
            >
              {formatCategoryName(key)}
              <span className="ml-2 text-xs opacity-60">({categories[key].length})</span>
            </button>
          )
        })}
      </div>

      {/* Resume Cards */}
      {activeResumes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No resumes in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeResumes.map((resume, idx) => (
            <ResumeCard
              key={resume.filename + idx}
              resume={resume}
              colorScheme={CATEGORY_COLORS[activeCategory] || DEFAULT_COLOR}
            />
          ))}
        </div>
      )}
    </div>
  )
}
