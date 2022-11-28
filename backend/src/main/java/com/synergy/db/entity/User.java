package com.synergy.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User{

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    @Column(nullable = false)
    String email;
    @Column(nullable = false)
    String nickname;
    String refresh_token;

    @Column(nullable = false, columnDefinition = "boolean default False")
    Boolean auth_status = false;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    String password;

    @Column(nullable = true)
    @OneToMany(mappedBy = "user" ,cascade = {CascadeType.REMOVE})
    @JsonManagedReference
    List<SubjectSet> subjectSetList = new ArrayList<>();

}