from sqlalchemy import Column, Integer, String, Text, DateTime, Date, Enum, ForeignKey, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, nullable=False)
    email = Column(String(128), unique=True, nullable=False)
    password = Column(String(256), nullable=False)
    role = Column(Enum("admin", "editor", "reader"), default="reader")
    is_active = Column(SmallInteger, default=1)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    icon = Column(String(64))
    sort = Column(Integer, default=0)
    color = Column(String(16))
    articles = relationship("Article", back_populates="category")


class Journal(Base):
    __tablename__ = "journals"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    issue_no = Column(String(32), unique=True, nullable=False)
    cover_url = Column(String(512))
    description = Column(Text)
    published_at = Column(Date)
    is_published = Column(SmallInteger, default=0)
    view_count = Column(Integer, default=0)
    external_url = Column(String(1024))           # 外部阅读链接
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    articles = relationship("Article", back_populates="journal", cascade="all, delete-orphan")


class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    journal_id = Column(Integer, ForeignKey("journals.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(256), nullable=False)
    author = Column(String(64))
    department = Column(String(64))
    cover_url = Column(String(512))
    content = Column(Text)
    summary = Column(String(512))
    sort = Column(Integer, default=0)
    is_featured = Column(SmallInteger, default=0)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    journal = relationship("Journal", back_populates="articles")
    category = relationship("Category", back_populates="articles")
    likes = relationship("Like", back_populates="article", cascade="all, delete-orphan")


class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    article = relationship("Article", back_populates="likes")


class SiteConfig(Base):
    """站点配置表 - 存储期刊简介、编辑部介绍、文稿征集等页面内容"""
    __tablename__ = "site_config"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(64), unique=True, nullable=False, index=True)  # 配置键名
    value = Column(Text)  # 配置值（JSON字符串）
    label = Column(String(128))  # 中文标签
    description = Column(String(256))  # 配置描述
    group = Column(String(32))  # 配置分组：about / editorial / contribute
    updated_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
