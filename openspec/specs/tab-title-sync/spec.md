# tab-title-sync

## Purpose

定義瀏覽器分頁標題與倒數時間同步更新的規格。

## Requirements

### Requirement: 倒數進行時更新分頁標題
系統 SHALL 在倒數進行期間，每秒更新瀏覽器分頁標題以顯示剩餘時間。

#### Scenario: 倒數時標題顯示剩餘時間
- **WHEN** 倒數正在進行且剩餘時間為 3:00
- **THEN** 瀏覽器分頁標題顯示「[3:00] Tea Timer」

#### Scenario: 標題與顯示時間同步更新
- **WHEN** 剩餘時間從 2:30 變為 2:29
- **THEN** 分頁標題從「[2:30] Tea Timer」更新為「[2:29] Tea Timer」

### Requirement: 未倒數時顯示預設標題
系統 SHALL 在倒數未開始或已結束時，顯示預設的分頁標題。

#### Scenario: 頁面載入時的預設標題
- **WHEN** 頁面剛載入且尚未開始倒數
- **THEN** 分頁標題顯示「Tea Timer」

#### Scenario: 重置後恢復預設標題
- **WHEN** 使用者點擊「重置」按鈕停止倒數
- **THEN** 分頁標題恢復為「Tea Timer」

### Requirement: 倒數結束時標題顯示完成狀態
系統 SHALL 在倒數結束時，將分頁標題更新為完成狀態。

#### Scenario: 時間到達時標題顯示 0:00
- **WHEN** 倒數結束剩餘時間為 0:00
- **THEN** 分頁標題顯示「[0:00] Tea Timer」

#### Scenario: 完成後標題保持顯示
- **WHEN** 倒數結束且閃爍動畫播放完畢
- **THEN** 分頁標題持續顯示「[0:00] Tea Timer」直到使用者重置或重新開始

### Requirement: 標題格式與顯示時間一致
系統 SHALL 確保分頁標題中的時間格式與主顯示區域的時間格式一致（M:SS）。

#### Scenario: 標題時間格式
- **WHEN** 剩餘時間為 125 秒
- **THEN** 分頁標題顯示「[2:05] Tea Timer」，使用相同的 M:SS 格式

### Requirement: 標題文字簡潔明確
系統 SHALL 使用簡潔的標題文字「Tea Timer」，確保在有限的分頁空間中清晰顯示。

#### Scenario: 標題長度適中
- **WHEN** 系統設定分頁標題
- **THEN** 標題文字保持簡潔（例如「[3:00] Tea Timer」），不使用過長的描述
