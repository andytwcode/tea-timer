# notification-system

## Purpose

定義系統通知功能規格，在計時完成時提醒使用者。

## Requirements

### Requirement: 在應用啟動時請求通知權限
系統 SHALL 在應用載入完成（onMounted）時檢查並請求瀏覽器通知權限。

#### Scenario: 首次載入時請求權限
- **WHEN** 使用者首次開啟應用且通知權限狀態為 default
- **THEN** 系統顯示瀏覽器通知權限請求對話框

#### Scenario: 已授權時不重複請求
- **WHEN** 使用者已授予通知權限
- **THEN** 系統不再顯示權限請求對話框

#### Scenario: 已拒絕時不重複請求
- **WHEN** 使用者已拒絕通知權限
- **THEN** 系統不再顯示權限請求對話框

#### Scenario: 瀏覽器不支援通知 API
- **WHEN** 瀏覽器不支援 Notification API
- **THEN** 系統不請求權限，不影響其他功能運作

### Requirement: 計時完成時發送系統通知
系統 SHALL 在倒數計時完成時（remainingSeconds = 0）發送系統通知，提醒使用者泡茶時間已到。

#### Scenario: 單泡模式計時完成發送通知
- **WHEN** 單泡模式倒數完成且通知權限已授予
- **THEN** 系統發送標題為「泡茶時間到！」、內容為「時間到了！」的通知

#### Scenario: 連續沖泡模式計時完成發送通知
- **WHEN** 連續沖泡模式第 3 泡倒數完成且通知權限已授予
- **THEN** 系統發送標題為「泡茶時間到！」、內容為「第 3 泡已完成」的通知

#### Scenario: 通知權限被拒絕時不發送
- **WHEN** 倒數完成但使用者已拒絕通知權限
- **THEN** 系統不發送通知，應用其他功能正常運作

#### Scenario: 通知權限未決時不發送
- **WHEN** 倒數完成但使用者尚未授予或拒絕通知權限
- **THEN** 系統不發送通知

### Requirement: 通知包含應用圖標
系統 SHALL 在通知中顯示應用圖標，增強品牌識別度。

#### Scenario: 通知顯示應用圖標
- **WHEN** 系統發送計時完成通知
- **THEN** 通知包含 icon 參數，指向 /icons/icon-192.png

#### Scenario: 圖標路徑正確
- **WHEN** 通知嘗試載入圖標
- **THEN** 圖標檔案存在且路徑正確

### Requirement: 通知包含震動回饋
系統 SHALL 在發送通知時觸發震動回饋，增強提醒效果（支援震動的裝置）。

#### Scenario: 通知觸發震動
- **WHEN** 系統發送計時完成通知
- **THEN** 通知包含 vibrate 參數，震動模式為 [200, 100, 200]（震動 200ms，暫停 100ms，震動 200ms）

#### Scenario: 不支援震動的裝置優雅降級
- **WHEN** 裝置不支援震動功能
- **THEN** 通知正常顯示，僅無震動效果

### Requirement: 通知設定為需手動關閉
系統 SHALL 設定通知為 requireInteraction: true，確保使用者不會錯過提醒。

#### Scenario: 通知不自動消失
- **WHEN** 系統發送計時完成通知
- **THEN** 通知設定 requireInteraction: true，使用者需手動關閉

#### Scenario: 確保使用者注意到
- **WHEN** 通知顯示後經過數秒
- **THEN** 通知仍然顯示在通知列，未自動消失

### Requirement: 點擊通知時聚焦應用視窗
系統 SHALL 在使用者點擊通知時，將應用視窗帶到前景並關閉通知。

#### Scenario: 點擊通知聚焦視窗
- **WHEN** 使用者點擊計時完成通知
- **THEN** 應用視窗聚焦到前景（window.focus()）

#### Scenario: 點擊通知後關閉通知
- **WHEN** 使用者點擊計時完成通知
- **THEN** 通知自動關閉，不留在通知列

