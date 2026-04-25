export const API_BASE = 'http://localhost:8000'

export const legalDocConfig = {
  title: 'LegalDoc Analyzer',
  tagline: 'Upload a file or paste text — the AI extracts parties, clauses, and risk flags.',
  summary:
    'REST API built with FastAPI that receives legal documents as plain text or PDF files and uses Google\'s Gemini model to extract structured information. Given any contract, agreement, or legal document, it identifies the document type, the parties involved, the key clauses, and potential risk flags — returning everything as clean JSON.',
  github: 'https://github.com/joaco844/LegalDoc-Analyzer',
  stack: ['Python', 'FastAPI', 'Gemini', 'pypdf'],
  endpoints: [
    {
      method: 'GET',
      path: '/health',
      description: 'Health check — confirms the API is running.',
      body: null,
      response: '{ "status": "ok" }',
      notes: null,
    },
    {
      method: 'POST',
      path: '/legaldoc/analyze',
      description: 'Analyzes a legal document from plain text.',
      body: '{ "text": "string" }',
      response: '{ "document_type": "string", "parties": ["..."], "key_clauses": ["..."], "risk_flags": ["..."] }',
      notes: 'Send the raw text of any legal document. The model handles multiple languages.',
    },
    {
      method: 'POST',
      path: '/legaldoc/analyze/file',
      description: 'Analyzes a legal document uploaded as a PDF or TXT file.',
      body: 'multipart/form-data — field name: file (.pdf or .txt)',
      response: '{ "document_type": "string", "parties": ["..."], "key_clauses": ["..."], "risk_flags": ["..."] }',
      notes: 'Scanned or image-based PDFs are not supported — the PDF must contain selectable text.',
    },
  ],
}
