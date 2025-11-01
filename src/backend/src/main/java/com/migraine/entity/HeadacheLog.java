package com.migraine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 頭痛日誌實體
 */
@Entity
@Table(name = "headache_logs")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeadacheLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDateTime logDate;

    @Column(nullable = false)
    private Integer intensity;  // 疼痛強度 1-10

    @Column(length = 500)
    private String symptoms;  // 症狀描述（逗號分隔）

    @Column(length = 200)
    private String medication;  // 用藥

    @Column(length = 500)
    private String notes;  // 備註

    @Column(name = "duration_hours")
    private Integer durationHours;  // 持續時間（小時）

    @Column(length = 100)
    private String location;  // 疼痛部位

    @Column(length = 200)
    private String triggers;  // 誘發因素

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
