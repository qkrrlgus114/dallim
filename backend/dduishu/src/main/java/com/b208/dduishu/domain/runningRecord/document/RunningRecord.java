package com.b208.dduishu.domain.runningRecord.document;

import com.b208.dduishu.domain.character.entity.Character;
import com.b208.dduishu.domain.runningRecord.dto.request.RunningRecordDistanceInfo;
import com.b208.dduishu.domain.runningRecord.dto.request.RunningRecordHeartRateInfo;
import com.b208.dduishu.domain.runningRecord.entity.RunningType;
import com.b208.dduishu.domain.user.entity.User;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "runningRecord")
@ToString
public class RunningRecord {

    @Id
    private ObjectId id;
    private User user;
    private Character character;
    private RunningType type;
    private RunningRecord rivalRecord;
    private List<RunningRecordDistanceInfo> runningRecordDistanceInfos;
    private List<RunningRecordHeartRateInfo> runningRecordHeartRateInfos;

    private int totalTime;
    private int totalDistance;
    private int averageSpeed;
    private int averageCalory;
    private LocalDateTime createdAt;

    @Builder
    public RunningRecord(User user, Character character, RunningType type, RunningRecord rivalRecord, List<RunningRecordDistanceInfo> runningRecordDistanceInfos, List<RunningRecordHeartRateInfo> runningRecordHeartRateInfos,int totalTime, int totalDistance, int averageSpeed, int averageCalory) {
        this.user = user;
        this.character = character;
        this.type = type;
        this.rivalRecord = rivalRecord;
        this.runningRecordDistanceInfos = runningRecordDistanceInfos;
        this.runningRecordHeartRateInfos = runningRecordHeartRateInfos;
        this.totalDistance = totalDistance;
        this.totalTime = totalTime;
        this.averageSpeed = averageSpeed;
        this.averageCalory = averageCalory;
        this.createdAt = LocalDateTime.now();
    }
}
