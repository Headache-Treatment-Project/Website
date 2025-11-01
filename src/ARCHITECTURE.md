# 系統架構文檔

本文檔詳細說明偏頭痛個案照護系統的技術架構。

## 🏗 系統架構總覽

```
┌─────────────────────────────────────────────────────────────────────┐
│                          用戶層 (User Layer)                         │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐               │
│  │   病患端    │  │   醫師端    │  │  個管師端    │               │
│  │  (Patient)  │  │  (Doctor)   │  │ (Case Mgr)   │               │
│  └─────────────┘  └─────────────┘  └──────────────┘               │
│         │                │                   │                      │
│         └────────────────┴───────────────────┘                      │
│                          │                                          │
│                    瀏覽器 (Browser)                                  │
└──────────────────────────┼──────────────────────────────────────────┘
                           │ HTTPS / REST API / JSON
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                    前端層 (Frontend Layer)                           │
│                          │                                          │
│  ┌───────────────────────▼────────────────────────────────┐        │
│  │        React 18 + TypeScript + Tailwind CSS             │        │
│  ├─────────────────────────────────────────────────────────┤        │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │        │
│  │  │   登入頁    │  │  儀表板頁   │  │  量表頁面    │   │        │
│  │  │ LoginPage   │  │ Dashboards  │  │   Scales     │   │        │
│  │  └─────────────┘  └─────────────┘  └──────────────┘   │        │
│  │                                                         │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │         API 服務層 (services/api.ts)             │ │        │
│  │  │  - authApi (認證)                                 │ │        │
│  │  │  - headacheLogApi (頭痛日誌)                      │ │        │
│  │  │  - healthScaleApi (健康量表)                      │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  │                                                         │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │         UI 組件庫 (shadcn/ui)                     │ │        │
│  │  │  Button, Card, Dialog, Table, Chart...           │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  └─────────────────────────────────────────────────────────┘        │
│                          │                                          │
│                    Port: 3000/5173                                  │
└──────────────────────────┼──────────────────────────────────────────┘
                           │ HTTP / REST / JSON + JWT
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                    後端層 (Backend Layer)                            │
│                          │                                          │
│  ┌───────────────────────▼────────────────────────────────┐        │
│  │         Java 17 + Spring Boot 3.2 + Maven              │        │
│  ├─────────────────────────────────────────────────────────┤        │
│  │                                                         │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │      安全層 (Spring Security + JWT)              │ │        │
│  │  │  - JwtAuthenticationFilter                       │ │        │
│  │  │  - JwtTokenProvider                              │ │        │
│  │  │  - CustomUserDetailsService                      │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  │                          ↓                             │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │        控制器層 (Controller Layer)               │ │        │
│  │  │  ┌──────────────┐  ┌─────────────────┐          │ │        │
│  │  │  │AuthController│  │HeadacheLogCtrl  │          │ │        │
│  │  │  └──────────────┘  └─────────────────┘          │ │        │
│  │  │  ┌─────────────────────────────────────┐        │ │        │
│  │  │  │   HealthScaleController             │        │ │        │
│  │  │  └─────────────────────────────────────┘        │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  │                          ↓                             │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │         服務層 (Service Layer)                   │ │        │
│  │  │  ┌──────────────┐  ┌─────────────────┐          │ │        │
│  │  │  │ AuthService  │  │HeadacheLogSvc   │          │ │        │
│  │  │  └──────────────┘  └─────────────────┘          │ │        │
│  │  │  ┌─────────────────────────────────────┐        │ │        │
│  │  │  │    HealthScaleService               │        │ │        │
│  │  │  └─────────────────────────────────────┘        │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  │                          ↓                             │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │      資料存取層 (Repository Layer - JPA)         │ │        │
│  │  │  ┌──────────────┐  ┌─────────────────┐          │ │        │
│  │  │  │UserRepository│  │HeadacheLogRepo  │          │ │        │
│  │  │  └──────────────┘  └─────────────────┘          │ │        │
│  │  │  ┌─────────────────────────────────────┐        │ │        │
│  │  │  │    HealthScaleRepository            │        │ │        │
│  │  │  └─────────────────────────────────────┘        │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  │                          ↓                             │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │           實體層 (Entity Layer)                  │ │        │
│  │  │  ┌──────┐  ┌─────────────┐  ┌──────────────┐   │ │        │
│  │  │  │ User │  │HeadacheLog  │  │ HealthScale  │   │ │        │
│  │  │  └──────┘  └─────────────┘  └──────────────┘   │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  │                                                         │        │
│  │                    Port: 8080 (API)                    │        │
│  └─────────────────────────────────────────────────────────┘        │
│                          │                                          │
└──────────────────────────┼──────────────────────────────────────────┘
                           │ JDBC
                           │
┌──────────────────────────┼──────────────────────────────────────────┐
│                   資料層 (Data Layer)                                │
│                          │                                          │
│  ┌───────────────────────▼────────────────────────────────┐        │
│  │           PostgreSQL / MySQL / H2 Database              │        │
│  ├─────────────────────────────────────────────────────────┤        │
│  │                                                         │        │
│  │  ┌──────────────────────────────────────────────────┐ │        │
│  │  │              資料表 (Tables)                     │ │        │
│  │  │                                                  │ │        │
│  │  │  ┌─────────────────────────────────────────┐   │ │        │
│  │  │  │         users (用戶表)                  │   │ │        │
│  │  │  │  - id, email, password, name, role...   │   │ │        │
│  │  │  └─────────────────────────────────────────┘   │ │        │
│  │  │           │                                     │ │        │
│  │  │           ├──► ┌──────────────────────────┐   │ │        │
│  │  │           │    │  headache_logs (日誌表)  │   │ │        │
│  │  │           │    │  - user_id (FK)           │   │ │        │
│  │  │           │    │  - log_date, intensity... │   │ │        │
│  │  │           │    └──────────────────────────┘   │ │        │
│  │  │           │                                     │ │        │
│  │  │           └──► ┌──────────────────────────┐   │ │        │
│  │  │                │  health_scales (量表表)   │   │ │        │
│  │  │                │  - user_id (FK)           │   │ │        │
│  │  │                │  - scale_type, score...   │   │ │        │
│  │  │                └──────────────────────────┘   │ │        │
│  │  └──────────────────────────────────────────────────┘ │        │
│  │                                                         │        │
│  │                    Port: 5432 (PostgreSQL)              │        │
│  └─────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 資料流圖

### 用戶登入流程

```
┌─────────┐     ① 輸入帳密     ┌──────────┐
│ 用戶    │ ─────────────────► │ 前端頁面 │
└─────────┘                    └────┬─────┘
                                    │
                      ② POST /api/auth/login
                      { email, password }
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │   AuthController          │
                    │   (後端控制器)            │
                    └───────────┬───────────────┘
                                │
                      ③ 驗證用戶帳密
                                │
                                ▼
                    ┌───────────────────────────┐
                    │   AuthService             │
                    │   (認證服務)              │
                    └───────────┬───────────────┘
                                │
                      ④ 查詢用戶資料
                                │
                                ▼
                    ┌───────────────────────────┐
                    │   UserRepository          │
                    │   (資料存取)              │
                    └───────────┬───────────────┘
                                │
                                ▼
                    ┌───────────────────────────┐
                    │   Database                │
                    │   users 表                │
                    └───────────┬───────────────┘
                                │
                      ⑤ 返回用戶資料
                                │
                                ▼
                    ┌───────────────────────────┐
                    │   JwtTokenProvider        │
                    │   生成 JWT Token          │
                    └───────────┬───────────────┘
                                │
                      ⑥ 返回 Token + 用戶資料
                                │
                                ▼
