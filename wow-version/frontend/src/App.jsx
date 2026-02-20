import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Optimize from './pages/Optimize'
import Library from './pages/Library'
import History from './pages/History'
import { FileText, FolderOpen, Clock, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { setAPIKey, getHealth } from './lib/api'

export default function App() {
  const [apiKeySet, setApiKeySet] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [keyInput, setKeyInput] = useState('')

  useEffect(() => {
    getHealth().then(r => setApiKeySet(r.data.ai_ready)).catch(() => {})
  }, [])

  const handleSetKey = async () => {
    try {
      await setAPIKey(keyInput)
      setApiKeySet(true)
      setShowKeyModal(false)
    } catch (e) {
      alert('Failed to set API key')
    }
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-rose-400 bg-clip-text text-transparent">
                Resume Optimizer
              </h1>
              <div className="flex gap-1">
                {[
                  { to: '/', icon: FileText, label: 'Optimize' },
                  { to: '/library', icon: FolderOpen, label: 'Library' },
                  { to: '/history', icon: Clock, label: 'History' },
                ].map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-500/15 text-teal-400'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                apiKeySet
                  ? 'text-teal-400 bg-teal-500/10 hover:bg-teal-500/20'
                  : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
              }`}
            >
              <Settings size={14} />
              {apiKeySet ? 'API Key Set' : 'Set API Key'}
            </button>
          </div>
        </nav>

        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-lg font-semibold mb-4">Gemini API Key</h2>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-teal-500"
              />
              <div className="flex gap-3 mt-4 justify-end">
                <button onClick={() => setShowKeyModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200">Cancel</button>
                <button onClick={handleSetKey} className="px-4 py-2 text-sm bg-teal-500 text-gray-950 rounded-lg font-medium hover:bg-teal-400">Save</button>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Optimize />} />
            <Route path="/library" element={<Library />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
