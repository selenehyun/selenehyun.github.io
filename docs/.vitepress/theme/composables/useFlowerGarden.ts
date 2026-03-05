import { ref, onMounted, onUnmounted } from 'vue'
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  limit,
  Timestamp,
  increment,
  setDoc,
  type Unsubscribe
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface Flower {
  id: string
  x: number // 0~1 정규화된 좌표
  y: number // 0~1 정규화된 좌표
  createdAt: Date
  size: number
}

interface FirestoreFlower {
  x: number
  y: number
  createdAt: Timestamp
  size?: number
}

const MAX_DISPLAY_FLOWERS = 250
const DEBOUNCE_MS = 300

export function useFlowerGarden() {
  const flowers = ref<Flower[]>([])
  const totalCount = ref(0)
  const isLoading = ref(true)
  const isPlanting = ref(false)
  const error = ref<string | null>(null)

  let flowersUnsubscribe: Unsubscribe | null = null
  let statsUnsubscribe: Unsubscribe | null = null
  let lastPlantTime = 0

  // 꽃 데이터 실시간 구독 (최근 250개만)
  const subscribeToFlowers = () => {
    try {
      const flowersRef = collection(db, 'flower-garden')
      const q = query(
        flowersRef,
        orderBy('createdAt', 'desc'),
        limit(MAX_DISPLAY_FLOWERS)
      )

      flowersUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          flowers.value = snapshot.docs.map((doc) => {
            const data = doc.data() as FirestoreFlower
            return {
              id: doc.id,
              x: data.x,
              y: data.y,
              createdAt: data.createdAt?.toDate() || new Date(),
              size: data.size ?? 1
            }
          })
          isLoading.value = false
          error.value = null
        },
        (err) => {
          console.error('Flower garden subscription error:', err)
          error.value = '꽃을 불러오는 중 오류가 발생했습니다.'
          isLoading.value = false
        }
      )
    } catch (err) {
      console.error('Failed to subscribe to flower garden:', err)
      error.value = '연결 중 오류가 발생했습니다.'
      isLoading.value = false
    }
  }

  // 총 개수 실시간 구독
  const subscribeToStats = () => {
    try {
      const statsRef = doc(db, 'flower-garden-stats', 'global')

      statsUnsubscribe = onSnapshot(
        statsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            totalCount.value = snapshot.data().totalCount || 0
          }
        },
        (err) => {
          console.error('Stats subscription error:', err)
        }
      )
    } catch (err) {
      console.error('Failed to subscribe to stats:', err)
    }
  }

  // 꽃 심기
  const plantFlower = async (normalizedX: number, normalizedY: number): Promise<boolean> => {
    // 디바운싱
    const now = Date.now()
    if (now - lastPlantTime < DEBOUNCE_MS) {
      return false
    }
    lastPlantTime = now

    // 좌표 유효성 검사
    if (normalizedX < 0 || normalizedX > 1 || normalizedY < 0 || normalizedY > 1) {
      return false
    }

    isPlanting.value = true
    error.value = null

    try {
      // 1. 꽃 문서 추가
      const flowersRef = collection(db, 'flower-garden')
      await addDoc(flowersRef, {
        x: normalizedX,
        y: normalizedY,
        createdAt: Timestamp.now(),
        size: 0.85 + Math.random() * 0.3 // 0.85~1.15 크기 변형
      })

      // 2. 총 개수 증가 (원자적)
      const statsRef = doc(db, 'flower-garden-stats', 'global')
      await setDoc(
        statsRef,
        {
          totalCount: increment(1),
          lastUpdated: Timestamp.now()
        },
        { merge: true }
      )

      return true
    } catch (err) {
      console.error('Failed to plant flower:', err)
      error.value = '꽃을 심는 중 오류가 발생했습니다.'
      return false
    } finally {
      isPlanting.value = false
    }
  }

  onMounted(() => {
    subscribeToFlowers()
    subscribeToStats()
  })

  onUnmounted(() => {
    if (flowersUnsubscribe) {
      flowersUnsubscribe()
    }
    if (statsUnsubscribe) {
      statsUnsubscribe()
    }
  })

  return {
    flowers,
    totalCount,
    isLoading,
    isPlanting,
    error,
    plantFlower
  }
}
