<script setup lang="ts">
import { ref, computed } from 'vue'
import SectionTitle from './SectionTitle.vue'
import Lightbox from './Lightbox.vue'

// 갤러리 이미지 설정
const images = ref([
  { id: 1, wide: false, src: '/gallary/01.JPG' },
  { id: 2, wide: false, src: '/gallary/02.jpg', position: 'top' },
  { id: 3, wide: false, src: '/gallary/03.jpg', position: 'bottom' },
  { id: 4, wide: false, src: '/gallary/04.JPG' },
  { id: 5, wide: false, src: '/gallary/05.jpg' },
  { id: 6, wide: false, src: '/gallary/06.jpg' },
  { id: 7, wide: false, src: '/gallary/07.JPG' },
  { id: 8, wide: false, src: '/gallary/08.JPG', position: 'top' },
  { id: 9, wide: false, src: '/gallary/09.JPG', position: 'bottom' },
  { id: 10, wide: false, src: '/gallary/10.JPG', position: 'top' },
  { id: 11, wide: false, src: '/gallary/11.jpg', position: 'top' },
  { id: 12, wide: false, src: '/gallary/12.jpg', position: 'top' },
])

// Lightbox 상태
const lightboxOpen = ref(false)
const selectedIndex = ref(0)

// Lightbox용 이미지 URL 배열
const imageSources = computed(() =>
  images.value.map(img => img.src)
)

// 이미지 클릭 핸들러
const openLightbox = (index: number) => {
  selectedIndex.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <section id="gallery" class="py-14 px-4 bg-gradient-to-b from-white to-wedding-bg">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Gallery" subtitle="우리의 아름다운 순간" />
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-4 gap-1.5">
      <template v-for="(image, index) in images" :key="image.id">
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{
            opacity: 1,
            scale: 1,
            transition: {
              delay: 100 + index * 100,
              duration: 500,
              ease: 'easeOut'
            }
          }"
          :class="[
            'overflow-hidden bg-wedding-border/20 flex items-center justify-center transition-all duration-300 hover:bg-wedding-border/30 cursor-pointer hover:scale-[1.02]',
            image.wide ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
          ]"
          @click="openLightbox(index)"
        >
          <!-- 실제 이미지가 있으면 표시, 없으면 플레이스홀더 -->
          <img
            v-if="image.src"
            :src="image.src"
            :alt="`사진 ${image.id}`"
            class="w-full h-full object-cover"
            :style="{ objectPosition: image.position || 'center' }"
          />
          <span v-else class="text-wedding-text-light/50 text-xs">Photo {{ image.id }}</span>
        </div>
      </template>
    </div>

    <!-- Lightbox -->
    <Lightbox
      v-model="lightboxOpen"
      :images="imageSources"
      :initial-index="selectedIndex"
    />

    <!-- Gallery Note -->
    <p
      v-motion
      :initial="{ opacity: 0 }"
      :visibleOnce="{ opacity: 1, transition: { delay: 700, duration: 500 } }"
      class="text-center text-[0.6875rem] text-wedding-text-light/60 mt-5"
    >
      사진을 터치하면 크게 볼 수 있습니다
    </p>
  </section>
</template>
