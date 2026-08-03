import React, { useEffect, useRef } from 'react'
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
  const headerRef = useRef(null)

  // 滚动时给顶栏加玻璃效果
  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('scrolled', window.scrollY > 10)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      {/* 顶部导航 — 完全透明，仅保留 1px 底边 */}
      <Header
        ref={headerRef}
        className="glass-header nav-header"
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px', height: 64,
        }}
      >
        {/* Logo & 品牌 — 36x36 渐变方块 + 彩色投影 */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: 'linear-gradient(135deg, #4f6ef7, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 6px 16px rgba(79,110,247,0.32), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}>
            <ReadOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: 1, whiteSpace: 'nowrap' }}>
              众瀚四季
            </div>
            <div className="nav-subtitle" style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 2, whiteSpace: 'nowrap', fontWeight: 400 }}>
              EGO ENTERPRISE JOURNAL
            </div>
          </div>
        </div>

        {/* 中间导航 — 胶囊 pill 风格 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {NAV_ITEMS.map(item => {
            const isActive = item.key === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.key)
            return (
              <div
                key={item.key}
                className="nav-item"
                onClick={() => navigate(item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 12, cursor: 'pointer',
                  fontSize: 14, fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#4f6ef7' : '#64748b',
                  background: isActive ? 'rgba(79,110,247,0.08)' : 'transparent',
                  transition: 'all 0.22s cubic-bezier(0.32, 0.72, 0, 1)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#4f6ef7'
                    e.currentTarget.style.background = 'rgba(79,110,247,0.06)'
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
                <span className="nav-label">{item.label}</span>
              </div>
            )
          })}
        </div>

        {/* 右侧用户区 */}
        <Space size={8} style={{ flexShrink: 0 }}>
          {token ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                padding: '4px 10px', borderRadius: 12,
                background: 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.6)',
                transition: 'all 0.22s cubic-bezier(0.32, 0.72, 0, 1)',
              }}>
                <Avatar
                  size={32}
                  style={{
                    background: 'linear-gradient(135deg, #4f6ef7, #818cf8)',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(79,110,247,0.25)',
                  }}
                  icon={<UserOutlined />}
                />
                <Text className="nav-label" style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{user?.username}</Text>
              </div>
            </Dropdown>
          ) : (
            <>
              <Button
                onClick={() => navigate('/contribute')}
                icon={<SendOutlined />}
                style={{
                  height: 34, lineHeight: '32px', fontSize: 14, fontWeight: 600,
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(10px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                  color: '#475569', border: '1px solid rgba(255,255,255,0.7)',
                  borderRadius: 12, padding: '0 16px',
                  boxShadow: '0 6px 22px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
                  transition: 'all 0.22s cubic-bezier(0.32, 0.72, 0, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#4f6ef7'
                  e.currentTarget.style.borderColor = 'rgba(79,110,247,0.4)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.7)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#475569'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.55)'
                }}
              >
                <span className="nav-contribute-text">投稿</span>
              </Button>
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                style={{
                  height: 34, lineHeight: '32px', fontSize: 14, fontWeight: 600,
                  background: 'linear-gradient(135deg, #4f6ef7, #6f86fa)',
                  border: 'none', borderRadius: 12, padding: '0 16px',
                  boxShadow: '0 6px 16px rgba(79,110,247,0.32), inset 0 1px 0 rgba(255,255,255,0.4)',
                  transition: 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.22s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(79,110,247,0.4), inset 0 1px 0 rgba(255,255,255,0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(79,110,247,0.32), inset 0 1px 0 rgba(255,255,255,0.4)'
                }}
              >
                登录
              </Button>
            </>
          )}
        </Space>
      </Header>

      {/* 内容区 */}
      <Content style={{ flex: 1 }}>
        <Outlet />
      </Content>

      {/* 底部 — 玻璃质感 */}
      <Footer style={{
        textAlign: 'center',
        background: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(12px) saturate(150%)',
        WebkitBackdropFilter: 'blur(12px) saturate(150%)',
        color: '#94a3b8',
        fontSize: 12,
        padding: '24px 32px',
        borderTop: '1px solid rgba(255,255,255,0.5)',
      }}>
        <div>© 2026 众瀚国贸 EGO International · 企业内刊《众瀚四季》</div>
        <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center', gap: 24 }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4f6ef7'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            onClick={() => navigate('/about')}>期刊简介</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4f6ef7'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            onClick={() => navigate('/editorial')}>编辑部</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4f6ef7'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            onClick={() => navigate('/contribute')}>投稿征集</span>
        </div>
      </Footer>
    </Layout>
  )
}
