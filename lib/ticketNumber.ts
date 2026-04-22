// Deterministic 4-digit 籤號 derived from the pick token. Same token always
// produces the same number, so the shareable ticket and the modal agree.
export function ticketNoFromToken(token: string): string {
  let hash = 0
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) >>> 0
  }
  return String(hash % 10000).padStart(4, '0')
}

export function formatPickDate(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}
