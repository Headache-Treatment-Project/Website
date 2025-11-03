# 快速參考卡 (Quick Reference)

## 🚀 常用指令

### 前端

```bash
# 開發
npm run dev              # 啟動開發伺服器 (http://localhost:3000)

# 構建
npm run build            # 生產構建
npm run preview          # 預覽構建結果

# 代碼品質
npm run lint             # ESLint 檢查
npm run lint:fix         # 自動修復 ESLint 問題
npm run format           # Prettier 格式化
npm run format:check     # 檢查格式

# 測試
npm run test             # 運行測試
npm run test:coverage    # 測試覆蓋率

# 其他
npm run analyze          # 分析打包大小
npm run prepare          # 安裝 Husky
```

### 後端

```bash
# 開發
cd backend
mvn spring-boot:run      # 啟動後端 (http://localhost:8080)

# 構建
mvn clean package        # 打包 JAR
mvn clean install        # 安裝到本地倉庫

# 測試
mvn test                 # 運行測試
mvn verify               # 驗證

# Flyway
mvn flyway:info          # 查看遷移狀態
mvn flyway:migrate       # 執行遷移
mvn flyway:clean         # 清理資料庫（危險！）

# Docker
docker-compose up -d     # 啟動服務（後台）
docker-compose logs -f   # 查看日誌
docker-compose down      # 停止服務
docker-compose ps        # 查看狀態
```

## 🔑 環境變數

### 前端 (.env.local)

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### 後端 (環境變數或 application.yml)

```bash
# JWT 配置
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=1209600000

# 資料庫配置
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/migraine_care
SPRING_DATASOURCE_USERNAME=migraine_user
SPRING_DATASOURCE_PASSWORD=your_password
```

## 📡 API 端點速查

### 認證

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/auth/register` | 註冊 |
| POST | `/api/auth/login` | 登入 |
| POST | `/api/auth/refresh` | 刷新 Token |
| POST | `/api/auth/logout` | 登出 |
| GET | `/api/auth/health` | 健康檢查 |

### 頭痛日誌

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/headache-logs` | 創建日誌 |
| GET | `/api/headache-logs/my-logs?userId={id}` | 獲取我的日誌 |
| GET | `/api/headache-logs/date-range` | 日期範圍查詢 |
| PUT | `/api/headache-logs/{id}` | 更新日誌 |
| DELETE | `/api/headache-logs/{id}` | 刪除日誌 |

### 健康量表

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/health-scales` | 提交量表 |
| GET | `/api/health-scales/user/{userId}` | 獲取用戶量表 |
| GET | `/api/health-scales/user/{userId}/type/{type}` | 獲取特定類型 |

## 💾 資料庫操作

### PostgreSQL

```bash
# 連接資料庫
psql -U migraine_user -d migraine_care

# 常用 SQL
\dt                      # 列出所有表
\d users                 # 查看表結構
\di                      # 列出所有索引
\q                       # 退出

# 備份
pg_dump migraine_care > backup.sql

# 恢復
psql migraine_care < backup.sql

# 清理
DROP DATABASE migraine_care;
CREATE DATABASE migraine_care;
```

## 🐛 常見問題快速修復

### 前端

```bash
# 端口被佔用
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# node_modules 問題
rm -rf node_modules package-lock.json
npm install

# 清除緩存
npm cache clean --force

# 重置 Git hooks
rm -rf .husky
npm run prepare
```

### 後端

```bash
# 端口被佔用
# Windows
netstat -ano | findstr :8080
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Maven 緩存問題
mvn dependency:purge-local-repository

# 強制更新依賴
mvn clean install -U

# 跳過測試
mvn clean package -DskipTests
```

### 資料庫

```bash
# 連接失敗
# 檢查 PostgreSQL 服務
# macOS
brew services list | grep postgresql
brew services restart postgresql

# Ubuntu
sudo systemctl status postgresql
sudo systemctl restart postgresql

# 重置密碼
sudo -u postgres psql
ALTER USER migraine_user PASSWORD 'new_password';
```

## 🔐 安全檢查清單

### 開發環境

- [ ] `.env.local` 已創建（不提交到 Git）
- [ ] `.gitignore` 包含敏感文件
- [ ] JWT Secret 使用環境變數
- [ ] 資料庫密碼未入庫

### 生產環境

- [ ] JWT Secret 強隨機密鑰（256-bit+）
- [ ] HTTPS 已啟用
- [ ] CORS 僅允許實際網域
- [ ] 資料庫備份策略已設定
- [ ] 日誌等級設為 INFO/WARN
- [ ] 錯誤追蹤已設定

## 📋 Git 工作流程

```bash
# 1. 創建功能分支
git checkout -b feature/new-feature

