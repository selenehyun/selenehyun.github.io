<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sections = [
  { id: 'cover', label: '처음' },
  { id: 'greeting', label: '인사말' },
  { id: 'gallery', label: '갤러리' },
  { id: 'info', label: '예식' },
  { id: 'ceremony', label: '식순' },
  { id: 'photo-event', label: '이벤트' },
  { id: 'location', label: '오시는 길' },
  { id: 'contact', label: '연락처' },
  { id: 'account', label: '마음' },
  { id: 'guestbook', label: '방명록' },
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

  // 맨 하단 도달 시 마지막 인디케이터 활성화 (여유값 10px)
  const isAtBottom = scrollY + windowHeight >= documentHeight - 10
  if (isAtBottom) {
    activeIndex.value = sections.length - 1
    return
  }

  // 현재 보이는 섹션 찾기 (화면 상단에서 40% 위치 기준)
  const viewportThreshold = scrollY + windowHeight * 0.4

  let currentIndex = 0
  for (let i = sections.length - 1; i >= 0; i--) {
    const element = document.getElementById(sections[i].id)
    if (element && element.offsetTop <= viewportThreshold) {
      currentIndex = i
      break
    }
  }

  activeIndex.value = currentIndex
}

const scrollToSection = (index: number) => {
  const section = sections[index]
  const element = document.getElementById(section.id)

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
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
          class="absolute right-5 whitespace-nowrap text-[0.625rem] text-wedding-text-light bg-white/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm pointer-events-none"
        >
          {{ section.label }}
        </span>
      </div>
    </div>
  </div>
</template>
