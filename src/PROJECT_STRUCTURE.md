# 專案架構文檔

## 📁 完整專案結構

```
migraine-care-system/
│
├── frontend/                           # React 前端（現有代碼）
│   ├── App.tsx                        # 主應用組件
│   ├── main.tsx                       # 應用入口
│   ├── index.html                     # HTML 模板
│   ├── vite.config.ts                 # Vite 配置
│   ├── package.json                   # NPM 依賴
│   ├── tsconfig.json                  # TypeScript 配置
│   │
│   ├── components/                    # React 組件
│   │   ├── LoginPage.tsx              # 登入頁面
│   │   ├── PatientDashboard.tsx       # 病患儀表板
│   │   ├── DoctorDashboard.tsx        # 醫師儀表板
│   │   ├── CaseManagerDashboard.tsx   # 個管師儀表板
│   │   ├── AboutPage.tsx              # 關於頁面
│   │   ├── ScaleQuestionnaires.tsx    # 量表問卷
│   │   └── ui/                        # shadcn/ui 組件
│   │
│   ├── services/                      # API 服務層
│   │   └── api.ts                     # 後端 API 調用
│   │
│   ├── styles/                        # 樣式
│   │   └── globals.css                # 全域 CSS
│   │
│   └── .github/workflows/             # GitHub Actions
│       └── deploy.yml                 # 自動部署配置
│
├── backend/                           # Java Spring Boot 後端（新建）
│   ├── pom.xml                        # Maven 配置
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/migraine/
│   │   │   │   ├── MigraineCareApplication.java     # 主程式
│   │   │   │   │
│   │   │   │   ├── config/                          # 配置類
│   │   │   │   │   ├── SecurityConfig.java          # Spring Security
│   │   │   │   │   └── CorsConfig.java              # CORS 配置
│   │   │   │   │
│   │   │   │   ├── controller/                      # 控制器層 (REST API)
│   │   │   │   │   ├── AuthController.java          # 認證 API
│   │   │   │   │   ├── HeadacheLogController.java   # 頭痛日誌 API
│   │   │   │   │   └── HealthScaleController.java   # 健康量表 API
│   │   │   │   │
│   │   │   │   ├── service/                         # 服務層 (業務邏輯)
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── HeadacheLogService.java
│   │   │   │   │   └── HealthScaleService.java
│   │   │   │   │
│   │   │   │   ├── repository/                      # 資料存取層 (JPA)
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── HeadacheLogRepository.java
│   │   │   │   │   └── HealthScaleRepository.java
│   │   │   │   │
│   │   │   │   ├── entity/                          # 實體類 (資料模型)
│   │   │   │   │   ├── User.java                    # 用戶
│   │   │   │   │   ├── HeadacheLog.java             # 頭痛日誌
│   │   │   │   │   └── HealthScale.java             # 健康量表
│   │   │   │   │
│   │   │   │   ├── dto/                             # 資料傳輸對象
│   │   │   │   │   ├── AuthRequest.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── UserDTO.java
│   │   │   │   │   ├── HeadacheLogDTO.java
│   │   │   │   │   └── HealthScaleDTO.java
│   │   │   │   │
│   │   │   │   └── security/                        # 安全相關
│   │   │   │       ├── JwtTokenProvider.java        # JWT Token 處理
│   │   │   │       ├── JwtAuthenticationFilter.java # JWT 過濾器
│   │   │   │       ├── JwtAuthenticationEntryPoint.java
│   │   │   │       └── CustomUserDetailsService.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.yml                  # 應用配置
│   │   │
│   │   └── test/                                    # 測試代碼
│   │
│   └── README.md                                    # 後端說明文檔
│
├── README.md                                        # 專案總覽
├── DEPLOYMENT.md                                    # 部署指南
├── BACKEND_INTEGRATION.md                           # 前後端整合指南
├── PROJECT_STRUCTURE.md                             # 本文檔
│
└── .env.example                                     # 環境變數範例
```

## 🎯 架構設計

### 三層架構

