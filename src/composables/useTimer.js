/**
 * 計時器核心邏輯
 * 管理倒數計時狀態和控制
 */
import { ref, computed } from 'vue'

export function useTimer() {
  // 狀態
  const minutes = ref(1)
  const seconds = ref(0)
  const remainingSeconds = ref(0)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const initialSeconds = ref(0)
  const isTimeUp = ref(false)

  let intervalId = null

  // 計算屬性
  const totalSeconds = computed(() => minutes.value * 60 + seconds.value)
  const isValid = computed(() => totalSeconds.value >= 5 && totalSeconds.value <= 600)
  const displayTime = computed(() => {
    const mins = Math.floor(remainingSeconds.value / 60)
    const secs = remainingSeconds.value % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  })

  /**
   * 更新頁面標題
   */
  function updateTitle(timeStr, steepNumber, isMultiSteep, paused = false) {
    if (paused) {
      if (isMultiSteep) {
        document.title = `⏸ ${timeStr} - 第 ${steepNumber} 泡 - 泡茶計時器`
      } else {
        document.title = `⏸ ${timeStr} - 泡茶計時器`
      }
    } else if (isMultiSteep) {
      document.title = `第${steepNumber}泡 ${timeStr} - 泡茶計時器`
    } else {
      document.title = `${timeStr} - 泡茶計時器`
    }
  }

  /**
   * 開始倒數
   */
  function startCountdown(targetSeconds, steepNumber, isMultiSteep, onComplete) {
    if (!isValid.value || (isRunning.value && !isPaused.value)) return false

    initialSeconds.value = targetSeconds
    remainingSeconds.value = targetSeconds
    isRunning.value = true
    isTimeUp.value = false

    intervalId = setInterval(() => {
      remainingSeconds.value--

      // 更新標題
      if (remainingSeconds.value > 0) {
        const mins = Math.floor(remainingSeconds.value / 60)
        const secs = remainingSeconds.value % 60
        const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
        updateTitle(timeStr, steepNumber, isMultiSteep)
      } else {
        if (isMultiSteep) {
          document.title = `第${steepNumber}泡 0:00 - 泡茶計時器`
        } else {
          document.title = `0:00 - 泡茶計時器`
        }
      }

      if (remainingSeconds.value <= 0) {
        clearInterval(intervalId)
        isRunning.value = false
        isPaused.value = false
        isTimeUp.value = true

        // 觸發完成回調
        if (onComplete) {
          onComplete()
        }
      }
    }, 1000)

    return true
  }

  /**
   * 暫停/繼續
   */
  function togglePause(steepNumber, isMultiSteep, onComplete) {
    if (!isRunning.value) return

    if (!isPaused.value) {
      // 暫停
      clearInterval(intervalId)
      isPaused.value = true
      updateTitle(displayTime.value, steepNumber, isMultiSteep, true)
    } else {
      // 繼續
      isPaused.value = false

      intervalId = setInterval(() => {
        remainingSeconds.value--

        // 更新標題
        if (remainingSeconds.value > 0) {
          const mins = Math.floor(remainingSeconds.value / 60)
          const secs = remainingSeconds.value % 60
          const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
          updateTitle(timeStr, steepNumber, isMultiSteep)
        } else {
          document.title = `0:00 - 泡茶計時器`
        }

        if (remainingSeconds.value <= 0) {
          clearInterval(intervalId)
          isRunning.value = false
          isPaused.value = false
          isTimeUp.value = true

          // 觸發完成回調
          if (onComplete) {
            onComplete()
          }
        }
      }, 1000)
    }
  }

  /**
   * 重置計時器
   */
  function resetCountdown() {
    clearInterval(intervalId)
    isRunning.value = false
    isPaused.value = false
    isTimeUp.value = false
    remainingSeconds.value = 0
    initialSeconds.value = 0
    document.title = '泡茶計時器'
  }

  /**
   * 載入設定
   */
  function loadTimerSettings(settings) {
    if (settings.minutes !== null) minutes.value = settings.minutes
    if (settings.seconds !== null) seconds.value = settings.seconds
  }

  return {
    // 狀態
    minutes,
    seconds,
    remainingSeconds,
    isRunning,
    isPaused,
    initialSeconds,
    isTimeUp,

    // 計算屬性
    totalSeconds,
    isValid,
    displayTime,

    // 方法
    startCountdown,
    togglePause,
    resetCountdown,
    loadTimerSettings
  }
}
