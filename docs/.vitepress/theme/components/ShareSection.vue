<script setup lang="ts">
import { ref } from 'vue'
import { Share2, MessageCircle, Copy, Check } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'

const copied = ref(false)

const weddingUrl = 'https://wedding.pet'
const shareTitle = '승현 ♥ 서영 결혼식에 초대합니다'
const shareText = `${shareTitle}\n\n2026년 4월 19일 일요일 오전 11시\n로프트가든344\n\n${weddingUrl}`

// SMS 공유
const shareViaSMS = () => {
  const body = encodeURIComponent(shareText)
  // iOS uses &body=, Android uses ?body=
  const ua = navigator.userAgent
  const separator = /iPhone|iPad|iPod/i.test(ua) ? '&' : '?'
  window.location.href = `sms:${separator}body=${body}`
}

// 카카오톡 공유 (카카오링크 URL scheme)
const shareViaKakao = () => {
  // 카카오톡 앱이 설치되어 있으면 앱으로, 아니면 웹으로 공유
  const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=javascript_key&ka=sdk/2.0.0&lcba=&validation_action=default&validation_params=%7B%22link_ver%22%3A%224.0%22%2C%22template_object%22%3A%7B%22object_type%22%3A%22feed%22%2C%22content%22%3A%7B%22title%22%3A%22${encodeURIComponent(shareTitle)}%22%2C%22description%22%3A%22${encodeURIComponent('2026년 4월 19일 일요일 오전 11시')}%22%2C%22link%22%3A%7B%22mobile_web_url%22%3A%22${encodeURIComponent(weddingUrl)}%22%2C%22web_url%22%3A%22${encodeURIComponent(weddingUrl)}%22%7D%7D%2C%22buttons%22%3A%5B%7B%22title%22%3A%22%EC%B2%AD%EC%B2%A9%EC%9E%A5%20%EB%B3%B4%EA%B8%B0%22%2C%22link%22%3A%7B%22mobile_web_url%22%3A%22${encodeURIComponent(weddingUrl)}%22%2C%22web_url%22%3A%22${encodeURIComponent(weddingUrl)}%22%7D%7D%5D%7D%7D`

  // 단순히 URL 복사 후 카카오톡 열기 방식으로 대체
  // 카카오 SDK 없이 가장 안정적인 방법
  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: '2026년 4월 19일 일요일 오전 11시\n로프트가든344',
      url: weddingUrl
    }).catch(() => {
      // 공유 취소 시 무시
    })
  } else {
    // 폴백: 링크 복사
    copyLink()
  }
}

// 링크 복사
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(weddingUrl)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // 폴백: textarea 사용
    const textArea = document.createElement('textarea')
    textArea.value = weddingUrl
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// 네이티브 공유 (Web Share API)
const canShare = typeof navigator !== 'undefined' && !!navigator.share
const nativeShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: '2026년 4월 19일 일요일 오전 11시\n로프트가든344',
        url: weddingUrl
      })
    } catch {
      // 공유 취소 시 무시
    }
  }
}
</script>

<template>
  <section class="py-12 px-6 text-center bg-white">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <SectionTitle title="Share" subtitle="소중한 분들에게 공유하기" />
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200, duration: 500 } }"
      class="flex justify-center gap-4 flex-wrap"
    >
      <!-- 카카오톡 / 공유하기 -->
      <button
        @click="canShare ? nativeShare() : shareViaKakao()"
        class="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] transition-colors min-w-[80px]"
      >
        <div class="w-10 h-10 rounded-full bg-[#3C1E1E] flex items-center justify-center">
          <MessageCircle class="w-5 h-5 text-[#FEE500]" />
        </div>
        <span class="text-xs text-[#3C1E1E] font-medium">{{ canShare ? '공유하기' : '카카오톡' }}</span>
      </button>

      <!-- 문자 -->
      <button
        @click="shareViaSMS"
        class="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500 hover:bg-green-600 transition-colors min-w-[80px]"
      >
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Share2 class="w-5 h-5 text-green-500" />
        </div>
        <span class="text-xs text-white font-medium">문자</span>
      </button>

      <!-- 링크 복사 -->
      <button
        @click="copyLink"
        class="flex flex-col items-center gap-2 p-4 rounded-xl bg-wedding-bg hover:bg-wedding-border/50 transition-colors min-w-[80px] border border-wedding-border"
      >
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-wedding-border">
          <Check v-if="copied" class="w-5 h-5 text-green-500" />
          <Copy v-else class="w-5 h-5 text-wedding-text" />
        </div>
        <span class="text-xs text-wedding-text font-medium">{{ copied ? '복사완료' : '링크복사' }}</span>
      </button>
    </div>

    <!-- 공유 URL 표시 -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :visibleOnce="{ opacity: 1, transition: { delay: 400, duration: 500 } }"
      class="mt-6 text-xs text-wedding-text-light"
    >
      {{ weddingUrl }}
    </div>
  </section>
</template>
