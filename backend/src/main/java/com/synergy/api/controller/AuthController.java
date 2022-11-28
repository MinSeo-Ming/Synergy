package com.synergy.api.controller;

import com.synergy.api.response.TokenRes;
import com.synergy.api.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.synergy.api.request.UserLoginPostReq;
import com.synergy.api.response.UserLoginPostRes;
import com.synergy.api.service.UserService;
import com.synergy.common.model.response.BaseResponseBody;
import com.synergy.common.util.JwtTokenUtil;
import com.synergy.db.entity.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;

import java.lang.reflect.MalformedParametersException;
import java.util.NoSuchElementException;

/**
 * 인증 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Slf4j
@Api(value = "인증 API", tags = {"Auth."})
@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	UserService userService;

	@Autowired
	AuthService authService;

	@Autowired
	PasswordEncoder passwordEncoder;

	@PostMapping("/login")
	@ApiOperation(value = "로그인", notes = "<strong>아이디와 패스워드</strong>를 통해 로그인 한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "로그인 성공", response = UserLoginPostRes.class),
			@ApiResponse(code = 401, message = "이메일 또는 비밀번호가 공백", response = UserLoginPostRes.class),
			@ApiResponse(code = 403, message = "형식에 맞지 않는 이메일 또는 비밀번호", response = UserLoginPostRes.class),
			@ApiResponse(code = 404, message = "사용자 없음", response = UserLoginPostRes.class),
			@ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
	})
	public ResponseEntity<? extends BaseResponseBody> login(@RequestBody @ApiParam(value="로그인 정보", required = true) UserLoginPostReq loginInfo) {
		// 비밀번호 일치하는 경우
		try {
			TokenRes tokens = authService.login(loginInfo);
			log.debug("auth:"+tokens.getAccessToken());
			log.debug("refresh:"+tokens.getRefreshToken());

			return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", tokens.getAccessToken()));
		} catch (IllegalArgumentException e) { // 유효하지 않는 패스워드인 경우
			return ResponseEntity.status(401).body(UserLoginPostRes.of(401, "Invalid Password", null));
		} catch(MalformedParametersException e) { // 이메일이나 비밀번호가 형식이 잘못된 경우
			return ResponseEntity.status(403).body(UserLoginPostRes.of(401, "Malformed Email or Password", null));
		} catch(NoSuchElementException e) { // 사용자가 존재하지 않는 경우
			return ResponseEntity.status(404).body(UserLoginPostRes.of(404, "No User Found", null));
		} catch(IllegalStateException e){ // 이메일 인증이 안된경우
			return ResponseEntity.status(412).body(UserLoginPostRes.of(412, "Need Email Auth", null));
		} catch(RuntimeException e) {
			return ResponseEntity.status(500).body(BaseResponseBody.of(500, "Internal Server Error"));
		}
	}

	@PostMapping("/logout")
	@ApiOperation(value="로그아웃", notes="<strong>액세스 토큰</strong>을 통해 로그아웃한다.")
	@ApiResponses({
		@ApiResponse(code = 200, message = "Success", response = BaseResponseBody.class),
		@ApiResponse(code = 401, message = "Access Denied", response = BaseResponseBody.class)
	})
	public ResponseEntity<? extends BaseResponseBody> logout(@RequestBody @ApiParam(value="액세스 토큰", required = true) String accessToken) {
		try {
			authService.logout(accessToken);
			return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
		} catch (IllegalStateException e) {
			return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Access Denied"));
		}
	}

	/*
	refresh token reissue는 추후 개발
	 */
}