# 2. 開發並提交
git add .
git commit -m "feat: add new feature"
# Husky 會自動運行 lint-staged

# 3. 推送到遠端
git push origin feature/new-feature

# 4. 創建 Pull Request
# 在 GitHub 上操作

# 5. 合併後刪除分支
git checkout main
git pull
git branch -d feature/new-feature
```

## 🧪 測試指令

```bash
# 前端
npm run test                     # 運行所有測試
npm run test LoginPage           # 測試特定文件
npm run test:coverage            # 生成覆蓋率報告

# 後端
mvn test                         # 運行所有測試
mvn test -Dtest=AuthServiceTest  # 測試特定類
mvn verify                       # 運行所有驗證（包括集成測試）
```

## 📊 性能分析

```bash
# 前端打包分析
npm run analyze
# 開啟 http://localhost:8888

# 後端性能分析
# 訪問 Spring Boot Actuator
curl http://localhost:8080/actuator/metrics
curl http://localhost:8080/actuator/health
```

## 🔄 Token 相關

### 獲取 Token

```bash
# 登入
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 保存返回的 Tokens
export ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIs..."
export REFRESH_TOKEN="550e8400-e29b-41d4..."
```

### 使用 Token

```bash
# 調用 API
curl -X GET http://localhost:8080/api/headache-logs/my-logs?userId=1 \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 刷新 Token

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

## 📦 部署

### GitHub Pages（前端）

```bash
# 1. 確認 vite.config.ts
base: '/your-repo-name/'

# 2. 推送到 main
git push origin main

# 3. 啟用 GitHub Pages
# Settings > Pages > Source: GitHub Actions

# 4. 等待部署完成
# https://your-username.github.io/your-repo-name/
```

### Docker（後端）

```bash
# 1. 構建鏡像
docker build -t migraine-backend .

# 2. 運行容器
docker run -d -p 8080:8080 \
  -e JWT_SECRET="your-secret" \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://host:5432/migraine_care" \
  migraine-backend

# 3. 或使用 docker-compose
docker-compose up -d
```

## 📚 文檔導航

| 文檔 | 用途 |
|------|------|
| README.md | 專案總覽 |
| QUICKSTART.md | 5分鐘快速開始 |
| QUICK_REFERENCE.md | 本文檔（常用指令） |
| SECURITY_ENHANCEMENTS.md | 安全功能說明 |
| VERSION_ALIGNMENT.md | 版本對齊指南 |
| UPDATES_SUMMARY.md | 更新總結 |
| BACKEND_INTEGRATION.md | 前後端整合 |
| PROJECT_STRUCTURE.md | 專案架構 |
| ARCHITECTURE.md | 系統架構圖 |
| DEPLOYMENT.md | 部署指南 |
| CHECKLIST.md | 啟動檢查清單 |

## 🆘 獲取幫助

### 1. 查看日誌

```bash
# 前端（瀏覽器）
# 開發者工具 (F12) > Console

# 後端
tail -f logs/spring.log

# Docker
docker-compose logs -f backend
```

### 2. 常見錯誤

| 錯誤 | 原因 | 解決方法 |
|------|------|---------|
| CORS 錯誤 | 跨域配置問題 | 檢查 application.yml CORS 配置 |
| 401 Unauthorized | Token 無效/過期 | 重新登入或刷新 Token |
| 404 Not Found (SPA) | 缺少 404.html | 確認 CI 有複製 index.html |
| 連接資料庫失敗 | PostgreSQL 未啟動 | 啟動 PostgreSQL 服務 |
| Maven 依賴下載慢 | 網絡問題 | 配置國內鏡像 |

### 3. 檢查系統狀態

```bash
# 前端
curl http://localhost:3000

# 後端
curl http://localhost:8080/api/auth/health

# 資料庫
psql -U migraine_user -d migraine_care -c "SELECT version();"

# Docker
docker-compose ps
```

---

**最後更新**: 2025-11-03  
**版本**: 2.1.0  
**提示**: 將此文檔加入書籤以便快速查閱！
