from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.models import Category
from schemas.schemas import CategoryOut
from typing import List

router = APIRouter()


@router.get("", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.sort).all()
