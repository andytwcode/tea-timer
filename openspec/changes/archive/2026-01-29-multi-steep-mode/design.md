## Context

Tea Timer 當前版本是一個極簡的單次倒數計時器，使用 Vue 3 + Vite + Tailwind CSS 技術棧。現有設計假設每次使用都是獨立的計時任務，用戶輸入一次時間、倒數、完成後結束。

然而真實的泡茶場景中，同一份茶葉通常會沖泡多次（3-7 泡），且每一泡的時間遞增（例如第一泡 30 秒，第二泡 40 秒，第三泡 50 秒）。當前設計迫使用戶在每一泡結束後重新輸入時間，這在泡茶過程中（需要專注倒茶、加水）特別不便。

此次設計目標是在保持極簡美學的前提下，引入「連續沖泡模式」，讓計時器自動計算下一泡的時間，並提供半自動的流程控制。

技術約束：
- 純前端實作，無後端依賴
- 必須保持向後兼容（現有用戶不受影響）
- localStorage 為唯一持久化方案
- 保持極簡設計語言

## Goals / Non-Goals

**Goals:**
- 實現連續沖泡模式，支援自動計算遞增時間
- 提供半自動流程：每泡完成後需用戶確認才開始下一泡
- 支援無限制泡數，由用戶決定何時結束
- 智能兼容：增量為 0 時等同於單次模式
- 記住用戶偏好設定（第一泡時間、增量），但不記憶進度
- 保持極簡的 UI 設計，新增元素整合自然

**Non-Goals:**
- 不支援預設茶種模式（綠茶、紅茶等）
- 不支援全自動模式（每泡自動開始）
- 不記憶泡茶進度（不記得「上次泡到第幾泡」）
- 不支援自訂每泡時間（僅固定增量）
- 不添加音效提醒（保持現有純視覺設計）
- 不需要複雜的泡茶歷史記錄或統計功能

## Decisions

### 1. 統一界面設計：單一模式切換

**決定**：使用勾選框控制連續沖泡模式，而非雙模式切換（Tab 或獨立頁面）

**理由**：
- 保持極簡：一個勾選框即可啟用/禁用，無需額外導航
- 向後兼容：不勾選時完全等同於現有版本
- 漸進式學習：新用戶不會被複雜選項嚇到，進階用戶自然發現
- UI 整合自然：勾選框可以視覺上融入現有輸入區

**替代方案考量**：
- Tab 切換（單次/連續）：增加界面複雜度，破壞極簡感
- 獨立頁面：需要導航邏輯，用戶流程變長
- 自動檢測（增量 > 0 自動啟用）：缺乏明確控制，用戶可能困惑

### 2. 半自動流程控制

**決定**：每泡完成後顯示「開始下一泡」和「結束沖泡」兩個按鈕，需用戶手動點擊

**理由**：
- 符合真實場景：用戶需要時間倒茶、清洗杯子、重新加水
- 避免誤觸：全自動可能在用戶還沒準備好時就開始計時
- 給予控制權：用戶可以在任何時候決定是否繼續或結束

**實作細節**：
```javascript
// 完成狀態時
if (isCompleted && enableMultiSteep) {
  // 顯示兩個按鈕
  nextButton: `開始第 ${currentSteep} 泡 (${nextSteepTime}秒)`
  endButton: `結束沖泡`
}
```

**替代方案考量**：
- 全自動（自動開始下一泡）：不符合泡茶流程，缺乏間隙時間
- 倒數開始（5 秒倒數後自動開始）：增加複雜度，且 5 秒可能不夠

### 3. 增量為 0 即單次模式

**決定**：當增量秒數為 0 時，行為完全等同於原有的單次模式

**理由**：
- 完美的向後兼容：現有用戶體驗不變
- 統一界面邏輯：無需判斷兩種模式的不同代碼路徑
- 降低測試複雜度：單一邏輯分支

