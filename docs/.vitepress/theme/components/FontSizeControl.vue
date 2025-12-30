<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useParentMode } from '../composables/useParentMode'

type FontSize = 'medium' | 'large' | 'xlarge'

const fontSize = ref<FontSize>('medium')
const isOpen = ref(false)
const isVisible = ref(false)
const { isParentMode } = useParentMode()

let idleTimer: ReturnType<typeof setTimeout> | null = null
const IDLE_DELAY = 3000 // 3초

const fontSizeScale: Record<FontSize, number> = {
  medium: 1,
  large: 1.15,
  xlarge: 1.3
}

const setFontSize = (size: FontSize) => {
  fontSize.value = size
  document.documentElement.style.setProperty('--font-scale', String(fontSizeScale[size]))
  localStorage.setItem('wedding-font-size', size)
  isOpen.value = false
}

const resetIdleTimer = () => {
  // 스크롤 시 버튼 숨기기
  isVisible.value = false
  isOpen.value = false

  // 기존 타이머 취소
  if (idleTimer) {
    clearTimeout(idleTimer)
  }

  // 5초 후 버튼 표시
  idleTimer = setTimeout(() => {
    isVisible.value = true
  }, IDLE_DELAY)
}

const handleScroll = () => {
  resetIdleTimer()
}

onMounted(() => {
  // 1. 부모님 모드 확인 (최우선)
  if (isParentMode.value) {
    fontSize.value = 'xlarge'
    document.documentElement.style.setProperty('--font-scale', '1.3')
    // localStorage에 저장하지 않음 (임시 설정)
  } else {
    // 2. localStorage에서 불러오기
    const saved = localStorage.getItem('wedding-font-size') as FontSize | null
    if (saved && fontSizeScale[saved]) {
      fontSize.value = saved
      document.documentElement.style.setProperty('--font-scale', String(fontSizeScale[saved]))
    }
  }

  // 스크롤 이벤트 리스너 등록
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 초기 5초 후 버튼 표시
  idleTimer = setTimeout(() => {
    isVisible.value = true
  }, IDLE_DELAY)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (idleTimer) {
    clearTimeout(idleTimer)
  }
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="isVisible" class="fixed bottom-20 right-4 z-50">
      <!-- 토글 버튼 -->
      <button
        @click="toggleMenu"
        class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-wedding-border flex items-center justify-center text-wedding-text hover:bg-white transition-colors"
        aria-label="글자 크기 조절"
      >
        <span class="text-sm font-medium">가</span>
      </button>

      <!-- 크기 선택 메뉴 -->
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="absolute bottom-12 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-wedding-border p-2 flex flex-col gap-1"
        >
          <button
            @click="setFontSize('medium')"
            :class="[
              'px-3 py-2 rounded-md text-xs transition-colors whitespace-nowrap',
              fontSize === 'medium'
                ? 'bg-wedding-primary/10 text-wedding-primary'
                : 'hover:bg-wedding-bg text-wedding-text'
            ]"
          >
            <span class="text-[12px]">가</span> 보통
          </button>
          <button
            @click="setFontSize('large')"
            :class="[
              'px-3 py-2 rounded-md text-xs transition-colors whitespace-nowrap',
              fontSize === 'large'
                ? 'bg-wedding-primary/10 text-wedding-primary'
                : 'hover:bg-wedding-bg text-wedding-text'
            ]"
          >
            <span class="text-[14px]">가</span> 크게
          </button>
          <button
            @click="setFontSize('xlarge')"
            :class="[
              'px-3 py-2 rounded-md text-xs transition-colors whitespace-nowrap',
              fontSize === 'xlarge'
                ? 'bg-wedding-primary/10 text-wedding-primary'
                : 'hover:bg-wedding-bg text-wedding-text'
            ]"
          >
            <span class="text-[16px]">가</span> 아주 크게
          </button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.slide-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
