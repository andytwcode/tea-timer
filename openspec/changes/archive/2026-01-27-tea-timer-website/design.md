## Context

這是一個從零開始的靜態網站專案，目標是提供極簡實用的泡茶計時器。當前專案為空白狀態，沒有既有程式碼或依賴項。使用者需求明確：專注於單一功能（倒數計時）、極簡設計、無需複雜框架。

技術環境：
- 純前端實作，無後端需求
- 目標瀏覽器：支援 localStorage 和 ES6 的現代瀏覽器
- 部署方式：靜態網站託管（GitHub Pages、Netlify 等）

## Goals / Non-Goals

**Goals:**
- 建立一個快速載入、單一用途的計時器網站
- 提供直覺的使用者介面，無需學習成本
- 實現可靠的倒數計時機制，精確到秒
- 記住使用者偏好，提升重複使用體驗
- 極簡美學，專注於功能本身

**Non-Goals:**
- 不支援多個計時器同時運行
- 不提供預設茶種選項（僅自訂時間）
- 不需要使用者帳號或雲端同步
- 不支援音效提醒（僅視覺提醒）
- 不需要響應式設計的複雜適配（保持簡單即可）

## Decisions

### 1. 技術棧：Vue 3 + Vite + Tailwind CSS

**決定**：使用 Vue 3 作為前端框架，Vite 作為構建工具，Tailwind CSS 作為樣式解決方案

**理由**：
- **Vue 3**：提供響應式狀態管理，簡化 UI 更新邏輯
- **Vite**：極快的開發伺服器啟動和熱更新，優化的生產構建
- **Tailwind CSS**：Utility-first 樣式框架，快速實現極簡設計，無需撰寫大量 CSS
- 現代化的開發體驗，且最終產出仍是靜態檔案

**替代方案考量**：
- Vanilla JavaScript：需手動管理 DOM 更新，程式碼較繁瑣
- React：JSX 語法較複雜，學習曲線較陡
- Nuxt.js：過於重量級，對此專案是過度工程化

### 2. 檔案結構：Vite + Vue SPA 架構

**決定**：採用標準 Vite + Vue 單頁應用結構

**理由**：
- 符合現代前端開發慣例
- 清晰的組件化架構
- 易於維護和擴展

**檔案配置**：
```
tea-timer/
├── index.html           (應用入口)
├── package.json         (依賴管理)
├── vite.config.js       (Vite 配置)
├── tailwind.config.js   (Tailwind 配置)
├── postcss.config.js    (PostCSS 配置)
└── src/
    ├── main.js          (Vue 應用初始化)
    ├── App.vue          (主組件 - 計時器邏輯)
    └── style.css        (Tailwind 指令和全域樣式)
```

### 3. 計時機制：setInterval + Vue Reactivity

**決定**：使用 `setInterval` 配合 Vue 的響應式系統更新倒數時間

**理由**：
- API 簡單直覺
- 瀏覽器支援度完善
- Vue 的響應式系統自動處理 UI 更新
- 對於秒級精度足夠準確

**實作細節**：
```javascript
import { ref } from 'vue';

const remainingSeconds = ref(0);
let intervalId = null;

function startCountdown(totalSeconds) {
  remainingSeconds.value = totalSeconds;
  intervalId = setInterval(() => {
    remainingSeconds.value--;
    
    if (remainingSeconds.value <= 0) {
      clearInterval(intervalId);
      triggerAlert();
    }
  }, 1000);
}
```

**替代方案考量**：
- `requestAnimationFrame`：過於精細，增加複雜度，且秒級精度不需要
- Web Workers：過度工程化，此專案不需要背景執行緒

### 4. 時間格式：分鐘和秒數分開輸入

**決定**：提供兩個獨立的 `<input>` 欄位，使用 `v-model` 雙向綁定

**理由**：
- 符合使用者思考模式（「3 分鐘」而非「180 秒」）
- 輸入驗證更直覺（分鐘 0-10，秒數 0-59）
- Vue 的 `v-model` 簡化數據綁定
- 避免使用者混淆單位

**Vue 實作**：
```vue
<template>
  <input v-model.number="minutes" type="number" min="0" max="10" 
         class="..." />
  <input v-model.number="seconds" type="number" min="0" max="59" 
         class="..." />
</template>

<script setup>
import { ref } from 'vue';

const minutes = ref(3);
const seconds = ref(0);

// 驗證邏輯
const totalSeconds = computed(() => minutes.value * 60 + seconds.value);
const isValid = computed(() => 
  totalSeconds.value >= 5 && totalSeconds.value <= 600
);
</script>
```

**驗證邏輯**：
- 總秒數 = 分鐘 × 60 + 秒數
- 必須 >= 5 秒且 <= 600 秒

### 5. 資料持久化：localStorage

**決定**：使用 `localStorage` 儲存上次輸入的分鐘和秒數

**理由**：
- 同步 API，實作簡單
- 無需後端或資料庫
- 資料永久保存（除非使用者清除）
- 所有現代瀏覽器支援

**儲存格式**：
```javascript
localStorage.setItem('teaTimerMinutes', minutes);
localStorage.setItem('teaTimerSeconds', seconds);
```

