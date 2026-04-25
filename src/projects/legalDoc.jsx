import { useState, useRef } from 'react'
import ProjectPage from '../components/ProjectPage'
import { legalDocConfig, API_BASE } from './legalDocConfig'

const ACCEPTED = '.pdf,.txt'

export default function LegalDoc() {
  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  function switchMode(next) {
    setMode(next)
    setResult(null)
    setError(null)
  }

  async function analyze() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      let res
      if (mode === 'text') {
        res = await fetch(`${API_BASE}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
      } else {
        const form = new FormData()
        form.append('file', file)
        res = await fetch(`${API_BASE}/analyze/file`, {
          method: 'POST',
          body: form,
        })
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error: ${res.status}`)
      }
      setResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const canAnalyze = !loading && (mode === 'text' ? text.trim() : file !== null)

  return (
    <ProjectPage config={legalDocConfig}>
      <div className="analyzer">
        <div className="analyzer-toggle">
          <button
            className={`toggle-btn${mode === 'text' ? ' toggle-btn--active' : ''}`}
            onClick={() => switchMode('text')}
          >
            Paste text
          </button>
          <button
            className={`toggle-btn${mode === 'file' ? ' toggle-btn--active' : ''}`}
            onClick={() => switchMode('file')}
          >
            Upload file
          </button>
        </div>

        {mode === 'text' ? (
          <>
            <p className="section-label">Document</p>
            <textarea
              className="analyzer-input"
              placeholder="Paste your legal document here..."
              value={text}
              onChange={e => setText(e.target.value)}
              rows={10}
            />
          </>
        ) : (
          <>
            <p className="section-label">File <span className="analyzer-hint">PDF or TXT</span></p>
            <div
              className={`file-drop${file ? ' file-drop--selected' : ''}`}
              onClick={() => fileInputRef.current.click()}
            >
              {file ? (
                <>
                  <span className="file-name">{file.name}</span>
                  <button
                    className="file-clear"
                    onClick={e => { e.stopPropagation(); setFile(null) }}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span className="file-placeholder">Click to select a file</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              style={{ display: 'none' }}
              onChange={e => setFile(e.target.files[0] || null)}
            />
          </>
        )}

        <button className="analyzer-btn" onClick={analyze} disabled={!canAnalyze}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>

        {error && <p className="analyzer-error">{error}</p>}

        {result && (
          <div className="analyzer-result">
            <ResultSection label="Document Type" content={result.document_type} />
            <ResultSection label="Parties" content={result.parties} />
            <ResultSection label="Key Clauses" content={result.key_clauses} />
            <ResultSection label="Risk Flags" content={result.risk_flags} accent />
          </div>
        )}
      </div>
    </ProjectPage>
  )
}

function ResultSection({ label, content, accent }) {
  if (!content) return null
  const items = Array.isArray(content) ? content : [content]
  return (
    <div className="result-section">
      <p className="section-label">{label}</p>
      <ul className={`result-list${accent ? ' result-list--accent' : ''}`}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
