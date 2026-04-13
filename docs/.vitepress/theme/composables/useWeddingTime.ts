import { computed } from 'vue'

// KST 2026/04/19 11:00 = UTC 2026/04/19 02:00
const WEDDING_TIME = new Date('2026-04-19T02:00:00Z')

export function useWeddingTime() {
  const isAfterWedding = computed(() => Date.now() >= WEDDING_TIME.getTime())
  return { isAfterWedding }
}
