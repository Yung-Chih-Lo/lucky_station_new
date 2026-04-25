'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import { useThemeMode } from '@/components/ThemeProvider'
import type { ThemeMode } from '@/lib/theme'

const MODE_LABEL: Record<ThemeMode, string> = {
  mrt: '捷運',
  tra: '台鐵',
}

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: '/explore', label: '旅人心得' },
  { href: '/stats', label: '排行榜' },
]

export default function TopBar() {
  const { mode, setMode } = useThemeMode()
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const selectMode = (next: ThemeMode) => {
    setMode(next)
    closeMenu()
    if (!isHome) {
      router.push('/')
    }
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="topbar">
      <div className="topbar-bar">
        <Link href="/" style={wordmarkLinkStyle} aria-label="回到首頁" onClick={closeMenu}>
          <span style={wordmarkPrimaryStyle}>坐火行</span>
        </Link>

        <nav className="topbar-tabs" aria-label="選擇運輸類型">
          {(Object.keys(MODE_LABEL) as ThemeMode[]).map((m) => {
            const active = mode === m
            return (
              <button
                key={m}
                type="button"
                onClick={() => selectMode(m)}
                style={{
                  ...tabButtonStyle,
                  color: active ? 'var(--accent)' : 'var(--ink-muted)',
                  borderBottomColor: active ? 'var(--accent)' : 'transparent',
                  fontWeight: active ? 700 : 500,
                }}
                aria-current={active ? 'page' : undefined}
              >
                {MODE_LABEL[m]}
              </button>
            )
          })}
        </nav>

        <div className="topbar-nav-right">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  ...navLinkStyle,
                  color: active ? 'var(--ink)' : 'var(--ink-muted)',
                  borderBottomColor: active ? 'var(--accent)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          className="topbar-hamburger"
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={menuOpen}
          aria-controls="topbar-mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </div>

      {menuOpen && (
        <div id="topbar-mobile-menu" className="topbar-mobile-menu">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="topbar-mobile-menu-item"
                style={{ color: active ? 'var(--ink)' : 'var(--ink-muted)' }}
              >
                {item.label}
                <span aria-hidden="true" className="topbar-mobile-menu-arrow">
                  →
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}

const wordmarkLinkStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  lineHeight: 1.05,
  textDecoration: 'none',
  color: 'var(--ink)',
}

const wordmarkPrimaryStyle: React.CSSProperties = {
  fontFamily: 'var(--font-serif), "Noto Serif TC", ui-serif, serif',
  fontWeight: 900,
  fontSize: 20,
  letterSpacing: '0.08em',
  color: 'var(--ink)',
}

const tabButtonStyle: React.CSSProperties = {
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  borderBottom: '2px solid transparent',
  padding: '18px 14px 16px',
  fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  fontSize: 15,
  letterSpacing: '0.12em',
  cursor: 'pointer',
  transition: 'color 200ms ease, border-color 200ms ease',
}

const navLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textDecoration: 'none',
  paddingBottom: 2,
  borderBottom: '2px solid transparent',
  transition: 'color 200ms ease, border-color 200ms ease',
}
