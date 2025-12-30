import { ref } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAttendanceSheet } from './useAttendanceSheet'

export interface RSVPData {
  side: 'groom' | 'bride' | null
  attending: boolean | null
  guestCount: number
  mealCount: number
  name: string
  phoneLast4: string
  message: string
}

export interface RSVPEntry extends RSVPData {
  id: string
  createdAt: Date
  updatedAt?: Date
}

const initialData: RSVPData = {
  side: null,
  attending: null,
  guestCount: 1,
  mealCount: 1,
  name: '',
  phoneLast4: '',
  message: ''
}

export function useRSVP() {
  const formData = ref<RSVPData>({ ...initialData })
  const currentStep = ref(1)
  const totalSteps = ref(4)
  const isSubmitting = ref(false)
  const isComplete = ref(false)
  const error = ref<string | null>(null)
  const existingEntry = ref<RSVPEntry | null>(null)
  const sideAutoSelected = ref(false) // URL 파라미터로 side가 자동 선택되었는지 여부
  const { markAsSubmitted } = useAttendanceSheet()

  // 스텝 계산 (참석/불참 모두 4단계)
  // 참석: Side(1) → Attending(2) → Count(3) → Info(4)
  // 불참: Side(1) → Attending(2) → Message(3) → Info(4)
  const getActualTotalSteps = () => {
    return 4
  }

  // 다음 스텝으로
  const nextStep = () => {
    if (currentStep.value < 4) {
      currentStep.value++
    }
  }

  // 이전 스텝으로
  const prevStep = () => {
    // side가 자동 선택된 경우 step 1로 가지 않음
    const minStep = sideAutoSelected.value ? 2 : 1
    if (currentStep.value > minStep) {
      currentStep.value--
    }
  }

  // 현재 스텝이 유효한지 확인
  const isCurrentStepValid = (): boolean => {
    switch (currentStep.value) {
      case 1:
        return formData.value.side !== null
      case 2:
        return formData.value.attending !== null
      case 3:
        // 참석: 인원 선택 / 불참: 메시지 (선택사항이므로 항상 유효)
        if (formData.value.attending) {
          return formData.value.guestCount >= 1 && formData.value.mealCount >= 0
        }
        return true // 메시지는 선택사항
      case 4:
        return formData.value.name.trim().length >= 2 &&
               formData.value.phoneLast4.length === 4
      default:
        return false
    }
  }

  // 기존 RSVP 확인
  const checkExisting = async (name: string, phoneLast4: string): Promise<RSVPEntry | null> => {
    try {
      const rsvpRef = collection(db, 'rsvp')
      const q = query(
        rsvpRef,
        where('name', '==', name.trim()),
        where('phoneLast4', '==', phoneLast4)
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          side: data.side,
          attending: data.attending,
          guestCount: data.guestCount,
          mealCount: data.mealCount,
          name: data.name,
          phoneLast4: data.phoneLast4,
          message: data.message || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate()
        }
      }
      return null
    } catch (err) {
      console.error('Failed to check existing RSVP:', err)
      return null
    }
  }

  // 방명록에 메시지 추가 (불참 시)
  const addToGuestbook = async (name: string, message: string): Promise<void> => {
    if (!message.trim()) return

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: Timestamp.now()
      })
    } catch (err) {
      console.error('Failed to add message to guestbook:', err)
      // 방명록 추가 실패는 RSVP 제출 실패로 처리하지 않음
    }
  }

  // RSVP 제출
  const submitRSVP = async (): Promise<boolean> => {
    if (!isCurrentStepValid()) {
      error.value = '모든 정보를 입력해주세요.'
      return false
    }

    isSubmitting.value = true
    error.value = null

    try {
      const existing = await checkExisting(formData.value.name, formData.value.phoneLast4)

      const rsvpData = {
        side: formData.value.side,
        attending: formData.value.attending,
        guestCount: formData.value.attending ? formData.value.guestCount : 0,
        mealCount: formData.value.attending ? formData.value.mealCount : 0,
        name: formData.value.name.trim(),
        phoneLast4: formData.value.phoneLast4
      }

      if (existing) {
        // 기존 응답 수정
        const docRef = doc(db, 'rsvp', existing.id)
        await updateDoc(docRef, {
          ...rsvpData,
          updatedAt: Timestamp.now()
        })
        existingEntry.value = existing
      } else {
        // 새 응답 추가
        await addDoc(collection(db, 'rsvp'), {
          ...rsvpData,
          createdAt: Timestamp.now()
        })
      }

      // 불참 시 메시지가 있으면 방명록에도 추가
      if (!formData.value.attending && formData.value.message.trim()) {
        await addToGuestbook(formData.value.name, formData.value.message)
      }

      // localStorage에 제출 완료 상태 저장 (다시 방문해도 Sheet 미표시)
      markAsSubmitted(formData.value.name, formData.value.attending ?? false)

      isComplete.value = true
      return true
    } catch (err) {
      console.error('Failed to submit RSVP:', err)
      error.value = '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // 폼 초기화
  const resetForm = () => {
    formData.value = { ...initialData }
    currentStep.value = 1
    totalSteps.value = 4
    isComplete.value = false
    error.value = null
    existingEntry.value = null
  }

  // URL 파라미터 기반 초기 side 설정 (부모님 공유 링크용)
  const initFromUrlParams = () => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    const from = urlParams.get('from')

    if (from === 'groom-parent') {
      formData.value.side = 'groom'
      sideAutoSelected.value = true
      currentStep.value = 2 // Step 1 건너뛰기
    } else if (from === 'bride-parent') {
      formData.value.side = 'bride'
      sideAutoSelected.value = true
      currentStep.value = 2 // Step 1 건너뛰기
    }
  }

  return {
    formData,
    currentStep,
    totalSteps,
    isSubmitting,
    isComplete,
    error,
    existingEntry,
    sideAutoSelected,
    nextStep,
    prevStep,
    isCurrentStepValid,
    submitRSVP,
    resetForm,
    getActualTotalSteps,
    initFromUrlParams
  }
}
