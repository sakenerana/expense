import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import { fetchDisbursements, type DisbursementItem, type RequestStatus } from '../services/disbursementsService'

type ActivityItem = {
  key: string
  particulars: string
  requestDate: string
  supplier: string
  amountRequested: number
  requestStatus: RequestStatus
}

const statusColors: Record<RequestStatus, string> = {
  Processed: 'blue',
  Pending: 'gold',
  Paid: 'green',
  'For Liquidation': 'purple',
}

const money = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

const longDate = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const formatLongDate = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '-') return '-'
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return value
  return longDate.format(parsed)
}

function Dashboard() {
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>([])
  const [loading, setLoading] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const loadDisbursements = async () => {
      setLoading(true)
      try {
        const data = await fetchDisbursements()
        setDisbursements(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data.'
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    void loadDisbursements()
  }, [])

  const currentYearDisbursements = useMemo(() => {
    return disbursements.filter((item) => {
      const basis = item.requestDate && item.requestDate !== '-' ? item.requestDate : item.dateProcessed
      if (!basis || basis === '-') return false
      const parsed = new Date(basis)
      if (Number.isNaN(parsed.getTime())) return false
      return parsed.getFullYear() === currentYear
    })
  }, [currentYear, disbursements])

  const summary = useMemo(() => {
    const totalAmount = currentYearDisbursements.reduce((sum, row) => sum + row.amountRequested, 0)
    const paidCount = currentYearDisbursements.filter((row) => row.requestStatus === 'Paid').length
    const pendingCount = currentYearDisbursements.filter((row) => row.requestStatus === 'Pending').length
    const processedCount = currentYearDisbursements.filter((row) => row.requestStatus === 'Processed').length
    const forLiquidationCount = currentYearDisbursements.filter((row) => row.requestStatus === 'For Liquidation').length

    return {
      totalRecords: currentYearDisbursements.length,
      totalAmount,
      paidCount,
      pendingCount,
      processedCount,
      forLiquidationCount,
    }
  }, [currentYearDisbursements])

  const trendData = useMemo(() => {
    const grouped = new Map<string, number>()
    for (const item of currentYearDisbursements) {
      const key = item.requestDate && item.requestDate !== '-' ? item.requestDate : item.dateProcessed
      if (!key || key === '-') continue
      grouped.set(key, (grouped.get(key) ?? 0) + item.amountRequested)
    }

    return Array.from(grouped.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10)
  }, [currentYearDisbursements])

  const lineChart = useMemo(() => {
    if (trendData.length === 0) return null

    const width = 700
    const height = 180
    const padLeft = 52
    const padRight = 20
    const padTop = 14
    const padBottom = 28
    const plotWidth = width - padLeft - padRight
    const plotHeight = height - padTop - padBottom

    const maxY = Math.max(...trendData.map((d) => d.amount), 1)
    const minY = 0

    const points = trendData.map((d, idx) => {
      const x = padLeft + (idx / Math.max(trendData.length - 1, 1)) * plotWidth
      const y = padTop + (1 - (d.amount - minY) / (maxY - minY || 1)) * plotHeight
      return { ...d, x, y }
    })

    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotHeight} L ${points[0].x} ${padTop + plotHeight} Z`

    const yTicks = 4
    const yAxis = Array.from({ length: yTicks + 1 }).map((_, idx) => {
      const value = (maxY / yTicks) * (yTicks - idx)
      const y = padTop + (idx / yTicks) * plotHeight
      return { value, y }
    })

    return { width, height, padLeft, padRight, padTop, padBottom, points, linePath, areaPath, yAxis }
  }, [trendData])

  const activityData = useMemo<ActivityItem[]>(() => {
    return currentYearDisbursements.slice(0, 8).map((item) => ({
      key: item.key,
      particulars: item.particulars,
      requestDate: item.requestDate,
      supplier: item.supplier,
      amountRequested: item.amountRequested,
      requestStatus: item.requestStatus,
    }))
  }, [currentYearDisbursements])

  const activityColumns: ColumnsType<ActivityItem> = [
    { title: 'Particulars', dataIndex: 'particulars', key: 'particulars', ellipsis: true },
    { title: 'Request Date', dataIndex: 'requestDate', key: 'requestDate', width: 170, render: (value: string) => formatLongDate(value) },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', ellipsis: true, width: 180 },
    { title: 'Amount', dataIndex: 'amountRequested', key: 'amountRequested', width: 140, align: 'right', render: (value: number) => money(value) },
    {
      title: 'Status',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      width: 155,
      render: (value: RequestStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
  ]

  return (
    <div className="sheet-page space-y-5">
      <div className="flex items-center justify-between border-b border-[#d8e4df] pb-4">
        <div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
            Workbook / Dashboard
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Disbursement Overview ({currentYear})
          </Typography.Title>
        </div>
        <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
          Total Records: {summary.totalRecords}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Disbursements" value={summary.totalRecords} icon={<FileDoneOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Amount Requested" value={money(summary.totalAmount)} icon={<WalletOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Paid Requests" value={summary.paidCount} icon={<CheckCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Pending Requests" value={summary.pendingCount} icon={<ClockCircleOutlined />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Disbursement Trend (Amount by Date)" className="sheet-card h-full">
            {lineChart ? (
              <div className="w-full overflow-x-auto">
                <svg viewBox={`0 0 ${lineChart.width} ${lineChart.height}`} className="min-w-[680px] max-h-[190px]">
                  {lineChart.yAxis.map((tick) => (
                    <g key={`y-${tick.y}`}>
                      <line
                        x1={lineChart.padLeft}
                        y1={tick.y}
                        x2={lineChart.width - lineChart.padRight}
                        y2={tick.y}
                        stroke="#e5e7eb"
                        strokeDasharray="3 4"
                      />
                      <text x={8} y={tick.y + 4} fontSize="11" fill="#64748b">
                        {money(tick.value)}
                      </text>
                    </g>
                  ))}

                  <path d={lineChart.areaPath} fill="rgba(37,99,235,0.12)" />
                  <path d={lineChart.linePath} fill="none" stroke="#2563eb" strokeWidth="3" />

                  {lineChart.points.map((point) => (
                    <g key={point.date}>
                      <circle cx={point.x} cy={point.y} r="4" fill="#2563eb" />
                      <text x={point.x} y={lineChart.height - 8} fontSize="9" textAnchor="middle" fill="#64748b">
                        {formatLongDate(point.date)}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            ) : (
              <Typography.Text className="text-[#64748b]">No date-based disbursement data yet.</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Recent Disbursement Activity" className="sheet-card h-full">
            <Table<ActivityItem>
              className="grid-table"
              columns={activityColumns}
              dataSource={activityData}
              loading={loading}
              size="small"
              pagination={{ pageSize: 6, showSizeChanger: false }}
              scroll={{ x: 'max-content' }}
              bordered
              rowKey="key"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
