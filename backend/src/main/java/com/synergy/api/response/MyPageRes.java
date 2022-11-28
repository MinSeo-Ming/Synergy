package com.synergy.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.synergy.db.entity.Bodytalk;
import com.synergy.db.entity.SubjectSetDto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@ApiModel("Mypage only")
public class MyPageRes {
    @ApiModelProperty(name = "User userNickName")
    String userNickName;

    @ApiModelProperty(name = "User email")
    String userEmail;

    @JsonProperty(value = "data")
    List<SubjectSetDto> subjectList;


}
