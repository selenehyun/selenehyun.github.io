<script setup lang="ts">
import NumberStepper from './NumberStepper.vue'

interface Props {
  guestCount: number
  mealCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:guestCount': [value: number]
  'update:mealCount': [value: number]
  'next': []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-6">
    <h2 class="text-xl font-medium text-wedding-text mb-2">
      몇 분이 오시나요?
    </h2>
    <div class="text-sm text-wedding-text-light mb-10">
      본인 포함 인원을 선택해 주세요
    </div>

    <div class="flex flex-col gap-8 w-full max-w-xs">
      <!-- 참석 인원 -->
      <NumberStepper
        :modelValue="guestCount"
        @update:modelValue="emit('update:guestCount', $event)"
        :min="1"
        :max="10"
        label="참석 인원"
      />

      <!-- 식사 인원 -->
      <NumberStepper
        :modelValue="mealCount"
        @update:modelValue="emit('update:mealCount', $event)"
        :min="0"
        :max="guestCount"
        label="식사 인원"
      />
    </div>

    <!-- 다음 버튼 -->
    <button
      type="button"
      @click="emit('next')"
      class="mt-10 w-full max-w-xs py-4 rounded-xl
             bg-wedding-primary text-white font-medium
             transition-all duration-200 active:scale-98
             hover:bg-wedding-secondary"
    >
      다음
    </button>
  </div>
</template>
