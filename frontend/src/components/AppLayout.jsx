import React from 'react'
import { Layout, Button, Space, Dropdown, Avatar, Typography } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  ReadOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'

const { Header, Content, Footer } = Layout
const { Text } = Typography

const NAV_ITEMS = [
  { key: '/', label: '首页', icon: <HomeOutlined /> },
  { key: '/about', label: '期刊简介', icon: <InfoCircleOutlined /> },
  { key: '/editorial', label: '编辑部', icon: <TeamOutlined /> },
  { key: '/contribute', label: '投稿', icon: <SendOutlined /> },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, token, logout } = useAuthStore()

  const userMenuItems = [
    ...(user?.role === 'admin' || user?.role === 'editor' ? [{
      key: 'admin',
      icon: <SettingOutlined />,
      label: '管理后台',
      onClick: () => navigate('/admin')
    }] : []),
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => { logout(); navigate('/login') }
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <Header
        className="glass-header"
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px', height: 64,
        }}
      >
        {/* Logo & 品牌 */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4f6ef7, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ReadOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: 1 }}>
              众瀚四季
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 2 }}>
              EGO ENTERPRISE JOURNAL
            </div>
          </div>
        </div>

        {/* 中间导航菜单 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_ITEMS.map(item => {
            const isActive = item.key === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.key)
            return (
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#4f6ef7' : '#64748b',
                  background: isActive ? 'rgba(79,110,247,0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#4f6ef7'
                    e.currentTarget.style.background = 'rgba(79,110,247,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#64748b'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {item.icon}
                {item.label}
              </div>
            )
          })}
        </div>

        {/* 右侧用户区 */}
        <Space size={12}>
          {token ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 8px', borderRadius: 8 }}>
                <Avatar
                  size={32}
                  style={{ background: 'linear-gradient(135deg, #4f6ef7, #818cf8)' }}
                  icon={<UserOutlined />}
                />
                <Text style={{ fontSize: 14, color: '#0f172a' }}>{user?.username}</Text>
              </div>
            </Dropdown>
          ) : (
            <>
              <Button
                onClick={() => navigate('/contribute')}
                style={{
                  borderColor: '#4f6ef7', color: '#4f6ef7',
                  borderRadius: 8, fontWeight: 600,
                }}
                icon={<SendOutlined />}
              >
                投稿
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => navigate('/login')}
                style={{ background: 'linear-gradient(135deg, #4f6ef7, #818cf8)', border: 'none', borderRadius: 8 }}
              >
                登录
              </Button>
            </>
          )}
        </Space>
      </Header>

      {/* 内容区 */}
      <Content style={{ padding: '0', flex: 1 }}>
        <Outlet />
      </Content>

      {/* 底部 */}
      <Footer style={{
        textAlign: 'center',
        background: 'transparent',
        color: '#94a3b8',
        fontSize: 12,
        padding: '24px 32px',
        borderTop: '1px solid #e8ecf2',
      }}>
        <div>© 2026 众瀚国贸 EGO International · 企业内刊《众瀚四季》</div>
        <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center', gap: 24 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/about')}>期刊简介</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/editorial')}>编辑部</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/contribute')}>投稿征集</span>
        </div>
      </Footer>
    </Layout>
  )
}
