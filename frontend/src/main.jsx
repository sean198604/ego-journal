import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import './styles/global.css'

import AppLayout from './components/AppLayout'
import HomePage from './pages/Home'
import JournalDetailPage from './pages/JournalDetail'
import ArticleDetailPage from './pages/ArticleDetail'
import AboutPage from './pages/About'
import EditorialPage from './pages/Editorial'
import ContributePage from './pages/Contribute'
import LoginPage from './pages/Login'
import AdminPage from './pages/admin/AdminPage'
import { useAuthStore } from './store/authStore'

function AdminRoute({ children }) {
  const token = useAuthStore(s => s.token)
  const user = useAuthStore(s => s.user)
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'admin' && user?.role !== 'editor') return <Navigate to="/" replace />
  return children
}

const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#4f6ef7',
    colorBgBase: '#f4f7fb',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#e8ecf2',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    borderRadius: 12,
    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN} theme={antdTheme}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* 前台：期刊展示 */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="journal/:id" element={<JournalDetailPage />} />
          <Route path="article/:id" element={<ArticleDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="editorial" element={<EditorialPage />} />
          <Route path="contribute" element={<ContributePage />} />
        </Route>

        {/* 管理后台 */}
        <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
)
