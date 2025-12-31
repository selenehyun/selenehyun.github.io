<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Copy, Check } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'
import Button from './ui/Button.vue'

const groomOpen = ref(false)
const brideOpen = ref(false)
const copiedId = ref<string | null>(null)

const accounts = {
  groom: [
    { name: '신랑 강승현', bank: '카카오뱅크', number: '3333153798521' },
  ],
  bride: [
    { name: '신부 장서영', bank: '하나은행', number: '10991093404207' },
    { name: '아버지 장문화', bank: '하나은행', number: '21891048062607' },
    { name: '어머니 최성희', bank: '국민은행', number: '44990101110656' },
  ]
}

const copyToClipboard = async (text: string, id: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copiedId.value = id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  }
}
</script>

<template>
  <section id="account" class="py-16 px-6 text-center bg-wedding-bg">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Account" subtitle="마음 전하실 곳" />
    </div>

    <!-- Groom Accounts -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 100, duration: 500 } }"
      class="mb-3"
    >
      <Button
        variant="ghost"
        @click="groomOpen = !groomOpen"
        class="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-lg text-sm text-wedding-text hover:bg-white/80"
      >
        <span class="font-medium">신랑측 계좌번호</span>
        <ChevronDown
          :class="['w-4 h-4 text-wedding-text-light transition-transform duration-200', groomOpen && 'rotate-180']"
        />
      </Button>

      <div
        v-show="groomOpen"
        class="mt-2 space-y-2"
      >
        <div
          v-for="account in accounts.groom"
          :key="account.number"
          class="bg-white rounded-lg p-4"
        >
          <p class="text-[0.8125rem] text-wedding-text mb-1">{{ account.name }}</p>
          <p class="text-sm text-wedding-text-light">
            {{ account.bank }} <span class="font-mono">{{ account.number }}</span>
          </p>
          <Button
            variant="outline"
            size="pill-sm"
            class="mt-3"
            @click="copyToClipboard(`${account.bank} ${account.number}`, `groom-${account.number}`)"
          >
            <template v-if="copiedId === `groom-${account.number}`">
              <Check class="w-3 h-3" />
              복사완료
            </template>
            <template v-else>
              <Copy class="w-3 h-3" />
              복사하기
            </template>
          </Button>
        </div>
      </div>
    </div>

    <!-- Bride Accounts -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200, duration: 500 } }"
    >
      <Button
        variant="ghost"
        @click="brideOpen = !brideOpen"
        class="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-lg text-sm text-wedding-text hover:bg-white/80"
      >
        <span class="font-medium">신부측 계좌번호</span>
        <ChevronDown
          :class="['w-4 h-4 text-wedding-text-light transition-transform duration-200', brideOpen && 'rotate-180']"
        />
      </Button>

      <div
        v-show="brideOpen"
        class="mt-2 space-y-2"
      >
        <div
          v-for="account in accounts.bride"
          :key="account.number"
          class="bg-white rounded-lg p-4"
        >
          <p class="text-[0.8125rem] text-wedding-text mb-1">{{ account.name }}</p>
          <p class="text-sm text-wedding-text-light">
            {{ account.bank }} <span class="font-mono">{{ account.number }}</span>
          </p>
          <Button
            variant="outline"
            size="pill-sm"
            class="mt-3"
            @click="copyToClipboard(`${account.bank} ${account.number}`, `bride-${account.number}`)"
          >
            <template v-if="copiedId === `bride-${account.number}`">
              <Check class="w-3 h-3" />
              복사완료
            </template>
            <template v-else>
              <Copy class="w-3 h-3" />
              복사하기
            </template>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
