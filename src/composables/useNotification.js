/**
 * 通知系統
 * 處理瀏覽器通知的權限請求和發送
 * 支援 Service Worker（Android Chrome）和直接通知（Desktop）
 */
export function useNotification() {
  /**
   * 請求通知權限
   */
  function requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  /**
   * 發送計時完成通知
   * @param {number} steepNumber - 當前泡數
   * @param {boolean} isMultiSteep - 是否為連續沖泡模式
   */
  function sendTimerCompleteNotification(steepNumber, isMultiSteep) {
    // 檢查權限
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    const title = '泡茶時間到！'
    const body = isMultiSteep 
      ? `第 ${steepNumber} 泡已完成`
      : '時間到了！'

    const options = {
      body,
      icon: '/tea-timer/icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'tea-timer',
      renotify: true,  // 即使替換也重新播放聲音/震動
      requireInteraction: true
    }

    // 使用 Service Worker 發送通知（支援 Android Chrome）
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options
      })
    } else {
      // Fallback for desktop browsers
      const notification = new Notification(title, options)
      
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }
  }

  return {
    requestPermission,
    sendTimerCompleteNotification
  }
}
