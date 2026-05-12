import { EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityViewModal from '../components/EntityViewModal'
import { supabase, supabaseSession } from '../lib/supabase'
import { fetchDisbursements, type DisbursementItem, type RequestStatus } from '../services/disbursementsService'

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

const header = (label: string, className = '') => (
  <span className={`disbursement-header-label ${className}`}>{label}</span>
)

const toHref = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '-') return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function Disbursement() {
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RequestStatus | 'All'>('All')
  const [selectedDisbursement, setSelectedDisbursement] = useState<DisbursementItem | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('User')
  const navigate = useNavigate()

  useEffect(() => {
    const loadRole = async () => {
      const [{ data: localUserData }, { data: sessionUserData }] = await Promise.all([
        supabase.auth.getUser(),
        supabaseSession.auth.getUser(),
      ])

      const userId = localUserData.user?.id ?? sessionUserData.user?.id
      if (!userId) {
        setUserRole('User')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('user_uuid', userId)
        .maybeSingle()

      setUserRole(data?.role ? String(data.role) : 'User')
    }

    void loadRole()
  }, [])

  useEffect(() => {
    const loadDisbursements = async () => {
      setLoading(true)
      try {
        const data = await fetchDisbursements()
        setDisbursements(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load disbursements.'
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    void loadDisbursements()
  }, [])

  const filteredData = useMemo(() => {
    return disbursements.filter((item) => {
      const searchableText = [
        item.particulars,
        item.operationType,
        item.designation,
        item.typeOfExpense,
        item.tinNumber,
        item.supplier,
        item.referenceNo,
        item.requestTitle,
        item.referenceNumber,
        item.remarks,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(search.toLowerCase())
      const matchesStatus = status === 'All' || item.requestStatus === status

      return matchesSearch && matchesStatus
    })
  }, [disbursements, search, status])

  const columns: ColumnsType<DisbursementItem> = [
    {
      title: header('Date Processed'),
      dataIndex: 'dateProcessed',
      key: 'dateProcessed',
      width: 180,
      render: (value: string) => formatLongDate(value),
      sorter: (a, b) => new Date(a.dateProcessed).getTime() - new Date(b.dateProcessed).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: header('Request Date'),
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 180,
      render: (value: string) => formatLongDate(value),
      sorter: (a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
    },
    {
      title: header('Applicable month'),
      dataIndex: 'applicableMonth',
      key: 'applicableMonth',
      width: 180,
      render: (value: string) => formatLongDate(value),
    },
    { title: header('Particulars'), dataIndex: 'particulars', key: 'particulars', ellipsis: true, width: 280 },
    { title: header('Operation Type'), dataIndex: 'operationType', key: 'operationType', ellipsis: true, width: 155 },
    { title: header('Designation'), dataIndex: 'designation', key: 'designation', ellipsis: true, width: 135 },
    { title: header('Type of Expense'), dataIndex: 'typeOfExpense', key: 'typeOfExpense', ellipsis: true, width: 170 },
    { title: header('TIN number'), dataIndex: 'tinNumber', key: 'tinNumber', width: 130 },
    { title: header('SUPPLIER'), dataIndex: 'supplier', key: 'supplier', ellipsis: true, width: 220 },
    {
      title: header('Date'),
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (value: string) => formatLongDate(value),
    },
    { title: header('Source Document'), dataIndex: 'sourceDocument', key: 'sourceDocument', width: 150 },
    { title: header('Reference No'), dataIndex: 'referenceNo', key: 'referenceNo', width: 135 },
    { title: header('Vat or Nonvat Vat Exempt'), dataIndex: 'vatType', key: 'vatType', width: 175 },
    {
      title: header('Amount Requested/Act Expensed'),
      dataIndex: 'amountRequested',
      key: 'amountRequested',
      align: 'right',
      width: 190,
      render: money,
      sorter: (a, b) => a.amountRequested - b.amountRequested,
    },
    {
      title: header('Vat Amount(12%)'),
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      align: 'right',
      width: 145,
      render: money,
      sorter: (a, b) => a.vatAmount - b.vatAmount,
    },
    {
      title: header('Net Amount'),
      dataIndex: 'netAmount',
      key: 'netAmount',
      align: 'right',
      width: 135,
      render: money,
      sorter: (a, b) => a.netAmount - b.netAmount,
    },
    { title: header('GJ - Disbursement'), dataIndex: 'gjDisbursement', key: 'gjDisbursement', width: 155 },
    { title: header('GJ - Liquidation'), dataIndex: 'gjLiquidation', key: 'gjLiquidation', width: 145 },
    {
      title: header('AB Link - Request'),
      dataIndex: 'abLinkRequest',
      key: 'abLinkRequest',
      width: 150,
      render: (value: string) => {
        const href = toHref(value)
        if (!href) return value
        return (
          <a href={href} target="_blank" rel="noreferrer">
            {value}
          </a>
        )
      },
    },
    {
      title: header('AB Link - Liquidation'),
      dataIndex: 'abLinkLiquidation',
      key: 'abLinkLiquidation',
      width: 165,
      render: (value: string) => {
        const href = toHref(value)
        if (!href) return value
        return (
          <a href={href} target="_blank" rel="noreferrer">
            {value}
          </a>
        )
      },
    },
    { title: header('Request Title'), dataIndex: 'requestTitle', key: 'requestTitle', ellipsis: true, width: 185 },
    {
      title: header('Request Status'),
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      width: 140,
      render: (value: RequestStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    {
      title: header('Date Paid'),
      dataIndex: 'datePaid',
      key: 'datePaid',
      width: 180,
      render: (value: string) => formatLongDate(value),
    },
    { title: header('Reference Number'), dataIndex: 'referenceNumber', key: 'referenceNumber', width: 150 },
    {
      title: header('Remarks', 'remarks-header'),
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
      width: 180,
      className: 'remarks-column',
    },
    {
      title: header('Actions'),
      key: 'actions',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="View">
            <Button
              className='text-blue-700'
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedDisbursement(record)
                setViewOpen(true)
              }}
            />
          </Tooltip>
          {userRole.toLowerCase() !== 'viewer' && (
            <Tooltip title="Edit">
              <Button className='text-orange-700' type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/disbursement/edit/${record.key}`, { state: { record } })} />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  const visibleColumns = useMemo(() => {
    return columns
  }, [columns, userRole])

  return (
    <div className="sheet-page space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
        <div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
            Workbook / Disbursement
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Disbursement Register
          </Typography.Title>
        </div>
        <div className="flex items-center gap-3">
          {userRole.toLowerCase() !== 'viewer' && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/disbursement/new')}
              className="!rounded-md"
            >
              Add Disbursement
            </Button>
          )}
          <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
            Total Records: {disbursements.length}
          </div>
        </div>
      </div>

      <div className="sheet-card p-4">
        <Space wrap className="mb-4">
          <Input
            placeholder="Search disbursement"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            className="w-[300px]"
          />
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Processed', value: 'Processed' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Paid', value: 'Paid' },
              { label: 'For Liquidation', value: 'For Liquidation' },
            ]}
            className="w-[190px]"
          />
        </Space>

        <Table<DisbursementItem>
          className="grid-table disbursement-table"
          columns={visibleColumns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 3700 }}
        />
      </div>

      <EntityViewModal<DisbursementItem>
        open={viewOpen}
        title="Disbursement Details"
        record={selectedDisbursement}
        columns={2}
        onClose={() => setViewOpen(false)}
        fields={[
          { key: 'dateProcessed', label: 'Date Processed', render: (value) => formatLongDate(String(value ?? '')) },
          { key: 'requestDate', label: 'Request Date', render: (value) => formatLongDate(String(value ?? '')) },
          { key: 'applicableMonth', label: 'Applicable Month', render: (value) => formatLongDate(String(value ?? '')) },
          { key: 'particulars', label: 'Particulars' },
          { key: 'operationType', label: 'Operation Type' },
          { key: 'designation', label: 'Designation' },
          { key: 'typeOfExpense', label: 'Type of Expense' },
          { key: 'tinNumber', label: 'TIN Number' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'date', label: 'Date (Source Document)', render: (value) => formatLongDate(String(value ?? '')) },
          { key: 'sourceDocument', label: 'Source Document' },
          { key: 'referenceNo', label: 'Reference No (Source Document)' },
          { key: 'vatType', label: 'VAT Type' },
          { key: 'requestTitle', label: 'Request Title' },
          { key: 'amountRequested', label: 'Amount Requested', render: (value) => typeof value === 'number' ? money(value) : String(value) },
          { key: 'vatAmount', label: 'VAT Amount', render: (value) => typeof value === 'number' ? money(value) : String(value) },
          { key: 'netAmount', label: 'Net Amount', render: (value) => typeof value === 'number' ? money(value) : String(value) },
          { key: 'referenceNumber', label: 'Reference Number' },
          { key: 'gjDisbursement', label: 'GJ - Disbursement' },
          { key: 'gjLiquidation', label: 'GJ - Liquidation' },
          {
            key: 'abLinkRequest',
            label: 'AB Link - Request',
            render: (value) => {
              const text = String(value ?? '')
              const href = toHref(text)
              if (!href) return text || '-'
              return <a href={href} target="_blank" rel="noreferrer">{text}</a>
            },
          },
          {
            key: 'abLinkLiquidation',
            label: 'AB Link - Liquidation',
            render: (value) => {
              const text = String(value ?? '')
              const href = toHref(text)
              if (!href) return text || '-'
              return <a href={href} target="_blank" rel="noreferrer">{text}</a>
            },
          },
          {
            key: 'requestStatus',
            label: 'Request Status',
            render: (value) => {
              const statusValue = String(value) as RequestStatus
              return <Tag color={statusColors[statusValue]}>{statusValue}</Tag>
            },
          },
          { key: 'datePaid', label: 'Date Paid', render: (value) => formatLongDate(String(value ?? '')) },
          { key: 'remarks', label: 'Remarks' },
        ]}
      />
    </div>
  )
}

export default Disbursement


