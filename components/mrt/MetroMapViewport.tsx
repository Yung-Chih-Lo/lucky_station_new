'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { MinusOutlined, PlusOutlined, ExpandOutlined } from '@ant-design/icons'
import SchematicMap, { type SchematicMapProps } from '../SchematicMap'

type View = { x: number; y: number; scale: number }
type Point = { x: number; y: number }
type Props = Omit<SchematicMapProps, 'adminMode'> & { expanded?: boolean; onExpand?: () => void }

const CITY_EDGES = new Set(['蘆洲', '新北產業園區', '南港展覽館', '動物園', '新店', '頂埔'])

export default function MetroMapViewport({ expanded = false, onExpand, ...map }: Props) {
  const { canvas, stations, selectedLineCodes, isAnimating, animationStations } = map
  const region = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, Point>())
  const size = useRef({ width: 800, height: 600 })
  const viewRef = useRef<View>({ x: 0, y: 0, scale: 0.4 })
  const [view, setView] = useState(viewRef.current)
  const [dragging, setDragging] = useState(false)

  const update = useCallback((next: View) => {
    const { width, height } = size.current
    const mapWidth = canvas.width * next.scale
    const mapHeight = canvas.height * next.scale
    // Keep at least the map edge in view; center maps smaller than the viewport.
    next.x = mapWidth <= width ? (width - mapWidth) / 2 : Math.max(width - mapWidth - 24, Math.min(24, next.x))
    next.y = mapHeight <= height ? (height - mapHeight) / 2 : Math.max(height - mapHeight - 24, Math.min(24, next.y))
    viewRef.current = next
    setView(next)
  }, [canvas.width, canvas.height])

  const fit = useCallback((mode: 'all' | 'city' | 'selected') => {
    const candidates = mode === 'city'
      ? stations.filter((s) => CITY_EDGES.has(s.nameZh))
      : mode === 'selected' ? stations.filter((s) => s.lineCodes.some((c) => selectedLineCodes?.includes(c))) : []
    let box = { x: 0, y: 0, width: canvas.width, height: canvas.height }
    if (candidates.length > 0) {
      const xs = candidates.map((s) => s.schematicX)
      const ys = candidates.map((s) => s.schematicY)
      box = { x: Math.min(...xs) - 140, y: Math.min(...ys) - 70,
        width: Math.max(...xs) - Math.min(...xs) + 280, height: Math.max(...ys) - Math.min(...ys) + 140 }
    }
    const { width, height } = size.current
    const fitted = Math.min((width - 24) / box.width, (height - 24) / box.height, 2)
    const scale = mode === 'city' && candidates.length ? Math.max(0.8, fitted) : fitted
    update({ scale, x: (width - box.width * scale) / 2 - box.x * scale, y: (height - box.height * scale) / 2 - box.y * scale })
  }, [canvas, stations, selectedLineCodes, update])
  const fitRef = useRef(fit)
  fitRef.current = fit

  const zoom = useCallback((factor: number, anchor?: Point) => {
    const current = viewRef.current
    const min = Math.min(size.current.width / canvas.width, size.current.height / canvas.height) * 0.9
    const scale = Math.max(min, Math.min(2.5, current.scale * factor))
    const point = anchor ?? { x: size.current.width / 2, y: size.current.height / 2 }
    const ratio = scale / current.scale
    update({ scale, x: point.x - (point.x - current.x) * ratio, y: point.y - (point.y - current.y) * ratio })
  }, [canvas.width, canvas.height, update])

  useEffect(() => {
    const element = region.current
    if (!element) return
    let measured = false
    const measure = () => {
      const rect = element.getBoundingClientRect()
      const width = element.clientWidth || rect.width
      const height = element.clientHeight || rect.height
      if (!width || !height) return
      const previousSize = size.current
      if (measured && width === previousSize.width && height === previousSize.height) return
      size.current = { width, height }
      if (!measured) {
        measured = true
        fitRef.current('city')
      } else {
        // Dialog scroll locking and responsive resizing must not discard the user's view.
        const current = viewRef.current
        update({ ...current, x: current.x + (width - previousSize.width) / 2, y: current.y + (height - previousSize.height) / 2 })
      }
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [update])

  useEffect(() => {
    const element = region.current
    if (!element) return
    const wheel = (event: WheelEvent) => {
      // Normal scrolling still scrolls the page. Ctrl/trackpad pinch zooms the map.
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      zoom(Math.exp(-event.deltaY * 0.008), { x: event.clientX - rect.left, y: event.clientY - rect.top })
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [zoom])

  const wasAnimating = useRef(false)
  useEffect(() => {
    if (isAnimating) fitRef.current('all')
    else if (wasAnimating.current && animationStations?.length) {
      const last = animationStations[animationStations.length - 1]
      const scale = Math.max(viewRef.current.scale, 0.8)
      update({ scale, x: size.current.width / 2 - last.schematicX * scale, y: size.current.height / 2 - last.schematicY * scale })
    }
    wasAnimating.current = !!isAnimating
  }, [isAnimating, animationStations, update])

  function point(event: React.PointerEvent): Point {
    const rect = region.current!.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function move(event: React.PointerEvent) {
    if (!pointers.current.has(event.pointerId)) return
    const before = [...pointers.current.values()]
    pointers.current.set(event.pointerId, point(event))
    const after = [...pointers.current.values()]
    if (before.length === 1) {
      update({ ...viewRef.current, x: viewRef.current.x + after[0].x - before[0].x, y: viewRef.current.y + after[0].y - before[0].y })
    } else if (before.length === 2) {
      const distance = (p: Point[]) => Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y)
      const center = (p: Point[]) => ({ x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 })
      const oldCenter = center(before), newCenter = center(after)
      if (distance(before) > 0) zoom(distance(after) / distance(before), oldCenter)
      update({ ...viewRef.current, x: viewRef.current.x + newCenter.x - oldCenter.x, y: viewRef.current.y + newCenter.y - oldCenter.y })
    }
  }

  function release(event: React.PointerEvent) {
    pointers.current.delete(event.pointerId)
    setDragging(pointers.current.size > 0)
  }

  return (
    <section className={`metro-map${expanded ? ' metro-map-expanded' : ''}`} aria-label="互動捷運路網">
      <div className="metro-map-toolbar">
        <div className="metro-map-heading"><strong>臺北・新北捷運路網</strong><span>示意圖 · 非實際距離</span></div>
        <div className="metro-map-controls">
          <Button autoInsertSpace={false} onClick={() => fit('city')}>市區</Button>
          <Button autoInsertSpace={false} onClick={() => fit('all')}>全圖</Button>
          {!!selectedLineCodes?.length && <Button onClick={() => fit('selected')}>已選路線</Button>}
          <Button aria-label="縮小路網" icon={<MinusOutlined />} onClick={() => zoom(1 / 1.3)} />
          <Button aria-label="放大路網" icon={<PlusOutlined />} onClick={() => zoom(1.3)} />
          {onExpand && <Button aria-label="開啟大圖" icon={<ExpandOutlined />} onClick={onExpand}>大圖</Button>}
        </div>
      </div>
      <div ref={region} className="metro-map-viewport" role="region" aria-label="捷運地圖，可拖曳平移，使用加減鍵縮放、方向鍵移動，Home 回全圖" tabIndex={0}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onPointerDown={(event) => {
          if (event.button !== 0 || pointers.current.size >= 2) return
          pointers.current.set(event.pointerId, point(event))
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
        }}
        onPointerMove={move} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
        onKeyDown={(event) => {
          const arrows: Record<string, Point> = { ArrowLeft: { x: 60, y: 0 }, ArrowRight: { x: -60, y: 0 }, ArrowUp: { x: 0, y: 60 }, ArrowDown: { x: 0, y: -60 } }
          if (arrows[event.key]) { event.preventDefault(); update({ ...viewRef.current, x: viewRef.current.x + arrows[event.key].x, y: viewRef.current.y + arrows[event.key].y }) }
          else if (['+', '=', '-'].includes(event.key)) { event.preventDefault(); zoom(event.key === '-' ? 1 / 1.3 : 1.3) }
          else if (event.key === 'Home') { event.preventDefault(); fit('all') }
        }}>
        <div className="metro-map-canvas" style={{ width: canvas.width, height: canvas.height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}>
          <SchematicMap {...map} animationScale={view.scale} />
        </div>
      </div>
      <div className="metro-map-caption"><span>拖曳移動 · 雙指縮放 · Ctrl＋滾輪縮放</span><span>◎ 轉乘站</span></div>
    </section>
  )
}
