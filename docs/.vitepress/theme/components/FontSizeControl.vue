<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

type FontSize = 'small' | 'medium' | 'large'

const fontSize = ref<FontSize>('medium')
const isOpen = ref(false)

const fontSizeLabels: Record<FontSize, string> = {
  small: '가',
  medium: '가',
  large: '가'
}

const fontSizeScale: Record<FontSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.15
}

const setFontSize = (size: FontSize) => {
  fontSize.value = size
  document.documentElement.style.setProperty('--font-scale', String(fontSizeScale[size]))
  localStorage.setItem('wedding-font-size', size)
  isOpen.value = false
}

onMounted(() => {
  const saved = localStorage.getItem('wedding-font-size') as FontSize | null
  if (saved && fontSizeScale[saved]) {
    fontSize.value = saved
    document.documentElement.style.setProperty('--font-scale', String(fontSizeScale[saved]))
  }
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="fixed bottom-20 right-4 z-50">
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
          @click="setFontSize('small')"
          :class="[
            'px-3 py-2 rounded-md text-xs transition-colors whitespace-nowrap',
            fontSize === 'small'
              ? 'bg-wedding-primary/10 text-wedding-primary'
              : 'hover:bg-wedding-bg text-wedding-text'
          ]"
        >
          <span class="text-[11px]">가</span> 작게
        </button>
        <button
          @click="setFontSize('medium')"
          :class="[
            'px-3 py-2 rounded-md text-xs transition-colors whitespace-nowrap',
            fontSize === 'medium'
              ? 'bg-wedding-primary/10 text-wedding-primary'
              : 'hover:bg-wedding-bg text-wedding-text'
          ]"
        >
          <span class="text-[13px]">가</span> 보통
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
          <span class="text-[15px]">가</span> 크게
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
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
