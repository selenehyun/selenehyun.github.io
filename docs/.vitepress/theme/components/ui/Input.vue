<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    error?: boolean
  }>(),
  {
    error: false
  }
)

const delegatedProps = computed(() => {
  const { class: _, error: __, ...rest } = props
  return rest
})
</script>

<template>
  <input
    v-bind="delegatedProps"
    :class="
      cn(
        // Base styles
        'flex h-11 w-full rounded-xl px-4 py-3',
        'text-sm text-wedding-text bg-white',
        'border border-solid border-wedding-border',
        'shadow-sm transition-all duration-200',
        // Placeholder
        'placeholder:text-wedding-text-light/50',
        // Focus state
        'focus:outline-none focus:border-wedding-primary focus:ring-2 focus:ring-wedding-primary/20',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-wedding-bg',
        // Error state
        error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        props.class
      )
    "
  />
</template>
