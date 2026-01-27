# countdown-display

## Purpose

定義倒數計時顯示的規格，包含時間格式、更新頻率和顯示樣式。

## Requirements

### Requirement: 顯示格式為 M:SS
系統 SHALL 以「M:SS」格式顯示剩餘時間，其中 M 為分鐘數，SS 為兩位數的秒數。

#### Scenario: 顯示完整分鐘
- **WHEN** 剩餘時間為 180 秒
- **THEN** 系統顯示「3:00」

#### Scenario: 顯示分鐘和秒數
- **WHEN** 剩餘時間為 125 秒
- **THEN** 系統顯示「2:05」

#### Scenario: 顯示小於一分鐘
- **WHEN** 剩餘時間為 45 秒
- **THEN** 系統顯示「0:45」

#### Scenario: 秒數補零
- **WHEN** 剩餘時間為 61 秒
- **THEN** 系統顯示「1:01」（秒數自動補零）

### Requirement: 每秒更新顯示
系統 SHALL 每秒更新一次剩餘時間的顯示。

#### Scenario: 倒數進行中
- **WHEN** 倒數計時正在進行
- **THEN** 系統每秒減少 1 秒並更新顯示

#### Scenario: 連續更新
- **WHEN** 剩餘時間從 3:00 開始倒數
- **THEN** 系統依序顯示「3:00」→「2:59」→「2:58」...

### Requirement: 時間歸零時顯示 0:00
系統 SHALL 在倒數結束時顯示「0:00」。

#### Scenario: 倒數結束
- **WHEN** 剩餘時間從 1 秒變為 0 秒
- **THEN** 系統顯示「0:00」

### Requirement: 字體大小適中易讀
系統 SHALL 以足夠大的字體顯示倒數時間，確保使用者易於閱讀。

#### Scenario: 顯示倒數時間
- **WHEN** 系統顯示倒數時間
- **THEN** 字體大小應顯著大於輸入欄位和按鈕文字
