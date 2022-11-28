package com.synergy.db.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubjectSetDto {
    @JsonProperty(value = "subject_set_id")
    Long id;
    @JsonProperty(value = "subject_name")
    String subjectName;
    @JsonProperty(value = "game_title")
    String gameTitle;
    @JsonProperty(value = "user_id")
    Long userId;

    public SubjectSetDto(Long id, String subjectName, String gameTitle, Long userId) {
        this.id = id;
        this.subjectName = subjectName;
        this.gameTitle = gameTitle;
        this.userId = userId;
    }
}
