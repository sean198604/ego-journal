from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uuid
import shutil

from database import engine, Base
from routers import auth, journals, articles, categories, config

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EGO Journal API",
    description="众瀚国贸企业内刊平台后端接口",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 上传文件静态服务
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 路由注册
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(journals.router, prefix="/api/journals", tags=["期刊"])
app.include_router(articles.router, prefix="/api/articles", tags=["文章"])
app.include_router(categories.router, prefix="/api/categories", tags=["栏目"])
app.include_router(config.router, tags=["站点配置"])

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "ego-journal"}


# 图片上传接口
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'}

@app.post("/api/upload/image")
async def upload_image(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename or '')[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="不支持的图片格式")
    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(UPLOAD_DIR, filename)
    with open(save_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)
    return {"url": f"/uploads/{filename}"}
