# 生產環境部署前檢查清單

## ⚠️ 重要提示

此清單必須在部署到生產環境前**完整檢查**。任何未完成的項目都可能導致安全漏洞或系統故障。

## 🔐 安全性檢查

### JWT 配置

- [ ] JWT Secret **已更改**為強隨機密鑰（至少 256-bit）
  ```bash
  # 生成密鑰
  openssl rand -base64 64
  ```
- [ ] JWT Secret **已設定為環境變數**，未入庫
  ```bash
  export JWT_SECRET="your-production-secret-key"
  ```
- [ ] Access Token 過期時間 ≤ 1 小時（當前: 3600000ms）
- [ ] Refresh Token 過期時間 7-14 天（當前: 1209600000ms）
- [ ] Token 旋轉機制**已啟用**

### 資料庫安全

- [ ] 資料庫密碼**已更改**為強密碼
- [ ] 資料庫密碼**已設定為環境變數**
  ```bash
  export SPRING_DATASOURCE_PASSWORD="strong-db-password"
  ```
- [ ] 資料庫連接**僅允許內網訪問**
- [ ] 資料庫備份策略**已設定**
  - [ ] 每日全量備份
  - [ ] 異地備份存儲
  - [ ] 備份恢復測試通過

### CORS 配置

- [ ] `allowed-origins` **僅包含實際前端網域**
  ```yaml
  cors:
    allowed-origins: 
      - https://your-production-domain.com
      # ❌ 不要使用 http://localhost
      # ❌ 不要使用 * 通配符
  ```
- [ ] `allow-credentials` 設為 `true`
- [ ] 移除所有測試/開發網域

### HTTPS / SSL

- [ ] **已啟用 HTTPS**（生產環境必須）
- [ ] SSL 憑證**已安裝**且有效
- [ ] HTTP 自動重定向到 HTTPS
- [ ] HSTS Header 已設定
  ```java
  http.headers().httpStrictTransportSecurity()
      .maxAgeInSeconds(31536000)  // 1 年
      .includeSubDomains(true);
  ```

### 密碼政策

- [ ] 密碼最小長度 ≥ 8 字元
- [ ] BCrypt cost factor ≥ 12
- [ ] 密碼強度驗證（大小寫+數字+特殊字元）建議啟用
- [ ] 密碼重置流程已測試

## 📦 配置檢查

### 前端

- [ ] `vite.config.ts` 的 `base` 已改為正確的 repository 名稱
  ```typescript
  base: '/your-actual-repo-name/'
  ```
- [ ] `.env.production` 已創建並包含生產 API URL
  ```bash
  VITE_API_BASE_URL=https://api.your-domain.com
  ```
- [ ] 所有敏感資訊已移除（console.log、調試代碼）
- [ ] Source maps 已禁用或限制訪問
  ```typescript
  build: {
    sourcemap: false
  }
  ```

### 後端

- [ ] `application.yml` 中無明文敏感資訊
- [ ] 所有敏感配置使用環境變數
  ```yaml
  jwt:
    secret: ${JWT_SECRET}
  spring:
    datasource:
      password: ${DB_PASSWORD}
  ```
- [ ] H2 Console **已禁用**
  ```yaml
  spring:
    h2:
      console:
        enabled: false
  ```
- [ ] Spring Boot DevTools **已移除**（生產環境）
- [ ] Actuator 端點**僅對內網開放**或需要認證
  ```yaml
  management:
    endpoints:
      web:
        exposure:
          include: health,info
  ```

### 日誌配置

- [ ] 日誌等級設為 `INFO` 或 `WARN`
  ```yaml
  logging:
    level:
      com.migraine: INFO
      org.springframework: WARN
  ```
- [ ] 敏感資訊**不記錄**到日誌（密碼、Token）
- [ ] 日誌輪轉策略已設定
- [ ] 日誌集中管理（ELK/Splunk）建議啟用

## 🗄 資料庫檢查

