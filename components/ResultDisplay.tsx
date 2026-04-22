'use client'

import { Empty } from 'antd'
import { EnvironmentOutlined, ExportOutlined } from '@ant-design/icons'
import type { LineView, StationView } from './types'

type Props = {
  station: StationView | null
  lines: LineView[]
}

export default function ResultDisplay({ station, lines }: Props) {
  if (!station) {
    return (
      <div style={containerStyle}>
        <Empty description="尚未抽取目的地" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  const lineOf = (code: string) => lines.find((l) => l.code === code)
  const wikiLink = `https://zh.wikipedia.org/wiki/${encodeURIComponent(station.nameZh)}站_(台北捷運)`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    station.nameZh,
  )}+捷運站`

  return (
    <div style={containerStyle}>
      <p style={eyebrowStyle}>今日的籤是</p>
      <h2 className="brand-reveal" style={stationNameStyle}>
        {station.nameZh}
      </h2>
      {station.nameEn && <p style={stationEnStyle}>{station.nameEn}</p>}

      <div style={chipsRowStyle}>
        {station.lineCodes.map((code) => {
          const line = lineOf(code)
          return (
            <span
              key={code}
              style={{
                ...chipStyle,
                backgroundColor: line?.color ?? 'var(--brand-surface-strong)',
              }}
            >
              {line?.nameZh ?? code}
            </span>
          )
        })}
      </div>

      <div style={linksRowStyle}>
        <a href={wikiLink} target="_blank" rel="noopener noreferrer" style={linkPillStyle}>
          <ExportOutlined />
          <span>維基百科</span>
        </a>
        <a href={mapLink} target="_blank" rel="noopener noreferrer" style={linkPillStyle}>
          <EnvironmentOutlined />
          <span>Google Maps</span>
        </a>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '24px 16px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: 200,
  color: 'var(--brand-text)',
}

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--brand-text-muted)',
  fontSize: 12,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
}

const stationNameStyle: React.CSSProperties = {
  margin: '10px 0 4px',
  fontFamily: 'var(--font-serif), "Noto Serif TC", Georgia, serif',
  fontWeight: 700,
  fontSize: 56,
  lineHeight: 1.1,
  letterSpacing: '0.04em',
  color: 'var(--brand-text)',
}

const stationEnStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--brand-text-muted)',
  fontSize: 13,
  letterSpacing: '0.08em',
}

const chipsRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 6,
  marginTop: 14,
}

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: 999,
  color: '#fff',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.04em',
}

const linksRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 10,
  marginTop: 22,
  paddingTop: 18,
  borderTop: '1px solid var(--brand-border)',
  width: '100%',
  flexWrap: 'wrap',
}

const linkPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  borderRadius: 999,
  border: '1px solid var(--brand-accent-gold)',
  color: 'var(--brand-accent-gold)',
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 500,
  transition: 'background-color 200ms ease, color 200ms ease',
  cursor: 'pointer',
}
