import { Button, Card, Checkbox, Form, Input, Typography } from "antd"
import { Link } from "react-router-dom"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

function Login() {
  const particlesInit = async (main: any) => {
    await loadFull(main)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-animated p-6 overflow-hidden">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 40 },
            move: { enable: true, speed: 1.5, outModes: "out" },
            opacity: { value: 0.6 },
            size: { value: 16 },
            color: { value: "#1f6f50" },
            shape: {
              type: ["char", "image"],
              character: {
                value: ["$", "€", "¥", "₱"],
                font: "Verdana",
                weight: "400"
              },
              image: [
                { src: "/icons/bar-chart.svg", width: 20, height: 20 },
                { src: "/icons/pie-chart.svg", width: 20, height: 20 },
                { src: "/icons/up-arrow.svg", width: 20, height: 20 }
              ]
            }
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" }
            },
            modes: { repulse: { distance: 120 }, push: { quantity: 2 } }
          },
          fullScreen: { enable: false }
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Login Card */}
      <Card className="w-full max-w-md rounded-xl border border-[#d8e4df] shadow-2xl backdrop-blur-md bg-white/80">
        <Typography.Title level={2} className="!mb-2 !text-[#173f31] font-bold text-center">
          Expense Management
        </Typography.Title>
        <Typography.Paragraph className="!mb-6 !text-gray-600 text-center">
          Sign in to manage and track your company expenses efficiently.
        </Typography.Paragraph>

        <Form layout="vertical" className="checkout-form">
          <div className="form-section-head">
            <Typography.Text className="form-section-title">Account Access</Typography.Text>
          </div>
          <Form.Item
            label="Email"
            name="email"
            extra={<span className="form-help-text">Use your registered work email.</span>}
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="name@company.com" className="rounded-md" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            extra={<span className="form-help-text">Keep your credentials secure.</span>}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter password" className="rounded-md" />
          </Form.Item>

          <div className="mb-4 flex items-center justify-between">
            <Checkbox>Remember me</Checkbox>
            <Link to="/forgot-password" className="text-[#1f6f50] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="!bg-[#1f6f50] hover:!bg-[#18563e] rounded-md font-semibold"
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default Login
