package com.migraine.service;

import com.migraine.dto.*;
import com.migraine.entity.User;
import com.migraine.repository.UserRepository;
import com.migraine.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 認證服務
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    /**
     * 用戶登入
     */
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("找不到用戶"));

        UserDTO userDTO = convertToDTO(user);

        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    /**
     * 用戶註冊
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email 已被註冊");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(User.UserRole.valueOf(request.getRole().toUpperCase()))
                .phone(request.getPhone())
                .gender(request.getGender())
                .age(request.getAge())
                .patientId(request.getPatientId())
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // 自動登入
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token = tokenProvider.generateToken(authentication);
        UserDTO userDTO = convertToDTO(user);

        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .gender(user.getGender())
                .age(user.getAge())
                .patientId(user.getPatientId())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
