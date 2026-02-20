import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'
import { parsePDF } from '../lib/api'

export default function FileUpload({ onTextExtracted }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }

    setError(null)
    setIsLoading(true)
    setFileName(file.name)

    try {
      const response = await parsePDF(file)
      const text = response.data.text
      if (!text || text.trim().length === 0) {
        setError('Could not extract text from this PDF. Try pasting your resume instead.')
        setFileName(null)
      } else {
        onTextExtracted(text)
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to parse PDF. Please try again or paste your resume text.'
      )
      setFileName(null)
    } finally {
      setIsLoading(false)
    }
  }, [onTextExtracted])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }, [handleFile])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFile(file)
    e.target.value = ''
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative flex flex-col items-center justify-center w-full min-h-[280px]
          border-2 border-dashed rounded-3xl cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragging
            ? 'border-[#6366f1] bg-indigo-50 shadow-lg'
            : fileName && !isLoading && !error
              ? 'border-[#6366f1]/40 bg-indigo-50/30'
              : 'border-slate-300 bg-white hover:border-[#6366f1] hover:bg-[#f5f3ff]'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={40} className="text-[#6366f1] animate-spin" />
            <p className="text-sm text-slate-600 font-medium">Parsing PDF...</p>
            <p className="text-xs text-slate-400">{fileName}</p>
          </div>
        ) : fileName && !error ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <FileText size={28} className="text-[#6366f1]" />
            </div>
            <p className="text-sm font-bold text-slate-900">{fileName}</p>
            <p className="text-xs text-[#6366f1] font-medium">PDF parsed successfully</p>
            <p className="text-xs text-slate-400 mt-1">Click or drop to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300
              ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}
            `}>
              <Upload size={28} className={isDragging ? 'text-[#6366f1]' : 'text-slate-400'} />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Drop your PDF here or <span className="text-[#6366f1] font-bold">click to browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports .pdf files only</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
