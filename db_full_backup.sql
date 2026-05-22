-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: ego_journal
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `journal_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `title` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `summary` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `is_featured` smallint DEFAULT NULL,
  `view_count` int DEFAULT NULL,
  `like_count` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `journal_id` (`journal_id`),
  KEY `category_id` (`category_id`),
  KEY `ix_articles_id` (`id`),
  CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`journal_id`) REFERENCES `journals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `color` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_categories_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journals`
--

DROP TABLE IF EXISTS `journals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue_no` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `published_at` date DEFAULT NULL,
  `is_published` smallint DEFAULT NULL,
  `view_count` int DEFAULT NULL,
  `external_url` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `issue_no` (`issue_no`),
  KEY `created_by` (`created_by`),
  KEY `ix_journals_id` (`id`),
  CONSTRAINT `journals_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journals`
--

LOCK TABLES `journals` WRITE;
/*!40000 ALTER TABLE `journals` DISABLE KEYS */;
INSERT INTO `journals` (`id`, `title`, `issue_no`, `cover_url`, `description`, `published_at`, `is_published`, `view_count`, `external_url`, `created_by`, `created_at`, `updated_at`) VALUES (1,'2022年三季度','第001期','/uploads/f9bba54278124c09ac28ab4614004184.png','','2022-07-22',1,0,'https://flbook.com.cn/c/53mkwVyJ9P',NULL,'2026-05-22 01:33:42','2026-05-22 01:38:24'),(2,'2023年一季度','第002期','/uploads/90d395e8739e44c7a5c7ad9900778216.png','','2023-01-22',1,0,'https://flbook.com.cn/c/WIQvj96A55',NULL,'2026-05-22 01:36:18','2026-05-22 01:36:20'),(3,'2023年二季度','第003期','/uploads/80965f99a3a94d8ea5c637649e9f314e.png','','2023-04-22',1,0,'https://flbook.com.cn/c/CcXA5FQeC9',NULL,'2026-05-22 01:38:04','2026-05-22 01:39:43'),(4,'2023年三季度','第004期','/uploads/dd69c8ffa3774eafa557370a0f1f59f3.png','','2023-07-22',1,0,'https://flbook.com.cn/c/cYI8bH8Sis',NULL,'2026-05-22 01:39:33','2026-05-22 01:39:43'),(5,'2023年四季度','第005期','/uploads/f0dcb254175244af8d0163208379e631.png','','2023-10-22',1,0,'https://flbook.com.cn/c/LLIzaq6uKM',NULL,'2026-05-22 01:41:06','2026-05-22 01:41:11'),(6,'2024年一季度','第006期','/uploads/fcf5a7f84e224700a37ca6cf0ab23da9.png','','2024-01-22',1,0,'https://flbook.com.cn/c/DCo26vSJDx',NULL,'2026-05-22 01:41:50','2026-05-22 01:44:22'),(7,'2024年二季度','第007期','/uploads/7c1377bbf492441f9a6206f4fd59cf86.png','','2024-04-22',1,0,'https://flbook.com.cn/c/L4p6fsdbvH',NULL,'2026-05-22 01:44:56','2026-05-22 01:44:57'),(8,'2024年三季度','第008期','/uploads/a6700ab16128406593b83d4323ddc334.png','','2024-07-22',1,0,'https://flbook.com.cn/c/TUA1XPDVNP',NULL,'2026-05-22 01:51:12','2026-05-22 01:54:22'),(9,'2024年四季度','第009期','/uploads/3e3d507aba444feba52b3328d22620d8.png','','2024-10-22',1,0,'https://flbook.com.cn/c/VyRRc1tbK2 ',NULL,'2026-05-22 01:51:38','2026-05-22 01:54:23'),(10,'2025年一季度','第010期','/uploads/b054ec34ffdb4c10ae314a66d65d9ff7.png','','2025-01-22',1,0,'https://flbook.com.cn/c/Pesuf38p7t',NULL,'2026-05-22 01:54:19','2026-05-22 01:54:24'),(11,'2025年二季度','第011期','/uploads/d28ec0fb155949cc82bda0237965c1ac.png','','2025-04-22',1,0,'https://flbook.com.cn/c/COTY5VAtHI',NULL,'2026-05-22 01:54:56','2026-05-22 01:54:59'),(12,'2025年三季度','第012期','/uploads/aa6bc6b8995543d68a4e76a234ab5ede.png','','2025-07-22',1,0,'https://flbook.com.cn/c/3LsSxqw6oJ',NULL,'2026-05-22 02:00:25','2026-05-22 02:00:55'),(13,'2025年四季度','第013期','/uploads/507fb6cc482d4ce3995ff4e5b079ecd6.png','','2025-10-22',1,0,'https://flbook.com.cn/c/mG5eBA3bWk',NULL,'2026-05-22 02:00:53','2026-05-22 02:00:56'),(14,'2026年一季度','第014期','/uploads/14ad6c0a59e84a7a86e679654180f011.png','','2026-01-22',1,0,'https://flbook.com.cn/c/hiyzU5wQdJ',NULL,'2026-05-22 02:01:25','2026-05-22 02:01:27');
/*!40000 ALTER TABLE `journals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `article_id` (`article_id`),
  KEY `user_id` (`user_id`),
  KEY `ix_likes_id` (`id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_config`
--

DROP TABLE IF EXISTS `site_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `label` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_site_config_key` (`key`),
  KEY `updated_by` (`updated_by`),
  KEY `ix_site_config_id` (`id`),
  CONSTRAINT `site_config_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_config`
--

LOCK TABLES `site_config` WRITE;
/*!40000 ALTER TABLE `site_config` DISABLE KEYS */;
INSERT INTO `site_config` (`id`, `key`, `value`, `label`, `description`, `group`, `updated_by`, `updated_at`) VALUES (1,'about_intro','《众瀚四季》——众瀚国贸旗下企业内刊，记录成长，传递文化','期刊简介-引言',NULL,'about',NULL,'2026-05-21 08:42:56'),(2,'about_significance_title','出刊意义','期刊简介-出刊意义标题',NULL,'about',NULL,'2026-05-21 08:42:56'),(3,'about_significance_subtitle','季刊作为公司传播企业文化的载休，是企业文化建设中内部宣传的重要方式','期刊简介-出刊意义副标题',NULL,'about',NULL,'2026-05-21 08:42:56'),(4,'about_significance_items','[{\"title\":\"业务信息互通\",\"desc\":\"业务成长、技能分享，打造众瀚知识文化共享平台\"},{\"title\":\"员工交流及荣誉激励\",\"desc\":\"树立标杆形象，传播正能量\"},{\"title\":\"文化理念上传下达\",\"desc\":\"传递众瀚企业文化精神\"},{\"title\":\"沉淀公司历史\",\"desc\":\"记录并传承众瀚重要事迹及人物故事\"}]','期刊简介-出刊意义条目',NULL,'about',NULL,'2026-05-22 01:32:30'),(5,'about_dept','人力资源部','期刊简介-主办部门',NULL,'about',NULL,'2026-05-21 08:42:56'),(6,'about_cycle','每季度','期刊简介-出版周期',NULL,'about',NULL,'2026-05-21 08:42:56'),(7,'about_word_limit','不少于600字','期刊简介-征稿字数',NULL,'about',NULL,'2026-05-21 08:42:56'),(8,'about_columns','卷首语、文化有你、经办资讯、人在众瀚、文化纪实','期刊简介-主要栏目',NULL,'about',NULL,'2026-05-21 08:42:56'),(9,'about_kanyin','一刊一季，记录成长；一字一句，传递温度。\n《众瀚四季》是众瀚国贸的家，是每一位员工故事的容身之所，\n是企业文化最真实、最温暖的载体。','期刊简介-刊序引言',NULL,'about',NULL,'2026-05-21 08:42:56'),(10,'editorial_intro','一群怀揣热情的人，用文字与设计，守护每一期内刊的诞生','编辑部介绍-引言',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(11,'editorial_chief','史金鑫 Jessie','编辑部介绍-主编',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(12,'editorial_chief_dept','人力资源部','编辑部介绍-主编部门',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(13,'editorial_chief_desc','负责内刊整体方向把控、内容审核及终稿定稿','编辑部介绍-主编职责',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(14,'editorial_deputy','戴晶晶 Dora','编辑部介绍-副编',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(15,'editorial_deputy_dept','人力资源部','编辑部介绍-副编部门',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(16,'editorial_deputy_desc','协助主编开展编辑工作，统筹各栏目内容规划','编辑部介绍-副编职责',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(17,'editorial_designer','史金鑫 Jessie','编辑部介绍-排版设计',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(18,'editorial_designer_dept','人力资源部','编辑部介绍-排版部门',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(19,'editorial_designer_desc','负责内刊排版设计、封面设计及图文配置','编辑部介绍-排版职责',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(20,'editorial_members','李强Kobe、张凤ELim、周佳晨Lena、王璐瑶Ada、陈超女Claire、杨佳璐cici、柳璐妍Clara、李佳群Jacolyn','编辑部介绍-编辑成员',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(21,'editorial_message','我们是一群来自各部门、因热爱文字而走到一起的普通员工。\n我们相信，每一个人的故事都值得被记录，每一份努力都应该被看见。\n《众瀚四季》，是我们共同的作品，也是献给所有众瀚人的礼物。','编辑部介绍-寄语',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(22,'editorial_contact_person','史金鑫 Jessie','编辑部介绍-联系人',NULL,'editorial',NULL,'2026-05-21 08:42:56'),(23,'editorial_member_photos','{\"chief\":\"/uploads/4d508c5edc1e4fc594cae9c46130509e.png\",\"deputy\":\"/uploads/866696ff3b5e40248727abd8121297d1.png\",\"designer\":\"/uploads/3a66f7cb47e84f86bc200d143c6ef96d.png\",\"members\":[\"/uploads/cea3eadf8e1943d09def9fe3aba4e263.png\",\"/uploads/a40ba02a8d634e5f99ea9664a55f11ff.png\",\"/uploads/a696f828b7684d43b181ac0fc0b8f814.png\",\"/uploads/65168ef9514f4e26a30ebfa846d5dd18.png\",\"/uploads/b3d88609421b4990864ad3e847d98e7a.png\",\"/uploads/48eea777545c4037ba1bb288e52b66a3.png\",\"/uploads/49bf4238e23a4b639fffa294d6c857d8.png\",\"/uploads/90c72165df5e4eabb747d7f46e5c05e6.png\"]}','编辑部介绍-成员照片',NULL,'editorial',NULL,'2026-05-22 01:32:31'),(24,'contribute_intro','每一个人都有值得被记录的故事。欢迎全体同仁踊跃投稿，让你的声音出现在《众瀚四季》。','文稿征集-引言',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(25,'contribute_topics','价值观故事|成长感悟|正能量故事|特定主题|文艺创作','文稿征集-征稿主题',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(26,'contribute_topic_descs','体现和发扬公司价值观（其中一条）的事例|关于自我成长历程中的印象最深刻的一件事|其他发生在自己或同事身上的正能量小故事|内部通知结合公司当下情形需要的特定主题|读书分享/旅游日记/日常随感/文艺散文','文稿征集-主题说明',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(27,'contribute_requirement_1','文章结构清晰、表述通顺、紧扣主题、客观真实、有一定的文采','文稿征集-要求1',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(28,'contribute_requirement_2','篇幅不少于600字，配图更佳','文稿征集-要求2',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(29,'contribute_requirement_3','提交故事需包含：故事标题（自拟）、作者姓名及所属部门、完整的故事正文内容','文稿征集-要求3',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(30,'contribute_rating','A:500元/8分|B:400元/5分|C:300元/3分|D:200元/2分','文稿征集-评级标准',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(31,'contribute_note','编辑部收稿后5个工作日内反馈是否录用，录用稿件将进行编辑润色，不改变原意','文稿征集-备注',NULL,'contribute',NULL,'2026-05-21 08:42:56'),(32,'contribute_posters','[{\"url\":\"/uploads/fc5f16aab9d34965a7168fd24133ad8d.png\",\"title\":\"2026年创新\"},{\"url\":\"/uploads/ff23925652114c26aac0fdb917a46c84.png\",\"title\":\"2026年5月-读书日\"},{\"url\":\"/uploads/919368d36c78497da0f7b38ba777014f.png\",\"title\":\"2026年4月\"},{\"url\":\"/uploads/8b97e66fa860490487254b17117b2bcd.png\",\"title\":\"2026年3月-女神节\"},{\"url\":\"/uploads/44e0c7e1af75451da8b4ec41ab61cce8.png\",\"title\":\"2026年2月\"},{\"url\":\"/uploads/9c624671db4b46ad9edfd81e5c7e21d5.png\",\"title\":\"2025年12月\"},{\"url\":\"/uploads/dc6ab07c4f6b4eabac6ea126fe1b6602.png\",\"title\":\"2025年11月\"},{\"url\":\"/uploads/4fc8c5601dad43f29b94efe2a0d1b9c3.png\",\"title\":\"2025年10月\"}]','文稿征集-往期征稿海报',NULL,'contribute',NULL,'2026-05-22 02:16:34');
/*!40000 ALTER TABLE `site_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','editor','reader') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` smallint DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES (1,'admin','admin@ego-intl.com','$2b$12$0THKL9BGteHLMlInMn66V.NcYuxJta4oh/w0GQis/H.Rt4Ui1180i','admin',1,'2026-05-21 09:39:27','2026-05-21 09:39:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-22  2:48:55
