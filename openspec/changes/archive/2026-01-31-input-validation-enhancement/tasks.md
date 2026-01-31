# Implementation Tasks

## 1. 創建 useValidation Composable

- [x] 1.1 創建 `src/composables/useValidation.js` 檔案
- [x] 1.2 匯出 `useValidation` 函式，接受 `timer` 和 `multiSteep` 參數
- [x] 1.3 實作 `firstBrewValidation` computed - 驗證第一泡分鐘數和秒數
- [x] 1.4 實作 `incrementValidation` computed - 驗證增量時間（僅在啟用連續沖泡時）
- [x] 1.5 實作 `validationResult` computed - 合併所有驗證結果並排序優先級
- [x] 1.6 回傳 `validationResult` 物件，包含 `isValid`、`primaryError`、`incrementError`、`hasFieldError()` 方法

## 2. 實作第一泡分鐘數驗證

- [x] 2.1 檢查 `timer.minutes.value < 0` - 錯誤訊息「分鐘數不可為負數」
- [x] 2.2 檢查 `timer.minutes.value > 10` - 錯誤訊息「分鐘數不可超過 10」
- [x] 2.3 分鐘數驗證失敗時，設定 `fieldErrors.minutes = true`
- [x] 2.4 分鐘數驗證錯誤優先級設為 1

## 3. 實作第一泡秒數驗證

- [x] 3.1 檢查 `timer.seconds.value < 0` - 錯誤訊息「秒數不可為負數」
- [x] 3.2 檢查 `timer.seconds.value > 59` - 錯誤訊息「秒數不可超過 59」
- [x] 3.3 秒數驗證失敗時，設定 `fieldErrors.seconds = true`
- [x] 3.4 秒數驗證錯誤優先級設為 1

## 4. 實作第一泡總時間驗證

- [x] 4.1 計算 `totalSeconds = timer.totalSeconds.value`
- [x] 4.2 只在欄位級別驗證都通過時才檢查總時間
- [x] 4.3 檢查 `totalSeconds > 0 && (totalSeconds < 5 || totalSeconds > 600)`
- [x] 4.4 總時間驗證失敗時，錯誤訊息「第一泡時間必須在 5 秒到 10 分鐘之間」
- [x] 4.5 總時間驗證失敗時，設定 `fieldErrors.minutes = true` 和 `fieldErrors.seconds = true`
- [x] 4.6 總時間驗證錯誤優先級設為 2

## 5. 實作增量分鐘數驗證

- [x] 5.1 檢查 `multiSteep.enableMultiSteep.value` 是否為 true
- [x] 5.2 檢查 `multiSteep.incrementMinutes.value < 0` - 錯誤訊息「增量分鐘數不可為負數」
- [x] 5.3 增量分鐘數驗證失敗時，設定 `fieldErrors.incrementMinutes = true`
- [x] 5.4 增量分鐘數驗證錯誤優先級設為 3

## 6. 實作增量秒數驗證

- [x] 6.1 檢查 `multiSteep.enableMultiSteep.value` 是否為 true
- [x] 6.2 檢查 `multiSteep.incrementSeconds.value < 0` - 錯誤訊息「增量秒數不可為負數」
- [x] 6.3 增量秒數驗證失敗時，設定 `fieldErrors.incrementSeconds = true`
- [x] 6.4 增量秒數驗證錯誤優先級設為 3

## 7. App.vue 整合驗證 Composable

- [x] 7.1 在 App.vue 匯入 `useValidation`
- [x] 7.2 初始化 `const { validationResult } = useValidation(timer, multiSteep)`
- [x] 7.3 確認 `validationResult` 可在 template 中使用

## 8. 更新主要錯誤訊息區域

- [x] 8.1 修改錯誤訊息條件為 `v-if="validationResult.primaryError"`
- [x] 8.2 顯示錯誤訊息：`{{ validationResult.primaryError }}`
- [x] 8.3 保留原有的紅色背景和 pulse 動畫樣式
- [ ] 8.4 測試不同錯誤優先級的顯示

## 9. 第一泡分鐘輸入框 - 紅框標示

- [x] 9.1 使用動態 `:class` binding
- [x] 9.2 加入條件：`validationResult.hasFieldError('minutes')` 為 true 時顯示紅框
- [x] 9.3 紅框樣式：`border-2 border-red-400 focus:ring-red-200 focus:border-red-500`
- [x] 9.4 正常樣式：`border-2 border-gray-200 focus:ring-green-200 focus:border-green-400`
- [x] 9.5 加入 `step="1"` 屬性阻擋小數輸入

## 10. 第一泡秒數輸入框 - 紅框標示

- [x] 10.1 使用動態 `:class` binding
- [x] 10.2 加入條件：`validationResult.hasFieldError('seconds')` 為 true 時顯示紅框
- [x] 10.3 紅框樣式：`border-2 border-red-400 focus:ring-red-200 focus:border-red-500`
- [x] 10.4 正常樣式：`border-2 border-gray-200 focus:ring-green-200 focus:border-green-400`
- [x] 10.5 加入 `step="1"` 屬性阻擋小數輸入

## 11. 增量錯誤訊息區域

- [x] 11.1 在增量輸入區域頂部加入錯誤訊息 div
- [x] 11.2 條件顯示：`v-if="validationResult.incrementError"`
- [x] 11.3 顯示錯誤訊息：`{{ validationResult.incrementError }}`
- [x] 11.4 使用橘色背景：`bg-orange-50 border border-orange-200 text-orange-600`

