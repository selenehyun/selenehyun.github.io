<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'lg'
  }>(),
  {
    variant: 'default',
    size: 'default'
  }
)

const variantClasses = {
  default: 'bg-wedding-primary text-white hover:bg-wedding-primary/90 active:bg-wedding-primary/80',
  outline: 'bg-transparent border border-solid border-wedding-border text-wedding-text hover:bg-wedding-bg active:bg-wedding-border/50',
  ghost: 'bg-transparent text-wedding-text hover:bg-wedding-bg active:bg-wedding-border/50'
}

const sizeClasses = {
  sm: 'h-9 px-3 py-2 text-xs rounded-lg',
  default: 'h-11 px-5 py-3 text-sm rounded-xl',
  lg: 'h-12 px-6 py-4 text-base rounded-xl'
}

const delegatedProps = computed(() => {
  const { class: _, variant: __, size: ___, ...rest } = props
  return rest
})
</script>

<template>
  <button
    v-bind="delegatedProps"
    :class="
      cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-wedding-primary/20',
        // Disabled state
        'disabled:pointer-events-none disabled:opacity-50',
        // Variant & Size
        variantClasses[variant],
        sizeClasses[size],
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
