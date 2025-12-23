<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
</script>

<template>
  <footer class="py-10 px-6 text-center bg-gradient-to-b from-white to-wedding-bg/50">
    <!-- Decorative Element -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :visibleOnce="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
      class="flex items-center justify-center gap-3 mb-5"
    >
      <div class="w-10 h-px bg-wedding-border"></div>
      <Heart class="w-4 h-4 text-wedding-primary/60 animate-pulse" />
      <div class="w-10 h-px bg-wedding-border"></div>
    </div>

    <!-- Names -->
    <p
      v-motion
      :initial="{ opacity: 0, y: 15 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 100, duration: 500 } }"
      class="font-serif text-lg tracking-[6px] text-wedding-text"
    >
      승현 & 서영
    </p>

    <!-- Date -->
    <p
      v-motion
      :initial="{ opacity: 0 }"
      :visibleOnce="{ opacity: 1, transition: { delay: 200, duration: 500 } }"
      class="text-[11px] text-wedding-text-light mt-2 tracking-[3px]"
    >
      2026. 04. 19
    </p>

    <!-- Copyright -->
    <p
      v-motion
      :initial="{ opacity: 0 }"
      :visibleOnce="{ opacity: 1, transition: { delay: 400, duration: 600 } }"
      class="text-[10px] text-wedding-text-light/50 mt-6"
    >
      Made with love
    </p>
  </footer>
</template>
