import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Spin, Tag, Button, Divider, Empty } from 'antd'
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, FileTextOutlined, StarOutlined } from '@ant-design/icons'
import { journalApi, articleApi } from '../services/api'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography

const CATEGORY_COLORS = {
  '总编寄语': '#4f6ef7', '企业动态': '#06b6d4', '人物故事': '#f59e0b',
  '团队风采': '#10b981', '学习园地': '#8b5cf6', '生活随笔': '#ef4444',
}

export default function JournalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [journal, setJournal] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      journalApi.get(id),
      articleApi.list(id, { size: 50 }),
    ]).then(([jRes, aRes]) => {
      setJournal(jRes.data)
      setArticles(aRes.data?.items || aRes.data || [])
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><Spin size="large" /></div>
  if (!journal) return <Empty description="期刊不存在" style={{ padding: 80 }} />

  // 精选文章
  const featured = articles.filter(a => a.is_featured)
  const regular = articles.filter(a => !a.is_featured)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* 返回 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: 24, border: 'none', background: 'transparent', color: '#64748b' }}
      >
        返回首页
      </Button>

      {/* 期刊头部信息 */}
      <div style={{
        background: 'linear-gradient(135deg, #4f6ef7 0%, #818cf8 100%)',
        borderRadius: 20, padding: '40px 48px', marginBottom: 48,
        display: 'flex', gap: 40, alignItems: 'center',
      }}>
        {/* 封面 */}
        <div style={{
          width: 120, height: 160, borderRadius: 12,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          {journal.cover_url
            ? <img src={journal.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <FileTextOutlined style={{ fontSize: 48, color: 'rgba(255,255,255,0.8)' }} />
          }
        </div>
        {/* 信息 */}
        <div>
          <span className="issue-badge" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', marginBottom: 12, display: 'inline-block' }}>
            {journal.issue_no}
          </span>
          <Title level={2} style={{ color: '#fff', margin: '8px 0 12px', fontWeight: 800 }}>
            {journal.title}
          </Title>
          {journal.description && (
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 16px', fontSize: 14, maxWidth: 500 }}>
              {journal.description}
            </Paragraph>
          )}
          <div style={{ display: 'flex', gap: 20, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            <span><CalendarOutlined style={{ marginRight: 6 }} />
              {journal.published_at ? dayjs(journal.published_at).format('YYYY年MM月DD日') : ''}
            </span>
            <span><EyeOutlined style={{ marginRight: 6 }} />{journal.view_count || 0} 次浏览</span>
            <span><FileTextOutlined style={{ marginRight: 6 }} />{articles.length} 篇文章</span>
          </div>
        </div>
      </div>

      {/* 精选文章 */}
      {featured.length > 0 && (
        <>
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <StarOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
            <Title level={5} style={{ margin: 0 }}>封面推荐</Title>
          </div>
          <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
            {featured.map(article => (
              <Col key={article.id} xs={24} md={12}>
                <ArticleCard article={article} navigate={navigate} featured />
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* 全部文章 */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <FileTextOutlined style={{ color: '#4f6ef7', fontSize: 18 }} />
        <Title level={5} style={{ margin: 0 }}>本期文章</Title>
        <div style={{ flex: 1, height: 1, background: '#e8ecf2' }} />
      </div>
      {regular.length === 0 && !featured.length ? (
        <Empty description="本期暂无文章" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Row gutter={[20, 20]}>
          {regular.map(article => (
            <Col key={article.id} xs={24} sm={12} md={8}>
              <ArticleCard article={article} navigate={navigate} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

function ArticleCard({ article, navigate, featured }) {
  const catColor = CATEGORY_COLORS[article.category?.name] || '#4f6ef7'
  return (
    <div
      className="article-card"
      onClick={() => navigate(`/article/${article.id}`)}
    >
      {article.cover_url && (
        <img
          src={article.cover_url}
          alt=""
          style={{ width: '100%', height: featured ? 160 : 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {article.category && (
          <span className="category-tag" style={{ background: `${catColor}15`, color: catColor }}>
            {article.category.name}
          </span>
        )}
        {article.is_featured && (
          <span className="featured-badge"><StarOutlined />精选</span>
        )}
      </div>
      <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 6, color: '#0f172a', lineHeight: 1.5 }}>
        {article.title}
      </Text>
      {article.summary && (
        <Text style={{ fontSize: 13, color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.summary}
        </Text>
      )}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: 12 }}>
        <span>{article.author}{article.department && ` · ${article.department}`}</span>
        <span><EyeOutlined style={{ marginRight: 4 }} />{article.view_count || 0}</span>
      </div>
    </div>
  )
}
