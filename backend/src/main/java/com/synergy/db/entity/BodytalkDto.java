package com.synergy.db.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class BodytalkDto {
    @JsonProperty(value = "bodytalk_id")
    Long id;
    String word;
    
}
