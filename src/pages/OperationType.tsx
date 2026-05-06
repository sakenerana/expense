import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

type OperationStatus = 'Active' | 'Inactive'

type OperationTypeItem = {
  key: string
  code: string
  name: string
  description: string
  owner: string
  status: OperationStatus
  updatedAt: string
}

const operationTypes: OperationTypeItem[] = [
  {
    key: '1',
    code: 'OPS-001',
    name: 'Purchase Request',
    description: 'Request for goods or services before procurement.',
    owner: 'Procurement',
    status: 'Active',
    updatedAt: '2026-04-12',
  },
  {
    key: '2',
    code: 'OPS-002',
    name: 'Reimbursement',
    description: 'Employee reimbursement for approved expenses.',
    owner: 'Finance',
    status: 'Active',
    updatedAt: '2026-04-18',
  },
  {
    key: '3',
    code: 'OPS-003',
    name: 'Vendor Payment',
    description: 'Payment processing for supplier invoices.',
    owner: 'Accounts Payable',
    status: 'Active',
    updatedAt: '2026-04-25',
  },
  {
    key: '4',
    code: 'OPS-004',
    name: 'Cash Advance',
    description: 'Advance funds issued before business activity.',
    owner: 'Treasury',
    status: 'Inactive',
    updatedAt: '2026-03-29',
  },
  {
    key: '5',
    code: 'OPS-005',
    name: 'Budget Transfer',
    description: 'Transfer available budget between cost centers.',
    owner: 'Budget Control',
    status: 'Active',
    updatedAt: '2026-05-01',
  },
]

const statusColors: Record<OperationStatus, string> = {
  Active: 'green',
  Inactive: 'default',
}

function OperationType() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OperationStatus | 'All'>('All')

  const filteredData = useMemo(() => {
    return operationTypes.filter((item) => {
      const searchableText = [item.code, item.name, item.description, item.owner]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(search.toLowerCase())
      const matchesStatus = status === 'All' || item.status === status

      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const columns: ColumnsType<OperationTypeItem> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 105 },
    { title: 'Operation Type', dataIndex: 'name', key: 'name', ellipsis: true, width: 175 },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', ellipsis: true, width: 145 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 95,
      render: (value: OperationStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    { title: 'Updated', dataIndex: 'updatedAt', key: 'updatedAt', width: 115 },
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
          <Popconfirm title="Delete operation type?" okText="Delete" cancelText="Cancel">
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
            Workbook / Operation Type
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Operation Type List
          </Typography.Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Operation Type
        </Button>
      </div>

      <div className="sheet-card p-4">
        <Space wrap className="mb-4">
          <Input
            placeholder="Search operation type"
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

        <Table<OperationTypeItem>
          className="grid-table"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  )
}

export default OperationType
