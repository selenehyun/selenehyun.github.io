<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'soft'
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'pill' | 'pill-sm'
  }>(),
  {
    variant: 'default',
    size: 'default'
  }
)

const variantClasses = {
  default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  soft: 'bg-primary/10 text-primary hover:bg-primary/20'
}

const sizeClasses = {
  default: 'h-11 px-5 py-3 text-sm rounded-xl',
  sm: 'h-9 px-3 py-2 text-xs rounded-lg',
  lg: 'h-12 px-8 py-4 text-base rounded-2xl',
  icon: 'h-10 w-10 rounded-lg',
  pill: 'h-10 px-4 py-2.5 text-[0.8125rem] rounded-full',
  'pill-sm': 'h-8 px-4 py-1.5 text-xs rounded-full'
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
        // Base styles
        'inline-flex items-center justify-center gap-2 whitespace-nowrap',
        'font-medium transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        // Disabled state
        'disabled:pointer-events-none disabled:opacity-50',
        // Variant & Size
        variantClasses[variant],
        sizeClasses[size],
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
