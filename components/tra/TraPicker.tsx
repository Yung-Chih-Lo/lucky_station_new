'use client'

import { useMemo, useState } from 'react'
import { Modal, message } from 'antd'
import TaiwanSvgMap from './TaiwanSvgMap'
import TraSidebar from './Sidebar'
import TraResultDisplay from './ResultDisplay'

const MODAL_TITLES = [
  '下一站開往…',
  '命運決定了…',
  '今天的籤',
  '台鐵替你選的是',
]

type CountyMap = Record<string, string[]>

type Props = {
  counties: string[]
  countyToStations: CountyMap
}

type PickResult = {
  token: string
  station: {
    id: number
    nameZh: string
    nameEn: string | null
    county: string | null
    transportType: 'tra'
  }
}

export default function TraPicker({ counties, countyToStations }: Props) {
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])
  const [isPicking, setIsPicking] = useState(false)
  const [result, setResult] = useState<PickResult | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [titleIndex, setTitleIndex] = useState(0)
  const [messageApi, contextHolder] = message.useMessage()

  const sortedCounties = useMemo(() => [...counties], [counties])

  const handleToggleCounty = (county: string) => {
    setSelectedCounties((prev) =>
      prev.includes(county) ? prev.filter((c) => c !== county) : [...prev, county],
    )
  }

  const handlePick = async () => {
    if (selectedCounties.length === 0 || isPicking) return
    setIsPicking(true)
    try {
      const res = await fetch('/api/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transport_type: 'tra',
          filter: { counties: selectedCounties },
        }),
      })

      if (res.status === 429) {
        messageApi.warning('太快了！請稍候再試')
        return
      }

      if (res.status === 422) {
        messageApi.warning('這個範圍內沒有車站可抽')
        return
      }

      if (!res.ok) {
        messageApi.error('抽籤失敗，請稍後再試')
        return
      }

      const data = (await res.json()) as PickResult
      setResult(data)
      setTitleIndex((i) => (i + 1) % MODAL_TITLES.length)
      setModalOpen(true)
    } catch (e) {
      messageApi.error('網路錯誤，請稍後再試')
    } finally {
      setIsPicking(false)
    }
  }

  return (
    <div style={pageStyle}>
      {contextHolder}
      <aside style={sidebarAreaStyle}>
        <TraSidebar
          counties={sortedCounties}
          selectedCounties={selectedCounties}
          onChange={setSelectedCounties}
          onPick={handlePick}
          isPicking={isPicking}
        />
      </aside>

      <main style={mainAreaStyle}>
        <h2 style={mapTitleStyle}>台灣縣市</h2>
        <div style={mapContainerStyle}>
          <TaiwanSvgMap
            selectedCounties={selectedCounties}
            availableCounties={sortedCounties}
            onToggleCounty={handleToggleCounty}
          />
        </div>
      </main>

      <Modal
        title={<span style={modalTitleStyle}>{MODAL_TITLES[titleIndex]}</span>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        styles={{
          content: {
            background: 'var(--brand-surface-strong)',
            border: '1px solid var(--brand-accent)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          },
          header: { background: 'transparent', borderBottom: 'none' },
        }}
      >
        {modalOpen && result && (
          <TraResultDisplay
            station={result.station}
            token={result.token}
            countyPool={selectedCounties}
            countyToStations={countyToStations}
          />
        )}
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
  background: 'var(--brand-surface)',
  border: '1px solid var(--brand-border)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
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
