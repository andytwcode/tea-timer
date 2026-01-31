/**
 * PWA Service Worker 註冊
 * 用於支援 PWA 安裝和通知功能（Android Chrome 需要）
 */
export function usePWA() {
  function register() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/tea-timer/sw.js').catch(() => {
        // 靜默失敗，不影響應用功能
      })
    }
  }

  return {
    register
  }
}
