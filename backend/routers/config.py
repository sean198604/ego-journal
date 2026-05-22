"""
站点配置管理 API
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json

from database import get_db
from models.models import SiteConfig

router = APIRouter(prefix="/api/config", tags=["站点配置"])


# ─── Pydantic Schemas ────────────────────────────────────────────────────────
class ConfigItem(BaseModel):
    key: str
    value: Optional[str] = None
    label: Optional[str] = None
    description: Optional[str] = None
    group: Optional[str] = None


class ConfigUpdate(BaseModel):
    value: str


class ConfigResponse(BaseModel):
    id: int
    key: str
    value: Optional[str]
    label: Optional[str]
    description: Optional[str]
    group: Optional[str]

    class Config:
        from_attributes = True


# ─── 默认配置数据 ────────────────────────────────────────────────────────────
DEFAULT_CONFIGS = [
    # 期刊简介页
    {"key": "about_intro", "label": "期刊简介-引言", "group": "about",
     "value": "《众瀚四季》——众瀚国贸旗下企业内刊，记录成长，传递文化"},
    {"key": "about_significance_title", "label": "期刊简介-出刊意义标题", "group": "about",
     "value": "出刊意义"},
    {"key": "about_significance_subtitle", "label": "期刊简介-出刊意义副标题", "group": "about",
     "value": "季刊作为公司传播企业文化的载休，是企业文化建设中内部宣传的重要方式"},
    {"key": "about_significance_items", "label": "期刊简介-出刊意义条目", "group": "about",
     "value": json.dumps([
         {"title": "业务信息互通", "desc": "业务成长、技能分享，打造众瀚知识文化共享平台"},
         {"title": "员工交流及荣誉激励", "desc": "树立标杆形象，传播正能量"},
         {"title": "文化理念上传下达", "desc": "传递众瀚企业文化精神"},
         {"title": "沉淀公司历史", "desc": "记录并传承众瀚重要事迹及人物故事"},
     ])},
    {"key": "about_dept", "label": "期刊简介-主办部门", "group": "about",
     "value": "人力资源部"},
    {"key": "about_cycle", "label": "期刊简介-出版周期", "group": "about",
     "value": "每季度"},
    {"key": "about_word_limit", "label": "期刊简介-征稿字数", "group": "about",
     "value": "不少于600字"},
    {"key": "about_columns", "label": "期刊简介-主要栏目", "group": "about",
     "value": "卷首语、文化有你、经办资讯、人在众瀚、文化纪实"},
    {"key": "about_kanyin", "label": "期刊简介-刊序引言", "group": "about",
     "value": "一刊一季，记录成长；一字一句，传递温度。\n《众瀚四季》是众瀚国贸的家，是每一位员工故事的容身之所，\n是企业文化最真实、最温暖的载体。"},

    # 编辑部介绍页
    {"key": "editorial_intro", "label": "编辑部介绍-引言", "group": "editorial",
     "value": "一群怀揣热情的人，用文字与设计，守护每一期内刊的诞生"},
    {"key": "editorial_chief", "label": "编辑部介绍-主编", "group": "editorial",
     "value": "史金鑫 Jessie"},
    {"key": "editorial_chief_dept", "label": "编辑部介绍-主编部门", "group": "editorial",
     "value": "人力资源部"},
    {"key": "editorial_chief_desc", "label": "编辑部介绍-主编职责", "group": "editorial",
     "value": "负责内刊整体方向把控、内容审核及终稿定稿"},
    {"key": "editorial_deputy", "label": "编辑部介绍-副编", "group": "editorial",
     "value": "戴晶晶 Dora"},
    {"key": "editorial_deputy_dept", "label": "编辑部介绍-副编部门", "group": "editorial",
     "value": "人力资源部"},
    {"key": "editorial_deputy_desc", "label": "编辑部介绍-副编职责", "group": "editorial",
     "value": "协助主编开展编辑工作，统筹各栏目内容规划"},
    {"key": "editorial_designer", "label": "编辑部介绍-排版设计", "group": "editorial",
     "value": "史金鑫 Jessie"},
    {"key": "editorial_designer_dept", "label": "编辑部介绍-排版部门", "group": "editorial",
     "value": "人力资源部"},
    {"key": "editorial_designer_desc", "label": "编辑部介绍-排版职责", "group": "editorial",
     "value": "负责内刊排版设计、封面设计及图文配置"},
    {"key": "editorial_members", "label": "编辑部介绍-编辑成员", "group": "editorial",
     "value": "李强Kobe、张凤ELim、周佳晨Lena、王璐瑶Ada、陈超女Claire、杨佳璐cici、柳璐妍Clara、李佳群Jacolyn"},
    {"key": "editorial_message", "label": "编辑部介绍-寄语", "group": "editorial",
     "value": "我们是一群来自各部门、因热爱文字而走到一起的普通员工。\n我们相信，每一个人的故事都值得被记录，每一份努力都应该被看见。\n《众瀚四季》，是我们共同的作品，也是献给所有众瀚人的礼物。"},
    {"key": "editorial_contact_person", "label": "编辑部介绍-联系人", "group": "editorial",
     "value": "史金鑫 Jessie"},
    {"key": "editorial_member_photos", "label": "编辑部介绍-成员照片", "group": "editorial",
     "value": json.dumps({"chief": "", "deputy": "", "designer": "", "members": []})},

    # 文稿征集页
    {"key": "contribute_intro", "label": "文稿征集-引言", "group": "contribute",
     "value": "每一个人都有值得被记录的故事。欢迎全体同仁踊跃投稿，让你的声音出现在《众瀚四季》。"},
    {"key": "contribute_topics", "label": "文稿征集-征稿主题", "group": "contribute",
     "value": "价值观故事|成长感悟|正能量故事|特定主题|文艺创作"},
    {"key": "contribute_topic_descs", "label": "文稿征集-主题说明", "group": "contribute",
     "value": "体现和发扬公司价值观（其中一条）的事例|关于自我成长历程中的印象最深刻的一件事|其他发生在自己或同事身上的正能量小故事|内部通知结合公司当下情形需要的特定主题|读书分享/旅游日记/日常随感/文艺散文"},
    {"key": "contribute_requirement_1", "label": "文稿征集-要求1", "group": "contribute",
     "value": "文章结构清晰、表述通顺、紧扣主题、客观真实、有一定的文采"},
    {"key": "contribute_requirement_2", "label": "文稿征集-要求2", "group": "contribute",
     "value": "篇幅不少于600字，配图更佳"},
    {"key": "contribute_requirement_3", "label": "文稿征集-要求3", "group": "contribute",
     "value": "提交故事需包含：故事标题（自拟）、作者姓名及所属部门、完整的故事正文内容"},
    {"key": "contribute_rating", "label": "文稿征集-评级标准", "group": "contribute",
     "value": "A:500元/8分|B:400元/5分|C:300元/3分|D:200元/2分"},
    {"key": "contribute_note", "label": "文稿征集-备注", "group": "contribute",
     "value": "编辑部收稿后5个工作日内反馈是否录用，录用稿件将进行编辑润色，不改变原意"},
    {"key": "contribute_posters", "label": "文稿征集-往期征稿海报", "group": "contribute",
     "value": json.dumps([])},
]


def init_default_configs(db: Session):
    """初始化默认配置（如果不存在）"""
    for cfg in DEFAULT_CONFIGS:
        exists = db.query(SiteConfig).filter(SiteConfig.key == cfg["key"]).first()
        if not exists:
            db.add(SiteConfig(**cfg))
    db.commit()


# ─── API Endpoints ───────────────────────────────────────────────────────────
@router.get("", response_model=list[ConfigResponse])
def get_all_configs(db: Session = Depends(get_db)):
    """获取所有配置项"""
    # 确保默认配置存在
    init_default_configs(db)
    configs = db.query(SiteConfig).all()
    return configs


@router.get("/group/{group}", response_model=list[ConfigResponse])
def get_configs_by_group(group: str, db: Session = Depends(get_db)):
    """按分组获取配置"""
    init_default_configs(db)
    configs = db.query(SiteConfig).filter(SiteConfig.group == group).all()
    return configs


@router.get("/public", response_model=Dict[str, Any])
def get_public_configs(db: Session = Depends(get_db)):
    """获取公开配置（供前端页面使用，无需登录）"""
    init_default_configs(db)
    configs = db.query(SiteConfig).all()
    result = {}
    for cfg in configs:
        # 尝试解析 JSON 值
        try:
            result[cfg.key] = json.loads(cfg.value) if cfg.value else None
        except (json.JSONDecodeError, TypeError):
            result[cfg.key] = cfg.value
    return result


@router.get("/{key}", response_model=ConfigResponse)
def get_config(key: str, db: Session = Depends(get_db)):
    """获取单个配置"""
    config = db.query(SiteConfig).filter(SiteConfig.key == key).first()
    if not config:
        raise HTTPException(status_code=404, detail="配置不存在")
    return config


@router.put("/{key}", response_model=ConfigResponse)
def update_config(
    key: str,
    data: ConfigUpdate,
    db: Session = Depends(get_db)
):
    """更新配置"""
    config = db.query(SiteConfig).filter(SiteConfig.key == key).first()
    if not config:
        raise HTTPException(status_code=404, detail="配置不存在")

    config.value = data.value
    db.commit()
    db.refresh(config)
    return config


@router.post("/batch", response_model=list[ConfigResponse])
def batch_update_configs(
    updates: list[ConfigItem],
    db: Session = Depends(get_db)
):
    """批量更新配置"""
    results = []
    for item in updates:
        config = db.query(SiteConfig).filter(SiteConfig.key == item.key).first()
        if config:
            if item.value is not None:
                config.value = item.value
            if item.label is not None:
                config.label = item.label
            if item.description is not None:
                config.description = item.description
            if item.group is not None:
                config.group = item.group
            results.append(config)
    db.commit()
    return results
