/**
 * 連續沖泡模式邏輯
 * 管理多泡茶的狀態和時間計算
 */
import { ref, computed } from 'vue'

export function useMultiSteep() {
  // 狀態
  const incrementMinutes = ref(0)
  const incrementSeconds = ref(30)
  const enableMultiSteep = ref(false)
  const currentSteep = ref(1)
  const isCompleted = ref(false)
  const showIncrementSettings = ref(false)

  // 計算屬性
  const incrementTotalSeconds = computed(() =>
    incrementMinutes.value * 60 + incrementSeconds.value
  )

  const incrementLabel = computed(() => {
    const mins = incrementMinutes.value
    const secs = incrementSeconds.value
    return `⚙️ 設定 (目前：${mins}分${secs}秒)`
  })

  const showEndButton = computed(() =>
    isCompleted.value &&
    enableMultiSteep.value &&
    incrementTotalSeconds.value > 0
  )

  /**
   * 計算當前泡的秒數
   */
  function getCurrentSteepSeconds(baseTotalSeconds) {
    if (!enableMultiSteep.value || incrementTotalSeconds.value === 0) {
      return baseTotalSeconds
    }
    return baseTotalSeconds + (currentSteep.value - 1) * incrementTotalSeconds.value
  }

  /**
   * 計算下一泡的秒數
   */
  function getNextSteepSeconds(baseTotalSeconds) {
    return baseTotalSeconds + currentSteep.value * incrementTotalSeconds.value
  }

  /**
   * 展開/收起增量設定
   */
  function toggleIncrementSettings(storage) {
    showIncrementSettings.value = !showIncrementSettings.value
    storage.saveIncrementSettingsVisibility(showIncrementSettings.value)
  }

  /**
   * 結束沖泡
   */
  function endBrewing() {
    currentSteep.value = 1
    isCompleted.value = false
  }

  /**
   * 完成一泡後增加泡數
   */
  function incrementSteep() {
    if (enableMultiSteep.value && incrementTotalSeconds.value > 0) {
      currentSteep.value++
    }
  }

  /**
   * 開始新的倒數時重置完成狀態
   */
  function startNewCountdown() {
    isCompleted.value = false
  }

  /**
   * 標記倒數完成
   */
  function markCompleted() {
    isCompleted.value = true
  }

  /**
   * 載入設定
   */
  function loadMultiSteepSettings(settings) {
    if (settings.incrementMinutes !== null) incrementMinutes.value = settings.incrementMinutes
    if (settings.incrementSeconds !== null) incrementSeconds.value = settings.incrementSeconds
    if (settings.multiSteepEnabled !== null) enableMultiSteep.value = settings.multiSteepEnabled
    if (settings.showIncrementSettings !== null) showIncrementSettings.value = settings.showIncrementSettings
  }

  return {
    // 狀態
    incrementMinutes,
    incrementSeconds,
    enableMultiSteep,
    currentSteep,
    isCompleted,
    showIncrementSettings,

    // 計算屬性
    incrementTotalSeconds,
    incrementLabel,
    showEndButton,

    // 方法
    getCurrentSteepSeconds,
    getNextSteepSeconds,
    toggleIncrementSettings,
    endBrewing,
    incrementSteep,
    startNewCountdown,
    markCompleted,
    loadMultiSteepSettings
  }
}
