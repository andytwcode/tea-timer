# storage-persistence (Delta Spec)

## MODIFIED Requirements

### Requirement: 儲存上次輸入的分鐘數
系統 SHALL 在使用者啟動倒數時，將第一泡的分鐘數儲存到 localStorage。

#### Scenario: 開始倒數時儲存分鐘數
- **WHEN** 使用者輸入第一泡時間為 3 分鐘並點擊「開始」
- **THEN** 系統將分鐘數 3 儲存到 localStorage 鍵 `teaTimerMinutes`

### Requirement: 儲存上次輸入的秒數
系統 SHALL 在使用者啟動倒數時，將第一泡的秒數儲存到 localStorage。

#### Scenario: 開始倒數時儲存秒數
- **WHEN** 使用者輸入第一泡時間為 30 秒並點擊「開始」
- **THEN** 系統將秒數 30 儲存到 localStorage 鍵 `teaTimerSeconds`

### Requirement: 載入時讀取上次的分鐘數
系統 SHALL 在頁面載入時從 localStorage 讀取上次儲存的第一泡分鐘數，並預填到分鐘輸入欄位。

#### Scenario: 載入頁面時恢復分鐘數
- **WHEN** 使用者重新開啟頁面
- **THEN** 系統從 localStorage 讀取上次的分鐘數並填入輸入欄位

#### Scenario: 首次載入無儲存資料
- **WHEN** 使用者首次開啟頁面且 localStorage 無資料
- **THEN** 系統使用預設分鐘數（例如 3）

### Requirement: 載入時讀取上次的秒數
系統 SHALL 在頁面載入時從 localStorage 讀取上次儲存的第一泡秒數，並預填到秒數輸入欄位。

#### Scenario: 載入頁面時恢復秒數
- **WHEN** 使用者重新開啟頁面
- **THEN** 系統從 localStorage 讀取上次的秒數並填入輸入欄位

#### Scenario: 首次載入無儲存資料
- **WHEN** 使用者首次開啟頁面且 localStorage 無資料
- **THEN** 系統使用預設秒數（例如 0）

### Requirement: 容錯處理 localStorage 錯誤
系統 SHALL 處理 localStorage 無法存取的情況，不影響核心功能運作。

#### Scenario: localStorage 被停用
- **WHEN** 使用者的瀏覽器禁用 localStorage
- **THEN** 系統仍可正常倒數，僅不記住偏好設定

#### Scenario: localStorage 讀取失敗
- **WHEN** 讀取 localStorage 時發生錯誤
- **THEN** 系統使用預設值（3 分鐘 0 秒）並繼續運作

### Requirement: 使用明確的鍵名儲存
系統 SHALL 使用明確的鍵名儲存資料，避免與其他應用程式衝突。

#### Scenario: 儲存第一泡時間
- **WHEN** 系統儲存第一泡的分鐘和秒數
- **THEN** 使用鍵名 `teaTimerMinutes` 和 `teaTimerSeconds`

#### Scenario: 儲存增量時間
- **WHEN** 系統儲存增量時間
- **THEN** 使用鍵名 `teaTimerIncrementMinutes` 和 `teaTimerIncrementSeconds`

#### Scenario: 儲存模式設定
- **WHEN** 系統儲存連續沖泡模式的開關狀態
- **THEN** 使用鍵名 `teaTimerMultiSteepEnabled`

## ADDED Requirements

### Requirement: 儲存增量分鐘數
系統 SHALL 在使用者啟動倒數時，將增量分鐘數儲存到 localStorage。

#### Scenario: 開始倒數時儲存增量分鐘數
- **WHEN** 使用者設定增量為 1 分鐘並點擊「開始」
- **THEN** 系統將增量分鐘數 1 儲存到 localStorage 鍵 `teaTimerIncrementMinutes`

### Requirement: 儲存增量秒數
系統 SHALL 在使用者啟動倒數時，將增量秒數儲存到 localStorage。

#### Scenario: 開始倒數時儲存增量秒數
- **WHEN** 使用者設定增量為 30 秒並點擊「開始」
- **THEN** 系統將增量秒數 30 儲存到 localStorage 鍵 `teaTimerIncrementSeconds`

### Requirement: 儲存連續沖泡模式開關
系統 SHALL 在使用者啟動倒數時，將連續沖泡模式的開關狀態儲存到 localStorage。

#### Scenario: 啟用連續沖泡時儲存狀態
- **WHEN** 使用者勾選連續沖泡並點擊「開始」
- **THEN** 系統將 `true` 儲存到 localStorage 鍵 `teaTimerMultiSteepEnabled`

#### Scenario: 未啟用連續沖泡時儲存狀態
- **WHEN** 使用者未勾選連續沖泡並點擊「開始」
- **THEN** 系統將 `false` 儲存到 localStorage 鍵 `teaTimerMultiSteepEnabled`

### Requirement: 載入時讀取增量分鐘數
系統 SHALL 在頁面載入時從 localStorage 讀取增量分鐘數，並預填到增量分鐘輸入欄位。

#### Scenario: 載入頁面時恢復增量分鐘數
- **WHEN** 使用者重新開啟頁面
- **THEN** 系統從 localStorage 讀取增量分鐘數並填入輸入欄位

#### Scenario: 首次載入無增量分鐘數資料
- **WHEN** 使用者首次開啟頁面且 localStorage 無增量資料
- **THEN** 系統使用預設增量分鐘數（0）

### Requirement: 載入時讀取增量秒數
系統 SHALL 在頁面載入時從 localStorage 讀取增量秒數，並預填到增量秒數輸入欄位。

#### Scenario: 載入頁面時恢復增量秒數
- **WHEN** 使用者重新開啟頁面
- **THEN** 系統從 localStorage 讀取增量秒數並填入輸入欄位

#### Scenario: 首次載入無增量秒數資料
- **WHEN** 使用者首次開啟頁面且 localStorage 無增量資料
- **THEN** 系統使用預設增量秒數（10）

### Requirement: 載入時讀取連續沖泡模式開關
系統 SHALL 在頁面載入時從 localStorage 讀取連續沖泡模式的開關狀態。

#### Scenario: 載入頁面時恢復模式開關
- **WHEN** 使用者重新開啟頁面
- **THEN** 系統從 localStorage 讀取模式開關狀態並更新勾選框

#### Scenario: 首次載入無模式開關資料
- **WHEN** 使用者首次開啟頁面且 localStorage 無模式資料
- **THEN** 系統使用預設值（未啟用，false）

### Requirement: 不儲存倒數進度和泡數
系統 SHALL NOT 儲存當前倒數進度和泡數計數器，每次載入頁面時從第 1 泡開始。

#### Scenario: 重新開啟頁面時重置進度
- **WHEN** 使用者在第 5 泡進行中關閉頁面後重新開啟
- **THEN** 系統從第 1 泡開始，不恢復第 5 泡的狀態
