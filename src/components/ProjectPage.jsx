import { useState } from 'react'
import { Link } from 'react-router-dom'

const METHOD_CLASS = {
  GET: 'badge--get',
  POST: 'badge--post',
  PUT: 'badge--put',
  DELETE: 'badge--delete',
}

function EndpointCard({ endpoint }) {
  const [open, setOpen] = useState(false)
  const { method, path, description, body, response, notes } = endpoint

  return (
    <div className={`endpoint-card${open ? ' endpoint-card--open' : ''}`}>
      <button className="endpoint-summary" onClick={() => setOpen(o => !o)}>
        <div className="endpoint-left">
          <span className={`method-badge ${METHOD_CLASS[method] ?? ''}`}>{method}</span>
          <code className="endpoint-path">{path}</code>
          <span className="endpoint-desc">{description}</span>
        </div>
        <span className="endpoint-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="endpoint-detail">
          {body && (
            <div className="endpoint-field">
              <p className="section-label">Request body</p>
              <pre className="code-block">{body}</pre>
            </div>
          )}
          {response && (
            <div className="endpoint-field">
              <p className="section-label">Response</p>
              <pre className="code-block">{response}</pre>
            </div>
          )}
          {notes && (
            <div className="endpoint-field">
              <p className="section-label">Notes</p>
              <p className="endpoint-notes">{notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProjectPage({ config, children }) {
  const { title, tagline, summary, github, stack, endpoints } = config

  return (
    <div className="project-page">
      <Link to="/projects" className="back-link">← Projects</Link>

      <div className="project-page-header">
        <h1>{title}</h1>
        <p>{tagline}</p>
        <div className="project-tags" style={{ marginTop: '14px' }}>
          {stack.map(t => (
            <span key={t} className="project-tag">{t}</span>
          ))}
        </div>
        {github && (
          <div className="project-page-links">
            <a href={github} target="_blank" rel="noreferrer">GitHub →</a>
          </div>
        )}
      </div>

      <div className="project-section">
        <p className="section-label">About</p>
        <p className="project-summary">{summary}</p>
      </div>

      <div className="project-section">
        <p className="section-label">API Reference</p>
        <div className="endpoints-list">
          {endpoints.map(ep => (
            <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} />
          ))}
        </div>
      </div>

      <div className="project-section">
        <p className="section-label">Try it</p>
        {children}
      </div>
    </div>
  )
}
