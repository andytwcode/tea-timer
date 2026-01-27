## 1. 專案初始化

- [x] 1.1 使用 Vite 創建 Vue 3 專案：`npm create vite@latest . -- --template vue`
- [x] 1.2 安裝 Tailwind CSS 依賴：`npm install -D tailwindcss postcss autoprefixer`
- [x] 1.3 初始化 Tailwind 配置：`npx tailwindcss init -p`
- [x] 1.4 配置 `tailwind.config.js` 內容路徑和自訂閃爍動畫
- [x] 1.5 在 `src/style.css` 中引入 Tailwind 指令
- [x] 1.6 清理專案預設檔案（移除範例組件和樣式）

## 2. 基礎 UI 結構

- [x] 2.1 在 `App.vue` 建立主要 HTML 結構（輸入區、顯示區、按鈕區）
- [x] 2.2 使用 Tailwind 實現基礎排版和間距
- [x] 2.3 建立分鐘數輸入欄位，設定 `type="number"` 和範圍限制
- [x] 2.4 建立秒數輸入欄位，設定 `type="number"` 和範圍限制
- [x] 2.5 建立倒數時間顯示區域，使用較大字體
- [x] 2.6 建立「開始」按鈕
- [x] 2.7 建立「重置」按鈕

## 3. Vue 狀態管理

- [x] 3.1 使用 `ref` 定義分鐘數狀態 `minutes`
- [x] 3.2 使用 `ref` 定義秒數狀態 `seconds`
- [x] 3.3 使用 `ref` 定義剩餘秒數狀態 `remainingSeconds`
- [x] 3.4 使用 `ref` 定義倒數運行狀態 `isRunning`
- [x] 3.5 使用 `ref` 定義初始總秒數狀態 `initialSeconds`
- [x] 3.6 使用 `ref` 定義時間到達狀態 `isTimeUp`
- [x] 3.7 使用 `computed` 計算總秒數 `totalSeconds = minutes * 60 + seconds`
- [x] 3.8 使用 `computed` 驗證時間有效性 `isValid = totalSeconds >= 5 && totalSeconds <= 600`
- [x] 3.9 使用 `computed` 計算顯示時間格式 `displayTime` (M:SS)

## 4. 輸入驗證功能

- [x] 4.1 使用 `v-model.number` 雙向綁定分鐘和秒數
- [x] 4.2 實現分鐘數範圍限制（0-10）
- [x] 4.3 實現秒數範圍限制（0-59）
- [x] 4.4 實現總時長驗證（5-600 秒）
- [x] 4.5 當輸入無效時顯示錯誤訊息（使用 `v-if` 和 `isValid`）
- [x] 4.6 當輸入無效時禁用「開始」按鈕

## 5. 倒數計時邏輯

- [x] 5.1 實現 `startCountdown` 函式：初始化 `remainingSeconds` 和 `initialSeconds`
- [x] 5.2 在 `startCountdown` 中設定 `isRunning = true`
- [x] 5.3 使用 `setInterval` 每秒執行倒數邏輯
- [x] 5.4 每秒減少 `remainingSeconds` 並檢查是否到達 0
- [x] 5.5 當倒數到 0 時清除 interval 並設定 `isTimeUp = true`
- [x] 5.6 實現 `resetCountdown` 函式：停止 interval，恢復初始時間
- [x] 5.7 重置時清除 `isRunning` 和 `isTimeUp` 狀態
- [x] 5.8 將「開始」按鈕綁定到 `startCountdown` 函式（使用 `@click`）
- [x] 5.9 將「重置」按鈕綁定到 `resetCountdown` 函式

## 6. 倒數顯示實作

- [x] 6.1 在 `displayTime` computed 中實現 M:SS 格式轉換
- [x] 6.2 確保秒數自動補零（使用 `padStart(2, '0')`）
- [x] 6.3 將 `displayTime` 綁定到顯示區域（使用雙大括號或 `v-text`）
- [x] 6.4 使用 Tailwind 設定顯示文字大小（例如 `text-6xl` 或 `text-7xl`）
- [x] 6.5 測試不同時間值的顯示格式（3:00、2:05、0:45 等）

## 7. 視覺提醒實作

