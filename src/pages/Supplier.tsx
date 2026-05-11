import { EditOutlined, EyeOutlined, FilePdfOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityViewModal from '../components/EntityViewModal'
import { exportTableToPdf } from '../services/pdfExportService'
import { fetchSuppliers, type SupplierItem, type SupplierStatus } from '../services/suppliersService'

const statusColors: Record<SupplierStatus, string> = {
  Active: 'green',
  Pending: 'gold',
  Inactive: 'default',
}

function Supplier() {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SupplierStatus | 'All'>('All')
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadSuppliers = async () => {
      setLoading(true)
      try {
        const data = await fetchSuppliers()
        setSuppliers(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load suppliers.'
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    void loadSuppliers()
  }, [])

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
  }, [suppliers, search, status])

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
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="View">
            <Button
              className='text-blue-700'
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedSupplier(record)
                setViewOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button className='text-orange-700' type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/supplier/edit/${record.key}`, { state: { record } })} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleExportPdf = () => {
    exportTableToPdf({
      filename: 'supplier-report.pdf',
      title: 'Supplier Report',
      columns: [
        { key: 'supplierCode', title: 'Code' },
        { key: 'supplierName', title: 'Supplier Name' },
        { key: 'contactPerson', title: 'Contact' },
        { key: 'category', title: 'Category' },
        { key: 'email', title: 'Email' },
        { key: 'phone', title: 'Phone' },
        { key: 'status', title: 'Status' },
      ],
      rows: filteredSuppliers,
    })
  }

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
        <div className="flex items-center gap-3">
          <Button danger icon={<FilePdfOutlined />} onClick={handleExportPdf} className="!rounded-md">
            Export PDF
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/supplier/new')}
            className="!rounded-md"
          >
            Add Supplier
          </Button>
          <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
            Total Records: {suppliers.length}
          </div>
        </div>
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
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 980 }}
        />
      </div>

      <EntityViewModal<SupplierItem>
        open={viewOpen}
        title="Supplier Details"
        record={selectedSupplier}
        onClose={() => setViewOpen(false)}
        fields={[
          { key: 'supplierCode', label: 'Code' },
          { key: 'supplierName', label: 'Supplier Name' },
          { key: 'contactPerson', label: 'Contact Person' },
          { key: 'category', label: 'Category' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          {
            key: 'status',
            label: 'Status',
            render: (value) => (
              <Tag color={value === 'Active' ? 'green' : value === 'Pending' ? 'gold' : 'default'}>
                {String(value)}
              </Tag>
            ),
          },
        ]}
      />
    </div>
  )
}

export default Supplier


