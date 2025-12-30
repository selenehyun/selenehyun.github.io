<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import Drawer from './ui/Drawer.vue'
import Button from './ui/Button.vue'
import { useAttendanceSheet } from '../composables/useAttendanceSheet'
import { Mail } from 'lucide-vue-next'

const router = useRouter()
const { shouldShow, dismiss } = useAttendanceSheet()

const isOpen = ref(false)
const hasBeenOpened = ref(false) // Sheet가 한번이라도 열렸는지 추적

// 컴포넌트 마운트 후 약간의 딜레이를 주고 Sheet 표시
onMounted(() => {
  if (shouldShow.value) {
    setTimeout(() => {
      isOpen.value = true
      hasBeenOpened.value = true
    }, 1500) // 페이지 로드 후 1.5초 뒤 표시
  }
})

// "나중에 할게요" 클릭
const handleDismiss = () => {
  dismiss()
  isOpen.value = false
}

// "참석 여부 알리기" 클릭
const handleGoToRSVP = () => {
  dismiss() // 세션 내 다시 표시 방지
  isOpen.value = false
  router.go('/rsvp')
}

// Drawer 닫힐 때 (배경 클릭, 스와이프 등)
const handleOpenChange = (open: boolean) => {
  // Sheet가 한번 열렸고, 이제 닫히는 경우에만 dismiss 호출
  if (!open && hasBeenOpened.value) {
    dismiss()
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
        <Mail class="w-5 h-5 text-wedding-primary" />
        <span>참석 여부 안내</span>
      </div>
    </template>

    <template #description>
      <p class="leading-relaxed">
        승현 <span class="text-wedding-primary">&</span> 서영의 결혼식에<br>
        참석 여부를 알려주세요
      </p>
    </template>

    <!-- Actions -->
    <div class="flex flex-col gap-3 mt-2">
      <Button
        size="lg"
        class="w-full"
        @click="handleGoToRSVP"
      >
        참석 여부 알리기
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
