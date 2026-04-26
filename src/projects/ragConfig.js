export const API_BASE = 'https://portfolio-api-production-2761.up.railway.app'

export const ragConfig = {
  title: 'Legal RAG',
  tagline: 'Upload legal documents and ask questions in natural language.',
  summary:
    'RAG (Retrieval-Augmented Generation) system built without frameworks. Documents are chunked with tiktoken, embedded with OpenAI text-embedding-3-small, and stored in Qdrant. At query time, the question is embedded, the top-5 most semantically similar chunks are retrieved, and Claude answers based solely on that context — returning the answer and the exact source citations.',
  github: 'https://github.com/joaco844/Portfolio-api',
  stack: ['Python', 'FastAPI', 'Gemini', 'Qdrant', 'pypdf'],
  endpoints: [
    {
      method: 'POST',
      path: '/rag/upload',
      description: 'Extracts text from a PDF or TXT, chunks it, embeds each chunk with Gemini, and stores vectors in Qdrant.',
      body: 'multipart/form-data — file, gemini_api_key, qdrant_url, qdrant_api_key',
      response: '{ "document_id": "uuid", "filename": "string", "chunks_indexed": 42 }',
      notes: 'Scanned/image-based PDFs are not supported. The PDF must contain selectable text.',
    },
    {
      method: 'POST',
      path: '/rag/query',
      description: 'Embeds the question with Gemini, retrieves the top-5 relevant chunks from Qdrant, and generates an answer with Gemini.',
      body: '{ "question": "string", "gemini_api_key": "string", "qdrant_url": "string", "qdrant_api_key": "string" }',
      response: '{ "answer": "string", "citations": [{ "filename": "string", "page": 1, "chunk": "string" }] }',
      notes: 'The model answers only from the retrieved context. If there is not enough information, it says so.',
    },
  ],
}
