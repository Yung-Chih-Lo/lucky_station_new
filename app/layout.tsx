import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'

const notoSans = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSerif = Noto_Serif_TC({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '捷運籤 | 搖一搖，捷運替你決定今天',
  description: '選幾條線，搖一搖，讓捷運替你決定今天的目的地。台北捷運隨機籤站。',
  icons: { icon: '/train.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-TW"
      data-theme="mrt"
      className={`${notoSans.variable} ${notoSerif.variable}`}
    >
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
