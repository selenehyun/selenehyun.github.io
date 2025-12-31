<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { ArrowLeft, Upload, X, Camera, Loader2, CheckCircle, Gift, Info } from 'lucide-vue-next'
import { usePhotoUpload } from '../composables/usePhotoUpload'

const {
  name,
  phone,
  selectedFiles,
  previews,
  uploadProgress,
  totalProgress,
  isUploading,
  isComplete,
  error,
  canSubmit,
  handleFileSelect,
  removeFile,
  submitPhotos,
  reset
} = usePhotoUpload()

// 파일 입력 ref
const fileInputRef = ref<HTMLInputElement | null>(null)

// 드래그 상태
const isDragging = ref(false)

// 전화번호 포맷팅 (000-0000-0000)
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
}

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const formatted = formatPhoneNumber(input.value)
  phone.value = formatted
  input.value = formatted
}

// 파일 선택
const openFilePicker = () => {
  fileInputRef.value?.click()
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    handleFileSelect(input.files)
    input.value = '' // 재선택 가능하도록 초기화
  }
}

// 드래그 앤 드롭
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  if (e.dataTransfer?.files) {
    handleFileSelect(e.dataTransfer.files)
  }
}

// 언마운트 시 미리보기 URL 정리
onUnmounted(() => {
  previews.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-wedding-bg">
    <div class="max-w-md mx-auto px-4 py-8">
      <!-- 헤더 -->
      <div class="flex items-center gap-4 mb-8">
        <a
          href="/"
          class="w-10 h-10 rounded-full bg-white border border-wedding-border
                 flex items-center justify-center text-wedding-text
                 hover:bg-wedding-primary hover:text-white hover:border-wedding-primary
                 transition-all duration-200"
        >
          <ArrowLeft :size="18" />
        </a>
        <div>
          <h1 class="text-xl font-medium text-wedding-text">베스트 샷 이벤트</h1>
          <div class="text-sm text-wedding-text-light">
            결혼식 사진을 공유해주세요
          </div>
        </div>
      </div>

      <!-- 완료 화면 -->
      <div v-if="isComplete" class="text-center py-16">
        <div
          v-motion
          :initial="{ scale: 0 }"
          :enter="{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }"
        >
          <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
        </div>
        <h2 class="text-xl font-medium text-wedding-text mb-2">
          사진이 업로드되었습니다!
        </h2>
        <p class="text-sm text-wedding-text-light mb-6">
          참여해주셔서 감사합니다.<br />
          당선자 발표는 결혼식 후 개별 연락드립니다.
        </p>
        <div class="flex gap-3 justify-center">
          <button
            @click="reset"
            class="px-6 py-3 rounded-xl border border-wedding-border
                   text-wedding-text bg-white whitespace-nowrap
                   hover:bg-wedding-bg transition-colors"
          >
            추가 업로드
          </button>
          <a
            href="/"
            class="px-6 py-3 rounded-xl bg-wedding-primary text-white whitespace-nowrap
                   hover:bg-wedding-secondary transition-colors"
          >
            청첩장으로 돌아가기
          </a>
        </div>
      </div>

      <!-- 업로드 폼 -->
      <template v-else>
        <!-- 이벤트 안내 카드 -->
        <div class="p-6 mb-6 rounded-2xl bg-wedding-primary/5 border border-wedding-primary/20">
          <div class="flex items-center gap-3 mb-3">
            <Gift class="w-5 h-5 text-wedding-primary" />
            <span class="font-medium text-wedding-text">베스트 샷 이벤트</span>
          </div>
          <p class="text-sm text-wedding-text-light leading-relaxed break-keep">
            결혼식에서 찍은 사진 중 가장 아름다운 순간을 보내주세요.
            베스트 샷으로 선정되신 분께 <strong class="text-wedding-primary whitespace-nowrap">10만원씩 총 2명</strong>에게 상품권을 드립니다!
          </p>
        </div>

        <!-- 사진 업로드 영역 -->
        <div class="p-6 mb-6 rounded-2xl bg-white border border-wedding-border">
          <label class="text-sm text-wedding-text-light mb-4 block">
            사진 업로드 <span class="text-wedding-primary">*</span>
          </label>

          <!-- 드롭 존 -->
          <div
            @click="openFilePicker"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
              isDragging
                ? 'border-wedding-primary bg-wedding-primary/10'
                : 'border-wedding-border hover:border-wedding-primary/50'
            ]"
          >
            <Camera class="w-10 h-10 mx-auto mb-3 text-wedding-text-light" />
            <p class="text-sm text-wedding-text">
              클릭하거나 사진을 끌어다 놓으세요
            </p>
            <p class="text-xs text-wedding-text-light mt-1">
              여러 장을 한번에 선택할 수 있어요
            </p>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="onFileChange"
          />

          <!-- 미리보기 그리드 -->
          <div v-if="previews.length > 0" class="mt-4">
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(preview, index) in previews"
                :key="index"
                class="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  :src="preview"
                  :alt="`사진 ${index + 1}`"
                  class="w-full h-full object-cover"
                />

                <!-- 업로드 진행률 오버레이 -->
                <div
                  v-if="isUploading && uploadProgress[index]"
                  class="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <div class="text-white text-center">
                    <Loader2
                      v-if="uploadProgress[index].status === 'uploading'"
                      class="w-6 h-6 animate-spin mx-auto mb-1"
                    />
                    <CheckCircle
                      v-else-if="uploadProgress[index].status === 'completed'"
                      class="w-6 h-6 text-green-400 mx-auto mb-1"
                    />
                    <span class="text-xs">
                      {{ Math.round(uploadProgress[index].progress) }}%
                    </span>
                  </div>
                </div>

                <!-- 삭제 버튼 -->
                <button
                  v-if="!isUploading"
                  @click.stop="removeFile(index)"
                  class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50
                         text-white flex items-center justify-center
                         opacity-0 group-hover:opacity-100 md:opacity-0
                         active:opacity-100 transition-opacity"
                >
                  <X :size="14" />
                </button>
              </div>
            </div>

            <p class="text-xs text-wedding-text-light mt-2 text-center">
              {{ selectedFiles.length }}장 선택됨
            </p>
          </div>
        </div>

        <!-- 사용자 정보 (선택사항) -->
        <div class="p-6 mb-6 rounded-2xl bg-white border border-wedding-border">
          <div class="space-y-4">
            <!-- 이름 -->
            <div class="space-y-2">
              <label for="photo-name" class="text-sm text-wedding-text-light">
                성함 <span class="text-wedding-text-light/60">(선택)</span>
              </label>
              <input
                id="photo-name"
                v-model="name"
                type="text"
                placeholder="홍길동"
                autocomplete="name"
                class="w-full px-4 py-3.5 rounded-xl border border-wedding-border
                       text-base text-wedding-text placeholder:text-wedding-text-light/50
                       bg-white focus:outline-none focus:border-wedding-primary
                       transition-colors"
              />
            </div>

            <!-- 연락처 -->
            <div class="space-y-2">
              <label for="photo-phone" class="text-sm text-wedding-text-light">
                연락처 <span class="text-wedding-text-light/60">(선택)</span>
              </label>
              <input
                id="photo-phone"
                :value="phone"
                @input="handlePhoneInput"
                type="tel"
                inputmode="tel"
                placeholder="010-0000-0000"
                autocomplete="tel"
                class="w-full px-4 py-3.5 rounded-xl border border-wedding-border
                       text-base text-wedding-text placeholder:text-wedding-text-light/50
                       bg-white focus:outline-none focus:border-wedding-primary
                       transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- 개인정보 이용 안내 -->
        <div class="mb-6 p-4 rounded-xl bg-wedding-bg border border-wedding-border">
          <div class="flex items-start gap-2">
            <Info class="w-4 h-4 text-wedding-text-light mt-0.5 flex-shrink-0" />
            <div class="text-xs text-wedding-text-light leading-relaxed">
              <p class="font-medium text-wedding-text mb-1">개인정보 수집 및 이용 안내</p>
              <p class="mb-1">수집 항목: 성함, 연락처 (선택)</p>
              <p class="mb-1">수집 목적: 베스트 샷 당선자 연락</p>
              <p class="mb-2">보유 기간: 당선자 선정 완료 후 즉시 폐기</p>
              <p class="text-wedding-text-light/80">
                * 개인정보 입력은 선택사항이지만, 당선 시 연락이 되지 않으면
                다음 순위 당선자에게 상품이 전달될 수 있습니다.
              </p>
              <p class="text-wedding-text-light/80 mt-1">
                * 수집된 개인정보는 당선자 연락 외 어떠한 용도로도 사용되지 않으며,
                선정이 완료된 후 예외 없이 모두 폐기됩니다.
              </p>
            </div>
          </div>
        </div>

        <!-- 에러 메시지 -->
        <div
          v-if="error"
          class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center"
        >
          {{ error }}
        </div>

        <!-- 전체 진행률 바 -->
        <div v-if="isUploading" class="mb-4">
          <div class="flex justify-between text-xs text-wedding-text-light mb-1">
            <span>업로드 중...</span>
            <span>{{ totalProgress }}%</span>
          </div>
          <div class="h-2 bg-wedding-border rounded-full overflow-hidden">
            <div
              class="h-full bg-wedding-primary transition-all duration-300"
              :style="{ width: `${totalProgress}%` }"
            />
          </div>
        </div>

        <!-- 제출 버튼 -->
        <button
          @click="submitPhotos"
          :disabled="!canSubmit"
          class="w-full py-4 rounded-xl bg-wedding-primary text-white font-medium
                 flex items-center justify-center gap-2
                 hover:bg-wedding-secondary transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isUploading" class="w-5 h-5 animate-spin" />
          <Upload v-else class="w-5 h-5" />
          {{ isUploading ? '업로드 중...' : '사진 보내기' }}
        </button>
      </template>
    </div>
  </div>
</template>
