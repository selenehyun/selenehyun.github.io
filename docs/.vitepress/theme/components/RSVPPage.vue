<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import { useRSVP } from '../composables/useRSVP'
import ProgressBar from './rsvp/ProgressBar.vue'
import StepSide from './rsvp/StepSide.vue'
import StepAttending from './rsvp/StepAttending.vue'
import StepCount from './rsvp/StepCount.vue'
import StepMessage from './rsvp/StepMessage.vue'
import StepInfo from './rsvp/StepInfo.vue'
import StepComplete from './rsvp/StepComplete.vue'

const {
  formData,
  currentStep,
  totalSteps,
  isSubmitting,
  isComplete,
  error,
  existingEntry,
  sideAutoSelected,
  nextStep,
  prevStep,
  submitRSVP,
  getActualTotalSteps,
  initFromUrlParams
} = useRSVP()

// URL 파라미터에서 side 초기화 (부모님 공유 링크)
onMounted(() => {
  initFromUrlParams()
})

// 뒤로가기 가능 여부 (side 자동 선택 시 step 2에서 뒤로가기 불가)
const minStep = computed(() => sideAutoSelected.value ? 2 : 1)
const canGoBack = computed(() => currentStep.value > minStep.value && !isComplete.value)

// Step 3에서 인원 선택인지 메시지인지
const isCountStep = computed(() => currentStep.value === 3 && formData.value.attending === true)
const isMessageStep = computed(() => currentStep.value === 3 && formData.value.attending === false)

// 메시지 생략 시 다음으로
const skipMessage = () => {
  formData.value.message = ''
  nextStep()
}

// 에러 처리
const handleSubmit = async () => {
  await submitRSVP()
}
</script>

<template>
  <div class="min-h-screen bg-wedding-bg flex flex-col">
    <!-- 헤더 -->
    <header class="sticky top-0 z-10 bg-wedding-bg/80 backdrop-blur-sm">
      <!-- 뒤로가기 -->
      <div class="h-12 flex items-center px-4">
        <button
          v-if="canGoBack"
          type="button"
          @click="prevStep"
          class="!w-10 !h-10 !p-0 -ml-2 flex items-center justify-center
                 !text-wedding-text !bg-transparent !border-0 rounded-full
                 hover:!bg-wedding-border/30 transition-colors"
          aria-label="이전 단계로"
        >
          <ChevronLeft :size="24" class="!w-6 !h-6" />
        </button>
      </div>

      <!-- 진행률 -->
      <ProgressBar
        v-if="!isComplete"
        :current="currentStep"
        :total="getActualTotalSteps()"
      />
    </header>

    <!-- 타이틀 -->
    <div
      v-if="!isComplete"
      class="text-center pt-2 pb-4"
    >
      <div class="text-xs text-wedding-text-light tracking-widest mb-1">
        승현 ♥ 서영
      </div>
      <h1 class="text-sm font-medium text-wedding-text">
        참석 여부 알리기
      </h1>
    </div>

    <!-- 컨텐츠 -->
    <main class="flex-1">
      <!-- 에러 메시지 -->
      <div
        v-if="error"
        class="mx-6 mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center"
        role="alert"
        aria-live="polite"
      >
        {{ error }}
      </div>

      <!-- 완료 화면 -->
      <StepComplete
        v-if="isComplete"
        :attending="formData.attending ?? false"
        :isUpdate="!!existingEntry"
      />

      <!-- Step 1: 신랑/신부측 -->
      <StepSide
        v-else-if="currentStep === 1"
        v-model="formData.side"
        @next="nextStep"
      />

      <!-- Step 2: 참석 여부 -->
      <StepAttending
        v-else-if="currentStep === 2"
        v-model="formData.attending"
        @next="nextStep"
      />

      <!-- Step 3: 인원 선택 (참석 시) -->
      <StepCount
        v-else-if="isCountStep"
        :guestCount="formData.guestCount"
        :mealCount="formData.mealCount"
        @update:guestCount="formData.guestCount = $event"
        @update:mealCount="formData.mealCount = $event"
        @next="nextStep"
      />

      <!-- Step 3: 축하 메시지 (불참 시) -->
      <StepMessage
        v-else-if="isMessageStep"
        v-model="formData.message"
        @next="nextStep"
        @skip="skipMessage"
      />

      <!-- Step 4: 정보 입력 -->
      <StepInfo
        v-else-if="currentStep === 4"
        :name="formData.name"
        :phoneLast4="formData.phoneLast4"
        :isSubmitting="isSubmitting"
        @update:name="formData.name = $event"
        @update:phoneLast4="formData.phoneLast4 = $event"
        @submit="handleSubmit"
      />
    </main>

    <!-- 푸터: 청첩장으로 돌아가기 -->
    <footer
      v-if="!isComplete"
      class="py-6 text-center"
    >
      <a
        href="/"
        class="text-sm text-wedding-text-light hover:text-wedding-primary transition-colors"
      >
        ← 청첩장 보기
      </a>
    </footer>
  </div>
</template>
