'use client'

import { useEffect } from 'react'
import { Empty, Table, Tabs, Tag, Typography } from 'antd'
import Link from 'next/link'
import { useThemeMode } from '@/components/ThemeProvider'

const { Title, Paragraph } = Typography

type Ranking = {
  station_id: number
  name_zh: string
  transport_type: 'mrt' | 'tra'
  county: string | null
  pick_count: number
}

type Props = {
  all: Ranking[]
  mrt: Ranking[]
  tra: Ranking[]
  totalPicks: number
}

function columns() {
  return [
    {
      title: '名次',
      key: 'rank',
      width: 80,
      render: (_: unknown, _row: Ranking, index: number) => (
        <span style={{ fontWeight: 600 }}>{index + 1}</span>
      ),
    },
    {
      title: '車站',
      dataIndex: 'name_zh',
      key: 'name',
      render: (name: string, row: Ranking) => (
        <span>
          {name}
          {row.county && (
            <Tag style={{ marginLeft: 8 }} color="default">
              {row.county}
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: '類型',
      dataIndex: 'transport_type',
      key: 'transport',
      width: 100,
      render: (t: 'mrt' | 'tra') => (
        <Tag color={t === 'mrt' ? 'purple' : 'orange'}>
          {t === 'mrt' ? '捷運' : '台鐵'}
        </Tag>
      ),
    },
    {
      title: '被抽次數',
      dataIndex: 'pick_count',
      key: 'count',
      width: 120,
      align: 'right' as const,
    },
  ]
}

function renderTable(rows: Ranking[]) {
  if (rows.length === 0) {
    return <Empty description="目前還沒人抽" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }
  return (
    <Table
      dataSource={rows.map((r, i) => ({ ...r, key: `${r.transport_type}-${r.station_id}-${i}` }))}
      columns={columns()}
      pagination={{ pageSize: 10, showSizeChanger: false, size: 'small' }}
      size="middle"
    />
  )
}

export default function StatsClient({ all, mrt, tra, totalPicks }: Props) {
  const { setMode } = useThemeMode()
  useEffect(() => {
    setMode('mrt')
  }, [setMode])

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 20px 24px' }}>
      <Link href="/" style={{ color: 'var(--ink-muted)', fontSize: 13 }}>
        ← 回首頁
      </Link>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <Title level={1} style={{ margin: 0, color: 'var(--ink)' }}>
          排行榜
        </Title>
        <span style={totalBadgeStyle}>共 {totalPicks.toLocaleString()} 次抽籤</span>
      </div>
      <Paragraph style={{ color: 'var(--ink-muted)', marginTop: 8 }}>
        哪些車站最常被抽中？跨縣市同名站（例如七堵）會分開計算。
      </Paragraph>

      <Tabs
        defaultActiveKey="all"
        items={[
          { key: 'all', label: '總榜', children: renderTable(all) },
          { key: 'mrt', label: '捷運', children: renderTable(mrt) },
          { key: 'tra', label: '台鐵', children: renderTable(tra) },
        ]}
      />
    </div>
  )
}

const totalBadgeStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: '0.06em',
  color: 'var(--ink-muted)',
  background: 'var(--paper-surface-elevated)',
  border: '1px solid var(--rule)',
  borderRadius: 999,
  padding: '2px 10px',
  whiteSpace: 'nowrap',
}
