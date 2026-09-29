# EGO《众瀚四季》企业内刊平台

> **众瀚国贸** · 企业文化系列 · 内部期刊展示系统

品牌名「众瀚四季 / EGO ENTERPRISE JOURNAL」，面向全体员工提供期刊发布、分期浏览、文章阅读、投稿征集等一体化服务。

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.x |
| UI 组件库 | Ant Design | 5.x |
| 路由 | React Router | 6.x |
| 状态管理 | Zustand | 4.x |
| 构建工具 | Vite | 5.x |
| 后端框架 | FastAPI (Python) | 0.111 |
| ORM | SQLAlchemy | 2.x |
| 数据库 | MySQL | 8.0 |
| 部署 | Docker + Docker Compose | — |

---

## 目录结构

```
ego-journal/
├── backend/                   # FastAPI 后端
│   ├── main.py                #   服务入口 + CORS + 图片上传
│   ├── database.py            #   数据库连接
│   ├── Dockerfile             #   后端容器构建
│   ├── requirements.txt       #   Python 依赖
│   ├── models/
│   │   └── models.py          #   SQLAlchemy 数据模型
│   ├── routers/               #   API 路由模块
│   │   ├── auth.py            #     认证（登录/当前用户）
│   │   ├── journals.py        #     期刊 CRUD
│   │   ├── articles.py        #     文章 CRUD
│   │   ├── categories.py      #     栏目管理
│   │   └── config.py          #     站点配置（Key-Value）
│   └── schemas/
│       └── schemas.py         #   Pydantic 请求/响应模型
│
├── frontend/                  # React 前端
│   ├── index.html
│   ├── nginx.conf             #   Nginx 反向代理 + 上传限制
│   ├── Dockerfile             #   多阶段构建（Node → Nginx）
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx           #   应用入口 + 路由定义
│       ├── components/
│       │   └── AppLayout.jsx  #   全局布局（导航栏/Header）
│       ├── pages/
│       │   ├── Home.jsx       #   首页（Hero + 入口卡片 + 期刊列表）
│       │   ├── JournalDetail.jsx  #   期刊详情页
│       │   ├── ArticleDetail.jsx  #   文章详情页
│       │   ├── About.jsx      #   期刊简介
│       │   ├── Editorial.jsx  #   编辑部介绍
│       │   ├── Contribute.jsx #   投稿征集
│       │   ├── Login.jsx      #   登录页
│       │   └── admin/
│       │       └── AdminPage.jsx  #   管理后台（期刊/文章/配置）
│       ├── services/
│       │   └── api.js         #   Axios API 封装
│       ├── store/
│       │   └── authStore.js   #   Zustand 认证状态
│       └── styles/
│           └── global.css     #   全局样式
│
├── docker-compose.yml         # 三容器编排
├── init.sql                   # 数据库初始化（建表 + 默认数据）
├── db_backup.sql              # 数据库完整备份（自动生成）
├── RESTORE.md                 # 数据恢复说明
├── uploads_backup/            # 上传封面图片备份目录
├── uploads/                   # 上传文件存储（Docker volume）
└── 期刊封面截图/              # 封面截图存档
```

---

## 功能模块

### 前台页面

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | Hero 大图 + 三栏入口卡片 + 期刊网格列表 |
| `/journal/:id` | 期刊详情 | 期号/封面/简介/文章列表，支持外链跳转 |
| `/article/:id` | 文章详情 | 正文阅读 + 点赞 |
| `/about` | 期刊简介 | 文字内容（后台可编辑） |
| `/editorial` | 编辑部介绍 | 核心编辑团队 + 编辑成员展示 |
| `/contribute` | 投稿征集 | 投稿贴士 + 供稿激励表格 + 往期征稿海报 |
| `/login` | 登录 | 用户认证入口 |

### 管理后台 (`/admin`)

- **期刊管理**：创建/编辑/删除期刊，设置期号、封面图（URL 或本地上传）、简介、外部链接、发布状态
- **文章管理**：创建/编辑/删除文章，隶属期刊 + 栏目，支持封面推荐
- **栏目管理**：创建/编辑/删除栏目分类，设置排序和主题色
- **内容管理**：编辑站点配置（期刊简介、编辑部介绍、征稿说明）——富文本编辑器
- **海报管理**：上传往期征稿海报，支持标题编辑和拖拽排序
- **图片上传**：支持 JPG/PNG/GIF/WebP/HEIC 格式

### 用户权限

| 角色 | 权限 |
|------|------|
| `admin` | 全部权限（期刊/文章/栏目/配置管理） |
| `editor` | 期刊/文章内容管理，无栏目和配置权限 |
| `reader` | 仅前台浏览 |

---

## 数据库结构

### 核心表

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `users` | 用户表 | username, password(hash), role, is_active |
| `journals` | 期刊表 | title, issue_no, cover_url, description, is_published, view_count, external_url |
| `categories` | 栏目分类表 | name, icon, sort, color |
| `articles` | 文章表 | journal_id, category_id, title, author, content, is_featured, view_count, like_count |
| `likes` | 点赞记录 | article_id, user_id（UNIQUE约束） |
| `site_config` | 站点配置表 | key, value(JSON), label, group（about/editorial/contribute） |

