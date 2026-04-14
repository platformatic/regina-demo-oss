import { chatStream } from '@/lib/ragina'
import { getChat, saveChat } from '@/lib/chats'

export async function POST (request: Request) {
  const { instanceId, message } = await request.json()

  // Update last message in chat metadata
  const chat = await getChat(instanceId)
  if (chat) {
    chat.lastMessage = message
    await saveChat(chat)
  }

  const upstream = await chatStream(instanceId, message)

  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: 'Failed to reach agent' }), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const encoder = new TextEncoder()
  const reader = upstream.body!.getReader()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start (controller) {
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const event = JSON.parse(line)
              if (event.type === 'text-delta') {
                controller.enqueue(encoder.encode(event.textDelta))
              }
            } catch {}
          }
        }
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  })
}
