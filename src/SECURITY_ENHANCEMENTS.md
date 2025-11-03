# 安全性增強文檔

本文檔說明系統已實現的安全性增強功能。

## ✅ 已實現的安全功能

### 1. JWT Refresh Token 機制

#### 架構設計

```
登入 → 返回 Access Token (AT) + Refresh Token (RT)
  AT: 1 小時有效期（短期）
  RT: 14 天有效期（長期）

AT 過期 → 使用 RT 刷新 → 獲得新的 AT + RT（Token 旋轉）
RT 使用一次後立即失效 → 防止重放攻擊
```

#### Token 生命週期

| Token 類型 | 有效期 | 用途 |
|-----------|--------|------|
| Access Token | 1 小時 | API 訪問授權 |
| Refresh Token | 14 天 | 刷新 Access Token |

#### 為什麼使用 Refresh Token？

✅ **降低風險**
- Access Token 暴露風險窗口縮短（1小時 vs 24小時）
- 即使 AT 被竊取，攻擊者只能使用 1 小時

✅ **提升用戶體驗**
- 用戶無需頻繁登入（14天內自動刷新）
- 後台自動處理 Token 刷新

✅ **Token 旋轉（Rotation）**
- 每次刷新後舊 RT 立即失效
- 防止 RT 被盜用進行重放攻擊

### 2. 資料庫實體

#### RefreshToken 表結構

```sql
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP
);
```

#### 功能

- **Token 儲存**: 所有 RT 存在資料庫中
- **撤銷機制**: 登出時撤銷所有 Token
- **過期清理**: 定時清理過期 Token
- **多裝置支援**: 每個裝置獨立 Token

### 3. API 端點

#### 登入

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": { ... }
}
```

#### 刷新 Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",  // 新的 AT
  "refreshToken": "660f9500-f39c-52e5-b827-557766551111",  // 新的 RT（舊的已失效）
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": { ... }
}
```

#### 登出

```http
POST /api/auth/logout
Authorization: Bearer {accessToken}

Response:
200 OK
```

### 4. 前端實現

#### 自動 Token 刷新

前端 API 服務已實現自動刷新機制：

```typescript
// 當 API 返回 401 時
1. 檢查是否有 Refresh Token
2. 如果有，調用 /api/auth/refresh
3. 獲取新的 AT 和 RT
4. 使用新 AT 重試原請求
5. 如果刷新失敗，跳轉到登入頁
```

#### 並發請求處理

```typescript
// 防止多個請求同時刷新 Token
isRefreshing = true  // 刷新鎖
failedQueue = []     // 失敗請求隊列

第一個 401 請求 → 刷新 Token
其他 401 請求 → 加入隊列等待
刷新成功 → 所有隊列請求使用新 Token 重試
```

### 5. 安全配置

#### JWT Secret 管理

```yaml
# application.yml
jwt:
  secret: ${JWT_SECRET}  # 從環境變數讀取
  expiration: 3600000    # 1 小時
  refresh-expiration: 1209600000  # 14 天
```

**生產環境設定**:
```bash
# 生成強密鑰（256-bit）
openssl rand -base64 64

# 設定環境變數
export JWT_SECRET="your-generated-secret-key"
```

#### BCrypt 密碼加密

```java
// SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);  // Cost factor: 12
}
```

**密碼強度要求**:
- 最少 6 個字元（建議 8+）
- 包含大小寫字母、數字、特殊字元（建議）

### 6. CORS 配置

```yaml
cors:
  allowed-origins: 
    - http://localhost:3000
    - http://localhost:5173
    - https://your-production-domain.com  # 生產環境網域
  allowed-methods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
  allowed-headers: "*"
  allow-credentials: true
  max-age: 3600
```

**生產環境注意事項**:
- ✅ 僅允許實際前端網域
- ❌ 不要使用 `*` 通配符
- ✅ 啟用 `allow-credentials`

## 🚀 使用指南

### 前端登入流程

```typescript
import { authApi } from './services/api';

// 登入
const login = async (email: string, password: string) => {
  try {
    const response = await authApi.login(email, password);
    // Tokens 已自動保存到 localStorage
    console.log('登入成功', response.user);
  } catch (error) {
    console.error('登入失敗', error);
  }
};

// API 調用（自動處理 Token 刷新）
const fetchData = async () => {
  try {
    const logs = await headacheLogApi.getMyLogs(userId);
    // 如果 Token 過期，會自動刷新並重試
  } catch (error) {
    // 處理錯誤
  }
};

// 登出
const logout = async () => {
  await authApi.logout();
  // Tokens 已清除，跳轉到登入頁
  window.location.href = '/';
};
```

