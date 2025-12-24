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
        'w-full shadow-sm',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        props.class
      )
    "
  />
</template>
