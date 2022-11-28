-- --------------------------------------------------------
-- 호스트:                          i7a306.p.ssafy.io
-- 서버 버전:                        10.6.8-MariaDB-1:10.6.8+maria~focal - mariadb.org binary distribution
-- 서버 OS:                        debian-linux-gnu
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- synergy 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `synergy` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `synergy`;

-- 테이블 synergy.bodytalk 구조 내보내기
CREATE TABLE IF NOT EXISTS `bodytalk` (
  `bodytalk_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `word` varchar(45) DEFAULT NULL,
  `subject_set_id` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`bodytalk_id`),
  KEY `FK5ulspfn32vn7vkseuukctnjdk` (`subject_set_id`),
  CONSTRAINT `FK5ulspfn32vn7vkseuukctnjdk` FOREIGN KEY (`subject_set_id`) REFERENCES `subject_set` (`subject_set_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8mb4;

-- 테이블 synergy.goldenbell 구조 내보내기
CREATE TABLE IF NOT EXISTS `goldenbell` (
  `goldenbell_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `answer` varchar(255) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `subject_set_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`goldenbell_id`),
  KEY `FKh4t0mcka1m6iu8ov7l2cik4mu` (`subject_set_id`),
  CONSTRAINT `FKh4t0mcka1m6iu8ov7l2cik4mu` FOREIGN KEY (`subject_set_id`) REFERENCES `subject_set` (`subject_set_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 테이블 synergy.subject_set 구조 내보내기
CREATE TABLE IF NOT EXISTS `subject_set` (
  `subject_set_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(45) NOT NULL,
  `game_title` varchar(45) NOT NULL,
  `user_id` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`subject_set_id`),
  KEY `FK340kyc13anaw9f0bq2jfmgp8d` (`user_id`),
  CONSTRAINT `FK340kyc13anaw9f0bq2jfmgp8d` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4;

-- 테이블 synergy.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `auth_status` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4;

/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
