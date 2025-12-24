<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useElementVisibility, onClickOutside } from '@vueuse/core'
import { Clock, CalendarPlus } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'
import { useCalendar } from '../composables/useCalendar'

const { openGoogleCalendar, downloadICS, openNaverCalendar } = useCalendar()

const showCalendarOptions = ref(false)
const calendarDropdownRef = ref<HTMLElement | null>(null)

onClickOutside(calendarDropdownRef, () => {
  showCalendarOptions.value = false
})

const toggleCalendarOptions = () => {
  showCalendarOptions.value = !showCalendarOptions.value
}

const selectCalendar = (type: 'google' | 'naver' | 'ics') => {
  showCalendarOptions.value = false
  if (type === 'google') {
    openGoogleCalendar()
  } else if (type === 'naver') {
    openNaverCalendar()
  } else {
    downloadICS()
  }
}

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

      <div class="grid grid-cols-7 gap-0.5 text-[0.8125rem]">
        <!-- Day Names -->
        <template v-for="(name, idx) in dayNames" :key="name">
          <div
            :class="[
              'py-2 text-[0.6875rem] font-medium',
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
      <p class="text-[0.8125rem] text-wedding-text-light">
        승현 <span class="text-wedding-primary">♥</span> 서영의 결혼식까지
      </p>
      <p class="text-2xl font-light text-wedding-primary mt-2 tracking-wide tabular-nums">
        D-{{ displayDDay }}
      </p>

      <!-- Calendar Save Button -->
      <div
        ref="calendarDropdownRef"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 500, duration: 400 } }"
        class="mt-5 relative inline-block"
      >
        <button
          @click="toggleCalendarOptions"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-wedding-primary/10 hover:bg-wedding-primary/20 text-wedding-secondary rounded-full text-[0.8125rem] font-medium transition-all duration-200"
        >
          <CalendarPlus class="w-4 h-4" />
          <span>캘린더에 저장</span>
        </button>

        <!-- Calendar Options Dropdown -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-2"
        >
          <div
            v-if="showCalendarOptions"
            class="absolute left-1/2 -translate-x-1/2 mt-2 py-2 bg-white rounded-xl shadow-lg border border-wedding-border/50 min-w-[160px] z-10"
          >
            <button
              @click="selectCalendar('google')"
              class="w-full px-4 py-2.5 text-left text-[0.8125rem] text-wedding-text hover:bg-wedding-bg transition-colors flex items-center gap-3"
            >
              <span class="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" class="w-4 h-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
              Google 캘린더
            </button>
            <button
              @click="selectCalendar('naver')"
              class="w-full px-4 py-2.5 text-left text-[0.8125rem] text-wedding-text hover:bg-wedding-bg transition-colors flex items-center gap-3"
            >
              <span class="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" class="w-4 h-4">
                  <rect fill="#03C75A" width="24" height="24" rx="4"/>
                  <path fill="#fff" d="M16 8v8h-2.4l-3.2-4.8V16H8V8h2.4l3.2 4.8V8H16z"/>
                </svg>
              </span>
              네이버 캘린더
            </button>
            <div class="my-1.5 mx-3 border-t border-wedding-border/30"></div>
            <button
              @click="selectCalendar('ics')"
              class="w-full px-4 py-2.5 text-left text-[0.8125rem] text-wedding-text hover:bg-wedding-bg transition-colors flex items-center gap-3"
            >
              <span class="w-5 h-5 flex items-center justify-center text-wedding-primary">
                <CalendarPlus class="w-4 h-4" />
              </span>
              파일로 저장 (.ics)
            </button>
            <p class="px-4 pt-1 pb-0.5 text-[0.6875rem] text-wedding-text-light/60">
              Apple, Outlook 등
            </p>
          </div>
        </Transition>
      </div>
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

        <div class="pt-3 text-[0.8125rem] leading-relaxed text-wedding-text text-center break-keep">
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
          <div class="text-wedding-text-light text-[0.75rem]">
            여유 있게 오셔서 아름다운 신부의 입장을<br>
            함께 지켜봐주시면 감사하겠습니다
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
