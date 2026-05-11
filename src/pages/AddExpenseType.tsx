import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Space, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  createExpenseType,
  getNextExpenseTypeCode,
  type ExpenseStatus,
  type ExpenseTypeItem,
  updateExpenseType,
} from '../services/expenseTypesService'

type ExpenseTypeFormValues = {
  name: string
  glAccount?: string
  status: ExpenseStatus
}

function AddExpenseType() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { record?: ExpenseTypeItem } }
  const initialValues = state?.record
  const isEditMode = Boolean(initialValues)
  const [form] = Form.useForm<ExpenseTypeFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const [generatingCode, setGeneratingCode] = useState(false)
  const [displayExpenseCode, setDisplayExpenseCode] = useState('')

  useEffect(() => {
    const initializeExpenseCode = async () => {
      if (isEditMode && initialValues) {
        setDisplayExpenseCode(initialValues.code)
        return
      }

      setGeneratingCode(true)
      try {
        const nextCode = await getNextExpenseTypeCode()
        setDisplayExpenseCode(nextCode)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate expense type code.'
        message.error(errorMessage)
      } finally {
        setGeneratingCode(false)
      }
    }

    void initializeExpenseCode()
  }, [initialValues, isEditMode])

  return (
    <div className="sheet-page w-full">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
          <div>
            <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
              WORKBOOK / EXPENSE TYPE / {isEditMode ? 'EDIT EXPENSE TYPE' : 'ADD EXPENSE TYPE'}
            </Typography.Text>
            <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
              {isEditMode ? 'Edit Expense Type' : 'Add Expense Type'}
            </Typography.Title>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/expense-type')}>
            Back to Expense Type
          </Button>
        </div>

        <Card className="sheet-card w-full !p-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <Typography.Title level={5} className="!mb-1">
                Expense Type Information
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !text-[#5f736b]">
                {isEditMode
                  ? 'Update expense type details below.'
                  : 'Enter the details below to create a new expense type.'}
              </Typography.Paragraph>
            </div>
            <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-right">
              <Typography.Text className="text-[11px] font-semibold uppercase tracking-wide !text-[#5f736b]">
                Expense Code
              </Typography.Text>
              <Typography.Title level={5} className="!mb-0 !mt-1 !text-[#173f31]">
                {displayExpenseCode || 'Auto-generated'}
              </Typography.Title>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
            onFinish={async (values: ExpenseTypeFormValues) => {
              setSubmitting(true)
              try {
                if (isEditMode && initialValues) {
                  await updateExpenseType({
                    id: initialValues.id,
                    name: values.name,
                    glAccount: values.glAccount,
                    status: values.status,
                  })
                  message.success('Expense type updated successfully.')
                  navigate('/expense-type')
                  return
                }

                await createExpenseType({
                  name: values.name,
                  glAccount: values.glAccount,
                  status: values.status,
                })
                message.success('Expense type created successfully.')
                navigate('/expense-type')
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to save expense type.'
                message.error(errorMessage)
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <div className="form-section-head">
              <Typography.Text className="form-section-title">Expense Definition</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Expense Type" name="name" rules={[{ required: true, message: 'Please enter expense type name' }]}>
                <Input placeholder="Enter expense type name" />
              </Form.Item>
              <Form.Item label="GL Account" name="glAccount">
                <Input placeholder="e.g. 6500-Utilities" />
              </Form.Item>
              <Form.Item
                label="Status"
                name="status"
                className="md:col-span-2"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select
                  placeholder="Select status"
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="mt-4 border-t border-[#d8e4df] pt-4">
              <Space className="flex justify-end">
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting || generatingCode}>
                  {isEditMode ? 'Update Changes' : 'Save Expense Type'}
                </Button>
                <Button onClick={() => navigate('/expense-type')}>Cancel</Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddExpenseType


