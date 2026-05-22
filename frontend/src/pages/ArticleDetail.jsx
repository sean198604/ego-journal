import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Button, Spin, Divider, Space } from 'antd'
import { ArrowLeftOutlined, EyeOutlined, HeartOutlined, HeartFilled, CalendarOutlined, UserOutlined } from '@ant-design/icons'
import { articleApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export default function ArticleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    articleApi.get(id)
      .then(res => setArticle(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleLike = async () => {
    if (!token) return
    try {
      await articleApi.like(id)
      setLiked(true)
      setArticle(prev => ({ ...prev, like_count: (prev.like_count || 0) + 1 }))
    } catch {}
  }

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><Spin size="large" /></div>
  if (!article) return null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 32, border: 'none', background: 'transparent', color: '#64748b' }}
      >
        返回
      </Button>

      {/* 文章头 */}
      <div style={{ marginBottom: 32 }}>
        {article.category && (
          <span className="category-tag" style={{
            background: 'rgba(79,110,247,0.1)', color: '#4f6ef7', marginBottom: 16, display: 'inline-flex',
          }}>
            {article.category.name}
          </span>
        )}
        <Title level={1} style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1.4, margin: '12px 0 20px' }}>
          {article.title}
        </Title>
        <Space split={<Divider type="vertical" />} style={{ color: '#94a3b8', fontSize: 13 }}>
          {article.author && <span><UserOutlined style={{ marginRight: 6 }} />{article.author}{article.department && ` · ${article.department}`}</span>}
          {article.created_at && <span><CalendarOutlined style={{ marginRight: 6 }} />{dayjs(article.created_at).format('YYYY年MM月DD日')}</span>}
          <span><EyeOutlined style={{ marginRight: 6 }} />{article.view_count || 0} 次阅读</span>
        </Space>
      </div>

      {/* 封面图 */}
      {article.cover_url && (
        <img
          src={article.cover_url}
          alt=""
          style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 16, marginBottom: 40 }}
        />
      )}

      {/* 正文 */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content || '' }}
      />

      <Divider style={{ margin: '40px 0' }} />

      {/* 点赞 */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          size="large"
          icon={liked ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />}
          onClick={handleLike}
          disabled={liked || !token}
          style={{
            borderRadius: 40, padding: '0 32px',
            border: liked ? '1px solid #fca5a5' : '1px solid #e8ecf2',
            background: liked ? '#fff5f5' : '#fff',
            color: liked ? '#ef4444' : '#64748b',
          }}
        >
          {article.like_count || 0} 次点赞
        </Button>
      </div>
    </div>
  )
}
