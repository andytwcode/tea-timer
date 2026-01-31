# Design: 可摺疊的增量設定區域

## Context

當前的連續沖泡功能中，「每泡增加時間」設定區域預設始終展開顯示。此區域包含兩個輸入欄位（分鐘和秒數），在手機等小螢幕裝置上佔用較多垂直空間。

**現有結構**：
```vue
<div v-if="enableMultiSteep" class="mt-4 pt-4 border-t border-green-200">
  <label>每泡增加時間</label>
  <div class="flex gap-3">
    <input v-model.number="incrementMinutes" />  <!-- 分鐘 -->
    <input v-model.number="incrementSeconds" />  <!-- 秒數 -->
  </div>
</div>
```

**使用者行為觀察**：
- 增量設定通常只在初次使用或更換茶葉時調整
- 大多數時間使用者不需要看到完整的輸入欄位
- 手機使用者需要滾動才能看到下方的按鈕區域

## Goals / Non-Goals

**Goals:**
- 提供可摺疊的增量設定區域，預設收起以節省空間
- 收起時顯示目前設定值（如「目前：0分10秒」），保持資訊可見性
- 記憶展開/收起狀態到 localStorage，尊重使用者偏好
- 自動化邏輯：取消勾選連續沖泡時自動收起設定區
- 保持現有功能完整性（輸入驗證、範圍限制等）

**Non-Goals:**
- 不改變增量輸入的驗證邏輯（已在 multi-steep-control 中定義）
- 不改變第一泡時間輸入的 UI（僅針對增量設定區域）
- 不提供動畫效果（保持簡潔，避免效能問題）

## Decisions

### 決策 1：狀態管理結構

**決定**：新增單一 `ref` 控制展開/收起狀態

```javascript
const showIncrementSettings = ref(false)  // 預設收起
```

**理由**：
- 簡單的 boolean 狀態足以表達展開/收起
- 使用 `ref` 而非 `reactive`，因為只需管理單一值
- 預設 `false` 確保首次進入時畫面簡潔

**替代方案**：使用 localStorage 直接讀取的預設值
- **拒絕理由**：初始化時機問題，`ref` 定義時 localStorage 可能尚未讀取

### 決策 2：收起時的按鈕文字格式

**決定**：顯示「⚙️ 設定增量 (目前：X分Y秒)」

**實作**：
```javascript
const incrementLabel = computed(() => {
  const mins = incrementMinutes.value
  const secs = incrementSeconds.value
  return `⚙️ 設定增量 (目前：${mins}分${secs}秒)`
})
```

**理由**：
- 使用 emoji ⚙️ 提供視覺識別（設定相關）
- 括號內顯示目前值，讓使用者無需展開即可確認設定
- 格式「X分Y秒」比「XmYs」更易讀（中文環境）

**替代方案**：只顯示「⚙️ 設定增量」
- **拒絕理由**：無法讓使用者快速確認目前設定，降低可用性

### 決策 3：展開/收起按鈕位置

**決定**：按鈕放置在增量設定區域的右上角

```vue
<div class="bg-linear-to-r from-green-50 to-teal-50 p-4 rounded-2xl">
  <div class="flex items-center justify-between">
    <label>☑️ 啟用連續沖泡</label>
    <button v-if="enableMultiSteep" @click="toggleIncrementSettings">
      {{ showIncrementSettings ? '▲ 收起' : incrementLabel }}
    </button>
  </div>
  <!-- 增量輸入欄位 (v-if="showIncrementSettings") -->
</div>
```

**理由**：
- 按鈕與相關功能（增量設定）在同一視覺區塊內
- 右上角位置符合「設定」類功能的常見佈局慣例
- 使用 `justify-between` 讓勾選框和按鈕分居兩側，清晰區分

**替代方案**：獨立的按鈕列
- **拒絕理由**：額外佔用垂直空間，違背節省空間的初衷

### 決策 4：自動收起邏輯

**決定**：使用 `watch` 監聽連續沖泡開關，取消勾選時自動收起

