import { NextResponse } from 'next/server'
import { getMessages } from '@/lib/ragina'

export async function GET (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const messages = await getMessages(id)
  return NextResponse.json(messages)
}
