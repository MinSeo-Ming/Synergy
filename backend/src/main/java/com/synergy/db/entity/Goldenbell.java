package com.synergy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Goldenbell {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goldenbell_id")
    Long id;

    String question;
    String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_set_id")
    SubjectSet subjectSet;
}
