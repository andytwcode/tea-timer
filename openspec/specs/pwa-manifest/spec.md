# pwa-manifest

## Purpose

定義 PWA（Progressive Web App）manifest 配置規格，使應用能被安裝到裝置桌面/主畫面。

## Requirements

### Requirement: 提供 Web App Manifest 配置檔
系統 SHALL 提供 manifest.json 檔案，定義 PWA 應用的基本資訊，使瀏覽器能夠觸發「安裝」提示。

#### Scenario: manifest.json 檔案存在
- **WHEN** 使用者瀏覽應用
- **THEN** 系統在 public/ 目錄下提供 manifest.json 檔案

#### Scenario: manifest 包含必要欄位
- **WHEN** 瀏覽器讀取 manifest.json
- **THEN** 檔案包含 name, short_name, start_url, display, theme_color, background_color, icons 等欄位

### Requirement: 定義應用名稱和簡稱
系統 SHALL 在 manifest 中定義完整應用名稱和簡短名稱，用於不同顯示情境。

#### Scenario: 完整名稱顯示
- **WHEN** 瀏覽器顯示安裝提示或應用資訊
- **THEN** 使用完整名稱「泡茶計時器」

#### Scenario: 簡稱顯示
- **WHEN** 裝置桌面圖標下方空間有限
- **THEN** 使用簡稱「泡茶」

### Requirement: 設定 standalone 顯示模式
系統 SHALL 將 display 設定為 "standalone"，使應用以全螢幕模式執行，不顯示瀏覽器 UI。

#### Scenario: 安裝後啟動為獨立應用
- **WHEN** 使用者從桌面圖標啟動已安裝的應用
- **THEN** 應用以全螢幕模式執行，不顯示網址列和瀏覽器控制列

#### Scenario: 保留系統導航列
- **WHEN** 應用以 standalone 模式執行
- **THEN** 保留系統狀態列和導航列（非 fullscreen 模式）

### Requirement: 定義主題色和背景色
系統 SHALL 設定 theme_color 和 background_color，統一應用視覺風格。

#### Scenario: 主題色套用到瀏覽器 UI
- **WHEN** 應用在瀏覽器中執行
- **THEN** 瀏覽器標題列/狀態列使用綠色主題色 #16a34a

#### Scenario: 背景色用於啟動畫面
- **WHEN** 使用者啟動已安裝的應用
- **THEN** 啟動畫面使用淡綠色背景 #f0fdf4

### Requirement: 設定應用起始 URL
系統 SHALL 將 start_url 設定為相對路徑 "./"，確保應用從正確位置啟動。

#### Scenario: 從圖標啟動應用
- **WHEN** 使用者點擊桌面圖標
- **THEN** 應用從 start_url 指定的路徑啟動

#### Scenario: 支援子路徑部署
- **WHEN** 應用部署在 /tea-timer/ 子路徑
- **THEN** 使用相對路徑確保啟動位置正確

### Requirement: 提供多尺寸應用圖標
系統 SHALL 提供 192x192 和 512x512 兩種尺寸的 PNG 圖標，滿足 Android PWA 安裝需求。

#### Scenario: 192x192 圖標用於桌面
- **WHEN** Android 裝置將應用加入桌面
- **THEN** 使用 192x192 圖標顯示在桌面上

#### Scenario: 512x512 圖標用於啟動畫面
- **WHEN** 應用啟動時顯示啟動畫面
- **THEN** 使用 512x512 高解析度圖標

#### Scenario: 圖標使用 PNG 格式
- **WHEN** manifest 定義圖標資產
- **THEN** 所有圖標使用 image/png 格式以確保相容性

### Requirement: 在 HTML 中連結 manifest
系統 SHALL 在 index.html 的 <head> 中加入 manifest 連結，讓瀏覽器能讀取 PWA 配置。

#### Scenario: HTML 包含 manifest 連結
- **WHEN** 瀏覽器載入 index.html
- **THEN** <head> 包含 <link rel="manifest" href="/manifest.json">

#### Scenario: manifest 路徑正確
- **WHEN** 瀏覽器請求 manifest.json
- **THEN** 檔案路徑正確，能成功載入

### Requirement: 提供 iOS 特定的圖標配置
系統 SHALL 提供 180x180 的 apple-touch-icon，支援 iOS Safari 將應用加入主畫面。

#### Scenario: iOS 裝置加入主畫面
- **WHEN** iOS Safari 使用者點選「加入主畫面」
- **THEN** 使用 apple-touch-icon 指定的 180x180 圖標

#### Scenario: HTML 包含 apple-touch-icon
- **WHEN** iOS Safari 載入應用
- **THEN** <head> 包含 <link rel="apple-touch-icon" href="/icons/icon-180.png">

### Requirement: 設定主題色 meta tag
系統 SHALL 在 HTML 中加入 theme-color meta tag，即使未安裝也能套用主題色。

#### Scenario: 瀏覽器套用主題色
- **WHEN** 使用者在瀏覽器中開啟應用（未安裝）
- **THEN** 瀏覽器 UI 使用 theme-color 指定的綠色

#### Scenario: theme-color 與 manifest 一致
- **WHEN** 檢查 HTML meta tag 和 manifest
- **THEN** theme-color 數值一致為 #16a34a
