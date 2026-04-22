'use client'

import { Button, Checkbox, Divider } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import Link from 'next/link'

type Props = {
  counties: string[]
  selectedCounties: string[]
  onChange: (counties: string[]) => void
  onPick: () => void
  isPicking: boolean
}

export default function TraSidebar({
  counties,
  selectedCounties,
  onChange,
  onPick,
  isPicking,
}: Props) {
  const allSelected = selectedCounties.length === counties.length
  const noneSelected = selectedCounties.length === 0
  const pickDisabled = noneSelected || isPicking

  return (
    <div className="brand-glass" style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={brandTitleStyle}>台鐵籤</h1>
        <p style={sloganStyle}>選縣市，讓台鐵替你決定下一站</p>
      </div>

      <p style={sectionLabelStyle}>選擇縣市</p>

      <div style={selectRowStyle}>
        <Button
          type="link"
          size="small"
          onClick={() => onChange(counties)}
          disabled={allSelected}
        >
          全選
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => onChange([])}
          disabled={noneSelected}
        >
          清除
        </Button>
      </div>

      <div style={listScrollStyle}>
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          value={selectedCounties}
          onChange={(vals) => onChange(vals as string[])}
        >
          {counties.map((county) => (
            <Checkbox key={county} value={county}>
              {county}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <Divider style={{ margin: '0 0 16px 0' }} />

      {noneSelected && (
        <p style={hintStyle}>未勾選任何縣市時無法抽籤</p>
      )}

      <Button
        type="primary"
        block
        size="large"
        onClick={onPick}
        disabled={pickDisabled}
        loading={isPicking}
        icon={<SwapOutlined />}
      >
        {isPicking ? '抽籤中…' : '抽幸運車站'}
      </Button>

      <div style={navLinksStyle}>
        <Link href="/explore" style={navLinkStyle}>
          旅人心得
        </Link>
        <span aria-hidden="true" style={navDividerStyle}>·</span>
        <Link href="/stats" style={navLinkStyle}>
          排行榜
        </Link>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  padding: 20,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

const brandTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-serif), "Noto Serif TC", Georgia, serif',
  fontWeight: 700,
  fontSize: 32,
  letterSpacing: '0.08em',
  color: 'var(--brand-text)',
}

const sloganStyle: React.CSSProperties = {
  marginTop: 6,
  marginBottom: 0,
  color: 'var(--brand-text-muted)',
  fontSize: 13,
  letterSpacing: '0.04em',
}

const sectionLabelStyle: React.CSSProperties = {
  textAlign: 'center',
  fontWeight: 500,
  marginBottom: 8,
  color: 'var(--brand-text-muted)',
  fontSize: 12,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
}

const selectRowStyle: React.CSSProperties = {
  marginBottom: 12,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 4px',
}

const listScrollStyle: React.CSSProperties = {
  flexGrow: 1,
  overflowY: 'auto',
  paddingRight: 8,
  marginBottom: 16,
  maxHeight: 360,
}

const hintStyle: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 12,
  color: 'var(--brand-text-muted)',
  textAlign: 'center',
}

const navLinksStyle: React.CSSProperties = {
  marginTop: 16,
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
  fontSize: 13,
}

const navLinkStyle: React.CSSProperties = {
  color: 'var(--brand-text-muted)',
  textDecoration: 'none',
}

const navDividerStyle: React.CSSProperties = {
  color: 'var(--brand-text-muted)',
  opacity: 0.5,
}
