import { randomUUID } from 'node:crypto'

export function generateToken(): string {
  return randomUUID()
}

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidToken(s: string): boolean {
  return typeof s === 'string' && UUID_V4_RE.test(s)
}
