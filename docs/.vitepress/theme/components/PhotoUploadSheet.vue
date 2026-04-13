<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import Drawer from './ui/Drawer.vue'
import Button from './ui/Button.vue'
import { Camera } from 'lucide-vue-next'

const DISMISSED_KEY = 'wedding-photo-sheet-dismissed'
const isDismissed = useSessionStorage(DISMISSED_KEY, false)

const isOpen = ref(false)
const hasBeenOpened = ref(false)

onMounted(() => {
  if (!isDismissed.value) {
    setTimeout(() => {
      isOpen.value = true
      hasBeenOpened.value = true
    }, 1500)
  }
})

const handleDismiss = () => {
  isDismissed.value = true
  isOpen.value = false
}

const handleGoToPhotoEvent = () => {
  isDismissed.value = true
  isOpen.value = false
  window.location.href = '/photo-event'
}

const handleOpenChange = (open: boolean) => {
  if (!open && hasBeenOpened.value) {
    isDismissed.value = true
  }
  isOpen.value = open
}
</script>

<template>
  <Drawer
    :open="isOpen"
    @update:open="handleOpenChange"
  >
    <template #title>
      <div class="flex items-center justify-center gap-2">
        <Camera class="w-5 h-5 text-wedding-primary" />
        <span>사진 이벤트</span>
      </div>
    </template>

    <template #description>
      <p class="leading-relaxed">
        오늘 함께해주셔서 감사해요 🤍<br>
        찍으신 사진이 있다면 나눠주세요
      </p>
    </template>

    <div class="flex flex-col gap-3 mt-2">

      <Button
        size="lg"
        class="w-full gap-2"
        @click="handleGoToPhotoEvent"
      >
        <Camera class="w-4 h-4" />
        사진 업로드하기
      </Button>

      <button
        class="text-sm text-wedding-text-light hover:text-wedding-text transition-colors py-2"
        @click="handleDismiss"
      >
        나중에 할게요
      </button>
    </div>
  </Drawer>
</template>
