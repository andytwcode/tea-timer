## 1. 狀態管理

- [x] 1.1 新增 `isPaused` ref 變數（初始值 false）
- [x] 1.2 確認 `isPaused` 與 `isRunning` 組合能正確表示三種狀態（計時中、已暫停、未開始）

## 2. 主按鈕邏輯修改

- [x] 2.1 修改 `mainButtonText` computed，計時中顯示「⏸ 暫停」或「⏸ 暫停第 X 泡」
- [x] 2.2 修改 `mainButtonText` computed，暫停中顯示「▶ 繼續」或「▶ 繼續第 X 泡」
- [x] 2.3 移除 `startCountdown` 函數中的 `isRunning` 檢查（允許暫停時點擊）
- [x] 2.4 修改主按鈕的 `disabled` 屬性邏輯，暫停/繼續時不禁用

## 3. 暫停/繼續功能實作

- [x] 3.1 創建 `togglePause` 函數處理暫停/繼續邏輯
- [x] 3.2 在 `togglePause` 中，計時中時設定 `isPaused = true` 並執行 `clearInterval(intervalId)`
- [x] 3.3 在 `togglePause` 中，暫停中時設定 `isPaused = false` 並重新建立 `setInterval`
- [x] 3.4 主按鈕點擊事件綁定到 `togglePause`（計時中或暫停中時）或 `startCountdown`（未開始時）

## 4. 重置邏輯更新

- [x] 4.1 修改 `resetTimer` 函數，清除 `isPaused` 狀態（設為 false）
- [x] 4.2 確認重置時正確清除 `intervalId`（不論是計時中或暫停中）

## 5. 輸入框鎖定邏輯

- [x] 5.1 修改分鐘輸入框的 `disabled` 屬性，暫停時保持禁用（`:disabled="isRunning"`）
- [x] 5.2 修改秒數輸入框的 `disabled` 屬性，暫停時保持禁用（`:disabled="isRunning"`）
- [x] 5.3 驗證暫停和繼續時輸入框都保持鎖定狀態

## 6. 標題列更新

- [x] 6.1 修改 `startCountdown` 中的標題更新邏輯，檢查 `isPaused` 狀態
- [x] 6.2 暫停時更新標題為「⏸ X:XX - 泡茶計時器」格式
- [x] 6.3 連續沖泡模式暫停時更新標題為「⏸ X:XX - 第 Y 泡 - 泡茶計時器」
- [x] 6.4 繼續時恢復標題倒數格式（移除 ⏸ 圖示）

## 7. 連續沖泡模式測試

- [x] 7.1 驗證暫停不改變 `initialSeconds` 和 `currentSteepSeconds`
- [x] 7.2 驗證暫停不改變 `incrementTotalSeconds` 設定
- [x] 7.3 驗證第 N 泡暫停後完成，第 N+1 泡時間仍按原公式計算

## 8. 邊界情境處理

- [x] 8.1 驗證暫停後立即重置，狀態正確回到初始
- [x] 8.2 驗證連續點擊暫停/繼續不會造成 interval 洩漏
- [x] 8.3 驗證計時完成（remainingSeconds = 0）時，`isPaused` 狀態正確清除
- [x] 8.4 驗證暫停後刷新頁面，localStorage 不會保存暫停狀態（符合預期行為）

## 9. UI 驗證

- [x] 9.1 檢查主按鈕在計時中顯示「⏸ 暫停」且可點擊
- [x] 9.2 檢查主按鈕在暫停中顯示「▶ 繼續」且可點擊
- [x] 9.3 檢查暫停時輸入框保持禁用狀態
- [x] 9.4 檢查瀏覽器標題在暫停時顯示 ⏸ 圖示

## 10. 整合測試

- [x] 10.1 測試單泡模式：開始 → 暫停 → 繼續 → 完成
- [x] 10.2 測試連續沖泡模式：第 2 泡開始 → 暫停 → 繼續 → 完成 → 第 3 泡
- [x] 10.3 測試暫停後重置，確認回到初始狀態
- [x] 10.4 測試多次暫停/繼續循環，確認計時準確性
