package com.synergy.common.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import javax.persistence.Id;

@Getter
@RedisHash("logoutAccessToken")
@AllArgsConstructor
@Builder
public class LogoutAccessToken {

    @Id
    private String id;

    private String userId;

    @TimeToLive
    private Long expiration;

    public static LogoutAccessToken of(String accessToken, String userId, Long remainingMilliSeconds) {
        return LogoutAccessToken.builder()
                .id(accessToken)
                .userId(userId)
                .expiration(remainingMilliSeconds / 1000)
                .build();
    }
}













