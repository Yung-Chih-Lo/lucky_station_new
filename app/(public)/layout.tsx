'use client'

import { ConfigProvider } from 'antd'
import type { ReactNode } from 'react'
import { brandTheme } from '@/lib/theme'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={brandTheme}>
      <div className="brand-public">{children}</div>
    </ConfigProvider>
  )
}
