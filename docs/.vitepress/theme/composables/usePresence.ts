import { ref, onMounted, onUnmounted } from 'vue'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const HEARTBEAT_INTERVAL = 30_000 // 30초
const TIMEOUT_THRESHOLD = 90_000 // 90초

// 세션 ID 키
const SESSION_ID_KEY = 'wedding-presence-session-id'

// 세션 ID 생성 또는 가져오기
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_ID_KEY, sessionId)
  }
  return sessionId
}

export function usePresence() {
  const viewerCount = ref(0)
  const isConnected = ref(false)

  let sessionId: string | null = null
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null
  let unsubscribe: Unsubscribe | null = null
  let isPageVisible = true

  // Presence 문서 업데이트 (heartbeat)
  const updatePresence = async () => {
    if (!sessionId || !isPageVisible) return

    try {
      const presenceRef = doc(db, 'presence', sessionId)
      await setDoc(presenceRef, {
        sessionId,
        lastSeen: Timestamp.now(),
        createdAt: Timestamp.now()
      }, { merge: true })
      isConnected.value = true
    } catch (err) {
      console.error('Failed to update presence:', err)
      isConnected.value = false
    }
  }

  // Presence 문서 삭제
  const removePresence = async () => {
    if (!sessionId) return

    try {
      const presenceRef = doc(db, 'presence', sessionId)
      await deleteDoc(presenceRef)
    } catch (err) {
      console.error('Failed to remove presence:', err)
    }
  }

  // 접속자 수 구독
  const subscribeToViewerCount = () => {
    const presenceRef = collection(db, 'presence')

    unsubscribe = onSnapshot(
      presenceRef,
      (snapshot) => {
        const now = Date.now()
        // 90초 이내에 활동한 문서만 카운트
        const activeCount = snapshot.docs.filter((doc) => {
          const data = doc.data()
          const lastSeen = data.lastSeen?.toMillis() || 0
          return now - lastSeen < TIMEOUT_THRESHOLD
        }).length

        viewerCount.value = activeCount
      },
      (err) => {
        console.error('Presence subscription error:', err)
      }
    )
  }

  // Page Visibility 핸들러
  const handleVisibilityChange = () => {
    isPageVisible = document.visibilityState === 'visible'

    if (isPageVisible) {
      // 포그라운드로 돌아오면 즉시 heartbeat
      updatePresence()
    }
  }

  // 페이지 이탈 핸들러
  const handleBeforeUnload = () => {
    // 동기적으로 삭제 시도 (navigator.sendBeacon 사용 불가하므로 best effort)
    if (sessionId) {
      // sendBeacon으로 삭제 요청 (Firestore REST API는 복잡하므로 생략)
      // 대신 타임아웃으로 자연스럽게 제거됨
    }
  }

  // 시작
  const startPresence = () => {
    sessionId = getOrCreateSessionId()

    // 초기 presence 등록
    updatePresence()

    // Heartbeat 시작
    heartbeatInterval = setInterval(updatePresence, HEARTBEAT_INTERVAL)

    // 접속자 수 구독
    subscribeToViewerCount()

    // Page Visibility 이벤트
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 페이지 이탈 이벤트
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  // 정리
  const cleanup = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }

    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('beforeunload', handleBeforeUnload)

    // 문서 삭제 시도
    removePresence()
  }

  onMounted(() => {
    startPresence()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    viewerCount,
    isConnected
  }
}
