package com.synergy.db.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class SubjectSet {

    @Id
    @Column(name = "subject_set_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "subject_name")
    String subjectName;

    @Column(name = "game_title")
    String gameTitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @OneToMany(mappedBy = "subjectSet" ,cascade = {CascadeType.REMOVE})
    @JsonManagedReference
    List<Bodytalk> bodytalks = new ArrayList<>();

}
