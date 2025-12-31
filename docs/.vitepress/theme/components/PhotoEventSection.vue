<script setup lang="ts">
import { Camera, Gift } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'
import Button from './ui/Button.vue'

const goToPhotoEvent = () => {
  window.location.href = '/photo-event'
}
</script>

<template>
  <section id="photo-event" class="py-12 px-6 bg-gradient-to-b from-wedding-bg to-white">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Photo Event" subtitle="베스트 샷 이벤트" />

      <div class="max-w-md mx-auto text-center">
        <!-- 이벤트 카드 -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-wedding-border mb-4">
          <div class="flex items-center justify-center gap-2 mb-4">
            <Camera class="w-6 h-6 text-wedding-primary" />
            <Gift class="w-5 h-5 text-wedding-accent" />
          </div>

          <h3 class="text-base font-medium text-wedding-text mb-2">
            결혼식 사진을 보내주세요!
          </h3>

          <p class="text-sm text-wedding-text-light leading-relaxed mb-5 break-keep">
            식장에서 찍은 소중한 사진들을 공유해주세요.
            베스트 샷으로 선정되신 분께
            <strong class="text-wedding-primary whitespace-nowrap">10만원씩 총 2명</strong>에게 상품권을 드립니다!
          </p>

          <Button @click="goToPhotoEvent" class="gap-2">
            <Camera class="w-4 h-4" />
            사진 업로드하기
          </Button>
        </div>

        <p class="text-xs text-wedding-text-light">
          * 개인정보는 당선자 연락 용도로만 사용됩니다
        </p>
      </div>
    </div>
  </section>
</template>
