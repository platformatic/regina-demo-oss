import { tool } from 'ai'
import { z } from 'zod'

export default tool({
  description: 'Get information about a GitHub repository',
  parameters: z.object({
    owner: z.string().describe('Repository owner, e.g. "nodejs"'),
    repo: z.string().describe('Repository name, e.g. "node"')
  }),
  execute: async ({ owner, repo }) => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 'User-Agent': 'regina-demo' }
    })

    if (!res.ok) {
      return { error: `Repository not found: ${owner}/${repo}` }
    }

    const data = await res.json()
    return {
      name: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      open_issues: data.open_issues_count,
      created_at: data.created_at
    }
  }
})