## 12. 增量分鐘輸入框 - 紅框標示

- [x] 12.1 使用動態 `:class` binding
- [x] 12.2 加入條件：`validationResult.hasFieldError('incrementMinutes')` 為 true 時顯示紅框
- [x] 12.3 紅框樣式：`border-2 border-red-400 focus:ring-red-200 focus:border-red-500`
- [x] 12.4 正常樣式：`border-2 border-green-200 focus:ring-green-300 focus:border-green-400`
- [x] 12.5 加入 `step="1"` 屬性阻擋小數輸入

## 13. 增量秒數輸入框 - 紅框標示

- [x] 13.1 使用動態 `:class` binding
- [x] 13.2 加入條件：`validationResult.hasFieldError('incrementSeconds')` 為 true 時顯示紅框
- [x] 13.3 紅框樣式：`border-2 border-red-400 focus:ring-red-200 focus:border-red-500`
- [x] 13.4 正常樣式：`border-2 border-green-200 focus:ring-green-300 focus:border-green-400`
- [x] 13.5 加入 `step="1"` 屬性阻擋小數輸入

## 14. 更新開始按鈕禁用邏輯

- [x] 14.1 修改按鈕的 `:disabled` 屬性
- [x] 14.2 新條件：`!validationResult.isValid && !isRunning`
- [x] 14.3 確保計時中不受驗證影響（可暫停/繼續）
- [ ] 14.4 測試有錯誤時按鈕禁用
- [ ] 14.5 測試無錯誤時按鈕可用

## 15. 測試 - 第一泡分鐘數驗證

- [x] 15.1 測試輸入 -1 → 顯示「分鐘數不可為負數」+ 紅框 + 按鈕禁用
- [x] 15.2 測試輸入 15 → 顯示「分鐘數不可超過 10」+ 紅框 + 按鈕禁用
- [x] 15.3 測試輸入 5 → 無錯誤 + 正常邊框
- [x] 15.4 測試修正錯誤 → 紅框即時消失

## 16. 測試 - 第一泡秒數驗證

- [x] 16.1 測試輸入 -30 → 顯示「秒數不可為負數」+ 紅框 + 按鈕禁用
- [x] 16.2 測試輸入 90 → 顯示「秒數不可超過 59」+ 紅框 + 按鈕禁用
- [x] 16.3 測試輸入 30 → 無錯誤 + 正常邊框
- [x] 16.4 測試修正錯誤 → 紅框即時消失

## 17. 測試 - 第一泡總時間驗證

- [x] 17.1 測試輸入 0 分 3 秒 → 顯示「第一泡時間必須在...」+ 兩個欄位都紅框
- [x] 17.2 測試輸入 0 分 5 秒 → 無錯誤（邊界值）
- [x] 17.3 測試輸入 10 分 0 秒 → 無錯誤（邊界值）
- [x] 17.4 測試輸入 10 分 1 秒 → 顯示錯誤 + 兩個欄位都紅框

## 18. 測試 - 增量分鐘數驗證

- [x] 18.1 啟用連續沖泡並展開增量設定
- [x] 18.2 測試輸入 -1 → 增量區域顯示「增量分鐘數不可為負數」+ 紅框
- [x] 18.3 測試輸入 0 → 無錯誤
- [x] 18.4 測試輸入 15 → 無錯誤（無上限限制）
- [x] 18.5 取消連續沖泡 → 增量錯誤不影響按鈕

## 19. 測試 - 增量秒數驗證

- [x] 19.1 啟用連續沖泡並展開增量設定
- [x] 19.2 測試輸入 -30 → 增量區域顯示「增量秒數不可為負數」+ 紅框
- [x] 19.3 測試輸入 0 → 無錯誤
- [x] 19.4 測試輸入 30 → 無錯誤

## 20. 測試 - 錯誤優先級

- [x] 20.1 測試同時有分鐘負數和總時間錯誤 → 只顯示「分鐘數不可為負數」
- [x] 20.2 測試只有總時間錯誤 → 顯示「第一泡時間必須...」
- [x] 20.3 測試同時有第一泡和增量錯誤 → 主區域顯示第一泡錯誤，增量區域顯示增量錯誤

## 21. 測試 - 按鈕禁用邏輯

- [x] 21.1 測試有任何錯誤時按鈕禁用
- [x] 21.2 測試無錯誤時按鈕可用
- [x] 21.3 測試開始計時後按鈕變為「暫停」且可用（不受驗證影響）
- [x] 21.4 測試暫停時按鈕變為「繼續」且可用

## 22. 測試 - 完整流程

- [x] 22.1 測試從無效狀態 → 修正 → 開始計時 → 成功倒數
- [x] 22.2 測試連續沖泡模式下的增量驗證
- [x] 22.3 測試所有錯誤訊息都能正確顯示和消失
- [x] 22.4 測試紅框視覺回饋在各種場景下都正確

## 23. 程式碼品質檢查

- [x] 23.1 確認 `useValidation.js` 程式碼結構清晰
- [x] 23.2 確認 App.vue 整合不影響現有功能
- [x] 23.3 確認沒有 console 警告或錯誤
- [x] 23.4 確認程式碼符合專案風格（Vue 3 Composition API）
