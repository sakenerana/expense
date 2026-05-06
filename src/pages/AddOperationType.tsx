import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Space, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

function AddOperationType() {
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
          <Typography.Title level={5} className="!mb-1">
            Operation Type Information
          </Typography.Title>
          <Typography.Paragraph className="!mb-5 !text-[#5f736b]">
            {isEditMode
              ? 'Update operation type details below.'
              : 'Enter the details below to create a new operation type.'}
          </Typography.Paragraph>

          <Form
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
          >
            <div className="form-section-head">
              <Typography.Text className="form-section-title">Operation Setup</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item label="Code" name="code" extra={<span className="form-help-text">Format: OPS-###</span>} rules={[{ required: true, message: 'Please enter code' }]}>
                <Input placeholder="e.g. OPS-006" />
              </Form.Item>
              <Form.Item label="Operation Type" name="name" rules={[{ required: true, message: 'Please enter operation type name' }]}>
                <Input placeholder="Enter operation type name" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                className="md:col-span-2"
                extra={<span className="form-help-text">Briefly describe what this operation is used for.</span>}
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input.TextArea placeholder="Enter description" rows={3} />
              </Form.Item>
              <Form.Item label="Owner" name="owner" rules={[{ required: true, message: 'Please enter owner' }]}>
                <Input placeholder="e.g. Procurement" />
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
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
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


