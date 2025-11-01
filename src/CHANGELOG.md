# 更新日誌 (Changelog)

本文檔記錄專案的所有重要變更。

## [2.0.0] - 2025-11-01

### 🎉 重大更新：前後端分離架構

從 Supabase 架構遷移到 **Java Spring Boot 後端** + **React 前端** 的前後端分離架構。

### ✨ 新增

#### 後端 (Java Spring Boot)

- **認證系統**
  - JWT Token 認證機制
  - BCrypt 密碼加密
  - 用戶註冊與登入 API
  - 角色權限控制（PATIENT, DOCTOR, CASE_MANAGER）

- **資料模型**
  - User 實體（用戶）
  - HeadacheLog 實體（頭痛日誌）
  - HealthScale 實體（健康量表）

- **REST API**
  - `/api/auth/*` - 認證 API
  - `/api/headache-logs/*` - 頭痛日誌 API
  - `/api/health-scales/*` - 健康量表 API

- **安全機制**
  - Spring Security 整合
  - CORS 跨域配置
  - JwtAuthenticationFilter
  - 自定義 UserDetailsService

- **資料庫**
  - JPA/Hibernate ORM
  - PostgreSQL/MySQL 支援
  - H2 開發資料庫支援
  - 完整的資料表結構與索引

- **部署**
  - Docker 容器化
  - docker-compose 編排
  - 多階段構建 Dockerfile
  - Maven 打包配置

#### 前端

- **API 服務層**
  - 統一的 API 調用封裝 (`services/api.ts`)
  - 自動 JWT Token 處理
  - 錯誤處理機制
  - TypeScript 類型定義

- **環境配置**
  - `.env.local` 環境變數支援
  - Vite 環境變數配置
  - 可切換後端 API 地址

- **代碼品質工具**
  - ESLint 配置完善
  - Prettier 格式化規則
  - Husky Git hooks
  - lint-staged 提交前檢查
  - Vitest 測試框架配置

#### 文檔系統

- **綜合文檔**
  - `QUICKSTART.md` - 5分鐘快速開始指南
  - `BACKEND_INTEGRATION.md` - 前後端整合完整教程
  - `PROJECT_STRUCTURE.md` - 詳細專案架構說明
  - `IMPLEMENTATION_SUMMARY.md` - 實作總結
  - `CHECKLIST.md` - 啟動檢查清單
  - `CHANGELOG.md` - 本更新日誌
  - `backend/README.md` - 後端詳細文檔

- **開發指南**
  - API 端點文檔
  - 資料庫設計說明
  - Docker 使用指南
  - 故障排查指南

### 🔄 變更

- **架構變更**
  - 從 Supabase Edge Functions 遷移到 Spring Boot
  - 從 Supabase Auth 遷移到 JWT 認證
  - 從 Supabase Database 遷移到 PostgreSQL/MySQL

- **技術棧更新**
  - 後端：Supabase → Java Spring Boot 3.2
  - 資料庫：Supabase PostgreSQL → 獨立 PostgreSQL
  - 認證：Supabase Auth → Spring Security + JWT

### 🗑 移除

- Supabase 相關依賴
  - `@supabase/supabase-js`
  - Supabase Edge Functions
  - Supabase Auth 相關代碼

### 📊 統計

- **新增 Java 代碼**: 24 個類，約 2,500 行
- **新增配置文件**: 9 個
- **新增文檔**: 6 個，約 9,800 字
- **API 端點**: 11 個

---

## [1.0.0] - 2025-10-XX

### ✨ 初始版本

#### 功能

- **三種用戶角色**
  - 病患儀表板
  - 醫師儀表板
  - 個管師儀表板

- **頭痛日誌系統**
  - 日誌創建
  - 日誌查看
  - 日誌編輯

- **8種健康量表**
  - MIDAS - 偏頭痛失能評估量表
  - HADS - 醫院焦慮憂鬱量表
  - BDI - 貝克憂鬱量表
  - PSQI - 匹茲堡睡眠品質量表
  - FSS - 疲勞嚴重度量表
  - WPI - 廣泛性疼痛指數
  - Allodynia Questionnaire - 異痛問卷
  - Perceived Stress Scale - 知覺壓力量表

- **UI/UX**
  - 醫療風格設計
  - 響應式布局
  - shadcn/ui 組件庫
  - Recharts 圖表

#### 技術棧

- React 18 + TypeScript
- Vite
- Tailwind CSS 4.0
- Supabase (後端)
- shadcn/ui

---

## 未來規劃

### v2.1.0 (計劃中)

#### 測試與品質
- [ ] 後端單元測試（JUnit）
- [ ] 前端組件測試（Vitest）
- [ ] API 整合測試
- [ ] E2E 測試（Playwright）

#### API 文檔
- [ ] Swagger/OpenAPI 整合
- [ ] 自動生成 API 文檔
- [ ] 互動式 API 測試頁面

#### 錯誤處理
- [ ] 統一錯誤響應格式
- [ ] 前端錯誤邊界
- [ ] 完善日誌記錄
- [ ] 錯誤追蹤系統（Sentry）

### v2.2.0 (計劃中)

#### 新功能
- [ ] 醫師評論系統
- [ ] 評論通知
- [ ] 用藥效果追蹤
- [ ] 症狀關聯分析

#### 數據分析
- [ ] 頭痛頻率趨勢圖
- [ ] 用藥效果分析
- [ ] 生活作息關聯分析
- [ ] 自定義報表

#### 個管師功能
- [ ] 高風險病患識別
- [ ] 自動回診提醒
- [ ] 批量訊息推送
- [ ] 病患分組管理

### v3.0.0 (遠期計劃)

#### 平台擴展
- [ ] React Native 移動應用
- [ ] 共用後端 API
- [ ] 離線支援
- [ ] 推播通知

#### AI 整合
- [ ] 頭痛預測模型
- [ ] 個性化建議
- [ ] 智能提醒
- [ ] 異常檢測

#### 企業功能
- [ ] 多租戶支援
- [ ] 資料隔離
- [ ] 權限細分
- [ ] 審計日誌
- [ ] 數據匯出

---

## 版本號規則

遵循 [語義化版本控制 2.0.0](https://semver.org/lang/zh-TW/)

格式: `主版本號.次版本號.修訂號`

- **主版本號**: 不相容的 API 修改
- **次版本號**: 向下相容的功能新增
- **修訂號**: 向下相容的問題修正

---

## 貢獻指南

如果您想為此專案貢獻代碼，請：

1. Fork 本專案
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

**最後更新**: 2025-11-01  
**當前版本**: 2.0.0
