<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
</script>

<template>
  <section class="py-16 px-6 text-center bg-white">
    <SectionTitle title="Invitation" subtitle="소중한 분들을 초대합니다" />

    <!-- Greeting Text -->
    <p class="text-[15px] leading-[2.4] text-wedding-text break-keep">
      서로가 마주보며 다져온 사랑을<br>
      이제 함께 한 곳을 바라보며<br>
      걸어가고자 합니다.
    </p>

    <p class="text-[15px] leading-[2.4] text-wedding-text break-keep mt-6">
      저희 두 사람이 사랑의 이름으로<br>
      지켜나갈 수 있게<br>
      오셔서 축복해 주시면<br>
      더없는 기쁨으로 간직하겠습니다.
    </p>

    <!-- Decorative Element -->
    <div class="flex items-center justify-center gap-3 my-10">
      <div class="w-16 h-px bg-wedding-border"></div>
      <span class="text-wedding-primary text-lg">✿</span>
      <div class="w-16 h-px bg-wedding-border"></div>
    </div>

    <!-- Parents Info -->
    <div class="text-[13px] leading-loose text-wedding-text space-y-5">
      <!-- Groom -->
      <div>
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
      <div>
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
