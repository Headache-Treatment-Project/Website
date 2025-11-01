package com.migraine.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 註冊請求 DTO
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "Email 不能為空")
    @Email(message = "Email 格式不正確")
    private String email;

    @NotBlank(message = "密碼不能為空")
    @Size(min = 6, message = "密碼至少需要 6 個字元")
    private String password;

    @NotBlank(message = "姓名不能為空")
    private String name;

    @NotBlank(message = "角色不能為空")
    private String role;  // PATIENT, DOCTOR, CASE_MANAGER

    private String phone;
    private String gender;
    private Integer age;
    private String patientId;
}
