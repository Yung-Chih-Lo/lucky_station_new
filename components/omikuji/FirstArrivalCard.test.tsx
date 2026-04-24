import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import FirstArrivalCard from './FirstArrivalCard'

describe('FirstArrivalCard', () => {
  it('renders the 首旅人 eyebrow, italic body, and 彩蛋 subtext', () => {
    render(<FirstArrivalCard />)
    expect(screen.getByText(/首\s*旅\s*人/)).toBeDefined()
    expect(screen.getByText(/此站尚無人留言/)).toBeDefined()
    expect(screen.getByText(/你是第一位抵達的旅人/)).toBeDefined()
    expect(screen.getByText('FIRST TO ARRIVE · 彩蛋 ✦')).toBeDefined()
  })

  it('applies a dashed border to the card', () => {
    const { container } = render(<FirstArrivalCard />)
    const card = container.firstElementChild as HTMLElement
    expect(card.style.border).toMatch(/dashed/)
  })
})
