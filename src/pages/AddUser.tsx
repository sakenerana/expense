import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Space, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

function AddUser() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { record?: Record<string, unknown> } }
  const initialValues = state?.record
  const isEditMode = Boolean(initialValues)
  const [form] = Form.useForm()

  return (
    <div className="sheet-page w-full">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4df] pb-4">
          <div>
            <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
              WORKBOOK / USERS / {isEditMode ? 'EDIT USER' : 'ADD USER'}
            </Typography.Text>
            <Typography.Title level={3} className="!m-0 !mt-1 !text-[#1f2937]">
              {isEditMode ? 'Edit User' : 'Add User'}
            </Typography.Title>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')}>
            Back to Users
          </Button>
        </div>

        <Card className="sheet-card w-full !p-2">
          <Typography.Title level={5} className="!mb-1 !text-[#1f2937]">
            User Information
          </Typography.Title>
          <Typography.Paragraph className="!mb-5 !text-[#7b8794]">
            {isEditMode
              ? 'Update the account details below.'
              : 'Enter the account details below to create a new user.'}
          </Typography.Paragraph>

          <Form
            form={form}
            layout="vertical"
            className="add-user-form checkout-form"
            requiredMark={true}
            initialValues={initialValues}
            onFinish={(values) => {
              console.log('Form values:', values)
              // Handle form submission here
            }}
          >
            <div className="form-section-head">
              <Typography.Text className="form-section-title">Profile Details</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item
                label="Full Name"
                name="name"
                extra={<span className="form-help-text">Use legal full name as displayed in records.</span>}
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                extra={<span className="form-help-text">Use company email for account access.</span>}
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
              <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select role' }]}>
                <Select
                  placeholder="Select role"
                  options={[
                    { label: 'Admin', value: 'Admin' },
                    { label: 'User', value: 'User' },
                    { label: 'Viewer', value: 'Viewer' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select status' }]}>
                <Select
                  placeholder="Select status"
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="form-section-head !mt-3">
              <Typography.Text className="form-section-title">Security</Typography.Text>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Form.Item
                label="Password"
                name="password"
                extra={<span className="form-help-text">{isEditMode ? 'Leave blank to keep current password.' : 'Minimum of 8 characters.'}</span>}
                rules={[
                  { required: !isEditMode, message: 'Please enter password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Input.Password placeholder={isEditMode ? 'Leave blank to keep current password' : 'Create a password'} />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                extra={<span className="form-help-text">Re-enter password to confirm.</span>}
                dependencies={['password']}
                rules={[
                  { required: !isEditMode, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('The two passwords do not match!'))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>
            </div>

            <div className="mt-4 border-t border-[#d8e4df] pt-4">
              <Space className="flex justify-end">
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  {isEditMode ? 'Update Changes' : 'Save User'}
                </Button>
                <Button onClick={() => navigate('/users')}>Cancel</Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default AddUser
