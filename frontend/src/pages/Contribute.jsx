import React, { useState, useEffect } from 'react'
import { Typography, Row, Col, Spin, Modal, Image, Button, Empty } from 'antd'
import {
  SendOutlined, CheckCircleOutlined, BulbOutlined, PictureOutlined,
} from '@ant-design/icons'
import api from '../services/api'

const { Title, Paragraph } = Typography

const defaultConfig = {
  contribute_intro: '每一个人都有值得被记录的故事。欢迎全体同仁踊跃投稿，让你的声音出现在《众瀚四季》。',
  contribute_topics: '价值观故事|成长感悟|正能量故事|特定主题|文艺创作',
  contribute_topic_descs: '体现和发扬公司价值观（其中一条）的事例|关于自我成长历程中的印象最深刻的一件事|其他发生在自己或同事身上的正能量小故事|内部通知结合公司当下情形需要的特定主题|读书分享/旅游日记/日常随感/文艺散文',
  contribute_requirement_1: '文章结构清晰、表述通顺、紧扣主题、客观真实、有一定的文采',
  contribute_requirement_2: '篇幅不少于600字，配图更佳',
  contribute_requirement_3: '提交故事需包含：故事标题（自拟）、作者姓名及所属部门、完整的故事正文内容',
  contribute_rating: 'A:500元/8分|B:400元/5分|C:300元/3分|D:200元/2分',
  contribute_note: '编辑部收稿后5个工作日内反馈是否录用，录用稿件将进行编辑润色，不改变原意',
}

function parseRating(ratingStr) {
  if (!ratingStr) return []
  return ratingStr.split('|').map(item => {
    const [grade, rest] = item.split(':')
    const [reward, points] = rest.split('/')
    return { grade: grade.trim(), reward: reward.trim(), points: points.trim() }
  })
}

// 通用玻璃面板
const glassPanel = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.65)',
  borderRadius: 20,
  boxShadow: '0 6px 22px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
}

