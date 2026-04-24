import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ScanCtaCard from './ScanCtaCard'

vi.mock('qrcode', () => ({
  default: { toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,xxx') },
}))

beforeEach(() => {
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const BASE = {
  token: 'tok-abc',
  stationNameZh: '新北投',
  ticketNo: '0042',
  dateLabel: '2026.04.24',
}

describe('ScanCtaCard', () => {
  it('renders relay variant single-line headline + description', () => {
    render(<ScanCtaCard {...BASE} variant="relay" />)
    expect(screen.getByRole('heading').textContent).toBe('換你·寫下此站心得')
    expect(screen.getByText(/截圖保存，日後掃描即可留言，與前旅人同框。/)).toBeDefined()
  })

  it('renders first-arrival variant single-line headline + description', () => {
    render(<ScanCtaCard {...BASE} variant="first" />)
    expect(screen.getByRole('heading').textContent).toBe('成為此站·第一位留言者')
    expect(screen.getByText(/截圖保存此籤，日後掃描留言，你的字會是第一個被後來者看見的。/)).toBeDefined()
  })

  it('caption formats as No.<ticketNo> · <dateLabel>', () => {
    render(<ScanCtaCard {...BASE} variant="relay" />)
    expect(screen.getByText('No.0042 · 2026.04.24')).toBeDefined()
  })

  it('embeds ShareableTicket button inside the card', async () => {
    render(<ScanCtaCard {...BASE} variant="first" />)
    expect(await screen.findByRole('button', { name: /分享給你的好友/ })).toBeDefined()
  })

  it('QR is rendered as a static element, not wrapped in a link', () => {
    const { container } = render(<ScanCtaCard {...BASE} variant="relay" />)
    const anchors = container.querySelectorAll('a')
    expect(anchors.length).toBe(0)
  })
})
