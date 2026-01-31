/**
 * localStorage 持久化存儲
 * 管理計時器設定的讀取和保存
 */

const KEYS = {
  MINUTES: 'teaTimerMinutes',
  SECONDS: 'teaTimerSeconds',
  INCREMENT_MINUTES: 'teaTimerIncrementMinutes',
  INCREMENT_SECONDS: 'teaTimerIncrementSeconds',
  MULTI_STEEP_ENABLED: 'teaTimerMultiSteepEnabled',
  SHOW_INCREMENT_SETTINGS: 'teaTimerShowIncrementSettings'
}

export function useLocalStorage() {
  /**
   * 讀取所有設定
   */
  function loadSettings() {
    try {
      const minutes = localStorage.getItem(KEYS.MINUTES)
      const seconds = localStorage.getItem(KEYS.SECONDS)
      const incrementMinutes = localStorage.getItem(KEYS.INCREMENT_MINUTES)
      const incrementSeconds = localStorage.getItem(KEYS.INCREMENT_SECONDS)
      const multiSteepEnabled = localStorage.getItem(KEYS.MULTI_STEEP_ENABLED)
      const showIncrementSettings = localStorage.getItem(KEYS.SHOW_INCREMENT_SETTINGS)

      return {
        minutes: minutes !== null ? parseInt(minutes) : null,
        seconds: seconds !== null ? parseInt(seconds) : null,
        incrementMinutes: incrementMinutes !== null ? parseInt(incrementMinutes) : null,
        incrementSeconds: incrementSeconds !== null ? parseInt(incrementSeconds) : null,
        multiSteepEnabled: multiSteepEnabled !== null ? multiSteepEnabled === 'true' : null,
        showIncrementSettings: showIncrementSettings !== null ? showIncrementSettings === 'true' : null
      }
    } catch (error) {
      console.error('localStorage load error:', error)
      return {}
    }
  }

  /**
   * 保存計時器設定
   */
  function saveTimerSettings(minutes, seconds, incrementMinutes, incrementSeconds, multiSteepEnabled) {
    try {
      localStorage.setItem(KEYS.MINUTES, minutes.toString())
      localStorage.setItem(KEYS.SECONDS, seconds.toString())
      localStorage.setItem(KEYS.INCREMENT_MINUTES, incrementMinutes.toString())
      localStorage.setItem(KEYS.INCREMENT_SECONDS, incrementSeconds.toString())
      localStorage.setItem(KEYS.MULTI_STEEP_ENABLED, multiSteepEnabled.toString())
    } catch (error) {
      console.error('localStorage save error:', error)
    }
  }

  /**
   * 保存增量設定顯示狀態
   */
  function saveIncrementSettingsVisibility(visible) {
    try {
      localStorage.setItem(KEYS.SHOW_INCREMENT_SETTINGS, visible.toString())
    } catch (error) {
      console.error('localStorage save error:', error)
    }
  }

  /**
   * 檢查增量設定是否有歷史記錄
   */
  function hasIncrementSettingsHistory() {
    return localStorage.getItem(KEYS.SHOW_INCREMENT_SETTINGS) !== null
  }

  return {
    loadSettings,
    saveTimerSettings,
    saveIncrementSettingsVisibility,
    hasIncrementSettingsHistory
  }
}
