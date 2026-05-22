# EGO Journal — 企业内部期刊平台

> 众瀚国贸 · 企业文化系列 · 内部期刊展示系统

## 项目简介

EGO Journal 是面向全体员工的企业内部期刊展示平台，与文化积分系统（7006端口）同属企业文化生态，UI风格统一，提供期刊发布、分期浏览、文章阅读等功能。

## 技术栈

- **前端**：React 18 + Ant Design 5 + Vite
- **后端**：FastAPI + SQLAlchemy + MySQL
- **部署**：Docker + Docker Compose

## 目录结构

```
ego-journal/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/   # 公共组件
│   │   ├── pages/        # 页面
│   │   ├── services/     # API 调用
│   │   ├── store/        # 状态管理
│   │   ├── styles/       # 全局样式
│   │   └── assets/       # 静态资源
│   └── public/
├── backend/           # FastAPI 后端
│   ├── main.py
│   ├── database.py
│   ├── routers/       # 路由模块
│   ├── models/        # 数据库模型
│   └── schemas/       # Pydantic 模式
├── uploads/           # 上传文件存储
│   └── journals/      # 期刊封面/附件
├── docker-compose.yml
└── init.sql
```

## 快速启动

```bash
docker-compose up -d --build
```

访问地址：http://192.168.1.246:7007
