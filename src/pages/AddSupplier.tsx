import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Space, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

function AddSupplier() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { record?: Record<string, unknown> } }
  const initialValues = state?.record
  const isEditMode = Boolean(initialValues)

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
          <Typography.Title level={5} className="!mb-1">
            Supplier Information
          </Typography.Title>
          <Typography.Paragraph className="!mb-4 !text-[#5f736b]">
            {isEditMode
              ? 'Update supplier details below.'
              : 'Enter the details below to add a new supplier record.'}
          </Typography.Paragraph>

          <Form
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Supplier Code" name="supplierCode" rules={[{ required: true, message: 'Please enter supplier code' }]}>
                <Input placeholder="e.g. SUP-007" />
              </Form.Item>
              <Form.Item label="Supplier Name" name="supplierName" rules={[{ required: true, message: 'Please enter supplier name' }]}>
                <Input placeholder="Enter supplier name" />
              </Form.Item>
              <Form.Item label="Contact Person" name="contactPerson" rules={[{ required: true, message: 'Please enter contact person' }]}>
                <Input placeholder="Enter contact person" />
              </Form.Item>
              <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select category' }]}>
                <Select
                  placeholder="Select category"
                  options={[
                    { label: 'Office Supplies', value: 'Office Supplies' },
                    { label: 'Logistics', value: 'Logistics' },
                    { label: 'Maintenance', value: 'Maintenance' },
                    { label: 'Technology', value: 'Technology' },
                    { label: 'Food Services', value: 'Food Services' },
                    { label: 'Safety', value: 'Safety' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter supplier email" />
              </Form.Item>
              <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
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

            <div className="mt-3 border-t border-[#d8e4df] pt-3">
              <Space className="flex justify-end">
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
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


