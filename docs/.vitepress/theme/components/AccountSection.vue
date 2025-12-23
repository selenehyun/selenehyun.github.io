<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown, Copy, Check } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'

const groomOpen = ref(false)
const brideOpen = ref(false)
const copiedId = ref<string | null>(null)

const accounts = {
  groom: [
    { name: '신랑 강승현', bank: '은행명', number: '000-000-000000' },
    { name: '아버지 임민석', bank: '은행명', number: '000-000-000000' },
    { name: '어머니 은서연', bank: '은행명', number: '000-000-000000' },
  ],
  bride: [
    { name: '신부 장서영', bank: '은행명', number: '000-000-000000' },
    { name: '아버지 장문하', bank: '은행명', number: '000-000-000000' },
    { name: '어머니 최성희', bank: '은행명', number: '000-000-000000' },
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
  <section class="py-16 px-6 text-center bg-wedding-bg">
    <SectionTitle title="Account" subtitle="마음 전하실 곳" />

    <!-- Groom Accounts -->
    <div class="mb-3">
      <button
        @click="groomOpen = !groomOpen"
        class="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-lg text-sm text-wedding-text hover:bg-white/80 transition-colors"
      >
        <span class="font-medium">신랑측 계좌번호</span>
        <ChevronDown
          :class="['w-4 h-4 text-wedding-text-light transition-transform duration-200', groomOpen && 'rotate-180']"
        />
      </button>

      <div
        v-show="groomOpen"
        class="mt-2 space-y-2"
      >
        <div
          v-for="account in accounts.groom"
          :key="account.number"
          class="bg-white rounded-lg p-4"
        >
          <p class="text-[13px] text-wedding-text mb-1">{{ account.name }}</p>
          <p class="text-sm text-wedding-text-light">
            {{ account.bank }} <span class="font-mono">{{ account.number }}</span>
          </p>
          <button
            @click="copyToClipboard(account.number, `groom-${account.number}`)"
            class="mt-3 px-4 py-1.5 text-xs border border-wedding-border rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200 inline-flex items-center gap-1"
          >
            <template v-if="copiedId === `groom-${account.number}`">
              <Check class="w-3 h-3" />
              복사완료
            </template>
            <template v-else>
              <Copy class="w-3 h-3" />
              복사하기
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Bride Accounts -->
    <div>
      <button
        @click="brideOpen = !brideOpen"
        class="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-lg text-sm text-wedding-text hover:bg-white/80 transition-colors"
      >
        <span class="font-medium">신부측 계좌번호</span>
        <ChevronDown
          :class="['w-4 h-4 text-wedding-text-light transition-transform duration-200', brideOpen && 'rotate-180']"
        />
      </button>

      <div
        v-show="brideOpen"
        class="mt-2 space-y-2"
      >
        <div
          v-for="account in accounts.bride"
          :key="account.number"
          class="bg-white rounded-lg p-4"
        >
          <p class="text-[13px] text-wedding-text mb-1">{{ account.name }}</p>
          <p class="text-sm text-wedding-text-light">
            {{ account.bank }} <span class="font-mono">{{ account.number }}</span>
          </p>
          <button
            @click="copyToClipboard(account.number, `bride-${account.number}`)"
            class="mt-3 px-4 py-1.5 text-xs border border-wedding-border rounded-full hover:bg-wedding-primary hover:text-white hover:border-wedding-primary transition-all duration-200 inline-flex items-center gap-1"
          >
            <template v-if="copiedId === `bride-${account.number}`">
              <Check class="w-3 h-3" />
              복사완료
            </template>
            <template v-else>
              <Copy class="w-3 h-3" />
              복사하기
            </template>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
