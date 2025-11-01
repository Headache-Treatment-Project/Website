# 前後端整合指南

本文檔說明如何將 React 前端連接到 Java Spring Boot 後端。

## 🏗 架構概覽

```
┌─────────────────┐         HTTP/REST          ┌──────────────────┐
│  React Frontend │ ◄────────────────────────► │ Spring Boot API  │
│  (Port 3000)    │         JSON + JWT         │   (Port 8080)    │
└─────────────────┘                            └──────────────────┘
                                                        │
                                                        ▼
                                                ┌──────────────────┐
                                                │   PostgreSQL     │
                                                │    Database      │
                                                └──────────────────┘
```

## 📝 整合步驟

### 步驟 1: 啟動後端

```bash
cd backend
mvn spring-boot:run
```

驗證後端運行:
```bash
curl http://localhost:8080/api/auth/health
# 應該返回: "偏頭痛個案照護系統後端運行正常"
```

### 步驟 2: 配置前端環境變數

創建 `.env.local` 文件（在前端根目錄）:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 步驟 3: 啟動前端

```bash
npm install
npm run dev
```

前端會在 `http://localhost:3000` 或 `http://localhost:5173` 運行。

### 步驟 4: 測試整合

1. **註冊測試用戶**:
   - 打開前端頁面
   - 點選「註冊」
   - 填寫資料並提交
   - 確認可以成功註冊並自動登入

2. **測試 API 調用**:
   打開瀏覽器開發者工具 (F12) → Network 標籤
   - 註冊/登入時，應該看到對 `/api/auth/register` 或 `/api/auth/login` 的請求
   - 狀態碼應該是 200
   - Response 應該包含 `token` 和 `user` 資料

3. **測試頭痛日誌**:
   - 登入後創建一筆頭痛日誌
   - 確認資料已保存（可以在後端資料庫查看）

## 🔧 API 使用範例

### 前端調用後端 API

```typescript
import { authApi, headacheLogApi, healthScaleApi } from './services/api';

// 1. 登入
const loginUser = async () => {
  try {
    const response = await authApi.login('user@example.com', 'password123');
    localStorage.setItem('accessToken', response.token);
    console.log('登入成功', response.user);
  } catch (error) {
    console.error('登入失敗', error);
  }
};

// 2. 創建頭痛日誌
const createLog = async () => {
  try {
    const log = await headacheLogApi.create({
      userId: 1,
      logDate: new Date().toISOString(),
      intensity: 7,
      symptoms: '單側疼痛,噁心',
      medication: '普拿疼',
      notes: '早上起床後開始',
    });
    console.log('日誌創建成功', log);
  } catch (error) {
    console.error('創建失敗', error);
  }
};

// 3. 獲取我的日誌
const getMyLogs = async (userId: number) => {
  try {
    const logs = await headacheLogApi.getMyLogs(userId);
    console.log('我的日誌', logs);
  } catch (error) {
    console.error('獲取失敗', error);
  }
};
```

## 🔐 認證流程

### 1. 註冊流程

```typescript
// 前端發送
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "password123",
  "name": "張三",
  "role": "PATIENT",
  "phone": "0912345678",
  "age": 30
}

// 後端返回
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "email": "patient@example.com",
    "name": "張三",
    "role": "PATIENT",
    ...
  }
}
```

### 2. 登入流程

```typescript
// 前端發送
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "password123"
}

// 後端返回（同註冊）
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "user": { ... }
}
```

### 3. 使用 Token 訪問受保護的 API

```typescript
// 前端發送
GET http://localhost:8080/api/headache-logs/my-logs?userId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 後端返回
[
  {
    "id": 1,
    "userId": 1,
    "logDate": "2025-11-01T08:00:00",
    "intensity": 7,
    "symptoms": "單側疼痛,噁心",
    ...
  }
]
```

## 🐛 常見問題

### 1. CORS 錯誤

**錯誤訊息**:
```
Access to fetch at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**解決方法**:
在後端 `application.yml` 中確認 CORS 配置包含前端 URL:

```yaml
cors:
  allowed-origins: 
    - http://localhost:3000
    - http://localhost:5173
```

### 2. 401 Unauthorized

**原因**: JWT Token 無效或過期

**解決方法**:
```typescript
// 檢查 Token 是否存在
const token = localStorage.getItem('accessToken');
if (!token) {
  // 重新登入
  window.location.href = '/login';
}
```

### 3. 404 Not Found

**原因**: API 端點路徑錯誤

**解決方法**:
- 確認後端 API 路徑: `http://localhost:8080/api/...`
- 確認前端 `.env.local` 中的 `VITE_API_BASE_URL`
- 檢查 Controller 的 `@RequestMapping` 路徑

### 4. 資料格式錯誤

**錯誤訊息**: `400 Bad Request`

**解決方法**:
- 確認前端發送的 JSON 格式正確
- 檢查日期格式（使用 ISO 8601: `2025-11-01T08:00:00`）
- 檢查必填欄位是否都有提供

## 📊 資料格式對照

### 用戶角色

| 前端 | 後端 Enum |
|------|-----------|
| `patient` | `PATIENT` |
| `doctor` | `DOCTOR` |
| `case_manager` | `CASE_MANAGER` |

### 健康量表類型

| 前端 | 後端 Enum |
|------|-----------|
| `MIDAS` | `MIDAS` |
| `HADS` | `HADS` |
| `BDI` | `BDI` |
| `PSQI` | `PSQI` |
| `FSS` | `FSS` |
| `WPI` | `WPI` |
| `ALLODYNIA` | `ALLODYNIA` |
| `PERCEIVED_STRESS` | `PERCEIVED_STRESS` |

### 日期時間格式

**前端發送**:
```typescript
const logDate = new Date().toISOString();
// "2025-11-01T08:30:00.000Z"
```

**後端接收**:
```java
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
private LocalDateTime logDate;
```

## 🧪 測試 API

使用 `curl` 或 Postman 測試:

```bash
# 1. 註冊
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "測試用戶",
    "role": "PATIENT"
  }'

# 2. 登入
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. 使用 Token 獲取日誌（替換 YOUR_TOKEN）
curl -X GET http://localhost:8080/api/headache-logs/my-logs?userId=1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📦 部署到生產環境

### 1. 後端部署

```bash
cd backend
mvn clean package -DskipTests

# 運行
java -jar target/migraine-care-system-1.0.0.jar \
  --spring.profiles.active=prod \
  --jwt.secret=YOUR_PRODUCTION_SECRET
```

### 2. 前端部署

修改 `.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

構建:
```bash
npm run build
```

### 3. 反向代理 (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        root /var/www/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 後端 API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 安全建議

1. **永遠不要在前端暴露敏感資訊**:
   - 不要在前端代碼中寫死密碼或密鑰
   - 使用環境變數

2. **HTTPS**:
   - 生產環境必須使用 HTTPS
   - 後端配置 SSL 憑證

3. **Token 安全**:
   - Token 存儲在 `localStorage` 或 `sessionStorage`
   - 不要將 Token 存在 URL 參數中
   - 定期更新 Token

4. **輸入驗證**:
   - 前端和後端都要驗證輸入
   - 防止 XSS 和 SQL Injection

---

**最後更新**: 2025-11-01
