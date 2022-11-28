package com.synergy.db.repository;

import com.synergy.db.entity.BodytalkDto;
import com.synergy.db.entity.SubjectSet;
import com.synergy.db.entity.SubjectSetDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectSetRepository extends JpaRepository<SubjectSet, Long> {

    List<SubjectSetDto> findByuser_idIn(List<Long> ids);
    Optional<SubjectSet> findById(Long id);
//    void deleteByuser_id(Long id);
}
