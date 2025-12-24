<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { Clock } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'

const year = 2026
const month = 4 // April
const weddingDay = 19
const weddingDate = new Date(year, month - 1, weddingDay, 11, 0, 0)

const dayNames = ['일', '월', '화', '수', '목', '금', '토']

const dDay = ref(0)
const displayDDay = ref(0)
const dDayRef = ref<HTMLElement | null>(null)
const isVisible = useElementVisibility(dDayRef)
const hasAnimated = ref(false)

onMounted(() => {
  const today = new Date()
  const diffTime = weddingDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  dDay.value = diffDays
})

// Animate D-Day counter when visible
watch(isVisible, (visible) => {
  if (visible && !hasAnimated.value && dDay.value > 0) {
    hasAnimated.value = true
    const duration = 1500
    const startTime = Date.now()
    const startValue = 0
    const endValue = dDay.value

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      displayDDay.value = Math.round(startValue + (endValue - startValue) * easeOut)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }
})

const calendarDays = computed(() => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()

  const days: { day: number; isCurrentMonth: boolean; isWeddingDay: boolean; isSunday: boolean; isSaturday: boolean }[] = []

  // Previous month days
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate()
  for (let i = startingDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isWeddingDay: false,
      isSunday: false,
      isSaturday: false
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dayOfWeek = new Date(year, month - 1, i).getDay()
    days.push({
      day: i,
      isCurrentMonth: true,
      isWeddingDay: i === weddingDay,
      isSunday: dayOfWeek === 0,
      isSaturday: dayOfWeek === 6
    })
  }

  // Next month days (only fill to complete last row)
  const totalDays = days.length
  const rows = Math.ceil(totalDays / 7)
  const remainingDays = rows * 7 - totalDays
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isWeddingDay: false,
      isSunday: false,
      isSaturday: false
    })
  }

  return days
})
</script>

<template>
  <section class="py-16 px-6 text-center bg-white">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Wedding Day" subtitle="예식 안내" />
    </div>

    <!-- Date & Time -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 100, duration: 600 } }"
      class="mb-8"
    >
      <p class="text-xl font-light text-wedding-text tracking-wide">
        2026. 04. 19
      </p>
      <p class="text-sm text-wedding-text-light mt-2">
        일요일 오전 11시
      </p>
      <p class="text-sm text-wedding-text mt-2 font-medium">
        로프트가든344 10층
      </p>
    </div>

    <!-- Calendar -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 200, duration: 600 } }"
      class="max-w-[280px] mx-auto bg-wedding-bg/50 rounded-lg p-4"
    >
      <p class="font-serif text-sm tracking-[3px] mb-4 text-wedding-text-light">
        APRIL 2026
      </p>

      <div class="grid grid-cols-7 gap-0.5 text-[13px]">
        <!-- Day Names -->
        <template v-for="(name, idx) in dayNames" :key="name">
          <div
            :class="[
              'py-2 text-[11px] font-medium',
              idx === 0 ? 'text-red-400/80' : idx === 6 ? 'text-blue-400/80' : 'text-wedding-text-light'
            ]"
          >
            {{ name }}
          </div>
        </template>

        <!-- Calendar Days -->
        <template v-for="(day, idx) in calendarDays" :key="idx">
          <div
            :class="[
              'py-1.5 relative',
              !day.isCurrentMonth && 'text-wedding-text-light/30',
              day.isCurrentMonth && 'text-wedding-text',
              day.isSunday && day.isCurrentMonth && 'text-red-400/80',
              day.isSaturday && day.isCurrentMonth && 'text-blue-400/80',
              day.isWeddingDay && 'text-white font-medium'
            ]"
          >
            <span
              v-if="day.isWeddingDay"
              v-motion
              :initial="{ scale: 0 }"
              :visibleOnce="{ scale: 1, transition: { delay: 600, duration: 400, ease: 'easeOut' } }"
              class="absolute inset-0 flex items-center justify-center"
            >
              <span class="w-7 h-7 bg-wedding-primary rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {{ day.day }}
              </span>
            </span>
            <span v-else>{{ day.day }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- D-Day Counter -->
    <div
      ref="dDayRef"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600 } }"
      class="mt-8 pt-6 border-t border-wedding-border/50"
    >
      <p class="text-[13px] text-wedding-text-light">
        승현 <span class="text-wedding-primary">♥</span> 서영의 결혼식까지
      </p>
      <p class="text-2xl font-light text-wedding-primary mt-2 tracking-wide tabular-nums">
        D-{{ displayDDay }}
      </p>
    </div>

    <!-- 입장 안내 공지 -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 500, duration: 600 } }"
      class="mt-10 mx-auto max-w-sm"
    >
      <div class="relative bg-gradient-to-br from-wedding-primary/5 to-wedding-accent/10 rounded-2xl p-5 border border-wedding-primary/20">
        <!-- 아이콘 -->
        <div
          v-motion
          :initial="{ scale: 0, rotate: -180 }"
          :visibleOnce="{ scale: 1, rotate: 0, transition: { delay: 700, duration: 500, ease: 'easeOut' } }"
          class="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-wedding-primary rounded-full flex items-center justify-center shadow-md"
        >
          <Clock class="w-4 h-4 text-white" />
        </div>

        <div class="pt-3 text-[13px] leading-relaxed text-wedding-text text-center break-keep">
          <div class="mb-2">
            예식장 정책에 따라
          </div>
          <div
            v-motion
            :initial="{ opacity: 0 }"
            :visibleOnce="{ opacity: 1, transition: { delay: 900, duration: 600 } }"
            class="bg-wedding-primary/10 rounded-lg py-2.5 px-3 mb-2 font-medium text-wedding-secondary"
          >
            본식 시작 후 신부 입장 전까지<br>
            약 10분간 출입이 제한됩니다
          </div>
          <div class="text-wedding-text-light text-[12px]">
            여유 있게 오셔서 아름다운 신부의 입장을<br>
            함께 지켜봐주시면 감사하겠습니다
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
