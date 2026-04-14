const REGINA_URL = process.env.REGINA_URL || 'http://regina.plt.local'

export interface Agent {
  id: string
  name: string
  description: string
  model: string
  provider: string
  tools: string[]
}

export interface Instance {
  instanceId: string
  definitionId: string
  status: string
}

export interface ChatMessage {
  role: string
  content: string
}

export async function listAgents (): Promise<Agent[]> {
  const res = await fetch(`${REGINA_URL}/agents`)
  return res.json()
}

export async function createInstance (agentId: string): Promise<Instance> {
  const res = await fetch(`${REGINA_URL}/agents/${agentId}/instances`, {
    method: 'POST'
  })
  return res.json()
}

export async function getMessages (instanceId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${REGINA_URL}/instances/${instanceId}/messages`)
  return res.json()
}

export async function chatStream (instanceId: string, message: string): Promise<Response> {
  return fetch(`${REGINA_URL}/instances/${instanceId}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
}

export async function chat (instanceId: string, message: string): Promise<{ text: string }> {
  const res = await fetch(`${REGINA_URL}/instances/${instanceId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  return res.json()
}
