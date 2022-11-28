package com.synergy.api.service;

import com.synergy.api.request.EmailAuthPostReq;
import com.synergy.api.request.UserRegisterPostReq;
import com.synergy.db.entity.User;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User createUser(UserRegisterPostReq userRegisterInfo);
	User getUserByUserId(String userId);
	User getUserByEmail(String email); // 로그인 위해 추가
	boolean isExistEmail(String email);
	boolean isExistNickname(String nickname);
	boolean authorizeUser(EmailAuthPostReq emailAuthPostReq);

	void deleteUserByUserId (String userId);

	String getUserNickName(String userId);
}
