import { ref, onMounted, onUnmounted } from 'vue'
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  limit,
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface GuestbookMessage {
  id: string
  name: string
  message: string
  createdAt: Date
}

interface FirestoreMessage {
  name: string
  message: string
  createdAt: Timestamp
}

export function useGuestbook() {
  const messages = ref<GuestbookMessage[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const isSubmitting = ref(false)

  let unsubscribe: Unsubscribe | null = null

  // 실시간 메시지 구독
  const subscribeToMessages = () => {
    try {
      const messagesRef = collection(db, 'guestbook')
      const q = query(
        messagesRef,
        orderBy('createdAt', 'desc'),
        limit(100) // 최근 100개 메시지만 표시
      )

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          messages.value = snapshot.docs.map((doc) => {
            const data = doc.data() as FirestoreMessage
            return {
              id: doc.id,
              name: data.name,
              message: data.message,
              createdAt: data.createdAt?.toDate() || new Date()
            }
          })
          isLoading.value = false
          error.value = null
        },
        (err) => {
          console.error('Guestbook subscription error:', err)
          error.value = '메시지를 불러오는 중 오류가 발생했습니다.'
          isLoading.value = false
        }
      )
    } catch (err) {
      console.error('Failed to subscribe to guestbook:', err)
      error.value = '연결 중 오류가 발생했습니다.'
      isLoading.value = false
    }
  }

  // 메시지 추가
  const addMessage = async (name: string, message: string): Promise<boolean> => {
    if (!name.trim() || !message.trim()) {
      error.value = '이름과 메시지를 모두 입력해주세요.'
      return false
    }

    // 간단한 유효성 검사
    if (name.length > 20) {
      error.value = '이름은 20자 이내로 입력해주세요.'
      return false
    }

    if (message.length > 500) {
      error.value = '메시지는 500자 이내로 입력해주세요.'
      return false
    }

    isSubmitting.value = true
    error.value = null

    try {
      const messagesRef = collection(db, 'guestbook')
      await addDoc(messagesRef, {
        name: name.trim(),
        message: message.trim(),
        createdAt: Timestamp.now()
      })
      return true
    } catch (err) {
      console.error('Failed to add message:', err)
      error.value = '메시지 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // 시간 포맷팅
  const formatTime = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  onMounted(() => {
    subscribeToMessages()
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  return {
    messages,
    isLoading,
    error,
    isSubmitting,
    addMessage,
    formatTime
  }
}
