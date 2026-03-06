<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Share2, MessageCircle, Copy, Check } from 'lucide-vue-next'
import SectionTitle from './SectionTitle.vue'
import ToggleGroup from './ui/ToggleGroup.vue'
import ToggleGroupItem from './ui/ToggleGroupItem.vue'

declare global {
  interface Window {
    Kakao: any
  }
}

type ShareMode = 'default' | 'groom-parent' | 'bride-parent'

const copied = ref(false)
const shareMode = ref<ShareMode>('default')

const weddingDate = '2026년 4월 19일 일요일 오전 11시'
const weddingVenue = '로프트가든344 10층'

// Computed properties
const baseUrl = 'https://wedding.pet'

const queryString = computed(() => {
  if (shareMode.value === 'groom-parent') return '?from=groom-parent'
  if (shareMode.value === 'bride-parent') return '?from=bride-parent'
  return ''
})

const shareUrl = computed(() => {
  return `${baseUrl}${queryString.value}`
})

const rsvpUrl = computed(() => {
  return `${baseUrl}/rsvp${queryString.value}`
})

const shareTitle = computed(() => {
  if (shareMode.value === 'groom-parent') return '우리 아들 승현의 결혼식에 초대합니다'
  if (shareMode.value === 'bride-parent') return '우리 딸 서영의 결혼식에 초대합니다'
  return '승현 ♥ 서영 결혼식에 초대합니다'
})

// 카카오톡용 (줄바꿈 대신 구분자)
const kakaoDescription = `${weddingDate} | ${weddingVenue}`

// SMS/Web Share용 (줄바꿈 포함)
const shareText = computed(() => {
  return `${shareTitle.value}\n\n${weddingDate}\n${weddingVenue}\n\n${shareUrl.value}`
})

// 카카오 SDK 키 (환경변수 또는 직접 입력)
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY || ''

// 카카오 SDK 로드 및 초기화
const loadKakaoSDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 키가 없으면 실패
    if (!KAKAO_JS_KEY) {
      console.warn('Kakao JS Key is not set')
      resolve(false)
      return
    }

    // 이미 초기화되어 있으면 성공
    if (window.Kakao?.isInitialized()) {
      resolve(true)
      return
    }

    // 이미 로드되어 있지만 초기화 안된 경우
    if (window.Kakao) {
      try {
        window.Kakao.init(KAKAO_JS_KEY)
        resolve(window.Kakao.isInitialized())
      } catch (e) {
        console.error('Kakao init error:', e)
        resolve(false)
      }
      return
    }

    // SDK 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      try {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_JS_KEY)
        }
        resolve(window.Kakao?.isInitialized() || false)
      } catch (e) {
        console.error('Kakao init error:', e)
        resolve(false)
      }
    }
    script.onerror = () => {
      console.error('Failed to load Kakao SDK')
      resolve(false)
    }
    document.head.appendChild(script)
  })
}

// 페이지 로드시 SDK 미리 로드
onMounted(() => {
  loadKakaoSDK()
})

// 카카오톡 공유 (SDK 사용)
const shareViaKakao = async () => {
  const isReady = await loadKakaoSDK()

  if (isReady && window.Kakao) {
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle.value,
          description: kakaoDescription,
          imageUrl: `${baseUrl}/gallary/intro.jpeg`,
          link: {
            mobileWebUrl: shareUrl.value,
            webUrl: shareUrl.value,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: shareUrl.value,
              webUrl: shareUrl.value,
            },
          },
          {
            title: '참석 여부 알리기',
            link: {
              mobileWebUrl: rsvpUrl.value,
              webUrl: rsvpUrl.value,
            },
          },
        ],
      })
    } catch (e) {
      console.error('Kakao share error:', e)
      fallbackShare()
    }
  } else {
    fallbackShare()
  }
}

// 폴백 공유
const fallbackShare = () => {
  if (navigator.share) {
    navigator.share({
      title: shareTitle.value,
      text: `${weddingDate}\n${weddingVenue}`,
      url: shareUrl.value
    }).catch(() => {})
  } else {
    copyLink()
  }
}

// SMS 공유
const shareViaSMS = () => {
  const body = encodeURIComponent(shareText.value)
  const ua = navigator.userAgent
  const separator = /iPhone|iPad|iPod/i.test(ua) ? '&' : '?'
  window.location.href = `sms:${separator}body=${body}`
}

// 링크 복사
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = shareUrl.value
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

    <!-- 공유 대상 선택 UI -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 100, duration: 500 } }"
      class="mb-6 flex flex-col gap-2 max-w-md mx-auto"
    >
      <p class="text-xs text-wedding-text-light mb-1">공유할 대상을 선택해주세요</p>
      <ToggleGroup
        v-model="shareMode"
        type="single"
        variant="outline"
        size="sm"
        class="w-full"
      >
        <ToggleGroupItem value="default" class="flex-1 min-w-fit text-xs sm:text-sm" aria-label="본인/지인용 공유 링크">
          본인/지인용
        </ToggleGroupItem>
        <ToggleGroupItem value="groom-parent" class="flex-1 min-w-fit text-xs sm:text-sm whitespace-nowrap" aria-label="신랑 부모님용 공유 링크">
          신랑 부모님용
        </ToggleGroupItem>
        <ToggleGroupItem value="bride-parent" class="flex-1 min-w-fit text-xs sm:text-sm whitespace-nowrap" aria-label="신부 부모님용 공유 링크">
          신부 부모님용
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 200, duration: 500 } }"
      class="flex justify-center gap-4 flex-wrap"
    >
      <!-- 카카오톡 -->
      <button
        @click="shareViaKakao"
        class="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] transition-colors min-w-[80px]"
      >
        <div class="w-10 h-10 rounded-full bg-[#3C1E1E] flex items-center justify-center">
          <MessageCircle class="w-5 h-5 text-[#FEE500]" />
        </div>
        <span class="text-xs text-[#3C1E1E] font-medium">카카오톡</span>
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

    <!-- 메시지 표시 -->
    <div
      v-motion
      :initial="{ opacity: 0 }"
      :visibleOnce="{ opacity: 1, transition: { delay: 400, duration: 500 } }"
      class="mt-6 text-xs text-wedding-text-light"
    >
      종이 및 모바일 청첩장은 모두 저희가 직접 만들었어요! 💐
    </div>
  </section>
</template>
