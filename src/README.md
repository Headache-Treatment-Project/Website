# 偏頭痛個案照護系統 (Migraine Care System)

一個完整的偏頭痛管理系統，提供病患、醫師與個案管理師使用。

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

- **前端框架**: React 18 + TypeScript
- **樣式**: Tailwind CSS 4.0
- **UI 組件**: Radix UI + shadcn/ui
- **圖表**: Recharts
- **後端**: Supabase (認證、資料庫、Edge Functions)
- **建構工具**: Vite
- **代碼品質**: ESLint + Prettier + Husky

## 📦 安裝與運行

### 環境需求
- Node.js 18+ 
- npm 或 pnpm

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 建構生產版本
```bash
npm run build
```

### 預覽生產版本
```bash
npm run preview
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
├── App.tsx                 # 主應用組件
├── main.tsx               # 應用入口
├── components/            # React 組件
│   ├── LoginPage.tsx
│   ├── PatientDashboard.tsx
│   ├── DoctorDashboard.tsx
│   ├── CaseManagerDashboard.tsx
│   ├── AboutPage.tsx
│   ├── ScaleQuestionnaires.tsx
│   └── ui/               # shadcn/ui 組件
├── styles/
│   └── globals.css       # 全域樣式
├── supabase/
│   └── functions/
│       └── server/       # Supabase Edge Functions
└── utils/
    └── supabase/         # Supabase 工具函數
```

## 🌐 部署到 GitHub Pages

### 1. 修改 vite.config.ts
將 `base` 改為您的 repository 名稱:
```typescript
base: '/your-repo-name/',
```

### 2. 推送到 GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. 啟用 GitHub Pages
1. 到 GitHub repository 的 Settings
2. 點選 Pages
3. Source 選擇 "GitHub Actions"
4. 等待自動部署完成

### 4. 訪問網站
`https://your-username.github.io/your-repo-name/`

## 🔧 開發指南

### 添加新功能
1. 在 `components/` 建立新組件
2. 在 `App.tsx` 中引入並使用
3. 遵循 ESLint 和 Prettier 規則
4. 提交前會自動運行 lint-staged

### Supabase 配置
1. 在 Supabase 專案中設定環境變數
2. 更新 `/utils/supabase/info.tsx` 中的配置

### 新增量表
在 `ScaleQuestionnaires.tsx` 中添加新的量表問卷和評分邏輯

## 📄 授權

MIT License

## 👨‍💻 開發者

偏頭痛個案照護系統開發團隊

## 🐛 問題回報

如有問題，請在 GitHub Issues 提出

---

**注意**: 這是使用 JavaScript/TypeScript (非 Java) 開發的 Web 應用程式
