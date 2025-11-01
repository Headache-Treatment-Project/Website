# 啟動檢查清單

在開始使用系統前，請確認以下項目。

## ✅ 環境檢查

### 基礎環境

- [ ] **Java JDK 17+** 已安裝
  ```bash
  java -version
  # 應該顯示: openjdk version "17.x.x" 或更高
  ```

- [ ] **Maven 3.8+** 已安裝
  ```bash
  mvn -version
  # 應該顯示: Apache Maven 3.8.x 或更高
  ```

- [ ] **Node.js 18+** 已安裝
  ```bash
  node -version
  # 應該顯示: v18.x.x 或更高
  ```

- [ ] **PostgreSQL** 或 **Docker** 已安裝
  ```bash
  # PostgreSQL
  psql --version
  # 或 Docker
  docker --version
  ```

## ✅ 後端設置

### 資料庫配置

- [ ] PostgreSQL 服務已啟動
  ```bash
  # macOS
  brew services list | grep postgresql
  
  # Ubuntu
  sudo systemctl status postgresql
  
  # Windows: 檢查服務管理員
  ```

- [ ] 資料庫已創建
  ```sql
  CREATE DATABASE migraine_care;
  CREATE USER migraine_user WITH PASSWORD 'migraine_password';
  GRANT ALL PRIVILEGES ON DATABASE migraine_care TO migraine_user;
  ```

- [ ] 連接資訊正確 (檢查 `backend/src/main/resources/application.yml`)
  ```yaml
  spring:
    datasource:
      url: jdbc:postgresql://localhost:5432/migraine_care
      username: migraine_user
      password: migraine_password
  ```

### JWT 配置

- [ ] JWT Secret 已設定（生產環境必須更改）
  ```yaml
  jwt:
    secret: your-very-long-secret-key-at-least-256-bits
  ```

### CORS 配置

- [ ] 前端 URL 已加入 CORS 白名單
  ```yaml
  cors:
    allowed-origins: 
      - http://localhost:3000
      - http://localhost:5173
  ```

## ✅ 前端設置

### 環境變數

- [ ] 創建 `.env.local` 文件
  ```bash
  echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env.local
  ```

### NPM 依賴

- [ ] 安裝依賴完成
  ```bash
  npm install
  # 應該無錯誤完成
  ```

## ✅ 啟動測試

### 後端測試

- [ ] 後端成功啟動
  ```bash
  cd backend
  mvn spring-boot:run
  # 等待看到: "偏頭痛個案照護系統已啟動"
  ```

- [ ] 健康檢查 API 正常
  ```bash
  curl http://localhost:8080/api/auth/health
  # 應該返回: "偏頭痛個案照護系統後端運行正常"
  ```

- [ ] 資料表自動創建
  ```bash
  psql -U migraine_user -d migraine_care -c "\dt"
  # 應該看到: users, headache_logs, health_scales
  ```

### 前端測試

- [ ] 前端成功啟動
  ```bash
  npm run dev
  # 應該顯示: http://localhost:3000 或 http://localhost:5173
  ```

- [ ] 打開瀏覽器無錯誤
  - 按 F12 打開開發者工具
  - Console 無紅色錯誤訊息

- [ ] 註冊功能正常
  - 填寫註冊表單
  - 提交後可以自動登入

- [ ] 登入功能正常
  - 使用註冊的帳號登入
  - 可以看到對應角色的儀表板

### 整合測試

- [ ] 可以創建頭痛日誌
  - 填寫日誌資料
  - 提交成功

- [ ] 可以查看日誌列表
  - 顯示剛才創建的日誌

- [ ] 可以填寫健康量表
  - 選擇量表類型（如 MIDAS）
  - 完成問卷並提交

- [ ] 資料持久化
  - 登出後重新登入
  - 資料仍然存在

## ✅ Docker 啟動（可選）

如果使用 Docker:

- [ ] Docker Desktop 已啟動

- [ ] Docker Compose 啟動成功
  ```bash
  cd backend
  docker-compose up -d
  # 無錯誤訊息
  ```

- [ ] 容器運行正常
  ```bash
  docker-compose ps
  # 應該看到:
  # migraine-postgres  running
  # migraine-backend   running
  ```

- [ ] 後端日誌正常
  ```bash
  docker-compose logs backend
  # 應該看到啟動成功訊息
  ```

## ✅ 開發工具（可選）

### 代碼品質工具

- [ ] ESLint 配置正常
  ```bash
  npm run lint
  # 無錯誤或只有警告
  ```

- [ ] Prettier 配置正常
  ```bash
  npm run format:check
  # 無格式問題
  ```

- [ ] Husky Git hooks 已安裝
  ```bash
  npm run prepare
  # 創建 .husky/ 目錄
  ```

### 測試工具

- [ ] Vitest 配置正常
  ```bash
  npm run test
  # 測試運行（可能暫無測試案例）
  ```

- [ ] JUnit 配置正常（後端）
  ```bash
  cd backend
  mvn test
  # 測試通過
  ```

## ✅ 部署準備（生產環境）

### 安全檢查

- [ ] JWT Secret 已更改為強密碼
- [ ] 資料庫密碼已更改
- [ ] application.yml 中無明文敏感資訊
- [ ] CORS 僅允許實際前端域名

### 性能檢查

- [ ] 資料庫索引已建立
- [ ] JPA 查詢優化（懶加載）
- [ ] 前端代碼已壓縮（npm run build）
- [ ] 圖片已優化

### 監控準備

- [ ] 日誌配置正確
- [ ] 錯誤追蹤已設置
- [ ] 備份策略已規劃

## 🎯 故障排查

如果某項檢查失敗，請參考:

- [QUICKSTART.md](./QUICKSTART.md) - 快速開始指南
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - 整合問題
- [backend/README.md](./backend/README.md) - 後端詳細文檔

### 常見問題快速連結

| 問題 | 參考章節 |
|------|----------|
| 端口被佔用 | QUICKSTART.md > Q1 |
| 資料庫連接失敗 | QUICKSTART.md > Q2 |
| CORS 錯誤 | BACKEND_INTEGRATION.md > Q1 |
| 401 Unauthorized | BACKEND_INTEGRATION.md > Q2 |
| npm install 失敗 | QUICKSTART.md > Q3 |

## ✅ 完成！

當所有項目都打勾後，系統即可正常使用。

**下一步**: 
1. 開始開發新功能
2. 閱讀 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解架構
3. 查看 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) 了解已實作功能

---

**最後更新**: 2025-11-01
