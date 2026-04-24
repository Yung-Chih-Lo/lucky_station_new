import { describe, expect, it } from 'vitest'
import { formatRelativeZhTW } from './relativeTime'

const NOW = new Date('2026-04-24T12:00:00.000Z')

function isoMsAgo(ms: number): string {
  return new Date(NOW.getTime() - ms).toISOString()
}

describe('formatRelativeZhTW', () => {
  it('returns 剛剛 within the first minute', () => {
    expect(formatRelativeZhTW(isoMsAgo(0), NOW)).toBe('剛剛')
    expect(formatRelativeZhTW(isoMsAgo(59_000), NOW)).toBe('剛剛')
  })

  it('rolls to 分鐘前 at the 60s boundary', () => {
    expect(formatRelativeZhTW(isoMsAgo(60_000), NOW)).toBe('1 分鐘前')
    expect(formatRelativeZhTW(isoMsAgo(59 * 60 * 1000 + 999), NOW)).toBe('59 分鐘前')
  })

  it('rolls to 小時前 at the 60min boundary', () => {
    expect(formatRelativeZhTW(isoMsAgo(60 * 60 * 1000), NOW)).toBe('1 小時前')
    expect(formatRelativeZhTW(isoMsAgo(23 * 60 * 60 * 1000 + 500), NOW)).toBe('23 小時前')
  })

  it('rolls to 日前 at the 24h boundary', () => {
    expect(formatRelativeZhTW(isoMsAgo(24 * 60 * 60 * 1000), NOW)).toBe('1 日前')
    expect(formatRelativeZhTW(isoMsAgo(3 * 24 * 60 * 60 * 1000), NOW)).toBe('3 日前')
    expect(formatRelativeZhTW(isoMsAgo(6 * 24 * 60 * 60 * 1000 + 500), NOW)).toBe('6 日前')
  })

  it('rolls to 週前 at the 7-day boundary', () => {
    expect(formatRelativeZhTW(isoMsAgo(7 * 24 * 60 * 60 * 1000), NOW)).toBe('1 週前')
    expect(formatRelativeZhTW(isoMsAgo(29 * 24 * 60 * 60 * 1000 + 500), NOW)).toBe('4 週前')
  })

  it('rolls to 個月前 at the 30-day boundary', () => {
    expect(formatRelativeZhTW(isoMsAgo(30 * 24 * 60 * 60 * 1000), NOW)).toBe('1 個月前')
    expect(formatRelativeZhTW(isoMsAgo(180 * 24 * 60 * 60 * 1000), NOW)).toBe('6 個月前')
  })

  it('rolls to 年前 at the 365-day boundary', () => {
    expect(formatRelativeZhTW(isoMsAgo(365 * 24 * 60 * 60 * 1000), NOW)).toBe('1 年前')
    expect(formatRelativeZhTW(isoMsAgo(3 * 365 * 24 * 60 * 60 * 1000), NOW)).toBe('3 年前')
  })
})
