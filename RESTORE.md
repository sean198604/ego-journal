# 数据恢复说明

本文件说明如何在重新部署 Docker 后恢复所有数据。

## 备份文件位置

| 文件/目录 | 内容 |
|-----------|------|
| `db_backup.sql` | MySQL 完整数据库备份（含结构+数据） |
| `uploads_backup/` | 所有上传的封面图片（35张） |

## 恢复步骤

### 第一步：重新部署

```bash
cd C:\Users\Administrator\Documents\Github\ego-journal

# 清理旧容器和数据卷
docker-compose down -v

# 先单独启动 MySQL（首次初始化较慢，需等待）
docker-compose up -d mysql

# 等待 MySQL 就绪（健康检查通过后再继续）
# 可用以下命令轮询，直到出现 "mysqld is alive"
docker exec journal_mysql mysqladmin ping -h localhost -uroot -pJournal@2026

# 启动其余服务
docker-compose up -d
```

### 第二步：恢复数据库

```bash
# 导入备份数据（会用 REPLACE 覆盖现有数据）
docker exec -i journal_mysql mysql -uroot -pJournal@2026 ego_journal < db_backup.sql
```

### 第三步：恢复上传图片

```bash
# 将备份图片复制回容器
docker cp uploads_backup/. journal_backend:/app/uploads/
```

### 第四步：验证

```bash
# 检查后端健康
curl http://localhost:8002/api/health

# 检查前端可访问
curl -o /dev/null -w "%{http_code}" http://localhost:7007
```

## 登录信息

- 后台地址：http://192.168.1.246:7007/admin
- 用户名：`admin`
- 密码：`admin123`

## 备份时间

最后备份：2026-07-01
