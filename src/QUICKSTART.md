# 快速開始指南

本指南將幫助您在 **5 分鐘內** 啟動整個偏頭痛個案照護系統。

## 🚀 方式 1: Docker 快速啟動（推薦）

### 前置需求
- 安裝 Docker Desktop: https://www.docker.com/products/docker-desktop/

### 步驟

```bash
# 1. 進入後端目錄
cd backend

# 2. 啟動所有服務（資料庫 + 後端）
docker-compose up -d

# 3. 等待服務啟動（約 30 秒）
docker-compose logs -f backend

# 當看到 "偏頭痛個案照護系統已啟動" 即可 Ctrl+C 退出日誌
```

### 驗證後端

打開瀏覽器訪問: http://localhost:8080/api/auth/health

應該看到: `偏頭痛個案照護系統後端運行正常`

### 啟動前端

```bash
# 回到專案根目錄
cd ..

# 創建環境變數文件
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env.local

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

打開瀏覽器訪問: http://localhost:3000 或 http://localhost:5173

**完成！** 🎉

---

## 🔧 方式 2: 手動啟動（無 Docker）

### 前置需求

1. **安裝 JDK 17**:
   ```bash
   # Windows (Chocolatey)
   choco install openjdk17
   
   # macOS
   brew install openjdk@17
   
   # Ubuntu
   sudo apt install openjdk-17-jdk
   ```

2. **安裝 PostgreSQL**:
   ```bash
   # Windows
   choco install postgresql
   
   # macOS
   brew install postgresql
   
   # Ubuntu
   sudo apt install postgresql
   ```

3. **安裝 Node.js**:
   ```bash
   # 下載 Node.js 20+ from https://nodejs.org/
   ```

### 步驟 1: 設定資料庫

```bash
# 啟動 PostgreSQL
# Windows: 自動啟動
# macOS:
brew services start postgresql

# Ubuntu:
sudo systemctl start postgresql

# 創建資料庫
psql -U postgres
```

在 psql 中執行:
```sql
CREATE DATABASE migraine_care;
CREATE USER migraine_user WITH PASSWORD 'migraine_password';
GRANT ALL PRIVILEGES ON DATABASE migraine_care TO migraine_user;
\q
```

### 步驟 2: 配置後端

```bash
cd backend

# 編輯 src/main/resources/application.yml
# 確認資料庫連接資訊正確
```

### 步驟 3: 啟動後端

```bash
# 使用 Maven 運行
mvn spring-boot:run

# 或者編譯後運行
mvn clean package
java -jar target/migraine-care-system-1.0.0.jar
```

等待看到: `偏頭痛個案照護系統已啟動`

### 步驟 4: 啟動前端

```bash
# 回到專案根目錄
cd ..

# 創建環境變數
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env.local

# 安裝依賴並啟動
npm install
npm run dev
```

**完成！** 🎉

---

## 🧪 測試系統

### 1. 註冊測試用戶

打開前端頁面，點選「註冊」，填寫：
- Email: `test@example.com`
- 密碼: `password123`
- 姓名: `測試用戶`
- 角色: 選擇「病患」

### 2. 登入系統

使用剛才註冊的帳號登入。

### 3. 創建頭痛日誌

在病患儀表板中，填寫一筆頭痛日誌：
- 日期時間: 今天
- 疼痛強度: 7
- 症狀: 單側疼痛, 噁心
- 用藥: 普拿疼
- 備註: 測試紀錄

### 4. 填寫健康量表

選擇 MIDAS 量表並完成問卷。

---

## 📝 預設測試帳號（開發環境）

如果資料庫有載入測試資料 (`data.sql`)：

| Email | 密碼 | 角色 |
|-------|------|------|
| patient1@example.com | password123 | 病患 |
| patient2@example.com | password123 | 病患 |
| doctor1@example.com | password123 | 醫師 |
| manager1@example.com | password123 | 個管師 |

---

## 🛑 停止服務

### Docker 方式

```bash
cd backend
docker-compose down
```

### 手動方式

- 後端: 在終端機按 `Ctrl+C`
- 前端: 在終端機按 `Ctrl+C`
- PostgreSQL:
  ```bash
  # macOS
  brew services stop postgresql
  
  # Ubuntu
  sudo systemctl stop postgresql
  ```

---

## 🔍 常見問題

### Q1: 端口被佔用

**錯誤**: `Port 8080 is already in use`

**解決**:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

### Q2: 資料庫連接失敗

**錯誤**: `Unable to create initial connections of pool`

**解決**:
1. 確認 PostgreSQL 已啟動
2. 檢查帳號密碼是否正確
3. 測試連接:
   ```bash
   psql -U migraine_user -d migraine_care -h localhost
   ```

### Q3: npm install 失敗

**解決**:
```bash
# 清除緩存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Q4: Maven 下載依賴緩慢

**解決**: 使用國內鏡像源（編輯 `~/.m2/settings.xml`）:
```xml
<mirrors>
  <mirror>
    <id>aliyun</id>
    <mirrorOf>central</mirrorOf>
    <name>Aliyun Maven</name>
    <url>https://maven.aliyun.com/repository/public</url>
  </mirror>
</mirrors>
```

---

## 📚 下一步

1. ✅ 閱讀 [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) 了解前後端整合
2. ✅ 閱讀 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解專案架構
3. ✅ 閱讀 [backend/README.md](./backend/README.md) 了解後端詳細資訊
4. ✅ 閱讀 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解部署流程

---

**如有任何問題，請查看各文檔或提交 Issue。**

最後更新: 2025-11-01
