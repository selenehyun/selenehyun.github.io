<script setup lang="ts">
import { ref } from 'vue'
import SectionTitle from './SectionTitle.vue'

const images = ref([
  { id: 1, wide: true },
  { id: 2, wide: false },
  { id: 3, wide: false },
  { id: 4, wide: false },
  { id: 5, wide: false },
  { id: 6, wide: true },
])
</script>

<template>
  <section class="py-14 px-4 bg-gradient-to-b from-white to-wedding-bg">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Gallery" subtitle="우리의 아름다운 순간" />
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-2 gap-1.5">
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
        >
          <span class="text-wedding-text-light/50 text-xs">Photo {{ image.id }}</span>
        </div>
      </template>
    </div>

    <!-- Gallery Note -->
    <p
      v-motion
      :initial="{ opacity: 0 }"
      :visibleOnce="{ opacity: 1, transition: { delay: 700, duration: 500 } }"
      class="text-center text-[11px] text-wedding-text-light/60 mt-5"
    >
      사진을 터치하면 크게 볼 수 있습니다
    </p>
  </section>
</template>