### 初始化栏目

1. 总编寄语
2. 企业动态
3. 人物故事
4. 团队风采
5. 学习园地
6. 生活随笔

---

## API 端点

### 认证

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录，返回 JWT Token |
| GET | `/api/auth/me` | 获取当前用户信息 |

### 期刊

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/journals` | 期刊列表 |
| GET | `/api/journals/:id` | 期刊详情（自动 +1 浏览量） |
| POST | `/api/journals` | 创建期刊 |
| PUT | `/api/journals/:id` | 编辑期刊 |
| DELETE | `/api/journals/:id` | 删除期刊 |
| POST | `/api/journals/:id/publish` | 发布/取消发布 |
| GET | `/api/journals/:id/articles` | 期刊下的文章列表 |
| POST | `/api/journals/:id/view` | 浏览量 +1（公开接口） |

### 文章

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/articles` | 文章列表 |
| POST | `/api/articles` | 创建文章 |
| PUT | `/api/articles/:id` | 编辑文章 |
| DELETE | `/api/articles/:id` | 删除文章 |
| POST | `/api/articles/:id/like` | 点赞/取消点赞 |

### 栏目

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/categories` | 栏目列表 |
| POST | `/api/categories` | 创建栏目 |
| PUT | `/api/categories/:id` | 编辑栏目 |
| DELETE | `/api/categories/:id` | 删除栏目 |

### 配置

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/config` | 全部站点配置（需认证） |
| GET | `/api/config/public` | 公开配置（前台页面使用） |
| POST | `/api/config/batch` | 批量更新配置 |
| PUT | `/api/config/:key` | 更新单个配置 |

### 工具

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/upload/image` | 图片上传（50MB 上限） |

---

## 快速部署

### 首次部署

```bash
cd C:\Users\Administrator\Documents\Github\ego-journal

# 构建并启动所有服务
docker-compose up -d --build
```

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | `7007` → 容器 `80` | Nginx 静态文件 + 反向代理 |
| 后端 | `8002` → 容器 `8000` | FastAPI |
| MySQL | `3308` → 容器 `3306` | 数据库 |

### 重新部署

```bash
docker-compose down -v          # 停止并清理数据卷
docker-compose up -d mysql      # 先启动 MySQL，等待就绪
docker-compose up -d            # 启动全部
```

> **注意**：MySQL 首次初始化可能需要 1-2 分钟，需等待 `journal_mysql` 容器状态变为 `healthy` 后再启动后端服务。

### 访问地址

- 前台首页：`http://localhost:7007`
- 管理后台：`http://localhost:7007/admin`
- 后端 API：`http://localhost:8002/api/health`

---

## 数据备份与恢复

### 备份

项目已包含自动备份机制，`db_backup.sql`（数据库）和 `uploads_backup/`（封面图片）会在每次重大变更后更新。

### 恢复（docker-compose down -v 后）

```bash
# 1. 恢复数据库
docker exec -i journal_mysql mysql -uroot -pJournal@2026 ego_journal < db_backup.sql

# 2. 恢复封面图片
docker cp uploads_backup/. journal_backend:/app/uploads/
```

详细恢复流程见 [RESTORE.md](./RESTORE.md)。

---

## 默认账号

| 字段 | 值 |
|------|-----|
| 用户名 | `admin` |
| 密码 | `admin123` |
| 角色 | `admin`（管理员） |

密码使用 bcrypt 加密存储，`init.sql` 中包含管理员初始化语句。

---

## UI 设计规范

| 属性 | 值 |
|------|------|
| 主题色 | `#4f6ef7`（蓝色渐变） |
| 背景色 | `#f4f7fb` |
| 圆角 | `12px` |
| 字体 | PingFang SC / Microsoft YaHei |
| 封面渐变色 | 6 种循环色（每期刊不同底色） |
| 图标库 | @ant-design/icons |

---

## 期刊封面操作

支持两种封面设置模式：

1. **URL 模式**：直接输入封面图片 URL
2. **本地上传模式**：上传到 `/app/uploads/` 目录，通过 `/uploads/` 路径访问

**外部链接**：在期刊详情页可设置 `external_url`，点击封面跳转到腾讯文档/PDF 等在线阅读页面。

---

## 注意事项

1. Docker Compose 环境变量中，密码含特殊字符 `@` 需用 `%40` 代替（URL 编码）
2. Nginx 上传限制已设为 `50MB`，原始默认 `1MB` 会导致大图上传 413 错误
3. `site_config` 表存储所有可编辑页面内容（期刊简介/编辑部介绍/征稿说明），支持前后台同步编辑
4. 移动端已做响应式适配（断点 `640px`），导航栏折叠为图标模式，期刊列表一行两期
5. 新增期刊默认为草稿状态（`is_published=0`），需在编辑模式下单独发布
