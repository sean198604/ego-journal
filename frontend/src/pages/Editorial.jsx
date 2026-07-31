import React, { useState, useEffect } from 'react'
import { Typography, Avatar, Tag, Row, Col, Spin } from 'antd'
import {
  TeamOutlined, UserOutlined,
  EditOutlined, CrownOutlined, BgColorsOutlined,
} from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph } = Typography

const defaultConfig = {
  editorial_intro: '一群怀揣热情的人，用文字与设计，守护每一期内刊的诞生',
  editorial_chief: '史金鑫 Jessie',
  editorial_chief_dept: '人力资源部',
  editorial_chief_desc: '负责内刊整体方向把控、内容审核及终稿定稿',
  editorial_deputy: '戴晶晶 Dora',
  editorial_deputy_dept: '人力资源部',
  editorial_deputy_desc: '协助主编开展编辑工作，统筹各栏目内容规划',
  editorial_designer: '史金鑫 Jessie',
  editorial_designer_dept: '人力资源部',
  editorial_designer_desc: '负责内刊排版设计、封面设计及图文配置',
  editorial_members: '李强Kobe、张凤ELim、周佳晨Lena、王璐瑶Ada、陈超女Claire、杨佳璐cici、柳璐妍Clara、李佳群Jacolyn',
  editorial_message: '我们是一群来自各部门、因热爱文字而走到一起的普通员工。\n我们相信，每一个人的故事都值得被记录，每一份努力都应该被看见。\n《众瀚四季》，是我们共同的作品，也是献给所有众瀚人的礼物。',
  editorial_contact_person: '史金鑫 Jessie',
  editorial_member_photos: {},
}

const CORE_PHOTOS = (config) => {
  const photos = config.editorial_member_photos || {}
  return [
    { role: '主编', name: config.editorial_chief, dept: config.editorial_chief_dept, desc: config.editorial_chief_desc, photo: photos.chief, color: '#4f6ef7', bg: 'rgba(79,110,247,0.10)', icon: <CrownOutlined style={{ fontSize: 24, color: '#4f6ef7' }} /> },
    { role: '副编', name: config.editorial_deputy, dept: config.editorial_deputy_dept, desc: config.editorial_deputy_desc, photo: photos.deputy, color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', icon: <EditOutlined style={{ fontSize: 24, color: '#8b5cf6' }} /> },
    { role: '排版', name: config.editorial_designer, dept: config.editorial_designer_dept, desc: config.editorial_designer_desc, photo: photos.designer, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', icon: <BgColorsOutlined style={{ fontSize: 24, color: '#f59e0b' }} /> },
  ]
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

function MemberCard({ member }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.48)',
      backdropFilter: 'blur(10px) saturate(140%)',
      WebkitBackdropFilter: 'blur(10px) saturate(140%)',
      border: '1px solid rgba(255,255,255,0.6)',
      borderRadius: 14,
      padding: '20px',
      display: 'flex', alignItems: 'center', gap: 14,
      transition: 'transform 0.25s cubic-bezier(0.32,0.72,0,1), box-shadow 0.25s, border-color 0.25s',
      boxShadow: '0 4px 12px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.7)'
        e.currentTarget.style.borderColor = (member.color || '#4f6ef7') + '44'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.6)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: member.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {member.photo
          ? <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }} />
          : null
        }
        {!member.photo && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {member.icon}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{member.name}</div>
        {member.dept && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{member.dept}</div>}
      </div>
      <div style={{
        background: member.bg, color: member.color,
        padding: '4px 10px', borderRadius: 16,
        fontSize: 11, fontWeight: 600,
      }}>
        {member.role}
      </div>
    </div>
  )
}

