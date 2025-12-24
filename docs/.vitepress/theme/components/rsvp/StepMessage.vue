<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'next': []
  'skip': []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-6">
    <h2 class="text-xl font-medium text-wedding-text mb-2">
      축하 메시지를 남겨주세요
    </h2>
    <div class="text-sm text-wedding-text-light mb-8 text-center">
      참석은 어렵지만<br>
      따뜻한 한마디를 전해주세요
    </div>

    <div class="w-full max-w-xs">
      <textarea
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        placeholder="축하합니다! 행복하세요 💕"
        rows="4"
        maxlength="200"
        class="w-full px-4 py-3.5 rounded-xl border border-wedding-border
               text-base text-wedding-text placeholder:text-wedding-text-light/50
               bg-white focus:outline-none focus:border-wedding-primary
               transition-colors resize-none"
      />
      <div class="text-right text-xs text-wedding-text-light mt-1">
        {{ modelValue.length }}/200
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-8 w-full max-w-xs">
      <!-- 메시지 남기고 다음 -->
      <button
        type="button"
        @click="emit('next')"
        class="w-full py-4 rounded-xl
               bg-wedding-primary text-white font-medium
               transition-all duration-200 active:scale-98
               hover:bg-wedding-secondary"
      >
        다음
      </button>

      <!-- 생략하고 다음 -->
      <button
        type="button"
        @click="emit('skip')"
        class="w-full py-3 rounded-xl
               bg-transparent text-wedding-text-light font-medium
               transition-all duration-200
               hover:text-wedding-text"
      >
        생략하기
      </button>
    </div>
  </div>
</template>