### 後端 Service 實現

```java
// 創建 Refresh Token
RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

// 刷新 Token（旋轉機制）
RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(oldToken);

// 撤銷所有 Token（登出所有裝置）
refreshTokenService.revokeAllUserTokens(user.getEmail());
```

## 🔒 額外安全措施

### 1. 速率限制（建議實現）

**推薦工具**: Bucket4j

```java
// 限制登入端點
@RateLimit(name = "auth-login", fallbackMethod = "rateLimitFallback")
@PostMapping("/login")
public ResponseEntity<TokenResponse> login(@RequestBody AuthRequest request) {
    // ...
}
```

**配置範例**:
```yaml
resilience4j:
  ratelimiter:
    instances:
      auth-login:
        limitForPeriod: 10      # 10 次請求
        limitRefreshPeriod: 1m  # 每分鐘
        timeoutDuration: 0s
```

### 2. HTTP Security Headers

```java
// SecurityConfig.java
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
        .policyDirectives("default-src 'self'; script-src 'self'"))
    .frameOptions(frame -> frame.deny())
    .xssProtection(xss -> xss.block(true))
    .contentTypeOptions(options -> options.disable(false))
);
```

### 3. 審計日誌

**建議記錄**:
- ✅ 登入成功/失敗
- ✅ Token 刷新
- ✅ 權限拒絕
- ✅ 敏感操作（刪除、修改）

```java
// 創建 AuditLog 實體
@Entity
public class AuditLog {
    private String action;      // LOGIN, LOGOUT, REFRESH_TOKEN
    private String username;
    private String ipAddress;
    private LocalDateTime timestamp;
    private String result;      // SUCCESS, FAILURE
}
```

### 4. IP 白名單（可選）

對於後台管理系統，可以限制 IP:

```yaml
security:
  admin-ips:
    - 192.168.1.100
    - 10.0.0.50
```

## 📊 監控與告警

### 1. 監控指標

**關鍵指標**:
- Token 刷新頻率
- 登入失敗次數
- 401/403 錯誤率
- Token 撤銷次數

### 2. 異常告警

**告警條件**:
- 短時間內大量登入失敗（可能是暴力破解）
- 異常的 Token 刷新頻率（可能是攻擊）
- 同一用戶多裝置同時活躍異常（可能是帳號被盜）

## 🧪 測試指南

### 1. Token 刷新測試

```bash
# 1. 登入獲取 Token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. 使用 Refresh Token 刷新
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# 3. 驗證舊 Refresh Token 已失效
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"OLD_REFRESH_TOKEN"}'
# 應該返回 401 或 403
```

### 2. 過期測試

```bash
# 等待 Access Token 過期（1小時）或手動修改過期時間測試
# 前端應該自動刷新並重試請求
```

## 📋 生產環境檢查清單

- [ ] JWT Secret 使用強隨機密鑰（256-bit+）
- [ ] JWT Secret 存在環境變數，不入庫
- [ ] Access Token 過期時間 ≤ 1 小時
- [ ] Refresh Token 過期時間 7-14 天
- [ ] 啟用 Token 旋轉機制
- [ ] CORS 僅允許實際前端網域
- [ ] 啟用 HTTPS（生產環境必須）
- [ ] 資料庫密碼加密且定期更換
- [ ] 啟用速率限制
- [ ] 設定 Security Headers
- [ ] 實現審計日誌
- [ ] 設定監控告警

## 🔄 版本歷史

| 版本 | 日期 | 變更 |
|------|------|------|
| 2.0.0 | 2025-11-03 | 實現 Refresh Token 機制 |
| 2.0.0 | 2025-11-03 | 縮短 AT 過期時間至 1 小時 |
| 2.0.0 | 2025-11-03 | 添加 Token 旋轉機制 |
| 2.0.0 | 2025-11-03 | 前端自動 Token 刷新 |

---

**最後更新**: 2025-11-03  
**安全等級**: ⭐⭐⭐⭐ (4/5)
