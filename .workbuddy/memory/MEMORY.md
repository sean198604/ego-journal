# MEMORY.md - 项目长期记忆

## 项目概述

**EGO Journal（众瀚四季）** - 众瀚国贸企业内部期刊展示平台

## 项目位置
- 路径：`C:\Users\Administrator\Documents\Github\ego-journal`
- 访问地址：http://192.168.1.246:7007
- 后端端口：8002（Docker内部8000）
- 数据库：MySQL 3308

## 技术栈
- **前端**：React 18 + Ant Design 5 + Vite + React Router + Zustand
- **后端**：FastAPI + SQLAlchemy + MySQL
- **部署**：Docker + Docker Compose

## 核心功能模块

### 1. 期刊管理（核心）
- 创建/编辑/删除期刊
- 设置期号（issue_no）、封面图、简介
- 支持外部链接（external_url）- 跳转腾讯文档/PDF
- 发布/取消发布控制
- 浏览量统计

### 2. 文章管理
- 文章隶属期刊（journal_id）
- 栏目分类（category_id）
- 支持封面推荐（is_featured）
- 浏览量、点赞数统计

### 3. 用户权限系统
- 三种角色：admin（管理员）、editor（编辑）、reader（读者）
- JWT Token 认证
- 默认管理员：admin / admin123

### 4. 内容管理（MySQL 数据库存储）
- 期刊简介
- 编辑部介绍
- 征稿说明

## 数据库表结构

| 表名 | 说明 | 关联 |
|------|------|------|
| users | 用户表 | - |
| journals | 期刊表 | created_by → users |
| categories | 栏目分类表 | - |
| articles | 文章表 | journal_id, category_id |
| likes | 点赞记录 | article_id, user_id |
| site_config | 站点配置表 | key-value 存储内容管理数据 |

## 实际栏目（按用户最新要求）
1. 卷首语
2. 文化有你
3. 经办资讯
4. 人在众瀚
5. 文化纪实

## 启动命令
```bash
cd C:\Users\Administrator\Documents\Github\ego-journal
docker-compose up -d --build
```

## API 端点
- `/api/health` - 健康检查
- `/api/auth/login` - 登录
- `/api/auth/me` - 当前用户
- `/api/journals` - 期刊 CRUD
- `/api/journals/:id` - 期刊详情（自动 +1 浏览量）
- `/api/journals/:id/view` - 浏览量 +1（公开接口，供点击封面/外链时调用）
- `/api/journals/:id/articles` - 期刊文章
- `/api/journals/:id/publish` - 发布期刊
- `/api/articles` - 文章 CRUD
- `/api/articles/:id/like` - 点赞
- `/api/categories` - 栏目列表
- `/api/upload/image` - 图片上传
- `/api/config` - 站点配置管理
- `/api/config/public` - 公开配置（前台页面使用）
- `/api/config/batch` - 批量更新配置

## 关键文件路径
- 后端入口：`backend/main.py`
- 数据库模型：`backend/models/models.py`
- 前端入口：`frontend/src/main.jsx`
- 路由配置：`frontend/src/App.jsx`
- API服务：`frontend/src/services/api.js`
- 状态管理：`frontend/src/store/authStore.js`
- 首页组件：`frontend/src/pages/Home.jsx`
- 期刊简介页：`frontend/src/pages/About.jsx`
- 编辑部介绍页：`frontend/src/pages/Editorial.jsx`
- 投稿征集页：`frontend/src/pages/Contribute.jsx`
- 管理后台：`frontend/src/pages/admin/AdminPage.jsx`

## 编辑部成员（2026-05-19更新）
- 期刊主编：史金鑫 Jessie
- 期刊副编：戴晶晶 Dora
- 编辑成员：李强Kobe、张凤ELim、周佳晨Lena、王璐瑶Ada、陈超女Claire、杨佳璐cici、柳璐妍Clara、李佳群Jacolyn
- 排版设计：史金鑫 Jessie

## UI 风格
- 主题色：#4f6ef7（蓝色渐变）
- 背景色：#f4f7fb
- 封面渐变色循环（6种）
- 品牌名：众瀚四季 / EGO ENTERPRISE JOURNAL

## 注意事项
- 内容管理配置存储在 MySQL site_config 表中（2026-05-19 迁移）
- Docker Compose 环境变量中密码含特殊字符 `%40` = `@`
- 期刊封面支持两种模式：URL输入 或 本地上传
- 外部链接字段支持跳转腾讯文档/PDF
