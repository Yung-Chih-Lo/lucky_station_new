import type { CSSProperties, ReactNode } from 'react'

type Props = {
  size?: number
  label: string
  sublabel?: string
  color?: string
  rotation?: number
  ariaLabel?: string
  style?: CSSProperties
  children?: ReactNode
}

export default function SealMark({
  size = 72,
  label,
  sublabel,
  color = 'var(--seal)',
  rotation = -8,
  ariaLabel,
  style,
  children,
}: Props) {
  return (
    <div
      role="img"
      aria-label={ariaLabel ?? `${label}${sublabel ? ` · ${sublabel}` : ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2.5px solid ${color}`,
        color: color,
        transform: `rotate(${rotation}deg)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-serif), "Noto Serif TC", ui-serif, serif',
        letterSpacing: '0.08em',
        lineHeight: 1,
        textAlign: 'center',
        background: 'transparent',
        boxShadow: `inset 0 0 0 1.5px ${color}`,
        ...style,
      }}
    >
      {children ?? (
        <>
          <span style={{ fontWeight: 900, fontSize: Math.round(size * 0.28) }}>{label}</span>
          {sublabel && (
            <span
              style={{
                marginTop: 4,
                fontSize: Math.round(size * 0.13),
                fontWeight: 500,
                letterSpacing: '0.16em',
              }}
            >
              {sublabel}
            </span>
          )}
        </>
      )}
    </div>
  )
}
