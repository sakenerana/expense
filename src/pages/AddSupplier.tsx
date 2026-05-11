import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Space, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  createSupplier,
  getNextSupplierCode,
  type SupplierItem,
  type SupplierStatus,
  updateSupplier,
} from '../services/suppliersService'

type SupplierFormValues = {
  supplierName: string
  contactPerson?: string
  category?: string
  email?: string
  phone?: string
  status: SupplierStatus
}

function AddSupplier() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { record?: SupplierItem } }
  const initialValues = state?.record
  const isEditMode = Boolean(initialValues)
  const [form] = Form.useForm<SupplierFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const [generatingCode, setGeneratingCode] = useState(false)
  const [displaySupplierCode, setDisplaySupplierCode] = useState('')

  useEffect(() => {
    const initializeSupplierCode = async () => {
      if (isEditMode && initialValues) {
        setDisplaySupplierCode(initialValues.supplierCode)
        return
      }

      setGeneratingCode(true)
      try {
        const nextCode = await getNextSupplierCode()
        setDisplaySupplierCode(nextCode)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate supplier code.'
        message.error(errorMessage)
      } finally {
        setGeneratingCode(false)
      }
    }

    void initializeSupplierCode()
  }, [form, initialValues, isEditMode])

  return (
    <div className="sheet-page w-full">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
          <div>
            <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
              WORKBOOK / SUPPLIER / {isEditMode ? 'EDIT SUPPLIER' : 'ADD SUPPLIER'}
            </Typography.Text>
            <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
              {isEditMode ? 'Edit Supplier' : 'Add Supplier'}
            </Typography.Title>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/supplier')}>
            Back to Supplier
          </Button>
        </div>

        <Card className="sheet-card w-full !p-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <Typography.Title level={5} className="!mb-1">
                Supplier Information
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !text-[#5f736b]">
                {isEditMode
                  ? 'Update supplier details below.'
                  : 'Enter the details below to add a new supplier record.'}
              </Typography.Paragraph>
            </div>
            <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-right">
              <Typography.Text className="text-[11px] font-semibold uppercase tracking-wide !text-[#5f736b]">
                Supplier Code
              </Typography.Text>
              <Typography.Title level={5} className="!mb-0 !mt-1 !text-[#173f31]">
                {displaySupplierCode || 'Generating...'}
              </Typography.Title>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
            onFinish={async (values: SupplierFormValues) => {
              const payload = {
                supplierName: values.supplierName,
                contactPerson: values.contactPerson,
                category: values.category,
                email: values.email,
                phone: values.phone,
                status: values.status,
              }

              setSubmitting(true)
              try {
                if (isEditMode && initialValues) {
                  await updateSupplier({
                    id: initialValues.id,
                    ...payload,
                  })
                  message.success('Supplier updated successfully.')
                  navigate('/supplier')
                  return
                }

                await createSupplier(payload)
                message.success('Supplier created successfully.')
                navigate('/supplier')
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to save supplier.'
                message.error(errorMessage)
              } finally {
                setSubmitting(false)
              }
            }}
          >
            <div className="form-section-head">
              <Typography.Text className="form-section-title">Supplier Profile</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Supplier Name" name="supplierName" rules={[{ required: true, message: 'Please enter supplier name' }]}>
                <Input placeholder="Enter supplier name" />
              </Form.Item>
              <Form.Item label="Contact Person" name="contactPerson">
                <Input placeholder="Enter contact person" />
              </Form.Item>
              <Form.Item label="Category" name="category">
                <Select
                  placeholder="Select category"
                  options={[
                    { label: 'Office Supplies', value: 'Office Supplies' },
                    { label: 'Logistics', value: 'Logistics' },
                    { label: 'Maintenance', value: 'Maintenance' },
                    { label: 'Technology', value: 'Technology' },
                    { label: 'Food Services', value: 'Food Services' },
                    { label: 'Safety', value: 'Safety' },
                    { label: 'Others', value: 'Others' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                extra={<span className="form-help-text">Primary supplier contact email.</span>}
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter supplier email" />
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <Input placeholder="Enter phone number" />
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
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="mt-4 border-t border-[#d8e4df] pt-4">
              <Space className="flex justify-end">
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting || generatingCode}>
                  {isEditMode ? 'Update Changes' : 'Save Supplier'}
                </Button>
                <Button onClick={() => navigate('/supplier')}>Cancel</Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddSupplier


