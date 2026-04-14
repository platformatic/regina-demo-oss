import { NextResponse } from 'next/server'
import { listChats, saveChat, type ChatInfo } from '@/lib/chats'
import { createInstance } from '@/lib/ragina'

export async function GET () {
  const chats = await listChats()
  return NextResponse.json(chats)
}

export async function POST (request: Request) {
  const { agentId, agentName, greeting } = await request.json()
  const instance = await createInstance(agentId)

  const chat: ChatInfo = {
    id: instance.instanceId,
    instanceId: instance.instanceId,
    agentId,
    agentName,
    title: `${agentName} chat`,
    greeting,
    lastMessage: '',
    createdAt: new Date().toISOString()
  }

  await saveChat(chat)
  return NextResponse.json(chat)
}
