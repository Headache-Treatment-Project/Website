# 版本對齊與配置修正文檔

本文檔說明系統的版本對齊、配置修正和改進建議。

## ✅ 已修正的問題

### 1. 版本號統一

| 套件 | 文檔舊版本 | 實際版本 | 修正後 |
|------|----------|---------|--------|
| Vite | 5.1.4 | 6.x | **6.0.1** ✅ |
| Tailwind CSS | 4.0 (beta) | 3.x | **3.4.1** (穩定版) ✅ |
| @vitejs/plugin-react | 4.2.1 | - | **4.3.1** ✅ |
| Node.js | 18+ | 20 | **20** ✅ |
| Java | 17 | 17 | **17** ✅ |
| Spring Boot | 3.2.1 | 3.2.1 | **3.2.1** ✅ |

### 2. Vite 配置修正

#### vite.config.ts

```typescript
// ✅ 修正後
export default defineConfig({
  plugins: [react()],
  
  // GitHub Pages 部署設定
  base: '/Website/',  // 改為實際 repository 名稱
  
  build: {
    outDir: 'dist',  // 確保輸出到 dist 目錄
    // ...
  },
});
```

**重要**:
- `base` 必須與 GitHub repository 名稱一致
- `outDir` 必須是 `dist`
- SPA 路由支援：CI 會自動複製 `dist/index.html` 到 `dist/404.html`

### 3. GitHub Actions 修正

#### 主要變更

```yaml
# ✅ 移除 cache（如果沒有 package-lock.json）
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    # cache: 'npm'  # 移除或確保有 package-lock.json

# ✅ 添加 SPA 404 支援
- name: Create 404.html for SPA routing
  run: cp dist/index.html dist/404.html

# ✅ 允許 lint 警告不中斷構建
- name: Lint
  run: npm run lint
  continue-on-error: true
```

### 4. 錯誤文件清理

已刪除:
- `/backend/Dockerfile/Code-component-40-253.tsx` ❌
- `/backend/Dockerfile/Code-component-40-97.tsx` ❌

### 5. 依賴版本移除

**不要在 import 中指定版本**:

```typescript
// ❌ 錯誤
import { Button } from '@radix-ui/react-slot@1.1.2';

// ✅ 正確
import { Button } from '@radix-ui/react-slot';
```

版本由 `package.json` 管理。

## 🔐 安全性增強

### 1. JWT Configuration

```yaml
# application.yml
jwt:
  secret: ${JWT_SECRET}  # ✅ 從環境變數讀取
  expiration: 3600000    # ✅ 1 小時（從 24 小時縮短）
  refresh-expiration: 1209600000  # ✅ 14 天
```

**生產環境**:
```bash
# 生成密鑰
openssl rand -base64 64 > jwt_secret.txt

# 設定環境變數
export JWT_SECRET=$(cat jwt_secret.txt)
```

### 2. Refresh Token 機制

| 功能 | 狀態 |
|------|------|
| Refresh Token 實體 | ✅ 已實現 |
| Token 旋轉 | ✅ 已實現 |
| 自動刷新（前端） | ✅ 已實現 |
| 並發請求處理 | ✅ 已實現 |
| Token 撤銷 | ✅ 已實現 |

### 3. CORS 配置

```yaml
# ✅ 僅允許實際前端網域
cors:
  allowed-origins: 
    - http://localhost:3000
    - http://localhost:5173
    # 生產環境添加實際網域
```

## 🗄 資料庫管理

### 1. Flyway 遷移

**已添加**:
- `V1__init_schema.sql` - 初始化資料庫結構
- `V2__add_refresh_tokens.sql` - 添加 Refresh Token 支援

**配置**:
```yaml
# application.yml
spring:
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration
```

**使用方式**:
```bash
# Flyway 會自動在啟動時執行遷移
mvn spring-boot:run

# 查看遷移狀態
mvn flyway:info

# 手動遷移
mvn flyway:migrate
```

### 2. 索引優化

