import type { ReactNode } from 'react'
import ThemeProvider from '@/components/ThemeProvider'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultMode="mrt">
      <div className="brand-public">{children}</div>
    </ThemeProvider>
  )
}
