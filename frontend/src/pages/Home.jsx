import React, { useEffect, useState } from 'react'
import { Row, Col, Typography, Spin, Empty, Tag, Skeleton, Button, Modal, Image } from 'antd'
import {
  ReadOutlined,
  SendOutlined, ArrowRightOutlined,
  StarOutlined, PictureOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { journalApi, configApi } from '../services/api'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography

// 期刊封面渐变色循环
const COVER_COLORS = [
  'linear-gradient(160deg, #4f6ef7 0%, #818cf8 60%, #c4b5fd 100%)',
  'linear-gradient(160deg, #0ea5e9 0%, #38bdf8 60%, #7dd3fc 100%)',
  'linear-gradient(160deg, #f59e0b 0%, #fbbf24 60%, #fde68a 100%)',
  'linear-gradient(160deg, #10b981 0%, #34d399 60%, #6ee7b7 100%)',
  'linear-gradient(160deg, #8b5cf6 0%, #a78bfa 60%, #ddd6fe 100%)',
  'linear-gradient(160deg, #ef4444 0%, #f87171 60%, #fca5a5 100%)',
]

// ─── 期刊封面卡片（玻璃期刊风格）───────────────────────────────────
function JournalCoverCard({ journal, index }) {
  const navigate = useNavigate()
  const gradient = COVER_COLORS[index % COVER_COLORS.length]
  const isLatest = index === 0

  const handleClick = () => {
    journalApi.view(journal.id)
    if (journal.external_url) {
      window.open(journal.external_url, '_blank', 'noopener,noreferrer')
    } else {
      navigate(`/journal/${journal.id}`)
    }
  }

  return (
    <div className="journal-card" onClick={handleClick} style={{ position: 'relative' }}>
      {/* 最新期标记 */}
      {isLatest && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          background: 'linear-gradient(135deg, #ef4444, #f87171)',
          boxShadow: '0 4px 12px rgba(239,68,68,0.3), inset 0 1px 0 rgba(255,255,255,0.35)',
          color: '#fff', padding: '2px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
        }}>
          最新期
        </div>
      )}

      {/* 封面区 */}
      <div className="journal-card-cover" style={{
        height: 290, overflow: 'hidden', position: 'relative',
        background: journal.cover_url ? 'transparent' : gradient,
      }}>
        {journal.cover_url ? (
          <img
            src={journal.cover_url}
            alt={journal.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div style={{
            height: '100%', background: gradient,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: 24,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 3, marginBottom: 8 }}>
                EGO INTERNATIONAL
              </div>
              <div style={{
                fontSize: 20, fontWeight: 800, color: '#fff',
                letterSpacing: 2, lineHeight: 1.3, marginBottom: 8,
              }}>
                众瀚四季
              </div>
              <div style={{
                width: 40, height: 2, background: 'rgba(255,255,255,0.5)',
                margin: '8px auto',
              }} />
              <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>
                {journal.issue_no}
              </div>
            </div>
            <ReadOutlined style={{ fontSize: 28, color: 'rgba(255,255,255,0.3)', marginTop: 8 }} />
          </div>
        )}
        {/* 期号 badge */}
        <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
          <span className="issue-badge">{journal.issue_no}</span>
        </div>
      </div>

      {/* 信息区 */}
      <div style={{ padding: '10px 14px' }}>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4, color: '#94a3b8', lineHeight: 1.3 }}>
          {journal.title}
        </Text>
        {journal.description && (
          <Paragraph
            ellipsis={{ rows: 1 }}
            style={{ fontSize: 11, color: '#cbd5e1', margin: 0, lineHeight: 1.3 }}
          >
            {journal.description}
          </Paragraph>
        )}
      </div>
    </div>
  )
}

// ─── 入口卡片（玻璃质感）───────────────────────────────
const INFO_CARDS = [
  {
    key: 'about', path: '/about',
    title: '期刊简介', tag: '关于我们', color: '#4f6ef7',
    desc: '了解《众瀚四季》内刊的创刊背景、办刊宗旨与发展历程，感受企业文化的温度与力量。',
  },
  {
    key: 'editorial', path: '/editorial',
    title: '编辑部介绍', tag: '编辑部', color: '#10b981',
    desc: '认识我们的编辑团队，他们是内刊幕后的守护者，用文字和热情记录众瀚的每一个故事。',
  },
  {
    key: 'contribute', path: '/contribute',
    title: '文稿征集', tag: '投稿', color: '#f59e0b',
    desc: '欢迎全体同仁投稿，分享工作心得、生活故事、团队风采，让你的声音出现在《众瀚四��》。',
  },
]

