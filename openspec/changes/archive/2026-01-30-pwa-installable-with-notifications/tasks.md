# 實作任務清單

## 1. 圖標資產準備

- [x] 1.1 在專案根目錄建立 `public/icons/` 資料夾
- [x] 1.2 將 Gemini 生成的圖片複製到工作目錄
- [x] 1.3 使用圖片工具將來源圖片縮放為 192x192，儲存為 `public/icons/icon-192.png`
- [x] 1.4 使用圖片工具將來源圖片縮放為 512x512，儲存為 `public/icons/icon-512.png`
- [x] 1.5 使用圖片工具將來源圖片縮放為 180x180，儲存為 `public/icons/icon-180.png`
- [x] 1.6 驗證三個圖標檔案尺寸正確且視覺效果良好

## 2. Manifest 配置檔

- [x] 2.1 在 `public/` 目錄建立 `manifest.json` 檔案
- [x] 2.2 設定 `name` 為「泡茶計時器」
- [x] 2.3 設定 `short_name` 為「泡茶」
- [x] 2.4 設定 `start_url` 為 "./"
- [x] 2.5 設定 `display` 為 "standalone"
- [x] 2.6 設定 `theme_color` 為 "#16a34a"
- [x] 2.7 設定 `background_color` 為 "#f0fdf4"
- [x] 2.8 設定 `icons` 陣列，包含 192x192 和 512x512 兩個圖標
- [x] 2.9 確認 JSON 格式正確，無語法錯誤

## 3. HTML Meta Tags 更新

- [x] 3.1 在 `index.html` 的 `<head>` 中加入 `<link rel="manifest" href="/manifest.json">`
- [x] 3.2 在 `<head>` 中加入 `<meta name="theme-color" content="#16a34a">`
- [x] 3.3 在 `<head>` 中加入 `<link rel="apple-touch-icon" href="/icons/icon-180.png">`
- [x] 3.4 更新 `<link rel="icon">` 指向 `/icons/icon-192.png`
- [x] 3.5 驗證所有連結路徑正確

## 4. 通知權限請求

- [x] 4.1 在 `src/App.vue` 的 `onMounted` 函數中加入通知權限檢查邏輯
- [x] 4.2 檢查瀏覽器是否支援 Notification API（`'Notification' in window`）
- [x] 4.3 檢查目前權限狀態（`Notification.permission`）
- [x] 4.4 若權限狀態為 `'default'`，呼叫 `Notification.requestPermission()`
- [x] 4.5 確保權限請求不會阻塞其他初始化邏輯

## 5. 通知發送邏輯

- [x] 5.1 在 `startCountdown` 函數的倒數邏輯中找到 `remainingSeconds.value <= 0` 的判斷區塊
- [x] 5.2 在該區塊中加入通知發送邏輯（在 `isTimeUp` 設定之後）
- [x] 5.3 檢查通知權限是否為 `'granted'`，若不是則跳過通知發送
- [x] 5.4 建立 `notificationTitle` 變數，設定為「泡茶時間到！」
- [x] 5.5 建立 `notificationBody` 變數，依據 `enableMultiSteep.value` 決定內容
- [x] 5.6 單泡模式：`notificationBody` 為「時間到了！」
- [x] 5.7 連續沖泡模式：`notificationBody` 為 `第 ${currentSteep.value} 泡已完成`
- [x] 5.8 使用 `new Notification(notificationTitle, options)` 建立通知物件
- [x] 5.9 設定通知 `options.body` 為 `notificationBody`
- [x] 5.10 設定通知 `options.icon` 為 `'/icons/icon-192.png'`
- [x] 5.11 設定通知 `options.vibrate` 為 `[200, 100, 200]`
- [x] 5.12 設定通知 `options.tag` 為 `'tea-timer'`
- [x] 5.13 設定通知 `options.requireInteraction` 為 `true`

## 6. 通知點擊行為

- [x] 6.1 在建立通知物件後，設定 `notification.onclick` 事件處理函數
- [x] 6.2 在 `onclick` 中呼叫 `window.focus()`，聚焦應用視窗
- [x] 6.3 在 `onclick` 中呼叫 `notification.close()`，關閉通知

## 7. Vite 配置檢查

- [x] 7.1 確認 `vite.config.js` 的 `base` 設定正確（應為 `'/tea-timer/'`）
- [x] 7.2 確認 `public/` 資料夾的檔案會被複製到建置輸出（Vite 預設行為）

