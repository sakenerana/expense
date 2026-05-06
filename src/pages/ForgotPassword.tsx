import { Button, Card, Form, Input, Typography } from 'antd'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef4f1] p-4">
      <Card className="w-full max-w-md border-[#d8e4df] shadow-lg">
        <Typography.Title level={3} className="!mb-1 !text-[#173f31]">
          Forgot Password
        </Typography.Title>
        <Typography.Paragraph className="!mb-6 !text-gray-500">
          Enter your email and we will send reset instructions.
        </Typography.Paragraph>

        <Form layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="name@company.com" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block className="!bg-[#1f6f50] hover:!bg-[#18563e]">
            Send Reset Link
          </Button>
        </Form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-[#1f6f50] hover:underline">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPassword
