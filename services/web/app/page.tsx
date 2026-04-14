'use client'

import { useEffect, useState } from 'react'
// eslint-disable-next-line @next/next/no-img-element
import { apiUrl } from '@/lib/basepath'

interface Agent {
  id: string
  name: string
  description: string
  greeting?: string
}

interface ChatInfo {
  id: string
  instanceId: string
  agentId: string
  agentName: string
  title: string
  lastMessage: string
  createdAt: string
}

export default function Home () {
  const [agents, setAgents] = useState<Agent[]>([])
  const [chats, setChats] = useState<ChatInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(apiUrl('/api/agents')).then(r => r.json()).then(setAgents)
    fetch(apiUrl('/api/chats')).then(r => r.json()).then(setChats)
  }, [])

  async function startChat (agent: Agent) {
    setLoading(true)
    const res = await fetch(apiUrl('/api/chats'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: agent.id, agentName: agent.name, greeting: agent.greeting })
    })
    const chat = await res.json()
    window.location.href = apiUrl(`/chat/${chat.id}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(0, 254, 132, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <img src={apiUrl('/logo.svg')} alt='Platformatic' width={32} height={32} />
        <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Regina</span>
        <span style={{ fontSize: 14, color: 'var(--plt-text-secondary)' }}>AI Agent Chat</span>
      </header>

      <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 8,
          letterSpacing: '-0.02em'
        }}>
          Start a conversation
        </h1>
        <p style={{ color: 'var(--plt-text-secondary)', marginBottom: 32, fontSize: 15 }}>
          Choose an agent to begin chatting
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 48 }}>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => startChat(agent)}
              disabled={loading}
              style={{
                padding: '20px',
                border: '1px solid rgba(0, 254, 132, 0.2)',
                borderRadius: 12,
                background: 'var(--plt-dark)',
                cursor: loading ? 'wait' : 'pointer',
                textAlign: 'left',
                color: 'var(--plt-white)',
                transition: 'all 0.15s ease',
                opacity: loading ? 0.6 : 1
              }}
              onMouseOver={e => { if (!loading) (e.currentTarget.style.borderColor = 'var(--plt-green)') }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(0, 254, 132, 0.2)' }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(0, 254, 132, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                fontSize: 16,
                color: 'var(--plt-green)',
                fontWeight: 700
              }}>
                {agent.name[0]?.toUpperCase() ?? '?'}
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{agent.name}</div>
              <div style={{ fontSize: 13, color: 'var(--plt-text-secondary)', lineHeight: 1.4 }}>{agent.description}</div>
            </button>
          ))}
        </div>

        {chats.length > 0 && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--plt-text-secondary)' }}>
              Recent conversations
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => { window.location.href = apiUrl(`/chat/${chat.id}`) }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: 'var(--plt-dark)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'background 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--plt-navy)' }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--plt-dark)' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{chat.agentName}</div>
                    {chat.lastMessage && (
                      <div style={{
                        fontSize: 13,
                        color: 'var(--plt-text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: 2
                      }}>
                        {chat.lastMessage}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--plt-text-secondary)', whiteSpace: 'nowrap' }}>
                    {new Date(chat.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
