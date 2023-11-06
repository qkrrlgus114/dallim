package com.b208.dduishu.domain.fcm.dto;

import com.b208.dduishu.domain.fcm.entity.Day;
import lombok.Data;

@Data
public class ScheduleInfo {

    private String targetToken;
    private Day day;
    private int hour;
    private int minute;
}
