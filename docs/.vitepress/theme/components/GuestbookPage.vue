<script setup lang="ts">
import { ref } from 'vue'
import { MessageCircleHeart, Send, Loader2, ArrowLeft } from 'lucide-vue-next'
import Input from './ui/Input.vue'
import Textarea from './ui/Textarea.vue'
import Button from './ui/Button.vue'
import Card from './ui/Card.vue'
import Label from './ui/Label.vue'
import { useGuestbook } from '../composables/useGuestbook'

const { messages, isLoading, error, isSubmitting, addMessage, formatTime } = useGuestbook()

const name = ref('')
const message = ref('')
const showSuccess = ref(false)

// Input refs for focus and animation
const nameInputRef = ref<InstanceType<typeof Input> | null>(null)
const messageInputRef = ref<InstanceType<typeof Textarea> | null>(null)
const shakeNameInput = ref(false)
const shakeMessageInput = ref(false)

const triggerShake = (target: 'name' | 'message') => {
  if (target === 'name') {
    shakeNameInput.value = true
    ;(nameInputRef.value?.$el as HTMLInputElement)?.focus()
    setTimeout(() => {
      shakeNameInput.value = false
    }, 500)
  } else {
    shakeMessageInput.value = true
    ;(messageInputRef.value?.$el as HTMLTextAreaElement)?.focus()
    setTimeout(() => {
      shakeMessageInput.value = false
    }, 500)
  }
}

const handleSubmit = async () => {
  if (!name.value.trim()) {
    triggerShake('name')
    return
  }
  if (!message.value.trim()) {
    triggerShake('message')
    return
  }

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

const maxMessageLength = 500
const maxNameLength = 20
</script>

<template>
  <div class="min-h-screen bg-wedding-bg">
    <div class="max-w-md mx-auto px-4 py-8">
      <!-- 헤더 -->
      <div class="flex items-center gap-4 mb-8">
        <a
          href="/"
          class="w-10 h-10 rounded-full bg-white border border-wedding-border flex items-center justify-center text-wedding-text hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200"
        >
          <ArrowLeft :size="18" />
        </a>
        <div>
          <h1 class="text-xl font-medium text-wedding-text">방명록</h1>
          <div class="text-sm text-wedding-text-light">축하 메시지를 남겨주세요</div>
        </div>
      </div>

      <!-- 메시지 작성 폼 -->
      <Card class="p-6 mb-8">
        <div class="space-y-2 mb-5">
          <Label for="guestbook-name" class="text-wedding-text-light">이름</Label>
          <Input
            id="guestbook-name"
            ref="nameInputRef"
            v-model="name"
            type="text"
            placeholder="이름을 입력해주세요"
            :maxlength="maxNameLength"
            :error="shakeNameInput"
            :class="{ 'animate-shake': shakeNameInput }"
          />
          <div class="text-xs text-wedding-text-light text-right">
            {{ name.length }}/{{ maxNameLength }}
          </div>
        </div>

        <div class="space-y-2 mb-5">
          <Label for="guestbook-message" class="text-wedding-text-light">메시지</Label>
          <Textarea
            id="guestbook-message"
            ref="messageInputRef"
            v-model="message"
            placeholder="축하 메시지를 남겨주세요..."
            :maxlength="maxMessageLength"
            :error="shakeMessageInput"
            :class="{ 'animate-shake': shakeMessageInput }"
          />
          <div class="text-xs text-wedding-text-light text-right">
            {{ message.length }}/{{ maxMessageLength }}
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-xs mb-4 text-center">
          {{ error }}
        </div>

        <div v-if="showSuccess" class="text-green-600 text-xs mb-4 text-center">
          축하 메시지가 등록되었습니다!
        </div>

        <Button
          class="w-full"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Send v-else class="w-4 h-4" />
          {{ isSubmitting ? '등록 중...' : '메시지 남기기' }}
        </Button>
      </Card>

      <!-- 메시지 목록 -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <Loader2 class="w-6 h-6 animate-spin text-wedding-primary" />
      </div>

      <div
        v-else-if="messages.length === 0"
        class="text-center py-10 text-wedding-text-light text-sm"
      >
        <MessageCircleHeart class="w-10 h-10 mx-auto mb-3 opacity-30" />
        <div>아직 축하 메시지가 없습니다.</div>
        <div class="text-xs mt-1">첫 번째 축하 메시지를 남겨주세요!</div>
      </div>

      <div v-else class="space-y-4">
        <div class="text-sm text-wedding-text-light mb-4">
          총 {{ messages.length }}개의 축하 메시지
        </div>

        <Card
          v-for="msg in messages"
          :key="msg.id"
          class="p-4"
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
          <div class="text-sm text-wedding-text leading-relaxed pl-10 break-keep">
            {{ msg.message }}
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
