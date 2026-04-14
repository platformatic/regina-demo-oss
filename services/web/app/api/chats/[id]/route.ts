import { NextResponse } from 'next/server'
import { getChat } from '@/lib/chats'

export async function GET (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const chat = await getChat(id)
  if (!chat) {
    return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
  }
  return NextResponse.json(chat)
}
