package com.synergy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

/**
 * 유저 로그인 API ([POST] /auth/login) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserLoginPostRequest")
public class UserLoginPostReq {
	@ApiModelProperty(name="유저 email", example="synergy_web")
	private String email;
	@ApiModelProperty(name="유저 Password", example="your_password")
	private String password;
}