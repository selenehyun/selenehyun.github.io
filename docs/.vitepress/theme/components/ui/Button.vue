<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: 'default' | 'outline' | 'ghost'
  }>(),
  {
    variant: 'default'
  }
)

const variantClasses = {
  default: '',
  outline: 'bg-transparent border border-solid border-wedding-border text-wedding-text hover:bg-wedding-bg',
  ghost: 'bg-transparent text-wedding-text hover:bg-wedding-bg'
}

const delegatedProps = computed(() => {
  const { class: _, variant: __, ...rest } = props
  return rest
})
</script>

<template>
  <button
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex items-center justify-center gap-2 w-full',
        variantClasses[variant],
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