function InfoCard({ card }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(card.path)}
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.65)',
        borderRadius: 20,
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.28s cubic-bezier(0.32,0.72,0,1), box-shadow 0.28s cubic-bezier(0.32,0.72,0,1)',
        boxShadow: '0 6px 22px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 16px 36px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.7)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 6px 22px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)'
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 4 }}>{card.title}</span>
      <span style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, display: 'block' }}>{card.desc}</span>
      <span style={{
        color: card.color, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10,
      }}>
        {card.tag} <ArrowRightOutlined style={{ fontSize: 11 }} />
      </span>
    </div>
  )
}

// ─── 主页 ────────────────────────────────────────────────────────────
export default function HomePage() {
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)
  const [posterModalOpen, setPosterModalOpen] = useState(false)
  const [posters, setPosters] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    journalApi.list({ published: true, page: 1, size: 20 })
      .then(res => setJournals(res.data?.items || res.data || []))
      .catch(() => setJournals([]))
      .finally(() => setLoading(false))
    configApi.getPublic().then(res => {
      const raw = res.data?.contribute_posters || []
      setPosters(Array.isArray(raw)
        ? raw.map(p => typeof p === 'string' ? { url: p, title: '' } : p)
        : [])
    }).catch(() => {})
  }, [])

  return (
    <div style={{ background: 'transparent', minHeight: '100vh' }}>

      {/* ──── Hero Banner — 保留暖色调 ──── */}
      <div style={{
        background: 'linear-gradient(135deg, #b45309 0%, #d97706 40%, #FAC02C 70%, #fde047 100%)',
        padding: '72px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装饰背景圆 */}
        <div style={{ position: 'absolute', right: '8%', top: '10%', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '18%', bottom: '-40%', width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '-4%', bottom: '-20%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            {/* 左侧文字 */}
            <div style={{ flex: '1 1 400px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 20,
                padding: '5px 14px', marginBottom: 20,
              }}>
                <StarOutlined style={{ color: '#fbbf24', fontSize: 12 }} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, letterSpacing: 2 }}>
                  众瀚国贸 · 企业内刊
                </span>
              </div>
              <h1 style={{
                color: '#fff', fontSize: 48, fontWeight: 900,
                margin: '0 0 8px', lineHeight: 1.15, letterSpacing: 1,
              }}>
                众瀚四季
              </h1>
              <div style={{
                color: 'rgba(255,255,255,0.6)', fontSize: 13, letterSpacing: 4,
                marginBottom: 20, fontWeight: 300,
              }}>
                EGO ENTERPRISE JOURNAL
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.82)', fontSize: 15.5, lineHeight: 1.85,
                margin: '0 0 32px', maxWidth: 520,
              }}>
                以文字为桥，以故事为媒，记录众瀚每一个成长的印记。<br />
                一刊一季，与你共同见证企业的温度与力量。
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ReadOutlined />}
                  onClick={() => document.getElementById('journal-list')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: '#fff', color: '#4f6ef7',
                    border: 'none', fontWeight: 700, borderRadius: 12,
                    height: 44, padding: '0 24px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    transition: 'transform 0.22s cubic-bezier(0.32,0.72,0,1), box-shadow 0.22s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 8px 26px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
                  }}
                >
                  浏览期刊
                </Button>
                <Button
                  size="large"
                  icon={<PictureOutlined />}
                  onClick={() => setPosterModalOpen(true)}
                  style={{
                    background: '#fff', color: '#4f6ef7',
                    border: 'none', fontWeight: 700,
                    borderRadius: 12, height: 44, padding: '0 24px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    transition: 'transform 0.22s cubic-bezier(0.32,0.72,0,1), box-shadow 0.22s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 8px 26px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)'
                  }}
                >
                  往期征稿
                </Button>
              </div>
            </div>

            {/* 右侧：期刊封面模拟卡片 */}
            <div style={{ flex: '0 0 auto', display: 'flex', gap: 16, alignItems: 'flex-end' }}>
              {journals.slice(0, 2).map((j, i) => (
                <div
                  key={j.id}
                  onClick={() => navigate(`/journal/${j.id}`)}
                  style={{
                    width: i === 0 ? 160 : 130,
                    height: i === 0 ? 220 : 185,
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: i === 0 ? '0 16px 48px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transform: i === 0 ? 'rotate(-1deg)' : 'rotate(2deg)',
                    transition: 'transform 0.3s',
                    background: COVER_COLORS[i],
                  }}
                >
                  {j.cover_url ? (
                    <img src={j.cover_url} alt={j.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      background: COVER_COLORS[i],
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16,
                    }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: 2 }}>EGO JOURNAL</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>众瀚四季</div>
                      <div style={{ width: 24, height: 1.5, background: 'rgba(255,255,255,0.4)', margin: '4px 0' }} />
                      <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>{j.issue_no}</div>
                    </div>
                  )}
                </div>
              ))}
              {journals.length === 0 && [0, 1].map(i => (
                <div key={i} style={{
                  width: i === 0 ? 160 : 130, height: i === 0 ? 220 : 185,
                  borderRadius: 12, background: COVER_COLORS[i],
                  boxShadow: i === 0 ? '0 16px 48px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.2)',
                  transform: i === 0 ? 'rotate(-1deg)' : 'rotate(2deg)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16,
                }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: 2 }}>EGO JOURNAL</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>众瀚四季</div>
                  <div style={{ width: 24, height: 1.5, background: 'rgba(255,255,255,0.4)', margin: '4px 0' }} />
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: 300 }}>{i === 0 ? '创刊号' : 'VOL.02'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ──── 入口卡片 ──── */}
      <div className="home-content-wrap" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <div className="info-card-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: -36,
          position: 'relative', zIndex: 10,
          marginBottom: 32,
        }}>
          {INFO_CARDS.map(card => (
            <InfoCard key={card.key} card={card} />
          ))}
        </div>

        {/* ──── 期刊列表 ──── */}
        <div id="journal-list">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>往期内刊</Title>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>每��期都是一段值得珍藏的记忆</div>
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(226,232,240,0.5)', marginLeft: 8 }} />
            {!loading && journals.length > 0 && (
              <div style={{
                fontSize: 12, fontWeight: 600, color: '#4f6ef7',
                background: 'rgba(79,110,247,0.07)', border: '1px solid rgba(79,110,247,0.14)',
                padding: '3px 13px', borderRadius: 999, flexShrink: 0,
              }}>
                共 {journals.length} 期
              </div>
            )}
          </div>

          {loading ? (
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4].map(i => (
                <Col key={i} xs={12} sm={12} md={8} lg={6}>
                  <Skeleton active style={{ height: 340, borderRadius: 20 }} />
                </Col>
              ))}
            </Row>
          ) : journals.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 0',
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(14px) saturate(160%)',
              WebkitBackdropFilter: 'blur(14px) saturate(160%)',
              borderRadius: 20, border: '1px solid rgba(255,255,255,0.65)',
              boxShadow: '0 6px 22px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
            }}>
              <ReadOutlined style={{ fontSize: 48, color: '#cbd5e1', display: 'block', marginBottom: 16 }} />
              <div style={{ color: '#94a3b8', fontSize: 15 }}>内刊正在精心筹备中，敬请期待</div>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {journals.map((journal, i) => (
                <Col key={journal.id} xs={12} sm={12} md={8} lg={6}>
                  <JournalCoverCard journal={journal} index={i} />
                </Col>
              ))}
            </Row>
          )}
        </div>

        <div style={{ height: 64 }} />
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
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.48)',
                  backdropFilter: 'blur(10px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(140%)',
                  borderRadius: 16,
                  overflow: 'hidden',
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
                  <Image
                    src={item.url}
                    alt={item.title || `征稿海报 ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    preview={true}
                    fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23f1f5f9' width='100%25' height='100%25'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23cbd5e1' font-size='14'%3E加载中...%3C/text%3E%3C/svg%3E"
                  />
                </div>
                {item.title && (
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{
                      fontSize: 13.5, fontWeight: 600, color: '#1e293b', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {item.title}
                    </div>
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
  )
}