## 8. 本地開發測試

- [x] 8.1 啟動開發伺服器（`npm run dev`）
- [x] 8.2 在 Chrome DevTools > Application > Manifest 檢查 manifest 是否載入成功
- [x] 8.3 檢查 manifest 各欄位數值是否正確
- [x] 8.4 檢查圖標是否正確顯示在 Manifest 檢視中
- [x] 8.5 測試通知權限請求是否在頁面載入時觸發
- [x] 8.6 授予通知權限後，開始計時並等待完成
- [x] 8.7 驗證計時完成時是否發送通知
- [x] 8.8 驗證通知標題、內容、圖標是否正確
- [x] 8.9 驗證裝置是否震動（若支援）
- [x] 8.10 點擊通知，驗證是否聚焦視窗並關閉通知

## 9. 單泡模式通知測試

- [ ] 9.1 取消勾選「啟用連續沖泡」
- [ ] 9.2 設定短時間（例如 10 秒）
- [ ] 9.3 開始計時並等待完成
- [ ] 9.4 驗證通知內容為「時間到了！」（不含泡數）

## 10. 連續沖泡模式通知測試

- [ ] 10.1 勾選「啟用連續沖泡」
- [ ] 10.2 設定第一泡時間為 10 秒，增量為 5 秒
- [ ] 10.3 開始第一泡計時並等待完成
- [ ] 10.4 驗證通知內容為「第 1 泡已完成」
- [ ] 10.5 開始第二泡計時並等待完成
- [ ] 10.6 驗證通知內容為「第 2 泡已完成」
- [ ] 10.7 驗證通知 tag 功能（第二泡通知應替換第一泡通知）

## 11. 通知權限被拒絕測試

- [ ] 11.1 在瀏覽器設定中拒絕通知權限或重置權限後拒絕
- [ ] 11.2 重新載入應用
- [ ] 11.3 開始計時並等待完成
- [ ] 11.4 驗證計時器正常運作（無通知發送）
- [ ] 11.5 驗證應用內的時間歸零狀態正確顯示
- [ ] 11.6 驗證無錯誤訊息或異常行為

## 12. PWA 安裝測試（Chrome/Edge Android）

- [x] 12.1 建置專案（`npm run build`）
- [x] 12.2 部署到 GitHub Pages 或本地 HTTPS 伺服器
- [x] 12.3 在 Android Chrome 開啟應用
- [x] 12.4 確認瀏覽器顯示「安裝」提示或選單中有「安裝應用程式」選項
- [x] 12.5 點擊安裝，確認安裝對話框顯示正確的應用名稱和圖標
- [x] 12.6 安裝後從桌面啟動應用
- [x] 12.7 驗證應用以 standalone 模式執行（無網址列）
- [x] 12.8 驗證主題色套用到系統 UI
- [x] 12.9 驗證應用功能正常（計時、通知）

## 13. iOS Safari 測試

- [ ] 13.1 在 iOS Safari 開啟應用
- [ ] 13.2 點選「分享」按鈕 > 「加入主畫面」
- [ ] 13.3 確認加入主畫面對話框顯示正確的應用名稱和圖標
- [ ] 13.4 加入後從主畫面啟動應用
- [ ] 13.5 驗證應用以全螢幕模式執行
- [ ] 13.6 測試通知功能（iOS 可能需要手動授權）

## 14. 跨瀏覽器相容性測試

- [ ] 14.1 在 Chrome 測試 manifest 和通知功能
- [ ] 14.2 在 Edge 測試 manifest 和通知功能
- [ ] 14.3 在 Firefox 測試通知功能（PWA 安裝支援度較低）
- [ ] 14.4 在 Safari (macOS) 測試通知功能

## 15. 部署與驗證

- [ ] 15.1 確認所有本地測試通過
- [ ] 15.2 執行 `npm run build` 建置專案
- [ ] 15.3 檢查 `dist/` 目錄是否包含 manifest.json 和 icons/
- [ ] 15.4 部署到 GitHub Pages
- [ ] 15.5 在線上環境測試安裝和通知功能
- [ ] 15.6 使用 Lighthouse PWA 檢測工具檢查 PWA 得分
- [ ] 15.7 確認 Lighthouse 通過「可安裝」檢測項目
