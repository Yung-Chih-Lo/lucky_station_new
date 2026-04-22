'use client'

import { Button, Checkbox, Divider } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import type { LineView } from './types'

type Props = {
  lines: LineView[]
  selectedLineCodes: string[]
  onLineChange: (codes: string[]) => void
  onRandomPick: () => void
  isAnimating: boolean
}

export default function Sidebar({
  lines,
  selectedLineCodes,
  onLineChange,
  onRandomPick,
  isAnimating,
}: Props) {
  const allCodes = lines.map((l) => l.code)
  const pickDisabled = selectedLineCodes.length === 0 || isAnimating

  return (
    <div className="brand-glass" style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={brandTitleStyle}>捷運籤</h1>
        <p style={sloganStyle}>搖一搖，捷運替你決定今天</p>
      </div>

      <p style={sectionLabelStyle}>選擇想搭的路線</p>

      <div style={selectRowStyle}>
        <Button
          type="link"
          size="small"
          onClick={() => onLineChange(allCodes)}
          disabled={selectedLineCodes.length === allCodes.length}
        >
          全選
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => onLineChange([])}
          disabled={selectedLineCodes.length === 0}
        >
          全部取消
        </Button>
      </div>

      <div style={listScrollStyle}>
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          value={selectedLineCodes}
          onChange={(vals) => onLineChange(vals as string[])}
        >
          {lines.map((line) => (
            <Checkbox key={line.code} value={line.code}>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  backgroundColor: line.color,
                  borderRadius: '50%',
                  marginRight: 8,
                  verticalAlign: 'middle',
                  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.25)',
                }}
              />
              {line.nameZh ?? line.code}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <Divider style={{ margin: '0 0 16px 0' }} />

      <Button
        type="primary"
        block
        size="large"
        onClick={onRandomPick}
        disabled={pickDisabled}
        loading={isAnimating}
        icon={<SwapOutlined />}
      >
        {isAnimating ? '列車行駛中…' : '搖籤 · 抽一站'}
      </Button>
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
}
