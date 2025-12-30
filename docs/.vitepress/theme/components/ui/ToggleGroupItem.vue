<script setup lang="ts">
import { inject, computed } from 'vue'
import type { ComputedRef } from 'vue'
import { cn } from '../../lib/utils'
import type { ToggleGroupVariant, ToggleGroupSize } from './ToggleGroup.vue'

const props = defineProps<{
  value: string
  class?: string
  disabled?: boolean
}>()

const toggleGroup = inject<{
  isSelected: (value: string) => boolean
  toggleValue: (value: string) => void
  variant: ComputedRef<ToggleGroupVariant>
  size: ComputedRef<ToggleGroupSize>
}>('toggleGroup')

const isActive = computed(() => toggleGroup?.isSelected(props.value) ?? false)
const variant = computed(() => toggleGroup?.variant.value ?? 'default')
const size = computed(() => toggleGroup?.size.value ?? 'default')

const handleClick = () => {
  if (!props.disabled) {
    toggleGroup?.toggleValue(props.value)
  }
}

const variantClasses = computed(() => {
  const base = isActive.value
    ? 'bg-background text-foreground shadow-sm'
    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'

  if (variant.value === 'outline') {
    return isActive.value
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
  }

  return base
})

const sizeClasses = computed(() => {
  switch (size.value) {
    case 'sm':
      return 'h-8 px-2.5 text-xs'
    case 'lg':
      return 'h-11 px-5 text-base'
    default:
      return 'h-9 px-3 text-sm'
  }
})
</script>

<template>
  <button
    type="button"
    role="radio"
    :aria-checked="isActive"
    :aria-disabled="disabled"
    :disabled="disabled"
    :data-state="isActive ? 'on' : 'off'"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium',
      'ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      variantClasses,
      sizeClasses,
      props.class
    )"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
