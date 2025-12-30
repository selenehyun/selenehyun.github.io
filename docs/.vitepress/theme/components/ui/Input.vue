<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    error?: boolean
    modelValue?: string
  }>(),
  {
    error: false,
    modelValue: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const delegatedProps = computed(() => {
  const { class: _, error: __, modelValue: ___, ...rest } = props
  return rest
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    v-bind="delegatedProps"
    :value="modelValue"
    @input="handleInput"
    :class="
      cn(
        // Base styles
        'flex h-11 w-full rounded-xl px-4 py-3',
        'text-sm text-foreground bg-background',
        'border border-input',
        'shadow-sm transition-all duration-200',
        // Placeholder
        'placeholder:text-muted-foreground',
        // Focus state
        'focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
        // Error state
        error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        props.class
      )
    "
  />
</template>
