<script setup lang="ts">
import { provide, ref, watch, computed } from 'vue'
import { cn } from '../../lib/utils'

export type ToggleGroupVariant = 'default' | 'outline'
export type ToggleGroupSize = 'default' | 'sm' | 'lg'

const props = withDefaults(
  defineProps<{
    type?: 'single' | 'multiple'
    modelValue?: string | string[]
    variant?: ToggleGroupVariant
    size?: ToggleGroupSize
    class?: string
  }>(),
  {
    type: 'single',
    variant: 'default',
    size: 'default'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal
})

const isSelected = (value: string): boolean => {
  if (props.type === 'multiple') {
    return Array.isArray(internalValue.value) && internalValue.value.includes(value)
  }
  return internalValue.value === value
}

const toggleValue = (value: string) => {
  if (props.type === 'multiple') {
    const current = Array.isArray(internalValue.value) ? [...internalValue.value] : []
    const index = current.indexOf(value)
    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(value)
    }
    internalValue.value = current
    emit('update:modelValue', current)
  } else {
    internalValue.value = value
    emit('update:modelValue', value)
  }
}

provide('toggleGroup', {
  isSelected,
  toggleValue,
  variant: computed(() => props.variant),
  size: computed(() => props.size)
})
</script>

<template>
  <div
    role="group"
    :class="cn(
      'inline-flex items-center justify-center gap-1 rounded-lg bg-muted p-1 flex-wrap',
      props.class
    )"
  >
    <slot />
  </div>
</template>
