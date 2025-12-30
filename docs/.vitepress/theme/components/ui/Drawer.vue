<script setup lang="ts">
import { computed } from 'vue'
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from 'vaul-vue'
import { cn } from '../../lib/utils'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    open?: boolean
    class?: string
    showClose?: boolean
  }>(),
  {
    open: false,
    showClose: true
  }
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})
</script>

<template>
  <DrawerRoot v-model:open="isOpen">
    <!-- Trigger slot -->
    <slot name="trigger">
      <DrawerTrigger as-child>
        <slot name="trigger-content" />
      </DrawerTrigger>
    </slot>

    <DrawerPortal>
      <!-- Overlay -->
      <DrawerOverlay
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      <!-- Content -->
      <DrawerContent
        :class="
          cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[20px] bg-wedding-bg',
            'focus:outline-none',
            props.class
          )
        "
      >
        <!-- Handle -->
        <div class="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-wedding-border" />

        <!-- Close button -->
        <DrawerClose
          v-if="showClose"
          class="absolute right-4 top-4 rounded-full p-2 text-wedding-text-light hover:bg-wedding-border/50 transition-colors"
        >
          <X class="h-5 w-5" />
        </DrawerClose>

        <!-- Content wrapper -->
        <div class="flex flex-col px-6 pb-8 pt-4">
          <!-- Title -->
          <DrawerTitle v-if="$slots.title" class="text-lg font-semibold text-wedding-text text-center mb-2">
            <slot name="title" />
          </DrawerTitle>

          <!-- Description -->
          <DrawerDescription v-if="$slots.description" class="text-sm text-wedding-text-light text-center mb-6">
            <slot name="description" />
          </DrawerDescription>

          <!-- Main content -->
          <slot />
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
