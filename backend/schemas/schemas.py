from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date


class CategoryOut(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None
    class Config:
        from_attributes = True


class JournalBase(BaseModel):
    title: str
    issue_no: str
    cover_url: Optional[str] = None
    description: Optional[str] = None
    published_at: Optional[date] = None
    external_url: Optional[str] = None   # 外部阅读链接（腾讯文档/PDF等）


class JournalCreate(JournalBase):
    pass


class JournalUpdate(BaseModel):
    title: Optional[str] = None
    issue_no: Optional[str] = None
    cover_url: Optional[str] = None
    description: Optional[str] = None
    published_at: Optional[date] = None
    is_published: Optional[int] = None
    external_url: Optional[str] = None


class JournalOut(JournalBase):
    id: int
    is_published: int
    view_count: int
    created_at: datetime
    external_url: Optional[str] = None
    class Config:
        from_attributes = True


class ArticleBase(BaseModel):
    journal_id: int
    category_id: Optional[int] = None
    title: str
    author: Optional[str] = None
    department: Optional[str] = None
    cover_url: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    sort: int = 0
    is_featured: int = 0


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    category_id: Optional[int] = None
    title: Optional[str] = None
    author: Optional[str] = None
    department: Optional[str] = None
    cover_url: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    sort: Optional[int] = None
    is_featured: Optional[int] = None


class ArticleOut(ArticleBase):
    id: int
    view_count: int
    like_count: int
    created_at: datetime
    category: Optional[CategoryOut] = None
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
