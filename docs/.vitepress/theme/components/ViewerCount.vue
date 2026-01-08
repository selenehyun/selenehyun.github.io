<script setup lang="ts">
import { computed } from 'vue'
import { useTransition, TransitionPresets } from '@vueuse/core'
import { usePresence } from '../composables/usePresence'

const { viewerCount } = usePresence()

// 숫자 카운팅 애니메이션
const animatedCount = useTransition(viewerCount, {
  duration: 400,
  transition: TransitionPresets.easeOutCubic
})

const displayCount = computed(() => Math.round(animatedCount.value))
</script>

<template>
  <Transition name="viewer-count">
    <div
      v-if="viewerCount >= 2"
      class="fixed bottom-4 left-4 z-50
             bg-white/90 backdrop-blur-sm rounded-full
             px-3 py-1.5 shadow-sm border border-wedding-border
             text-xs text-wedding-text-light
             flex items-center gap-2"
    >
      <span
        class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
        aria-hidden="true"
      />
      <span>지금 <span class="tabular-nums font-medium">{{ displayCount }}</span>명이 함께 보고 있어요</span>
    </div>
  </Transition>
</template>

<style scoped>
.viewer-count-enter-active,
.viewer-count-leave-active {
  transition: all 0.3s ease;
}

.viewer-count-enter-from,
.viewer-count-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
