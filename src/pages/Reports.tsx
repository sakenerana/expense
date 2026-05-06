import { SearchOutlined } from '@ant-design/icons'
import { Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

type ReportStatus = 'Completed' | 'Pending' | 'Failed'

type ReportItem = {
  key: string
  name: string
  date: string
  status: ReportStatus
  amount: number
}

const allReports: ReportItem[] = [
  { key: '1', name: 'Q1 Finance Summary', date: '2026-04-02', status: 'Completed', amount: 24500 },
  { key: '2', name: 'Sales Performance', date: '2026-04-10', status: 'Pending', amount: 18600 },
  { key: '3', name: 'User Growth Metrics', date: '2026-04-15', status: 'Completed', amount: 12300 },
  { key: '4', name: 'Marketing ROI', date: '2026-04-18', status: 'Failed', amount: 7600 },
  { key: '5', name: 'Regional Revenue', date: '2026-04-22', status: 'Completed', amount: 29400 },
  { key: '6', name: 'Operational Costs', date: '2026-04-30', status: 'Pending', amount: 9800 },
  { key: '7', name: 'Forecast Snapshot', date: '2026-05-01', status: 'Completed', amount: 15100 },
]

const statusColors: Record<ReportStatus, string> = {
  Completed: 'green',
  Pending: 'gold',
  Failed: 'red',
}

function Reports() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReportStatus | 'All'>('All')

  const filteredData = useMemo(() => {
    return allReports.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'All' || item.status === status
      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const columns: ColumnsType<ReportItem> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: ReportStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
  ]

  return (
    <div className="sheet-page space-y-5">
      <div className="flex items-center justify-between border-b border-[#d8e4df] pb-4">
        <div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
            Workbook / Reports
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Reports
          </Typography.Title>
        </div>
        <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
          Total Records: {allReports.length}
        </div>
      </div>

      <div className="sheet-card p-4">
        <Space wrap className="mb-4">
          <Input
            placeholder="Search report name"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            className="w-[260px]"
          />
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Failed', value: 'Failed' },
            ]}
            className="w-[180px]"
          />
        </Space>

        <Table<ReportItem>
          className="grid-table"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
        />
      </div>
    </div>
  )
}

export default Reports

