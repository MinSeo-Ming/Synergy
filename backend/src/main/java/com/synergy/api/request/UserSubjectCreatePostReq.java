package com.synergy.api.request;

import com.synergy.db.entity.Bodytalk;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("User create subject set and bodytalk")
public class UserSubjectCreatePostReq {
    @ApiModelProperty(name="게임 카테고리 / 게임 이름", example="Animal")
    String subjectName;
    @ApiModelProperty(name="게임 종류", example="BodyTalk")
    String gameTitle;
    @ApiModelProperty(name="문제 리스트")
    List<String> bodytalkList;
}