┌─────────┐     ⑦ 存儲 Token    ┌──────────┐
│ 前端    │ ◄───────────────── │ 後端      │
│存 Token │     跳轉到儀表板    │返回響應   │
└─────────┘                    └──────────┘
```

### 創建頭痛日誌流程

```
┌─────────┐   ① 填寫日誌表單   ┌──────────┐
│ 用戶    │ ─────────────────► │ 前端頁面 │
└─────────┘                    └────┬─────┘
                                    │
                 ② POST /api/headache-logs
                 Authorization: Bearer {token}
                 { userId, logDate, intensity... }
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │ JwtAuthenticationFilter   │
                    │ (驗證 Token)              │
                    └───────────┬───────────────┘
                                │
                      ③ Token 有效 → 繼續
                                │
                                ▼
                    ┌───────────────────────────┐
                    │ HeadacheLogController     │
                    │ (控制器)                  │
                    └───────────┬───────────────┘
                                │
                      ④ 調用服務層
                                │
                                ▼
                    ┌───────────────────────────┐
                    │ HeadacheLogService        │
                    │ (業務邏輯)                │
                    └───────────┬───────────────┘
                                │
                      ⑤ 保存日誌
                                │
                                ▼
                    ┌───────────────────────────┐
                    │ HeadacheLogRepository     │
                    │ (JPA 資料存取)            │
                    └───────────┬───────────────┘
                                │
                                ▼
                    ┌───────────────────────────┐
                    │ Database                  │
                    │ INSERT INTO headache_logs │
                    └───────────┬───────────────┘
                                │
                      ⑥ 返回保存的日誌資料
                                │
                                ▼
