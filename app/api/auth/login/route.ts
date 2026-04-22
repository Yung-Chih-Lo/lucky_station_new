import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAdminCredentials } from '@/lib/auth'
import { getSession } from '@/lib/session'

const BodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  // TEMP DEBUG
  console.log('[login debug] received username:', JSON.stringify(parsed.data.username))
  console.log('[login debug] received password length:', parsed.data.password.length)
  console.log('[login debug] env ADMIN_USERNAME:', JSON.stringify(process.env.ADMIN_USERNAME))
  console.log('[login debug] env ADMIN_PASSWORD_HASH length:', process.env.ADMIN_PASSWORD_HASH?.length)
  console.log('[login debug] env ADMIN_PASSWORD_HASH starts:', process.env.ADMIN_PASSWORD_HASH?.slice(0, 20))

  const ok = await verifyAdminCredentials(parsed.data.username, parsed.data.password)
  console.log('[login debug] verifyAdminCredentials result:', ok)
  if (!ok) {
    return NextResponse.json({ error: '帳號或密碼錯誤' }, { status: 401 })
  }

  const session = await getSession()
  session.isAdmin = true
  await session.save()

  return NextResponse.json({ ok: true })
}