已添加複合索引:
```sql
-- 頭痛日誌查詢優化
CREATE INDEX idx_headache_logs_user_date 
  ON headache_logs(user_id, log_date DESC);

-- 健康量表查詢優化
CREATE INDEX idx_health_scales_user_type_date 
  ON health_scales(user_id, scale_type, test_date DESC);

-- Refresh Token 查詢優化
CREATE INDEX idx_refresh_tokens_token 
  ON refresh_tokens(token);
```

## 🎨 前端改進

### 1. API 服務增強

**新功能**:
- ✅ 自動 Token 刷新
- ✅ 並發請求隊列
- ✅ 錯誤重試機制
- ✅ Token 管理器

**使用範例**:
```typescript
// 自動處理 Token 刷新
const logs = await headacheLogApi.getMyLogs(userId);
// 如果 Token 過期，會自動：
// 1. 使用 Refresh Token 獲取新 Token
// 2. 重試原請求
// 3. 如果失敗，跳轉登入頁
```

### 2. localStorage 管理

```typescript
// TokenManager 統一管理
TokenManager.setTokens(accessToken, refreshToken);
TokenManager.getAccessToken();
TokenManager.clearTokens();
```

## 📋 待實現功能

### 高優先級

#### 1. 速率限制

**推薦**: Bucket4j + Resilience4j

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-ratelimiter</artifactId>
</dependency>
```

```yaml
# application.yml
resilience4j:
  ratelimiter:
    instances:
      auth-login:
        limitForPeriod: 10
        limitRefreshPeriod: 1m
```

#### 2. OpenAPI 文檔

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

訪問: `http://localhost:8080/swagger-ui.html`

#### 3. MapStruct DTO 映射

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
```

```java
@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);
    User toEntity(UserDTO dto);
}
```

### 中優先級

#### 4. API 版本化

```java
// Controller
@RestController
@RequestMapping("/api/v1/auth")  // ✅ 添加 /v1
public class AuthController {
    // ...
}
```

#### 5. 分頁支援

```java
// Repository
Page<HeadacheLog> findByUserId(Long userId, Pageable pageable);

// Controller
@GetMapping
public ResponseEntity<Page<HeadacheLogDTO>> getLogs(
    @RequestParam Long userId,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by("logDate").descending());
    // ...
}
```

#### 6. Idempotency

```java
@PostMapping("/headache-logs")
public ResponseEntity<HeadacheLogDTO> createLog(
    @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
    @RequestBody HeadacheLogDTO dto
) {
    // 檢查 idempotencyKey 是否已處理
    // 如果是，返回緩存的結果
    // 否則，處理請求並緩存結果
}
```

### 低優先級

#### 7. 審計日誌

```java
@Entity
public class AuditLog {
    private String action;
    private String username;
    private String ipAddress;
    private LocalDateTime timestamp;
    private String result;
}

// AOP 切面自動記錄
@Aspect
@Component
public class AuditAspect {
    @After("@annotation(Auditable)")
    public void audit(JoinPoint joinPoint) {
        // 記錄審計日誌
    }
}
```

#### 8. 前端狀態管理

**推薦**: TanStack Query (React Query)

```typescript
// 替代手寫 useEffect
const { data, isLoading, error } = useQuery({
  queryKey: ['headacheLogs', userId],
  queryFn: () => headacheLogApi.getMyLogs(userId),
  staleTime: 5 * 60 * 1000,  // 5 分鐘
});
```

## 🛠 開發工具配置

### 1. ESLint 規則調整

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",  // 允許 any（警告）
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }]
  }
}
```

### 2. Prettier 整合

```bash
# 格式化所有文件
npm run format

# 檢查格式
npm run format:check

# 自動修復 ESLint 問題
npm run lint:fix
```

### 3. Husky Git Hooks

```bash
# 安裝 Husky
npm run prepare

# 提交前自動運行 lint-staged
git commit -m "message"
# → 自動運行 ESLint + Prettier
```

## 📊 性能優化建議

### 1. 資料庫查詢優化

