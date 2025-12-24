<script setup lang="ts">
import { cn } from '../../lib/utils'

defineProps<{
  class?: string
  for?: string
}>()
</script>

<template>
  <label
    :for="$props.for"
    :class="
      cn(
        // Base styles
        'text-sm font-medium text-wedding-text-light',
        'leading-none',
        // Disabled state (peer)
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        $props.class
      )
    "
  >
    <slot />
  </label>
</template>
