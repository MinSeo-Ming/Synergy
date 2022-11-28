package com.synergy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;


/**
 * 이메일 인증 API ([POST] /users/email-auth) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("EmailAuthPostRequest")
public class EmailAuthPostReq {
    @ApiModelProperty(name="유저 id", example="13")
    private String id;
    @ApiModelProperty(name="유저 Password", example="32bb501c-a144-4dc2-b19f-0424b5bc7a47")
    private String code;
}