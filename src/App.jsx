import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import LegalDoc from './projects/legalDoc'
import GitLab from './projects/gitlab'
import RAG from './projects/rag'
import './App.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav>
      <Link to="/" className="nav-brand">Joaquin Diaz</Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>Projects</Link>
        <a href="https://github.com/joaco844" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/joaquin-diaz-syrotink" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/legaldoc" element={<LegalDoc />} />
          <Route path="/projects/gitlab" element={<GitLab />} />
          <Route path="/projects/rag" element={<RAG />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}