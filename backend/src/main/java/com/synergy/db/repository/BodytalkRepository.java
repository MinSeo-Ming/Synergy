package com.synergy.db.repository;

import com.synergy.db.entity.Bodytalk;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface BodytalkRepository extends JpaRepository<Bodytalk, Long> {
//    void deleteBysubject_set_id(@Param(value = "subjectSetId") Long subjectSetId);


}
