import { computed, ref, onMounted } from 'vue'

export type ParentMode = 'default' | 'groom-parent' | 'bride-parent'

export function useParentMode() {
  const clientFrom = ref<string | null>(null)

  // 클라이언트에서 URLSearchParams로 직접 파싱
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      clientFrom.value = params.get('from')
    }
  })

  const parentMode = computed<ParentMode>(() => {
    const from = clientFrom.value
    if (from === 'groom-parent') return 'groom-parent'
    if (from === 'bride-parent') return 'bride-parent'
    return 'default'
  })

  const isParentMode = computed(() => parentMode.value !== 'default')
  const isGroomParent = computed(() => parentMode.value === 'groom-parent')
  const isBrideParent = computed(() => parentMode.value === 'bride-parent')

  return {
    parentMode,
    isParentMode,
    isGroomParent,
    isBrideParent
  }
}
