export const API_BASE = 'http://localhost:8000'

export const gitlabConfig = {
  title: 'GitLab Release Summary',
  tagline: 'Generate release summaries from your GitLab project commits and create issues automatically.',
  summary:
    'Tool built with FastAPI and python-gitlab that connects to any GitLab project using a personal access token. Given a branch and a date range, it fetches the commits, builds a formatted markdown release summary, and optionally creates a GitLab issue with that summary — automating the release documentation workflow.',
  github: null,
  stack: ['Python', 'FastAPI', 'python-gitlab'],
  endpoints: [
    {
      method: 'POST',
      path: '/gitlab/commits',
      description: 'Fetch commits from a branch within a date range.',
      body: '{\n  "token": "glpat-xxxx",\n  "project_id": "123456",\n  "branch": "main",\n  "date_from": "2024-01-01",\n  "date_to": "2024-12-31"\n}',
      response: '{\n  "commits": [\n    { "id": "a1b2c3d", "title": "fix: login bug", "author": "Joaquin", "date": "2024-03-10" }\n  ],\n  "total": 1\n}',
      notes: 'The token needs at least Reporter role on the project. Project ID is visible in GitLab under Settings → General.',
    },
    {
      method: 'POST',
      path: '/gitlab/summary',
      description: 'Generate a markdown release summary from commits.',
      body: '{\n  "token": "glpat-xxxx",\n  "project_id": "123456",\n  "branch": "main",\n  "date_from": "2024-01-01",\n  "date_to": "2024-12-31"\n}',
      response: '{ "summary": "## Release Summary — `main`\\n..." }',
      notes: 'Returns a markdown string with a commit table ready to paste or publish.',
    },
    {
      method: 'POST',
      path: '/gitlab/issue',
      description: 'Create a GitLab issue with the release summary.',
      body: '{\n  "token": "glpat-xxxx",\n  "project_id": "123456",\n  "branch": "main",\n  "date_from": "2024-01-01",\n  "date_to": "2024-12-31",\n  "issue_title": "Release Summary Q1 2024"\n}',
      response: '{ "issue_url": "https://gitlab.com/user/project/-/issues/42", "issue_id": 42 }',
      notes: 'The token needs at least Developer role to create issues. The issue is created with the label "release-summary".',
    },
  ],
}