```
┌─────────────────────────────────────────────────────┐
│                    前端層 (Frontend)                 │
│  React + TypeScript + Tailwind CSS + shadcn/ui     │
│  - 用戶界面                                         │
│  - 表單驗證                                         │
│  - 狀態管理                                         │
│  - API 調用                                         │
└────────────────┬────────────────────────────────────┘
                 │ HTTP/REST + JSON
                 │ JWT Token
                 ▼
┌─────────────────────────────────────────────────────┐
│                   後端層 (Backend)                   │
│       Java Spring Boot + Spring Security            │
│  ┌─────────────────────────────────────────────┐   │
│  │  Controller (REST API 端點)                 │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                                │
│  ┌─────────────────▼──────────────────────────┐   │
│  │  Service (業務邏輯)                         │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                                │
│  ┌─────────────────▼──────────────────────────┐   │
│  │  Repository (資料存取 - JPA)                │   │
│  └──────────────────┬──────────────────────────┘   │
└───────────────────── ───────────────────────────────┘
                      │ JDBC
                      ▼
┌─────────────────────────────────────────────────────┐
│                 資料庫層 (Database)                  │
│         PostgreSQL / MySQL / H2                     │
│  - users (用戶)                                     │
│  - headache_logs (頭痛日誌)                         │
│  - health_scales (健康量表)                         │
└─────────────────────────────────────────────────────┘
```

## 📊 資料庫設計

### 資料表結構

#### users (用戶表)

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (PK) | 主鍵 |
| email | VARCHAR(100) | Email (唯一) |
| password | VARCHAR(255) | 加密密碼 |
| name | VARCHAR(50) | 姓名 |
| role | VARCHAR(20) | 角色 (PATIENT/DOCTOR/CASE_MANAGER) |
| phone | VARCHAR(20) | 電話 |
| gender | VARCHAR(10) | 性別 |
| age | INTEGER | 年齡 |
| patient_id | VARCHAR(50) | 病歷號 |
| is_active | BOOLEAN | 是否啟用 |
| created_at | TIMESTAMP | 創建時間 |
| updated_at | TIMESTAMP | 更新時間 |

#### headache_logs (頭痛日誌表)

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (PK) | 主鍵 |
| user_id | BIGINT (FK) | 用戶 ID |
| log_date | TIMESTAMP | 日誌日期 |
| intensity | INTEGER | 疼痛強度 (1-10) |
| symptoms | VARCHAR(500) | 症狀 |
| medication | VARCHAR(200) | 用藥 |
| notes | VARCHAR(500) | 備註 |
| duration_hours | INTEGER | 持續時間（小時） |
| location | VARCHAR(100) | 疼痛部位 |
| triggers | VARCHAR(200) | 誘發因素 |
| created_at | TIMESTAMP | 創建時間 |
| updated_at | TIMESTAMP | 更新時間 |

#### health_scales (健康量表表)

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (PK) | 主鍵 |
| user_id | BIGINT (FK) | 用戶 ID |
| scale_type | VARCHAR(50) | 量表類型 |
| test_date | TIMESTAMP | 測試日期 |
| score | INTEGER | 分數 |
| level | VARCHAR(50) | 嚴重程度 |
| answers | TEXT | JSON 格式答案 |
| interpretation | TEXT | 結果判讀 |
| created_at | TIMESTAMP | 創建時間 |

### ER 圖

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │◄──┐
│ email       │   │
│ password    │   │
│ name        │   │
│ role        │   │
│ ...         │   │
└─────────────┘   │
                  │
        ┌─────────┴──────────┬────────────────┐
        │                    │                │
        │                    │                │
┌───────▼────────┐  ┌────────▼───────┐       │
│ headache_logs  │  │ health_scales  │       │
├────────────────┤  ├────────────────┤       │
│ id (PK)        │  │ id (PK)        │       │
│ user_id (FK)   │  │ user_id (FK)   │       │
│ log_date       │  │ scale_type     │       │
│ intensity      │  │ test_date      │       │
│ symptoms       │  │ score          │       │
│ ...            │  │ ...            │       │
└────────────────┘  └────────────────┘       │
                                              │
                                   (未來可擴展更多表)
```

## 🔄 API 端點總覽

### 認證 API (`/api/auth`)

| 方法 | 端點 | 說明 | 認證 |
|------|------|------|------|
| POST | `/auth/register` | 註冊 | ❌ |
| POST | `/auth/login` | 登入 | ❌ |
| GET | `/auth/health` | 健康檢查 | ❌ |

### 頭痛日誌 API (`/api/headache-logs`)

| 方法 | 端點 | 說明 | 認證 |
|------|------|------|------|
| POST | `/headache-logs` | 創建日誌 | ✅ |
| GET | `/headache-logs/my-logs` | 獲取我的日誌 | ✅ |
| GET | `/headache-logs/date-range` | 日期範圍查詢 | ✅ |
| PUT | `/headache-logs/{id}` | 更新日誌 | ✅ |
| DELETE | `/headache-logs/{id}` | 刪除日誌 | ✅ |

### 健康量表 API (`/api/health-scales`)

| 方法 | 端點 | 說明 | 認證 |
|------|------|------|------|
| POST | `/health-scales` | 提交量表 | ✅ |
| GET | `/health-scales/user/{userId}` | 獲取用戶量表 | ✅ |
| GET | `/health-scales/user/{userId}/type/{type}` | 獲取特定類型 | ✅ |

## 🔐 安全機制

### JWT 認證流程

```
1. 用戶登入
   ↓
