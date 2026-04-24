'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import SealMark from './SealMark'
import ScreenshotSaveBlock from '../ScreenshotSaveBlock'

type Props = {
  /** Station name shown character-by-character during the type-in phase. */
  stationName: string
  /** Optional Latin station name, rendered small above the stagger. */
  stationNameEn?: string | null
  ticketNo: string
  dateLabel: string
  modeLabel: '捷運' | '台鐵'
  /**
   * Pick token. When present, renders a screenshot-save QR alongside the
   * seal so users can save the result page for later recall.
   */
  token?: string
  /**
   * Promise that resolves once the pick-side server work has completed (e.g.
   * the `/api/pick` response). When provided, the ritual pauses at the end of
   * phase 2 (pop) and only enters phase 3 (type-in) after this resolves.
   * If omitted, phases advance on their fixed timers.
   */
  waitFor?: Promise<void> | null
  /** Post-reveal content (buttons, metadata). Revealed during phase 4. */
  children: ReactNode
  /** Called once the full ritual timeline finishes. */
  onDone?: () => void
}

type Phase = 'shake' | 'pop' | 'pop-hold' | 'type' | 'stamp' | 'done'

const TIMING = {
  shake: 300,
  pop: 200,
  typePerChar: 60,
  typeTail: 120,
  stamp: 260,
} as const

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function RevealRitual({
  stationName,
  stationNameEn,
  ticketNo,
  dateLabel,
  modeLabel,
  token,
  waitFor,
  children,
  onDone,
}: Props) {
  const [phase, setPhase] = useState<Phase>('shake')
  const doneCalled = useRef(false)
  const chars = [...stationName]

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase('done')
      if (!doneCalled.current) {
        doneCalled.current = true
        onDone?.()
      }
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const schedule = (ms: number, fn: () => void) => {
      timers.push(setTimeout(() => !cancelled && fn(), ms))
    }

    schedule(TIMING.shake, () => {
      if (!waitFor) {
        setPhase('type')
        return
      }
      setPhase('pop-hold')
      waitFor
        .then(() => {
          if (!cancelled) setPhase('type')
        })
        .catch(() => {
          // on error, still advance to avoid a stuck modal
          if (!cancelled) setPhase('type')
        })
    })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitFor])

  // phase === 'shake' auto advances to pop at TIMING.shake (handled in effect
  // above). Once we're in 'type', schedule the next phases on top of it.
  useEffect(() => {
    if (phase !== 'type') return
    const typeMs = chars.length * TIMING.typePerChar + TIMING.typeTail
    const t1 = setTimeout(() => setPhase('stamp'), typeMs)
    const t2 = setTimeout(() => {
      setPhase('done')
      if (!doneCalled.current) {
        doneCalled.current = true
        onDone?.()
      }
    }, typeMs + TIMING.stamp)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, chars.length])

  const classNames = ['omikuji-ritual']
  if (phase === 'shake') classNames.push('is-shaking', 'is-flashing')
  if (phase === 'pop-hold' || phase === 'type' || phase === 'stamp' || phase === 'done')
    classNames.push('is-popping')
  if (phase === 'type' || phase === 'stamp' || phase === 'done') classNames.push('is-typing')
  if (phase === 'stamp' || phase === 'done') classNames.push('is-stamped')
  if (phase === 'done') classNames.push('is-done')

  return (
    <div className={classNames.join(' ')} style={ritualStyle}>
      <div className="omikuji-ritual-flash" aria-hidden="true" />

      <div className="omikuji-ritual-stage" aria-live="polite">
        {stationNameEn && <p style={stageEnStyle}>{stationNameEn}</p>}
        <p style={stageZhStyle}>
          {chars.map((ch, i) => (
            <span
              key={`${i}-${ch}`}
              className="omikuji-ritual-char"
              style={{ animationDelay: `${i * TIMING.typePerChar}ms` }}
            >
              {ch}
            </span>
          ))}
        </p>
      </div>

      <div className="omikuji-ritual-body">
        {children}
        {token && (
          <>
            <p style={qrCaptionStyle}>
              📸 截圖保存，之後打開相簿掃 QR Code 就可以寫心得嘍！
            </p>
            <div style={qrArrowStyle} aria-hidden="true">↓</div>
          </>
        )}
        <div style={sealRowStyle}>
          {token && <ScreenshotSaveBlock token={token} size={80} />}
          <span className="omikuji-ritual-seal">
            <SealMark
              size={68}
              label={modeLabel}
              sublabel={`No.${ticketNo}`}
              ariaLabel={`${modeLabel}印章 · ${dateLabel} · No.${ticketNo}`}
            />
          </span>
          <span style={dateTextStyle}>{dateLabel}</span>
        </div>
      </div>
    </div>
  )
}

const ritualStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: 240,
}

const stageZhStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-serif), "Noto Serif TC", ui-serif, serif',
  fontWeight: 900,
  fontSize: 'clamp(42px, 9vw, 72px)',
  lineHeight: 1.05,
  letterSpacing: '0.08em',
  color: 'var(--ink)',
  textAlign: 'center',
}

const stageEnStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  fontSize: 13,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  textAlign: 'center',
}

const sealRowStyle: React.CSSProperties = {
  marginTop: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
}

const qrCaptionStyle: React.CSSProperties = {
  margin: '24px 0 0',
  fontSize: 13,
  lineHeight: 1.5,
  color: 'var(--ink-muted)',
  textAlign: 'left',
}

const qrArrowStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 16,
  color: 'var(--ink-muted)',
  textAlign: 'left',
  paddingLeft: 28,
}

const dateTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  fontSize: 12,
  letterSpacing: '0.24em',
  color: 'var(--ink-muted)',
  textTransform: 'uppercase',
}
