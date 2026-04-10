<script setup lang="ts">
import { Users, Heart, Sparkles, Gem, MessageCircleHeart, Mic2, Flame, User, ScrollText, Music, ArrowRight, Flag } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'

const schedule = [
  {
    time: '10:30',
    event: '하객 입장',
    icon: Users,
    note: ''
  },
  {
    time: '11:00',
    event: '개식사',
    icon: Mic2,
    note: '신부 입장 시까지 문이 닫힙니다'
  },
  {
    time: '',
    event: '화촉 점화',
    icon: Flame,
    note: ''
  },
  {
    time: '',
    event: '신랑 입장',
    icon: User,
    note: ''
  },
  {
    time: '',
    event: '신부 입장',
    icon: Sparkles,
    note: ''
  },
  {
    time: '',
    event: '신랑 신부 맞절',
    icon: Heart,
    note: ''
  },
  {
    time: '',
    event: '혼인 서약',
    icon: ScrollText,
    note: ''
  },
  {
    time: '',
    event: '덕담 및 성혼 선언',
    icon: Gem,
    note: ''
  },
  {
    time: '',
    event: '축가',
    icon: Music,
    note: ''
  },
  {
    time: '',
    event: '축사',
    icon: MessageCircleHeart,
    note: ''
  },
  {
    time: '',
    event: '양가 부모님 및 하객께 인사',
    icon: Users,
    note: ''
  },
  {
    time: '',
    event: '신랑 신부 행진',
    icon: ArrowRight,
    note: ''
  },
  {
    time: '',
    event: '폐식',
    icon: Flag,
    note: ''
  }
]
</script>

<template>
  <section id="ceremony" class="py-14 px-6 bg-white">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Ceremony" subtitle="식순 안내" />
    </div>

    <!-- 타임라인 -->
    <div class="max-w-sm mx-auto mt-2">
      <div class="relative">
        <!-- 세로선 -->
        <div class="absolute left-[23px] top-3 bottom-3 w-px bg-wedding-border" />

        <!-- 항목들 -->
        <div class="space-y-0">
          <div
            v-for="(item, index) in schedule"
            :key="index"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :visibleOnce="{
              opacity: 1,
              x: 0,
              transition: {
                delay: 100 + index * 80,
                duration: 400
              }
            }"
            class="relative flex items-start gap-4 py-3"
          >
            <!-- 아이콘 원 -->
            <div
              :class="[
                'relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                item.time
                  ? 'bg-rose-50 text-wedding-primary'
                  : 'bg-wedding-bg text-wedding-text-light'
              ]"
            >
              <component :is="item.icon" :size="20" />
            </div>

            <!-- 내용 -->
            <div class="flex-1 pt-2.5">
              <div class="flex items-baseline gap-2">
                <!-- 시간 -->
                <span
                  v-if="item.time"
                  class="text-sm font-medium text-wedding-primary min-w-[45px]"
                >
                  {{ item.time }}
                </span>
                <span v-else class="min-w-[45px]" />

                <!-- 이벤트명 -->
                <span
                  :class="[
                    'text-[0.9375rem]',
                    item.time ? 'font-medium text-wedding-text' : 'text-wedding-text-light'
                  ]"
                >
                  {{ item.event }}
                </span>
              </div>

              <!-- 부가 설명 -->
              <p
                v-if="item.note"
                class="text-xs text-wedding-text-light/80 mt-1 ml-[45px] pl-2"
              >
                {{ item.note }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
