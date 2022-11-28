package com.synergy.api.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.synergy.common.model.response.BaseResponseBody;
import com.synergy.db.entity.Bodytalk;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ApiModel("Bodytalk Response")
public class BodytalkRes extends BaseResponseBody {

    @JsonProperty(value = "data")
    List<Bodytalk> bodytalkList = new ArrayList<>();

    public static BodytalkRes of(Integer statusCode, String message, List<Bodytalk> bodytalkList) {
        BodytalkRes res = new BodytalkRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        // 문제 리스트 넣어서 반환
        res.setBodytalkList(bodytalkList);
        return res;
    }
}
