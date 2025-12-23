<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
</script>

<template>
  <section class="min-h-[max(660px,100vh)] flex flex-col justify-center items-center text-center px-6 py-16 bg-gradient-to-b from-[#fdfcfa] to-[#f8f5f0] relative overflow-hidden">
    <!-- Decorative Corner Elements -->
    <div class="absolute top-6 left-6 w-12 h-12 border-t border-l border-wedding-primary/40"></div>
    <div class="absolute top-6 right-6 w-12 h-12 border-t border-r border-wedding-primary/40"></div>
    <div class="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-wedding-primary/40"></div>
    <div class="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-wedding-primary/40"></div>

    <!-- Small Decorative Text -->
    <p class="font-serif text-[10px] tracking-[5px] text-wedding-primary/60 uppercase mb-3">
      Wedding Invitation
    </p>

    <!-- Date -->
    <p class="font-serif text-xs tracking-[4px] text-wedding-text-light mb-10">
      2026. 04. 19
    </p>

    <!-- Main Image Placeholder -->
    <div class="w-full max-w-[240px] aspect-[3/4] bg-wedding-border/20 mb-10 flex items-center justify-center rounded-sm overflow-hidden shadow-sm">
      <span class="text-wedding-text-light/60 text-xs">메인 사진</span>
    </div>

    <!-- Names with decorative line -->
    <div class="flex items-center gap-4 mb-2">
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
    <p class="font-serif text-[11px] tracking-[6px] text-wedding-text-light/70 mt-3 uppercase">
      We are getting married
    </p>

    <!-- Wedding Date & Time -->
    <div class="mt-8 text-sm text-wedding-text-light space-y-1">
      <p>2026년 4월 19일 일요일 오전 11시</p>
      <p class="text-xs text-wedding-text-light/70">로프트가든344</p>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 animate-bounce">
      <ChevronDown class="w-5 h-5 text-wedding-text-light/50" />
    </div>
  </section>
</template>
