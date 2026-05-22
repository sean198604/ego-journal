from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.models import Journal
from schemas.schemas import JournalCreate, JournalUpdate, JournalOut

router = APIRouter()


@router.get("")
def list_journals(
    page: int = 1,
    size: int = 20,
    published: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Journal)
    if published is not None:
        q = q.filter(Journal.is_published == (1 if published else 0))
    total = q.count()
    items = q.order_by(Journal.published_at.desc(), Journal.id.desc()).offset((page - 1) * size).limit(size).all()
    return {"total": total, "page": page, "size": size, "items": items}


@router.get("/{journal_id}", response_model=JournalOut)
def get_journal(journal_id: int, db: Session = Depends(get_db)):
    journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="期刊不存在")
    journal.view_count += 1
    db.commit()
    db.refresh(journal)
    return journal


@router.post("", response_model=JournalOut)
def create_journal(data: JournalCreate, db: Session = Depends(get_db)):
    journal = Journal(**data.dict())
    db.add(journal)
    db.commit()
    db.refresh(journal)
    return journal


@router.put("/{journal_id}", response_model=JournalOut)
def update_journal(journal_id: int, data: JournalUpdate, db: Session = Depends(get_db)):
    journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="期刊不存在")
    for k, v in data.dict(exclude_unset=True).items():
        setattr(journal, k, v)
    db.commit()
    db.refresh(journal)
    return journal


@router.patch("/{journal_id}/publish", response_model=JournalOut)
def publish_journal(journal_id: int, db: Session = Depends(get_db)):
    journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="期刊不存在")
    journal.is_published = 1
    db.commit()
    db.refresh(journal)
    return journal


@router.delete("/{journal_id}")
def delete_journal(journal_id: int, db: Session = Depends(get_db)):
    journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="期刊不存在")
    db.delete(journal)
    db.commit()
    return {"ok": True}


@router.patch("/{journal_id}/view")
def view_journal(journal_id: int, db: Session = Depends(get_db)):
    """浏览量 +1（供前台点击封面/外链时调用，无需登录）"""
    journal = db.query(Journal).filter(Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="期刊不存在")
    journal.view_count += 1
    db.commit()
    return {"ok": True, "view_count": journal.view_count}


@router.get("/{journal_id}/articles")
def list_articles(
    journal_id: int,
    size: int = 50,
    db: Session = Depends(get_db)
):
    from models.models import Article
    from sqlalchemy.orm import joinedload
    q = db.query(Article).options(joinedload(Article.category)).filter(Article.journal_id == journal_id)
    items = q.order_by(Article.is_featured.desc(), Article.sort.asc(), Article.id.asc()).limit(size).all()
    return {"items": items}
