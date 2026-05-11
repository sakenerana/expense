import { Button, Card, Form, Input, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { supabase } from '../lib/supabase'

type ForgotPasswordValues = {
  email: string
}

function ForgotPassword() {
  const [submitting, setSubmitting] = useState(false)
  const [particlesReady, setParticlesReady] = useState(false)

  useEffect(() => {
    void initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setParticlesReady(true)
    })
  }, [])

  const handleResetPassword = async (values: ForgotPasswordValues) => {
    setSubmitting(true)

    const redirectTo =
      import.meta.env.VITE_SUPABASE_RESET_REDIRECT_URL ?? `${window.location.origin}/login`

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo
    })

    setSubmitting(false)

    if (error) {
      message.error(error.message || 'Failed to send reset link.')
      return
    }

    message.success('Reset link sent. Please check your email.')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-animated p-4 overflow-hidden">
      {particlesReady && (
        <Particles
          id="tsparticles-forgot-password"
          options={{
            background: {
              color: { value: 'transparent' }
            },
            detectRetina: true,
            fpsLimit: 60,
            particles: {
              number: { value: 55 },
              color: { value: '#0f4f39' },
              links: {
                color: '#0f4f39',
                distance: 140,
                enable: true,
                opacity: 0.35,
                width: 1
              },
              move: {
                enable: true,
                speed: 1.1,
                outModes: { default: 'out' }
              },
              opacity: { value: 0.55 },
              size: { value: { min: 2, max: 5 } },
              shape: { type: 'circle' }
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: 'grab' },
                onClick: { enable: true, mode: 'push' }
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

      <Card className="relative z-10 w-full max-w-md border-[#d8e4df] shadow-lg">
        <Typography.Title level={3} className="!mb-1 !text-[#173f31]">
          Forgot Password
        </Typography.Title>
        <Typography.Paragraph className="!mb-6 !text-gray-500">
          Enter your email and we will send reset instructions.
        </Typography.Paragraph>

        <Form layout="vertical" className="checkout-form" onFinish={handleResetPassword}>
          <div className="form-section-head">
            <Typography.Text className="form-section-title">Recovery</Typography.Text>
          </div>
          <Form.Item
            label="Email"
            name="email"
            extra={<span className="form-help-text">We will send the reset link to this email.</span>}
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="name@company.com" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitting}
            className="!bg-[#1f6f50] hover:!bg-[#18563e]"
          >
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
