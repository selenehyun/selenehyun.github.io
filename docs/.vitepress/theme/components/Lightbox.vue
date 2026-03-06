<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  images: string[]
  initialIndex?: number
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const currentIndex = ref(props.initialIndex)

// 스와이프 관련
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)

// props.initialIndex가 변경되면 currentIndex 업데이트
watch(() => props.initialIndex, (newIndex) => {
  currentIndex.value = newIndex
})

// 닫기
const close = () => {
  emit('update:modelValue', false)
}

// 이전 이미지
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.images.length - 1
  }
}

// 다음 이미지
const next = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

// 키보드 이벤트
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.modelValue) return

  switch (e.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      prev()
      break
    case 'ArrowRight':
      next()
      break
  }
}

// 터치 이벤트 (스와이프)
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchEndX.value = e.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  const diff = touchStartX.value - touchEndX.value
  const threshold = 50 // 최소 스와이프 거리

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      next() // 왼쪽으로 스와이프 → 다음
    } else {
      prev() // 오른쪽으로 스와이프 → 이전
    }
  }

  touchStartX.value = 0
  touchEndX.value = 0
}

// 배경 클릭으로 닫기
const handleBackgroundClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // 스크롤 방지
  if (props.modelValue) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// modelValue 변경 시 스크롤 제어
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        @click="handleBackgroundClick"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- 닫기 버튼 -->
        <button
          @click="close"
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center
                 text-white/80 hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X :size="24" />
        </button>

        <!-- 인덱스 표시 -->
        <div class="absolute top-4 left-4 text-white/80 text-sm font-medium">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <!-- 이전 버튼 -->
        <button
          v-if="images.length > 1"
          @click.stop="prev"
          class="absolute left-2 md:left-4 z-10 w-10 h-10 flex items-center justify-center
                 text-white/60 hover:text-white transition-colors
                 bg-black/20 hover:bg-black/40 rounded-full"
          aria-label="이전 사진"
        >
          <ChevronLeft :size="24" />
        </button>

        <!-- 이미지 -->
        <div class="w-full h-full flex items-center justify-center p-4 md:p-12">
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
            mode="out-in"
          >
            <img
              :key="currentIndex"
              :src="images[currentIndex]"
              :alt="`사진 ${currentIndex + 1}`"
              class="max-w-full max-h-full object-contain select-none"
              draggable="false"
            />
          </Transition>
        </div>

        <!-- 다음 버튼 -->
        <button
          v-if="images.length > 1"
          @click.stop="next"
          class="absolute right-2 md:right-4 z-10 w-10 h-10 flex items-center justify-center
                 text-white/60 hover:text-white transition-colors
                 bg-black/20 hover:bg-black/40 rounded-full"
          aria-label="다음 사진"
        >
          <ChevronRight :size="24" />
        </button>

        <!-- 하단 인디케이터 (도트) -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
        >
          <button
            v-for="(_, index) in images"
            :key="index"
            @click.stop="currentIndex = index"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-200',
              currentIndex === index
                ? 'bg-white w-4'
                : 'bg-white/40 hover:bg-white/60'
            ]"
            :aria-label="`사진 ${index + 1}로 이동`"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
