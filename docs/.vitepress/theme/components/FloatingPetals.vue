<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Petal {
  id: number
  left: string
  delay: string
  duration: string
  size: string
  opacity: number
  type: 'petal' | 'heart'
}

const petals = ref<Petal[]>([])

onMounted(() => {
  const items: Petal[] = []
  for (let i = 0; i < 15; i++) {
    items.push({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${8 + Math.random() * 7}s`,
      size: `${8 + Math.random() * 8}px`,
      opacity: 0.3 + Math.random() * 0.4,
      type: Math.random() > 0.7 ? 'heart' : 'petal'
    })
  }
  petals.value = items
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="floating-petal absolute"
      :style="{
        left: petal.left,
        animationDelay: petal.delay,
        animationDuration: petal.duration,
        fontSize: petal.size,
        opacity: petal.opacity
      }"
    >
      <span v-if="petal.type === 'heart'" class="text-wedding-primary/60">♥</span>
      <span v-else class="text-wedding-primary/50">❀</span>
    </div>
  </div>
</template>

<style scoped>
.floating-petal {
  top: -20px;
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: var(--tw-opacity, 0.5);
  }
  90% {
    opacity: var(--tw-opacity, 0.5);
  }
  100% {
    transform: translateY(100vh) rotate(360deg) translateX(30px);
    opacity: 0;
  }
}
</style>
