package com.synergy.db.repository;

import com.synergy.common.auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, String> {
}
