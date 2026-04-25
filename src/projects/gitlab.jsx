import { useState } from 'react'
import ProjectPage from '../components/ProjectPage'
import { gitlabConfig, API_BASE } from './gitlabConfig'

const DEFAULT_FORM = {
  token: '',
  project_id: '',
  branch: 'main',
  date_from: '',
  date_to: '',
  issue_title: 'Release Summary',
}

export default function GitLab() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [commits, setCommits] = useState(null)
  const [summary, setSummary] = useState(null)
  const [issueResult, setIssueResult] = useState(null)
  const [loading, setLoading] = useState(null) // 'commits' | 'summary' | 'issue'
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  const isFormValid =
    form.token && form.project_id && form.date_from && form.date_to

  async function request(endpoint, extraBody = {}) {
    setLoading(endpoint)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/gitlab/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...extraBody }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error: ${res.status}`)
      }
      return await res.json()
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(null)
    }
  }

  async function fetchCommits() {
    const data = await request('commits')
    if (data) setCommits(data)
  }

  async function fetchSummary() {
    const data = await request('summary')
    if (data) setSummary(data.summary)
  }

  async function fetchIssue() {
    const data = await request('issue', { issue_title: form.issue_title })
    if (data) setIssueResult(data)
  }

  return (
    <ProjectPage config={gitlabConfig}>
      <div className="analyzer">
        <div className="gl-form">
          <div className="gl-field">
            <label className="gl-label">Personal Access Token</label>
            <input
              className="analyzer-input"
              type="password"
              placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
              value={form.token}
              onChange={e => update('token', e.target.value)}
            />
          </div>

          <div className="gl-row">
            <div className="gl-field">
              <label className="gl-label">Project ID</label>
              <input
                className="analyzer-input"
                type="text"
                placeholder="123456"
                value={form.project_id}
                onChange={e => update('project_id', e.target.value)}
              />
            </div>
            <div className="gl-field">
              <label className="gl-label">Branch</label>
              <input
                className="analyzer-input"
                type="text"
                placeholder="main"
                value={form.branch}
                onChange={e => update('branch', e.target.value)}
              />
            </div>
          </div>

          <div className="gl-row">
            <div className="gl-field">
              <label className="gl-label">Date from</label>
              <input
                className="analyzer-input"
                type="date"
                value={form.date_from}
                onChange={e => update('date_from', e.target.value)}
              />
            </div>
            <div className="gl-field">
              <label className="gl-label">Date to</label>
              <input
                className="analyzer-input"
                type="date"
                value={form.date_to}
                onChange={e => update('date_to', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="gl-actions">
          <button
            className="analyzer-btn"
            onClick={fetchCommits}
            disabled={!isFormValid || loading !== null}
          >
            {loading === 'commits' ? 'Loading…' : 'Get commits'}
          </button>
          <button
            className="analyzer-btn analyzer-btn--secondary"
            onClick={fetchSummary}
            disabled={!isFormValid || loading !== null}
          >
            {loading === 'summary' ? 'Generating…' : 'Generate summary'}
          </button>
          <button
            className="analyzer-btn analyzer-btn--secondary"
            onClick={fetchIssue}
            disabled={!isFormValid || loading !== null}
          >
            {loading === 'issue' ? 'Creating…' : 'Create issue'}
          </button>
        </div>

        {error && <p className="analyzer-error">{error}</p>}

        {commits && (
          <div className="analyzer-result">
            <div className="result-section">
              <p className="section-label">Commits — {commits.total} total</p>
              <ul className="result-list">
                {commits.commits.map(c => (
                  <li key={c.id} className="gl-commit">
                    <code className="gl-commit-id">{c.id}</code>
                    <span className="gl-commit-title">{c.title}</span>
                    <span className="gl-commit-meta">{c.author} · {c.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {summary && (
          <div className="analyzer-result">
            <div className="result-section">
              <p className="section-label">Release summary</p>
              <pre className="code-block">{summary}</pre>
            </div>
          </div>
        )}

        {issueResult && (
          <div className="analyzer-result">
            <div className="result-section">
              <p className="section-label">Issue created</p>
              <ul className="result-list">
                <li>
                  <a href={issueResult.issue_url} target="_blank" rel="noreferrer" className="gl-issue-link">
                    #{issueResult.issue_id} — {issueResult.issue_url}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ProjectPage>
  )
}
