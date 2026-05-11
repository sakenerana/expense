import { EditOutlined, EyeOutlined, FilePdfOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityViewModal from '../components/EntityViewModal'
import { exportTableToPdf } from '../services/pdfExportService'
import {
  fetchOperationTypes,
  type OperationStatus,
  type OperationTypeItem,
} from '../services/operationTypesService'

const statusColors: Record<OperationStatus, string> = {
  Active: 'green',
  Inactive: 'default',
}

function OperationType() {
  const [operationTypes, setOperationTypes] = useState<OperationTypeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OperationStatus | 'All'>('All')
  const [selectedOperationType, setSelectedOperationType] = useState<OperationTypeItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadOperationTypes = async () => {
      setLoading(true)
      try {
        const data = await fetchOperationTypes()
        setOperationTypes(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load operation types.'
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    void loadOperationTypes()
  }, [])

  const filteredData = useMemo(() => {
    return operationTypes.filter((item) => {
      const searchableText = [item.code, item.name, item.description]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(search.toLowerCase())
      const matchesStatus = status === 'All' || item.status === status

      return matchesSearch && matchesStatus
    })
  }, [operationTypes, search, status])

  const columns: ColumnsType<OperationTypeItem> = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 105 },
    { title: 'Operation Type', dataIndex: 'name', key: 'name', ellipsis: true, width: 175 },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 95,
      render: (value: OperationStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
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
                setSelectedOperationType(record)
                setViewOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button className='text-orange-700' type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/operation-type/edit/${record.key}`, { state: { record } })} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleExportPdf = () => {
    exportTableToPdf({
      filename: 'operation-type-report.pdf',
      title: 'Operation Type Report',
      columns: [
        { key: 'code', title: 'Code' },
        { key: 'name', title: 'Operation Type' },
        { key: 'description', title: 'Description' },
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
            Workbook / Operation Type
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Operation Type List
          </Typography.Title>
        </div>
        <div className="flex items-center gap-3">
          <Button danger icon={<FilePdfOutlined />} onClick={handleExportPdf} className="!rounded-md">
            Export PDF
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/operation-type/new')}
            className="!rounded-md"
          >
            Add Operation Type
          </Button>
          <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
            Total Records: {operationTypes.length}
          </div>
        </div>
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
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 900 }}
        />
      </div>

      <EntityViewModal<OperationTypeItem>
        open={viewOpen}
        title="Operation Type Details"
        record={selectedOperationType}
        onClose={() => setViewOpen(false)}
        fields={[
          { key: 'code', label: 'Code' },
          { key: 'name', label: 'Operation Type' },
          { key: 'description', label: 'Description' },
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

export default OperationType


