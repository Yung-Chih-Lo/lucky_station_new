import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import RelayExcerptCard from './RelayExcerptCard'

afterEach(() => cleanup())

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const BASE = {
  stationId: 42,
  excerpt: '溫泉博物館的木樓梯會吱吱響。',
  handle: '0417',
  postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
}

describe('RelayExcerptCard', () => {
  it('renders excerpt, handle with # prefix, and relative time', () => {
    render(<RelayExcerptCard {...BASE} count={3} />)
    expect(screen.getByText(/溫泉博物館的木樓梯會吱吱響/)).toBeDefined()
    expect(screen.getByText(/#0417/)).toBeDefined()
    expect(screen.getByText(/3 日前/)).toBeDefined()
  })

  it('renders 更多 N 則 link with count-1 math pointing at /explore?station_id=<id>', () => {
    render(<RelayExcerptCard {...BASE} count={3} />)
    const link = screen.getByRole('link', { name: /更多 2 則/ }) as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('/explore?station_id=42')
  })

  it('hides the more-count link when count is 1', () => {
    render(<RelayExcerptCard {...BASE} count={1} />)
    expect(screen.queryByText(/更多/)).toBeNull()
  })

  it('shows the link when count is 2 (otherCount = 1)', () => {
    render(<RelayExcerptCard {...BASE} count={2} />)
    expect(screen.getByText(/更多 1 則/)).toBeDefined()
  })
})