function EditorMemberCard({ member, index, photos }) {
  const memberList = Array.isArray(photos) ? photos : []
  const photo = memberList[index] || null
  return (
    <Col xs={12} sm={8} md={6} key={index}>
      <div style={{
        background: 'rgba(255,255,255,0.48)',
        backdropFilter: 'blur(10px) saturate(140%)',
        WebkitBackdropFilter: 'blur(10px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: 12,
        padding: '16px 20px', textAlign: 'center',
        transition: 'transform 0.25s cubic-bezier(0.32,0.72,0,1), box-shadow 0.25s',
        boxShadow: '0 3px 10px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.7)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 3px 10px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.6)'
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(16,185,129,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 10px', overflow: 'hidden',
        }}>
          {photo
            ? <img src={photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
            : <UserOutlined style={{ fontSize: 18, color: '#10b981' }} />
          }
        </div>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{member.name}</div>
      </div>
    </Col>
  )
}

export default function EditorialPage() {
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

  const EDITORIAL_TEAM = CORE_PHOTOS(config)
  const EDITOR_MEMBERS = (config.editorial_members || '').split(/[、,]/).filter(Boolean).map(name => ({ name }))

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 640px) {
          .editorial-content { padding: 0 12px 48px !important; margin-top: -20px !important; }
          .editorial-core-card { padding: 20px 16px !important; }
          .editorial-quote-card { padding: 24px 20px !important; }
        }
      `}</style>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
        padding: '52px 32px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '5%', top: '-10%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '3%', bottom: '-30%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 16,
            color: 'rgba(255,255,255,0.85)', fontSize: 12, letterSpacing: 2, fontWeight: 500,
          }}>
            <TeamOutlined />  EDITORIAL TEAM
          </div>
          <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>编辑部介绍</h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15, lineHeight: 1.8, margin: 0, maxWidth: 600 }}>
            {config.editorial_intro}
          </p>
        </div>
      </div>

      {/* 正文内容 */}
      <div className="editorial-content" style={{ maxWidth: 1000, margin: '-40px auto 0', padding: '0 32px 64px', position: 'relative', zIndex: 5 }}>

        {/* 核心团队 — 玻璃面��� */}
        <div className="editorial-core-card" style={{ ...glassPanel, padding: '32px 36px', marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <Title level={4} style={{ margin: '0 0 6px', color: '#1e293b', fontWeight: 800 }}>核心编辑团队</Title>
            <div style={{ fontSize: 13, color: '#64748b' }}>负责内刊整体内容策划、编辑与设计</div>
          </div>
          <Row gutter={[16, 16]}>
            {EDITORIAL_TEAM.map(member => (
              <Col xs={24} sm={8} key={member.role}>
                <MemberCard member={member} />
              </Col>
            ))}
          </Row>
        </div>

        {/* 编辑成员 */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: '0 0 6px', color: '#1e293b', fontWeight: 800 }}>编辑成员</Title>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
            来自各部门的优秀员工，用真实的故事让内刊更有温度
          </div>
          <Row gutter={[12, 12]}>
            {EDITOR_MEMBERS.map((member, i) => (
              <EditorMemberCard key={i} member={member} index={i} photos={(config.editorial_member_photos || {}).members || []} />
            ))}
          </Row>
        </div>

        {/* 编辑部寄语 — 玻璃面板 + 绿色左边框 */}
        <div style={{
          ...glassPanel,
          padding: '36px 40px',
          borderLeft: '4px solid #10b981',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 15, color: '#10b981', fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
            编辑部的话
          </div>
          <Paragraph style={{ fontSize: 15.5, lineHeight: 2, color: '#334155', margin: 0, letterSpacing: 0.3 }}>
            {(config.editorial_message || '').split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </Paragraph>
          <div style={{ marginTop: 16, fontSize: 13, color: '#94a3b8', textAlign: 'right' }}>
            ——《众瀚四季》编辑部
          </div>
        </div>

        {/* 纳新公告 — 暖色玻璃 */}
        <div style={{
          background: 'rgba(255,237,213,0.6)',
          backdropFilter: 'blur(10px) saturate(140%)',
          WebkitBackdropFilter: 'blur(10px) saturate(140%)',
          border: '1px solid rgba(251,146,60,0.3)',
          borderRadius: 16,
          padding: '20px 28px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TeamOutlined style={{ fontSize: 22, color: '#f59e0b' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#9a3412', marginBottom: 4 }}>
              编辑部持续纳新中
            </div>
            <div style={{ fontSize: 13, color: '#c2410c', lineHeight: 1.6 }}>
              欢迎有兴趣的小伙伴加入我们！
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
