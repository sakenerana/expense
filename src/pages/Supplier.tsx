import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

type SupplierStatus = 'Active' | 'Pending' | 'Inactive'

type SupplierItem = {
  key: string
  supplierCode: string
  supplierName: string
  contactPerson: string
  category: string
  email: string
  phone: string
  status: SupplierStatus
}

const suppliers: SupplierItem[] = [
  {
    key: '1',
    supplierCode: 'SUP-001',
    supplierName: 'Northline Office Supply',
    contactPerson: 'Maria Santos',
    category: 'Office Supplies',
    email: 'maria@northline.example',
    phone: '(213) 555-0182',
    status: 'Active',
  },
  {
    key: '2',
    supplierCode: 'SUP-002',
    supplierName: 'Brightway Logistics',
    contactPerson: 'James Cooper',
    category: 'Logistics',
    email: 'james@brightway.example',
    phone: '(415) 555-0148',
    status: 'Active',
  },
  {
    key: '3',
    supplierCode: 'SUP-003',
    supplierName: 'Metro Maintenance Group',
    contactPerson: 'Lena Cruz',
    category: 'Maintenance',
    email: 'lena@metromaintenance.example',
    phone: '(646) 555-0175',
    status: 'Pending',
  },
  {
    key: '4',
    supplierCode: 'SUP-004',
    supplierName: 'Summit IT Services',
    contactPerson: 'Andre Wilson',
    category: 'Technology',
    email: 'andre@summitit.example',
    phone: '(312) 555-0199',
    status: 'Active',
  },
  {
    key: '5',
    supplierCode: 'SUP-005',
    supplierName: 'Freshfield Catering',
    contactPerson: 'Nina Park',
    category: 'Food Services',
    email: 'nina@freshfield.example',
    phone: '(702) 555-0134',
    status: 'Inactive',
  },
  {
    key: '6',
    supplierCode: 'SUP-006',
    supplierName: 'Harbor Safety Equipment',
    contactPerson: 'Evan Brooks',
    category: 'Safety',
    email: 'evan@harborsafety.example',
    phone: '(503) 555-0121',
    status: 'Pending',
  },
]

const statusColors: Record<SupplierStatus, string> = {
  Active: 'green',
  Pending: 'gold',
  Inactive: 'default',
}

function Supplier() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SupplierStatus | 'All'>('All')

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const searchableText = [
        supplier.supplierCode,
        supplier.supplierName,
        supplier.contactPerson,
        supplier.category,
        supplier.email,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(search.toLowerCase())
      const matchesStatus = status === 'All' || supplier.status === status

      return matchesSearch && matchesStatus
    })
  }, [search, status])

  const columns: ColumnsType<SupplierItem> = [
    { title: 'Code', dataIndex: 'supplierCode', key: 'supplierCode', width: 105 },
    { title: 'Supplier Name', dataIndex: 'supplierName', key: 'supplierName', ellipsis: true, width: 190 },
    { title: 'Contact', dataIndex: 'contactPerson', key: 'contactPerson', ellipsis: true, width: 150 },
    { title: 'Category', dataIndex: 'category', key: 'category', ellipsis: true, width: 145 },
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true, width: 210 },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 135 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 95,
      render: (value: SupplierStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
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
          <Popconfirm title="Delete supplier?" okText="Delete" cancelText="Cancel">
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
            Workbook / Supplier
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Supplier List
          </Typography.Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Supplier
        </Button>
      </div>

      <div className="sheet-card p-4">
        <Space wrap className="mb-4">
          <Input
            placeholder="Search supplier"
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
              { label: 'Pending', value: 'Pending' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            className="w-[180px]"
          />
        </Space>

        <Table<SupplierItem>
          className="grid-table"
          columns={columns}
          dataSource={filteredSuppliers}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 980 }}
        />
      </div>
    </div>
  )
}

export default Supplier