- [x] 7.1 在 `tailwind.config.js` 定義 `blink` keyframes（opacity 1 ↔ 0.2）
- [x] 7.2 在 `tailwind.config.js` 定義 `animate-blink` 動畫（0.5s，5 次）
- [x] 7.3 使用 `:class` 動態綁定 `animate-blink` 到 `isTimeUp` 狀態
- [x] 7.4 測試閃爍效果：確保倒數到 0 時文字閃爍 5 次

## 8. 按鈕控制邏輯

- [x] 8.1 使用 `:disabled` 綁定「開始」按鈕到 `!isValid || isRunning`
- [x] 8.2 為禁用按鈕添加視覺樣式（例如 `disabled:opacity-50 disabled:cursor-not-allowed`）
- [x] 8.3 測試開始按鈕：倒數中應禁用
- [x] 8.4 測試重置按鈕：倒數中點擊應停止並恢復時間

## 9. localStorage 持久化

- [x] 9.1 在 `startCountdown` 中儲存分鐘數到 localStorage（鍵名 `teaTimerMinutes`）
- [x] 9.2 在 `startCountdown` 中儲存秒數到 localStorage（鍵名 `teaTimerSeconds`）
- [x] 9.3 在 `onMounted` 生命週期鉤子中讀取 localStorage
- [x] 9.4 如果讀取成功，更新 `minutes` 和 `seconds` 狀態
- [x] 9.5 如果讀取失敗或無資料，使用預設值（3 分鐘 0 秒）
- [x] 9.6 添加 `try-catch` 處理 localStorage 錯誤（停用或配額滿）
- [x] 9.7 測試資料持久化：重新載入頁面應恢復上次輸入

## 10. 分頁標題同步

- [x] 10.1 在倒數進行中，每秒更新 `document.title` 為 `[M:SS] Tea Timer`
- [x] 10.2 在 `setInterval` 內同時更新標題和剩餘秒數
- [x] 10.3 當倒數停止或重置時，恢復標題為 `Tea Timer`
- [x] 10.4 當倒數到 0 時，標題顯示 `[0:00] Tea Timer`
- [x] 10.5 在 `onMounted` 時設定初始標題為 `Tea Timer`
- [x] 10.6 測試標題同步：切換到其他分頁應能看到時間變化

## 11. 樣式優化

- [x] 11.1 使用 Tailwind 實現整體居中佈局（例如 `flex items-center justify-center min-h-screen`）
- [x] 11.2 設定合適的色彩主題（背景、文字、按鈕）
- [x] 11.3 為輸入欄位添加邊框和圓角樣式
- [x] 11.4 為按鈕添加 hover 和 active 狀態樣式
- [x] 11.5 調整間距和留白，確保視覺舒適
- [x] 11.6 確保錯誤訊息有明顯的紅色樣式
- [x] 11.7 測試極簡美學：確保介面乾淨、專注

## 12. 測試與驗證

- [x] 12.1 測試輸入驗證：少於 5 秒應顯示錯誤
- [x] 12.2 測試輸入驗證：超過 600 秒應顯示錯誤
- [x] 12.3 測試倒數功能：從 3:00 倒數到 0:00
- [x] 12.4 測試重置功能：倒數中重置應恢復初始時間
- [x] 12.5 測試閃爍提醒：到 0:00 時應閃爍 5 次
- [x] 12.6 測試 localStorage：重新載入應保留上次設定
- [x] 12.7 測試分頁標題：倒數時標題應同步更新
- [x] 12.8 測試邊界情況：0 分 5 秒、10 分 0 秒
- [x] 12.9 測試按鈕狀態：倒數中開始按鈕應禁用
- [x] 12.10 在不同瀏覽器測試基本功能（Chrome、Firefox、Edge）

## 13. 部署準備

- [x] 13.1 執行 `npm run build` 生成生產版本
- [x] 13.2 執行 `npm run preview` 預覽構建結果
- [x] 13.3 確認 `dist/` 目錄包含所有必要檔案
- [x] 13.4 設定部署目標（GitHub Pages / Netlify / Vercel）
- [x] 13.5 配置部署流程（手動上傳或 CI/CD）
- [x] 13.6 部署到線上環境
- [x] 13.7 驗證線上版本所有功能正常運作
- [x] 13.8 添加 README.md 說明專案用途和使用方式
