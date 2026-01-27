# storage-persistence

## Purpose

定義使用 localStorage 儲存和讀取使用者偏好設定的規格。

## Requirements

### Requirement: 儲存上次輸入的分鐘數
系統 SHALL 在使用者啟動倒數時，將分鐘數儲存到 localStorage。

#### Scenario: 開始倒數時儲存分鐘數
- **WHEN** 使用者輸入 3 分鐘並點擊「開始」
- **THEN** 系統將分鐘數 3 儲存到 localStorage

### Requirement: 儲存上次輸入的秒數
系統 SHALL 在使用者啟動倒數時，將秒數儲存到 localStorage。

#### Scenario: 開始倒數時儲存秒數
- **WHEN** 使用者輸入 30 秒並點擊「開始」
- **THEN** 系統將秒數 30 儲存到 localStorage

### Requirement: 載入時讀取上次的分鐘數
系統 SHALL 在頁面載入時從 localStorage 讀取上次儲存的分鐘數，並預填到分鐘輸入欄位。

#### Scenario: 載入頁面時恢復分鐘數
- **WHEN** 使用者重新開啟頁面
- **THEN** 系統從 localStorage 讀取上次的分鐘數並填入輸入欄位

#### Scenario: 首次載入無儲存資料
- **WHEN** 使用者首次開啟頁面且 localStorage 無資料
- **THEN** 系統使用預設分鐘數（例如 3）

### Requirement: 載入時讀取上次的秒數
系統 SHALL 在頁面載入時從 localStorage 讀取上次儲存的秒數，並預填到秒數輸入欄位。

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
系統 SHALL 使用明確的鍵名（例如 `teaTimerMinutes` 和 `teaTimerSeconds`）儲存資料，避免與其他應用程式衝突。

#### Scenario: 儲存時使用專屬鍵名
- **WHEN** 系統儲存分鐘和秒數
- **THEN** 使用鍵名 `teaTimerMinutes` 和 `teaTimerSeconds`
