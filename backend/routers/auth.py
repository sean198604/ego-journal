import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from datetime import datetime, timedelta
import os

from database import get_db
from models.models import User
from schemas.schemas import UserLogin, TokenOut, UserOut

router = APIRouter()
SECRET_KEY = os.getenv("SECRET_KEY", "ego-journal-secret-key-2026")
ALGORITHM = "HS256"
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 480))


def create_token(user_id: int, username: str, role: str):
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "username": username, "role": role, "exp": expire},
        SECRET_KEY, algorithm=ALGORITHM
    )


def get_current_user(token: str = Depends(lambda: None), db: Session = Depends(get_db)):
    from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
    # 简化版，实际在 journals/articles 路由中处理
    pass


@router.post("/login", response_model=TokenOut)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not bcrypt.checkpw(data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="账号已禁用")
    token = create_token(user.id, user.username, user.role)
    return {"access_token": token, "user": user}


@router.get("/me", response_model=UserOut)
def me(db: Session = Depends(get_db)):
    # TODO: 从 token 解析用户
    raise HTTPException(status_code=401, detail="请先登录")
