package com.synergy.api.service.channel;

import com.synergy.api.controller.ChannelController;
import com.synergy.api.response.channel.ChannelInfoReq;
import com.synergy.db.entity.Participant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class ChannelServiceImpl implements ChannelService{

    private final Logger log = LoggerFactory.getLogger(ChannelServiceImpl.class);

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;
    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

//    private String   OPENVIDU_URL="";
//    private String OPENVIDU_SECRET="";
    private String OPENVIDU_AUTH;

    private final ConcurrentMap<String,Channel> channelList = new ConcurrentHashMap<>();//channelid, channel


    public Channel bringChannel(String channelId){
        return channelList.get(channelId);
    }

    @Override
    public Channel getChannelByChannelId(String channelId) {
        return channelList.get(channelId);
    }

    @Override
    public ResponseEntity findChannel(String channelId) {
        boolean channelExist = channelExistenceOnOV(channelId);
        if(channelExist){
            log.debug("channel : {} is exist in OpenVidu Server",channelId);
        }else{
            log.debug("channel : {} is NOT exist in OpenVidu Server",channelId);
        }
        Channel channel = this.bringChannel(channelId);

        if(channelExist){
            if(channel!=null){
                log.debug("channel : {} is on Memory",channel.getChannelId());
                return new ResponseEntity(channel.getChannelId(), HttpStatus.OK);
            }else{
                log.debug("channel : {} is NOT on Memory",channelId);
                channel = this.bringChannel(channelId);
                return new ResponseEntity(channel.getChannelId(), HttpStatus.OK);
            }
        }else{
            if(channel!=null){
                this.removeChannel(channelId);
            }else {
                log.debug("channel is not found in memory");
            }
            return  new ResponseEntity(HttpStatus.NOT_FOUND);
        }

    }

    @Override
    public ArrayList<Channel> getChannelByHostName(String nickName) {
        ArrayList<Channel> list = (ArrayList<Channel>) channelList.values();
        ArrayList<Channel> result = new ArrayList<>();
        for(Channel channel :list){
            if(channel.getHost().getNickName().equals(nickName)){
                if(this.findChannel(channel.getChannelId()).equals(HttpStatus.OK)){
                    result.add(channel);
                }
            }
        }

        return result;

    }

    //채널 목록에서 삭제하기.
    @Override
    public void removeChannel(String channelId) {
        channelList.remove(channelId);
    }

    @Override
    public Channel createAndPutRoom(String channelId) {
        Channel channel = new Channel(channelId);
        channelList.put(channelId,channel);
        return channel;
    }

    @Override
    public boolean channelExistenceOnOV(String channelId) {
        if(OPENVIDU_AUTH==null){
            OPENVIDU_AUTH = "Basic "+ Base64.getEncoder().encodeToString(OPENVIDU_SECRET.getBytes(StandardCharsets.UTF_8));

            log.debug(OPENVIDU_AUTH);
            //확인용도

        }

        HttpURLConnection  connection = null;

        try{
            URL url = new URL(OPENVIDU_URL+"api/sessions/"+channelId);
            connection = (HttpURLConnection) url.openConnection();

            connection.setRequestProperty("Authorization",OPENVIDU_AUTH);

            int responseCode = connection.getResponseCode();
            log.debug("Find Channel in OpenVidu response code : {}",responseCode);

            if(responseCode==200)return true;
            else return false;

        }catch (Exception e){
            e.printStackTrace();
            return  false;
        }finally {
            if(connection!=null){
                connection.disconnect();
            }
        }

    }

    @Override
    public boolean joinChannel(Participant participant) {
        Channel channel = channelList.get(participant.getChannelId());
        if(channel.addParticipant(participant)){
            log.debug("participant {} joined channel {}",participant.getNickName(), participant.getChannelId());
            return true;
        }else{
            log.debug("participant {} CAN NOT joined channel {}",participant.getNickName(), participant.getChannelId());
            return false;
        }
    }

    @Override
    public boolean checkChannelNickNameDuplicate(String channelId, String nickName) {
        Channel channel= channelList.get(channelId);
        if(channel.getParticipantList()==null||channel.getParticipantList().containsKey(nickName))return true;// 중복이면 참
        else return false;//중복이 아니면 거짓
    }

    //팀원이 떠나는 경우.
    @Override
    public void leaveChannel(String channelId, String nickName) {
        Channel channel = channelList.get(channelId);
        if(channel!=null){
            int result = channel.removeParticipant(nickName);
            if(result!=-1){
                log.debug("participant leave the channel {}",channelId);
            }else{
                log.debug("channel {} is DELETED",channelId);
                channelList.remove(channelId);
            }
        }
    }

    //채널에서 영구 삭제 -> 방장이 떠났을경우
    @Override
    public void deleteChannel(String channelId, String nickName) {
        Channel channel = channelList.get(channelId);
        if(channel!=null){
            if(channel.getHost().getNickName().equals(nickName)){
                channelList.remove(channelId);
            }
        }
    }

    @Override
    public ArrayList<ChannelInfoReq> getChannelList() {
        ArrayList<ChannelInfoReq> list = new ArrayList<>();

        for(Channel channel: channelList.values()){
            ChannelInfoReq channelInfoReq = new ChannelInfoReq(channel.getChannelId(),
                    channel.getHost().getNickName(),
                    channel.getNumOfMember(),
                    channel.findAllParticipant());
            list.add(channelInfoReq);
        }
        return list;
    }

    @Override
    public ChannelInfoReq getChannelInfo(String channelId) {
        Channel channel = channelList.get(channelId);

        if(channel==null)return null;
        else{
            ChannelInfoReq channelInfoReq = new ChannelInfoReq(channelId,
                    channel.getHost().getNickName(),
                    channel.getNumOfMember(),
                    channel.findAllParticipant());
            return channelInfoReq;
        }
    }
    public String generateRandomChannelId(){
        StringBuffer channelId = new StringBuffer();
        Random random = new Random();

        channelId.append((char)((int)(random.nextInt(26))+65));
        channelId.append((char)((int)(random.nextInt(26))+65));
        channelId.append(random.nextInt(10));
        channelId.append(random.nextInt(10));
        channelId.append(random.nextInt(10));
        channelId.append(random.nextInt(10));
        return channelId.toString();
    }

    @Override
    public String getRandomChannelId() {
        String channelId = this.generateRandomChannelId();
        while (channelList.containsKey(channelId)){
            channelId=this.generateRandomChannelId();
        }
        return channelId;
    }

    @Override
    public String getNicknameByConnectionId(String channelId, String connectionId) {
        Channel channel = channelList.get(channelId);
        ConcurrentMap<String, Participant> participantList = channel.getParticipantList();
        return participantList.entrySet().stream()
                .filter(e -> connectionId.equals(e.getValue().getConnectionId()))
                .map(Map.Entry::getKey)
                .findFirst().get();
    }
}
