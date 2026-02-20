import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getResumes } from '../lib/api'
import { Layers, FileText, Trash2, Loader2, UploadCloud, ArrowRight, Search, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORY_COLORS = {
  ml_engineer:       { dot: 'bg-blue-500',    iconBg: 'bg-blue-50',    iconText: 'text-blue-600' },
  data_scientist:    { dot: 'bg-purple-500',   iconBg: 'bg-purple-50',  iconText: 'text-purple-600' },
  ai_engineer:       { dot: 'bg-emerald-500',  iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
  computer_vision:   { dot: 'bg-amber-500',    iconBg: 'bg-amber-50',   iconText: 'text-amber-600' },
  software_engineer: { dot: 'bg-cyan-500',     iconBg: 'bg-cyan-50',    iconText: 'text-cyan-600' },
}

const DEFAULT_COLOR = { dot: 'bg-slate-400', iconBg: 'bg-slate-50', iconText: 'text-slate-600' }

function formatCategoryName(key) {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function parseFilename(filename) {
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

  const name = filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')
  return { date: null, name }
}

function formatDate(dateObj) {
  if (!dateObj || isNaN(dateObj)) return null
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatSize(bytes) {
  if (!bytes) return null
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function ResumeCard({ resume, colorScheme }) {
  const [expanded, setExpanded] = useState(false)
  const { date, name } = parseFilename(resume.filename)
  const displayDate = formatDate(date) || (resume.modified ? formatDate(new Date(resume.modified)) : null)
  const content = resume.content || ''
  const preview = content.slice(0, 200)
  const hasMore = content.length > 200

  return (
    <div className="card-hover bg-white border border-slate-100 rounded-3xl p-6 flex flex-col h-full">
      {/* Top row: icon + actions */}
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 ${colorScheme.iconBg} ${colorScheme.iconText} rounded-2xl`}>
          <FileText size={24} />
        </div>
        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-6 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${colorScheme.dot}`} />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            {formatCategoryName(resume.category || 'general')}
          </span>
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight capitalize">{name}</h4>

        {content && (
          <div className="mt-4">
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-4 rounded-xl italic">
              {expanded ? content : preview}
              {!expanded && hasMore && '...'}
            </p>
            {hasMore && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
                className="flex items-center gap-1.5 text-xs font-medium text-[#6366f1] hover:opacity-80 transition-opacity mt-2"
              >
                {expanded ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show More</>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          {displayDate || 'No date'}
          {resume.size_bytes ? <> &bull; {formatSize(resume.size_bytes)}</> : null}
        </div>
        <span className="text-sm font-bold text-[#6366f1]">View</span>
      </div>
    </div>
  )
}

export default function Library() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState({})
  const [activeCategory, setActiveCategory] = useState(null) // null = "All"
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getResumes()
      .then((res) => {
        const cats = res.data.resumes || {}
        setCategories(cats)
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Failed to load resumes.')
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryKeys = Object.keys(categories)
  const totalCount = categoryKeys.reduce((sum, k) => sum + categories[k].length, 0)

  // Get resumes for current view
  let activeResumes = []
  if (activeCategory) {
    activeResumes = categories[activeCategory] || []
  } else {
    // "All" — flatten
    categoryKeys.forEach((k) => {
      activeResumes = activeResumes.concat(
        categories[k].map((r) => ({ ...r, category: k }))
      )
    })
  }

  // Filter by search
  if (search.trim()) {
    const q = search.toLowerCase()
    activeResumes = activeResumes.filter(
      (r) => r.filename.toLowerCase().includes(q) || (r.content || '').toLowerCase().includes(q)
    )
  }

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={32} className="text-[#6366f1] animate-spin" />
        <p className="text-sm text-slate-500">Loading resumes...</p>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex max-w-[1440px] mx-auto w-full">
      {/* Left Sidebar: Categories */}
      <aside className="w-1/4 border-r border-slate-200 p-8 pt-12 hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar">
        <div className="mb-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Categories</h3>
          <nav className="space-y-1">
            {/* All Resumes */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-left ${
                activeCategory === null
                  ? 'bg-indigo-50 text-[#6366f1] font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Layers size={16} />
                All Resumes
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeCategory === null
                  ? 'bg-white border border-indigo-100'
                  : 'text-slate-400 opacity-0 group-hover:opacity-100'
              }`}>
                {totalCount}
              </span>
            </button>

            {categoryKeys.map((key) => {
              const colors = CATEGORY_COLORS[key.toLowerCase()] || DEFAULT_COLOR
              const isActive = key === activeCategory
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-indigo-50 text-[#6366f1] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    {formatCategoryName(key)}
                  </span>
                  <span className={`text-xs ${
                    isActive
                      ? 'bg-white px-2 py-0.5 rounded-full border border-indigo-100'
                      : 'text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}>
                    {categories[key].length}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content: Library Grid */}
      <div className="flex-1 p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="serif-heading text-5xl font-bold text-slate-900 mb-2">Library</h2>
            <p className="text-slate-500 text-lg">Manage and access your optimized documents.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search library..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Empty state */}
        {categoryKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-6">
              <UploadCloud size={36} />
            </div>
            <h3 className="serif-heading text-2xl font-bold text-slate-900 mb-2">No resumes yet</h3>
            <p className="text-slate-500 text-sm max-w-xs text-center mb-8">
              Optimize a resume and save it to your library to see it here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-xs font-bold uppercase tracking-widest text-[#6366f1] inline-flex items-center gap-2 hover:gap-3 transition-all"
            >
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        ) : activeResumes.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm text-slate-500">No resumes match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeResumes.map((resume, idx) => {
              const catKey = resume.category || activeCategory || 'general'
              const colors = CATEGORY_COLORS[catKey.toLowerCase()] || DEFAULT_COLOR
              return (
                <ResumeCard
                  key={resume.filename + idx}
                  resume={{ ...resume, category: catKey }}
                  colorScheme={colors}
                />
              )
            })}

            {/* Upload CTA card */}
            <div
              onClick={() => navigate('/')}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center h-full group cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all mb-4">
                <UploadCloud size={28} />
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">Upload New Resume</p>
              <p className="text-xs text-slate-400 text-center max-w-[200px]">
                Start a new optimization to add to your library.
              </p>
              <span className="mt-6 text-xs font-bold uppercase tracking-widest text-[#6366f1] group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                Get Started <ArrowRight size={12} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