**實作邏輯**：
```javascript
// 計算當前泡的時間
const currentSteepSeconds = computed(() => {
  const baseTime = firstSteepSeconds.value
  if (!enableMultiSteep.value || incrementSeconds.value === 0) {
    return baseTime // 單次模式
  }
  return baseTime + (currentSteep.value - 1) * incrementSeconds.value
})

// 完成後按鈕邏輯
if (isCompleted) {
  if (enableMultiSteep.value && incrementSeconds.value > 0) {
    // 連續模式：顯示「下一泡」和「結束」
  } else {
    // 單次模式：顯示「重新開始」
  }
}
```

### 4. 狀態管理結構

**決定**：使用 Vue Composition API，添加新的響應式狀態而非重構現有架構

**理由**：
- 最小改動：在現有基礎上添加，降低重寫風險
- 清晰的狀態職責：每個 ref 對應一個明確的功能
- 易於調試：狀態變化可追蹤

**新增狀態**：
```javascript
// 現有狀態（保持不變）
const minutes = ref(3)
const seconds = ref(0)
const remainingSeconds = ref(0)
const isRunning = ref(false)
const initialSeconds = ref(0)
const isTimeUp = ref(false)

// 新增狀態
const incrementMinutes = ref(0)       // 增量分鐘數（新增）
const incrementSeconds = ref(10)      // 增量秒數
const enableMultiSteep = ref(false)   // 是否啟用連續模式
const currentSteep = ref(1)           // 當前第幾泡
const isCompleted = ref(false)        // 本泡是否完成（區分於 isTimeUp）

// 計算屬性
const incrementTotalSeconds = computed(() => 
  incrementMinutes.value * 60 + incrementSeconds.value
)
```

**狀態轉換圖**：
```
初始 → [點擊開始] → 倒數中 → [時間到] → 完成
                                          ↓
                            [開始下一泡] ← ┘
                            [結束沖泡] → 初始（重置到第 1 泡）
                            [重置] → 初始（保持當前泡數）
```

### 5. localStorage 策略：只記偏好，不記進度

**決定**：儲存第一泡時間、增量、模式開關，但不儲存當前泡數和倒數進度

**理由**：
- 簡化邏輯：每次打開頁面都是「新的泡茶過程」
- 避免混淆：用戶不會疑惑「為什麼顯示第 3 泡」
- 符合實際：泡茶過程通常一次完成，不會跨多天

**儲存格式**：
```javascript
localStorage:
  - teaTimerMinutes: number             // 第一泡分鐘數
  - teaTimerSeconds: number             // 第一泡秒數
  - teaTimerIncrementMinutes: number    // 增量分鐘數（新增）
  - teaTimerIncrementSeconds: number    // 增量秒數（新增）
  - teaTimerMultiSteepEnabled: boolean  // 模式開關（新增）
```

**不儲存**：
- `currentSteep`：每次載入重置為 1
- `remainingSeconds`：每次載入重新計算
- `isRunning` / `isCompleted`：每次載入重置為 false

**替代方案考量**：
- 記住進度：可能導致用戶困惑，且泡茶過程很少跨會話
- 完全不記：失去偏好設定的便利性

### 6. UI 佈局調整

**決定**：將勾選框和增量輸入整合到現有輸入區，保持垂直流動

**佈局方案**：
```
┌────────────────────────────────────┐
│  第一泡時間                        │
│  分鐘: [0]  秒: [30]               │   ← 現有
│                                    │
│  ☑️ 啟用連續沖泡                   │   ← 新增
│      每泡增加                      │
│      分鐘: [0]  秒: [10]           │   ← 新增（分鐘級增量）
│                                    │
│  ─────────────────────             │
│           0:30                     │   ← 現有
│           ↓ 閃爍提醒 ↓             │   ← 保留閃爍
│                                    │
│  當前：第 1 泡                     │   ← 新增（僅連續模式）
│                                    │
│  [開始第 1 泡]  [重置]             │   ← 修改
└────────────────────────────────────┘
```

**視覺層級**：
1. 第一泡時間輸入（主要）
2. 連續沖泡選項（次要，可摺疊）
3. 倒數顯示（最顯眼）
4. 泡數資訊（輔助）
5. 按鈕（行動）

**Tailwind 實作策略**：
- 使用 `v-if` / `v-show` 控制元素顯示
- 利用 `transition` 實現平滑展開/收起
- 保持現有的漸層、圓角、陰影風格

### 7. 按鈕邏輯與文字

