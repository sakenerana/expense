import { EditOutlined, EyeOutlined, FilePdfOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityViewModal from '../components/EntityViewModal'
import { exportTableToPdf } from '../services/pdfExportService'
import {
  fetchExpenseTypes,
  type ExpenseStatus,
  type ExpenseTypeItem,
} from '../services/expenseTypesService'

const statusColors: Record<ExpenseStatus, string> = {
  Active: 'green',
  Inactive: 'default',
}

function ExpenseType() {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseTypeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ExpenseStatus | 'All'>('All')
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseTypeItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadExpenseTypes = async () => {
      setLoading(true)
      try {
        const data = await fetchExpenseTypes()
        setExpenseTypes(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load expense types.'
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    void loadExpenseTypes()
  }, [])

  const filteredData = useMemo(() => {
    return expenseTypes.filter((item) => {
      const searchableText = [item.code, item.name, item.glAccount]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(search.toLowerCase())
      const matchesStatus = status === 'All' || item.status === status

      return matchesSearch && matchesStatus
    })
  }, [expenseTypes, search, status])

  const columns: ColumnsType<ExpenseTypeItem> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 105 },
    { title: 'Expense Type', dataIndex: 'name', key: 'name', ellipsis: true, width: 175 },
    { title: 'GL Account', dataIndex: 'glAccount', key: 'glAccount', ellipsis: true, width: 155 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 95,
      render: (value: ExpenseStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 105,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="View">
            <Button
              className='text-blue-700'
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedExpenseType(record)
                setViewOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button className='text-orange-700' type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/expense-type/edit/${record.key}`, { state: { record } })} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleExportPdf = () => {
    exportTableToPdf({
      filename: 'expense-type-report.pdf',
      title: 'Expense Type Report',
      columns: [
        { key: 'code', title: 'Code' },
        { key: 'name', title: 'Expense Type' },
        { key: 'glAccount', title: 'GL Account' },
        { key: 'status', title: 'Status' },
      ],
      rows: filteredData,
    })
  }

  return (
    <div className="sheet-page space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
        <div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
            Workbook / Expense Type
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Expense Type List
          </Typography.Title>
        </div>
        <div className="flex items-center gap-3">
          <Button danger icon={<FilePdfOutlined />} onClick={handleExportPdf} className="!rounded-md">
            Export PDF
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/expense-type/new')}
            className="!rounded-md"
          >
            Add Expense Type
          </Button>
          <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
            Total Records: {expenseTypes.length}
          </div>
        </div>
      </div>

      <div className="sheet-card p-4">
        <Space wrap className="mb-4">
          <Input
            placeholder="Search expense type"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            className="w-[280px]"
          />
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            className="w-[180px]"
          />
        </Space>

        <Table<ExpenseTypeItem>
          className="grid-table"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 850 }}
        />
      </div>

      <EntityViewModal<ExpenseTypeItem>
        open={viewOpen}
        title="Expense Type Details"
        record={selectedExpenseType}
        onClose={() => setViewOpen(false)}
        fields={[
          { key: 'code', label: 'Code' },
          { key: 'name', label: 'Expense Type' },
          { key: 'glAccount', label: 'GL Account' },
          {
            key: 'status',
            label: 'Status',
            render: (value) => <Tag color={value === 'Active' ? 'green' : 'default'}>{String(value)}</Tag>,
          },
        ]}
      />
    </div>
  )
}

export default ExpenseType
