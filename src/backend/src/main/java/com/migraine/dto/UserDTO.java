package com.migraine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用戶 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String phone;
    private String gender;
    private Integer age;
    private String patientId;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
