package com.migraine.service;

import com.migraine.dto.HealthScaleDTO;
import com.migraine.entity.HealthScale;
import com.migraine.entity.User;
import com.migraine.repository.HealthScaleRepository;
import com.migraine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 健康量表服務
 */
@Service
@RequiredArgsConstructor
public class HealthScaleService {

    private final HealthScaleRepository healthScaleRepository;
    private final UserRepository userRepository;

    /**
     * 創建量表記錄
     */
    @Transactional
    public HealthScaleDTO createScale(Long userId, HealthScaleDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("找不到用戶"));

        HealthScale scale = HealthScale.builder()
                .user(user)
                .scaleType(HealthScale.ScaleType.valueOf(dto.getScaleType()))
                .testDate(dto.getTestDate())
                .score(dto.getScore())
                .level(dto.getLevel())
                .answers(dto.getAnswers())
                .interpretation(dto.getInterpretation())
                .build();

        scale = healthScaleRepository.save(scale);
        return convertToDTO(scale);
    }

    /**
     * 獲取用戶所有量表記錄
     */
    @Transactional(readOnly = true)
    public List<HealthScaleDTO> getUserScales(Long userId) {
        return healthScaleRepository.findByUserIdOrderByTestDateDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 獲取特定類型的量表記錄
     */
    @Transactional(readOnly = true)
    public List<HealthScaleDTO> getUserScalesByType(Long userId, String scaleType) {
        HealthScale.ScaleType type = HealthScale.ScaleType.valueOf(scaleType);
        return healthScaleRepository.findByUserIdAndScaleTypeOrderByTestDateDesc(userId, type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private HealthScaleDTO convertToDTO(HealthScale scale) {
        return HealthScaleDTO.builder()
                .id(scale.getId())
                .userId(scale.getUser().getId())
                .scaleType(scale.getScaleType().name())
                .testDate(scale.getTestDate())
                .score(scale.getScore())
                .level(scale.getLevel())
                .answers(scale.getAnswers())
                .interpretation(scale.getInterpretation())
                .createdAt(scale.getCreatedAt())
                .build();
    }
}
