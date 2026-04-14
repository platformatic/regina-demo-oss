'use client'

import { useEffect, useState, useRef, use } from 'react'
// eslint-disable-next-line @next/next/no-img-element
import { apiUrl } from '@/lib/basepath'

interface Message {
  role: string
  content: string
}

export default function ChatPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id: instanceId } = use(params)
  const [messages, setMessages] = useState<Message[]>([])
  const [greeting, setGreeting] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(apiUrl(`/api/chats/${instanceId}/messages`))
      .then(r => r.json())
      .then(setMessages)
    fetch(apiUrl(`/api/chats/${instanceId}`))
      .then(r => r.json())
      .then(chat => {
        if (chat?.greeting) setGreeting(chat.greeting)
      })
  }, [instanceId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage (e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || streaming) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setStreaming(true)

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instanceId, message: userMessage })
      })

      if (!res.ok || !res.body) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${res.status}` }])
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        assistantText += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantText }
          return updated
        })
      }

      if (!assistantText) {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: 'No response received.' }
          return updated
        })
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: could not reach the agent.' }])
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{
        padding: '12px 20px',
        borderBottom: '1px solid rgba(0, 254, 132, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <a href={apiUrl('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--plt-text-secondary)', fontSize: 14 }}>
          ← Back
        </a>
        <span style={{ color: 'rgba(0, 254, 132, 0.3)' }}>|</span>
        <img src={apiUrl('/logo.svg')} alt='Platformatic' width={24} height={24} />
        <span style={{ fontSize: 15, fontWeight: 600 }}>Regina</span>
        <span style={{ color: 'rgba(0, 254, 132, 0.3)' }}>|</span>
        <span style={{ fontSize: 13, color: 'var(--plt-text-secondary)', fontFamily: 'monospace' }}>{instanceId}</span>
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {messages.length === 0 && !streaming && greeting && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--plt-text-secondary)'
            }}>
              <div style={{ fontSize: 15, lineHeight: 1.6 }}>
                {greeting}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: 20,
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, var(--plt-green), #00d970)'
                  : 'var(--plt-dark)',
                color: msg.role === 'user' ? 'var(--plt-darker)' : 'var(--plt-white)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(0, 254, 132, 0.1)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                fontSize: 14,
                fontWeight: msg.role === 'user' ? 500 : 400
              }}>
                {msg.content}
                {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span style={{
                    display: 'inline-block',
                    width: 6,
                    height: 14,
                    background: 'var(--plt-green)',
                    marginLeft: 2,
                    animation: 'blink 1s infinite',
                    verticalAlign: 'text-bottom'
                  }} />
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(0, 254, 132, 0.15)', padding: '20px 20px 32px' }}>
        <form
          onSubmit={sendMessage}
          style={{
            maxWidth: 720,
            margin: '0 auto',
            display: 'flex',
            gap: 10
          }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Type a message...'
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid rgba(0, 254, 132, 0.2)',
              borderRadius: 12,
              fontSize: 14,
              background: 'var(--plt-dark)',
              color: 'var(--plt-white)',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--plt-green)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0, 254, 132, 0.2)' }}
          />
          <button
            type='submit'
            disabled={streaming || !input.trim()}
            style={{
              padding: '12px 24px',
              background: streaming || !input.trim() ? 'var(--plt-navy)' : 'var(--plt-green)',
              color: streaming || !input.trim() ? 'var(--plt-text-secondary)' : 'var(--plt-darker)',
              border: 'none',
              borderRadius: 12,
              cursor: streaming || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            {streaming ? '...' : 'Send'}
          </button>
        </form>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
