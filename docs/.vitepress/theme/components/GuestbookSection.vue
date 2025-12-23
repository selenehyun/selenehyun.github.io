<script setup lang="ts">
import { ref } from 'vue'
import { MessageCircleHeart, Send, Loader2, User } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'
import { useGuestbook } from '../composables/useGuestbook'

const { messages, isLoading, error, isSubmitting, addMessage, formatTime } = useGuestbook()

const name = ref('')
const message = ref('')
const showSuccess = ref(false)

const handleSubmit = async () => {
  const success = await addMessage(name.value, message.value)
  if (success) {
    name.value = ''
    message.value = ''
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
  }
}

// 메시지 글자수 제한
const maxMessageLength = 500
const maxNameLength = 20
</script>

<template>
  <section class="py-16 px-6 bg-wedding-bg">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Guestbook" subtitle="축하 메시지를 남겨주세요" />
    </div>

    <!-- 메시지 작성 폼 -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200, duration: 500 } }"
      class="max-w-md mx-auto mb-10"
    >
      <div class="bg-white rounded-2xl shadow-sm border border-wedding-border p-5">
        <!-- 이름 입력 -->
        <div class="mb-4">
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wedding-text-light" />
            <input
              v-model="name"
              type="text"
              placeholder="이름"
              :maxlength="maxNameLength"
              class="w-full pl-10 pr-4 py-3 text-sm border border-wedding-border rounded-xl
                     focus:outline-none focus:border-wedding-primary focus:ring-1 focus:ring-wedding-primary/20
                     placeholder:text-wedding-text-light/50 text-wedding-text"
            />
          </div>
          <p class="text-xs text-wedding-text-light mt-1 text-right">
            {{ name.length }}/{{ maxNameLength }}
          </p>
        </div>

        <!-- 메시지 입력 -->
        <div class="mb-4">
          <div class="relative">
            <MessageCircleHeart class="absolute left-3 top-3 w-4 h-4 text-wedding-text-light" />
            <textarea
              v-model="message"
              placeholder="축하 메시지를 남겨주세요..."
              :maxlength="maxMessageLength"
              rows="3"
              class="w-full pl-10 pr-4 py-3 text-sm border border-wedding-border rounded-xl resize-none
                     focus:outline-none focus:border-wedding-primary focus:ring-1 focus:ring-wedding-primary/20
                     placeholder:text-wedding-text-light/50 text-wedding-text"
            />
          </div>
          <p class="text-xs text-wedding-text-light mt-1 text-right">
            {{ message.length }}/{{ maxMessageLength }}
          </p>
        </div>

        <!-- 에러 메시지 -->
        <p v-if="error" class="text-red-500 text-xs mb-3 text-center">
          {{ error }}
        </p>

        <!-- 성공 메시지 -->
        <p v-if="showSuccess" class="text-green-600 text-xs mb-3 text-center">
          축하 메시지가 등록되었습니다!
        </p>

        <!-- 제출 버튼 -->
        <button
          @click="handleSubmit"
          :disabled="isSubmitting || !name.trim() || !message.trim()"
          class="w-full py-3 px-4 bg-wedding-primary text-white text-sm font-medium rounded-xl
                 hover:bg-wedding-primary/90 transition-colors duration-200
                 disabled:bg-wedding-border disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Send v-else class="w-4 h-4" />
          {{ isSubmitting ? '등록 중...' : '메시지 남기기' }}
        </button>
      </div>
    </div>

    <!-- 메시지 목록 -->
    <div class="max-w-md mx-auto">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <Loader2 class="w-6 h-6 animate-spin text-wedding-primary" />
      </div>

      <!-- 메시지가 없을 때 -->
      <div
        v-else-if="messages.length === 0"
        class="text-center py-10 text-wedding-text-light text-sm"
      >
        <MessageCircleHeart class="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>아직 축하 메시지가 없습니다.</p>
        <p class="text-xs mt-1">첫 번째 축하 메시지를 남겨주세요!</p>
      </div>

      <!-- 메시지 목록 -->
      <div v-else class="space-y-4">
        <div
          v-for="(msg, index) in messages"
          :key="msg.id"
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :visibleOnce="{ opacity: 1, y: 0, transition: { delay: index * 50, duration: 300 } }"
          class="bg-white rounded-xl p-4 shadow-sm border border-wedding-border"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-wedding-primary/10 flex items-center justify-center">
                <span class="text-wedding-primary text-sm font-medium">
                  {{ msg.name.charAt(0) }}
                </span>
              </div>
              <span class="text-sm font-medium text-wedding-text">{{ msg.name }}</span>
            </div>
            <span class="text-xs text-wedding-text-light">{{ formatTime(msg.createdAt) }}</span>
          </div>
          <p class="text-sm text-wedding-text leading-relaxed pl-10 break-keep">
            {{ msg.message }}
          </p>
        </div>
      </div>

      <!-- 메시지 개수 표시 -->
      <p
        v-if="messages.length > 0"
        class="text-center text-xs text-wedding-text-light mt-6"
      >
        총 {{ messages.length }}개의 축하 메시지
      </p>
    </div>
  </section>
</template>
