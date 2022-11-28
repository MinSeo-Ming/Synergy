package com.synergy.db.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Bodytalk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bodytalk_id")
    Long id;

    String word;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_set_id")
    @JsonBackReference
    SubjectSet subjectSet;
}
