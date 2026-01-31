## Context

當前泡茶計時器使用 HTML5 `type="number"` 的 `min`/`max` 屬性進行基本輸入限制，但這些限制可以被繞過（鍵盤輸入、貼上）。後端僅驗證第一泡總時間（5-600秒），增量時間完全沒有驗證。這導致：

1. 使用者可輸入負數，造成計算錯誤
2. 增量為負數時，後續泡數時間會變負
3. 錯誤訊息籠統（只說「時間必須在5秒到10分鐘之間」）
4. 無視覺標示告知哪個欄位有問題

**當前架構**：
- Vue 3 Composition API
- 已有 5 個 composables：usePWA, useLocalStorage, useNotification, useTimer, useMultiSteep
- 驗證邏輯散落在 App.vue 的 computed 中

**相關 spec**：
- `timer-input` spec 定義「自動調整」策略（超範圍值自動夾緊）
- 但探索階段決定採用「驗證 + 錯誤訊息」策略（更明確的使用者回饋）

## Goals / Non-Goals

**Goals:**
- 防止所有負數輸入（第一泡和增量）
- 提供清楚的欄位級別錯誤訊息
- 視覺標示無效欄位（紅框）
- 集中化驗證邏輯，易於維護和測試
- 符合現有 composables 架構模式

**Non-Goals:**
- 不實作自動修正（@blur 夾緊值）- 與 spec 原定義不同，但探索階段決定更明確的錯誤回饋
- 不限制增量上限（連續沖泡場景下後續泡數可能需要 > 600 秒）
- 不支援負數增量（遞減模式）- 可能未來加入獨立功能
- 不阻擋小數輸入在 JS 層（依賴 HTML `step="1"`）

## Decisions

### Decision 1: 創建獨立的 useValidation composable

**選擇**：創建新的 `useValidation` composable，接受 `timer` 和 `multiSteep` 作為參數。

**理由**：
- 驗證邏輯涉及多個 composable 的狀態（timer + multiSteep）
- 關注點分離：驗證是獨立的橫切關注點
- 更容易單元測試
- 符合現有架構模式（每個功能一個 composable）

**替代方案**：
- ❌ 在 useTimer 中加驗證：無法處理增量驗證（屬於 multiSteep）
- ❌ 在 App.vue 中寫驗證邏輯：違反關注點分離，難以測試

### Decision 2: 驗證策略 - 錯誤訊息 vs 自動調整

**選擇**：採用「驗證 + 錯誤訊息」策略（策略 C）。

**理由**：
- 使用者明確知道問題所在
- 不會產生「我明明輸入 -5 怎麼變成 0」的困惑
- 避免靜默修正導致的意外行為
- 符合探索階段的決策

**替代方案**：
- ❌ 自動調整（spec 原定義）：雖然流暢但可能困惑使用者
- ❌ 即時阻擋輸入：實作複雜且可能影響 UX（無法暫時輸入空白）

**Breaking Change**：這與 `timer-input` spec 原定義的「自動調整」不同，需要更新 spec。

### Decision 3: 禁止負數增量

**選擇**：不允許負數增量（分鐘/秒數都必須 >= 0）。

**理由**：
- 99% 使用場景都是時間遞增
- 簡化實作和使用者理解
- 避免複雜的「每泡時間 >= 5 秒」檢查邏輯

**替代方案**：
- ❌ 允許負數增量：需要模擬所有未來泡數，檢查是否 >= 5秒，實作複雜

**未來擴展**：如需遞減模式，可加入獨立的「遞減開關」。

### Decision 4: 錯誤優先級和顯示策略

**選擇**：
- 錯誤有優先級：欄位級別 (1) > 總時間 (2) > 增量時間 (3)
- 只顯示最高優先級的一個錯誤
- 主要錯誤顯示在標題下方
- 增量錯誤顯示在增量區域內

**理由**：
- 避免訊息過載（同時顯示多個錯誤）
- 引導使用者逐步修正（先修欄位，再看總時間）
- 區域錯誤就近顯示（增量錯誤在增量區）

### Decision 5: 紅框實作方式

**選擇**：使用動態 `:class` binding，根據 `validationResult.hasFieldError(fieldName)` 條件切換樣式。

**理由**：
- Vue 的標準做法，響應式
- 樣式切換清晰（紅色 vs 綠色邊框）
- 易於維護

**實作細節**：
```vue
:class="[
  '...共用樣式',
  validationResult.hasFieldError('minutes')
    ? 'border-2 border-red-400 focus:ring-red-200'
    : 'border-2 border-gray-200 focus:ring-green-200'
]"
```

### Decision 6: 增量時間不設上限

**選擇**：增量分鐘數和秒數只驗證 >= 0，不設最大值。

**理由**：
- 連續沖泡的核心價值是「後面泡數時間更長」
- 10 分鐘限制針對第一泡（單次場景）
- 第二泡可能需要 > 10 分鐘（例如：第一泡 5 分鐘 + 增量 10 分鐘 = 15 分鐘）

**未來改進**：可加入友善提示「第 2 泡將需要 XX 分鐘」，但不阻止操作。

## Risks / Trade-offs

### Risk 1: Spec 不一致
**風險**：實作的「錯誤訊息」策略與 `timer-input` spec 定義的「自動調整」不同。

**Mitigation**：更新 `timer-input` spec 的 delta spec，記錄策略變更和理由。

### Risk 2: 使用者體驗變化
**風險**：過去系統靜默修正無效值，現在使用者會看到錯誤訊息，可能感到不習慣。

**Trade-off**：短期可能增加摩擦，但長期更清晰可預測。

**Mitigation**：錯誤訊息具體且有建設性（告訴使用者具體問題）。

### Risk 3: 小數輸入
**風險**：`step="1"` 只能阻擋鍵盤輸入小數，無法阻擋貼上（如 "1.5"）。

**Trade-off**：接受 `v-model.number` 將小數轉換為數字（1.5 * 60 = 90秒），因為技術上合法。

**Mitigation**：如需嚴格阻擋小數，可加入 `Number.isInteger()` 驗證。

### Risk 4: 測試覆蓋
**風險**：驗證邏輯較複雜，需要充分測試。

**Mitigation**：手動測試所有場景（proposal 中列出的測試需求）。

## Migration Plan

**部署步驟**：
1. 創建 `useValidation.js` composable
2. 在 App.vue 整合驗證
3. 更新 template 的條件樣式和錯誤訊息
4. 更新 `timer-input` spec（delta spec）
5. 創建 `input-validation` spec（新 capability）
6. 手動測試所有驗證場景
7. 部署到 production

**Rollback 策略**：
- 如發現嚴重問題，可移除 `useValidation` import 並還原 App.vue 的驗證邏輯
- Git commit 應該包含完整變更，方便回退

**向後相容性**：
- 使用者資料（localStorage）不受影響
- UI 行為改變（從靜默修正到顯示錯誤），但不破壞核心功能

## Open Questions

無。探索階段已充分討論所有設計決策。
