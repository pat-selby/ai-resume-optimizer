import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Optimize from './pages/Optimize'
import Library from './pages/Library'
import History from './pages/History'
import { Settings, Sparkles } from 'lucide-react'
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

  const links = [
    { to: '/', label: 'Optimize' },
    { to: '/library', label: 'Library' },
    { to: '/history', label: 'History' },
  ]

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
          <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                OptiResume
              </h1>
              <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-full">
                {links.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `px-5 py-1.5 text-sm font-medium rounded-full transition-all ${
                        isActive
                          ? 'bg-white text-[#6366f1] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowKeyModal(true)}
                className={`p-2 transition-colors ${
                  apiKeySet ? 'text-slate-400 hover:text-slate-900' : 'text-amber-500 hover:text-amber-600'
                }`}
                title={apiKeySet ? 'API Key Set' : 'Set API Key'}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </nav>

        {/* API Key Modal */}
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="serif-heading text-lg font-bold text-slate-900 mb-4">Gemini API Key</h2>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
              <div className="flex gap-3 mt-4 justify-end">
                <button onClick={() => setShowKeyModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-900 font-medium">Cancel</button>
                <button onClick={handleSetKey} className="px-6 py-2 text-sm bg-[#6366f1] text-white rounded-lg font-bold hover:bg-[#4f46e5] transition-colors">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Optimize />} />
            <Route path="/library" element={<Library />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
