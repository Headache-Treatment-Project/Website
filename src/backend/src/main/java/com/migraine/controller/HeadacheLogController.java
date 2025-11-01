package com.migraine.controller;

import com.migraine.dto.HeadacheLogDTO;
import com.migraine.service.HeadacheLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 頭痛日誌控制器
 */
@RestController
@RequestMapping("/headache-logs")
@RequiredArgsConstructor
public class HeadacheLogController {

    private final HeadacheLogService headacheLogService;

    /**
     * 創建頭痛日誌
     */
    @PostMapping
    public ResponseEntity<HeadacheLogDTO> createLog(
            Authentication authentication,
            @RequestBody HeadacheLogDTO dto
    ) {
        // 從認證信息中獲取當前用戶（實際應用中需要從 User 實體獲取 ID）
        Long userId = dto.getUserId();
        return ResponseEntity.ok(headacheLogService.createLog(userId, dto));
    }

    /**
     * 獲取當前用戶的所有日誌
     */
    @GetMapping("/my-logs")
    public ResponseEntity<List<HeadacheLogDTO>> getMyLogs(@RequestParam Long userId) {
        return ResponseEntity.ok(headacheLogService.getUserLogs(userId));
    }

    /**
     * 獲取指定日期範圍的日誌
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<HeadacheLogDTO>> getLogsByDateRange(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(headacheLogService.getLogsByDateRange(userId, startDate, endDate));
    }

    /**
     * 更新日誌
     */
    @PutMapping("/{id}")
    public ResponseEntity<HeadacheLogDTO> updateLog(
            @PathVariable Long id,
            @RequestBody HeadacheLogDTO dto
    ) {
        return ResponseEntity.ok(headacheLogService.updateLog(id, dto));
    }

    /**
     * 刪除日誌
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        headacheLogService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }
}
