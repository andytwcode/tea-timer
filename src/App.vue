<script setup>
import { computed, onMounted, watch, toRefs } from 'vue'
import { usePWA } from './composables/usePWA'
import { useLocalStorage } from './composables/useLocalStorage'
import { useNotification } from './composables/useNotification'
import { useTimer } from './composables/useTimer'
import { useMultiSteep } from './composables/useMultiSteep'
import { useValidation } from './composables/useValidation'

// Composables
const pwa = usePWA()
const storage = useLocalStorage()
const notification = useNotification()
const timer = useTimer()
const multiSteep = useMultiSteep()
const { validationResult } = useValidation(timer, multiSteep)

// 解構暴露給 template（Vue 會自動 unwrap top-level refs）
const {
  minutes,
  seconds,
  isRunning,
  isPaused,
  isTimeUp,
  totalSeconds,
  isValid,
  displayTime
} = timer

const {
  incrementMinutes,
  incrementSeconds,
  enableMultiSteep,
  currentSteep,
  isCompleted,
  showIncrementSettings,
  incrementTotalSeconds,
  incrementLabel,
  showEndButton
} = multiSteep

// 計算屬性 - 當前泡的秒數
const currentSteepSeconds = computed(() => 
  multiSteep.getCurrentSteepSeconds(totalSeconds.value)
)

// 按鈕文字邏輯
const mainButtonText = computed(() => {
  if (isRunning.value && !isPaused.value) {
    // 計時中
    if (enableMultiSteep.value) {
      return `⏸ 暫停第 ${currentSteep.value} 泡`
    }
    return `⏸ 暫停`
  }
  
  if (isRunning.value && isPaused.value) {
    // 已暫停
    if (enableMultiSteep.value) {
      return `▶ 繼續第 ${currentSteep.value} 泡`
    }
    return `▶ 繼續`
  }
  
  if (isCompleted.value) {
    if (enableMultiSteep.value && incrementTotalSeconds.value > 0) {
      return `▶ 開始第 ${currentSteep.value} 泡 (${currentSteepSeconds.value}秒)`
    }
    return `▶ 重新開始`
  }
  
  if (enableMultiSteep.value) {
    return `▶ 開始第 ${currentSteep.value} 泡`
  }
  
  return `▶ 開始`
})

// 初始化
onMounted(() => {
  document.title = '泡茶計時器'
  
  // 註冊 PWA Service Worker
  pwa.register()
  
  // 請求通知權限
  notification.requestPermission()
  
  // 讀取 localStorage 設定
  const settings = storage.loadSettings()
  timer.loadTimerSettings(settings)
  multiSteep.loadMultiSteepSettings(settings)
})

// 自動收起增量設定
watch(enableMultiSteep, (newValue) => {
  if (!newValue && showIncrementSettings.value) {
    // 取消勾選時自動收起
    showIncrementSettings.value = false
    storage.saveIncrementSettingsVisibility(false)
  } else if (newValue && !storage.hasIncrementSettingsHistory()) {
    // 首次勾選時自動展開
    showIncrementSettings.value = true
    storage.saveIncrementSettingsVisibility(true)
  }
})

// 倒數功能
function startCountdown() {
  if (!isValid.value || (isRunning.value && !isPaused.value)) return
  
  // 如果是從暫停恢復，直接繼續
  if (isPaused.value) {
    handleTogglePause()
    return
  }
  
  // 儲存設定到 localStorage
  storage.saveTimerSettings(
    minutes.value,
    seconds.value,
    incrementMinutes.value,
    incrementSeconds.value,
    enableMultiSteep.value
  )
  
  // 開始新的倒數
  multiSteep.startNewCountdown()
  
  // 使用 timer composable 的 startCountdown，傳入完成回調
  timer.startCountdown(
    currentSteepSeconds.value,
    currentSteep.value,
    enableMultiSteep.value,
    handleCountdownComplete
  )
}

// 倒數完成處理
function handleCountdownComplete() {
  multiSteep.markCompleted()
  
  // 發送通知
  notification.sendTimerCompleteNotification(
    currentSteep.value,
    enableMultiSteep.value
  )
  
  // 連續模式下增加泡數
  multiSteep.incrementSteep()
}

// 暫停/繼續功能
function handleTogglePause() {
  timer.togglePause(
    currentSteep.value,
    enableMultiSteep.value,
    handleCountdownComplete
  )
}

