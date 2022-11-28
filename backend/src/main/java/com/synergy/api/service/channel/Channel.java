package com.synergy.api.service.channel;

import com.synergy.db.entity.Participant;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Getter
@Setter
public class Channel {
    private final Logger log = LoggerFactory.getLogger(Channel.class);
    private final int joinMemberLimit = 6; // 방에 조인하는 최대 인원
    private int numOfMember;
    private final ConcurrentMap<String, Participant> participantList = new ConcurrentHashMap<String, Participant>();
    private Participant Host;
    private final String channelId;

    public Channel(String channelId){
        this.channelId =channelId;
        log.info("Channel {} is created",channelId);
    }

    public boolean addParticipant(Participant participant){
        if(this.numOfMember>= joinMemberLimit){
            log.debug("Channel {} is full",channelId);
            return false;
        }
        this.participantList.put(participant.getNickName(),participant);
        this.numOfMember++;
        log.debug("Channel {} 's current number of Memeber = {}",channelId,numOfMember);
        return true;
    }
    public int removeParticipant(String nickName){
        if(participantList.containsKey(nickName)){
            this.participantList.remove(nickName);
            return --numOfMember;
        }
        return -1;
    }

    public Participant findOneParticipantByNickName(String nickName){
        return participantList.get(nickName);
    }

    public ArrayList<Participant> findAllParticipant(){
        return new ArrayList<>(this.participantList.values());
    }

    public ArrayList<String>findAllParticipantNickName(){
        return new ArrayList<>(this.participantList.keySet());
    }




}
