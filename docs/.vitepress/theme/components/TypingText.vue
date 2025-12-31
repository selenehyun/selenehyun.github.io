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
const isTypingStarted = ref(false)
const isTypingComplete = ref(false)
const currentLineIndex = ref(0)

const typeText = async () => {
  if (hasAnimated.value) return
  hasAnimated.value = true
  isTypingStarted.value = true
  isTypingComplete.value = false

  for (let lineIndex = 0; lineIndex < props.lines.length; lineIndex++) {
    currentLineIndex.value = lineIndex
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

  // 타이핑 완료 후 커서 숨김
  isTypingComplete.value = true
}

// 커서를 보여줄지 결정
const showCursor = (index: number) => {
  // 타이핑이 시작되지 않았으면 커서 숨김
  if (!isTypingStarted.value) return false
  // 타이핑이 완료되었으면 커서 숨김
  if (isTypingComplete.value) return false
  // 현재 타이핑 중인 줄에만 커서 표시
  return index === currentLineIndex.value
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
  <div ref="containerRef" class="typing-container relative">
    <!-- 공간 확보용 투명 텍스트 -->
    <div class="invisible" aria-hidden="true">
      <p v-for="(line, index) in lines" :key="`placeholder-${index}`">
        {{ line }}
      </p>
    </div>

    <!-- 실제 타이핑 텍스트 (절대 위치) -->
    <div class="absolute inset-0">
      <p
        v-for="(line, index) in displayedLines"
        :key="index"
        class="typing-line"
      >
        {{ line }}<span v-if="showCursor(index)" class="typing-cursor">|</span>
      </p>
    </div>
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
