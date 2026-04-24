const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

export function formatRelativeZhTW(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime()
  const diff = now.getTime() - then

  if (diff < MINUTE) return '剛剛'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} 分鐘前`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} 小時前`
  if (diff < WEEK) return `${Math.floor(diff / DAY)} 日前`
  if (diff < MONTH) return `${Math.floor(diff / WEEK)} 週前`
  if (diff < YEAR) return `${Math.floor(diff / MONTH)} 個月前`
  return `${Math.floor(diff / YEAR)} 年前`
}
