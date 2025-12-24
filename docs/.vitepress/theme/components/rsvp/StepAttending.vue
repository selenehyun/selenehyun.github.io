<script setup lang="ts">
interface Props {
  modelValue: boolean | null
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'next': []
}>()

const selectAttending = (attending: boolean) => {
  emit('update:modelValue', attending)
  // 자동으로 다음 스텝으로
  setTimeout(() => emit('next'), 200)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-6">
    <h2 class="text-xl font-medium text-wedding-text mb-2">
      참석 가능하신가요?
    </h2>
    <div class="text-sm text-wedding-text-light mb-8">
      2026년 4월 19일 일요일 오전 11시
    </div>

    <div class="flex gap-4 w-full max-w-xs">
      <!-- 참석 -->
      <button
        type="button"
        @click="selectAttending(true)"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-3',
          'py-8 px-4 rounded-2xl border-2 transition-all duration-200',
          'active:scale-95',
          modelValue === true
            ? 'border-wedding-primary bg-white'
            : 'border-wedding-border bg-white hover:border-wedding-primary/50'
        ]"
        aria-label="참석 선택"
      >
        <span class="text-4xl">🎉</span>
        <span
          :class="[
            'text-base font-medium',
            modelValue === true ? 'text-wedding-secondary' : 'text-wedding-text'
          ]"
        >
          참석할게요
        </span>
      </button>

      <!-- 불참 -->
      <button
        type="button"
        @click="selectAttending(false)"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-3',
          'py-8 px-4 rounded-2xl border-2 transition-all duration-200',
          'active:scale-95',
          modelValue === false
            ? 'border-wedding-primary bg-white'
            : 'border-wedding-border bg-white hover:border-wedding-primary/50'
        ]"
        aria-label="불참 선택"
      >
        <span class="text-4xl">😢</span>
        <span
          :class="[
            'text-base font-medium',
            modelValue === false ? 'text-wedding-secondary' : 'text-wedding-text'
          ]"
        >
          참석이<br>어려워요
        </span>
      </button>
    </div>
  </div>
</template>
