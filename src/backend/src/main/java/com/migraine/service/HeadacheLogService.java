package com.migraine.service;

import com.migraine.dto.HeadacheLogDTO;
import com.migraine.entity.HeadacheLog;
import com.migraine.entity.User;
import com.migraine.repository.HeadacheLogRepository;
import com.migraine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 頭痛日誌服務
 */
@Service
@RequiredArgsConstructor
public class HeadacheLogService {

    private final HeadacheLogRepository headacheLogRepository;
    private final UserRepository userRepository;

    /**
     * 創建頭痛日誌
     */
    @Transactional
    public HeadacheLogDTO createLog(Long userId, HeadacheLogDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("找不到用戶"));

        HeadacheLog log = HeadacheLog.builder()
                .user(user)
                .logDate(dto.getLogDate())
                .intensity(dto.getIntensity())
                .symptoms(dto.getSymptoms())
                .medication(dto.getMedication())
                .notes(dto.getNotes())
                .durationHours(dto.getDurationHours())
                .location(dto.getLocation())
                .triggers(dto.getTriggers())
                .build();

        log = headacheLogRepository.save(log);
        return convertToDTO(log);
    }

    /**
     * 獲取用戶所有日誌
     */
    @Transactional(readOnly = true)
    public List<HeadacheLogDTO> getUserLogs(Long userId) {
        return headacheLogRepository.findByUserIdOrderByLogDateDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 獲取指定日期範圍的日誌
     */
    @Transactional(readOnly = true)
    public List<HeadacheLogDTO> getLogsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return headacheLogRepository.findByUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 更新日誌
     */
    @Transactional
    public HeadacheLogDTO updateLog(Long logId, HeadacheLogDTO dto) {
        HeadacheLog log = headacheLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("找不到日誌"));

        log.setLogDate(dto.getLogDate());
        log.setIntensity(dto.getIntensity());
        log.setSymptoms(dto.getSymptoms());
        log.setMedication(dto.getMedication());
        log.setNotes(dto.getNotes());
        log.setDurationHours(dto.getDurationHours());
        log.setLocation(dto.getLocation());
        log.setTriggers(dto.getTriggers());

        log = headacheLogRepository.save(log);
        return convertToDTO(log);
    }

    /**
     * 刪除日誌
     */
    @Transactional
    public void deleteLog(Long logId) {
        headacheLogRepository.deleteById(logId);
    }

    private HeadacheLogDTO convertToDTO(HeadacheLog log) {
        return HeadacheLogDTO.builder()
                .id(log.getId())
                .userId(log.getUser().getId())
                .logDate(log.getLogDate())
                .intensity(log.getIntensity())
                .symptoms(log.getSymptoms())
                .medication(log.getMedication())
                .notes(log.getNotes())
                .durationHours(log.getDurationHours())
                .location(log.getLocation())
                .triggers(log.getTriggers())
                .createdAt(log.getCreatedAt())
                .updatedAt(log.getUpdatedAt())
                .build();
    }
}
