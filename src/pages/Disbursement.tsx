import { SearchOutlined } from '@ant-design/icons'
import { Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'

type RequestStatus = 'Processed' | 'Pending' | 'Paid' | 'For Liquidation'

type DisbursementItem = {
  key: string
  dateProcessed: string
  requestDate: string
  applicableMonth: string
  particulars: string
  operationType: string
  designation: string
  typeOfExpense: string
  tinNumber: string
  supplier: string
  date: string
  sourceDocument: string
  referenceNo: string
  vatType: string
  amountRequested: number
  vatAmount: number
  netAmount: number
  gjDisbursement: string
  gjLiquidation: string
  abLinkRequest: string
  abLinkLiquidation: string
  requestTitle: string
  requestStatus: RequestStatus
  datePaid: string
  referenceNumber: string
  remarks: string
}

const disbursements: DisbursementItem[] = [
  {
    key: '1',
    dateProcessed: '2026-05-02',
    requestDate: '2026-04-29',
    applicableMonth: 'April 2026',
    particulars: 'Office supplies replenishment for admin department',
    operationType: 'Vendor Payment',
    designation: 'Admin',
    typeOfExpense: 'Office Supplies',
    tinNumber: '123-456-789',
    supplier: 'Northline Office Supply',
    date: '2026-05-02',
    sourceDocument: 'Invoice',
    referenceNo: 'INV-10482',
    vatType: 'VAT',
    amountRequested: 24500,
    vatAmount: 2625,
    netAmount: 21875,
    gjDisbursement: 'GJ-DIS-001',
    gjLiquidation: '-',
    abLinkRequest: 'AB-REQ-001',
    abLinkLiquidation: '-',
    requestTitle: 'Admin Office Supplies',
    requestStatus: 'Processed',
    datePaid: '2026-05-04',
    referenceNumber: 'PAY-2201',
    remarks: 'Complete',
  },
  {
    key: '2',
    dateProcessed: '2026-05-03',
    requestDate: '2026-04-30',
    applicableMonth: 'April 2026',
    particulars: 'Courier and delivery expenses',
    operationType: 'Reimbursement',
    designation: 'Operations',
    typeOfExpense: 'Logistics',
    tinNumber: '234-567-890',
    supplier: 'Brightway Logistics',
    date: '2026-05-03',
    sourceDocument: 'Receipt',
    referenceNo: 'REC-20991',
    vatType: 'Non-VAT',
    amountRequested: 8600,
    vatAmount: 0,
    netAmount: 8600,
    gjDisbursement: 'GJ-DIS-002',
    gjLiquidation: '-',
    abLinkRequest: 'AB-REQ-002',
    abLinkLiquidation: '-',
    requestTitle: 'Delivery Reimbursement',
    requestStatus: 'Paid',
    datePaid: '2026-05-05',
    referenceNumber: 'PAY-2202',
    remarks: 'Paid',
  },
  {
    key: '3',
    dateProcessed: '2026-05-04',
    requestDate: '2026-05-01',
    applicableMonth: 'May 2026',
    particulars: 'Preventive maintenance service billing',
    operationType: 'Vendor Payment',
    designation: 'Facilities',
    typeOfExpense: 'Maintenance',
    tinNumber: '345-678-901',
    supplier: 'Metro Maintenance Group',
    date: '2026-05-04',
    sourceDocument: 'Billing',
    referenceNo: 'BIL-88120',
    vatType: 'VAT',
    amountRequested: 32000,
    vatAmount: 3428.57,
    netAmount: 28571.43,
    gjDisbursement: 'GJ-DIS-003',
    gjLiquidation: 'GJ-LIQ-003',
    abLinkRequest: 'AB-REQ-003',
    abLinkLiquidation: 'AB-LIQ-003',
    requestTitle: 'Maintenance Billing',
    requestStatus: 'For Liquidation',
    datePaid: '-',
    referenceNumber: '-',
    remarks: 'Awaiting liquidation',
  },
  {
    key: '4',
    dateProcessed: '-',
    requestDate: '2026-05-02',
    applicableMonth: 'May 2026',
    particulars: 'Software subscription renewal',
    operationType: 'Purchase Request',
    designation: 'IT',
    typeOfExpense: 'Software Subscription',
    tinNumber: '456-789-012',
    supplier: 'Summit IT Services',
    date: '2026-05-02',
    sourceDocument: 'Quotation',
    referenceNo: 'QTN-70043',
    vatType: 'VAT',
    amountRequested: 15100,
    vatAmount: 1617.86,
    netAmount: 13482.14,
    gjDisbursement: '-',
    gjLiquidation: '-',
    abLinkRequest: 'AB-REQ-004',
    abLinkLiquidation: '-',
    requestTitle: 'Software Renewal',
    requestStatus: 'Pending',
    datePaid: '-',
    referenceNumber: '-',
    remarks: 'For approval',
  },
]

const statusColors: Record<RequestStatus, string> = {
  Processed: 'blue',
  Pending: 'gold',
  Paid: 'green',
  'For Liquidation': 'purple',
}

const money = (value: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const header = (label: string, className = '') => (
  <span className={`disbursement-header-label ${className}`}>{label}</span>
)

function Disbursement() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RequestStatus | 'All'>('All')

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
  }, [search, status])

  const columns: ColumnsType<DisbursementItem> = [
    { title: header('Date Processed'), dataIndex: 'dateProcessed', key: 'dateProcessed', width: 120 },
    { title: header('Request Date'), dataIndex: 'requestDate', key: 'requestDate', width: 115 },
    { title: header('Applicable month'), dataIndex: 'applicableMonth', key: 'applicableMonth', width: 140 },
    { title: header('Particulars'), dataIndex: 'particulars', key: 'particulars', ellipsis: true, width: 280 },
    { title: header('Operation Type'), dataIndex: 'operationType', key: 'operationType', ellipsis: true, width: 155 },
    { title: header('Designation'), dataIndex: 'designation', key: 'designation', ellipsis: true, width: 135 },
    { title: header('Type of Expense'), dataIndex: 'typeOfExpense', key: 'typeOfExpense', ellipsis: true, width: 170 },
    { title: header('TIN number'), dataIndex: 'tinNumber', key: 'tinNumber', width: 130 },
    { title: header('SUPPLIER'), dataIndex: 'supplier', key: 'supplier', ellipsis: true, width: 220 },
    { title: header('Date'), dataIndex: 'date', key: 'date', width: 115 },
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
    },
    {
      title: header('Vat Amount(12%)'),
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      align: 'right',
      width: 145,
      render: money,
    },
    {
      title: header('Net Amount'),
      dataIndex: 'netAmount',
      key: 'netAmount',
      align: 'right',
      width: 135,
      render: money,
    },
    { title: header('GJ - Disbursement'), dataIndex: 'gjDisbursement', key: 'gjDisbursement', width: 155 },
    { title: header('GJ - Liquidation'), dataIndex: 'gjLiquidation', key: 'gjLiquidation', width: 145 },
    { title: header('AB Link - Request'), dataIndex: 'abLinkRequest', key: 'abLinkRequest', width: 150 },
    { title: header('AB Link - Liquidation'), dataIndex: 'abLinkLiquidation', key: 'abLinkLiquidation', width: 165 },
    { title: header('Request Title'), dataIndex: 'requestTitle', key: 'requestTitle', ellipsis: true, width: 185 },
    {
      title: header('Request Status'),
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      width: 140,
      render: (value: RequestStatus) => <Tag color={statusColors[value]}>{value}</Tag>,
    },
    { title: header('Date Paid'), dataIndex: 'datePaid', key: 'datePaid', width: 115 },
    { title: header('Reference Number'), dataIndex: 'referenceNumber', key: 'referenceNumber', width: 150 },
    {
      title: header('Remarks', 'remarks-header'),
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
      width: 180,
      className: 'remarks-column',
    },
  ]

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
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowKey="key"
          bordered
          size="small"
          scroll={{ x: 3700 }}
        />
      </div>
    </div>
  )
}

export default Disbursement
