import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const replace = vi.fn()
const refresh = vi.fn()
let currentSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, refresh, push: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  useSearchParams: () => currentSearchParams,
}))

let AdminLoginPage: typeof import('./page').default

beforeEach(async () => {
  replace.mockReset()
  refresh.mockReset()
  currentSearchParams = new URLSearchParams()
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)
  ;({ default: AdminLoginPage } = await import('./page'))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.resetModules()
})

async function loginAndCaptureRedirect(fromValue: string | null): Promise<string | undefined> {
  if (fromValue !== null) currentSearchParams = new URLSearchParams({ from: fromValue })
  render(<AdminLoginPage />)
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('帳號'), 'admin')
  await user.type(screen.getByLabelText('密碼'), 'pw')
  const submitBtn = document.querySelector<HTMLButtonElement>('button[type="submit"]')
  if (!submitBtn) throw new Error('login submit button not found')
  await user.click(submitBtn)
  await vi.waitFor(() => expect(replace).toHaveBeenCalled(), { timeout: 3000 })
  return replace.mock.calls[0]?.[0] as string | undefined
}

describe('AdminLoginPage redirect after successful login', () => {
  it('navigates to a safe relative `from` path', async () => {
    expect(await loginAndCaptureRedirect('/admin/stations')).toBe('/admin/stations')
  })

  it('rejects an absolute external URL and falls back to /admin', async () => {
    expect(await loginAndCaptureRedirect('https://evil.example')).toBe('/admin')
  })

  it('rejects a protocol-relative URL and falls back to /admin', async () => {
    expect(await loginAndCaptureRedirect('//evil.example/admin')).toBe('/admin')
  })

  it('rejects a javascript: URL and falls back to /admin', async () => {
    expect(await loginAndCaptureRedirect('javascript:alert(1)')).toBe('/admin')
  })

  it('defaults to /admin when no `from` query param is present', async () => {
    expect(await loginAndCaptureRedirect(null)).toBe('/admin')
  })
})
