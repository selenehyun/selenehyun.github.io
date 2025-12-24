<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sections = [
  { id: 'cover', label: '처음' },
  { id: 'greeting', label: '인사말' },
  { id: 'gallery', label: '갤러리' },
  { id: 'info', label: '예식' },
  { id: 'location', label: '오시는 길' },
  { id: 'contact', label: '연락처' },
  { id: 'account', label: '마음' },
  { id: 'footer', label: '끝' }
]

const activeIndex = ref(0)
const isVisible = ref(false)

const handleScroll = () => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  // Show/hide based on scroll position
  isVisible.value = scrollY > windowHeight * 0.3

  // Calculate which section is active
  const scrollPercent = scrollY / (documentHeight - windowHeight)
  const newIndex = Math.min(
    Math.floor(scrollPercent * sections.length),
    sections.length - 1
  )
  activeIndex.value = Math.max(0, newIndex)
}

const scrollToSection = (index: number) => {
  const documentHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight
  const targetScroll = (index / (sections.length - 1)) * (documentHeight - windowHeight)

  window.scrollTo({
    top: targetScroll,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    class="fixed right-3 top-1/2 -translate-y-1/2 z-50 transition-opacity duration-300"
    :class="isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'"
  >
    <div class="flex flex-col items-center gap-2">
      <div
        v-for="(section, index) in sections"
        :key="section.id"
        @click="scrollToSection(index)"
        class="group relative flex items-center cursor-pointer p-1"
      >
        <!-- Dot -->
        <span
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="[
            activeIndex === index
              ? 'bg-wedding-primary scale-125'
              : 'bg-wedding-text-light/30 group-hover:bg-wedding-primary/50'
          ]"
        ></span>

        <!-- Label (shown on hover) -->
        <span
          class="absolute right-5 whitespace-nowrap text-[10px] text-wedding-text-light bg-white/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm pointer-events-none"
        >
          {{ section.label }}
        </span>
      </div>
    </div>
  </div>
</template>
