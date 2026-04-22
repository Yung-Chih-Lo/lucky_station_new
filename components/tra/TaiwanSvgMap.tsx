'use client'

import { useMemo } from 'react'
import taiwanMap from '@svg-maps/taiwan.main'
import { SVG_ID_TO_COUNTY } from './countyMap'

type Location = { id: string; name: string; path: string }
type SvgMap = { viewBox: string; locations: Location[] }
const map = (taiwanMap as unknown as { default?: SvgMap; viewBox: string; locations: Location[] }).default ?? (taiwanMap as unknown as SvgMap)

type Props = {
  selectedCounties: string[]
  availableCounties: string[]
  onToggleCounty: (county: string) => void
}

export default function TaiwanSvgMap({
  selectedCounties,
  availableCounties,
  onToggleCounty,
}: Props) {
  const selectedSet = useMemo(() => new Set(selectedCounties), [selectedCounties])
  const availableSet = useMemo(() => new Set(availableCounties), [availableCounties])

  return (
    <div className="tra-map-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={map.viewBox}
        role="img"
        aria-label="台灣縣市地圖"
        className="tra-map-svg"
      >
        {map.locations.map((loc) => {
          const county = SVG_ID_TO_COUNTY[loc.id]
          const available = !!county && availableSet.has(county)
          const selected = !!county && selectedSet.has(county)
          const cls = [
            'tra-map-region',
            selected ? 'is-selected' : '',
            !available ? 'is-disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <path
              key={loc.id}
              d={loc.path}
              className={cls}
              tabIndex={available ? 0 : -1}
              role={available ? 'button' : undefined}
              aria-label={county ?? loc.name}
              aria-pressed={available ? selected : undefined}
              onClick={() => available && county && onToggleCounty(county)}
              onKeyDown={(e) => {
                if (!available || !county) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onToggleCounty(county)
                }
              }}
            >
              {county && <title>{county}</title>}
            </path>
          )
        })}
      </svg>
    </div>
  )
}