```javascript
watch(enableMultiSteep, (newValue) => {
  if (!newValue && showIncrementSettings.value) {
    showIncrementSettings.value = false
  }
})
```

**理由**：
- 取消連續沖泡時，增量設定不再相關，自動收起減少困惑
- 只在「取消勾選且目前為展開」時觸發，避免不必要的狀態變更
- 不影響儲存邏輯（展開狀態仍會儲存，下次啟用時可恢復）

**替代方案**：不自動收起，讓使用者手動操作
- **拒絕理由**：可能造成 UI 混亂（功能已關閉但設定區仍展開）

### 決策 5：localStorage 儲存時機

**決定**：在 `toggleIncrementSettings` 函數中即時儲存

```javascript
function toggleIncrementSettings() {
  showIncrementSettings.value = !showIncrementSettings.value
  
  try {
    localStorage.setItem('teaTimerShowIncrementSettings', 
                         showIncrementSettings.value.toString())
  } catch (error) {
    console.error('localStorage save error:', error)
  }
}
```

**理由**：
- 即時儲存確保使用者偏好立即持久化
- 不依賴「開始倒數」等其他操作，降低耦合
- 容錯處理確保 localStorage 失敗不影響功能

**替代方案**：在開始倒數時一併儲存
- **拒絕理由**：使用者可能只調整展開/收起而不開始倒數，偏好無法保存

### 決策 6：按鈕樣式設計

**決定**：使用淺色調、小尺寸的文字按鈕

```vue
<button
  class="text-sm text-gray-600 hover:text-green-600 transition-colors px-3 py-1 
         rounded-lg hover:bg-white/50"
  @click="toggleIncrementSettings"
>
  {{ showIncrementSettings ? '▲ 收起' : incrementLabel }}
</button>
```

**理由**：
- 小尺寸（text-sm）避免搶走主要動作按鈕（開始/重置）的視覺重點
- 淺色調（gray-600）表示次要操作
- hover 效果（綠色 + 淺背景）提供互動回饋
- 不使用 disabled 狀態，因為在任何時候都應可操作

**替代方案**：使用明顯的按鈕樣式（邊框、背景色）
- **拒絕理由**：過於突出，違背「次要功能」的定位

## Risks / Trade-offs

### Risk 1：使用者可能不知道設定區域可展開
**Mitigation**：
- 收起時按鈕文字包含「設定」關鍵字和 ⚙️ emoji，提供視覺提示
- 顯示目前設定值，即使收起也能看到資訊
- 預設收起但狀態記憶，常用使用者可保持展開偏好

### Risk 2：增加一層互動步驟可能降低設定效率
**Mitigation**：
- localStorage 記憶展開狀態，常調整的使用者可保持展開
- 收起時仍顯示目前值，多數情況無需展開即可確認
- 展開/收起操作為單次點擊，成本低

### Risk 3：自動收起邏輯可能打斷使用者操作流程
**Mitigation**：
- 只在取消勾選連續沖泡時觸發，此時設定區域本已無用
- 不會因其他操作（如開始倒數、重置）而自動收起
- 使用者可隨時手動展開，不受限制

### Risk 4：在小螢幕上，按鈕文字可能過長
**Mitigation**：
- 使用簡潔的格式：「X分Y秒」而非「X分鐘Y秒鐘」
- 如果數值為 0 可考慮簡化顯示（如「0秒」而非「0分0秒」）
- 按鈕使用 text-sm，在手機上仍可讀
- CSS 確保按鈕內文字換行（如需要）

## Migration Plan

此變更為純 UI 改進，無需資料遷移。

**部署步驟**：
1. 部署新版本程式碼
2. 使用者重新載入頁面即可看到新 UI
3. 若使用者之前未使用過連續沖泡功能，體驗無差異
4. 若使用者正在使用連續沖泡，增量設定區域變為收起（預設行為）

**Rollback 策略**：
- 如需 rollback，只需移除相關程式碼，恢復原本的 v-if 邏輯
- localStorage 中的 `teaTimerShowIncrementSettings` 鍵可保留（不影響舊版本）

## Open Questions

無待解決問題。所有設計決策已在探索階段確認。
