import { useState, useEffect } from 'react'
import { getHistory } from '../lib/api'
import { Clock, Loader2, Eye } from 'lucide-react'

const CATEGORY_BADGE_COLORS = {
  ml_engineer:       'bg-indigo-50 text-[#6366f1] border-indigo-100',
  data_scientist:    'bg-purple-50 text-purple-600 border-purple-100',
  ai_engineer:       'bg-emerald-50 text-emerald-600 border-emerald-100',
  computer_vision:   'bg-amber-50 text-amber-600 border-amber-100',
  software_engineer: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  frontend:          'bg-emerald-50 text-emerald-600 border-emerald-100',
  product:           'bg-amber-50 text-amber-600 border-amber-100',
}

const DEFAULT_BADGE = 'bg-slate-50 text-slate-600 border-slate-200'

function formatCategoryName(key) {
  if (!key) return 'General'
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function formatTimestamp(ts) {
  if (!ts) return { date: 'Unknown date', time: '' }
  const d = new Date(ts)
  if (isNaN(d)) return { date: 'Unknown date', time: '' }
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return { dateObj: d, time }
}

function groupByDate(entries) {
  const groups = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  entries.forEach((entry) => {
    const { dateObj } = formatTimestamp(entry.saved_at)
    if (!dateObj || isNaN(dateObj)) {
      const key = 'Unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push(entry)
      return
    }

    let label
    if (dateObj.toDateString() === today.toDateString()) {
      label = 'Today'
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday'
    } else {
      label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(entry)
  })

  return groups
}

function HistoryEntry({ entry }) {
  const { time } = formatTimestamp(entry.saved_at)
  const categoryKey = entry.category
    ? entry.category.toLowerCase().replace(/\s+/g, '_')
    : null
  const badgeColor = (categoryKey && CATEGORY_BADGE_COLORS[categoryKey]) || DEFAULT_BADGE

  return (
    <div className="entry-card group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-[#6366f1]/30 transition-all cursor-pointer">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {categoryKey && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                {formatCategoryName(categoryKey)}
              </span>
            )}
            {time && (
              <span className="text-[11px] text-slate-400 font-medium">{time}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#6366f1] transition-colors">
            {entry.job_title || 'Untitled Position'}
          </h3>
          {entry.company && (
            <p className="text-slate-500 text-sm">
              {entry.company}
              {entry.filename && <> &bull; {entry.filename}</>}
            </p>
          )}
        </div>

        {/* Mini doc preview */}
        <div className="w-20 h-24 bg-slate-50 border border-slate-100 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center p-2">
          <div className="w-full h-full space-y-1.5">
            <div className="h-1 w-3/4 bg-slate-200 rounded-full" />
            <div className="h-1 w-full bg-slate-100 rounded-full" />
            <div className="h-1 w-5/6 bg-slate-100 rounded-full" />
            <div className="h-1 w-1/2 bg-[#6366f1]/20 rounded-full" />
          </div>
          <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={20} className="text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getHistory()
      .then((res) => {
        const items = res.data.history || []
        items.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at))
        setHistory(items)
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Failed to load history.')
      })
      .finally(() => setLoading(false))
  }, [])

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 size={32} className="text-[#6366f1] animate-spin" />
        <p className="text-sm text-slate-500">Loading history...</p>
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

  // Empty state
  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-6">
          <Clock size={36} />
        </div>
        <h3 className="serif-heading text-2xl font-bold text-slate-900 mb-2">No history yet</h3>
        <p className="text-slate-500 text-sm max-w-xs text-center">
          Your optimization timeline will appear here as you use the tool.
        </p>
      </div>
    )
  }

  const groups = groupByDate(history)

  return (
    <div className="flex-1">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-16 text-center md:text-left">
          <h1 className="serif-heading text-5xl font-bold text-slate-900 mb-4">History</h1>
          <p className="text-slate-500 text-lg">
            Your optimization timeline — reviewing and refining your career path.
          </p>
        </header>

        {/* Timeline Sections */}
        <div className="space-y-12">
          {Object.entries(groups).map(([label, entries]) => (
            <section key={label}>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-4">
                <span>{label}</span>
                <div className="h-px bg-slate-200 flex-1" />
              </h2>
              <div className="space-y-4">
                {entries.map((entry, idx) => (
                  <HistoryEntry key={(entry.saved_at || '') + idx} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-slate-300">End of History</p>
        </div>
      </div>
    </div>
  )
}