**替代方案考量**：
- SessionStorage：重開瀏覽器會遺失，不符需求
- Cookie：過於老舊且複雜
- IndexedDB：功能過剩，非必要

### 6. 視覺提醒：Tailwind CSS 動畫

**決定**：使用 Tailwind CSS 的 `animate` utility 和自訂動畫實現文字閃爍

**理由**：
- CSS 動畫效能優於 JavaScript 操作 DOM
- Tailwind 的 utility-first 方式與專案風格一致
- 易於調整和維護
- 瀏覽器硬體加速支援

**實作方式**：
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.2 }
        }
      },
      animation: {
        blink: 'blink 0.5s ease-in-out 5'
      }
    }
  }
}
```

```vue
<!-- App.vue -->
<div :class="{ 'animate-blink': isTimeUp }">
  {{ displayTime }}
</div>
```

**替代方案考量**：
- JavaScript setInterval 切換 class：效能較差，程式碼複雜

### 7. 狀態管理：Vue Composition API

**決定**：使用 Vue 3 Composition API 的 `ref` 和 `computed` 管理狀態

**理由**：
- Vue 的響應式系統自動追蹤依賴和更新 UI
- Composition API 提供清晰的邏輯組織
- 無需手動操作 DOM
- TypeScript 支援良好（未來可升級）

**狀態結構**：
```javascript
// App.vue <script setup>
import { ref, computed } from 'vue';

const isRunning = ref(false);
const remainingSeconds = ref(0);
const initialSeconds = ref(0);
const minutes = ref(3);
const seconds = ref(0);

let intervalId = null;

const displayTime = computed(() => {
  const mins = Math.floor(remainingSeconds.value / 60);
  const secs = remainingSeconds.value % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
});
```

## Risks / Trade-offs

### 風險 1：瀏覽器分頁不在前景時，setInterval 可能變慢

**風險**：當使用者切換到其他分頁，某些瀏覽器會降低 `setInterval` 的執行頻率以節省資源，可能導致計時不準確。

**緩解措施**：
- 接受此限制，因為大多數使用情境下使用者會保持分頁開啟
- 若未來需求變更，可考慮使用 `Date.now()` 計算實際經過時間

### 風險 2：localStorage 被停用或清除

**風險**：使用者可能停用 localStorage 或定期清除瀏覽器資料，導致偏好設定遺失。

**緩解措施**：
- 提供預設值（例如 3 分鐘），即使無法讀取 localStorage 仍可正常使用
- 在程式碼中加入 `try-catch` 處理 localStorage 存取錯誤

### 風險 3：極簡設計可能缺乏視覺吸引力

**風險**：過於極簡的設計可能讓網站顯得單調或缺乏個性。

**緩解措施**：
- 使用良好的排版和間距營造舒適感
- 選擇適當的色彩和字體提升質感
- 保持功能性為優先，設計為輔

### Trade-off 1：無音效提醒 vs. 極簡性

選擇僅使用視覺提醒，犧牲了音效提醒的明顯性。但這符合「極簡」原則，且避免了處理音訊權限和檔案載入的複雜度。

### Trade-off 2：無預設茶種 vs. 使用便利性

要求使用者每次輸入時間，而非提供預設茶種快捷按鈕。這增加了一點點操作步驟，但保持介面簡潔，且 localStorage 記憶功能可部分彌補。

## Migration Plan

此為全新專案，無需遷移既有資料或系統。

**開發環境設置**：
1. 初始化專案：`npm create vite@latest tea-timer -- --template vue`
2. 安裝 Tailwind CSS：`npm install -D tailwindcss postcss autoprefixer`
3. 初始化 Tailwind：`npx tailwindcss init -p`
4. 配置 Tailwind 和開發 App.vue

**部署步驟**：
1. 開發並測試功能：`npm run dev`
2. 構建生產版本：`npm run build`
3. 預覽構建結果：`npm run preview`
4. 提交至 Git 版本控制
5. 部署至靜態網站託管服務：
   - **GitHub Pages**：使用 GitHub Actions 自動構建
   - **Netlify/Vercel**：連接 Git 倉庫自動部署
6. 驗證線上版本運作正常

**構建產物**：
- Vite 構建後產生 `dist/` 目錄
- 包含優化後的 HTML、CSS、JS 和資源檔案
- 可直接部署到任何靜態網站託管服務

**Rollback 策略**：
- 使用 Git 可輕鬆回復到先前版本
- 重新構建並部署即可

## Open Questions

1. **色彩主題**：極簡設計應使用什麼色系？Tailwind 預設色盤中的 slate/gray？或使用茶綠色作為主題色（green-600/green-700）？
2. **響應式需求**：是否需要針對手機螢幕特別優化（Tailwind 的 responsive utilities）？還是以桌面瀏覽器為主？
3. **錯誤訊息**：當使用者輸入無效時間（少於 5 秒或超過 10 分鐘），錯誤訊息應該如何呈現？（紅色邊框 `border-red-500`、inline 文字等）
4. **開始按鈕行為**：倒數進行中，「開始」按鈕應該變成「暫停」還是禁用（`disabled` 屬性）？（目前需求未明確提及暫停功能）
5. **字體選擇**：使用系統字體（Tailwind 預設）還是引入特定字體（如 Inter、Roboto）？
