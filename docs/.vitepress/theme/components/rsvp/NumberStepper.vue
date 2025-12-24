<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'

interface Props {
  modelValue: number
  min?: number
  max?: number
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 10
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const decrease = () => {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

const increase = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm text-wedding-text-light text-center">{{ label }}</label>
    <div class="flex items-center justify-center gap-3">
      <button
        type="button"
        @click="decrease"
        :disabled="modelValue <= min"
        :aria-label="`${label} 감소`"
        class="w-12 h-12 rounded-full flex items-center justify-center
               bg-wedding-bg border border-wedding-border
               text-wedding-text transition-all duration-200
               active:scale-95
               disabled:opacity-40 disabled:cursor-not-allowed
               hover:bg-wedding-border/50"
      >
        <Minus :size="20" />
      </button>

      <div
        class="w-16 h-14 flex items-center justify-center
               text-2xl font-semibold text-wedding-primary
               bg-white rounded-xl border border-wedding-border"
        :aria-label="`${label}: ${modelValue}명`"
      >
        {{ modelValue }}
      </div>

      <button
        type="button"
        @click="increase"
        :disabled="modelValue >= max"
        :aria-label="`${label} 증가`"
        class="w-12 h-12 rounded-full flex items-center justify-center
               bg-wedding-primary text-white transition-all duration-200
               active:scale-95
               disabled:opacity-40 disabled:cursor-not-allowed
               hover:bg-wedding-secondary"
      >
        <Plus :size="20" />
      </button>
    </div>
    <span class="text-xs text-wedding-text-light text-center">명</span>
  </div>
</template>
