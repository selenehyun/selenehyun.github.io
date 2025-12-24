<script setup lang="ts">
import { Check, Heart } from 'lucide-vue-next'

interface Props {
  attending: boolean
  isUpdate: boolean
}

defineProps<Props>()

const goToInvitation = () => {
  window.location.href = '/'
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
    <!-- 체크 아이콘 -->
    <div
      class="w-20 h-20 rounded-full bg-wedding-primary/10 flex items-center justify-center mb-6"
      v-motion
      :initial="{ scale: 0 }"
      :enter="{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }"
    >
      <Check class="w-10 h-10 text-wedding-primary" />
    </div>

    <!-- 메시지 -->
    <h2
      class="text-xl font-medium text-wedding-text mb-2"
      v-motion
      :initial="{ opacity: 0, y: 10 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
    >
      <template v-if="isUpdate">
        참석 정보가 수정되었어요
      </template>
      <template v-else>
        참석 정보가 전달되었어요
      </template>
    </h2>

    <p
      class="text-sm text-wedding-text-light mb-2"
      v-motion
      :initial="{ opacity: 0, y: 10 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
    >
      <template v-if="attending">
        소중한 걸음에 감사드립니다
      </template>
      <template v-else>
        마음만으로도 감사합니다
      </template>
    </p>

    <div
      class="flex items-center gap-1 text-wedding-primary"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 400 } }"
    >
      <Heart :size="16" class="fill-wedding-primary" />
    </div>

    <!-- 청첩장 보기 버튼 -->
    <button
      type="button"
      @click="goToInvitation"
      class="mt-10 w-full max-w-xs py-4 rounded-xl
             bg-wedding-primary text-white font-medium
             transition-all duration-200 active:scale-98
             hover:bg-wedding-secondary"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 500 } }"
    >
      청첩장 보러가기
    </button>
  </div>
</template>
