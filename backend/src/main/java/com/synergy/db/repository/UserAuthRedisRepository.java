package com.synergy.db.repository;

import com.synergy.db.entity.RedisUserAuth;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAuthRedisRepository extends CrudRepository<RedisUserAuth, String> {

}