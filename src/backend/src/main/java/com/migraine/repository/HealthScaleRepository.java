package com.migraine.repository;

import com.migraine.entity.HealthScale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 健康量表資料存取層
 */
@Repository
public interface HealthScaleRepository extends JpaRepository<HealthScale, Long> {

    List<HealthScale> findByUserIdOrderByTestDateDesc(Long userId);

    List<HealthScale> findByUserIdAndScaleTypeOrderByTestDateDesc(
        Long userId, 
        HealthScale.ScaleType scaleType
    );

    @Query("SELECT h FROM HealthScale h WHERE h.user.id = :userId " +
           "AND h.scaleType = :scaleType " +
           "ORDER BY h.testDate DESC " +
           "LIMIT 1")
    Optional<HealthScale> findLatestByUserIdAndScaleType(Long userId, HealthScale.ScaleType scaleType);
}
