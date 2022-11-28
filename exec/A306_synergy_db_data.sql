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

-- 테이블 데이터 synergy.bodytalk:~97 rows (대략적) 내보내기
DELETE FROM `bodytalk`;
/*!40000 ALTER TABLE `bodytalk` DISABLE KEYS */;
INSERT INTO `bodytalk` (`bodytalk_id`, `word`, `subject_set_id`) VALUES
	(1, '호랑이', 1),
	(2, '기린', 1),
	(3, '원숭이', 1),
	(4, '강아지', 1),
	(5, '금붕어', 1),
	(6, '사자', 1),
	(7, '돼지', 1),
	(8, '고양이', 1),
	(9, '양', 1),
	(10, '캥거루', 1),
	(11, '거북이', 1),
	(12, '펭귄', 1),
	(13, '나비', 1),
	(14, '토끼', 1),
	(15, '바다코끼리', 1),
	(16, '상어', 1),
	(17, '007', 2),
	(18, '타이타닉', 2),
	(19, '아이언맨', 2),
	(20, '스파이더맨', 2),
	(21, '캡틴아메리카', 2),
	(22, '인셉션', 2),
	(23, '캐리비안의 해적', 2),
	(24, '닥터스트레인지', 2),
	(25, '터미네이터', 2),
	(26, '가위손', 2),
	(27, '나홀로집에', 2),
	(28, '해리포터', 2),
	(29, '휴대폰', 3),
	(30, '십자가', 3),
	(31, '기저귀', 3),
	(32, '바지', 3),
	(33, '이쑤시개', 3),
	(34, '자전거', 3),
	(35, '동전', 3),
	(36, '가위', 3),
	(37, '가방', 3),
	(38, '화장품', 3),
	(39, '테이프', 3),
	(40, '장갑', 3),
	(41, '안경', 3),
	(42, '시계', 3),
	(43, '젓가락', 3),
	(44, '모자', 3),
	(45, '발없는 말이 천리간다', 4),
	(46, '우물 안 개구리', 4),
	(47, '다 된 밥에 재 뿌리기', 4),
	(48, '달면 삼키고 쓰면 뱉는다', 4),
	(49, '개 팔자가 상팔자다', 4),
	(50, '열 번 찍어 안넘어 가는 나무 없다', 4),
	(51, '하늘의 별따기', 4),
	(52, '칼로 물베기', 4),
	(53, '수박 겉핥기', 4),
	(54, '배보다 배꼽이 더 크다', 4),
	(55, '땅짚고 헤엄치기', 4),
	(56, '야구', 5),
	(57, '수영', 5),
	(58, '농구', 5),
	(59, '골프', 5),
	(60, '양궁', 5),
	(61, '스키', 5),
	(62, '태권도', 5),
	(63, '스키점프', 5),
	(64, '축구', 5),
	(65, '배구', 5),
	(66, '탁구', 5),
	(67, '권투', 5),
	(68, '사격', 5),
	(69, '테니스', 5),
	(70, '볼링', 5),
	(71, '검도', 5),
	(72, '유도', 5),
	(73, '씨름', 5),
	(92, '햄버거', 6),
	(93, '김치', 6),
	(94, '바나나', 6),
	(95, '라면', 6),
	(96, '산낙지', 6),
	(97, '피자', 6),
	(98, '아이스크림', 6),
	(99, '붕어빵', 6),
	(100, '삶은계란', 6),
	(101, '상추', 6),
	(102, '옥수수', 6),
	(103, '빙수', 6),
	(104, '기쁨', 7),
	(105, '슬픔', 7),
	(106, '피곤', 7),
	(107, '추움', 7),
	(108, '사랑', 7),
	(109, '외로움', 7),
	(110, '더움', 7),
	(111, '배고픔', 7),
	(112, '아픔', 7),
	(113, '화남', 7),
	(114, '경멸', 7),
	(115, '짜증', 7);
/*!40000 ALTER TABLE `bodytalk` ENABLE KEYS */;

-- 테이블 데이터 synergy.goldenbell:~0 rows (대략적) 내보내기
DELETE FROM `goldenbell`;
/*!40000 ALTER TABLE `goldenbell` DISABLE KEYS */;
/*!40000 ALTER TABLE `goldenbell` ENABLE KEYS */;

-- 테이블 데이터 synergy.subject_set:~7 rows (대략적) 내보내기
DELETE FROM `subject_set`;
/*!40000 ALTER TABLE `subject_set` DISABLE KEYS */;
INSERT INTO `subject_set` (`subject_set_id`, `subject_name`, `game_title`, `user_id`) VALUES
	(1, '동물', 'bodytalk', 1),
	(2, '영화', 'bodytalk', 1),
	(3, '사물', 'bodytalk', 1),
	(4, '속담', 'bodytalk', 1),
	(5, '운동', 'bodytalk', 1),
	(6, '음식', 'bodytalk', 1),
	(7, '감정', 'bodytalk', 1);
/*!40000 ALTER TABLE `subject_set` ENABLE KEYS */;

-- 테이블 데이터 synergy.user:~8 rows (대략적) 내보내기
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `email`, `nickname`, `PASSWORD`, `refresh_token`, `auth_status`) VALUES
	(1, 'admin@synergy.com', 'admin', 'synergy', NULL, 1),
	(59, 'kbm4250@naver.com', '시너지강봉민', '$2a$10$1KeKvfKuOUmt9pXvo2oxLuZRRVgmgFabJIRU.cZnyVxZU0QLQVIHS', NULL, 1),
	(61, 'wulta906@gmail.com', '김영훈김영훈', '$2a$10$qxC/KzQ.3MBFQhsvCJH7t.r.UohoS9jKmc7makTNoLUzViCPrFpya', NULL, 1),
	(97, 'snusjmy@gmail.com', 'iceamericano', '$2a$10$VWXH33S/B.Rmz5AW6R5nkOGGaDwjF.Rzt4HrLyTRpu6GIHdBxm64e', NULL, 1),
	(101, 'sujung6137@hanmail.net', 'watermelon', '$2a$10$HKRrAjYi.1WybHlM2XzMl.ArUZv5F7ovGOgG3mVWj4MSRrKQjrReW', NULL, 1),
	(109, 'gounep@naver.com', 'snowsnow', '$2a$10$F4GkghEySltBPyYSwtto5.EHCCPkGgzxpOBMCUrDDW/k8qDLVzlyC', NULL, 1),
	(111, 'ho0524870@gmail.com', '시너지전종민', '$2a$10$UY0KFsP2N4CUKj3OxHnD/u4DroZQlwbRJcbB3Mzrt39E4A.h6dMm6', NULL, 1),
	(115, 'jbright0504@gmail.com', 'jinmyeong', '$2a$10$OdtA177uN2WaZ0LpErTAD.bYGvAn8GYe2PukzKZDcY9SlnZIEK9mS', NULL, 1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
