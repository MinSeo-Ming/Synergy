package com.synergy.api.service;

import com.synergy.api.request.UserLoginPostReq;
import com.synergy.api.response.TokenRes;
import com.synergy.common.auth.RefreshToken;
import com.synergy.common.auth.UserDetails;
import com.synergy.common.util.JwtTokenUtil;
import com.synergy.config.TokenConfig;
import com.synergy.db.entity.User;
import com.synergy.db.repository.RefreshTokenRedisRepository;
import com.synergy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

import java.lang.reflect.MalformedParametersException;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    public TokenRes login(UserLoginPostReq req) {
        // 이메일과 비밀번호 모두 비어서는 안됨
        if(req.getEmail() == null || req.getPassword() == null)
            throw new IllegalArgumentException("please enter email and password");

        // 이메일 형식이 맞아야 하고, 비밀번호도 8자리 이상이어야 한다
        String regex = "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$";
        if(!Pattern.matches(regex, req.getEmail()) || req.getPassword().length() < 8)
            throw new MalformedParametersException("please check email or password");

        log.debug("req email: "+req.getEmail()+" req password: "+req.getPassword());

        // 사용자 이메일로 사용자가 존재하는지 확인
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(NoSuchElementException::new);

        // 입력으로 들어온 비밀번호와 DB에 저장된 암호를 비교해 비밀번호가 맞는지 확인
        checkPassword(req.getPassword(), user.getPassword());

        // 이메일 인증을 마친 사용자인지 확인
        log.debug(user.getAuth_status() ? "true" : "false");
        if(!user.getAuth_status()){
            throw new IllegalStateException("Need Email Auth");
        }

        String accessToken = JwtTokenUtil.getToken(String.valueOf(user.getId()));
        log.debug("created access token "+accessToken);

        RefreshToken refreshToken = saveRefreshToken(String.valueOf(user.getId()));
        log.debug("created refresh token "+refreshToken);

        return new TokenRes(accessToken, refreshToken.getRefreshToken());
    }

    public void logout(String accessToken) {
        if(accessToken == null)
            throw new IllegalStateException("Access Denied");
    }

    public void checkPassword(String rawPass, String encodedPassword) {
        if(!passwordEncoder.matches(rawPass, encodedPassword)) {
            throw new IllegalArgumentException("wrong password");
        }
    }

    public RefreshToken saveRefreshToken(String userId) {
        return refreshTokenRedisRepository.save(RefreshToken.createRefreshToken(userId,
                JwtTokenUtil.getToken(userId), TokenConfig.DEFAULT_EXPIRE_SEC));
    }

    public String resolveToken(String token) {
        int headerLength = 7;
        return token.substring(headerLength);
    }

    public TokenRes reissue(String refreshToken) {
        refreshToken = resolveToken(refreshToken);
        String email = getCurrentUserEmail();
        // redis에서 id로 이메일 사용.
        RefreshToken redisRefreshToken = refreshTokenRedisRepository.findById(email).orElseThrow(NoSuchElementException::new);

        if(refreshToken.equals(redisRefreshToken.getRefreshToken())) {
            return reissueRefreshToken(refreshToken, email);
        }
        throw new IllegalArgumentException("토큰이 일치하지 않습니다");
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        return principal.getUsername();
    }

    public TokenRes reissueRefreshToken(String refreshToken, String userId) {
        return null;
    }

    public boolean lessThenReissueExpirationTimesLeft(String refreshToken) {
        return false;
    }
}
