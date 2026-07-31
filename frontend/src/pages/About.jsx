import React, { useState, useEffect } from 'react'
import { Typography, Row, Col, Spin } from 'antd'
import {
  BookOutlined, CalendarOutlined, TeamOutlined, FileTextOutlined,
  HeartOutlined, MessageOutlined, ShareAltOutlined, StarOutlined,
} from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph } = Typography

const defaultConfig = {
  about_intro: '《众瀚四季》——众瀚国贸旗下企业内刊，记录成长，传递文化',
  about_columns: '卷首语、文化有你、经管资讯、人在众瀚、文化纪实',
  about_kanyin: '一刊一季，记录成长；一字一句，传递温度。\n《众瀚四季》是众瀚国贸的家，是每一位员工故事的容身之所，\n是企业文化最真实、最温暖的载体。',
  about_significance_title: '出刊意义',
  about_significance_subtitle: '我们为什么做这本内刊',
  about_significance_items: '记录员工故事|传递企业文化|搭建沟通桥梁|沉淀企业精神',
  about_dept: '人力资源部',
  about_cycle: '每季度',
  about_word_limit: '不少于600字',
}

const SIGNIFICANCE_COLORS = [
  { color: '#4f6ef7', bg: 'rgba(79,110,247,0.10)' },
  { color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
]

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(79,110,247,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <Title level={3} style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>{title}</Title>
      </div>
      {subtitle && <div style={{ fontSize: 13, color: '#64748b', marginLeft: 48 }}>{subtitle}</div>}
    </div>
  )
}

const COLUMN_COLORS = {
  '卷首语': { color: '#4f6ef7', bg: 'rgba(79,110,247,0.10)' },
  '文化有你': { color: '#06b6d4', bg: 'rgba(6,182,212,0.10)' },
  '经办资讯': { color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  '人在众瀚': { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  '文化纪实': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
}

// 通用玻璃面板样式
const glassPanel = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.65)',
  borderRadius: 20,
  boxShadow: '0 6px 22px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
}

export default function AboutPage() {
  const [config, setConfig] = useState(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/config/public')
      .then(res => {
        const data = res.data || {}
        setConfig(prev => ({ ...prev, ...data }))
      })
      .catch(err => console.error('加载配置失败', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ background: 'transparent', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  const columns = (config.about_columns || '').split(/[、，,|]/).filter(Boolean)

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      {/* 顶部 Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b5de7 50%, #818cf8 100%)',
        padding: '52px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '5%', top: '-10%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '3%', bottom: '-30%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 20,
            padding: '4px 14px', marginBottom: 16,
            color: 'rgba(255,255,255,0.85)', fontSize: 12, letterSpacing: 2, fontWeight: 500,
          }}>
            <BookOutlined />  ABOUT JOURNAL
          </div>
          <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>
            期刊简介
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15, lineHeight: 1.8, margin: 0, maxWidth: 600 }}>
            {config.about_intro}
          </p>
        </div>
      </div>

      {/* 正文内容 */}
      <div style={{ maxWidth: 1000, margin: '-40px auto 0', padding: '0 32px 64px', position: 'relative', zIndex: 5 }}>

        {/* 刊序引言卡片 — 玻璃面板 */}
        <div style={{ ...glassPanel, padding: '36px 40px', marginBottom: 24 }}>
          <div style={{ fontSize: 15, color: '#4f6ef7', fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
            " 刊 · 序
          </div>
          <Paragraph style={{
            fontSize: 16, lineHeight: 2, color: '#334155',
            margin: 0, fontStyle: 'italic', letterSpacing: 0.3,
          }}>
            {(config.about_kanyin || '').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </Paragraph>
        </div>

        {/* 主要栏目 — 玻璃面板 */}
        <div style={{ ...glassPanel, padding: '36px 40px', marginBottom: 24 }}>
          <SectionTitle
            icon={<BookOutlined style={{ fontSize: 18, color: '#f59e0b' }} />}
            title="主要栏目"
            subtitle="每一个栏目，都是一扇了解众瀚的窗口"
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {columns.map((name, i) => {
              const colorMap = COLUMN_COLORS[name] || { color: '#4f6ef7', bg: 'rgba(79,110,247,0.10)' }
              return (
                <div key={i} style={{
                  background: colorMap.bg,
                  color: colorMap.color,
                  padding: '10px 24px',
                  borderRadius: 24,
                  fontSize: 14,
                  fontWeight: 600,
                  border: `1.5px solid ${colorMap.color}22`,
                  backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                }}>
                  {name}
                </div>
              )
            })}
          </div>
        </div>

        {/* 出刊意义 — 玻璃面板 */}
        <div style={{ ...glassPanel, padding: '36px 40px', marginBottom: 24 }}>
          <SectionTitle
            icon={<HeartOutlined style={{ fontSize: 18, color: '#8b5cf6' }} />}
            title={config.about_significance_title || '出刊意义'}
            subtitle={config.about_significance_subtitle || ''}
          />
          <Row gutter={[16, 16]}>
            {(Array.isArray(config.about_significance_items)
              ? config.about_significance_items
              : (config.about_significance_items || '').split(/[、，,|]/).filter(Boolean)
            ).map((item, i) => {
              const c = SIGNIFICANCE_COLORS[i % SIGNIFICANCE_COLORS.length]
              const icons = [<HeartOutlined />, <MessageOutlined />, <ShareAltOutlined />, <StarOutlined />]
              const text = typeof item === 'string' ? item : item.title || JSON.stringify(item)
              return (
                <Col span={6} key={i}>
                  <div style={{
                    background: c.bg,
                    border: `1.5px solid ${c.color}22`,
                    borderRadius: 14,
                    padding: '20px 16px',
                    textAlign: 'center',
                    backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: c.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 14px',
                      border: `1.5px solid ${c.color}33`,
                    }}>
                      {React.cloneElement(icons[i % icons.length], { style: { fontSize: 20, color: c.color } })}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.color, lineHeight: 1.5 }}>
                      {text}
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </div>

        {/* 基础信息 — 三张玻璃卡片 */}
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ ...glassPanel, padding: '24px', borderRadius: 16, textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(79,110,247,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <TeamOutlined style={{ fontSize: 24, color: '#4f6ef7' }} />
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>主办部门</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{config.about_dept}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...glassPanel, padding: '24px', borderRadius: 16, textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(16,185,129,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <CalendarOutlined style={{ fontSize: 24, color: '#10b981' }} />
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>出版周期</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{config.about_cycle}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ ...glassPanel, padding: '24px', borderRadius: 16, textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(245,158,11,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <FileTextOutlined style={{ fontSize: 24, color: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>征稿字数</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{config.about_word_limit}</div>
            </div>
          </Col>
        </Row>

      </div>
    </div>
  )
}
