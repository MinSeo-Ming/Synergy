package com.synergy.api.service.channel;

import com.synergy.api.response.channel.ChannelInfoReq;
import com.synergy.db.entity.Participant;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;

public interface ChannelService {
    //채널 1개 갖고 오기
    Channel getChannelByChannelId(String channelId);

    ResponseEntity findChannel(String channelId);
    //필요할지는 모르지만 host의 nickname으로 검색 -> ChannelInfoRes 로 수정할수도 있음 07.27
    ArrayList<Channel> getChannelByHostName(String nickName);

    void removeChannel(String channelId);
    Channel createAndPutRoom(String channelId);

    boolean channelExistenceOnOV(String channelId);

    boolean joinChannel(Participant participant);

    boolean checkChannelNickNameDuplicate(String channelId, String nickName); //중복일시 참 아닐시 거짓.

    void leaveChannel(String channelId, String nickName);
    void deleteChannel(String channelId, String nickName);
    ArrayList<ChannelInfoReq> getChannelList();
    ChannelInfoReq getChannelInfo(String channelId);


    String getRandomChannelId();

    String getNicknameByConnectionId(String channelId, String connectionId);
}
