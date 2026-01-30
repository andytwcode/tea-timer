# Proposal: PWA 可安裝性與通知功能

## Why

泡茶計時器目前是純網頁應用，使用者每次需要透過瀏覽器開啟。為了提升使用體驗，使用者希望能將應用「安裝」到手機或桌面，像原生 app 一樣快速啟動並全螢幕使用。同時，計時完成時需要明確的通知提醒（震動 + 音效），讓使用者在做其他事情時也能及時注意到泡茶時間已到。

## What Changes

- 新增 PWA manifest.json 配置檔，定義應用名稱、圖標、主題色等安裝資訊
- 新增多尺寸應用圖標資產（192x192, 512x512, 180x180），支援 Android/iOS 安裝需求
- 在 index.html 加入 manifest 連結和 PWA 相關 meta tags（theme-color, apple-touch-icon）
- 實作前景通知功能：應用啟動時請求通知權限，計時完成時發送系統通知
- 通知內容依據單泡或連續沖泡模式顯示不同訊息，並包含震動回饋
- 通知點擊後聚焦應用視窗

## Capabilities

### New Capabilities

- `pwa-manifest`：定義 PWA 可安裝性配置，包含應用資訊、圖標、顯示模式和主題色
- `notification-system`：管理系統通知權限和通知發送，包含計時完成通知邏輯

### Modified Capabilities

- `timer-countdown`：倒數計時功能需整合通知發送邏輯，在計時完成時（remainingSeconds = 0）觸發通知

## Impact

**檔案變更：**
- `public/manifest.json`（新增）：PWA 配置檔
- `public/icons/`（新增）：圖標資產資料夾，包含多尺寸 PNG 檔案
- `index.html`（修改）：新增 manifest 連結和 PWA meta tags
- `src/App.vue`（修改）：加入通知權限請求和計時完成通知邏輯

**使用者體驗：**
- 瀏覽器會顯示「安裝」提示，使用者可將應用加入主畫面/桌面
- 安裝後應用以全螢幕模式執行，無瀏覽器 UI（類原生 app 體驗）
- 計時完成時發送系統通知，使用者即使切換到其他應用也能收到提醒

**技術依賴：**
- 無新增 npm 依賴
- 依賴瀏覽器原生 Notification API（主流瀏覽器皆支援）
- 不使用 Service Worker（簡化實作，前景通知即可滿足需求）

**瀏覽器支援：**
- PWA 安裝：Chrome/Edge (Android/Desktop)、Safari (iOS/macOS)
- 通知 API：所有現代瀏覽器（需使用者授權）
