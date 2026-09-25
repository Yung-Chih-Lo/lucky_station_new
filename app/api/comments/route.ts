import { NextResponse } from 'next/server'
import { getComments } from '@/lib/comments'

export async function GET(req: Request) {
  return NextResponse.json(getComments(new URL(req.url).searchParams))
}
