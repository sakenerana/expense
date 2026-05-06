import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

type ExpenseStatus = 'Active' | 'Inactive'

type ExpenseTypeItem = {
  key: string
  code: string
  name: string
  category: string
  glAccount: string
  taxable: 'Yes' | 'No'
  status: ExpenseStatus
}

const expenseTypes: ExpenseTypeItem[] = [
  {
    key: '1',
    code: 'EXP-001',
    name: 'Travel',
    category: 'Employee Expense',
    glAccount: '6100-Travel',
    taxable: 'No',
    status: 'Active',
  },
  {
    key: '2',
    code: 'EXP-002',
    name: 'Meals',
    category: 'Employee Expense',
    glAccount: '6120-Meals',
    taxable: 'No',
    status: 'Active',
  },
  {
    key: '3',
    code: 'EXP-003',
    name: 'Office Supplies',
    category: 'Operating Expense',
    glAccount: '6200-Supplies',
    taxable: 'Yes',
    status: 'Active',
  },
  {
    key: '4',
    code: 'EXP-004',
    name: 'Software Subscription',
    category: 'Technology',
    glAccount: '6400-Software',
    taxable: 'Yes',
    status: 'Active',
  },
  {
    key: '5',
    code: 'EXP-005',
    name: 'Training',
    category: 'People Operations',
    glAccount: '6300-Training',
    taxable: 'No',
    status: 'Inactive',
  },
  {
    key: '6',
    code: 'EXP-006',
    name: 'Utilities',
    category: 'Facilities',
    glAccount: '6500-Utilities',
    taxable: 'Yes',
    status: 'Active',
  },
]

const statusColors: Record<ExpenseStatus, string> = {
  Active: 'green',
  Inactive: 'default',
}

function ExpenseType() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ExpenseStatus | 'All'>('All')

  const filteredData = useMemo(() => {
    return expenseTypes.filter((item) => {
      const searchableText = [item.code, item.name, item.category, item.glAccount]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(search.toLowerCase())
      const matchesStatus = status === 'All' || item.status === status

      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const columns: ColumnsType<ExpenseTypeItem> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 105 },
    { title: 'Expense Type', dataIndex: 'name', key: 'name', ellipsis: true, width: 175 },
    { title: 'Category', dataIndex: 'category', key: 'category', ellipsis: true, width: 165 },
    { title: 'GL Account', dataIndex: 'glAccount', key: 'glAccount', ellipsis: true, width: 155 },
    {
      title: 'Taxable',
      dataIndex: 'taxable',
      key: 'taxable',
      width: 90,
      render: (value: ExpenseTypeItem['taxable']) => (
        <Tag color={value === 'Yes' ? 'blue' : 'default'}>{value}</Tag>
      ),
    },
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
      render: () => (
        <Space size={4}>
          <Tooltip title="View">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Popconfirm title="Delete expense type?" okText="Delete" cancelText="Cancel">
            <Tooltip title="Delete">
              <Button danger type="text" size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

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
        <Button type="primary" icon={<PlusOutlined />}>
          Add Expense Type
        </Button>
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
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 850 }}
        />
      </div>
    </div>
  )
}

export default ExpenseType
