export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Joaquin Diaz</h1>
        <p className="tagline">Backend Developer · Python · Django · Building toward AI/ML</p>
      </section>

      <section className="about">
        <p className="section-label">About</p>
        <p>
          Backend Developer with 2+ years of experience building web applications
          with Python and Django, specialized in Legal Tech. I focus on clean code,
          performance optimization, and reliable systems.
        </p>
        <p>
          Currently transitioning into ML Engineering — interested in building systems
          that process information intelligently, from data pipelines to LLM-powered applications.
        </p>
      </section>

      <section>
        <p className="section-label">Stack</p>
        <div className="tags">
          {['Python', 'Django', 'FastAPI', 'SQL', 'MariaDB', 'JavaScript', 'React', 'Linux', 'Git'].map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </section>

      <section>
        <p className="section-label">Learning</p>
        <div className="tags">
          {['Machine Learning', 'LLMs', 'scikit-learn', 'AI APIs'].map(tag => (
            <span key={tag} className="tag learning">{tag}</span>
          ))}
        </div>
      </section>

      <section className="links">
        <a href="https://github.com/joaco844" target="_blank" rel="noreferrer">GitHub →</a>
        <a href="https://linkedin.com/in/joaquin-diaz-syrotink" target="_blank" rel="noreferrer">LinkedIn →</a>
      </section>
    </div>
  )
}