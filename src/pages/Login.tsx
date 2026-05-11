import { Button, Card, Checkbox, Form, Input, Typography, message } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { getSupabaseClient, supabase, supabaseSession } from "../lib/supabase"

type LoginFormValues = {
  email: string
  password: string
  remember?: boolean
}

function Login() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [particlesReady, setParticlesReady] = useState(false)

  useEffect(() => {
    void initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setParticlesReady(true)
    })
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const [{ data: localData }, { data: sessionData }] = await Promise.all([
        supabase.auth.getSession(),
        supabaseSession.auth.getSession()
      ])

      if (localData.session || sessionData.session) {
        navigate("/dashboard", { replace: true })
      }
    }

    void checkSession()
  }, [navigate])

  const handleLogin = async (values: LoginFormValues) => {
    setSubmitting(true)

    const authClient = getSupabaseClient(Boolean(values.remember))

    const { error } = await authClient.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })

    setSubmitting(false)

    if (error) {
      message.error(error.message || "Unable to sign in.")
      return
    }

    message.success("Login successful.")
    navigate("/dashboard", { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-animated p-6 overflow-hidden">
      {particlesReady && (
        <Particles
          id="tsparticles"
          options={{
            background: {
              color: { value: "transparent" }
            },
            detectRetina: true,
            fpsLimit: 60,
            particles: {
              number: { value: 55 },
              color: { value: "#0f4f39" },
              links: {
                color: "#0f4f39",
                distance: 140,
                enable: true,
                opacity: 0.35,
                width: 1
              },
              move: {
                enable: true,
                speed: 1.1,
                outModes: { default: "out" }
              },
              opacity: { value: 0.55 },
              size: { value: { min: 2, max: 5 } },
              shape: { type: "circle" }
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "grab" },
                onClick: { enable: true, mode: "push" }
              },
              modes: {
                grab: {
                  distance: 160,
                  links: { opacity: 0.55 }
                },
                push: { quantity: 3 }
              }
            },
            fullScreen: { enable: false }
          }}
          className="absolute inset-0 z-0"
        />
      )}

      <Card className="relative z-10 w-full max-w-md rounded-xl border border-[#d8e4df] shadow-2xl backdrop-blur-md bg-white/80">
        <Typography.Title level={2} className="!mb-2 !text-[#173f31] font-bold text-center">
          Expense Management
        </Typography.Title>
        <Typography.Paragraph className="!mb-6 !text-gray-600 text-center">
          Sign in to manage and track your company expenses efficiently.
        </Typography.Paragraph>

        <Form layout="vertical" className="checkout-form" onFinish={handleLogin}>
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
            <Form.Item name="remember" valuePropName="checked" noStyle initialValue={true}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className="text-[#1f6f50] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
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
