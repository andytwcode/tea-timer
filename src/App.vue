<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 狀態管理 (Task 3.1-3.6)
const minutes = ref(1)
const seconds = ref(0)
const remainingSeconds = ref(0)
const isRunning = ref(false)
const initialSeconds = ref(0)
const isTimeUp = ref(false)

// 連續沖泡模式狀態 (Task 1.1-1.5)
const incrementMinutes = ref(0)
const incrementSeconds = ref(30)
const enableMultiSteep = ref(false)
const currentSteep = ref(1)
const isCompleted = ref(false)

// 可摺疊增量設定狀態 (Task 1.1)
const showIncrementSettings = ref(false)

let intervalId = null

// 計算屬性 (Task 3.7-3.9)
const totalSeconds = computed(() => minutes.value * 60 + seconds.value)
const isValid = computed(() => totalSeconds.value >= 5 && totalSeconds.value <= 600)
const displayTime = computed(() => {
  const mins = Math.floor(remainingSeconds.value / 60)
  const secs = remainingSeconds.value % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

// 連續沖泡計算屬性 (Task 1.6-1.8)
const incrementTotalSeconds = computed(() => 
  incrementMinutes.value * 60 + incrementSeconds.value
)
const currentSteepSeconds = computed(() => {
  const baseTime = totalSeconds.value
  if (!enableMultiSteep.value || incrementTotalSeconds.value === 0) {
    return baseTime
  }
  return baseTime + (currentSteep.value - 1) * incrementTotalSeconds.value
})
const nextSteepSeconds = computed(() => {
  const baseTime = totalSeconds.value
  return baseTime + currentSteep.value * incrementTotalSeconds.value
})

// 按鈕文字邏輯 (Task 4.1-4.5)
const mainButtonText = computed(() => {
  if (isRunning.value) {
    if (enableMultiSteep.value) {
      return `⏸ 第 ${currentSteep.value} 泡計時中`
    }
    return `⏸ 計時中`
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

// 結束沖泡按鈕顯示邏輯 (Task 4.2)
const showEndButton = computed(() => 
  isCompleted.value && 
  enableMultiSteep.value && 
  incrementTotalSeconds.value > 0
)

// 增量設定按鈕文字 (Task 1.2)
const incrementLabel = computed(() => {
  const mins = incrementMinutes.value
  const secs = incrementSeconds.value
  return `⚙️ 設定 (目前：${mins}分${secs}秒)`
})

// 初始化 (Task 10.5)
onMounted(() => {
  document.title = '泡茶計時器'
  
  // 註冊 Service Worker（Android Chrome 需要才能安裝 PWA）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/tea-timer/sw.js').catch(() => {
      // 靜默失敗，不影響應用功能
    })
  }
  
  // 請求通知權限 (Task 4.1-4.5)
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  // 讀取 localStorage (Task 8.4-8.6, 9.3-9.6, 2.1-2.2, 9.1-9.4)
  try {
    const savedMinutes = localStorage.getItem('teaTimerMinutes')
    const savedSeconds = localStorage.getItem('teaTimerSeconds')
    const savedIncrementMinutes = localStorage.getItem('teaTimerIncrementMinutes')  // Task 8.4
    const savedIncrementSeconds = localStorage.getItem('teaTimerIncrementSeconds')  // Task 8.5
    const savedMultiSteepEnabled = localStorage.getItem('teaTimerMultiSteepEnabled')  // Task 8.6
    const savedShowIncrementSettings = localStorage.getItem('teaTimerShowIncrementSettings')  // Task 2.1, 9.1
    
    if (savedMinutes !== null) minutes.value = parseInt(savedMinutes)
    if (savedSeconds !== null) seconds.value = parseInt(savedSeconds)
    if (savedIncrementMinutes !== null) incrementMinutes.value = parseInt(savedIncrementMinutes)
    if (savedIncrementSeconds !== null) incrementSeconds.value = parseInt(savedIncrementSeconds)
    if (savedMultiSteepEnabled !== null) enableMultiSteep.value = savedMultiSteepEnabled === 'true'
    if (savedShowIncrementSettings !== null) showIncrementSettings.value = savedShowIncrementSettings === 'true'  // Task 2.2, 9.2-9.3
    // Task 9.4: 若為 null，使用預設值 false（已在 ref 初始化時設定）
  } catch (error) {
    console.error('localStorage error:', error)
    // 使用預設值 (已在 ref 初始化時設定)
  }
})

// 自動收起增量設定 (Task 3.1-3.3, 10.1-10.4)
watch(enableMultiSteep, (newValue) => {
  // 只在取消勾選時自動收起，勾選時尊重用戶的展開/收起偏好
  if (!newValue && showIncrementSettings.value) {
    showIncrementSettings.value = false
    try {
      localStorage.setItem('teaTimerShowIncrementSettings', 'false')
    } catch (error) {
      console.error('localStorage save error:', error)
    }
  } else if (newValue) {
    // 勾選時，如果 localStorage 沒有記錄（首次使用），則自動展開
    const saved = localStorage.getItem('teaTimerShowIncrementSettings')
    if (saved === null) {
      showIncrementSettings.value = true
      try {
        localStorage.setItem('teaTimerShowIncrementSettings', 'true')
      } catch (error) {
        console.error('localStorage save error:', error)
      }
    }
  }
})

// 倒數功能 (Task 5.1-5.5)
function startCountdown() {
  if (!isValid.value || isRunning.value) return
  
  // 儲存到 localStorage (Task 8.7-8.9, 9.1-9.2)
  try {
    localStorage.setItem('teaTimerMinutes', minutes.value.toString())
    localStorage.setItem('teaTimerSeconds', seconds.value.toString())
    localStorage.setItem('teaTimerIncrementMinutes', incrementMinutes.value.toString())  // Task 8.7
    localStorage.setItem('teaTimerIncrementSeconds', incrementSeconds.value.toString())  // Task 8.8
    localStorage.setItem('teaTimerMultiSteepEnabled', enableMultiSteep.value.toString())  // Task 8.9
  } catch (error) {
    console.error('localStorage save error:', error)
  }
  
  // 使用當前泡的時間 (Task 5.1)
  initialSeconds.value = currentSteepSeconds.value
  remainingSeconds.value = currentSteepSeconds.value
  isRunning.value = true
  isTimeUp.value = false
  isCompleted.value = false
  
  intervalId = setInterval(() => {
    remainingSeconds.value--
    
    // 更新分頁標題 (Task 9.1-9.4)
    if (remainingSeconds.value > 0) {
      const mins = Math.floor(remainingSeconds.value / 60)
      const secs = remainingSeconds.value % 60
      const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`
      
      // Task 9.3: 連續模式顯示泡數
      if (enableMultiSteep.value) {
        document.title = `第${currentSteep.value}泡 ${timeStr} - 泡茶計時器`
      } else {
        // Task 9.2: 單次模式不顯示泡數
        document.title = `${timeStr} - 泡茶計時器`
      }
    } else {
      // 完成時也根據模式顯示
      if (enableMultiSteep.value) {
        document.title = `第${currentSteep.value}泡 0:00 - 泡茶計時器`
      } else {
        document.title = `0:00 - 泡茶計時器`
      }
    }
    
    if (remainingSeconds.value <= 0) {
      clearInterval(intervalId)
      isRunning.value = false
      isTimeUp.value = true
      isCompleted.value = true  // Task 5.2
      
      // 發送通知 (Task 5.1-6.3)
      if ('Notification' in window && Notification.permission === 'granted') {
        const notificationTitle = '泡茶時間到！'
        const notificationBody = enableMultiSteep.value 
          ? `第 ${currentSteep.value} 泡已完成`
          : '時間到了！'
        
        // 使用 Service Worker 發送通知（支援 Android Chrome）
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: notificationTitle,
            options: {
              body: notificationBody,
              icon: '/tea-timer/icons/icon-192.png',
              vibrate: [200, 100, 200],
              tag: 'tea-timer',
              renotify: true,  // 即使替換也重新播放聲音/震動
              requireInteraction: true
            }
          })
        } else {
          // Fallback for desktop browsers
          const notification = new Notification(notificationTitle, {
            body: notificationBody,
            icon: '/tea-timer/icons/icon-192.png',
            vibrate: [200, 100, 200],
            tag: 'tea-timer',
            renotify: true,  // 即使替換也重新播放聲音/震動
            requireInteraction: true
          })
          
          notification.onclick = () => {
            window.focus()
            notification.close()
          }
        }
      }
      
      // 連續模式下增加泡數 (Task 5.3-5.4)
      if (enableMultiSteep.value && incrementTotalSeconds.value > 0) {
        currentSteep.value++
        // 不重置，等待使用者操作 (Task 5.4)
      }
    }
  }, 1000)
}

// 重置功能 (Task 7.1-7.3)
function resetCountdown() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
  isTimeUp.value = false
  isCompleted.value = false  // Task 7.2
  currentSteep.value = 1  // Task 7.1
  remainingSeconds.value = totalSeconds.value  // Task 7.3: 恢復為第一泡時間
  
  // 恢復標題 (Task 10.3)
  document.title = '泡茶計時器'
}

// 展開/收起增量設定 (Task 1.3, 8.1-8.4)
function toggleIncrementSettings() {
  showIncrementSettings.value = !showIncrementSettings.value
  
  try {
    localStorage.setItem('teaTimerShowIncrementSettings', 
                         showIncrementSettings.value.toString())
  } catch (error) {
    console.error('localStorage save error:', error)
  }
}

// 結束沖泡功能 (Task 4.8)
function endBrewing() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
  isTimeUp.value = false
  isCompleted.value = false
  currentSteep.value = 1
  remainingSeconds.value = totalSeconds.value
  document.title = '泡茶計時器'
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
      <div v-if="!isValid && (minutes > 0 || seconds > 0)" 
           class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center animate-pulse">
        ⚠️ 時間必須在 5 秒到 10 分鐘之間
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
          <div v-if="enableMultiSteep && showIncrementSettings" class="mt-4 pt-4 border-t border-green-200">
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
                  class="w-full px-4 py-3 text-xl text-center font-bold border-2 border-green-200 rounded-xl 
                         focus:outline-none focus:ring-3 focus:ring-green-300 focus:border-green-400 
                         transition-all duration-200 bg-white
                         disabled:bg-gray-100 disabled:text-gray-400"
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
                  class="w-full px-4 py-3 text-xl text-center font-bold border-2 border-green-200 rounded-xl 
                         focus:outline-none focus:ring-3 focus:ring-green-300 focus:border-green-400 
                         transition-all duration-200 bg-white
                         disabled:bg-gray-100 disabled:text-gray-400"
                  :disabled="isRunning"
                />
                <span class="text-xs text-gray-500 text-center mt-1">秒</span>
              </div>
            </div>
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
          @click="startCountdown"
          :disabled="!isValid || isRunning"
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
