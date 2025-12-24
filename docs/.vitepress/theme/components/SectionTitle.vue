<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="section-title text-center mb-10">
    <!-- Decorative Top Element -->
    <div class="flex items-center justify-center gap-3 mb-4">
      <div class="w-6 h-px bg-wedding-primary/30"></div>
      <div class="w-1.5 h-1.5 rotate-45 border border-wedding-primary/40"></div>
      <div class="w-6 h-px bg-wedding-primary/30"></div>
    </div>

    <!-- English Title -->
    <h2 class="font-serif text-[0.6875rem] tracking-[5px] text-wedding-primary uppercase">
      {{ title }}
    </h2>

    <!-- Korean Subtitle (Optional) -->
    <p v-if="subtitle" class="text-[0.8125rem] text-wedding-text-light mt-2">
      {{ subtitle }}
    </p>

    <!-- Decorative Bottom Element -->
    <div class="flex items-center justify-center gap-3 mt-4">
      <div class="w-10 h-px bg-gradient-to-r from-transparent to-wedding-primary/30"></div>
      <div class="text-wedding-primary/50 text-xs">✦</div>
      <div class="w-10 h-px bg-gradient-to-l from-transparent to-wedding-primary/30"></div>
    </div>
  </div>
</template>
