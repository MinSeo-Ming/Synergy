package com.synergy.api.controller;

import com.synergy.api.request.EmailAuthPostReq;
import com.synergy.api.response.MyPageRes;
import com.synergy.api.service.MailService;
import com.synergy.api.service.SubjectService;
import com.synergy.common.util.RedisUtil;
import com.synergy.db.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.synergy.api.request.UserRegisterPostReq;
import com.synergy.api.response.UserRes;
import com.synergy.api.service.UserService;
import com.synergy.common.auth.UserDetails;
import com.synergy.common.model.response.BaseResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import retrofit2.http.Path;
import springfox.documentation.annotations.ApiIgnore;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * 유저 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "유저 API", tags = {"User"})
@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	UserService userService;

	@Autowired
	MailService mailService;

	@Autowired
	SubjectService subjectService;

	@Autowired
	RedisUtil redisUtil;

	@PostMapping("/signup")
	@ApiOperation(value = "회원 가입", notes = "<strong>아이디와 패스워드</strong>를 통해 회원가입 한다.")
	@ApiResponses({
			@ApiResponse(code = 201, message = "Created"),
			@ApiResponse(code = 400, message = "잠시 후 다시 시도해주세요."),
			@ApiResponse(code = 409, message = "이미 가입된 이메일입니다."),
			@ApiResponse(code = 409, message = "이미 가입된 닉네임입니다."),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> register(
			@RequestBody @ApiParam(value="회원가입 정보", required = true) UserRegisterPostReq registerInfo) {

		//중복 가입 체크
		if(userService.isExistEmail(registerInfo.getEmail())){
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "이미 가입된 이메일입니다."));
		} else if (userService.isExistNickname(registerInfo.getNickname())) {
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "이미 가입된 닉네임입니다."));
		}
		//임의로 리턴된 User 인스턴스. 현재 코드는 회원 가입 성공 여부만 판단하기 때문에 굳이 Insert 된 유저 정보를 응답하지 않음.
		User user = userService.createUser(registerInfo);

		UserEmailForm userEmailForm = new UserEmailForm(user.getId(), user.getEmail(), redisUtil.makeUUID(user.getId()));
		mailService.sendAuthEmail(userEmailForm);

		return ResponseEntity.status(201).body(BaseResponseBody.of(201, "Created"));
	}

	@GetMapping("")
	@ApiOperation(value = "회원 본인 정보 조회", notes = "로그인한 회원 본인의 정보를 응답한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패"),
			@ApiResponse(code = 404, message = "사용자 없음"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<MyPageRes> getUserInfo(@ApiIgnore Authentication authentication) {
		/**
		 * 요청 헤더 액세스 토큰이 포함된 경우에만 실행되는 인증 처리이후, 리턴되는 인증 정보 객체(authentication) 통해서 요청한 유저 식별.
		 * 액세스 토큰이 없이 요청하는 경우, 403 에러({"error": "Forbidden", "message": "Access Denied"}) 발생.
		 */
		UserDetails userDetails = (UserDetails)authentication.getDetails();
		String username = userDetails.getUserNickname();

		if(username==null){
			return ResponseEntity.status(404).body(MyPageRes.builder().build());
		}
		String userEmail = userDetails.getUserEmail();

		//내가 생성한 문제집 리스트
		List<SubjectSetDto> list = subjectService.getSubjectSets(Arrays.asList(Long.valueOf(userDetails.getUsername())));


		return ResponseEntity.status(200).body(MyPageRes.builder()
				.userNickName(username).userEmail(userEmail).subjectList(list)
				.build());

	}

	@PostMapping("/email")
	@ApiOperation(value = "이메일 중복 검사", notes = "이미 가입된 이메일인지 확인한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "사용 가능한 이메일"),
			@ApiResponse(code = 409, message = "중복된 이메일"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> isEmailExist(@RequestBody UserDto user){
		if(userService.isExistEmail(user.getEmail())){
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "중복된 이메일"));
		}
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "사용 가능한 이메일"));
	}

	@PostMapping("/nickname")
	@ApiOperation(value = "닉네임 중복 검사", notes = "이미 등록된 닉네임인지 확인한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "사용 가능한 닉네임"),
			@ApiResponse(code = 409, message = "중복된 닉네임"),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> isNicknameExist(@RequestBody UserDto user){
		if(userService.isExistNickname(user.getNickname())){
			return ResponseEntity.status(409).body(BaseResponseBody.of(409, "중복된 닉네임"));
		}
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "사용 가능한 닉네임"));
	}

	@PostMapping("/email-auth")
	@ApiOperation(value = "이메일 본인 인증", notes = "넘어온 코드가 일치하는지 확인 확인한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "본인 인증이 완료되었습니다."),
			@ApiResponse(code = 401, message = "인증코드가 일치하지 않습니다."),
			@ApiResponse(code = 404, message = "만료된 요청입니다."),
			@ApiResponse(code = 500, message = "서버 오류")
	})
	public ResponseEntity<? extends BaseResponseBody> authorizeUser(
			@RequestBody EmailAuthPostReq emailAuthPostReq){

		//Redis 조회한 후 코드일치하는지 확인
		try {
			if (userService.authorizeUser(emailAuthPostReq)) {
				return ResponseEntity.status(200).body(BaseResponseBody.of(200, "본인 인증이 완료되었습니다."));
			} else {
				return ResponseEntity.status(404).body(BaseResponseBody.of(401, "인증코드가 일치하지 않습니다."));
			}
		} catch(NoSuchElementException e) {
			return ResponseEntity.status(404).body(BaseResponseBody.of(404, "만료된 요청입니다."));
		}

	}

	@DeleteMapping("")
	@ApiOperation(value = "회원 탈퇴", notes = "회원 탈퇴")
	@ApiResponses({
			@ApiResponse(code = 200, message = "회원 탈퇴 성공")
	})
	public ResponseEntity deleteUser(@ApiIgnore Authentication authentication){
		UserDetails userDetails = (UserDetails)authentication.getDetails();
		String userId = userDetails.getUsername();
		userService.deleteUserByUserId(userId);
		return new ResponseEntity(HttpStatus.OK);
	}

}