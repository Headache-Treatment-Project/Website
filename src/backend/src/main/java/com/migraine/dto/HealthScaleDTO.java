package com.migraine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 健康量表 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthScaleDTO {
    private Long id;
    private Long userId;
    private String scaleType;
    private LocalDateTime testDate;
    private Integer score;
    private String level;
    private String answers;
    private String interpretation;
    private LocalDateTime createdAt;
}