**決定**：動態計算按鈕文字，清楚傳達下一步動作

**按鈕狀態表**：
```
狀態          | 啟用連續 | 增量 | 主按鈕文字              | 次按鈕
────────────────────────────────────────────────────────────────
初始          | No      | -    | 開始                   | 重置
初始          | Yes     | 0    | 開始第 1 泡            | 重置
初始          | Yes     | >0   | 開始第 1 泡            | 重置
倒數中        | Any     | Any  | (禁用) 第 X 泡計時中   | (無)
完成（單次）  | No      | -    | 重新開始               | 重置
完成（連續）  | Yes     | 0    | 重新開始               | 重置
完成（連續）  | Yes     | >0   | 開始第 X 泡 (Y秒)      | 結束沖泡
```

**實作邏輯**：
```javascript
const mainButtonText = computed(() => {
  if (isRunning.value) {
    return `⏸ 第 ${currentSteep.value} 泡計時中`
  }
  
  if (isCompleted.value) {
    if (enableMultiSteep.value && incrementTotalSeconds.value > 0) {
      return `▶ 開始第 ${currentSteep.value} 泡 (${nextSteepSeconds.value}秒)`
    }
    return `▶ 重新開始`
  }
  
  return `▶ 開始第 ${currentSteep.value} 泡`
})

const showEndButton = computed(() => 
  isCompleted.value && 
  enableMultiSteep.value && 
  incrementTotalSeconds.value > 0
)
```

### 8. 分鐘級增量支援

**決定**：增量輸入提供分鐘和秒數兩個欄位，支援更靈活的時間增量

**理由**：
- 某些茶葉（如普洱）後續泡的時間可能增加 1-2 分鐘
- 分開輸入更直覺（例如「每泡增加 1 分 30 秒」）
- 與第一泡時間輸入保持一致的 UI 模式

**實作細節**：
```javascript
// 狀態
const incrementMinutes = ref(0)    // 增量分鐘
const incrementSeconds = ref(10)   // 增量秒數

// 計算總增量（秒）
const incrementTotalSeconds = computed(() => 
  incrementMinutes.value * 60 + incrementSeconds.value
)

// 計算當前泡的時間
const currentSteepSeconds = computed(() => {
  const baseTime = firstSteepSeconds.value
  if (!enableMultiSteep.value || incrementTotalSeconds.value === 0) {
    return baseTime
  }
  return baseTime + (currentSteep.value - 1) * incrementTotalSeconds.value
})
```

**UI 佈局**：
```vue
<div v-if="enableMultiSteep">
  <label>每泡增加</label>
  <div class="flex gap-2">
    <input v-model.number="incrementMinutes" type="number" min="0" max="10" />
    <span>分</span>
    <input v-model.number="incrementSeconds" type="number" min="0" max="59" />
    <span>秒</span>
  </div>
</div>
```

**驗證邏輯**：
- 增量分鐘：0-10
- 增量秒數：0-59
- 總增量無最大限制（允許長時間泡茶場景）
- 增量為 0 時等同單次模式（兼容性）

### 9. 保留閃爍提醒

**決定**：連續沖泡模式下，每一泡完成時仍然使用文字閃爍提醒

**理由**：
- 一致的用戶體驗：與單次模式保持相同的完成提醒方式
- 視覺吸引力：閃爍能立即吸引注意，提醒用戶時間到了
- 多任務場景：用戶可能在倒茶時注意力不在螢幕上，閃爍更易察覺

**實作細節**：
```vue
<!-- 倒數顯示，閃爍動畫 -->
<div 
  :class="{ 'animate-blink text-red-500': isTimeUp, 'text-gray-800': !isTimeUp }"
  class="text-8xl font-mono font-bold"
>
  {{ displayTime }}
</div>

<!-- 完成狀態文字 -->
<div v-if="isTimeUp" class="text-red-500 font-semibold animate-pulse">
  ✨ 第 {{ currentSteep - 1 }} 泡完成！
</div>
```

**閃爍邏輯**：
- 使用現有的 `animate-blink` class（已在 style.css 定義）
- 閃爍 5 次，每次 0.5 秒
- 同時文字變紅並顯示完成訊息
- 閃爍結束後保持紅色，直到用戶點擊下一步

