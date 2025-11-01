# 偏頭痛個案照護系統 - Java Spring Boot 後端

這是偏頭痛個案照護系統的後端服務，使用 **Java 17** 和 **Spring Boot 3.2** 開發。

## 📋 技術棧

- **Java**: 17
- **Spring Boot**: 3.2.1
- **Spring Security**: JWT 認證
- **Spring Data JPA**: 資料持久化
- **Database**: PostgreSQL / MySQL / H2 (開發)
- **Build Tool**: Maven
- **其他**: Lombok, MapStruct, JWT (jjwt)

## 🗂 項目結構

```
backend/
├── src/main/java/com/migraine/
│   ├── MigraineCareApplication.java   # 主應用程式
│   ├── config/                        # 配置類
│   │   ├── SecurityConfig.java        # Spring Security 配置
│   │   └── CorsConfig.java            # CORS 跨域配置
│   ├── controller/                    # 控制器層
│   │   ├── AuthController.java        # 認證 API
│   │   ├── HeadacheLogController.java # 頭痛日誌 API
│   │   └── HealthScaleController.java # 健康量表 API
│   ├── service/                       # 服務層
│   │   ├── AuthService.java
│   │   ├── HeadacheLogService.java
│   │   └── HealthScaleService.java
│   ├── repository/                    # 資料存取層
│   │   ├── UserRepository.java
│   │   ├── HeadacheLogRepository.java
│   │   └── HealthScaleRepository.java
│   ├── entity/                        # 實體類
│   │   ├── User.java                  # 用戶實體
│   │   ├── HeadacheLog.java           # 頭痛日誌實體
│   │   └── HealthScale.java           # 健康量表實體
│   ├── dto/                           # 資料傳輸對象
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── UserDTO.java
│   │   ├── HeadacheLogDTO.java
│   │   └── HealthScaleDTO.java
│   └── security/                      # 安全相關
│       ├── JwtTokenProvider.java      # JWT Token 提供者
│       ├── JwtAuthenticationFilter.java
│       ├── JwtAuthenticationEntryPoint.java
│       └── CustomUserDetailsService.java
├── src/main/resources/
│   └── application.yml                # 應用配置
└── pom.xml                            # Maven 配置
```

## 🚀 快速開始

### 1. 環境需求

- JDK 17 或更高版本
- Maven 3.8+
- PostgreSQL 14+ / MySQL 8+ (生產環境)

### 2. 安裝 JDK

**Windows**:
```bash
# 使用 Chocolatey
choco install openjdk17

# 或下載安裝包
# https://adoptium.net/
```

**macOS**:
```bash
brew install openjdk@17
```

**Linux**:
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### 3. 配置資料庫

#### 選項 A: PostgreSQL (推薦)

1. 安裝 PostgreSQL:
```bash
# Windows
choco install postgresql

# macOS
brew install postgresql

# Ubuntu
sudo apt install postgresql postgresql-contrib
```

2. 創建資料庫:
```sql
CREATE DATABASE migraine_care;
CREATE USER migraine_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE migraine_care TO migraine_user;
```

3. 修改 `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/migraine_care
    username: migraine_user
    password: your_password
```

#### 選項 B: MySQL

```sql
CREATE DATABASE migraine_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'migraine_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON migraine_care.* TO 'migraine_user'@'localhost';
FLUSH PRIVILEGES;
```

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/migraine_care?useSSL=false&serverTimezone=Asia/Taipei
    username: migraine_user
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

#### 選項 C: H2 (開發測試，無需安裝)

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  h2:
    console:
      enabled: true
      path: /h2-console
```

### 4. 配置 JWT Secret

在 `application.yml` 中修改 JWT 密鑰（生產環境必須更改）:

```yaml
jwt:
  secret: your-very-long-secret-key-at-least-256-bits-long-for-production
  expiration: 86400000  # 24 小時
```

生成安全的密鑰:
```bash
# 使用 openssl
openssl rand -base64 64
```

### 5. 編譯與運行

```bash
# 進入後端目錄
cd backend

