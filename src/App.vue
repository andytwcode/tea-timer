<script setup>
import { ref, computed, onMounted } from 'vue'

// 狀態管理 (Task 3.1-3.6)
const minutes = ref(3)
const seconds = ref(0)
const remainingSeconds = ref(0)
const isRunning = ref(false)
const initialSeconds = ref(0)
const isTimeUp = ref(false)

let intervalId = null

// 計算屬性 (Task 3.7-3.9)
const totalSeconds = computed(() => minutes.value * 60 + seconds.value)
const isValid = computed(() => totalSeconds.value >= 5 && totalSeconds.value <= 600)
const displayTime = computed(() => {
  const mins = Math.floor(remainingSeconds.value / 60)
  const secs = remainingSeconds.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

// 初始化 (Task 10.5)
onMounted(() => {
  document.title = 'Tea Timer'
  
  // 讀取 localStorage (Task 9.3-9.6)
  try {
    const savedMinutes = localStorage.getItem('teaTimerMinutes')
    const savedSeconds = localStorage.getItem('teaTimerSeconds')
    
    if (savedMinutes !== null) minutes.value = parseInt(savedMinutes)
    if (savedSeconds !== null) seconds.value = parseInt(savedSeconds)
  } catch (error) {
    console.error('localStorage error:', error)
    // 使用預設值 (已在 ref 初始化時設定)
  }
})

// 倒數功能 (Task 5.1-5.5)
function startCountdown() {
  if (!isValid.value || isRunning.value) return
  
  // 儲存到 localStorage (Task 9.1-9.2)
  try {
    localStorage.setItem('teaTimerMinutes', minutes.value.toString())
    localStorage.setItem('teaTimerSeconds', seconds.value.toString())
  } catch (error) {
    console.error('localStorage save error:', error)
  }
  
  initialSeconds.value = totalSeconds.value
  remainingSeconds.value = totalSeconds.value
  isRunning.value = true
  isTimeUp.value = false
  
  intervalId = setInterval(() => {
    remainingSeconds.value--
    
    // 更新分頁標題 (Task 10.1-10.2, 10.4)
    if (remainingSeconds.value > 0) {
      const mins = Math.floor(remainingSeconds.value / 60)
      const secs = remainingSeconds.value % 60
      document.title = `[${mins}:${secs.toString().padStart(2, '0')}] Tea Timer`
    } else {
      document.title = '[0:00] Tea Timer'
    }
    
    if (remainingSeconds.value <= 0) {
      clearInterval(intervalId)
      isRunning.value = false
      isTimeUp.value = true
    }
  }, 1000)
}

// 重置功能 (Task 5.6-5.7)
function resetCountdown() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
  isTimeUp.value = false
  remainingSeconds.value = initialSeconds.value || totalSeconds.value
  
  // 恢復標題 (Task 10.3)
  document.title = 'Tea Timer'
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
          Tea Timer
        </h1>
        <p class="text-sm text-gray-500">專注品茶的美好時光</p>
      </div>
      
      <!-- 錯誤訊息 -->
      <div v-if="!isValid && (minutes > 0 || seconds > 0)" 
           class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-pulse">
        ⚠️ 時間必須在 5 秒到 10 分鐘之間
      </div>
      
      <!-- 輸入區 -->
      <div class="space-y-4">
        <div class="flex gap-4 justify-center">
          <div class="flex flex-col flex-1">
            <label class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">分鐘</label>
            <input 
              v-model.number="minutes"
              type="number" 
              min="0" 
              max="10"
              class="w-full px-5 py-4 text-2xl text-center font-bold border-2 border-gray-200 rounded-2xl 
                     focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 
                     transition-all duration-200 bg-gray-50
                     disabled:bg-gray-100 disabled:text-gray-400"
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
              class="w-full px-5 py-4 text-2xl text-center font-bold border-2 border-gray-200 rounded-2xl 
                     focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 
                     transition-all duration-200 bg-gray-50
                     disabled:bg-gray-100 disabled:text-gray-400"
              :disabled="isRunning"
            />
          </div>
        </div>
        
        <!-- 上次使用提示 -->
        <div v-if="!isRunning && !isTimeUp" class="text-xs text-center text-gray-400">
          💾 上次使用：{{ minutes }} 分 {{ seconds }} 秒
        </div>
      </div>
      
      <!-- 倒數顯示區 -->
      <div class="relative">
        <div class="absolute inset-0 bg-linear-to-r from-green-400/20 to-teal-400/20 rounded-3xl blur-xl"></div>
        <div class="relative bg-linear-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border-2 border-gray-200">
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
            <div v-else-if="isTimeUp" class="mt-3 text-sm text-red-500 font-semibold">
              ✨ 時間到！
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
          @click="startCountdown"
          :disabled="!isValid || isRunning"
          class="flex-1 px-6 py-4 text-lg font-bold rounded-2xl transition-all duration-200
                 bg-linear-to-r from-green-500 to-teal-500 text-white shadow-lg
                 hover:from-green-600 hover:to-teal-600 hover:shadow-xl hover:scale-105
                 active:scale-95
                 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                 disabled:hover:scale-100 disabled:shadow-none"
        >
          <span v-if="!isRunning">▶ 開始</span>
          <span v-else class="opacity-50">⏸ 計時中</span>
        </button>
        <button
          @click="resetCountdown"
          class="flex-1 px-6 py-4 text-lg font-bold rounded-2xl transition-all duration-200
                 bg-linear-to-r from-gray-500 to-gray-600 text-white shadow-lg
                 hover:from-gray-600 hover:to-gray-700 hover:shadow-xl hover:scale-105
                 active:scale-95"
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
