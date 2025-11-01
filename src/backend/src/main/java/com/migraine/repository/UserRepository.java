package com.migraine.repository;

import com.migraine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 用戶資料存取層
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(User.UserRole role);

    @Query("SELECT u FROM User u WHERE u.role = 'PATIENT' AND u.isActive = true")
    List<User> findAllActivePatients();

    @Query("SELECT u FROM User u WHERE u.role = 'PATIENT' AND u.patientId = :patientId")
    Optional<User> findByPatientId(String patientId);
}
