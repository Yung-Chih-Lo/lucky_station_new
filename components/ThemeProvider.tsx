'use client'

import { ConfigProvider } from 'antd'
import {
  createContext,
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
  const [mode, setMode] = useState<ThemeMode>(defaultMode)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  const value = useMemo<ThemeModeContextValue>(() => ({ mode, setMode }), [mode])

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider theme={themeFor(mode)}>{children}</ConfigProvider>
    </ThemeModeContext.Provider>
  )
}
