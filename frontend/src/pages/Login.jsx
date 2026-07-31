import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, ReadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

const { Title, Text } = Typography

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await authApi.login(values)
      setAuth(res.data.access_token, res.data.user)
      message.success('登录成功')
      navigate('/')
    } catch (err) {
      message.error(err.response?.data?.detail || '账号或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <Card
        style={{
          width: 400, borderRadius: 26,
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(34px) saturate(180%)',
          WebkitBackdropFilter: 'blur(34px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 30px 60px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
        bodyStyle={{ padding: '40px 36px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #4f6ef7, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(79,110,247,0.32), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}>
            <ReadOutlined style={{ fontSize: 26, color: '#fff' }} />
          </div>
          <Title level={3} style={{ margin: 0, color: '#1e293b' }}>EGO Journal</Title>
          <Text style={{ color: '#64748b', fontSize: 13 }}>企业内刊管理平台</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
              placeholder="用户名"
              size="large"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="密码"
              size="large"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{
                borderRadius: 12, height: 48, fontWeight: 600,
                background: 'linear-gradient(135deg, #4f6ef7, #6f86fa)',
                border: 'none',
                boxShadow: '0 6px 16px rgba(79,110,247,0.32), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
