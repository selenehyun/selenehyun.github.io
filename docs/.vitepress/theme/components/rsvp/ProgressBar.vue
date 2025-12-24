<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  current: number
  total: number
}

const props = defineProps<Props>()

const progress = computed(() => {
  return (props.current / props.total) * 100
})
</script>

<template>
  <div class="w-full px-6 py-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-wedding-text-light">
        {{ current }} / {{ total }}
      </span>
    </div>
    <div
      class="h-1 bg-wedding-border rounded-full overflow-hidden"
      role="progressbar"
      :aria-valuenow="current"
      :aria-valuemin="1"
      :aria-valuemax="total"
    >
      <div
        class="h-full bg-wedding-primary rounded-full transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
