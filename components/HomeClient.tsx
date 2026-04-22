'use client'

import { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import MrtPicker from './mrt/MrtPicker'
import TraPicker from './tra/TraPicker'
import { useThemeMode } from './ThemeProvider'
import type { ThemeMode } from '@/lib/theme'
import type { CanvasView, ConnectionView, LineView, StationView } from './types'

const STORAGE_KEY = 'lastTransportTab'

type Props = {
  mrt: {
    stations: StationView[]
    connections: ConnectionView[]
    lines: LineView[]
    canvas: CanvasView
  }
  tra: {
    counties: string[]
    countyToStations: Record<string, string[]>
  }
}

function isThemeMode(v: string | null): v is ThemeMode {
  return v === 'mrt' || v === 'tra'
}

export default function HomeClient({ mrt, tra }: Props) {
  const { mode, setMode } = useThemeMode()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (isThemeMode(stored) && stored !== mode) {
        setMode(stored)
      }
    } catch {
      // localStorage may be unavailable; ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTabChange = (key: string) => {
    if (!isThemeMode(key)) return
    setMode(key)
    try {
      window.localStorage.setItem(STORAGE_KEY, key)
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ padding: '12px 20px 0' }}>
      <Tabs
        activeKey={mode}
        onChange={handleTabChange}
        size="large"
        centered
        // Mount both panels so internal state survives tab switches
        items={[
          {
            key: 'mrt',
            label: '捷運',
            children: hydrated ? (
              <MrtPicker
                stations={mrt.stations}
                connections={mrt.connections}
                lines={mrt.lines}
                canvas={mrt.canvas}
              />
            ) : null,
            forceRender: true,
          },
          {
            key: 'tra',
            label: '台鐵',
            children: hydrated ? (
              <TraPicker counties={tra.counties} countyToStations={tra.countyToStations} />
            ) : null,
            forceRender: true,
          },
        ]}
      />
    </div>
  )
}
