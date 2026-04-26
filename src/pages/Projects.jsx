import { Link } from 'react-router-dom'

const projects = [
  {
    id: 'legaldoc',
    name: 'LegalDoc Analyzer',
    description: 'AI-powered legal document analysis using LLMs',
    tags: ['Python', 'FastAPI', 'Gemini'],
  },
  {
    id: 'gitlab',
    name: 'GitLab Release Summary',
    description: 'Generate release summaries from commits and create GitLab issues automatically',
    tags: ['Python', 'FastAPI', 'python-gitlab'],
  },
  {
    id: 'rag',
    name: 'Legal RAG',
    description: 'Upload legal documents and ask questions in natural language using RAG',
    tags: ['Python', 'FastAPI', 'OpenAI', 'Claude', 'Qdrant'],
  },
]

export default function Projects() {
  return (
    <div>
      <div className="projects-header">
        <h1>Projects</h1>
        <p>Interactive demos consuming real APIs</p>
      </div>

      <div className="projects-grid">
        {projects.map(p => (
          <Link key={p.id} to={`/projects/${p.id}`} className="project-card">
            <div className="project-info">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="project-tags">
                {p.tags.map(t => (
                  <span key={t} className="project-tag">{t}</span>
                ))}
              </div>
            </div>
            <span className="project-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
