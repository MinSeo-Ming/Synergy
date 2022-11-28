package com.synergy.db.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "userAuth", timeToLive = 600)
public class RedisUserAuth {

    @Id
    Long userId;
    String authCode;

}