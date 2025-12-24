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

export interface RSVPData {
  side: 'groom' | 'bride' | null
  attending: boolean | null
  guestCount: number
  mealCount: number
  name: string
  phoneLast4: string
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
  phoneLast4: ''
}

export function useRSVP() {
  const formData = ref<RSVPData>({ ...initialData })
  const currentStep = ref(1)
  const totalSteps = ref(4)
  const isSubmitting = ref(false)
  const isComplete = ref(false)
  const error = ref<string | null>(null)
  const existingEntry = ref<RSVPEntry | null>(null)

  // 스텝 계산 (불참 시 인원 선택 스킵)
  const getActualTotalSteps = () => {
    return formData.value.attending === false ? 3 : 4
  }

  // 다음 스텝으로
  const nextStep = () => {
    const actualTotal = getActualTotalSteps()

    // 불참 선택 시 인원 선택 스킵
    if (currentStep.value === 2 && formData.value.attending === false) {
      currentStep.value = 4 // 바로 정보 입력으로
    } else if (currentStep.value < actualTotal) {
      currentStep.value++
    }

    totalSteps.value = actualTotal
  }

  // 이전 스텝으로
  const prevStep = () => {
    // 불참 상태에서 정보 입력에서 뒤로 가면 참석 여부로
    if (currentStep.value === 4 && formData.value.attending === false) {
      currentStep.value = 2
    } else if (currentStep.value > 1) {
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
        return formData.value.guestCount >= 1 && formData.value.mealCount >= 0
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

  return {
    formData,
    currentStep,
    totalSteps,
    isSubmitting,
    isComplete,
    error,
    existingEntry,
    nextStep,
    prevStep,
    isCurrentStepValid,
    submitRSVP,
    resetForm,
    getActualTotalSteps
  }
}
