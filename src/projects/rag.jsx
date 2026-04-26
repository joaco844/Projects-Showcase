import { useState, useRef } from 'react'
import ProjectPage from '../components/ProjectPage'
import { ragConfig, API_BASE } from './ragConfig'

const ACCEPTED = '.pdf,.txt'

export default function RAG() {
  const [tab, setTab] = useState('upload')

  const [geminiKey, setGeminiKey] = useState('')
  const [qdrantUrl, setQdrantUrl] = useState('')
  const [qdrantApiKey, setQdrantApiKey] = useState('')

  const [files, setFiles] = useState([])
  const [documents, setDocuments] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  function addFiles(incoming) {
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name))
      const fresh = incoming.filter(f => !existing.has(f.name))
      return [...prev, ...fresh].slice(0, 5)
    })
  }

  function removeFile(name) {
    setFiles(prev => prev.filter(f => f.name !== name))
  }

  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [queryLoading, setQueryLoading] = useState(false)
  const [queryError, setQueryError] = useState(null)

  const hasConfig = geminiKey.trim() && qdrantUrl.trim() && qdrantApiKey.trim()

  function switchTab(next) {
    setTab(next)
    setUploadError(null)
    setQueryError(null)
  }

  async function upload() {
    setUploadLoading(true)
    setUploadError(null)
    try {
      const form = new FormData()
      files.forEach(f => form.append('files', f))
      form.append('gemini_api_key', geminiKey)
      form.append('qdrant_url', qdrantUrl)
      form.append('qdrant_api_key', qdrantApiKey)
      const res = await fetch(`${API_BASE}/rag/upload`, { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error: ${res.status}`)
      }
      const data = await res.json()
      setDocuments(prev => [...prev, ...data])
      setFiles([])
    } catch (e) {
      setUploadError(e.message)
    } finally {
      setUploadLoading(false)
    }
  }

  async function query() {
    setQueryLoading(true)
    setQueryError(null)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          gemini_api_key: geminiKey,
          qdrant_url: qdrantUrl,
          qdrant_api_key: qdrantApiKey,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error: ${res.status}`)
      }
      setResult(await res.json())
    } catch (e) {
      setQueryError(e.message)
    } finally {
      setQueryLoading(false)
    }
  }

  const canUpload = !uploadLoading && hasConfig && files.length > 0
  const canQuery = !queryLoading && hasConfig && question.trim()

  return (
    <ProjectPage config={ragConfig}>
      <div className="analyzer">

        <div className="analyzer-config">
          <div className="analyzer-config-field">
            <p className="section-label">Gemini API Key</p>
            <input
              className="analyzer-key-input"
              type="password"
              placeholder="AIza..."
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
            />
          </div>
          <div className="analyzer-config-field">
            <p className="section-label">Qdrant URL</p>
            <input
              className="analyzer-key-input"
              type="text"
              placeholder="https://xyz.qdrant.io"
              value={qdrantUrl}
              onChange={e => setQdrantUrl(e.target.value)}
            />
          </div>
          <div className="analyzer-config-field">
            <p className="section-label">Qdrant API Key</p>
            <input
              className="analyzer-key-input"
              type="password"
              placeholder="..."
              value={qdrantApiKey}
              onChange={e => setQdrantApiKey(e.target.value)}
            />
          </div>
        </div>

        <div className="analyzer-toggle">
          <button
            className={`toggle-btn${tab === 'upload' ? ' toggle-btn--active' : ''}`}
            onClick={() => switchTab('upload')}
          >
            Upload
          </button>
          <button
            className={`toggle-btn${tab === 'query' ? ' toggle-btn--active' : ''}`}
            onClick={() => switchTab('query')}
          >
            Query
          </button>
        </div>

        {tab === 'upload' ? (
          <>
            <p className="section-label">
              Documents <span className="analyzer-hint">PDF or TXT — max 5</span>
            </p>
            <div
              className="file-drop"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="file-placeholder">
                {files.length === 0
                  ? 'Click to select files'
                  : `${files.length} file${files.length > 1 ? 's' : ''} selected — click to add more`}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              style={{ display: 'none' }}
              onChange={e => { addFiles(Array.from(e.target.files)); e.target.value = '' }}
            />

            {files.length > 0 && (
              <ul className="rag-file-list">
                {files.map(f => (
                  <li key={f.name} className="rag-file-item">
                    <span className="file-name">{f.name}</span>
                    <button className="file-clear" onClick={() => removeFile(f.name)}>✕</button>
                  </li>
                ))}
              </ul>
            )}

            <button className="analyzer-btn" onClick={upload} disabled={!canUpload}>
              {uploadLoading ? 'Indexing…' : 'Index document'}
            </button>

            {uploadError && <p className="analyzer-error">{uploadError}</p>}

            {documents.length > 0 && (
              <div className="analyzer-result">
                <div className="result-section">
                  <p className="section-label">Indexed documents</p>
                  <ul className="result-list">
                    {documents.map(doc => (
                      <li key={doc.document_id}>
                        {doc.filename}
                        <span className="analyzer-hint"> — {doc.chunks_indexed} chunks</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="section-label">Question</p>
            <textarea
              className="analyzer-input"
              placeholder="Ask anything about the indexed documents…"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={4}
            />

            <button className="analyzer-btn" onClick={query} disabled={!canQuery}>
              {queryLoading ? 'Searching…' : 'Ask'}
            </button>

            {queryError && <p className="analyzer-error">{queryError}</p>}

            {result && (
              <div className="analyzer-result">
                <div className="result-section">
                  <p className="section-label">Answer</p>
                  <p className="rag-answer">{result.answer}</p>
                </div>

                {result.citations?.length > 0 && (
                  <div className="result-section">
                    <p className="section-label">Sources</p>
                    <div className="rag-citations">
                      {result.citations.map((c, i) => (
                        <div key={i} className="rag-citation">
                          <p className="rag-citation-meta">
                            {c.filename} — page {c.page}
                          </p>
                          <p className="rag-citation-chunk">{c.chunk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </ProjectPage>
  )
}