┌─────────┐   ⑦ 顯示成功訊息   ┌──────────┐
│ 前端    │ ◄───────────────── │ 後端      │
│更新列表 │     返回日誌 DTO    │          │
└─────────┘                    └──────────┘
```

## 🔐 安全機制

### JWT 認證流程

```
┌──────────────────────────────────────────────────────────────┐
│                    JWT Token 結構                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Header (演算法)                                              │
│  {                                                            │
│    "alg": "HS256",                                            │
│    "typ": "JWT"                                               │
│  }                                                            │
│                                                               │
│  Payload (資料)                                               │
│  {                                                            │
│    "sub": "user@example.com",  ← 用戶 Email                  │
│    "iat": 1730448000,          ← 簽發時間                    │
│    "exp": 1730534400           ← 過期時間                    │
│  }                                                            │
│                                                               │
│  Signature (簽名)                                             │
│  HMACSHA256(                                                  │
│    base64UrlEncode(header) + "." +                            │
│    base64UrlEncode(payload),                                  │
│    secret-key                  ← JWT Secret                  │
│  )                                                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘

完整 Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tI...
```

### 權限控制

```
┌─────────────────────────────────────────────────────────────┐
│              角色權限對照表                                  │
├──────────────┬──────────────────────────────────────────────┤
│    角色      │            可訪問的 API                       │
├──────────────┼──────────────────────────────────────────────┤
│   PATIENT    │  ✅ /api/headache-logs/*  (自己的)           │
│   (病患)     │  ✅ /api/health-scales/*  (自己的)           │
│              │  ❌ /api/patients/*                          │
│              │  ❌ /api/statistics/*                        │
├──────────────┼──────────────────────────────────────────────┤
│   DOCTOR     │  ✅ /api/headache-logs/*  (所有病患)         │
│   (醫師)     │  ✅ /api/health-scales/*  (所有病患)         │
│              │  ✅ /api/patients/*                          │
│              │  ✅ /api/statistics/*                        │
├──────────────┼──────────────────────────────────────────────┤
│ CASE_MANAGER │  ✅ /api/headache-logs/*  (所有病患)         │
│  (個管師)    │  ✅ /api/health-scales/*  (所有病患)         │
│              │  ✅ /api/patients/*                          │
│              │  ✅ /api/statistics/*                        │
└──────────────┴──────────────────────────────────────────────┘
```

## 🗄 資料庫結構

### ER 關係圖

```
┌───────────────────────────────────────────────┐
│                    users                      │
├───────────────────────────────────────────────┤
│ PK │ id            BIGINT                     │
│    │ email         VARCHAR(100) UNIQUE        │
│    │ password      VARCHAR(255)               │
│    │ name          VARCHAR(50)                │
│    │ role          ENUM('PATIENT','DOCTOR'...) │
│    │ phone         VARCHAR(20)                │
│    │ gender        VARCHAR(10)                │
│    │ age           INTEGER                    │
│    │ patient_id    VARCHAR(50)                │
│    │ is_active     BOOLEAN                    │
│    │ created_at    TIMESTAMP                  │
│    │ updated_at    TIMESTAMP                  │
└──────────┬────────────────────────────────────┘
           │
           │ 1
           │
           │
  ┌────────┴────────┐
  │                 │
  │ N               │ N
  │                 │
  ▼                 ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│    headache_logs        │    │     health_scales        │
├─────────────────────────┤    ├──────────────────────────┤
│ PK │ id        BIGINT   │    │ PK │ id        BIGINT    │
│ FK │ user_id   BIGINT   │    │ FK │ user_id   BIGINT    │
│    │ log_date  TIMESTAMP│    │    │ scale_type VARCHAR  │
│    │ intensity INTEGER  │    │    │ test_date TIMESTAMP │
│    │ symptoms  VARCHAR  │    │    │ score     INTEGER   │
│    │ medication VARCHAR │    │    │ level     VARCHAR   │
│    │ notes     VARCHAR  │    │    │ answers   TEXT      │
│    │ created_at TIMESTAMP    │    │ interpretation TEXT │
└─────────────────────────┘    │    │ created_at TIMESTAMP│
                               └──────────────────────────┘
```

### 索引策略

```sql
-- 主要查詢索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_headache_logs_user_id ON headache_logs(user_id);
CREATE INDEX idx_headache_logs_log_date ON headache_logs(log_date);
CREATE INDEX idx_health_scales_user_id ON health_scales(user_id);
CREATE INDEX idx_health_scales_scale_type ON health_scales(scale_type);

-- 複合索引（針對常見查詢）
CREATE INDEX idx_headache_logs_user_date 
  ON headache_logs(user_id, log_date DESC);

CREATE INDEX idx_health_scales_user_type 
  ON health_scales(user_id, scale_type, test_date DESC);
```

## 🚀 部署架構

### 生產環境部署

```
                    Internet
                        │
                        ▼
            ┌───────────────────────┐
            │    Nginx (反向代理)   │
            │   - SSL 終止          │
            │   - 負載平衡          │
            │   - 靜態文件服務      │
            └──────────┬────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐          ┌──────────────────┐
│  React 前端   │          │ Spring Boot 後端 │
│  (Static)     │          │  (多個實例)      │
│  Port: 80     │          │  Port: 8080      │
└───────────────┘          └────────┬─────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │  PostgreSQL Master    │
                        │  (主資料庫)           │
                        └───────────┬───────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        ▼                       ▼
            ┌───────────────────┐   ┌───────────────────┐
            │ PostgreSQL Slave  │   │ PostgreSQL Slave  │
            │ (讀取副本)        │   │ (讀取副本)        │
            └───────────────────┘   └───────────────────┘
```

### Docker 部署架構

```
Docker Host
├── migraine-network (Bridge Network)
│   │
│   ├── migraine-postgres (Container)
│   │   ├── Image: postgres:15-alpine
│   │   ├── Port: 5432
│   │   └── Volume: postgres_data
│   │
│   └── migraine-backend (Container)
│       ├── Image: migraine-backend:latest
│       ├── Port: 8080
│       └── Depends on: postgres
│
└── Volumes
    └── postgres_data (持久化資料)
```

## 📊 性能考量

### 資料庫連接池

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10        # 最大連接數
      minimum-idle: 5              # 最小空閒連接
      connection-timeout: 30000    # 連接超時 (ms)
      idle-timeout: 600000         # 空閒超時 (ms)
      max-lifetime: 1800000        # 最大生命週期 (ms)
```

### JPA 查詢優化

```java
// ✅ 好的實踐：使用懶加載
@ManyToOne(fetch = FetchType.LAZY)
private User user;

// ✅ 好的實踐：分頁查詢
Page<HeadacheLog> findByUserId(Long userId, Pageable pageable);

// ✅ 好的實踐：投影查詢（只查需要的欄位）
@Query("SELECT new HeadacheLogDTO(h.id, h.intensity) FROM HeadacheLog h")
List<HeadacheLogDTO> findSimplifiedLogs();
```

### 前端性能優化

```javascript
// Code Splitting
const PatientDashboard = lazy(() => import('./components/PatientDashboard'));

// 防抖處理
const debouncedSearch = debounce(searchFunction, 300);

// 虛擬列表（大量資料）
<VirtualList items={logs} height={500} itemHeight={50} />
```

## 🔄 CI/CD 流程

```
開發者 Push 代碼
        │
        ▼
    GitHub
        │
        ├──► 前端 Workflow
        │    ├── npm install
        │    ├── npm run lint
        │    ├── npm run test
        │    ├── npm run build
        │    └── Deploy to GitHub Pages
        │
        └──► 後端 Workflow
             ├── mvn clean install
             ├── mvn test
             ├── mvn package
             └── Build Docker Image
                  └── Push to Registry
```

## 📚 技術棧總結

| 層級 | 技術 | 版本 | 用途 |
|------|------|------|------|
| 前端框架 | React | 18.3 | UI 框架 |
| 前端語言 | TypeScript | 5.3 | 類型安全 |
| 前端構建 | Vite | 5.1 | 建構工具 |
| 前端樣式 | Tailwind CSS | 4.0 | CSS 框架 |
| 前端圖表 | Recharts | 2.10 | 資料視覺化 |
| 後端語言 | Java | 17 | 程式語言 |
| 後端框架 | Spring Boot | 3.2 | 應用框架 |
| 安全框架 | Spring Security | 6.2 | 認證授權 |
| ORM | JPA/Hibernate | 6.3 | 物件關聯映射 |
| 資料庫 | PostgreSQL | 15 | 關聯式資料庫 |
| 容器化 | Docker | 24+ | 容器技術 |
| 建構工具 | Maven | 3.9 | 依賴管理 |
| JWT | JJWT | 0.12 | Token 處理 |

---

**最後更新**: 2025-11-01  
**文檔版本**: 1.0
