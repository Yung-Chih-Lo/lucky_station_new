'use client'

import { Button } from 'antd'
import { EnvironmentOutlined, ExportOutlined } from '@ant-design/icons'

type ResultStation = {
  id: number
  nameZh: string
  nameEn: string | null
  county: string | null
}

type Props = {
  station: ResultStation
}

export default function TraResultDisplay({ station }: Props) {
  const wikiLink = `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
    station.nameZh + '車站',
  )}`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    station.nameZh + '車站',
  )}`

  return (
    <div style={containerStyle}>
      <p style={eyebrowStyle}>此站有緣</p>
      <h2 className="brand-reveal" style={stationNameStyle}>
        {station.nameZh}
        <span style={suffixStyle}>車站</span>
      </h2>
      {station.nameEn && <p style={stationEnStyle}>{station.nameEn}</p>}

      {station.county && (
        <div style={chipsRowStyle}>
          <span style={countyChipStyle}>{station.county}</span>
        </div>
      )}

      <div style={linksRowStyle}>
        <a href={wikiLink} target="_blank" rel="noopener noreferrer" style={linkButtonWrapStyle}>
          <Button size="large" block icon={<ExportOutlined />}>
            維基百科
          </Button>
        </a>
        <a href={mapLink} target="_blank" rel="noopener noreferrer" style={linkButtonWrapStyle}>
          <Button size="large" block icon={<EnvironmentOutlined />}>
            Google Maps
          </Button>
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
  color: 'var(--ink)',
}

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: 'var(--ink-muted)',
  fontSize: 12,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
}

const stationNameStyle: React.CSSProperties = {
  margin: '10px 0 4px',
  fontFamily: 'var(--font-serif), "Noto Serif TC", ui-serif, serif',
  fontWeight: 900,
  fontSize: 56,
  lineHeight: 1.1,
  letterSpacing: '0.04em',
  color: 'var(--ink)',
}

const suffixStyle: React.CSSProperties = {
  fontSize: 28,
  marginLeft: 6,
  color: 'var(--ink-muted)',
  fontWeight: 500,
}

const stationEnStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-serif), "Noto Serif TC", ui-serif, serif',
  fontStyle: 'italic',
  color: 'var(--ink-muted)',
  fontSize: 15,
  letterSpacing: '0.24em',
}

const chipsRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 6,
  marginTop: 14,
}

const countyChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 14px',
  borderRadius: 999,
  background: 'var(--accent)',
  color: '#fff',
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '0.08em',
}

const linksRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 10,
  marginTop: 18,
  paddingTop: 18,
  borderTop: '1px solid var(--rule)',
  width: '100%',
}

const linkButtonWrapStyle: React.CSSProperties = {
  flex: 1,
  textDecoration: 'none',
}
