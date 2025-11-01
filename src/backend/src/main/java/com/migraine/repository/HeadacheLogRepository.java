package com.migraine.repository;

import com.migraine.entity.HeadacheLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 頭痛日誌資料存取層
 */
@Repository
public interface HeadacheLogRepository extends JpaRepository<HeadacheLog, Long> {

    List<HeadacheLog> findByUserIdOrderByLogDateDesc(Long userId);

    List<HeadacheLog> findByUserIdAndLogDateBetweenOrderByLogDateDesc(
        Long userId, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    @Query("SELECT h FROM HeadacheLog h WHERE h.user.id = :userId " +
           "AND h.logDate >= :startDate " +
           "ORDER BY h.logDate DESC")
    List<HeadacheLog> findRecentLogsByUserId(Long userId, LocalDateTime startDate);

    @Query("SELECT AVG(h.intensity) FROM HeadacheLog h WHERE h.user.id = :userId " +
           "AND h.logDate BETWEEN :startDate AND :endDate")
    Double getAverageIntensity(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(h) FROM HeadacheLog h WHERE h.user.id = :userId " +
           "AND h.logDate BETWEEN :startDate AND :endDate")
    Long countLogsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
