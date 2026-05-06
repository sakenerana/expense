import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Space, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

function AddExpenseType() {
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
          <Typography.Title level={5} className="!mb-1">
            Expense Type Information
          </Typography.Title>
          <Typography.Paragraph className="!mb-4 !text-[#5f736b]">
            {isEditMode
              ? 'Update expense type details below.'
              : 'Enter the details below to create a new expense type.'}
          </Typography.Paragraph>

          <Form
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please enter code' }]}>
                <Input placeholder="e.g. EXP-007" />
              </Form.Item>
              <Form.Item label="Expense Type" name="name" rules={[{ required: true, message: 'Please enter expense type name' }]}>
                <Input placeholder="Enter expense type name" />
              </Form.Item>
              <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please enter category' }]}>
                <Input placeholder="e.g. Operating Expense" />
              </Form.Item>
              <Form.Item label="GL Account" name="glAccount" rules={[{ required: true, message: 'Please enter GL account' }]}>
                <Input placeholder="e.g. 6500-Utilities" />
              </Form.Item>
              <Form.Item label="Taxable" name="taxable" rules={[{ required: true, message: 'Please select taxable status' }]}>
                <Select
                  placeholder="Select taxable"
                  options={[
                    { label: 'Yes', value: 'Yes' },
                    { label: 'No', value: 'No' },
                  ]}
                />
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

            <div className="mt-3 border-t border-[#d8e4df] pt-3">
              <Space className="flex justify-end">
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
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


