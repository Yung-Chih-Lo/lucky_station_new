import { afterEach, describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import HomeClient from './HomeClient'
import ThemeProvider from './ThemeProvider'

const props = {
  mrt: {
    stations: [{ id: 1, nameZh: '台北車站', nameEn: 'Taipei Main Station', schematicX: 100, schematicY: 100, labelX: 110, labelY: 100, labelAnchor: 'start' as const, lineCodes: ['R'] }],
    connections: [],
    lines: [{ code: 'R', nameZh: '淡水信義線', nameEn: null, color: '#e3002c' }],
    canvas: { width: 400, height: 400 },
  },
  tra: { counties: ['臺北市'], countyToStations: { 臺北市: ['臺北'] } },
}

afterEach(() => { cleanup(); localStorage.clear() })

describe('HomeClient crawlable rendering', () => {
  it('includes route choices and station names in server HTML before effects run', () => {
    const html = renderToString(<ThemeProvider><HomeClient {...props} /></ThemeProvider>)
    expect(html).toContain('淡水信義線')
    expect(html).toContain('台北車站')
    expect(html).toContain('命．中．注．定')
  })

  it('still restores the saved transport choice after mounting', async () => {
    localStorage.setItem('lastTransportTab', 'tra')
    render(<ThemeProvider><HomeClient {...props} /></ThemeProvider>)
    await waitFor(() => expect(screen.getByText('臺北市')).toBeInTheDocument())
    expect(screen.queryByText('淡水信義線')).not.toBeInTheDocument()
  })
})
