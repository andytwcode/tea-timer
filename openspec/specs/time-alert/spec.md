# time-alert

## Purpose

定義時間到達時的視覺提醒機制，包含閃爍效果的規格。

## Requirements

### Requirement: 時間到達時文字閃爍
系統 SHALL 在倒數結束時（0:00），使倒數顯示文字閃爍提醒使用者。

#### Scenario: 倒數結束觸發閃爍
- **WHEN** 剩餘時間到達 0:00
- **THEN** 系統開始執行文字閃爍動畫

### Requirement: 閃爍次數為 5 次
系統 SHALL 使文字閃爍 5 次後停止。

#### Scenario: 完成 5 次閃爍
- **WHEN** 閃爍動畫開始
- **THEN** 系統執行 5 次完整的閃爍循環後停止

### Requirement: 閃爍效果為透明度變化
系統 SHALL 透過調整文字透明度實現閃爍效果（opacity 在 1 和 0.2 之間切換）。

#### Scenario: 閃爍時透明度變化
- **WHEN** 閃爍動畫執行中
- **THEN** 文字透明度在完全可見（opacity: 1）和半透明（opacity: 0.2）之間交替

### Requirement: 閃爍速度適中
系統 SHALL 設定每次閃爍循環（一次淡出+淡入）的時長為 0.5 秒。

#### Scenario: 閃爍速度
- **WHEN** 文字閃爍
- **THEN** 每次完整的淡出淡入循環持續約 0.5 秒

### Requirement: 僅視覺提醒
系統 SHALL 僅提供視覺提醒，不包含音效或震動。

#### Scenario: 時間到達時無音效
- **WHEN** 倒數結束
- **THEN** 系統不播放任何音效

#### Scenario: 時間到達時無震動
- **WHEN** 倒數結束
- **THEN** 系統不觸發任何震動