2. 後端驗證用戶名密碼
   ↓
3. 生成 JWT Token (包含用戶資訊)
   ↓
4. 前端存儲 Token (localStorage)
   ↓
5. 後續請求攜帶 Token (Authorization: Bearer {token})
   ↓
6. 後端驗證 Token 並授權
```

### Token 格式

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user@example.com",
  "iat": 1730448000,
  "exp": 1730534400
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## 🛠 技術棧對照

| 功能 | 前端 | 後端 |
|------|------|------|
| 語言 | TypeScript | Java 17 |
| 框架 | React 18 | Spring Boot 3.2 |
| 構建工具 | Vite | Maven |
| 樣式 | Tailwind CSS 4.0 | - |
| UI 組件 | shadcn/ui | - |
| 狀態管理 | React Hooks | Spring Context |
| 路由 | React Router (可選) | Spring MVC |
| HTTP 客戶端 | Fetch API | - |
| 驗證 | 前端驗證 + API 驗證 | Spring Validation |
| 認證 | JWT Token | Spring Security + JWT |
| 資料庫 | - | PostgreSQL/MySQL |
| ORM | - | Spring Data JPA |
| 測試 | Vitest | JUnit 5 |
| 代碼品質 | ESLint + Prettier | Checkstyle (可選) |

## 📝 開發流程

### 添加新功能

假設要添加「醫師評論」功能：

#### 1. 後端開發

```java
// 1. 創建實體
@Entity
public class DoctorComment {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User doctor;
    
    @ManyToOne
    private HeadacheLog headacheLog;
    
    private String comment;
}

// 2. 創建 Repository
public interface DoctorCommentRepository extends JpaRepository<DoctorComment, Long> {}

// 3. 創建 Service
@Service
public class DoctorCommentService {
    public DoctorCommentDTO addComment(...) { }
}

// 4. 創建 Controller
@RestController
@RequestMapping("/api/doctor-comments")
public class DoctorCommentController {
    @PostMapping
    public ResponseEntity<DoctorCommentDTO> addComment(...) { }
}
```

#### 2. 前端開發

```typescript
// 1. 添加 API 服務
export const doctorCommentApi = {
  addComment: async (data) => {
    return request('/doctor-comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 2. 創建組件
export function DoctorCommentForm() {
  const handleSubmit = async () => {
    await doctorCommentApi.addComment({ ... });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// 3. 在頁面中使用
<DoctorDashboard>
  <DoctorCommentForm />
</DoctorDashboard>
```

## 📦 部署架構

### 開發環境

```
localhost:3000 (前端 Vite Dev Server)
      ↓
localhost:8080 (後端 Spring Boot)
      ↓
localhost:5432 (PostgreSQL)
```

### 生產環境

```
                     ┌──────────────────┐
用戶瀏覽器 ──────→   │   Nginx (80/443) │
                     └────────┬─────────┘
                              │
                 ┌────────────┴──────────────┐
                 │                           │
       ┌─────────▼──────────┐     ┌─────────▼──────────┐
       │ React Static Files │     │ Spring Boot (8080) │
       │ (HTML/CSS/JS)      │     │   + JWT Auth       │
       └────────────────────┘     └─────────┬──────────┘
                                             │
                                   ┌─────────▼──────────┐
                                   │ PostgreSQL (5432)  │
                                   └────────────────────┘
```

## 🔍 監控與日誌

### 前端

- **錯誤追蹤**: Console.log + Sentry (可選)
- **性能監控**: Lighthouse CI
- **用戶分析**: Google Analytics (可選)

### 後端

- **應用日誌**: Logback (Spring Boot 內建)
- **監控**: Spring Boot Actuator
- **APM**: New Relic / DataDog (可選)

## 📚 學習資源

### 前端
- [React 官方文檔](https://react.dev/)
- [Vite 官方文檔](https://vitejs.dev/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)

### 後端
- [Spring Boot 官方文檔](https://spring.io/projects/spring-boot)
- [Spring Security 官方文檔](https://spring.io/projects/spring-security)
- [JPA 官方文檔](https://spring.io/projects/spring-data-jpa)

---

**最後更新**: 2025-11-01