#### Scenario: 應用已在前景
- **WHEN** 使用者點擊通知但應用已在前景
- **THEN** 保持在應用視窗，通知關閉

### Requirement: 通知使用唯一 tag 避免堆積並重新提醒
系統 SHALL 設定通知 tag 為 "tea-timer" 避免堆積，並設定 renotify: true 確保每次替換時都重新播放聲音和震動。

#### Scenario: 相同 tag 的通知替換舊通知
- **WHEN** 第 2 泡完成發送通知後，第 3 泡也完成
- **THEN** 第 3 泡的通知替換第 2 泡的通知，通知列不堆積多個通知

#### Scenario: 替換通知時重新提醒
- **WHEN** 新通知替換舊通知（相同 tag）
- **THEN** 播放通知聲音和震動，不會靜默替換

#### Scenario: tag 統一為 tea-timer
- **WHEN** 系統發送任何計時完成通知
- **THEN** 通知的 tag 參數設定為 "tea-timer"

### Requirement: 通知內容依據模式動態調整
系統 SHALL 根據單泡或連續沖泡模式，動態調整通知的內容文字。

#### Scenario: 單泡模式通知內容簡潔
- **WHEN** 單泡模式倒數完成
- **THEN** 通知內容為「時間到了！」，不包含泡數資訊

#### Scenario: 連續模式通知包含泡數
- **WHEN** 連續沖泡模式第 5 泡倒數完成
- **THEN** 通知內容為「第 5 泡已完成」，明確標示泡數

#### Scenario: 通知標題統一
- **WHEN** 任何模式倒數完成
- **THEN** 通知標題統一為「泡茶時間到！」

### Requirement: 優雅處理權限被拒絕的情況
系統 SHALL 在通知權限被拒絕時，不影響計時器核心功能運作。

#### Scenario: 權限被拒絕仍可計時
- **WHEN** 使用者拒絕通知權限並開始計時
- **THEN** 計時器正常運作，倒數正確進行

#### Scenario: 權限被拒絕不顯示錯誤
- **WHEN** 使用者拒絕通知權限
- **THEN** 系統不顯示錯誤訊息，不影響 UI 呈現

#### Scenario: 計時完成時視覺提示仍顯示
- **WHEN** 通知權限被拒絕且倒數完成
- **THEN** 應用內的視覺提示（時間歸零、isTimeUp 狀態）仍正常顯示

### Requirement: 不在通知中加入互動按鈕
系統 SHALL NOT 在通知中加入互動按鈕（如「開始下一泡」），保持實作簡單。

#### Scenario: 通知不包含 actions
- **WHEN** 系統發送計時完成通知
- **THEN** 通知不包含 actions 參數

#### Scenario: 使用者需回到應用操作
- **WHEN** 連續沖泡模式完成且使用者想開始下一泡
- **THEN** 使用者需點擊通知回到應用，在應用內操作

### Requirement: 使用 Service Worker 發送通知以支援跨平台
系統 SHALL 使用 Service Worker 的 showNotification() 方法發送通知，確保 Android Chrome 等平台的相容性。桌面瀏覽器可使用 Notification API 作為 fallback。

#### Scenario: Android Chrome 使用 Service Worker 通知
- **WHEN** 系統在 Android Chrome 需發送計時完成通知
- **THEN** 透過 Service Worker 的 registration.showNotification() 發送通知

#### Scenario: 桌面瀏覽器可使用直接通知
- **WHEN** 系統在桌面瀏覽器（Chrome/Firefox/Edge）需發送通知
- **THEN** 可使用 new Notification() 或 Service Worker 通知

#### Scenario: Service Worker 未就緒時優雅降級
- **WHEN** Service Worker 尚未啟動但需發送通知
- **THEN** 使用 new Notification() fallback（若平台支援）

#### Scenario: 註冊 Service Worker
- **WHEN** 應用初始化時
- **THEN** 註冊 Service Worker 以支援通知功能

#### Scenario: 前景通知限制
- **WHEN** 使用者關閉應用分頁
- **THEN** 無法發送通知（接受的限制，符合使用情境）
