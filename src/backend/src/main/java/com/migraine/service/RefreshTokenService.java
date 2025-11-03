package com.migraine.service;

import com.migraine.entity.RefreshToken;
import com.migraine.entity.User;
import com.migraine.repository.RefreshTokenRepository;
import com.migraine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Refresh Token 服務
 * 實現 Token 旋轉機制（Token Rotation）
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration:1209600000}") // 預設 14 天
    private long refreshTokenExpiration;

    /**
     * 創建 Refresh Token
     */
    @Transactional
    public RefreshToken createRefreshToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("找不到用戶"));

        // 生成唯一的 Token
        String token = UUID.randomUUID().toString();
        
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * 驗證 Refresh Token
     */
    @Transactional(readOnly = true)
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("無效的 Refresh Token"));

        if (!refreshToken.isValid()) {
            throw new RuntimeException("Refresh Token 已過期或已被撤銷");
        }

        return refreshToken;
    }

    /**
     * 旋轉 Token（使用後立即失效舊 Token，並發新 Token）
     */
    @Transactional
    public RefreshToken rotateRefreshToken(String oldToken) {
        RefreshToken oldRefreshToken = verifyRefreshToken(oldToken);
        
        // 撤銷舊 Token
        oldRefreshToken.setRevoked(true);
        oldRefreshToken.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(oldRefreshToken);

        // 創建新 Token
        return createRefreshToken(oldRefreshToken.getUser().getEmail());
    }

    /**
     * 撤銷用戶的所有 Refresh Token（用於登出所有裝置）
     */
    @Transactional
    public void revokeAllUserTokens(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("找不到用戶"));
        
        refreshTokenRepository.revokeAllByUser(user, LocalDateTime.now());
    }

    /**
     * 清理過期的 Token（定時任務）
     */
    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
