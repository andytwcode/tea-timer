import { computed } from 'vue'

/**
 * 輸入驗證 composable
 * 驗證第一泡時間和增量時間的輸入
 */
export function useValidation(timer, multiSteep) {
  // 第一泡時間驗證（分鐘、秒數、總時間）
  const firstBrewValidation = computed(() => {
    const errors = []
    const fieldErrors = {
      minutes: false,
      seconds: false
    }

    // 優先級 1: 欄位級別驗證
    // 驗證分鐘數
    if (timer.minutes.value < 0) {
      errors.push({ priority: 1, message: '分鐘數不可為負數', fields: ['minutes'] })
      fieldErrors.minutes = true
    } else if (timer.minutes.value > 10) {
      errors.push({ priority: 1, message: '分鐘數不可超過 10', fields: ['minutes'] })
      fieldErrors.minutes = true
    }

    // 驗證秒數
    if (timer.seconds.value < 0) {
      errors.push({ priority: 1, message: '秒數不可為負數', fields: ['seconds'] })
      fieldErrors.seconds = true
    } else if (timer.seconds.value > 59) {
      errors.push({ priority: 1, message: '秒數不可超過 59', fields: ['seconds'] })
      fieldErrors.seconds = true
    }

    // 優先級 2: 總時間驗證（只在欄位驗證都通過時檢查）
    if (!fieldErrors.minutes && !fieldErrors.seconds) {
      const totalSeconds = timer.totalSeconds.value
      if (totalSeconds > 0 && (totalSeconds < 5 || totalSeconds > 600)) {
        errors.push({ 
          priority: 2, 
          message: '第一泡時間必須在 5 秒到 10 分鐘之間', 
          fields: ['minutes', 'seconds'] 
        })
        fieldErrors.minutes = true
        fieldErrors.seconds = true
      }
    }

    return { errors, fieldErrors }
  })

  // 增量時間驗證（僅在啟用連續沖泡時）
  const incrementValidation = computed(() => {
    const errors = []
    const fieldErrors = {
      incrementMinutes: false,
      incrementSeconds: false
    }

    // 只在連續沖泡模式啟用時驗證
    if (!multiSteep.enableMultiSteep.value) {
      return { errors, fieldErrors }
    }

    // 優先級 3: 增量驗證
    // 驗證增量分鐘數
    if (multiSteep.incrementMinutes.value < 0) {
      errors.push({ priority: 3, message: '增量分鐘數不可為負數', fields: ['incrementMinutes'] })
      fieldErrors.incrementMinutes = true
    }

    // 驗證增量秒數
    if (multiSteep.incrementSeconds.value < 0) {
      errors.push({ priority: 3, message: '增量秒數不可為負數', fields: ['incrementSeconds'] })
      fieldErrors.incrementSeconds = true
    } else if (multiSteep.incrementSeconds.value > 59) {
      errors.push({ priority: 3, message: '增量秒數不可超過 59', fields: ['incrementSeconds'] })
      fieldErrors.incrementSeconds = true
    }

    return { errors, fieldErrors }
  })

  // 合併驗證結果並排序優先級
  const validationResult = computed(() => {
    const allErrors = [
      ...firstBrewValidation.value.errors,
      ...incrementValidation.value.errors
    ]

    // 按優先級排序（優先級 1 > 2 > 3）
    allErrors.sort((a, b) => a.priority - b.priority)

    // 分離主要錯誤（優先級 1-2）和增量錯誤（優先級 3）
    const primaryErrors = allErrors.filter(e => e.priority <= 2)
    const incrementErrors = allErrors.filter(e => e.priority === 3)

    // 合併所有欄位錯誤標記
    const allFieldErrors = {
      ...firstBrewValidation.value.fieldErrors,
      ...incrementValidation.value.fieldErrors
    }

    return {
      isValid: allErrors.length === 0,
      primaryError: primaryErrors.length > 0 ? primaryErrors[0].message : null,
      incrementError: incrementErrors.length > 0 ? incrementErrors[0].message : null,
      hasFieldError: (fieldName) => allFieldErrors[fieldName] === true
    }
  })

  return {
    validationResult
  }
}
