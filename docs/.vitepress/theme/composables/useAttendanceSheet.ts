import { computed } from 'vue'
import { useStorage, useSessionStorage } from '@vueuse/core'

const SUBMITTED_KEY = 'wedding-rsvp-submitted'
const DISMISSED_KEY = 'wedding-attendance-sheet-dismissed'

export interface RSVPSubmittedStatus {
  submitted: true
  submittedAt: string
  name: string
  attending: boolean
}

export function useAttendanceSheet() {
  // localStorage: RSVP 제출 완료 여부 (영구 저장)
  const submittedStatus = useStorage<RSVPSubmittedStatus | null>(
    SUBMITTED_KEY,
    null
  )

  // sessionStorage: "나중에" 클릭 여부 (세션 종료 시 초기화)
  const isDismissed = useSessionStorage(DISMISSED_KEY, false)

  // Sheet 표시 여부
  const shouldShow = computed(() => {
    // 이미 제출했으면 표시 안 함
    if (submittedStatus.value?.submitted) return false
    // 이번 세션에서 닫았으면 표시 안 함
    if (isDismissed.value) return false
    return true
  })

  // "나중에" 버튼 클릭
  const dismiss = () => {
    isDismissed.value = true
  }

  // RSVP 제출 완료 시 호출
  const markAsSubmitted = (name: string, attending: boolean) => {
    submittedStatus.value = {
      submitted: true,
      submittedAt: new Date().toISOString(),
      name,
      attending
    }
  }

  // 제출 정보 (재방문 시 활용 가능)
  const submittedInfo = computed(() => submittedStatus.value)

  return {
    shouldShow,
    dismiss,
    markAsSubmitted,
    submittedInfo
  }
}
