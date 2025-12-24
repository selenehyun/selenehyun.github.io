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
  default: 'bg-wedding-primary text-white hover:bg-wedding-primary/90',
  outline: 'border border-wedding-border bg-transparent hover:bg-wedding-bg',
  ghost: 'hover:bg-wedding-bg'
}

const sizeClasses = {
  default: 'h-11 px-5 py-3',
  sm: 'h-9 px-3 py-2 text-xs',
  lg: 'h-12 px-6 py-4'
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
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wedding-primary/20',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
