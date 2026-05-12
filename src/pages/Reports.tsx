import { FilePdfOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, DatePicker, Input, Select, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { exportTableToPdf } from '../services/pdfExportService'
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

const parseSafeDay = (value: string) => {
  if (!value || value === '-') return null
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.startOf('day') : null
}

function Reports() {
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RequestStatus | 'All'>('All')
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ])

  useEffect(() => {
    const loadDisbursements = async () => {
      setLoading(true)
      try {
        const data = await fetchDisbursements()
        setDisbursements(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load reports data.'
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    void loadDisbursements()
  }, [])

  const filteredData = useMemo(() => {
    const [from, to] = dateRange ?? [null, null]
    return disbursements.filter((item) => {
      const searchableText = [
        item.requestTitle,
        item.particulars,
        item.operationType,
        item.designation,
        item.typeOfExpense,
        item.supplier,
        item.referenceNo,
        item.remarks,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchableText.includes(search.toLowerCase())
      const matchesStatus = status === 'All' || item.requestStatus === status

      const basisDate = parseSafeDay(item.requestDate) ?? parseSafeDay(item.dateProcessed)
      const matchesDateFrom = !from || (basisDate ? !basisDate.isBefore(from.startOf('day')) : false)
      const matchesDateTo = !to || (basisDate ? !basisDate.isAfter(to.endOf('day')) : false)

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [dateRange, disbursements, search, status])

  const columns: ColumnsType<DisbursementItem> = [
    { title: 'Date Processed', dataIndex: 'dateProcessed', key: 'dateProcessed', width: 170, render: (value: string) => formatLongDate(value) },
    { title: 'Request Date', dataIndex: 'requestDate', key: 'requestDate', width: 160, render: (value: string) => formatLongDate(value) },
    { title: 'Applicable Month', dataIndex: 'applicableMonth', key: 'applicableMonth', width: 170, render: (value: string) => formatLongDate(value) },
    { title: 'Particulars', dataIndex: 'particulars', key: 'particulars', ellipsis: true, width: 240 },
    { title: 'Operation Type', dataIndex: 'operationType', key: 'operationType', ellipsis: true, width: 145 },
    { title: 'Designation', dataIndex: 'designation', key: 'designation', width: 130 },
    { title: 'Type of Expense', dataIndex: 'typeOfExpense', key: 'typeOfExpense', width: 160 },
    { title: 'TIN Number', dataIndex: 'tinNumber', key: 'tinNumber', width: 130 },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', ellipsis: true, width: 180 },
    { title: 'Source Document', dataIndex: 'sourceDocument', key: 'sourceDocument', width: 145 },
    { title: 'Ref No (Doc)', dataIndex: 'referenceNo', key: 'referenceNo', width: 140 },
    { title: 'VAT Type', dataIndex: 'vatType', key: 'vatType', width: 120 },
    { title: 'Amount Requested', dataIndex: 'amountRequested', key: 'amountRequested', width: 160, align: 'right', render: money },
    { title: 'VAT Amount', dataIndex: 'vatAmount', key: 'vatAmount', width: 140, align: 'right', render: money },
    { title: 'Net Amount', dataIndex: 'netAmount', key: 'netAmount', width: 140, align: 'right', render: money },
    { title: 'Request Title', dataIndex: 'requestTitle', key: 'requestTitle', ellipsis: true, width: 170 },
    {
      title: 'Request Status',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      width: 140,
      render: (value: RequestStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    { title: 'Date Paid', dataIndex: 'datePaid', key: 'datePaid', width: 160, render: (value: string) => formatLongDate(value) },
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks', ellipsis: true, width: 220 },
  ]

  const handleExportPdf = () => {
    exportTableToPdf({
      filename: 'disbursement-report.pdf',
      title: 'Disbursement Report',
      columns: [
        { key: 'dateProcessed', title: 'Date Processed' },
        { key: 'requestDate', title: 'Request Date' },
        { key: 'applicableMonth', title: 'Applicable Month' },
        { key: 'requestTitle', title: 'Request Title' },
        { key: 'particulars', title: 'Particulars' },
        { key: 'operationType', title: 'Operation Type' },
        { key: 'designation', title: 'Designation' },
        { key: 'typeOfExpense', title: 'Type of Expense' },
        { key: 'supplier', title: 'Supplier' },
        { key: 'amountRequested', title: 'Amount Requested' },
        { key: 'vatAmount', title: 'VAT Amount' },
        { key: 'netAmount', title: 'Net Amount' },
        { key: 'requestStatus', title: 'Request Status' },
      ],
      rows: filteredData.map((row) => ({
        ...row,
        dateProcessed: formatLongDate(row.dateProcessed),
        requestDate: formatLongDate(row.requestDate),
        applicableMonth: formatLongDate(row.applicableMonth),
        amountRequested: money(row.amountRequested),
        vatAmount: money(row.vatAmount),
        netAmount: money(row.netAmount),
      })),
    })
  }

  return (
    <div className="sheet-page space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
        <div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
            Workbook / Reports
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Disbursement Reports
          </Typography.Title>
        </div>
        <div className="flex items-center gap-3">
          <Button danger icon={<FilePdfOutlined />} onClick={handleExportPdf} className="!rounded-md">
            Export PDF
          </Button>
          <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
            Total Records: {filteredData.length}
          </div>
        </div>
      </div>

      <div className="sheet-card p-4">
        <Space wrap className="mb-4">
          <Input
            placeholder="Search disbursement report"
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
              { label: 'Processed', value: 'Processed' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Paid', value: 'Paid' },
              { label: 'For Liquidation', value: 'For Liquidation' },
            ]}
            className="w-[190px]"
          />
          <DatePicker.RangePicker
            value={dateRange}
            onChange={(value) => setDateRange(value)}
            className="w-[320px]"
            allowClear
          />
        </Space>

        <Table<DisbursementItem>
          className="grid-table"
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 2800 }}
        />
      </div>
    </div>
  )
}

export default Reports