**狀態管理**：
```javascript
function onCountdownComplete() {
  isRunning.value = false
  isTimeUp.value = true      // 觸發閃爍
  isCompleted.value = true   // 觸發完成狀態
  
  if (enableMultiSteep.value && incrementTotalSeconds.value > 0) {
    currentSteep.value++     // 準備下一泡
  }
}
```

## Risks / Trade-offs

### 風險 1：UI 複雜度增加可能破壞極簡感

**風險**：新增勾選框、增量輸入、泡數顯示後，界面可能顯得擁擠。

**緩解措施**：
- 使用視覺層級：主要元素大而明顯，次要元素小且柔和
- 條件顯示：泡數資訊僅在連續模式下顯示
- 保持留白：使用 Tailwind 的 `space-y-*` 保持垂直間距
- 測試反饋：實作後請用戶測試，根據反饋調整

### 風險 2：狀態管理複雜度增加，容易出 bug

**風險**：新增 4 個響應式狀態，狀態轉換邏輯複雜化，可能產生邊界情況的 bug。

**緩解措施**：
- 清晰的狀態機：文檔化所有可能的狀態轉換
- 單一真相來源：避免衍生狀態不同步
- 充分測試：涵蓋所有狀態轉換路徑
- 使用 computed 而非 watch：減少手動狀態同步

### 風險 3：向後兼容性驗證不足

**風險**：雖然設計上兼容，但實際可能有邊界情況導致現有用戶體驗改變。

**緩解措施**：
- 保留現有的單元測試場景
- 新增測試：增量為 0 時行為與舊版完全一致
- 漸進式部署：先小範圍測試再全面推出
- 提供回退方案：保留舊版代碼分支

### Trade-off 1：記憶偏好 vs 記憶進度

選擇只記偏好而不記進度，犧牲了「斷點續泡」的可能性。但這符合泡茶場景（一次性完成），且簡化了狀態管理。

### Trade-off 2：半自動 vs 全自動

選擇半自動（需確認下一泡），增加了點擊次數，但給予用戶完整控制權，且符合泡茶的實際節奏（需要倒茶、加水的間隙）。

### Trade-off 3：統一界面 vs 雙模式

選擇統一界面（勾選框控制），保持極簡但增加了邏輯複雜度。雙模式（Tab 切換）會更清晰但破壞極簡感。

## Migration Plan

此為現有功能的增強，無需資料遷移。部署為前端靜態檔案更新。

**開發步驟**：
1. 在本地開發環境實作新功能
2. 添加新的狀態和邏輯，保留現有代碼
3. 更新 UI 組件，添加新元素
4. 測試所有狀態轉換和邊界情況
5. 驗證向後兼容性（增量 0 = 舊版）
6. 構建生產版本
7. 部署到託管平台

**部署策略**：
- 直接替換：靜態檔案可立即替換，無需漸進式
- 無資料遷移：localStorage 格式向後兼容（新增鍵值，不刪除舊鍵）
- 用戶無感：首次使用時自動讀取舊的偏好設定

**Rollback 策略**：
- Git 回退：使用版本控制快速回退到舊版
- localStorage 兼容：即使回退，舊版仍可讀取基本設定
- 無破壞性：新增鍵值不影響舊版運作

## Open Questions

1. **增量輸入範圍**：是否需要限制增量的最小/最大值？（例如最少 1 秒，最多 60 秒）
   - **決定**：支援分鐘級增量，需提供分鐘和秒數兩個輸入欄位

2. **泡數顯示位置**：當前設計放在倒數顯示下方，是否有更好的視覺位置？

3. **完成狀態的閃爍**：連續模式下是否仍需要閃爍提醒？還是純文字提示「第 X 泡完成」更合適？
   - **決定**：每一泡完成仍然需要閃爍提醒

4. **長時間泡茶的 UX**：如果用戶泡了 10+ 泡，是否需要提供「泡茶歷史」或「已完成泡數」的摘要？

5. **錯誤恢復**：如果用戶不小心關閉頁面，是否需要「繼續上次泡茶」的選項？（這與當前「不記進度」的決策衝突）
