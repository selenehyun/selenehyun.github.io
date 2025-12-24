<script setup lang="ts">
interface Props {
  modelValue: 'groom' | 'bride' | null
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: 'groom' | 'bride']
  'next': []
}>()

const selectSide = (side: 'groom' | 'bride') => {
  emit('update:modelValue', side)
  // 자동으로 다음 스텝으로
  setTimeout(() => emit('next'), 200)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-6">
    <h2 class="text-xl font-medium text-wedding-text mb-2">
      어느 쪽 하객이신가요?
    </h2>
    <p class="text-sm text-wedding-text-light mb-8">
      선택해 주세요
    </p>

    <div class="flex gap-4 w-full max-w-xs">
      <!-- 신랑측 -->
      <button
        type="button"
        @click="selectSide('groom')"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-3',
          'py-8 px-4 rounded-2xl border-2 transition-all duration-200',
          'active:scale-95',
          modelValue === 'groom'
            ? 'border-wedding-primary bg-wedding-primary/10'
            : 'border-wedding-border bg-white hover:border-wedding-primary/50'
        ]"
        aria-label="신랑측 선택"
      >
        <span class="text-4xl">👔</span>
        <span
          :class="[
            'text-base font-medium',
            modelValue === 'groom' ? 'text-wedding-primary' : 'text-wedding-text'
          ]"
        >
          신랑측
        </span>
      </button>

      <!-- 신부측 -->
      <button
        type="button"
        @click="selectSide('bride')"
        :class="[
          'flex-1 flex flex-col items-center justify-center gap-3',
          'py-8 px-4 rounded-2xl border-2 transition-all duration-200',
          'active:scale-95',
          modelValue === 'bride'
            ? 'border-wedding-primary bg-wedding-primary/10'
            : 'border-wedding-border bg-white hover:border-wedding-primary/50'
        ]"
        aria-label="신부측 선택"
      >
        <span class="text-4xl">👗</span>
        <span
          :class="[
            'text-base font-medium',
            modelValue === 'bride' ? 'text-wedding-primary' : 'text-wedding-text'
          ]"
        >
          신부측
        </span>
      </button>
    </div>
  </div>
</template>
