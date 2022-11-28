package com.synergy.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.synergy.common.model.response.BaseResponseBody;
import com.synergy.db.entity.SubjectSetDto;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ApiModel("Subject Response")
public class SubjectSetRes extends BaseResponseBody {

    @JsonProperty(value = "data")
    List<SubjectSetDto> subjectList = new ArrayList<>();

    public static SubjectSetRes of(Integer statusCode, String message, List<SubjectSetDto> subjectList) {
        SubjectSetRes res = new SubjectSetRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        // 문제집 리스트 넣어서 반환
        res.setSubjectList(subjectList);
        return res;
    }
}
