# 部署指南 (Deployment Guide)

## 🚨 重要：修復 GitHub Pages 空白頁面問題

如果您的網站在 GitHub Pages 上顯示空白，請按照以下步驟操作：

### 步驟 1: 確認 vite.config.ts 的 base 設定

打開 `/vite.config.ts`，確認 `base` 欄位設定為您的 **repository 名稱**：

```typescript
export default defineConfig({
  // ⚠️ 改成您的 GitHub repository 名稱
  base: '/migraine-care-system/', 
  // 如果 repository 名稱是 "my-app"，就改成 '/my-app/'
});
```

### 步驟 2: 建立並推送代碼

```bash
# 安裝依賴
npm install

# 本地測試建構
npm run build
npm run preview

# 確認無誤後推送到 GitHub
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 步驟 3: 在 GitHub 啟用 Pages

1. 前往 GitHub repository
2. 點選 **Settings** (設定)
3. 左側選單找到 **Pages**
4. **Source** 改選 **GitHub Actions** (不是 Deploy from a branch)
5. 等待 GitHub Actions 自動建構和部署（約 2-5 分鐘）

### 步驟 4: 檢查部署狀態

1. 點選 repository 上方的 **Actions** 標籤
2. 查看最新的 workflow 執行狀態
3. 如果顯示綠色勾勾 ✅，代表部署成功
4. 如果顯示紅色叉叉 ❌，點進去查看錯誤訊息

### 步驟 5: 訪問網站

部署成功後，訪問：
```
https://您的用戶名.github.io/您的repository名稱/
```

例如：
```
https://johnsmith.github.io/migraine-care-system/
```

---

## 🔍 常見問題排查

### Q1: 網站顯示 404 Not Found
**原因**: `base` 設定錯誤

**解決方法**:
1. 確認 `vite.config.ts` 中的 `base: '/repository-name/'` 
2. repository 名稱要完全一致（區分大小寫）
3. 前後都要有斜線 `/`

### Q2: 網站顯示空白頁面
**原因**: 可能是以下幾種情況
1. `base` 路徑設定錯誤
2. JavaScript 未正確載入
3. 瀏覽器快取問題

**解決方法**:
```bash
# 1. 重新建構
npm run build

# 2. 檢查 dist/index.html 中的路徑
# 應該看到類似 <script type="module" src="/your-repo-name/assets/index-xxx.js">

# 3. 清除瀏覽器快取，或使用無痕模式訪問
```

### Q3: GitHub Actions 建構失敗
**原因**: 依賴安裝或建構錯誤

**解決方法**:
```bash
# 本地測試建構流程
npm ci          # 使用 ci 而非 install
npm run lint    # 檢查代碼
npm run build   # 建構

# 如果本地成功，推送到 GitHub
git push
```

### Q4: CSS 樣式沒有載入
**原因**: Tailwind CSS 未正確建構

**解決方法**:
確認 `styles/globals.css` 中有：
```css
@import "tailwindcss";
```

---

## 🛠 進階部署選項

### 選項 A: 使用自訂網域

1. 在 repository 根目錄建立 `public/CNAME` 文件
2. 內容填入您的網域名稱，例如：`migraine.example.com`
3. 在您的 DNS 設定中添加 CNAME 記錄指向 `your-username.github.io`
4. 推送到 GitHub

### 選項 B: 部署到 Vercel/Netlify

這些平台支援更簡單的部署流程，不需要設定 `base`：

**Vercel**:
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy
```

### 選項 C: 部署到 Supabase Hosting

由於已經使用 Supabase 作為後端，可以考慮使用 Supabase 的靜態網站託管功能。

---

## 📋 部署前檢查清單

- [ ] 已安裝所有依賴 (`npm install`)
- [ ] 本地開發模式正常 (`npm run dev`)
- [ ] 本地建構成功 (`npm run build`)
- [ ] 代碼檢查通過 (`npm run lint`)
- [ ] 格式檢查通過 (`npm run format:check`)
- [ ] `vite.config.ts` 的 `base` 設定正確
- [ ] Supabase 環境變數已設定
- [ ] GitHub Pages 的 Source 設為 "GitHub Actions"
- [ ] `.github/workflows/deploy.yml` 存在且正確

---

## 🔐 環境變數設定

如果您的應用需要環境變數（例如 API 金鑰），有兩種方式：

### 方式 1: GitHub Secrets (推薦)
1. 到 repository Settings > Secrets and variables > Actions
2. 新增 Repository secrets
3. 在 `.github/workflows/deploy.yml` 中使用：
```yaml
- name: Build
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

### 方式 2: 在代碼中硬編碼 (僅限公開資訊)
對於 Supabase 的 `publicAnonKey`，可以直接寫在 `/utils/supabase/info.tsx` 中，因為這是設計為公開的金鑰。

---

## 📞 需要協助？

如果按照以上步驟仍無法解決問題：

1. 檢查瀏覽器開發者工具的 Console 和 Network 標籤
2. 查看 GitHub Actions 的詳細錯誤日誌
3. 確認本地 `npm run build` 和 `npm run preview` 都能正常運行
4. 在 GitHub Issues 中提供詳細的錯誤訊息

---

**最後更新**: 2025-11-01
