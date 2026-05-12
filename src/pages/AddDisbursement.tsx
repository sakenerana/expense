import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, Typography, message } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  createDisbursement,
  fetchDisbursementFormLookups,
  type DisbursementItem,
  updateDisbursement,
} from '../services/disbursementsService'

type OptionItem = {
  label: string
  value: number
}

type DisbursementFormValues = {
  dateProcessed?: Dayjs
  requestDate?: Dayjs
  applicableMonth?: Dayjs
  operationTypeId?: number
  particulars?: string
  designation?: string
  tinNumber?: string
  supplierId?: number
  expenseTypeId?: number
  sourceDocument?: string
  sourceDocumentReferenceNo?: string
  sourceDocumentDate?: Dayjs
  vatType?: string
  amountRequested?: number
  vatAmount?: number
  netAmount?: number
  referenceNo?: string
  gjDisbursement?: string
  gjLiquidation?: string
  abLinkRequest?: string
  abLinkLiquidation?: string
  requestTitle?: string
  requestStatus?: string
  datePaid?: Dayjs
  remarks?: string
}

function formatDayjsToDate(value?: Dayjs) {
  return value ? value.format('YYYY-MM-DD') : null
}

function AddDisbursement() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { record?: DisbursementItem } }
  const initialValues = state?.record
  const isEditMode = Boolean(initialValues)
  const [form] = Form.useForm<DisbursementFormValues>()
  const [operationTypeOptions, setOperationTypeOptions] = useState<OptionItem[]>([])
  const [supplierOptions, setSupplierOptions] = useState<OptionItem[]>([])
  const [expenseTypeOptions, setExpenseTypeOptions] = useState<OptionItem[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true)
      try {
        const { operationTypes, suppliers, expenseTypes } = await fetchDisbursementFormLookups()
        setOperationTypeOptions(operationTypes.map((item) => ({ label: item.label, value: item.id })))
        setSupplierOptions(suppliers.map((item) => ({ label: item.label, value: item.id })))
        setExpenseTypeOptions(expenseTypes.map((item) => ({ label: item.label, value: item.id })))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load form options.'
        message.error(errorMessage)
      } finally {
        setLoadingOptions(false)
      }
    }

    void loadOptions()
  }, [])

  useEffect(() => {
    if (!initialValues) {
      return
    }

    form.setFieldsValue({
      dateProcessed: initialValues.dateProcessed !== '-' ? dayjs(initialValues.dateProcessed) : undefined,
      requestDate: initialValues.requestDate !== '-' ? dayjs(initialValues.requestDate) : undefined,
      applicableMonth: initialValues.applicableMonth !== '-' ? dayjs(initialValues.applicableMonth) : undefined,
      operationTypeId: initialValues.operationTypeId ?? undefined,
      particulars: initialValues.particulars !== '-' ? initialValues.particulars : undefined,
      designation: initialValues.designation !== '-' ? initialValues.designation : undefined,
      tinNumber: initialValues.tinNumber !== '-' ? initialValues.tinNumber : undefined,
      supplierId: initialValues.supplierId ?? undefined,
      expenseTypeId: initialValues.expenseTypeId ?? undefined,
      sourceDocument: initialValues.sourceDocument !== '-' ? initialValues.sourceDocument : undefined,
      sourceDocumentReferenceNo: initialValues.referenceNo !== '-' ? initialValues.referenceNo : undefined,
      sourceDocumentDate: initialValues.date !== '-' ? dayjs(initialValues.date) : undefined,
      vatType: initialValues.vatType !== '-' ? initialValues.vatType : undefined,
      amountRequested: initialValues.amountRequested,
      vatAmount: initialValues.vatAmount,
      netAmount: initialValues.netAmount,
      referenceNo: initialValues.referenceNumber !== '-' ? initialValues.referenceNumber : undefined,
      gjDisbursement: initialValues.gjDisbursement !== '-' ? initialValues.gjDisbursement : undefined,
      gjLiquidation: initialValues.gjLiquidation !== '-' ? initialValues.gjLiquidation : undefined,
      abLinkRequest: initialValues.abLinkRequest !== '-' ? initialValues.abLinkRequest : undefined,
      abLinkLiquidation: initialValues.abLinkLiquidation !== '-' ? initialValues.abLinkLiquidation : undefined,
      requestTitle: initialValues.requestTitle !== '-' ? initialValues.requestTitle : undefined,
      requestStatus: initialValues.requestStatus,
      datePaid: initialValues.datePaid !== '-' ? dayjs(initialValues.datePaid) : undefined,
      remarks: initialValues.remarks !== '-' ? initialValues.remarks : undefined,
    })
  }, [form, initialValues])

  return (
    <div className="sheet-page w-full">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
          <div>
            <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
              WORKBOOK / DISBURSEMENT / {isEditMode ? 'EDIT DISBURSEMENT' : 'ADD DISBURSEMENT'}
            </Typography.Text>
            <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
              {isEditMode ? 'Edit Disbursement' : 'Add Disbursement'}
            </Typography.Title>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/disbursement')}>
            Back to Disbursement
          </Button>
        </div>

        <Card className="sheet-card w-full !p-2">
          <Typography.Title level={5} className="!mb-1">
            Disbursement Information
          </Typography.Title>
          <Typography.Paragraph className="!mb-5 !text-[#5f736b]">
            {isEditMode
              ? 'Update disbursement details below.'
              : 'Enter disbursement details below to create a new record.'}
          </Typography.Paragraph>

          <Form
            form={form}
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            onFinish={async (values: DisbursementFormValues) => {
              const payload = {
                dateProcessed: formatDayjsToDate(values.dateProcessed),
                requestDate: formatDayjsToDate(values.requestDate),
                applicableMonth: formatDayjsToDate(values.applicableMonth),
                operationTypeId: values.operationTypeId ?? null,
                particulars: values.particulars ?? null,
                designation: values.designation ?? null,
                tinNumber: values.tinNumber ?? null,
                supplierId: values.supplierId ?? null,
                expenseTypeId: values.expenseTypeId ?? null,
                sourceDocument: values.sourceDocument ?? null,
                sourceDocumentReferenceNo: values.sourceDocumentReferenceNo ?? null,
                sourceDocumentDate: formatDayjsToDate(values.sourceDocumentDate),
                vatType: values.vatType ?? null,
                amountRequested: values.amountRequested ?? null,
                vatAmount: values.vatAmount ?? null,
                netAmount: values.netAmount ?? null,
                referenceNo: values.referenceNo ?? null,
                gjDisbursement: values.gjDisbursement ?? null,
                gjLiquidation: values.gjLiquidation ?? null,
                abLinkRequest: values.abLinkRequest ?? null,
                abLinkLiquidation: values.abLinkLiquidation ?? null,
                requestTitle: values.requestTitle ?? null,
                requestStatus: values.requestStatus ?? null,
                datePaid: formatDayjsToDate(values.datePaid),
                remarks: values.remarks ?? null,
              }

              setSubmitting(true)
              try {
                if (isEditMode && initialValues) {
                  await updateDisbursement({ id: initialValues.id, ...payload })
                  message.success('Disbursement updated successfully.')
                } else {
                  await createDisbursement(payload)
                  message.success('Disbursement created successfully.')
                }
                navigate('/disbursement')
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to save disbursement.'
                message.error(errorMessage)
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <div className="form-section-head">
              <Typography.Text className="form-section-title">Request Details</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Date Processed" name="dateProcessed" rules={[{ required: true, message: 'Please select date processed' }]}>
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item label="Request Date" name="requestDate" extra={<span className="form-help-text">Date when the disbursement was requested.</span>} rules={[{ required: true, message: 'Please select request date' }]}>
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item label="Applicable Month" name="applicableMonth" rules={[{ required: true, message: 'Please select applicable month' }]}>
                <DatePicker className="w-full" picker="month" />
              </Form.Item>
              <Form.Item label="Operation Type" name="operationTypeId" rules={[{ required: true, message: 'Please select operation type' }]}>
                <Select
                  placeholder="Select operation type"
                  options={operationTypeOptions}
                  loading={loadingOptions}
                />
              </Form.Item>
              <Form.Item
                label="Particulars"
                name="particulars"
                className="md:col-span-2"
                rules={[{ required: true, message: 'Please enter particulars' }]}
              >
                <Input.TextArea rows={3} placeholder="Enter particulars" />
              </Form.Item>
              <Form.Item label="Designation" name="designation" rules={[{ required: true, message: 'Please enter designation' }]}>
                <Input placeholder="Enter designation" />
              </Form.Item>
              <Form.Item label="TIN Number" name="tinNumber" rules={[{ required: true, message: 'Please enter TIN number' }]}>
                <Input placeholder="Enter TIN number" />
              </Form.Item>
              <Form.Item label="Supplier" name="supplierId" rules={[{ required: true, message: 'Please select supplier' }]}>
                <Select
                  placeholder="Select supplier"
                  options={supplierOptions}
                  loading={loadingOptions}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
              <Form.Item label="Type of Expense" name="expenseTypeId" rules={[{ required: true, message: 'Please select type of expense' }]}>
                <Select
                  placeholder="Select type of expense"
                  options={expenseTypeOptions}
                  loading={loadingOptions}
                />
              </Form.Item>
              <Form.Item label="Source Document" name="sourceDocument" rules={[{ required: true, message: 'Please enter source document' }]}>
                <Input placeholder="Enter source document" />
              </Form.Item>
              <Form.Item
                label="Reference Number (Source Document)"
                name="sourceDocumentReferenceNo"
                rules={[{ required: true, message: 'Please enter source document reference number' }]}
              >
                <Input placeholder="Enter source document reference number" />
              </Form.Item>
              <Form.Item
                label="Date (Source Document)"
                name="sourceDocumentDate"
                rules={[{ required: true, message: 'Please select source document date' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                label="VAT / Non-VAT / VAT Exempt"
                name="vatType"
                rules={[{ required: true, message: 'Please select VAT type' }]}
              >
                <Select
                  placeholder="Select VAT type"
                  options={[
                    { label: 'VAT', value: 'VAT' },
                    { label: 'Non-VAT', value: 'Non-VAT' },
                    { label: 'VAT Exempt', value: 'VAT Exempt' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Amount Requested" name="amountRequested" rules={[{ required: true, message: 'Please enter amount' }]}>
                <InputNumber className="w-full" min={0} precision={2} placeholder="0.00" />
              </Form.Item>
              <Form.Item label="Vat Amount (12%)" name="vatAmount" rules={[{ required: true, message: 'Please enter VAT amount' }]}>
                <InputNumber className="w-full" min={0} precision={2} placeholder="0.00" />
              </Form.Item>
              <Form.Item label="Net Amount" name="netAmount" rules={[{ required: true, message: 'Please enter net amount' }]}>
                <InputNumber className="w-full" min={0} precision={2} placeholder="0.00" />
              </Form.Item>
              <Form.Item label="Reference No." name="referenceNo" required={false}>
                <Input placeholder="Enter reference number" />
              </Form.Item>
              <Form.Item label="GJ - Disbursement" name="gjDisbursement" required={false}>
                <Input placeholder="Enter GJ - Disbursement" />
              </Form.Item>
              <Form.Item label="GJ - Liquidation" name="gjLiquidation" required={false}>
                <Input placeholder="Enter GJ - Liquidation" />
              </Form.Item>
              <Form.Item label="AB Link - Request" name="abLinkRequest" required={false}>
                <Input placeholder="Enter AB Link - Request" />
              </Form.Item>
              <Form.Item label="AB Link - Liquidation" name="abLinkLiquidation" required={false}>
                <Input placeholder="Enter AB Link - Liquidation" />
              </Form.Item>
              <Form.Item label="Request Title" name="requestTitle" required={false}>
                <Input placeholder="Enter request title" />
              </Form.Item>
              <Form.Item
                label="Request Status"
                name="requestStatus"
                required={false}
              >
                <Select
                  placeholder="Select request status"
                  options={[
                    { label: 'Processed', value: 'Processed' },
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Paid', value: 'Paid' },
                    { label: 'For Liquidation', value: 'For Liquidation' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Date Paid" name="datePaid">
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item label="Remarks" name="remarks" className="md:col-span-2">
                <Input.TextArea rows={3} placeholder="Enter remarks" />
              </Form.Item>
            </div>

            <div className="mt-4 border-t border-[#d8e4df] pt-4">
              <Space className="flex justify-end">
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting || loadingOptions}>
                  {isEditMode ? 'Update Changes' : 'Save Disbursement'}
                </Button>
                <Button onClick={() => navigate('/disbursement')}>Cancel</Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddDisbursement


