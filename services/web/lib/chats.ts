import { Redis } from 'iovalkey'

const CHATS_KEY = 'regina:web:chats'

export interface ChatInfo {
  id: string
  instanceId: string
  agentId: string
  agentName: string
  title: string
  greeting?: string
  lastMessage: string
  createdAt: string
}

let redis: Redis | null = null

function getRedis (): Redis {
  if (!redis) {
    redis = new Redis(process.env.REGINA_VALKEY_CONNECTION_STRING || 'redis://localhost:6379')
  }
  return redis
}

export async function listChats (): Promise<ChatInfo[]> {
  const data = await getRedis().hgetall(CHATS_KEY)
  const chats = Object.values(data).map(v => JSON.parse(v) as ChatInfo)
  chats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return chats
}

export async function getChat (id: string): Promise<ChatInfo | null> {
  const data = await getRedis().hget(CHATS_KEY, id)
  return data ? JSON.parse(data) : null
}

export async function saveChat (chat: ChatInfo): Promise<void> {
  await getRedis().hset(CHATS_KEY, chat.id, JSON.stringify(chat))
}

export async function deleteChat (id: string): Promise<void> {
  await getRedis().hdel(CHATS_KEY, id)
}
