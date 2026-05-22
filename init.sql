-- EGO Journal 企业期刊数据库初始化
-- 字符集: utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 用户表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `username`   VARCHAR(64)  NOT NULL UNIQUE COMMENT '用户名',
  `email`      VARCHAR(128) NOT NULL UNIQUE COMMENT '邮箱',
  `password`   VARCHAR(256) NOT NULL COMMENT '密码哈希',
  `role`       ENUM('admin','editor','reader') NOT NULL DEFAULT 'reader' COMMENT '角色',
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ----------------------------
-- 期刊表（每期刊物）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `journals` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `title`       VARCHAR(128) NOT NULL COMMENT '期刊标题',
  `issue_no`    VARCHAR(32)  NOT NULL UNIQUE COMMENT '期号，如 2026-01',
  `cover_url`   VARCHAR(512) COMMENT '封面图片URL',
  `description` TEXT COMMENT '本期简介',
  `published_at` DATE COMMENT '发布日期',
  `is_published` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已发布',
  `view_count`  INT NOT NULL DEFAULT 0 COMMENT '浏览量',
  `external_url` VARCHAR(1024) COMMENT '外部阅读链接（腾讯文档/PDF等）',
  `created_by`  INT COMMENT '创建人ID',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='期刊表';

-- ----------------------------
-- 栏目分类表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id`       INT AUTO_INCREMENT PRIMARY KEY,
  `name`     VARCHAR(64) NOT NULL COMMENT '栏目名称',
  `icon`     VARCHAR(64) COMMENT '图标',
  `sort`     INT NOT NULL DEFAULT 0 COMMENT '排序',
  `color`    VARCHAR(16) COMMENT '主题色'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='栏目分类';

-- ----------------------------
-- 文章表
-- ----------------------------
CREATE TABLE IF NOT EXISTS `articles` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `journal_id`  INT NOT NULL COMMENT '所属期刊',
  `category_id` INT COMMENT '所属栏目',
  `title`       VARCHAR(256) NOT NULL COMMENT '文章标题',
  `author`      VARCHAR(64) COMMENT '作者',
  `department`  VARCHAR(64) COMMENT '部门',
  `cover_url`   VARCHAR(512) COMMENT '题图',
  `content`     LONGTEXT COMMENT '正文（富文本HTML）',
  `summary`     VARCHAR(512) COMMENT '摘要',
  `sort`        INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否封面推荐',
  `view_count`  INT NOT NULL DEFAULT 0 COMMENT '浏览量',
  `like_count`  INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`journal_id`) REFERENCES `journals`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- ----------------------------
-- 点赞记录
-- ----------------------------
CREATE TABLE IF NOT EXISTS `likes` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `article_id` INT NOT NULL,
  `user_id`    INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_article_user` (`article_id`, `user_id`),
  FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞记录';

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- 初始数据
-- ----------------------------
-- 默认管理员账号 (密码: admin123)
INSERT IGNORE INTO `users` (`username`, `email`, `password`, `role`, `is_active`) VALUES
('admin', 'admin@ego-intl.com', '$2b$12$0THKL9BGteHLMlInMn66V.NcYuxJta4oh/w0GQis/H.Rt4Ui1180i', 'admin', 1);

-- 默认栏目
INSERT IGNORE INTO `categories` (`name`, `icon`, `sort`, `color`) VALUES
('总编寄语', 'EditOutlined', 1, '#4f6ef7'),
('企业动态', 'GlobalOutlined', 2, '#06b6d4'),
('人物故事', 'UserOutlined', 3, '#f59e0b'),
('团队风采', 'TeamOutlined', 4, '#10b981'),
('学习园地', 'BookOutlined', 5, '#8b5cf6'),
('生活随笔', 'HeartOutlined', 6, '#ef4444');
