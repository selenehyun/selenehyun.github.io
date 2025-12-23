<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'

const props = defineProps<{
  lines: string[]
  delay?: number
}>()

const containerRef = ref<HTMLElement | null>(null)
const isVisible = useElementVisibility(containerRef)
const displayedLines = ref<string[]>([])
const hasAnimated = ref(false)

const typeText = async () => {
  if (hasAnimated.value) return
  hasAnimated.value = true

  for (let lineIndex = 0; lineIndex < props.lines.length; lineIndex++) {
    const line = props.lines[lineIndex]
    displayedLines.value[lineIndex] = ''

    for (let charIndex = 0; charIndex <= line.length; charIndex++) {
      displayedLines.value[lineIndex] = line.slice(0, charIndex)
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Small pause between lines
    if (lineIndex < props.lines.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}

watch(isVisible, (visible) => {
  if (visible && !hasAnimated.value) {
    setTimeout(() => typeText(), props.delay || 0)
  }
})

onMounted(() => {
  // Initialize with empty strings
  displayedLines.value = props.lines.map(() => '')
})
</script>

<template>
  <div ref="containerRef" class="typing-container">
    <p
      v-for="(line, index) in displayedLines"
      :key="index"
      class="typing-line"
    >
      {{ line }}<span v-if="index === displayedLines.length - 1 || (displayedLines[index]?.length || 0) < (lines[index]?.length || 0)" class="typing-cursor">|</span>
    </p>
  </div>
</template>

<style scoped>
.typing-cursor {
  animation: blink 0.7s infinite;
  color: var(--wedding-primary, #c9a87c);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
