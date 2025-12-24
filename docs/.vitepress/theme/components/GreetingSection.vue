<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
import TypingText from './TypingText.vue'

const greetingLines1 = [
  '함께하는 일상이 자연스러워진 두 사람,',
  '쫑아리와 함께 지내며',
  '가족의 마음을 조금씩 배워왔습니다.'
]

const greetingLines2 = [
  '그리고 새로 찾아온 똑똑이와 함께',
  '가족의 첫 시작을 열려 합니다.',
  '가족으로 첫걸음을 내딛는 날, 함께해 주세요.'
]
</script>

<template>
  <section class="py-16 px-6 text-center bg-white">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Invitation" subtitle="소중한 분들을 초대합니다" />
    </div>

    <!-- Greeting Text with Typing Effect -->
    <div class="text-[15px] leading-[2.4] text-wedding-text break-keep">
      <TypingText :lines="greetingLines1" :delay="300" />
    </div>

    <div class="text-[15px] leading-[2.4] text-wedding-text break-keep mt-6">
      <TypingText :lines="greetingLines2" :delay="2500" />
    </div>

    <!-- Decorative Element -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 300, duration: 500 } }"
      class="flex items-center justify-center gap-3 my-10"
    >
      <div class="w-16 h-px bg-wedding-border"></div>
      <span class="text-wedding-primary text-lg">✿</span>
      <div class="w-16 h-px bg-wedding-border"></div>
    </div>

    <!-- Parents Info -->
    <div class="text-[13px] leading-loose text-wedding-text space-y-5">
      <!-- Groom -->
      <div
        v-motion
        :initial="{ opacity: 0, x: -20 }"
        :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 400, duration: 500 } }"
      >
        <p class="text-wedding-text-light text-xs mb-2">신랑측</p>
        <p class="mb-1">
          <span class="text-wedding-text-light">아버지</span>
          <span class="mx-1">OOO</span>
          <span class="text-wedding-primary mx-2">·</span>
          <span class="text-wedding-text-light">어머니</span>
          <span class="mx-1">OOO</span>
        </p>
        <p>
          <span class="text-wedding-text-light">의 아들</span>
          <span class="font-medium text-wedding-text ml-1 text-base">승현</span>
        </p>
      </div>

      <!-- Bride -->
      <div
        v-motion
        :initial="{ opacity: 0, x: 20 }"
        :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 500, duration: 500 } }"
      >
        <p class="text-wedding-text-light text-xs mb-2">신부측</p>
        <p class="mb-1">
          <span class="text-wedding-text-light">아버지</span>
          <span class="mx-1">OOO</span>
          <span class="text-wedding-primary mx-2">·</span>
          <span class="text-wedding-text-light">어머니</span>
          <span class="mx-1">OOO</span>
        </p>
        <p>
          <span class="text-wedding-text-light">의 딸</span>
          <span class="font-medium text-wedding-text ml-1 text-base">서영</span>
        </p>
      </div>
    </div>
  </section>
</template>