# 使用 Maven 編譯
mvn clean install

# 運行應用
mvn spring-boot:run

# 或者編譯成 JAR 後運行
mvn clean package
java -jar target/migraine-care-system-1.0.0.jar
```

### 6. 驗證運行

訪問: http://localhost:8080/api/auth/health

應該看到: `偏頭痛個案照護系統後端運行正常`

## 📡 API 端點

### 認證 API

| 方法 | 端點 | 說明 | 認證 |
|------|------|------|------|
| POST | `/api/auth/register` | 用戶註冊 | ❌ |
| POST | `/api/auth/login` | 用戶登入 | ❌ |
| GET | `/api/auth/health` | 健康檢查 | ❌ |

### 頭痛日誌 API

| 方法 | 端點 | 說明 | 認證 |
|------|------|------|------|
| POST | `/api/headache-logs` | 創建日誌 | ✅ |
| GET | `/api/headache-logs/my-logs?userId={id}` | 獲取我的日誌 | ✅ |
| GET | `/api/headache-logs/date-range` | 查詢日期範圍 | ✅ |
| PUT | `/api/headache-logs/{id}` | 更新日誌 | ✅ |
| DELETE | `/api/headache-logs/{id}` | 刪除日誌 | ✅ |

### 健康量表 API

| 方法 | 端點 | 說明 | 認證 |
|------|------|------|------|
| POST | `/api/health-scales` | 提交量表 | ✅ |
| GET | `/api/health-scales/user/{userId}` | 獲取用戶量表 | ✅ |
| GET | `/api/health-scales/user/{userId}/type/{type}` | 獲取特定類型 | ✅ |

## 🔐 認證流程

1. **註冊**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "name": "張三",
    "role": "PATIENT",
    "phone": "0912345678",
    "age": 30
  }'
```

2. **登入**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'
```

3. **使用 Token**:
```bash
curl -X GET http://localhost:8080/api/headache-logs/my-logs?userId=1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 測試

```bash
# 運行所有測試
mvn test

# 運行特定測試
mvn test -Dtest=AuthServiceTest
```

## 📦 部署

### 打包 JAR

```bash
mvn clean package -DskipTests
```

生成的 JAR 位於: `target/migraine-care-system-1.0.0.jar`

### Docker 部署 (可選)

創建 `Dockerfile`:
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

構建並運行:
```bash
docker build -t migraine-backend .
docker run -p 8080:8080 migraine-backend
```

## 🔧 常見問題

### 1. 資料庫連接失敗

**問題**: `Unable to create initial connections of pool`

**解決**:
- 確認資料庫服務已啟動
- 檢查 `application.yml` 中的連接資訊
- 確認防火牆設定

### 2. JWT Token 無效

**問題**: `Invalid JWT token`

**解決**:
- 確認 JWT secret 長度足夠（至少 256 bits）
- 檢查 Token 是否過期
- 確認 Authorization header 格式正確

### 3. CORS 錯誤

**問題**: `CORS policy: No 'Access-Control-Allow-Origin'`

**解決**:
在 `application.yml` 添加前端 URL:
```yaml
cors:
  allowed-origins: 
    - http://localhost:3000
    - https://your-frontend-url.com
```

## 📚 進階配置

### 啟用 HTTPS

在 `application.yml` 添加:
```yaml
server:
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: your_password
    key-store-type: PKCS12
```

### 生產環境配置

創建 `application-prod.yml`:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # 生產環境不要使用 update
    show-sql: false
logging:
  level:
    com.migraine: INFO
```

運行:
```bash
java -jar app.jar --spring.profiles.active=prod
```

## 📞 技術支援

如有問題，請查看:
- [Spring Boot 官方文檔](https://spring.io/projects/spring-boot)
- [Spring Security 官方文檔](https://spring.io/projects/spring-security)
- [項目 Issues](https://github.com/your-repo/issues)

---

**最後更新**: 2025-11-01
