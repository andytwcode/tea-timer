## Why

現有的 Tea Timer 僅支援單次倒數計時，但真實的泡茶場景通常需要多次沖泡，且每一泡的時間遞增（例如第一泡 30 秒、第二泡 40 秒、第三泡 50 秒）。使用者需要每次手動重新輸入時間，既繁瑣又容易出錯，影響品茶體驗。

## What Changes

- 新增「連續沖泡模式」勾選框，啟用後自動進入多泡計時流程
- 新增「增量秒數」輸入欄位，設定每泡遞增的時間
- 修改按鈕邏輯：完成一泡後顯示「開始第 X 泡（Y 秒）」和「結束沖泡」兩個按鈕
- 新增泡數追蹤顯示，讓使用者知道目前是第幾泡
- 支援無限制泡數，使用者決定何時結束
- 半自動模式：每泡完成後需手動確認才開始下一泡（在倒茶和加水間隙）
- localStorage 儲存增量設定和模式偏好，但不記憶當前泡數（每次開啟從第一泡開始）
- 智能兼容：增量為 0 時等同於原有的單次模式，保持向後兼容
- 分頁標題同步顯示當前泡數和時間

## Capabilities

### New Capabilities
- `multi-steep-control`: 連續沖泡的核心控制邏輯，包含泡數追蹤、自動計算下一泡時間、半自動流程管理
- `steep-counter`: 泡數追蹤與顯示，追蹤當前第幾泡、顯示泡數資訊、重置邏輯

### Modified Capabilities
- `timer-input`: 添加增量秒數輸入欄位和連續沖泡模式勾選框，驗證增量範圍
- `timer-control`: 修改按鈕行為以支援「開始下一泡」和「結束沖泡」，動態按鈕文字顯示
- `countdown-display`: 添加泡數狀態顯示（當前第幾泡、完成狀態提示）
- `storage-persistence`: 儲存和讀取增量秒數、連續模式開關狀態
- `tab-title-sync`: 在分頁標題中顯示當前泡數資訊

## Impact

- 修改檔案：`src/App.vue`（主要邏輯和 UI 大幅調整）
- localStorage 格式變更：新增 `teaTimerIncrement` 和 `teaTimerMultiSteepEnabled` 鍵
- 現有規格文件需要更新：`timer-input`、`timer-control`、`countdown-display`、`storage-persistence`、`tab-title-sync`
- UI 複雜度增加：新增勾選框、增量輸入、泡數顯示、雙按鈕佈局
- 狀態管理複雜度增加：新增 `currentSteep`、`isCompleted`、`enableMultiSteep`、`incrementSeconds` 等狀態
- 向後兼容性：增量為 0 時行為等同於現有版本，不影響現有使用者
- 無新增依賴項，純邏輯和 UI 調整
