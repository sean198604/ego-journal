import React, { useState, useEffect } from 'react'
import {
  Layout, Menu, Typography, Table, Button, Modal, Form, Input,
  Upload, Switch, Space, Popconfirm, message, Tag, DatePicker,
  Tabs, Divider, InputNumber, Row, Col, Spin, Empty, Card,
  Tooltip, Badge, List, Collapse, Select, Radio, Avatar, Image
} from 'antd'
import {
  BookOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  UploadOutlined, EyeOutlined, LinkOutlined, HomeOutlined,
  TeamOutlined, SendOutlined, InfoCircleOutlined,
  FileImageOutlined, CloudUploadOutlined, CheckCircleOutlined,
  ClockCircleOutlined, LogoutOutlined, SettingOutlined,
  UpOutlined, DownOutlined, HolderOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { journalApi, configApi, uploadApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import dayjs from 'dayjs'
import api from '../../services/api'

const { Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Panel } = Collapse

// ─── 站点配置（默认配置，数据库无数据时使用）───────────────────────────
const defaultConfig = {
  // 期刊简介页
  about_intro: '《众瀚四季》——众瀚国贸旗下企业内刊，记录成长，传递文化',
  about_significance_title: '出刊意义',
  about_significance_subtitle: '季刊作为公司传播企业文化的载休，是企业文化建设中内部宣传的重要方式',
  about_significance_items: [
    { title: '业务信息互通', desc: '业务成长、技能分享，打造众瀚知识文化共享平台' },
    { title: '员工交流及荣誉激励', desc: '树立标杆形象，传播正能量' },
    { title: '文化理念上传下达', desc: '传递众瀚企业文化精神' },
    { title: '沉淀公司历史', desc: '记录并传承众瀚重要事迹及人物故事' },
  ],
  about_dept: '人力资源部',
  about_cycle: '每季度',
  about_word_limit: '不少于600字',
  about_columns: '卷首语、文化有你、经办资讯、人在众瀚、文化纪实',
  about_kanyin: '一刊一季，记录成长；一字一句，传递温度。\n《众瀚四季》是众瀚国贸的家，是每一位员工故事的容身之所，\n是企业文化最真实、最温暖的载体。',

  // 编辑部介绍页
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

  // 文稿征集页
  contribute_intro: '每一个人都有值得被记录的故事。欢迎全体同仁踊跃投稿，让你的声音出现在《众瀚四季》。',
  contribute_topics: '价值观故事|成长感悟|正能量故事|特定主题|文艺创作',
  contribute_topic_descs: '体现和发扬公司价值观（其中一条）的事例|关于自我成长历程中的印象最深刻的一件事|其他发生在自己或同事身上的正能量小故事|内部通知结合公司当下情形需要的特定主题|读书分享/旅游日记/日常随感/文艺散文',
  contribute_requirement_1: '文章结构清晰、表述通顺、紧扣主题、客观真实、有一定的文采',
  contribute_requirement_2: '篇幅不少于600字，配图更佳',
  contribute_requirement_3: '提交故事需包含：故事标题（自拟）、作者姓名及所属部门、完整的故事正文内容',
  contribute_rating: 'A:500元/8分|B:400元/5分|C:300元/3分|D:200元/2分',
  contribute_note: '编辑部收稿后5个工作日内反馈是否录用，录用稿件将进行编辑润色，不改变原意',
  contribute_posters: [],
}

// ════════════════════════════════════════════════════════
//  一、期刊管理面板
// ════════════════════════════════════════════════════════
function JournalPanel() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()
  const [coverMode, setCoverMode] = useState('url')
  const [uploadedUrl, setUploadedUrl] = useState('')

  const load = () => {
    setLoading(true)
    journalApi.list({ page: 1, size: 50 })
      .then(res => setList(res.data?.items || []))
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setUploadedUrl('')
    setCoverMode('url')
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    form.setFieldsValue({
      title: record.title,
      issue_no: record.issue_no,
      cover_url: record.cover_url || '',
      description: record.description || '',
      published_at: record.published_at ? dayjs(record.published_at) : null,
      is_published: !!record.is_published,
      external_url: record.external_url || '',
    })
    setUploadedUrl(record.cover_url || '')
    setCoverMode(record.cover_url ? 'url' : 'url')
    setModalOpen(true)
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    setSaving(true)
    const payload = {
      title: values.title,
      issue_no: values.issue_no,
      cover_url: values.cover_url || uploadedUrl || '',
      description: values.description || '',
      published_at: values.published_at ? values.published_at.format('YYYY-MM-DD') : null,
      is_published: values.is_published ? 1 : 0,
      external_url: values.external_url || '',
    }
    try {
      if (editing) {
        await journalApi.update(editing.id, payload)
        message.success('更新成功')
      } else {
        await journalApi.create(payload)
        message.success('创建成功')
      }
      setModalOpen(false)
      load()
    } catch (e) {
      message.error(editing ? '更新失败' : '创建失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await journalApi.delete(id)
      message.success('已删除')
      load()
    } catch {
      message.error('删除失败')
    }
  }

  const handlePublish = async (id, current) => {
    try {
      if (current) {
        await journalApi.update(id, { is_published: 0 })
        message.success('已取消发布')
      } else {
        await journalApi.publish(id)
        message.success('已发布')
      }
      load()
    } catch {
      message.error('操作失败')
    }
  }

  const handleUpload = async ({ file }) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = res.data?.url || ''
      setUploadedUrl(url)
      form.setFieldValue('cover_url', url)
      message.success('封面上传成功')
    } catch {
      message.error('上传失败，请手动填写图片链接')
    }
    return false
  }

  const columns = [
    {
      title: '封面', dataIndex: 'cover_url', width: 70,
      render: url => url
        ? <img src={url} style={{ width: 44, height: 58, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8ecf2' }} />
        : <div style={{ width: 44, height: 58, background: 'linear-gradient(135deg, #4f6ef7, #818cf8)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
    },
    { title: '期号', dataIndex: 'issue_no', width: 100, render: v => <span className="issue-badge">{v}</span> },
    { title: '标题', dataIndex: 'title', render: (v, r) => (
      <div>
        <div style={{ fontWeight: 600, color: '#0f172a' }}>{v}</div>
        {r.external_url && (
          <a href={r.external_url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, color: '#4f6ef7', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <LinkOutlined /> 外部链接
          </a>
        )}
      </div>
    )},
    { title: '出版日期', dataIndex: 'published_at', width: 110, render: v => v ? dayjs(v).format('YYYY-MM') : '-' },
    { title: '阅读量', dataIndex: 'view_count', width: 80, render: v => v || 0 },
    {
      title: '状态', dataIndex: 'is_published', width: 90,
      render: (v, r) => (
        <Tag
          color={v ? 'success' : 'default'}
          icon={v ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          style={{ cursor: 'pointer' }}
          onClick={() => handlePublish(r.id, !!v)}
        >
          {v ? '已发布' : '草稿'}
        </Tag>
      )
    },
    {
      title: '操作', width: 120,
      render: (_, r) => (
        <Space size={6}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>期刊管理</Title>
          <Text style={{ color: '#94a3b8', fontSize: 13 }}>管理内刊期号、封面图和外部阅读链接</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: 'linear-gradient(135deg, #4f6ef7, #818cf8)', border: 'none', borderRadius: 8 }}>
          新增期刊
        </Button>
      </div>

      <Table
        dataSource={list} columns={columns} rowKey="id"
        loading={loading} size="middle"
        style={{ background: '#fff', borderRadius: 12 }}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title={editing ? `编辑期刊：${editing.issue_no}` : '新增期刊'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
        confirmLoading={saving}
        width={620}
        styles={{ body: { paddingTop: 8 } }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="issue_no" label="期号" rules={[{ required: true, message: '请填写期号' }]}>
                <Input placeholder="如：创刊号 / VOL.02 / 2025春季刊" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="published_at" label="出版日期">
                <DatePicker picker="month" style={{ width: '100%' }} placeholder="选择出版年月" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="title" label="期刊标题" rules={[{ required: true, message: '请填写标题' }]}>
            <Input placeholder="如：众瀚四季·2025春季刊" />
          </Form.Item>

          <Form.Item name="description" label="期刊简介">
            <TextArea rows={3} placeholder="这一期内刊的主题或简要介绍..." />
          </Form.Item>

          <Form.Item label={
            <Space>
              封面图
              <div style={{ display: 'flex', gap: 8 }}>
                <Tag color={coverMode === 'url' ? 'blue' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setCoverMode('url')}>
                  <LinkOutlined /> 输入链接
                </Tag>
                <Tag color={coverMode === 'upload' ? 'blue' : 'default'} style={{ cursor: 'pointer' }} onClick={() => setCoverMode('upload')}>
                  <UploadOutlined /> 上传图片
                </Tag>
              </div>
            </Space>
          }>
            {coverMode === 'url' ? (
              <Form.Item name="cover_url" noStyle>
                <Input placeholder="封面图片 URL，留空则显示默认渐变封面" prefix={<LinkOutlined style={{ color: '#94a3b8' }} />} />
              </Form.Item>
            ) : (
              <div>
                <Upload customRequest={handleUpload} showUploadList={false} accept="image/*">
                  <Button icon={<CloudUploadOutlined />}>点击上传封面图</Button>
                </Upload>
                {uploadedUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img src={uploadedUrl} style={{ height: 80, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ 已上传</div>
                  </div>
                )}
              </div>
            )}
          </Form.Item>

          <Form.Item name="external_url" label={<Space><LinkOutlined />外部阅读链接<Tooltip title="填写后，点击期刊封面会跳转到此链接"><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Space>}>
            <Input placeholder="https://docs.qq.com/... 或 PDF链接，留空则跳转内页" prefix={<LinkOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          {editing && (
            <Form.Item name="is_published" label="发布状态">
              <Radio.Group>
                <Radio value={true}><Tag color="success">已发布</Tag></Radio>
                <Radio value={false}><Tag color="default">草稿</Tag></Radio>
              </Radio.Group>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════
//  二、内容管理面板（完整版）
// ════════════════════════════════════════════════════════
//  二、内容管理面板
// ════════════════════════════════════════════════════════
function ContentPanel() {
  const [config, setConfig] = useState(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeAbout, setActiveAbout] = useState(['significance'])
  const [activeEditorial, setActiveEditorial] = useState(['team'])
  const [activeContribute, setActiveContribute] = useState(['topics'])

  // 成员照片状态（从 editorial_member_photos 解析）
  const [memberPhotos, setMemberPhotos] = useState({ chief: '', deputy: '', designer: '', members: [] })

  // 编辑成员名单（按顿号顺序，与照片索引对应）
  const EDITOR_MEMBER_NAMES = (config.editorial_members || '').split(/[、,]/).filter(Boolean)

  // 核心团队照片上传
  const uploadPhoto = async (role, file) => {
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await uploadApi.image(fd)
      const url = res.data?.url || res.data?.path || ''
      if (!url) { message.error('上传失败'); return }
      setMemberPhotos(prev => ({ ...prev, [role]: url }))
      setConfig(prev => {
        const photos = { ...(prev.editorial_member_photos || {}), [role]: url }
        return { ...prev, editorial_member_photos: photos }
      })
      message.success('照片已更新，保存页面生效')
    } catch {
      message.error('上传失败')
    }
  }

  // 编辑成员照片上传（按索引）
  const uploadMemberPhoto = async (index, file) => {
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await uploadApi.image(fd)
      const url = res.data?.url || res.data?.path || ''
      if (!url) { message.error('上传失败'); return }
      setMemberPhotos(prev => {
        const members = [...(prev.members || [])]
        members[index] = url
        return { ...prev, members }
      })
      setConfig(prev => {
        const photos = { ...(prev.editorial_member_photos || {}), members: [...((prev.editorial_member_photos || {}).members || [])] }
        photos.members[index] = url
        return { ...prev, editorial_member_photos: photos }
      })
      message.success('照片已更新，保存页面生效')
    } catch {
      message.error('上传失败')
    }
  }

  // 往期征稿海报上传（上传后弹窗输入标题）
  const handlePosterUpload = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await uploadApi.image(fd)
      const url = res.data?.url || res.data?.path || ''
      if (!url) { message.error('上传失败'); return }
      // 弹窗输入标题
      let title = ''
      Modal.confirm({
        title: '输入海报标题',
        content: (
          <Input
            placeholder="例如：女神节·文化互动"
            onChange={(e) => { title = e.target.value }}
            style={{ marginTop: 12 }}
          />
        ),
        okText: '确认',
        cancelText: '跳过',
        onOk: () => {
          setConfig(prev => ({
            ...prev,
            contribute_posters: [...getPosters(), { url, title: title.trim() }],
          }))
          message.success('海报已添加，保存页面生效')
        },
        onCancel: () => {
          setConfig(prev => ({
            ...prev,
            contribute_posters: [...getPosters(), { url, title: '' }],
          }))
          message.success('海报已添加，保存页面生效')
        },
      })
    } catch {
      message.error('上传失败')
    }
  }

  // 获取海报列表（兼容新旧格式）
  const getPosters = () => {
    const raw = config.contribute_posters || []
    if (!Array.isArray(raw)) return []
    return raw.map(p => typeof p === 'string' ? { url: p, title: '' } : p)
  }

  // 往期征稿海报标题修改
  const handlePosterTitleUpdate = (index, newTitle) => {
    setConfig(prev => {
      const posters = getPosters()
      posters[index] = { ...posters[index], title: newTitle }
      return { ...prev, contribute_posters: posters }
    })
  }

  // 往期征稿海报排序（上移/下移）
  const handlePosterMove = (index, direction) => {
    setConfig(prev => {
      const posters = getPosters()
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= posters.length) return prev
      ;[posters[index], posters[targetIndex]] = [posters[targetIndex], posters[index]]
      return { ...prev, contribute_posters: posters }
    })
  }

  // 往期征稿海报删除
  const handlePosterDelete = (index) => {
    setConfig(prev => {
      const posters = getPosters()
      posters.splice(index, 1)
      return { ...prev, contribute_posters: posters }
    })
    message.info('已移除，保存后生效')
  }

  // 从后端加载配置后，同步 memberPhotos
  useEffect(() => {
    if (!loading && config.editorial_member_photos) {
      const p = config.editorial_member_photos
      setMemberPhotos({
        chief: p.chief || '',
        deputy: p.deputy || '',
        designer: p.designer || '',
        members: Array.isArray(p.members) ? p.members : [],
      })
    }
  }, [loading])

  // 从后端加载配置
  useEffect(() => {
    configApi.getPublic()
      .then(res => {
        // 后端返回的 JSON 解析后的对象
        const data = res.data || {}
        setConfig(prev => ({ ...prev, ...data }))
      })
      .catch(err => {
        console.error('加载配置失败', err)
        message.warning('从数据库加载配置失败，使用默认配置')
      })
      .finally(() => setLoading(false))
  }, [])

  // 保存到后端
  const save = async () => {
    setSaving(true)
    try {
      // 将配置转换为后端需要的格式
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value || ''),
      }))
      await configApi.batchUpdate(updates)
      message.success('内容已保存到数据库，刷新前台页面查看效果')
    } catch (err) {
      console.error('保存失败', err)
      message.error('保存失败：' + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  const update = (key, val) => setConfig(c => ({ ...c, [key]: val }))

  // 出刊意义项目编辑
  const updateSignificanceItem = (index, field, val) => {
    const items = [...(config.about_significance_items || [])]
    items[index] = { ...items[index], [field]: val }
    update('about_significance_items', items)
  }

  // 征文主题编辑
  const getTopics = () => (config.contribute_topics || '').split('|').filter(Boolean)
  const getTopicDescs = () => (config.contribute_topic_descs || '').split('|').filter(Boolean)
  const updateTopic = (index, val) => {
    const topics = getTopics()
    topics[index] = val
    update('contribute_topics', topics.join('|'))
  }
  const updateTopicDesc = (index, val) => {
    const descs = getTopicDescs()
    descs[index] = val
    update('contribute_topic_descs', descs.join('|'))
  }

  // 编辑成员列表
  const getMembers = () => (config.editorial_members || '').split('、').filter(Boolean)
  const updateMember = (index, val) => {
    const members = getMembers()
    members[index] = val
    update('editorial_members', members.join('、'))
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: '#94a3b8' }}>正在从数据库加载配置...</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>内容管理</Title>
          <Text style={{ color: '#94a3b8', fontSize: 13 }}>编辑期刊简介、编辑部介绍和征稿说明页面内容（保存到数据库）</Text>
        </div>
        <Tag color="blue">数据存储：MySQL</Tag>
      </div>

      <Tabs
        defaultActiveKey="about"
        tabBarStyle={{ marginBottom: 20 }}
        items={[
          // ════ 期刊简介页 ════
          {
            key: 'about',
            label: <span><InfoCircleOutlined /> 期刊简介</span>,
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card title="Banner 区域" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="副标题（Banner 中展示）" style={{ margin: 0 }}>
                    <TextArea
                      value={config.about_intro}
                      onChange={e => update('about_intro', e.target.value)}
                      rows={2}
                      placeholder="简短的内刊介绍语"
                    />
                  </Form.Item>
                </Card>

                <Card title="基础信息卡片" size="small" style={{ borderRadius: 12 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="主办部门" style={{ margin: 0 }}>
                        <Input value={config.about_dept} onChange={e => update('about_dept', e.target.value)} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="出版周期" style={{ margin: 0 }}>
                        <Input value={config.about_cycle} onChange={e => update('about_cycle', e.target.value)} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="征稿字数" style={{ margin: 0 }}>
                        <Input value={config.about_word_limit} onChange={e => update('about_word_limit', e.target.value)} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card title="主要栏目（用 | 分隔）" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="栏目名称列表" style={{ margin: 0 }}>
                    <Input
                      value={config.about_columns}
                      onChange={e => update('about_columns', e.target.value)}
                      placeholder="卷首语、文化有你、经办资讯、人在众瀚、文化纪实"
                    />
                  </Form.Item>
                </Card>

                <Collapse
                  activeKey={activeAbout}
                  onChange={setActiveAbout}
                  style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf2' }}
                >
                  <Panel header="出刊意义（4条）" key="significance">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <Form.Item label="小节副标题" style={{ margin: 0, marginBottom: 12 }}>
                        <Input
                          value={config.about_significance_subtitle}
                          onChange={e => update('about_significance_subtitle', e.target.value)}
                          placeholder="出刊意义的副标题说明"
                        />
                      </Form.Item>
                      {(config.about_significance_items || []).map((item, i) => (
                        <Row key={i} gutter={8} align="middle">
                          <Col span={5}>
                            <Input
                              value={item.title}
                              onChange={e => updateSignificanceItem(i, 'title', e.target.value)}
                              placeholder="标题"
                            />
                          </Col>
                          <Col span={17}>
                            <Input
                              value={item.desc}
                              onChange={e => updateSignificanceItem(i, 'desc', e.target.value)}
                              placeholder="描述内容"
                            />
                          </Col>
                          <Col span={2}>
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>#{i + 1}</Text>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  </Panel>
                </Collapse>

                <Card title="刊序引言" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="刊序内容" style={{ margin: 0 }}>
                    <TextArea
                      value={config.about_kanyin}
                      onChange={e => update('about_kanyin', e.target.value)}
                      rows={4}
                      placeholder="刊序的正文内容"
                    />
                  </Form.Item>
                </Card>
              </div>
            ),
          },

          // ════ 编辑部介绍页 ════
          {
            key: 'editorial',
            label: <span><TeamOutlined /> 编辑部介绍</span>,
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card title="Banner 区域" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="副标题" style={{ margin: 0 }}>
                    <Input
                      value={config.editorial_intro}
                      onChange={e => update('editorial_intro', e.target.value)}
                      placeholder="编辑部介绍 Banner 副标题"
                    />
                  </Form.Item>
                </Card>

                <Collapse
                  activeKey={activeEditorial}
                  onChange={setActiveEditorial}
                  style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf2' }}
                >
                  <Panel header="核心团队成员" key="team">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <Divider orientation="left" plain style={{ margin: '8px 0', fontSize: 12 }}>期刊主编</Divider>
                      <Row gutter={12}>
                        <Col span={8}><Form.Item label="姓名" style={{ margin: 0 }}><Input value={config.editorial_chief} onChange={e => update('editorial_chief', e.target.value)} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="部门" style={{ margin: 0 }}><Input value={config.editorial_chief_dept} onChange={e => update('editorial_chief_dept', e.target.value)} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="职责" style={{ margin: 0 }}><Input value={config.editorial_chief_desc} onChange={e => update('editorial_chief_desc', e.target.value)} /></Form.Item></Col>
                      </Row>
                      <Divider orientation="left" plain style={{ margin: '8px 0', fontSize: 12 }}>期刊副编</Divider>
                      <Row gutter={12}>
                        <Col span={8}><Form.Item label="姓名" style={{ margin: 0 }}><Input value={config.editorial_deputy} onChange={e => update('editorial_deputy', e.target.value)} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="部门" style={{ margin: 0 }}><Input value={config.editorial_deputy_dept} onChange={e => update('editorial_deputy_dept', e.target.value)} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="职责" style={{ margin: 0 }}><Input value={config.editorial_deputy_desc} onChange={e => update('editorial_deputy_desc', e.target.value)} /></Form.Item></Col>
                      </Row>
                      <Divider orientation="left" plain style={{ margin: '8px 0', fontSize: 12 }}>排版设计</Divider>
                      <Row gutter={12}>
                        <Col span={8}><Form.Item label="姓名" style={{ margin: 0 }}><Input value={config.editorial_designer} onChange={e => update('editorial_designer', e.target.value)} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="部门" style={{ margin: 0 }}><Input value={config.editorial_designer_dept} onChange={e => update('editorial_designer_dept', e.target.value)} /></Form.Item></Col>
                        <Col span={8}><Form.Item label="职责" style={{ margin: 0 }}><Input value={config.editorial_designer_desc} onChange={e => update('editorial_designer_desc', e.target.value)} /></Form.Item></Col>
                      </Row>
                    </div>
                  </Panel>
                </Collapse>

                <Card title="成员照片管理" size="small" style={{ borderRadius: 12 }}>
                  {/* 核心团队照片 */}
                  <div style={{ marginBottom: 16 }}>
                    <Divider orientation="left" plain style={{ margin: '4px 0', fontSize: 12 }}>核心团队</Divider>
                    <Row gutter={[12, 12]}>
                      {/* 主编 */}
                      <Col span={8}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {memberPhotos.chief
                            ? <Avatar src={memberPhotos.chief} size={48} style={{ flexShrink: 0 }} />
                            : <Avatar size={48} style={{ background: '#4f6ef7', flexShrink: 0 }}>主</Avatar>
                          }
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>期刊主编</div>
                            <Upload
                              showUploadList={false}
                              beforeUpload={file => { uploadPhoto('chief', file); return false; }}
                            >
                              <Button size="small" icon={<UploadOutlined />}>{memberPhotos.chief ? '更换' : '上传'}</Button>
                            </Upload>
                          </div>
                        </div>
                      </Col>
                      {/* 副编 */}
                      <Col span={8}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {memberPhotos.deputy
                            ? <Avatar src={memberPhotos.deputy} size={48} style={{ flexShrink: 0 }} />
                            : <Avatar size={48} style={{ background: '#8b5cf6', flexShrink: 0 }}>副</Avatar>
                          }
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>期刊副编</div>
                            <Upload
                              showUploadList={false}
                              beforeUpload={file => { uploadPhoto('deputy', file); return false; }}
                            >
                              <Button size="small" icon={<UploadOutlined />}>{memberPhotos.deputy ? '更换' : '上传'}</Button>
                            </Upload>
                          </div>
                        </div>
                      </Col>
                      {/* 排版设计 */}
                      <Col span={8}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {memberPhotos.designer
                            ? <Avatar src={memberPhotos.designer} size={48} style={{ flexShrink: 0 }} />
                            : <Avatar size={48} style={{ background: '#f59e0b', flexShrink: 0 }}>设</Avatar>
                          }
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>排版设计</div>
                            <Upload
                              showUploadList={false}
                              beforeUpload={file => { uploadPhoto('designer', file); return false; }}
                            >
                              <Button size="small" icon={<UploadOutlined />}>{memberPhotos.designer ? '更换' : '上传'}</Button>
                            </Upload>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 编辑成员照片 */}
                  <div>
                    <Divider orientation="left" plain style={{ margin: '4px 0', fontSize: 12 }}>编辑成员（按顿号顺序对应）</Divider>
                    <Row gutter={[12, 12]}>
                      {EDITOR_MEMBER_NAMES.map((name, i) => (
                        <Col span={6} key={i}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {memberPhotos.members?.[i]
                              ? <Avatar src={memberPhotos.members[i]} size={40} style={{ flexShrink: 0 }} />
                              : <Avatar size={40} style={{ background: '#10b981', flexShrink: 0, fontSize: 12 }}>{name.slice(0, 2)}</Avatar>
                            }
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                              <Upload
                                showUploadList={false}
                                beforeUpload={file => { uploadMemberPhoto(i, file); return false; }}
                              >
                                <Button size="small" icon={<UploadOutlined />} style={{ fontSize: 11 }}>{memberPhotos.members?.[i] ? '换' : '上传'}</Button>
                              </Upload>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Card>

                <Card title="编辑成员（用顿号分隔）" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="成员列表" style={{ margin: 0 }}>
                    <TextArea
                      value={config.editorial_members}
                      onChange={e => update('editorial_members', e.target.value)}
                      rows={2}
                      placeholder="李强Kobe、张凤ELim、周佳晨Lena..."
                    />
                  </Form.Item>
                </Card>

                <Card title="编辑部寄语" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="寄语内容" style={{ margin: 0 }}>
                    <TextArea
                      value={config.editorial_message}
                      onChange={e => update('editorial_message', e.target.value)}
                      rows={4}
                      placeholder="编辑部的话..."
                    />
                  </Form.Item>
                </Card>

                <Card title="联系人" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="联系人（中文+英文）" style={{ margin: 0 }}>
                    <Input value={config.editorial_contact_person} onChange={e => update('editorial_contact_person', e.target.value)} placeholder="史金鑫 Jessie" />
                  </Form.Item>
                </Card>
              </div>
            ),
          },

          // ════ 文稿征集页 ════
          {
            key: 'contribute',
            label: <span><SendOutlined /> 文稿征集</span>,
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card title="Banner 区域" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="副标题" style={{ margin: 0 }}>
                    <TextArea
                      value={config.contribute_intro}
                      onChange={e => update('contribute_intro', e.target.value)}
                      rows={2}
                      placeholder="文稿征集 Banner 副标题"
                    />
                  </Form.Item>
                </Card>

                <Collapse
                  activeKey={activeContribute}
                  onChange={setActiveContribute}
                  style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf2' }}
                >
                  <Panel header="征文主题（5条）" key="topics">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {getTopics().map((topic, i) => (
                        <Row key={i} gutter={8} align="middle">
                          <Col span={6}>
                            <Input value={topic} onChange={e => updateTopic(i, e.target.value)} placeholder="主题名称" />
                          </Col>
                          <Col span={16}>
                            <Input value={getTopicDescs()[i] || ''} onChange={e => updateTopicDesc(i, e.target.value)} placeholder="主题描述" />
                          </Col>
                          <Col span={2}>
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>{(i + 1).toString().padStart(2, '0')}</Text>
                          </Col>
                        </Row>
                      ))}
                      <Text type="secondary" style={{ fontSize: 12 }}>提示：主题名称和描述用 | 分隔保存</Text>
                    </div>
                  </Panel>
                </Collapse>

                <Card title="供稿要求（3条）" size="small" style={{ borderRadius: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Form.Item label="要求1" style={{ margin: 0 }}>
                      <Input value={config.contribute_requirement_1} onChange={e => update('contribute_requirement_1', e.target.value)} />
                    </Form.Item>
                    <Form.Item label="要求2" style={{ margin: 0 }}>
                      <Input value={config.contribute_requirement_2} onChange={e => update('contribute_requirement_2', e.target.value)} />
                    </Form.Item>
                    <Form.Item label="要求3" style={{ margin: 0 }}>
                      <Input value={config.contribute_requirement_3} onChange={e => update('contribute_requirement_3', e.target.value)} />
                    </Form.Item>
                  </div>
                </Card>

                <Card title="激励标准" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="等级标准（格式：A:稿费/积分|B:稿费/积分）" style={{ margin: 0 }}>
                    <Input
                      value={config.contribute_rating}
                      onChange={e => update('contribute_rating', e.target.value)}
                      placeholder="A:500元/8分|B:400元/5分|C:300元/3分|D:200元/2分"
                    />
                  </Form.Item>
                </Card>

                <Card title="其他说明" size="small" style={{ borderRadius: 12 }}>
                  <Form.Item label="截稿说明" style={{ margin: 0 }}>
                    <TextArea
                      value={config.contribute_note}
                      onChange={e => update('contribute_note', e.target.value)}
                      rows={3}
                      placeholder="编辑部收稿后的处理说明..."
                    />
                  </Form.Item>
                </Card>

                {/* 往期征稿海报管理 */}
                <Card
                  title={<Space><FileImageOutlined />往期征稿海报</Space>}
                  size="small"
                  style={{ borderRadius: 12 }}
                  extra={
                    <Upload
                      showUploadList={false}
                      beforeUpload={file => { handlePosterUpload(file); return false; }}
                      accept="image/*"
                    >
                      <Button type="primary" size="small" icon={<CloudUploadOutlined />} style={{ borderRadius: 6 }}>
                        上传海报
                      </Button>
                    </Upload>
                  }
                >
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 14 }}>
                    上传历次征稿活动海报，可设置标题和排序顺序，前台以小红书卡片风格展示
                  </Text>
                  {getPosters().length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {getPosters().map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 10,
                          padding: '10px 12px',
                        }}>
                          {/* 缩略图 */}
                          <Image
                            src={item.url}
                            width={72}
                            height={96}
                            style={{ objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                            fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='96'%3E%3Crect fill='%23e2e8f0' width='100%25' height='100%25' rx='6'/%3E%3C/svg%3E"
                          />

                          {/* 标题 + 序号 + 操作 */}
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* 排序按钮 */}
                            <Button
                              size="small" icon={<UpOutlined />} disabled={idx === 0}
                              onClick={() => handlePosterMove(idx, 'up')}
                              style={{ flexShrink: 0, fontSize: 11 }}
                            />
                            <Button
                              size="small" icon={<DownOutlined />} disabled={idx === getPosters().length - 1}
                              onClick={() => handlePosterMove(idx, 'down')}
                              style={{ flexShrink: 0, fontSize: 11 }}
                            />

                            <Tag color="processing" style={{ flexShrink: 0, margin: 0 }}>#{idx + 1}</Tag>

                            {/* 标题输入 */}
                            <Input
                              value={item.title || ''}
                              onChange={(e) => handlePosterTitleUpdate(idx, e.target.value)}
                              placeholder={`海报标题（留空则不显示）`}
                              size="small"
                              style={{ flex: 1, minWidth: 0 }}
                            />

                            {/* 删除按钮 */}
                            <Popconfirm
                              title="确定删除这张海报？"
                              onConfirm={() => handlePosterDelete(idx)}
                              okText="删除"
                              cancelText="取消"
                              okButtonProps={{ danger: true, size: 'small' }}
                            >
                              <Button size="small" danger icon={<DeleteOutlined />} style={{ flexShrink: 0 }} />
                            </Popconfirm>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="暂无海报，点击右上角上传" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '20px 0' }} />
                  )}
                </Card>
              </div>
            ),
          },
        ]}
      />

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Button
          type="primary"
          loading={saving}
          onClick={save}
          style={{ background: 'linear-gradient(135deg, #4f6ef7, #818cf8)', border: 'none', borderRadius: 8, height: 40, padding: '0 28px' }}
        >
          保存所有内容
        </Button>
        <Button
          onClick={() => setConfig({ ...defaultConfig })}
          loading={loading}
        >
          重置默认
        </Button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════
//  主管理页面
// ════════════════════════════════════════════════════════
export default function AdminPage() {
  const [current, setCurrent] = useState('journals')
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const menuItems = [
    { key: 'journals', icon: <BookOutlined />, label: '期刊管理' },
    { key: 'content', icon: <SettingOutlined />, label: '内容管理' },
    { type: 'divider' },
    {
      key: 'preview',
      icon: <EyeOutlined />,
      label: '预览前台',
      onClick: () => window.open('/', '_blank'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: () => { logout(); navigate('/login') },
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#f4f7fb' }}>
      {/* 侧边栏 */}
      <Sider
        width={220}
        style={{
          background: '#fff',
          borderRight: '1px solid #e8ecf2',
          position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
          boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #4f6ef7, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>众瀚四季</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>管理后台</div>
            </div>
          </div>
        </div>

        {/* 用户信息 */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{user?.username}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            {user?.role === 'admin' ? '超级管理员' : '编辑'}
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[current]}
          onSelect={({ key }) => {
            if (key !== 'preview' && key !== 'logout') setCurrent(key)
          }}
          items={menuItems}
          style={{ border: 'none', marginTop: 8 }}
        />
      </Sider>

      {/* 主内容区 */}
      <Content style={{ marginLeft: 220, padding: '32px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {current === 'journals' && <JournalPanel />}
          {current === 'content' && <ContentPanel />}
        </div>
      </Content>
    </Layout>
  )
}
