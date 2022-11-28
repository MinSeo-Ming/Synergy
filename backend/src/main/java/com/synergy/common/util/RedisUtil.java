package com.synergy.common.util;

import com.synergy.db.entity.RedisUserAuth;
import com.synergy.db.repository.UserAuthRedisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RedisUtil {

    @Autowired
    UserAuthRedisRepository userAuthRedisRepository;

    public String makeUUID(Long id){
        UUID uuid = UUID.randomUUID();
        System.out.println("uuid: " + uuid);
        userAuthRedisRepository.save(new RedisUserAuth(id, uuid.toString()));

        return uuid.toString();
    }

    public RedisUserAuth getUserAuth(String id) {
        return userAuthRedisRepository.findById(id).get();
    }
}