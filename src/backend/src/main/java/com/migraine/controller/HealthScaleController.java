package com.migraine.controller;

import com.migraine.dto.HealthScaleDTO;
import com.migraine.service.HealthScaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 健康量表控制器
 */
@RestController
@RequestMapping("/health-scales")
@RequiredArgsConstructor
public class HealthScaleController {

    private final HealthScaleService healthScaleService;

    /**
     * 創建量表記錄
     */
    @PostMapping
    public ResponseEntity<HealthScaleDTO> createScale(@RequestBody HealthScaleDTO dto) {
        return ResponseEntity.ok(healthScaleService.createScale(dto.getUserId(), dto));
    }

    /**
     * 獲取用戶所有量表記錄
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HealthScaleDTO>> getUserScales(@PathVariable Long userId) {
        return ResponseEntity.ok(healthScaleService.getUserScales(userId));
    }

    /**
     * 獲取特定類型的量表記錄
     */
    @GetMapping("/user/{userId}/type/{scaleType}")
    public ResponseEntity<List<HealthScaleDTO>> getUserScalesByType(
            @PathVariable Long userId,
            @PathVariable String scaleType
    ) {
        return ResponseEntity.ok(healthScaleService.getUserScalesByType(userId, scaleType));
    }
}
