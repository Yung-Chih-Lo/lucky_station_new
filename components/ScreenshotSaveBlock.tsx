'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

type Props = {
  token: string
  size?: number
}

export default function ScreenshotSaveBlock({ token, size = 80 }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const absoluteUrl = `${origin}/comment?token=${encodeURIComponent(token)}`
    QRCode.toDataURL(absoluteUrl, {
      margin: 1,
      width: size * 2,
      color: { dark: '#1A1D2B', light: '#FFFBF0' },
    })
      .then(setQrDataUrl)
      .catch(() => {})
  }, [token, size])

  if (!qrDataUrl) {
    return <div style={{ width: size, height: size, flexShrink: 0 }} aria-hidden="true" />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={qrDataUrl}
      width={size}
      height={size}
      alt=""
      style={{ display: 'block', flexShrink: 0, borderRadius: 4 }}
    />
  )
}