### Schema 管理

- [ ] Flyway 遷移腳本已測試
- [ ] `ddl-auto` 設為 `validate`（不是 `update`）
  ```yaml
  spring:
    jpa:
      hibernate:
        ddl-auto: validate
  ```
- [ ] 所有索引已創建
- [ ] 資料庫字符集為 `UTF-8`

### 備份與恢復

- [ ] 自動備份已配置（每日）
- [ ] 備份保留策略已設定（30 天）
- [ ] 災難恢復計劃已制定
- [ ] RPO/RTO 已定義
  - RPO（Recovery Point Objective）: ≤ 15 分鐘
  - RTO（Recovery Time Objective）: ≤ 30 分鐘

### 性能優化

- [ ] 連接池已配置
  ```yaml
  spring:
    datasource:
      hikari:
        maximum-pool-size: 20
        minimum-idle: 5
  ```
- [ ] 慢查詢日誌已啟用
- [ ] 資料庫監控已設定

## 🚀 CI/CD 檢查

### GitHub Actions

- [ ] Secrets 已設定
  - [ ] `JWT_SECRET`
  - [ ] `DB_PASSWORD`
  - [ ] 其他敏感資訊
- [ ] 構建流程已測試
- [ ] 測試步驟已包含
- [ ] 部署到生產環境需要手動批准（建議）

### Docker

