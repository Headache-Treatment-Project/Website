package com.migraine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 健康量表實體
 */
@Entity
@Table(name = "health_scales")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthScale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "scale_type", nullable = false, length = 50)
    private ScaleType scaleType;

    @Column(name = "test_date", nullable = false)
    private LocalDateTime testDate;

    @Column(nullable = false)
    private Integer score;

    @Column(length = 50)
    private String level;  // 嚴重程度等級

    @Column(columnDefinition = "TEXT")
    private String answers;  // JSON 格式的答案

    @Column(columnDefinition = "TEXT")
    private String interpretation;  // 結果判讀

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ScaleType {
        MIDAS,              // 偏頭痛失能評估量表
        HADS,               // 醫院焦慮憂鬱量表
        BDI,                // 貝克憂鬱量表
        PSQI,               // 匹茲堡睡眠品質量表
        FSS,                // 疲勞嚴重度量表
        WPI,                // 廣泛性疼痛指數
        ALLODYNIA,          // 異痛問卷
        PERCEIVED_STRESS    // 知覺壓力量表
    }
}