```java
// ❌ N+1 問題
List<HeadacheLog> logs = logRepository.findByUserId(userId);
logs.forEach(log -> log.getUser().getName());  // N 次查詢

// ✅ JOIN FETCH
@Query("SELECT h FROM HeadacheLog h JOIN FETCH h.user WHERE h.user.id = :userId")
List<HeadacheLog> findByUserIdWithUser(Long userId);
```

### 2. 前端 Code Splitting

```typescript
// 動態導入
const PatientDashboard = lazy(() => import('./components/PatientDashboard'));

// 使用 Suspense
<Suspense fallback={<Loading />}>
  <PatientDashboard />
</Suspense>
```

### 3. 虛擬列表

```typescript
// 大量資料渲染優化
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: logs.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

## 🧪 測試策略

### 1. 後端測試

```java
// Service 層測試
@SpringBootTest
class HeadacheLogServiceTest {
    @Mock
    private HeadacheLogRepository repository;
    
    @Test
    void shouldCreateLog() {
        // ...
    }
}

// Controller 層測試
@WebMvcTest(HeadacheLogController.class)
class HeadacheLogControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldReturnLogs() throws Exception {
        mockMvc.perform(get("/api/v1/headache-logs"))
            .andExpect(status().isOk());
    }
}
```

### 2. 前端測試

```typescript
// Vitest + React Testing Library
import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByText('登入')).toBeInTheDocument();
});
```

## 📦 部署檢查清單

### 生產環境

- [ ] `vite.config.ts` 的 `base` 已改為實際 repository 名稱
- [ ] JWT Secret 使用環境變數 `${JWT_SECRET}`
- [ ] 資料庫密碼使用環境變數
- [ ] CORS 僅允許生產網域
- [ ] 啟用 HTTPS
- [ ] Flyway 遷移已測試
- [ ] 移除或禁用 H2 Console
- [ ] 日誌等級設為 INFO 或 WARN
- [ ] 啟用 Spring Boot Actuator 監控
- [ ] 設定錯誤追蹤（Sentry）

### GitHub Actions

- [ ] Secrets 已設定（JWT_SECRET, DB credentials）
- [ ] 構建成功無錯誤
- [ ] 部署到 GitHub Pages 成功
- [ ] SPA 路由刷新正常（404.html 存在）

## 📚 文檔更新

已更新的文檔:
- ✅ `SECURITY_ENHANCEMENTS.md` - 安全性增強說明
- ✅ `VERSION_ALIGNMENT.md` - 本文檔
- ✅ `package.json` - 版本號統一
- ✅ `vite.config.ts` - 配置修正
- ✅ `.github/workflows/deploy.yml` - CI 修正

建議閱讀順序:
1. `README.md` - 專案總覽
2. `QUICKSTART.md` - 快速開始
3. `VERSION_ALIGNMENT.md` - 版本對齊（本文檔）
4. `SECURITY_ENHANCEMENTS.md` - 安全功能
5. `BACKEND_INTEGRATION.md` - 前後端整合

## 🔄 升級路線圖

### Phase 1: 立即修正（已完成）
- ✅ 版本號統一
- ✅ Vite 配置修正
- ✅ GitHub Actions 修正
- ✅ Refresh Token 實現
- ✅ Flyway 遷移

### Phase 2: 短期優化（1-2 週）
- ⏳ 速率限制
- ⏳ OpenAPI 文檔
- ⏳ MapStruct
- ⏳ API 版本化

### Phase 3: 中期功能（1-2 月）
- ⏳ 審計日誌
- ⏳ 前端狀態管理（React Query）
- ⏳ E2E 測試（Playwright）
- ⏳ 監控儀表板

### Phase 4: 長期規劃（3-6 月）
- ⏳ Redis 緩存
- ⏳ 訊息隊列（通知系統）
- ⏳ 多租戶支援
- ⏳ 機器學習整合

---

**最後更新**: 2025-11-03  
**修正版本**: 2.1.0  
**狀態**: ✅ 已完成基礎優化
