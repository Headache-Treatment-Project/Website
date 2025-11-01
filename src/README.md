# 偏頭痛個案照護系統 (Migraine Care System)

一個完整的偏頭痛管理系統，提供病患、醫師與個案管理師使用。採用 **前後端分離架構**，前端使用 React，後端使用 Java Spring Boot。

## ✨ 功能特色

### 👥 三種使用者角色
- **病患**: 填寫頭痛日誌、健康量表、查看個人統計
- **醫師**: 查看病患數據、趨勢分析、統計圖表
- **個案管理師**: 追蹤高風險病患、提醒回診

### 📊 8種專業健康量表
- MIDAS (偏頭痛失能評估量表)
- HADS (醫院焦慮憂鬱量表)
- BDI (貝克憂鬱量表)
- PSQI (匹茲堡睡眠品質量表)
- FSS (疲勞嚴重度量表)
- WPI (廣泛性疼痛指數)
- Allodynia Questionnaire (異痛問卷)
- Perceived Stress Scale (知覺壓力量表)

### 🎨 設計風格
- 醫療風格的淺藍與白色配色
- 乾淨簡潔的介面設計
- 響應式設計，支援各種裝置

## 🚀 技術棧

### 前端
- **框架**: React 18 + TypeScript
- **樣式**: Tailwind CSS 4.0
- **UI 組件**: Radix UI + shadcn/ui
- **圖表**: Recharts
- **建構工具**: Vite
- **代碼品質**: ESLint + Prettier + Husky

### 後端
- **語言**: Java 17
- **框架**: Spring Boot 3.2
- **安全**: Spring Security + JWT
- **資料庫**: PostgreSQL / MySQL
- **ORM**: Spring Data JPA
- **建構工具**: Maven

## 🚀 快速開始

### 方式 1: Docker 啟動（推薦）

```bash
# 1. 啟動後端和資料庫
cd backend
docker-compose up -d

# 2. 啟動前端
cd ..
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env.local
npm install
npm run dev
```

### 方式 2: 手動啟動

詳見 [QUICKSTART.md](./QUICKSTART.md)

## 📦 安裝與運行

### 環境需求

**前端**:
- Node.js 18+
- npm 或 pnpm

**後端**:
- JDK 17+
- Maven 3.8+
- PostgreSQL 14+ / MySQL 8+ (或使用 Docker)

### 前端開發

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

### 後端開發

```bash
# 進入後端目錄
cd backend

# 使用 Maven 運行
mvn spring-boot:run

# 或編譯後運行
mvn clean package
java -jar target/migraine-care-system-1.0.0.jar
```

## 🧪 測試與代碼品質

### 運行測試
```bash
npm run test
```

### 測試覆蓋率
```bash
npm run test:coverage
```

### 代碼檢查
```bash
npm run lint
npm run format:check
```

### 自動修復
```bash
npm run lint:fix
npm run format
```

### 分析打包大小
```bash
npm run analyze
```

## 📁 專案結構

```
migraine-care-system/
├── frontend/              # React 前端
│   ├── App.tsx
│   ├── components/
│   ├── services/         # API 服務層
│   └── styles/
│
├── backend/              # Spring Boot 後端
│   ├── src/main/java/com/migraine/
│   │   ├── controller/  # REST API 控制器
│   │   ├── service/     # 業務邏輯層
│   │   ├── repository/  # 資料存取層
│   │   ├── entity/      # 資料模型
│   │   └── security/    # JWT 認證
│   └── pom.xml
│
├── QUICKSTART.md         # 快速開始指南
├── BACKEND_INTEGRATION.md # 前後端整合文檔
└── PROJECT_STRUCTURE.md  # 完整架構說明
```

詳細結構請參閱 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🌐 部署

### 前端部署 (GitHub Pages)

1. 修改 `vite.config.ts` 的 `base` 為 repository 名稱
2. 推送到 GitHub
3. 在 Settings > Pages 選擇 "GitHub Actions"
4. 等待自動部署完成

詳見 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 後端部署

#### Docker 部署（推薦）
```bash
cd backend
docker-compose up -d
```

#### JAR 部署
```bash
cd backend
mvn clean package
java -jar target/migraine-care-system-1.0.0.jar
```

詳見 [backend/README.md](./backend/README.md)

## 🔧 開發指南

### 前端開發
1. 在 `components/` 建立新組件
2. 使用 `services/api.ts` 調用後端 API
3. 遵循 ESLint 和 Prettier 規則
4. 提交前會自動運行 lint-staged

### 後端開發
1. 在 `controller/` 創建 REST API 端點
2. 在 `service/` 實現業務邏輯
3. 在 `repository/` 定義資料庫操作
4. 使用 JWT 進行身份驗證

### 前後端整合
詳見 [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

### API 文檔
後端 API 端點:
- `POST /api/auth/login` - 用戶登入
- `POST /api/auth/register` - 用戶註冊
- `GET /api/headache-logs/my-logs` - 獲取頭痛日誌
- `POST /api/health-scales` - 提交健康量表

完整 API 文檔請參閱 [backend/README.md](./backend/README.md)

## 📚 文檔

- [QUICKSTART.md](./QUICKSTART.md) - 5 分鐘快速開始
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - 前後端整合指南
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 完整專案架構
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南
- [backend/README.md](./backend/README.md) - 後端詳細文檔

## 📄 授權

MIT License

## 👨‍💻 開發者

偏頭痛個案照護系統開發團隊

## 🐛 問題回報

如有問題，請在 GitHub Issues 提出

---

**技術架構**: React 前端 + Java Spring Boot 後端 + PostgreSQL 資料庫