- [ ] Docker 鏡像已優化（多階段構建）
- [ ] 容器以非 root 用戶運行
- [ ] Health check 已設定
  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --spider http://localhost:8080/api/auth/health || exit 1
  ```
- [ ] 資源限制已設定
  ```yaml
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
  ```

## 🧪 測試檢查

### 功能測試

- [ ] 所有核心功能已測試
  - [ ] 用戶註冊/登入
  - [ ] Token 刷新機制
  - [ ] 頭痛日誌 CRUD
  - [ ] 健康量表提交
- [ ] 邊界情況已測試
- [ ] 錯誤處理已測試

### 性能測試

- [ ] 負載測試已完成（建議工具：JMeter, k6）
- [ ] 並發請求測試通過
- [ ] 響應時間符合要求（< 200ms for 90%）
- [ ] 資源使用在可接受範圍

### 安全測試

- [ ] SQL Injection 測試通過
- [ ] XSS 攻擊測試通過
- [ ] CSRF 測試通過
- [ ] 暴力破解防護測試通過

## 📊 監控與告警

### 應用監控

- [ ] APM 工具已設定（New Relic / DataDog / Prometheus）
- [ ] 關鍵指標已追蹤
  - [ ] API 響應時間
  - [ ] 錯誤率
  - [ ] Token 刷新頻率
  - [ ] 資料庫連接數
- [ ] 告警規則已設定
  - [ ] 錯誤率 > 1%
  - [ ] 響應時間 > 1 秒
  - [ ] CPU/Memory > 80%

### 錯誤追蹤

- [ ] Sentry / Rollbar 已設定
- [ ] 錯誤通知已配置（Email/Slack）
- [ ] 錯誤優先級已定義

### 日誌監控

- [ ] 集中式日誌管理已設定（ELK/Splunk）
- [ ] 關鍵事件已追蹤
  - [ ] 登入失敗
  - [ ] 401/403 錯誤
  - [ ] Token 異常活動

## 🌐 網絡與基礎設施

### 域名與 DNS

- [ ] 域名已註冊
- [ ] DNS 記錄已設定
  - [ ] A 記錄指向伺服器 IP
  - [ ] CNAME 記錄（如需要）
- [ ] TTL 設定合理（建議 300-3600）

### CDN（建議）

- [ ] CDN 已設定（CloudFlare / Cloudinary）
- [ ] 靜態資源通過 CDN 提供
- [ ] Cache 策略已配置

### 防火牆

- [ ] 僅開放必要端口
  - [ ] 80 (HTTP)
  - [ ] 443 (HTTPS)
  - [ ] 自定義應用端口（如需要）
- [ ] SSH 僅允許內網或 VPN
- [ ] 資料庫端口僅允許內網

## 📋 文檔與溝通

### 文檔

- [ ] API 文檔已更新（Swagger/OpenAPI）
- [ ] 部署文檔已更新
- [ ] 災難恢復手冊已準備
- [ ] 操作手冊已準備

### 團隊溝通

- [ ] 團隊成員已通知部署時間
- [ ] 用戶已通知（如有停機時間）
- [ ] 客服團隊已培訓新功能

### 回滾計劃

- [ ] 回滾腳本已準備
- [ ] 資料庫回滾計劃已制定
- [ ] 回滾觸發條件已定義
  - 錯誤率 > 5%
  - 響應時間 > 3 秒
  - 用戶投訴 > 10 件/小時

## 🎯 最終確認

### 部署前最後檢查

- [ ] 所有上述項目已完成
- [ ] 備份已創建（資料庫、代碼）
- [ ] 維護通知已發送（如需要）
- [ ] 團隊成員已待命（關鍵人員）
- [ ] 監控儀表板已打開

### 部署步驟

1. [ ] 通知用戶（如有停機）
2. [ ] 創建資料庫備份
3. [ ] 停止舊版本服務
4. [ ] 部署新版本
5. [ ] 運行 Flyway 遷移
6. [ ] 啟動新版本服務
7. [ ] 健康檢查通過
8. [ ] 煙霧測試通過
9. [ ] 監控 15-30 分鐘
10. [ ] 通知用戶部署完成

### 部署後檢查

- [ ] 所有核心功能正常
- [ ] 錯誤率正常（< 1%）
- [ ] 響應時間正常（< 200ms）
- [ ] CPU/Memory 使用正常（< 70%）
- [ ] 用戶可以正常登入
- [ ] Token 刷新機制正常
- [ ] 資料寫入/讀取正常

## 🆘 緊急聯絡

### 關鍵人員

| 角色 | 姓名 | 聯絡方式 |
|------|------|---------|
| 技術負責人 | | |
| 後端開發 | | |
| 前端開發 | | |
| DBA | | |
| DevOps | | |

### 緊急程序

1. **發現問題** → 立即通知技術負責人
2. **嚴重問題** → 執行回滾
3. **資料問題** → 從備份恢復
4. **持續監控** → 15-30 分鐘後再次確認

## 📝 簽核

### 部署審批

- [ ] 技術負責人簽核：__________ 日期：__________
- [ ] 產品負責人簽核：__________ 日期：__________
- [ ] 安全負責人簽核：__________ 日期：__________

### 部署記錄

- 部署時間：__________
- 部署版本：v2.1.0
- 部署人員：__________
- 備註：__________

---

## ⚡ 快速評分

計算您的準備度分數：

- 安全性檢查（20 項）：____ / 20
- 配置檢查（17 項）：____ / 17
- 資料庫檢查（11 項）：____ / 11
- CI/CD 檢查（8 項）：____ / 8
- 測試檢查（9 項）：____ / 9
- 監控與告警（9 項）：____ / 9
- 網絡與基礎設施（10 項）：____ / 10
- 文檔與溝通（8 項）：____ / 8
- 最終確認（21 項）：____ / 21

**總分**: ____ / 113

**評級**:
- 95-113 分: ✅ 優秀，可以部署
- 80-94 分: ⚠️ 良好，建議補完剩餘項目
- 60-79 分: ⚠️ 一般，有風險
- < 60 分: ❌ 不建議部署，需要大量改進

---

**文檔版本**: 1.0  
**最後更新**: 2025-11-03  
**適用版本**: v2.1.0

**重要提醒**: 
- ⚠️ 此清單是最低要求，非完整安全審計
- 🔒 生產環境安全無小事，寧可多檢查不可遺漏
- 📞 如有疑問，請諮詢安全專家
