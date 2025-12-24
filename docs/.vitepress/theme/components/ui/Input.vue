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
        'flex h-11 w-full rounded-xl border border-solid bg-white px-4 py-3 text-sm shadow-sm transition-colors',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-wedding-text-light/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wedding-primary/20 focus-visible:border-wedding-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-red-400' : 'border-wedding-border',
        props.class
      )
    "
  />
</template>
