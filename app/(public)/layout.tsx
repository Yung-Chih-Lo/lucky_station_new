import type { ReactNode } from 'react'
import ThemeProvider from '@/components/ThemeProvider'
import TopBar from '@/components/layout/TopBar'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultMode="mrt">
      <div className="brand-public">
        <TopBar />
        {children}
      </div>
    </ThemeProvider>
  )
}
