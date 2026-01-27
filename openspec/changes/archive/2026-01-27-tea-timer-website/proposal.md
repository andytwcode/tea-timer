## Why

需要一個極簡實用的靜態網站工具，讓使用者能夠快速設定泡茶時間並進行倒數計時。當前缺乏簡潔、專注於單一任務的計時器，且大多數計時器不會記住使用者的偏好設定。

## What Changes

- 新增靜態網站，提供泡茶倒數計時功能
- 使用者可輸入分鐘和秒數（範圍：5 秒至 10 分鐘）
- 倒數計時以數字格式（M:SS）顯示
- 時間到達時以文字閃爍方式提醒使用者
- 使用 localStorage 記住使用者上次輸入的時間
- 倒數進行時，瀏覽器分頁標題同步顯示剩餘時間
- 提供重置按鈕，可回到初始設定的時間

## Capabilities

### New Capabilities
- `timer-input`: 使用者輸入介面，接受分鐘和秒數，驗證時間範圍（5-600 秒）
- `countdown-display`: 倒數計時顯示，以 M:SS 格式呈現剩餘時間
- `time-alert`: 時間到達時的視覺提醒機制（文字閃爍）
- `timer-control`: 計時器控制功能，包含開始和重置按鈕
- `storage-persistence`: 使用 localStorage 儲存和讀取使用者的時間設定
- `tab-title-sync`: 瀏覽器分頁標題與倒數時間同步更新

### Modified Capabilities
<!-- 無現有功能需要修改 -->

## Impact

- 新增檔案：`index.html`、`style.css`、`script.js`
- 純前端實作，無後端依賴
- 需要支援 localStorage 的現代瀏覽器
- 可部署至任何靜態網站託管服務（GitHub Pages、Netlify、Vercel 等）
