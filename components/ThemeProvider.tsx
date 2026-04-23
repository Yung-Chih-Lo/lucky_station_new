'use client'

import { ConfigProvider } from 'antd'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { themeFor, type ThemeMode } from '@/lib/theme'

type ThemeModeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

const STORAGE_KEY = 'lastTransportTab'

function isThemeMode(v: unknown): v is ThemeMode {
  return v === 'mrt' || v === 'tra'
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used inside <ThemeProvider>')
  }
  return ctx
}

type Props = {
  defaultMode?: ThemeMode
  children: ReactNode
}

export default function ThemeProvider({ defaultMode = 'mrt', children }: Props) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (isThemeMode(stored) && stored !== mode) {
        setModeState(stored)
      }
    } catch {
      // localStorage unavailable
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const value = useMemo<ThemeModeContextValue>(() => ({ mode, setMode }), [mode, setMode])

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider theme={themeFor(mode)}>{children}</ConfigProvider>
    </ThemeModeContext.Provider>
  )
}
