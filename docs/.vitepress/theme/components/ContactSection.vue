<script setup lang="ts">
import { Phone, MessageCircle } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'

const contacts = {
  groom: [
    { name: '신랑 승현', phone: '010-3007-4420' },
    { name: '아버지', phone: '010-0000-0000' },
    { name: '어머니', phone: '010-2618-4420' },
  ],
  bride: [
    { name: '신부 서영', phone: '010-7564-2687' },
    { name: '아버지', phone: '010-7566-9687' },
    { name: '어머니', phone: '010-2216-5630' },
  ]
}

const call = (phone: string) => {
  window.location.href = `tel:${phone}`
}

const sms = (phone: string) => {
  window.location.href = `sms:${phone}`
}
</script>

<template>
  <section class="py-16 px-6 text-center bg-white">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Contact" subtitle="연락하기" />
    </div>

    <!-- Contact Cards -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Groom Side -->
      <div
        v-motion
        :initial="{ opacity: 0, x: -30 }"
        :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 100, duration: 500 } }"
        class="bg-wedding-bg/50 rounded-lg p-4"
      >
        <p class="text-xs text-wedding-primary font-medium mb-4 tracking-wide">신랑측</p>
        <div class="space-y-4">
          <div
            v-for="(contact, index) in contacts.groom"
            :key="contact.phone"
            v-motion
            :initial="{ opacity: 0, y: 15 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200 + index * 100, duration: 400 } }"
            class="text-center"
          >
            <p class="text-[0.8125rem] text-wedding-text mb-2">{{ contact.name }}</p>
            <div class="flex justify-center gap-2">
              <button
                @click="call(contact.phone)"
                class="!w-8 !h-8 !p-0 !rounded-full !bg-white !border !border-solid !border-wedding-border flex items-center justify-center !text-wedding-text hover:!bg-wedding-primary hover:!border-wedding-primary hover:!text-white transition-all duration-200"
              >
                <Phone :size="14" />
              </button>
              <button
                @click="sms(contact.phone)"
                class="!w-8 !h-8 !p-0 !rounded-full !bg-white !border !border-solid !border-wedding-border flex items-center justify-center !text-wedding-text hover:!bg-wedding-primary hover:!border-wedding-primary hover:!text-white transition-all duration-200"
              >
                <MessageCircle :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bride Side -->
      <div
        v-motion
        :initial="{ opacity: 0, x: 30 }"
        :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 100, duration: 500 } }"
        class="bg-wedding-bg/50 rounded-lg p-4"
      >
        <p class="text-xs text-wedding-primary font-medium mb-4 tracking-wide">신부측</p>
        <div class="space-y-4">
          <div
            v-for="(contact, index) in contacts.bride"
            :key="contact.phone"
            v-motion
            :initial="{ opacity: 0, y: 15 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200 + index * 100, duration: 400 } }"
            class="text-center"
          >
            <p class="text-[0.8125rem] text-wedding-text mb-2">{{ contact.name }}</p>
            <div class="flex justify-center gap-2">
              <button
                @click="call(contact.phone)"
                class="!w-8 !h-8 !p-0 !rounded-full !bg-white !border !border-solid !border-wedding-border flex items-center justify-center !text-wedding-text hover:!bg-wedding-primary hover:!border-wedding-primary hover:!text-white transition-all duration-200"
              >
                <Phone :size="14" />
              </button>
              <button
                @click="sms(contact.phone)"
                class="!w-8 !h-8 !p-0 !rounded-full !bg-white !border !border-solid !border-wedding-border flex items-center justify-center !text-wedding-text hover:!bg-wedding-primary hover:!border-wedding-primary hover:!text-white transition-all duration-200"
              >
                <MessageCircle :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
