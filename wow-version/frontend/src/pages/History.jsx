import { useState, useEffect } from 'react'
import { getHistory } from '../lib/api'
import { Clock, Loader2 } from 'lucide-react'

const CATEGORY_BADGE_COLORS = {
  ml_engineer:       'bg-blue-500/15 text-blue-400 border-blue-500/25',
  data_scientist:    'bg-purple-500/15 text-purple-400 border-purple-500/25',
  ai_engineer:       'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  computer_vision:   'bg-amber-500/15 text-amber-400 border-amber-500/25',
  software_engineer: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
}

const DEFAULT_BADGE = 'bg-teal-500/15 text-teal-400 border-teal-500/25'

function formatCategoryName(key) {
  if (!key) return 'Unknown'
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function formatTimestamp(ts) {
  if (!ts) return { date: 'Unknown date', time: '' }
  const d = new Date(ts)
  if (isNaN(d)) return { date: 'Unknown date', time: '' }
  const date = d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return { date, time }
}

function TimelineEntry({ entry }) {
  const { date, time } = formatTimestamp(entry.timestamp)
  const categoryKey = entry.category
    ? entry.category.toLowerCase().replace(/\s+/g, '_')
    : null
  const badgeColor = (categoryKey && CATEGORY_BADGE_COLORS[categoryKey]) || DEFAULT_BADGE

  return (
    <div className="relative pl-10 pb-8 group last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-800 group-last:hidden" />

      {/* Timeline dot */}
      <div className="absolute left-[8px] top-1.5 w-[15px] h-[15px] rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center group-hover:border-teal-500/50 transition-colors">
        <Clock size={8} className="text-gray-500 group-hover:text-teal-400 transition-colors" />
      </div>

      {/* Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
        {/* Date/time row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-gray-500">{date}</span>
          {time && <span className="text-xs text-gray-600">{time}</span>}
        </div>

        {/* Job title */}
        <h3 className="text-sm font-semibold text-gray-100 mb-1">
          {entry.job_title || 'Untitled Position'}
        </h3>

        {/* Company */}
        {entry.company && (
          <p className="text-xs text-gray-400 mb-3">{entry.company}</p>
        )}

        {/* Bottom row: category badge + filename */}
        <div className="flex items-center gap-3 flex-wrap">
          {categoryKey && (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${badgeColor}`}>
              {formatCategoryName(categoryKey)}
            </span>
          )}
          {entry.filename && (
            <span className="text-xs text-gray-600 truncate max-w-[200px]">{entry.filename}</span>
          )}
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
        // Ensure newest first
        items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
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
        <Loader2 size={32} className="text-teal-400 animate-spin" />
        <p className="text-sm text-gray-400">Loading history...</p>
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
  if (history.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <Clock size={48} className="mx-auto text-gray-600" />
        <h2 className="text-xl font-bold text-gray-300">Optimization History</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          No optimization history yet. Your resume optimizations will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold mb-2">Optimization History</h2>
        <p className="text-gray-400 text-sm">
          {history.length} optimization{history.length !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {history.map((entry, idx) => (
          <TimelineEntry key={entry.timestamp + idx} entry={entry} />
        ))}
      </div>
    </div>
  )
}
