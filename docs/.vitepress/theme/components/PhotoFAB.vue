<script setup lang="ts">
import { Camera, X } from 'lucide-vue-next'
import { useSessionStorage } from '@vueuse/core'
import { ref } from 'vue'

const CLOSED_KEY = 'wedding-photo-banner-closed'
const isClosed = useSessionStorage(CLOSED_KEY, false)

const visible = ref(!isClosed.value)

const close = () => {
  isClosed.value = true
  visible.value = false
}

const goToPhotoEvent = () => {
  window.location.href = '/photo-event'
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="visible"
      class="fixed top-0 left-0 right-0 z-50 bg-wedding-primary text-white shadow-md"
    >
      <div class="flex items-center justify-between px-4 py-2.5 max-w-md mx-auto">
        <button
          @click="goToPhotoEvent"
          class="flex items-center gap-2 flex-1 text-left"
        >
          <Camera class="w-4 h-4 shrink-0" />
          <span class="text-sm font-medium">오늘 찍은 사진을 나눠주세요 📷</span>
        </button>
        <button
          @click="close"
          class="ml-3 p-1 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors shrink-0"
          aria-label="닫기"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
