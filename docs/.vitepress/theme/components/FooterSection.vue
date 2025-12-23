<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
</script>

<template>
  <footer class="py-10 px-6 text-center bg-gradient-to-b from-white to-wedding-bg/50">
    <!-- Decorative Element -->
    <div class="flex items-center justify-center gap-3 mb-5">
      <div class="w-10 h-px bg-wedding-border"></div>
      <Heart class="w-4 h-4 text-wedding-primary/60" />
      <div class="w-10 h-px bg-wedding-border"></div>
    </div>

    <!-- Names -->
    <p class="font-serif text-lg tracking-[6px] text-wedding-text">
      승현 & 서영
    </p>

    <!-- Date -->
    <p class="text-[11px] text-wedding-text-light mt-2 tracking-[3px]">
      2026. 04. 19
    </p>

    <!-- Copyright -->
    <p class="text-[10px] text-wedding-text-light/50 mt-6">
      Made with love
    </p>
  </footer>
</template>
