package com.synergy.api.request.channel;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("Participant post Request")
@AllArgsConstructor
public class ParticipantPostReq {

    @ApiModelProperty(name = "참가자 닉네임", example = "alice")
    String nickName;

    @ApiModelProperty(name = "참가자 openvidu connection id", example = "")
    String connectionId;
}
