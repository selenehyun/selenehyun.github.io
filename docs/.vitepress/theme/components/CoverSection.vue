<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import FloatingPetals from './FloatingPetals.vue'

const scrollY = ref(0)
const parallaxOffset = computed(() => scrollY.value * 0.3)

// 커버 섹션 높이 고정 (모바일 웹뷰 높이 변경 대응)
const coverRef = ref<HTMLElement | null>(null)
const fixedHeight = ref<string | null>(null)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const lockCoverHeight = () => {
  if (coverRef.value && !fixedHeight.value) {
    const currentHeight = coverRef.value.offsetHeight
    fixedHeight.value = `${currentHeight}px`
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 페이지 로드 완료 후 커버 높이 고정
  // requestAnimationFrame으로 렌더링 완료 후 실행
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      lockCoverHeight()
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section
    ref="coverRef"
    :style="fixedHeight ? { height: fixedHeight, minHeight: fixedHeight } : {}"
    class="min-h-[max(660px,100vh)] flex flex-col justify-center items-center text-center px-6 py-16 bg-gradient-to-b from-[#fdfcfa] to-[#f8f5f0] relative overflow-hidden"
  >
    <!-- Floating Petals -->
    <FloatingPetals />
    <!-- Decorative Corner Elements -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 800, duration: 600 } }"
      class="absolute top-6 left-6 w-12 h-12 border-t border-l border-wedding-primary/40"
    ></div>
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 900, duration: 600 } }"
      class="absolute top-6 right-6 w-12 h-12 border-t border-r border-wedding-primary/40"
    ></div>
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 1000, duration: 600 } }"
      class="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-wedding-primary/40"
    ></div>
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 1100, duration: 600 } }"
      class="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-wedding-primary/40"
    ></div>

    <!-- Small Decorative Text -->
    <p
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 600 } }"
      class="font-serif text-[10px] tracking-[5px] text-wedding-primary/60 uppercase mb-3"
    >
      Wedding Invitation
    </p>

    <!-- Date -->
    <p
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 300, duration: 600 } }"
      class="font-serif text-xs tracking-[4px] text-wedding-text-light mb-10"
    >
      2026. 04. 19
    </p>

    <!-- Main Image Placeholder with Parallax -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.9 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 400, duration: 800, ease: 'easeOut' } }"
      class="w-full max-w-[240px] aspect-[3/4] bg-wedding-border/20 mb-10 flex items-center justify-center rounded-sm overflow-hidden shadow-sm"
      :style="{ transform: `translateY(${parallaxOffset}px)` }"
    >
      <span class="text-wedding-text-light/60 text-xs">메인 사진</span>
    </div>

    <!-- Names with decorative line -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 600, duration: 700 } }"
      class="flex items-center gap-4 mb-2"
    >
      <div class="w-8 h-px bg-wedding-primary/40"></div>
      <h1 class="text-[24px] font-light tracking-[8px] text-wedding-text">
        승현
      </h1>
      <span class="font-serif text-lg text-wedding-primary">&</span>
      <h1 class="text-[24px] font-light tracking-[8px] text-wedding-text">
        서영
      </h1>
      <div class="w-8 h-px bg-wedding-primary/40"></div>
    </div>

    <!-- Subtitle -->
    <p
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 900, duration: 600 } }"
      class="font-serif text-[11px] tracking-[6px] text-wedding-text-light/70 mt-3 uppercase"
    >
      We are getting married
    </p>

    <!-- Wedding Date & Time -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 1100, duration: 600 } }"
      class="mt-8 text-sm text-wedding-text-light space-y-1"
    >
      <p>2026년 4월 19일 일요일 오전 11시</p>
      <p class="text-xs text-wedding-text-light/70">로프트가든344 10층</p>
    </div>

    <!-- Scroll Indicator -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, transition: { delay: 1500, duration: 600 } }"
      class="absolute bottom-8 animate-bounce"
    >
      <ChevronDown class="w-5 h-5 text-wedding-text-light/50" />
    </div>
  </section>
</template>
