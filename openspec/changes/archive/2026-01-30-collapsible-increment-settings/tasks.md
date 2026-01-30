# 實作任務清單

## 1. 狀態管理

- [x] 1.1 新增 `showIncrementSettings` ref，預設值為 `false`
- [x] 1.2 新增 `incrementLabel` computed，格式化按鈕文字（⚙️ 設定增量 (目前：X分Y秒)）
- [x] 1.3 實作 `toggleIncrementSettings` 函數，切換展開/收起狀態

## 2. localStorage 整合

- [x] 2.1 在 `onMounted` 中讀取 `teaTimerShowIncrementSettings` 鍵
- [x] 2.2 解析讀取值為 boolean，設定 `showIncrementSettings` 初始狀態
- [x] 2.3 在 `toggleIncrementSettings` 函數中儲存狀態到 localStorage
- [x] 2.4 實作容錯處理（try-catch），localStorage 失敗時記錄錯誤

## 3. 自動收起邏輯

- [x] 3.1 新增 `watch` 監聽 `enableMultiSteep` 變化
- [x] 3.2 實作邏輯：當 `enableMultiSteep` 變為 `false` 且 `showIncrementSettings` 為 `true` 時，將 `showIncrementSettings` 設為 `false`
- [x] 3.3 確保自動收起時同步更新 localStorage

## 4. UI 結構調整

- [x] 4.1 在連續沖泡區域頂部新增按鈕容器（flex, justify-between）
- [x] 4.2 將「啟用連續沖泡」勾選框放置在左側
- [x] 4.3 新增展開/收起按鈕，放置在右側
- [x] 4.4 設定按鈕的 `v-if` 條件為 `enableMultiSteep`
- [x] 4.5 設定按鈕文字動態綁定：`showIncrementSettings ? '▲ 收起' : incrementLabel`

## 5. 增量輸入區域摺疊

- [x] 5.1 將現有的增量輸入區域（分鐘、秒數欄位）包裹在新的 div 中
- [x] 5.2 設定新 div 的 `v-if` 條件為 `enableMultiSteep && showIncrementSettings`
- [x] 5.3 確保 `v-if` 為 `false` 時完全隱藏（不佔空間）

## 6. 按鈕樣式設計

- [x] 6.1 新增按鈕 class：`text-sm text-gray-600 hover:text-green-600`
- [x] 6.2 新增按鈕 class：`transition-colors px-3 py-1 rounded-lg hover:bg-white/50`
- [x] 6.3 確保按鈕使用 `cursor-pointer` 樣式
- [x] 6.4 設定按鈕 `@click` 事件為 `toggleIncrementSettings`

## 7. 計算屬性實作

- [x] 7.1 實作 `incrementLabel`，讀取 `incrementMinutes` 和 `incrementSeconds`
- [x] 7.2 格式化為「⚙️ 設定增量 (目前：X分Y秒)」字串
- [x] 7.3 確保分鐘和秒數為 0 時仍正確顯示（如「0分0秒」）

## 8. 函數實作

- [x] 8.1 實作 `toggleIncrementSettings` 函數
- [x] 8.2 在函數內切換 `showIncrementSettings.value`
- [x] 8.3 呼叫 localStorage.setItem 儲存新狀態（轉為字串）
- [x] 8.4 包裹 try-catch 處理 localStorage 錯誤

## 9. 初始化邏輯

- [x] 9.1 在 `onMounted` 中讀取 localStorage 鍵 `teaTimerShowIncrementSettings`
- [x] 9.2 檢查讀取值是否為 null（首次載入）
- [x] 9.3 若非 null，解析為 boolean 並設定 `showIncrementSettings.value`
- [x] 9.4 若為 null，使用預設值 `false`（已在 ref 初始化時設定）

## 10. Watch 實作

- [x] 10.1 新增 `watch(enableMultiSteep, (newValue) => { ... })`
- [x] 10.2 在 callback 中檢查 `!newValue && showIncrementSettings.value`
- [x] 10.3 若條件成立，設定 `showIncrementSettings.value = false`
- [x] 10.4 呼叫 localStorage.setItem 儲存新狀態

## 11. 測試與驗證

- [x] 11.1 測試預設狀態（首次載入時增量區域應為收起）
- [x] 11.2 測試展開功能（點擊按鈕後顯示輸入欄位）
- [x] 11.3 測試收起功能（點擊按鈕後隱藏輸入欄位）
- [x] 11.4 測試按鈕文字變化（收起時顯示目前值，展開時顯示「▲ 收起」）
- [x] 11.5 測試 localStorage 儲存（重新載入後保持上次狀態）
- [x] 11.6 測試自動收起（取消勾選連續沖泡時自動收起）
- [x] 11.7 測試按鈕顯示條件（未啟用連續沖泡時不顯示按鈕）
- [x] 11.8 測試增量輸入功能不變（展開後仍可正常輸入和驗證）
- [x] 11.9 測試手機螢幕（確認小螢幕下文字和佈局正常）
- [x] 11.10 測試 localStorage 容錯（禁用 localStorage 時功能仍可運作）
