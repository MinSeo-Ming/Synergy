package com.synergy.api.service;

import com.synergy.api.request.EmailAuthPostReq;
import com.synergy.common.util.RedisUtil;
import com.synergy.db.entity.RedisUserAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.synergy.api.request.UserRegisterPostReq;
import com.synergy.db.entity.User;
import com.synergy.db.repository.UserRepository;
import com.synergy.db.repository.UserRepositorySupport;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	UserRepositorySupport userRepositorySupport;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	RedisUtil redisUtil;

	@Override
	public User createUser(UserRegisterPostReq userRegisterInfo) {
		User user = new User();
		user.setEmail(userRegisterInfo.getEmail());
		// 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
		user.setNickname(userRegisterInfo.getNickname());
		return userRepository.save(user);
	}

	@Override
	public User getUserByUserId(String userId) {
		// 디비에 유저 정보 조회 (userId 를 통한 조회).
		User user = userRepositorySupport.findUserByUserId(userId).get();
		return user;
	}

	@Override
	public User getUserByEmail(String email) { // 로그인 위해 추가
		User user = userRepository.findByEmail(email).get();
		return user;
	}

	@Override
	public boolean isExistEmail(String email) {
		if(userRepository.countByEmail(email) > 0) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean isExistNickname(String nickname) {
		if(userRepository.countByNickname(nickname) > 0) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public boolean authorizeUser(EmailAuthPostReq emailAuthPostReq) {

		User user = userRepository.findById(Long.valueOf(emailAuthPostReq.getId())).get();
		RedisUserAuth userAuth =  redisUtil.getUserAuth(emailAuthPostReq.getId());
		// 저장된 코드와 링크에서 얻어온 코드 확인
		if (userAuth.getAuthCode().equals(emailAuthPostReq.getCode())) {
			user.setAuth_status(true);
			userRepository.save(user);
			return true;
		} else {
			return false;
		}

	}

	@Override
	public void deleteUserByUserId(String userId) {
		userRepository.deleteById(Long.valueOf(userId));
	}

	@Override
	public String getUserNickName(String userId) {
		return userRepository.findById(Long.valueOf(userId)).get().getNickname();
	}
}