package com.migraine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 頭痛日誌 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeadacheLogDTO {
    private Long id;
    private Long userId;
    private LocalDateTime logDate;
    private Integer intensity;
    private String symptoms;
    private String medication;
    private String notes;
    private Integer durationHours;
    private String location;
    private String triggers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