// 重置功能
function resetCountdown() {
  timer.resetCountdown()
  multiSteep.endBrewing()
}

// 展開/收起增量設定
function toggleIncrementSettings() {
  multiSteep.toggleIncrementSettings(storage)
}

// 結束沖泡功能
function endBrewing() {
  timer.resetCountdown()
  multiSteep.endBrewing()
}
</script>

<template>
  <!-- 整體佈局 - 漸層背景 -->
  <div class="flex items-center justify-center min-h-screen bg-linear-to-br from-green-50 via-teal-50 to-blue-50">
    <div class="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl max-w-md w-full space-y-8 border border-white/20">
      
      <!-- 標題區 -->
      <div class="text-center space-y-2">
        <div class="text-5xl mb-2">🍵</div>
        <h1 class="text-3xl font-bold bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          泡茶計時器
        </h1>
        <p class="text-sm text-gray-500">專注品茶的美好時光</p>
      </div>
      
      <!-- 錯誤訊息 -->
      <div v-if="validationResult.primaryError" 
           class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-pulse">
        ⚠️ {{ validationResult.primaryError }}
      </div>
      
      <!-- 輸入區 -->
      <div class="space-y-4">
        <div class="flex gap-4 justify-center">
          <div class="flex flex-col flex-1">
            <label class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">第一泡分鐘</label>
            <input 
              v-model.number="minutes"
              type="number" 
              min="0" 
              max="10"
              step="1"
              :class="[
                'w-full px-5 py-4 text-2xl text-center font-bold rounded-2xl transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-4',
                validationResult.hasFieldError('minutes')
                  ? 'border-2 border-red-400 focus:ring-red-200 focus:border-red-500'
                  : 'border-2 border-gray-200 focus:ring-green-200 focus:border-green-400'
              ]"
              :disabled="isRunning"
            />
          </div>
          <div class="flex items-end pb-4 text-2xl font-bold text-gray-400">:</div>
          <div class="flex flex-col flex-1">
            <label class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">秒</label>
            <input 
              v-model.number="seconds"
              type="number" 
              min="0" 
              max="59"
              step="1"
              :class="[
                'w-full px-5 py-4 text-2xl text-center font-bold rounded-2xl transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-4',
                validationResult.hasFieldError('seconds')
                  ? 'border-2 border-red-400 focus:ring-red-200 focus:border-red-500'
                  : 'border-2 border-gray-200 focus:ring-green-200 focus:border-green-400'
              ]"
              :disabled="isRunning"
            />
          </div>
        </div>
        
        <!-- 連續沖泡控制 (Task 2.1-2.5, 4.1-4.5) -->
        <div class="bg-linear-to-r from-green-50 to-teal-50 p-4 rounded-2xl border border-green-100">
          <!-- 頂部按鈕容器 (Task 4.1-4.5) -->
          <div class="flex justify-between items-center">
            <label class="flex items-center gap-3 cursor-pointer group">
              <input 
                v-model="enableMultiSteep" 
                type="checkbox"
                class="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                :disabled="isRunning"
              />
              <span class="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                啟用連續沖泡
              </span>
            </label>
            
            <!-- 展開/收起按鈕 (Task 4.3-4.5, 6.1-6.4) -->
            <button 
              v-if="enableMultiSteep"
              @click="toggleIncrementSettings"
              class="text-sm text-gray-600 hover:text-green-600 transition-colors px-3 py-1 rounded-lg hover:bg-white/50 cursor-pointer"
            >
              {{ showIncrementSettings ? '▲ 收起' : incrementLabel }}
            </button>
          </div>
          
          <!-- 增量輸入欄位 (Task 2.2-2.5, 5.1-5.3) -->
          <div v-if="multiSteep.enableMultiSteep && showIncrementSettings" class="mt-4 pt-4 border-t border-green-200">
            <!-- 增量錯誤訊息 -->
            <div v-if="validationResult.incrementError" 
                 class="mb-3 bg-orange-50 border border-orange-200 text-orange-600 px-3 py-2 rounded-lg text-xs text-center">
              ⚠️ {{ validationResult.incrementError }}
            </div>
            
            <label class="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              每泡增加時間
            </label>
            <div class="flex gap-3 items-center">
              <div class="flex flex-col flex-1">
                <input 
                  v-model.number="incrementMinutes"
                  type="number" 
                  min="0" 
                  max="10"
                  step="1"
                  :class="[
                    'w-full px-4 py-3 text-xl text-center font-bold rounded-xl transition-all duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-3',
                    validationResult.hasFieldError('incrementMinutes')
                      ? 'border-2 border-red-400 focus:ring-red-200 focus:border-red-500'
                      : 'border-2 border-green-200 focus:ring-green-300 focus:border-green-400'
                  ]"
                  :disabled="isRunning"
                />
                <span class="text-xs text-gray-500 text-center mt-1">分</span>
              </div>
              <div class="text-xl font-bold text-gray-400">:</div>
              <div class="flex flex-col flex-1">
                <input 
                  v-model.number="incrementSeconds"
                  type="number" 
                  min="0" 
                  max="59"
                  step="1"
                  :class="[
                    'w-full px-4 py-3 text-xl text-center font-bold rounded-xl transition-all duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-3',
                    validationResult.hasFieldError('incrementSeconds')
                      ? 'border-2 border-red-400 focus:ring-red-200 focus:border-red-500'
                      : 'border-2 border-green-200 focus:ring-green-300 focus:border-green-400'
                  ]"
                  :disabled="isRunning"
                />
                <span class="text-xs text-gray-500 text-center mt-1">秒</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 倒數顯示區 -->
      <div class="relative">
        <div class="absolute inset-0 bg-linear-to-r from-green-400/20 to-teal-400/20 rounded-3xl blur-xl"></div>
        <div class="relative bg-linear-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border-2 border-gray-200">
          
          <!-- 泡數計數器 (Task 3.1-3.3) -->
          <div v-if="enableMultiSteep" class="text-center mb-4">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg">
              <span class="text-sm font-bold">🍃 當前：第 {{ currentSteep }} 泡</span>
            </div>
          </div>
          
          <div class="text-center">
            <div 
              :class="{ 'animate-blink text-red-500': isTimeUp, 'text-gray-800': !isTimeUp }"
              class="text-8xl font-mono font-bold tracking-tight transition-colors duration-300"
            >
              {{ displayTime }}
            </div>
            <div v-if="isRunning" class="mt-3 text-sm text-gray-500 animate-pulse">
              ⏳ 計時中...
            </div>
            <!-- 完成狀態文字 (Task 6.1-6.3) -->
            <div v-else-if="isTimeUp" class="mt-3 text-sm text-red-500 font-semibold">
              <span v-if="enableMultiSteep">✨ 第 {{ currentSteep - 1 }} 泡完成！</span>
              <span v-else>✨ 時間到！</span>
            </div>
            <div v-else class="mt-3 text-sm text-gray-400">
              等待開始
            </div>
          </div>
        </div>
      </div>
      
      <!-- 按鈕區 -->
      <div class="flex gap-4">
        <button
          @click="isRunning ? handleTogglePause() : startCountdown()"
          :disabled="!validationResult.isValid && !isRunning"
          class="flex-1 px-6 py-4 text-lg font-bold rounded-2xl transition-all duration-200
                 bg-linear-to-r from-green-500 to-teal-500 text-white shadow-lg
                 hover:from-green-600 hover:to-teal-600 hover:shadow-xl hover:scale-105
                 active:scale-95 cursor-pointer
                 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                 disabled:hover:scale-100 disabled:shadow-none"
        >
          {{ mainButtonText }}
        </button>
        
        <!-- 結束沖泡按鈕 (Task 4.6-4.7) -->
        <button
          v-if="showEndButton"
          @click="endBrewing"
          class="flex-1 px-6 py-4 text-lg font-bold rounded-2xl transition-all duration-200
                 bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg
                 hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-105
                 active:scale-95 cursor-pointer"
        >
          🛑 結束沖泡
        </button>
        
        <button
          v-if="!showEndButton"
          @click="resetCountdown"
          class="flex-1 px-6 py-4 text-lg font-bold rounded-2xl transition-all duration-200
                 bg-linear-to-r from-gray-500 to-gray-600 text-white shadow-lg
                 hover:from-gray-600 hover:to-gray-700 hover:shadow-xl hover:scale-105
                 active:scale-95 cursor-pointer"
        >
          🔄 重置
        </button>
      </div>
      
      <!-- 底部提示 -->
      <div class="text-center text-xs text-gray-400 space-y-1 pt-4 border-t border-gray-200">
        <div>💡 倒數時分頁標題會同步顯示剩餘時間</div>
        <div>🔔 時間到達時會有閃爍提醒</div>
      </div>
    </div>
  </div>
</template>


