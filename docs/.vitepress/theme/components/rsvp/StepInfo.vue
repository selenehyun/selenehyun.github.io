<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  name: string
  phoneLast4: string
  isSubmitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:phoneLast4': [value: string]
  'submit': []
}>()

const nameInput = ref<HTMLInputElement | null>(null)
const phoneInputs = ref<HTMLInputElement[]>([])
const phoneDigits = ref(['', '', '', ''])

// 전화번호 입력 처리
const handlePhoneInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')

  if (value.length > 0) {
    phoneDigits.value[index] = value[0]

    // 다음 입력칸으로 이동
    if (index < 3) {
      phoneInputs.value[index + 1]?.focus()
    }
  } else {
    phoneDigits.value[index] = ''
  }

  emit('update:phoneLast4', phoneDigits.value.join(''))
}

// 백스페이스 처리
const handlePhoneKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !phoneDigits.value[index] && index > 0) {
    phoneInputs.value[index - 1]?.focus()
  }
}

// 붙여넣기 처리
const handlePhonePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 4) || ''

  for (let i = 0; i < 4; i++) {
    phoneDigits.value[i] = pasted[i] || ''
  }

  emit('update:phoneLast4', phoneDigits.value.join(''))

  // 마지막 입력된 칸 다음으로 포커스
  const focusIndex = Math.min(pasted.length, 3)
  phoneInputs.value[focusIndex]?.focus()
}

// 이름 유효성
const isNameValid = () => props.name.trim().length >= 2
const isPhoneValid = () => phoneDigits.value.join('').length === 4

// 폼 제출 가능 여부
const canSubmit = () => isNameValid() && isPhoneValid() && !props.isSubmitting
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-6">
    <h2 class="text-xl font-medium text-wedding-text mb-2">
      마지막으로 알려주세요
    </h2>
    <div class="text-sm text-wedding-text-light mb-8">
      참석 확인을 위해 필요해요
    </div>

    <div class="flex flex-col gap-6 w-full max-w-xs">
      <!-- 성함 -->
      <div class="flex flex-col gap-2">
        <label for="name" class="text-sm text-wedding-text-light">
          성함
        </label>
        <input
          ref="nameInput"
          id="name"
          type="text"
          :value="name"
          @input="emit('update:name', ($event.target as HTMLInputElement).value)"
          placeholder="홍길동"
          autocomplete="name"
          class="w-full px-4 py-3.5 rounded-xl border border-wedding-border
                 text-base text-wedding-text placeholder:text-wedding-text-light/50
                 bg-white focus:outline-none focus:border-wedding-primary
                 transition-colors"
        />
      </div>

      <!-- 연락처 뒷 4자리 -->
      <div class="flex flex-col gap-2">
        <label class="text-sm text-wedding-text-light">
          연락처 뒷 4자리
        </label>
        <div class="flex gap-2 justify-center">
          <input
            v-for="(_, index) in 4"
            :key="index"
            :ref="el => { if (el) phoneInputs[index] = el as HTMLInputElement }"
            type="text"
            inputmode="numeric"
            maxlength="1"
            :value="phoneDigits[index]"
            @input="handlePhoneInput(index, $event)"
            @keydown="handlePhoneKeydown(index, $event)"
            @paste="handlePhonePaste"
            class="w-14 h-14 text-center text-xl font-medium rounded-xl
                   border border-wedding-border bg-white
                   text-wedding-text
                   focus:outline-none focus:border-wedding-primary
                   transition-colors"
            :aria-label="`연락처 ${index + 1}번째 자리`"
          />
        </div>
        <div class="text-xs text-wedding-text-light text-center mt-1">
          중복 확인에만 사용됩니다
        </div>
      </div>
    </div>

    <!-- 전송 버튼 -->
    <button
      type="button"
      @click="emit('submit')"
      :disabled="!canSubmit()"
      class="mt-10 w-full max-w-xs py-4 rounded-xl
             bg-wedding-primary text-white font-medium
             transition-all duration-200 active:scale-98
             hover:bg-wedding-secondary
             disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="isSubmitting">전송 중...</span>
      <span v-else>전송하기</span>
    </button>
  </div>
</template>
