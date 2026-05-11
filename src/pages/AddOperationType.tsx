import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Space, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  createOperationType,
  getNextOperationTypeCode,
  type OperationStatus,
  type OperationTypeItem,
  updateOperationType,
} from '../services/operationTypesService'

type OperationTypeFormValues = {
  name: string
  description?: string
  status: OperationStatus
}

function AddOperationType() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { record?: OperationTypeItem } }
  const initialValues = state?.record
  const isEditMode = Boolean(initialValues)
  const [form] = Form.useForm<OperationTypeFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const [generatingCode, setGeneratingCode] = useState(false)
  const [displayOperationCode, setDisplayOperationCode] = useState('')

  useEffect(() => {
    const initializeOperationCode = async () => {
      if (isEditMode && initialValues) {
        setDisplayOperationCode(initialValues.code)
        return
      }

      setGeneratingCode(true)
      try {
        const nextCode = await getNextOperationTypeCode()
        setDisplayOperationCode(nextCode)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate operation type code.'
        message.error(errorMessage)
      } finally {
        setGeneratingCode(false)
      }
    }

    void initializeOperationCode()
  }, [initialValues, isEditMode])

  return (
    <div className="sheet-page w-full">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
          <div>
            <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
              WORKBOOK / OPERATION TYPE / {isEditMode ? 'EDIT OPERATION TYPE' : 'ADD OPERATION TYPE'}
            </Typography.Text>
            <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
              {isEditMode ? 'Edit Operation Type' : 'Add Operation Type'}
            </Typography.Title>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operation-type')}>
            Back to Operation Type
          </Button>
        </div>

        <Card className="sheet-card w-full !p-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <Typography.Title level={5} className="!mb-1">
                Operation Type Information
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !text-[#5f736b]">
                {isEditMode
                  ? 'Update operation type details below.'
                  : 'Enter the details below to create a new operation type.'}
              </Typography.Paragraph>
            </div>
            <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-right">
              <Typography.Text className="text-[11px] font-semibold uppercase tracking-wide !text-[#5f736b]">
                Operation Code
              </Typography.Text>
              <Typography.Title level={5} className="!mb-0 !mt-1 !text-[#173f31]">
                {displayOperationCode || 'Auto-generated'}
              </Typography.Title>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
            onFinish={async (values: OperationTypeFormValues) => {
              setSubmitting(true)
              try {
                if (isEditMode && initialValues) {
                  await updateOperationType({
                    id: initialValues.id,
                    name: values.name,
                    description: values.description,
                    status: values.status,
                  })
                  message.success('Operation type updated successfully.')
                  navigate('/operation-type')
                  return
                }

                await createOperationType({
                  name: values.name,
                  description: values.description,
                  status: values.status,
                })
                message.success('Operation type created successfully.')
                navigate('/operation-type')
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to save operation type.'
                message.error(errorMessage)
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <div className="form-section-head">
              <Typography.Text className="form-section-title">Operation Setup</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Operation Type" name="name" rules={[{ required: true, message: 'Please enter operation type name' }]}>
                <Input placeholder="Enter operation type name" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                className="md:col-span-2"
                extra={<span className="form-help-text">Briefly describe what this operation is used for.</span>}
              >
                <Input.TextArea placeholder="Enter description" rows={3} />
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
                  {isEditMode ? 'Update Changes' : 'Save Operation Type'}
                </Button>
                <Button onClick={() => navigate('/operation-type')}>Cancel</Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddOperationType


