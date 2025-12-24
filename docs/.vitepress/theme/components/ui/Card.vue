<script setup lang="ts">
import { cn } from '../../lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    :class="
      cn(
        // Base styles
        'rounded-2xl bg-white',
        'border border-solid border-wedding-border',
        'shadow-sm',
        $props.class
      )
    "
  >
    <slot />
  </div>
</template>
