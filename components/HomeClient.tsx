'use client'

import { useState } from 'react'
import { Modal } from 'antd'
import SchematicMap from './SchematicMap'
import Sidebar from './Sidebar'
import ResultDisplay from './ResultDisplay'
import { filterByLines, pickRandomStation } from '@/lib/randomStation'
import { brand } from '@/lib/theme'
import type { CanvasView, ConnectionView, LineView, StationView } from './types'

const MODAL_TITLES = [
  '下一班列車開往…',
  '命運決定了…',
  '今天的籤',
  '捷運替你選的是',
]

const INTERMEDIATE_HOPS = 12

type Props = {
  stations: StationView[]
  connections: ConnectionView[]
  lines: LineView[]
  canvas: CanvasView
}

export default function HomeClient({ stations, connections, lines, canvas }: Props) {
  const [selectedLineCodes, setSelectedLineCodes] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationStations, setAnimationStations] = useState<StationView[]>([])
  const [result, setResult] = useState<StationView | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [titleIndex, setTitleIndex] = useState(0)

  const handleLineChange = (codes: string[]) => {
    setSelectedLineCodes(codes)
    setResult(null)
    setModalOpen(false)
  }

  const handleRandomPick = () => {
    const finalStation = pickRandomStation(stations, selectedLineCodes)
    if (!finalStation) return

    setResult(finalStation)
    setTitleIndex((i) => (i + 1) % MODAL_TITLES.length)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setAnimationStations([])
      setModalOpen(true)
      return
    }

    const pool = filterByLines(stations, selectedLineCodes)
    const intermediates = Array.from(
      { length: INTERMEDIATE_HOPS },
      () => pool[Math.floor(Math.random() * pool.length)],
    )

    setAnimationStations([...intermediates, finalStation])
    setIsAnimating(true)
  }

  const handleAnimationEnd = () => {
    setIsAnimating(false)
    setModalOpen(true)
  }

  return (
    <div style={pageStyle}>
      <aside style={sidebarAreaStyle}>
        <Sidebar
          lines={lines}
          selectedLineCodes={selectedLineCodes}
          onLineChange={handleLineChange}
          onRandomPick={handleRandomPick}
          isAnimating={isAnimating}
        />
      </aside>

      <main style={mainAreaStyle}>
        <h2 style={mapTitleStyle}>台北捷運路網圖</h2>
        <div style={mapContainerStyle}>
          <SchematicMap
            stations={stations}
            connections={connections}
            lines={lines}
            canvas={canvas}
            selectedLineCodes={selectedLineCodes}
            animationStations={animationStations}
            isAnimating={isAnimating}
            onAnimationEnd={handleAnimationEnd}
          />
        </div>
      </main>

      <Modal
        title={
          <span style={modalTitleStyle}>{MODAL_TITLES[titleIndex]}</span>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        styles={{
          content: {
            background: 'var(--brand-surface-strong)',
            border: '1px solid var(--brand-accent-gold)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          },
          header: { background: 'transparent', borderBottom: 'none' },
          mask: { background: brand.maskBg, backdropFilter: 'blur(6px)' },
        }}
      >
        {modalOpen && <ResultDisplay station={result} lines={lines} />}
      </Modal>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'row',
  flexWrap: 'wrap',
}

const sidebarAreaStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 320,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
}

const mainAreaStyle: React.CSSProperties = {
  flexGrow: 1,
  padding: '20px 24px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 0,
}

const mapTitleStyle: React.CSSProperties = {
  margin: '0 0 14px',
  fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  fontWeight: 500,
  fontSize: 13,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--brand-text-muted)',
}

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  flex: 1,
  minHeight: 420,
  maxHeight: '82vh',
  borderRadius: 'var(--brand-radius-lg)',
  overflow: 'hidden',
  background:
    'radial-gradient(800px 600px at 50% 40%, rgba(255,255,255,0.04), transparent 70%), var(--brand-surface)',
  border: '1px solid var(--brand-border)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const modalTitleStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--brand-text-muted)',
}
