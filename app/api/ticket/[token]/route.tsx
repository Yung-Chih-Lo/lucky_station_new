import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import QRCode from 'qrcode'
import { NextResponse } from 'next/server'
import { getSqlite } from '@/db/client'
import { ticketNoFromToken } from '@/lib/ticketNumber'

export const runtime = 'nodejs'

type PickRow = {
  station_id: number
  transport_type: 'mrt' | 'tra'
  token: string
  picked_at: number
  name_zh: string
  name_en: string | null
  county: string | null
}

async function loadFont(relative: string): Promise<ArrayBuffer> {
  const p = path.join(process.cwd(), 'public', 'fonts', relative)
  const buf = await readFile(p)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
}

function formatDate(ms: number): string {
  const d = new Date(ms)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export async function GET(
  req: Request,
  { params }: { params: { token: string } },
) {
  const sqlite = getSqlite()
  const pick = sqlite
    .prepare<[string], PickRow>(
      `SELECT p.station_id, p.transport_type, p.token, p.picked_at,
              s.name_zh, s.name_en, s.county
       FROM station_picks p
       JOIN stations s ON s.id = p.station_id
       WHERE p.token = ?`,
    )
    .get(params.token)

  if (!pick) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const [serif, sans, mono] = await Promise.all([
    loadFont('NotoSerifTC-900-subset.ttf'),
    loadFont('NotoSansTC-500-subset.ttf'),
    loadFont('JetBrainsMono-500.ttf'),
  ])

  const origin = new URL(req.url).origin
  const qrTarget = `${origin}/ticket/${encodeURIComponent(pick.token)}`
  const qrSvg = await QRCode.toString(qrTarget, {
    type: 'svg',
    margin: 1,
    color: { dark: '#1A1D2B', light: '#FFFBF0' },
  })
  const qrDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`

  const ticketNo = ticketNoFromToken(pick.token)
  const dateLabel = formatDate(pick.picked_at)
  const modeLabel = pick.transport_type === 'mrt' ? '捷運' : '台鐵'
  const accent = pick.transport_type === 'mrt' ? '#E8421C' : '#15365C'

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1920,
          background: '#F3ECDC',
          display: 'flex',
          padding: 72,
          fontFamily: 'NotoSansTC, sans-serif',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#FFFBF0',
            border: '1px solid rgba(26,29,43,0.28)',
            borderRadius: 40,
            padding: 80,
            position: 'relative',
            boxShadow: '10px 10px 0 0 rgba(232,66,28,0.12), -10px -10px 0 0 rgba(26,29,43,0.08)',
          }}
        >
          {/* top kerf */}
          <div
            style={{
              position: 'absolute',
              top: 32,
              left: 56,
              right: 56,
              height: 2,
              borderTop: '2px dashed rgba(26,29,43,0.28)',
              display: 'flex',
            }}
          />
          {/* bottom kerf */}
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: 56,
              right: 56,
              height: 2,
              borderTop: '2px dashed rgba(26,29,43,0.28)',
              display: 'flex',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#6B6557',
              fontSize: 24,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}
          >
            <span>都市籤詩 · 下一站幸運車站</span>
            <span style={{ fontFamily: 'JetBrainsMono, monospace' }}>No.{ticketNo}</span>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            <div
              style={{
                color: '#6B6557',
                fontSize: 28,
                letterSpacing: 10,
                textTransform: 'uppercase',
                marginBottom: 24,
              }}
            >
              今 日 的 籤
            </div>
            {pick.name_en && (
              <div
                style={{
                  color: '#6B6557',
                  fontSize: 30,
                  letterSpacing: 6,
                  marginBottom: 18,
                }}
              >
                {pick.name_en.toUpperCase()}
              </div>
            )}
            <div
              style={{
                fontFamily: 'NotoSerifTC, serif',
                fontSize: 240,
                fontWeight: 900,
                color: '#1A1D2B',
                lineHeight: 1,
                letterSpacing: 8,
                display: 'flex',
              }}
            >
              {pick.name_zh}
            </div>
            <div
              style={{
                marginTop: 18,
                color: '#1A1D2B',
                fontSize: 34,
                letterSpacing: 10,
                display: 'flex',
              }}
            >
              {pick.transport_type === 'tra' ? `${pick.county ?? ''} · 台鐵` : '台北捷運'}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 999,
                  border: `6px solid #C8954A`,
                  boxShadow: 'inset 0 0 0 3px #C8954A',
                  color: '#C8954A',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-8deg)',
                  fontFamily: 'NotoSerifTC, serif',
                }}
              >
                <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: 4 }}>{modeLabel}</span>
                <span style={{ fontSize: 20, letterSpacing: 4, marginTop: 4, fontFamily: 'JetBrainsMono, monospace' }}>
                  No.{ticketNo}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: 'NotoSerifTC, serif',
                    fontSize: 36,
                    color: '#1A1D2B',
                    letterSpacing: 6,
                  }}
                >
                  {dateLabel}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    color: accent,
                    letterSpacing: 8,
                  }}
                >
                  搖一搖 · 讓城市替你決定今天
                </span>
              </div>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUri}
              width={180}
              height={180}
              alt=""
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      fonts: [
        { name: 'NotoSerifTC', data: serif, weight: 900, style: 'normal' },
        { name: 'NotoSansTC', data: sans, weight: 500, style: 'normal' },
        { name: 'JetBrainsMono', data: mono, weight: 500, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, immutable',
      },
    },
  )
}