export default function ContributePage() {
  const [config, setConfig] = useState(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [posterModalOpen, setPosterModalOpen] = useState(false)

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

  const topics = (config.contribute_topics || '').split('|').filter(Boolean)
  const topicDescs = (config.contribute_topic_descs || '').split('|').filter(Boolean)
  const requirements = [
    config.contribute_requirement_1, config.contribute_requirement_2, config.contribute_requirement_3,
  ].filter(Boolean)
  const ratings = parseRating(config.contribute_rating)
  const rawPosters = config.contribute_posters || []
  const posters = Array.isArray(rawPosters)
    ? rawPosters.map((p) => typeof p === 'string' ? { url: p, title: '' } : { url: p.url || '', title: p.title || '' })
    : []

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #fb923c 100%)',
        padding: '52px 32px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '5%', top: '-10%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 16,
            color: 'rgba(255,255,255,0.9)', fontSize: 12, letterSpacing: 2, fontWeight: 500,
          }}>
            <SendOutlined />  CONTRIBUTE YOUR STORY
          </div>
          <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2 }}>文稿征集</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.8, margin: '0', maxWidth: 560 }}>
            {config.contribute_intro}
          </p>
        </div>
      </div>

      {/* 正文内容 */}
      <div style={{ maxWidth: 1000, margin: '-40px auto 0', padding: '0 32px 64px', position: 'relative', zIndex: 5 }}>

        {/* 供稿要求 */}
        <div style={{ ...glassPanel, padding: '36px 40px', marginBottom: 20 }}>
          <Title level={4} style={{ margin: '0 0 24px', color: '#1e293b', fontWeight: 800 }}>供稿要求</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {requirements.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 14, color: '#475569', lineHeight: 1.7,
              }}>
                <CheckCircleOutlined style={{ color: '#10b981', marginTop: 3, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* 投稿贴士 — 暖色玻璃 */}
        <div style={{
          background: 'rgba(255,251,235,0.65)',
          backdropFilter: 'blur(10px) saturate(140%)',
          WebkitBackdropFilter: 'blur(10px) saturate(140%)',
          border: '1px solid rgba(253,230,138,0.5)',
          borderRadius: 16, padding: '20px 28px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <BulbOutlined style={{ fontSize: 20, color: '#f59e0b', flexShrink: 0 }} />
          <div style={{ fontSize: 14, color: '#92400e', lineHeight: 1.7 }}>
            <strong>投稿贴士：</strong><br />不必追求完美，最真实的感受往往最动人。哪怕是一段工作中的小感悟，一次团建的快乐记忆，都是《众瀚四季》最欢迎的素材！
          </div>
        </div>

        {/* 征文主题 */}
        <div style={{ ...glassPanel, padding: '36px 40px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>征文主题</Title>
            {posters.length > 0 && (
              <Button
                type="primary"
                icon={<PictureOutlined />}
                onClick={() => setPosterModalOpen(true)}
                style={{
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #4f6ef7, #6f86fa)',
                  border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, height: 38,
                  paddingLeft: 18, paddingRight: 18,
                  boxShadow: '0 6px 16px rgba(79,110,247,0.32), inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
              >
                往期征稿
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topics.map((topic, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                background: 'rgba(255,255,255,0.45)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                borderRadius: 12, padding: '16px 20px',
                border: '1px solid rgba(255,255,255,0.5)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(79,110,247,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#4f6ef7' }}>{(i + 1).toString().padStart(2, '0')}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{topic}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{topicDescs[i] || ''}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 往期征稿弹窗 */}
          <Modal
            open={posterModalOpen}
            onCancel={() => setPosterModalOpen(false)}
            footer={null}
            width="900px"
            centered
            styles={{ body: { padding: '28px 24px', maxHeight: '78vh', overflowY: 'auto' } }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>往期征稿</h3>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>历次文稿征集活动精彩回顾</p>
            </div>
            {posters.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
                {posters.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.48)',
                    backdropFilter: 'blur(10px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(140%)',
                    borderRadius: 16, overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    transition: 'transform 0.28s cubic-bezier(0.32,0.72,0,1), box-shadow 0.28s',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)'
                      e.currentTarget.style.boxShadow = '0 16px 36px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.7)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.6)'
                    }}
                  >
                    <div style={{ width: '100%', height: 320, overflow: 'hidden', background: 'transparent' }}>
                      <Image src={item.url} alt={item.title || `征稿海报 ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        preview={true}
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23f1f5f9' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23cbd5e1' font-size='14'%3E加载中...%3C/text%3E%3C/svg%3E"
                      />
                    </div>
                    {item.title && (
                      <div style={{ padding: '12px 14px 14px' }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b', lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{item.title}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="暂无往期征稿海报" style={{ padding: '60px 0' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Modal>
        </div>

        {/* 供稿激励 */}
        <div style={{ ...glassPanel, padding: '36px 40px', marginBottom: 20 }}>
          <Title level={4} style={{ margin: '0 0 24px', color: '#1e293b', fontWeight: 800 }}>供稿激励</Title>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 20, lineHeight: 1.7 }}>
            文章经审核被采纳后，每篇好故事按评定标准给予一定的稿费和积分奖励
          </div>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(226,232,240,0.5)' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.4)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#64748b', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>评定结果</th>
                {ratings.map((r, i) => (
                  <th key={i} style={{ padding: '14px 20px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1e293b', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>{r.grade}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#64748b', borderBottom: '1px solid rgba(226,232,240,0.3)', background: 'rgba(255,255,255,0.3)' }}>稿费标准</td>
                {ratings.map((r, i) => (
                  <td key={i} style={{ padding: '14px 20px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{r.reward}</td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#64748b', background: 'rgba(255,255,255,0.3)' }}>个人积分</td>
                {ratings.map((r, i) => (
                  <td key={i} style={{ padding: '14px 20px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{r.points}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
