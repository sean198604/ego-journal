from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models.models import Article, Like
from schemas.schemas import ArticleCreate, ArticleUpdate, ArticleOut

router = APIRouter()


@router.get("/{article_id}", response_model=ArticleOut)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).options(joinedload(Article.category)).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    article.view_count += 1
    db.commit()
    db.refresh(article)
    return article


@router.post("", response_model=ArticleOut)
def create_article(data: ArticleCreate, db: Session = Depends(get_db)):
    article = Article(**data.dict())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.put("/{article_id}", response_model=ArticleOut)
def update_article(article_id: int, data: ArticleUpdate, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(article, k, v)
    db.commit()
    db.refresh(article)
    return article


@router.delete("/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    db.delete(article)
    db.commit()
    return {"ok": True}


@router.post("/{article_id}/like")
def like_article(article_id: int, db: Session = Depends(get_db)):
    # 简化版：不验证用户，临时用 user_id=0
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    article.like_count += 1
    db.commit()
    return {"like_count": article.like_count}
