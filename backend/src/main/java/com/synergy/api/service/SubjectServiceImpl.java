package com.synergy.api.service;

import com.synergy.db.entity.*;
import com.synergy.db.repository.BodytalkRepository;
import com.synergy.db.repository.SubjectSetRepository;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    SubjectSetRepository subjectSetRepository;
    @Autowired
    BodytalkRepository bodytalkRepository;

    @Override
    public List<SubjectSetDto> getSubjectSets(List<Long> ids) {
        return subjectSetRepository.findByuser_idIn(ids);
    }

    @Override
    public List<Bodytalk> getBodytalk(Long subjectId) {
        SubjectSet subjectSet = subjectSetRepository.findById(subjectId).get();
        return subjectSet.getBodytalks();
    }

    @Override
    public SubjectSet getSubjectSet(Long subjectId) {
        return subjectSetRepository.findById(subjectId).get();
    }

    @Override
    public void createSubjectSet(String subjectName, User user,String gameTitle,List<String> wordList) {
        SubjectSet initSet = new SubjectSet();
        List<Bodytalk> bodytalkList = new ArrayList<>();
        initSet.setGameTitle(gameTitle);
        initSet.setSubjectName(subjectName);
        initSet.setUser(user);
        SubjectSet subjectSet =subjectSetRepository.save(initSet);

        for (String word:wordList) {
            Bodytalk bodytalk = new Bodytalk();
            bodytalk.setSubjectSet(subjectSet);
            bodytalk.setWord(word);
            Bodytalk savedBodytalk= bodytalkRepository.save(bodytalk);
            bodytalkList.add(savedBodytalk);
        }

        subjectSet.setBodytalks(bodytalkList);

        subjectSetRepository.save(subjectSet);
    }

    @Override
    public void deleteSubjectSet( Long subjectId) {
        subjectSetRepository.deleteById(subjectId);

    }

    @Override
    public void deleteAllSubjectSet(Long userId) {
        List<SubjectSetDto> list = subjectSetRepository.findByuser_idIn(Collections.singletonList(userId));
        for (SubjectSetDto s: list) {
            subjectSetRepository.deleteById(s.getId());
        }
    }


}
